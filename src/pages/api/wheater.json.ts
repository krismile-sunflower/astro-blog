import type { APIRoute } from "astro";
import puppeteer from "puppeteer";

export const GET: APIRoute = async ({ params, request }) => {
    const browser = await puppeteer.launch({
    });

    const page = await browser.newPage();

    await page.goto("https://tianqi.qq.com");

    await page.waitForSelector("#ct-current");

    const temperature = await page.$eval(
        "#txt-temperature",
        (el) => el.textContent,
    );
    const status = await page.$eval("#txt-name", (el) => el.textContent);
    const weather = await page.$eval(
        "#ct-aqi > .info-aqi",
        (el) => el.textContent,
    );
    const text = await page.$eval("#txt-tips", (el) => el.textContent);
    const wind = await page.$eval("#txt-wind", (el) => el.textContent);
    const humidity = await page.$eval("#txt-humidity", (el) => el.textContent);
    const address = await page.$eval(
        "#txt-cur-location",
        (el) => el.textContent,
    );
    return new Response(
        JSON.stringify(
            {
                address,
                temperature,
                status,
                weather,
                text,
                wind,
                humidity,
            },
            null,
            2,
        ),
        {
            headers: {
                "Content-Type": "application/json",
            },
            status: 200,
        },
    );
};
