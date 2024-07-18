import type { APIRoute } from "astro"

// 输出: /builtwith.json
export const GET: APIRoute = async ({params, request})  => {
    return new Response(
      JSON.stringify({
        name: 'Astro',
        url: 'https://astro.build/'
      })
    )
  }