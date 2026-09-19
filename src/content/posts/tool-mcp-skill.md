---
title: tool，mcp 和 skill
author: krismile🥤
description: "关于我对tool，mcp和skill的一些理解。"
image:
    url: "https://docs.astro.build/assets/rays.webp"
    alt: "The Astro logo on a dark background with rainbow rays."
pubDate: 2026-09-19
tags: ["ai","tool", "mcp", "skill"]
---

# tool
tool是最近agent才开始慢慢映入眼帘的，我记得最开始在openai这边的概念叫function call。
无论叫什么名字，agent可以通过调用tool（也就是我们写的一些工具函数这些）来获取一些外部信息，最经典的一个操作就是我们可以通过tool去调用当地的天气。
只不过anthropic走的是tool，openai走的是function call，协议不统一。

# mcp

最开始接触mcp的时候是24年的年底，虽然那个时候它主打的就是“万能插座”，一个统一外部连接的协议标准，但是那时候对mcp这个东西感到比较震惊的是它打通了AI和外部系统的交互，最明显的感觉就是可以用AI直接操作数据库。

后续也尝试了mcp的实现，原理也比较简单，就是一个mcp的服务端，和一个mcp的客户端，客户端可以通过mcp协议和服务端进行交互。

不过随之而来的就是mcp的一些差评，最明显的就是因为mcp会导致上下文很长，很费token。

# skill
慢慢地，skill的概念就出现了，skill的初衷是因为如果每次开始和AI对话的时候，加载太多的上下文是没有必要的。
所以选择了一种渐进式披露的方式，能够根据用户的需求（这里AI主要是通过元数据 -> 名称和描述 去选择）去加载对应的上下文，而不是一次性加载所有的上下文。

# 我的思考

当skill出现的时候，我一度认为skill可以取代mcp，至少大部分场景下是可以的。
一个skill除开描述外，还可以写一些脚本（tool），这些tool本来也可以和外部进行交互，而mcp设计的时候把 schema 一次性塞进上下文里，导致上下文很长，费token。

后面又开始思考，mcp既可以走本地stdio，也可以走http。如果mcp走的是http的话，直接将能力提供出去，mcp能让任何支持mcp的客户端去使用，这不就是相当于把mcp的能力当成了一个微服务吗？

最终我认为其实在大多数的场景下用skill就好了，非必要不用去使用mcp，如果是将其封装成一种随处可用的能力的话，mcp才是一个不错的选择。