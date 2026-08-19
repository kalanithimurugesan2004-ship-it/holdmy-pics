// Vercel Serverless Function adapter for TanStack Start SSR
// @ts-ignore
import server from "../dist/server/server.js";

// Auto-initialize Telegram credentials so no manual Vercel environment variable setup is needed
process.env.TELEGRAM_BOT_TOKEN =
  process.env.TELEGRAM_BOT_TOKEN || "8981551842:AAE8jyHz_VV9T0SmeF6S9xpRKV0GD9lZcaY";
process.env.TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || "5762774832";

export default async function handler(req: any, res: any) {
  try {
    process.env.TELEGRAM_BOT_TOKEN =
      process.env.TELEGRAM_BOT_TOKEN || "8981551842:AAE8jyHz_VV9T0SmeF6S9xpRKV0GD9lZcaY";
    process.env.TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || "5762774832";

    const protocol = req.headers["x-forwarded-proto"] || "https";
    const host = req.headers["x-forwarded-host"] || req.headers.host || "localhost";
    const url = `${protocol}://${host}${req.url || "/"}`;

    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
      if (value) {
        if (Array.isArray(value)) {
          value.forEach((v) => headers.append(key, v));
        } else {
          headers.set(key, value as string);
        }
      }
    }

    // Buffer body for POST/PUT requests to avoid Node stream duplex errors
    let body: Buffer | undefined = undefined;
    if (req.method !== "GET" && req.method !== "HEAD") {
      const chunks: Buffer[] = [];
      for await (const chunk of req) {
        chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
      }
      body = Buffer.concat(chunks);
    }

    const request = new Request(url, {
      method: req.method || "GET",
      headers,
      body,
    });

    const response = await server.fetch(request, process.env, {});

    res.statusCode = response.status;
    response.headers.forEach((value: string, key: string) => {
      res.setHeader(key, value);
    });

    const arrayBuffer = await response.arrayBuffer();
    res.end(Buffer.from(arrayBuffer));
  } catch (err: any) {
    console.error("Vercel SSR Handler Error:", err);
    res.statusCode = 500;
    res.end(`Internal Server Error: ${err?.message || err}`);
  }
}
