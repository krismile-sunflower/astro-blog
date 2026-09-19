---
title: 使用 LangChain 构建一个最小 RAG Demo
author: krismile🥤
description: "从文档切分、向量检索到基于上下文生成回答，快速理解 RAG 的基本流程。"
image:
    url: "https://docs.astro.build/assets/rays.webp"
    alt: "The Astro logo on a dark background with rainbow rays."
pubDate: 2026-08-10
tags: ["ai", "rag", "langchain"]
---

# RAG 的基本流程

RAG（Retrieval-Augmented Generation，检索增强生成）会先从知识库中找出与问题最相关的内容，再把这些内容交给大语言模型生成回答。与直接让模型回答相比，这种方式可以让回答更贴近自己的业务文档，也更容易追溯依据。

一个最小的 RAG 流程可以拆成四步：

1. 读取文档并切分为多个片段。
2. 为文档片段生成向量。
3. 将用户问题向量化，并检索最相似的片段。
4. 把检索结果作为上下文交给模型回答。

下面的示例使用 LangChain 的文本切分器、Embedding 模型和 Chat 模型。`config` 中的配置项可以替换成你使用的模型服务。

## 1. 切分知识库文档

先读取知识库文件，再把长文档切成长度适中的片段。`chunkOverlap` 可以保留相邻片段之间的上下文，减少关键信息刚好被切断的情况。

```ts
const knowledgePath = path.resolve("knowledge.txt");
const knowledge = fs.readFileSync(knowledgePath, "utf8");
const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 80,
});
const chunks = await splitter.splitText(knowledge);
```

## 2. 生成向量并检索

Embedding 模型会把文本转换成向量。查询时，先将用户问题转换成向量，再通过余弦相似度比较问题向量和文档向量，最后取相似度最高的三个片段。

```ts
const clientConfig = {
    baseURL: config.baseURL,
    apiKey: config.apiKey,
};
const embeddings = new OpenAIEmbeddings({
    model: config.embeddingModel,
    encodingFormat: "float",
    configuration: clientConfig,
});
const vectors = await embeddings.embedDocuments(chunks);
const queryVector = await embeddings.embedQuery(config.query);
const results: SearchResult[] = chunks
    .map((text, index) => ({
        text,
        score: cosineSimilarity(queryVector, vectors[index]),
    }))
    .sort((left, right) => right.score - left.score)
    .slice(0, 3);
```

为了交给模型使用，需要把检索结果拼接成一段上下文：

```ts
const context = results
    .map((result, index) => `片段 ${index + 1}：\n${result.text}`)
    .join("\n\n");
```

## 3. 基于上下文生成回答

最后调用 Chat 模型。系统提示词需要明确限定回答范围：模型只能使用检索到的上下文；如果上下文中没有答案，就直接说明信息不足，避免编造。

```ts
const llm = new ChatOpenAI({
    model: config.chatModel,
    temperature: 0,
    configuration: clientConfig,
});
const response = await llm.invoke([
    [
        "system",
        "你是企业员工手册问答助手。只能依据提供的知识库上下文回答；如果上下文没有答案，请明确说知识库中没有相关信息，不要编造。",
    ],
    [
        "human",
        `知识库上下文：
${context}

用户问题：${config.query}

请用简洁中文回答，并在答案末尾注明依据的章节。`,
    ],
]);
```

