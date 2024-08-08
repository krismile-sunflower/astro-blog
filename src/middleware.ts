import { defineMiddleware, sequence } from "astro:middleware";

const test = defineMiddleware(async (context, next) => {
    console.log('中间件测试');
    // 拦截一个请求里的数据
    // 可选地修改 `locals` 中的属性
    context.locals.title = "New title";

    // 返回一个 Response 或者调用 `next()` 的结果
    return next();
});

const auth = defineMiddleware(async (context, next) => {
    console.log('认证校验');
    
    // 拦截一个请求里的数据
    // 可选地修改 `locals` 中的属性
    context.locals.title = "New title";

    // 返回一个 Response 或者调用 `next()` 的结果
    return next();
});

const greeting = defineMiddleware(async (context, next) => {
    console.log('问候');
    
    // 拦截一个请求里的数据
    // 可选地修改 `locals` 中的属性
    context.locals.title = "New title";

    // 返回一个 Response 或者调用 `next()` 的结果
    return next();
});

const getPathName = defineMiddleware(async (context, next) => {
    context.locals.pathname = context.url.pathname;
    // 返回一个 Response 或者调用 `next()` 的结果
    return next();
});

export const onRequest = sequence(test, auth, greeting, getPathName);