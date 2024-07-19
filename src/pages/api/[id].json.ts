import type { APIRoute } from 'astro';

const usernames = ["张三", "李四", "王五"]

export const GET: APIRoute = ({ params, request }) => {
  console.log("🚀 ~ request:", request)
  const id = (params.id ?? 0) as number;
  return new Response(
    JSON.stringify({
      name: usernames[id]
    })
  )
};

export function getStaticPaths () {
    return [
        { params: { id: "0"} },
        { params: { id: "1"} },
        { params: { id: "2"} },
    ]
}