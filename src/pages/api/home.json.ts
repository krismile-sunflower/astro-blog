import type { APIRoute } from "astro";

export const GET: APIRoute = ({ params, request }) => {
    console.log("🚀 ~ request:", request);
    const id = (params.id ?? 0) as number;
    return new Response(
        JSON.stringify({
            one: "今日江头两三树",
            two: "可怜和叶度残春",
        }),
    );
};
