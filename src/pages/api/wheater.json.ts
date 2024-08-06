import type { APIRoute } from "astro";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium-min";

const localExecutablePath =
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

const remoteExecutablePath =
  "https://github.com/Sparticuz/chromium/releases/download/v126.0.0/chromium-v126.0.0-pack.tar";

export const GET: APIRoute = async ({ params, request }) => {
  const isDev = process.env.NODE_ENV === "development";
  if (isDev) {
    const browser = await puppeteer.launch({
      args: isDev ? [] : chromium.args,
      executablePath: isDev
        ? localExecutablePath
        : await chromium.executablePath(remoteExecutablePath),
    });
  
    const page = await browser.newPage();
  
    await page.goto("https://tianqi.qq.com");
  
    await page.waitForSelector("#ct-current");
  
    const temperature = await page.$eval(
      "#txt-temperature",
      (el) => el.textContent
    );
    const status = await page.$eval("#txt-name", (el) => el.textContent);
    const weather = await page.$eval(
      "#ct-aqi > .info-aqi",
      (el) => el.textContent
    );
    const text = await page.$eval("#txt-tips", (el) => el.textContent);
    const wind = await page.$eval("#txt-wind", (el) => el.textContent);
    const humidity = await page.$eval("#txt-humidity", (el) => el.textContent);
    const address = await page.$eval("#txt-cur-location", (el) => el.textContent);
  
    await browser.close();
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
        2
      ),
      {
        headers: {
          "Content-Type": "application/json",
        },
        status: 200,
      }
    );
    
  } else {
    return new Response(
      JSON.stringify(
        {},
        null,
        2
      ),
      {
        headers: {
          "Content-Type": "application/json",
        },
        status: 200,
      })
  }
};
