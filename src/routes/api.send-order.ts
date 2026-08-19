import { createFileRoute } from "@tanstack/react-router";

// Telegram bots can upload files up to 50 MB — stay slightly under.
const MAX_FILE_BYTES = 48 * 1024 * 1024;
const MAX_PHOTOS_PER_REQUEST = 10;

// fetch with retry on Telegram flood limits (429 + retry_after seconds).
const tgFetch = async (url: string, init: RequestInit): Promise<Response> => {
  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await fetch(url, init);
    if (res.status !== 429) return res;
    const body = (await res.json().catch(() => null)) as {
      parameters?: { retry_after?: number };
    } | null;
    const waitMs = Math.min(30, body?.parameters?.retry_after ?? 3) * 1000;
    await new Promise((r) => setTimeout(r, waitMs));
  }
  return fetch(url, init);
};

// Robust check for File / Blob objects across all Node serverless runtimes
const isUploadFile = (v: unknown): v is File => {
  if (!v || typeof v !== "object") return false;
  const f = v as any;
  return typeof f.size === "number" && f.size > 0 && typeof f.arrayBuffer === "function";
};

export const Route = createFileRoute("/api/send-order")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const token =
          process.env.TELEGRAM_BOT_TOKEN || "8981551842:AAE8jyHz_VV9T0SmeF6S9xpRKV0GD9lZcaY";
        const chatId = process.env.TELEGRAM_CHAT_ID || "5762774832";
        if (!token || !chatId) {
          return Response.json(
            { ok: false, error: "Photo delivery is not configured yet." },
            { status: 503 },
          );
        }

        const form = await request.formData();
        const text = (field: string) => {
          const v = form.get(field);
          return typeof v === "string" ? v : "";
        };
        const summary = text("summary");
        const ref = text("ref");
        const start = Math.max(1, Number(text("start")) || 1);
        const count = Math.max(0, Number(text("count")) || 0);

        const photos = form
          .getAll("photos")
          .filter(isUploadFile)
          .slice(0, MAX_PHOTOS_PER_REQUEST);

        const paymentField = form.get("payment");
        const payment =
          isUploadFile(paymentField) && paymentField.size <= MAX_FILE_BYTES
            ? paymentField
            : null;

        if (!summary && photos.length === 0 && !payment) {
          return Response.json({ ok: false, error: "Nothing to send." }, { status: 400 });
        }

        const api = `https://api.telegram.org/bot${token}`;
        const fail = (what: string, status: number, detail: string, sent: number) => {
          console.error(`Telegram ${what} failed`, status, detail);
          return Response.json(
            { ok: false, error: "Failed while sending. Please try again.", sent },
            { status: 502 },
          );
        };

        if (summary) {
          const res = await tgFetch(`${api}/sendMessage`, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ chat_id: chatId, text: summary }),
          });
          if (!res.ok) return fail("sendMessage", res.status, await res.text().catch(() => ""), 0);
        }

        let sent = 0;
        const skipped: string[] = [];
        const sendable = photos.filter((p) => {
          if (p.size > MAX_FILE_BYTES) {
            skipped.push(p.name);
            return false;
          }
          return true;
        });

        const caption = (i: number) =>
          `${ref ? `${ref} · ` : ""}photo ${start + i}${count ? `/${count}` : ""}`;

        if (sendable.length === 1) {
          const p = sendable[0];
          const fd = new FormData();
          fd.append("chat_id", chatId);
          fd.append("caption", caption(0));
          fd.append("photo", p, p.name || `photo-${start}.jpg`);

          let res = await tgFetch(`${api}/sendPhoto`, { method: "POST", body: fd });
          if (!res.ok) {
            const fdDoc = new FormData();
            fdDoc.append("chat_id", chatId);
            fdDoc.append("caption", caption(0));
            fdDoc.append("document", p, p.name || `photo-${start}.jpg`);
            res = await tgFetch(`${api}/sendDocument`, { method: "POST", body: fdDoc });
          }

          if (!res.ok)
            return fail("sendPhoto/sendDocument", res.status, await res.text().catch(() => ""), sent);
          sent += 1;
        } else if (sendable.length > 1) {
          const fd = new FormData();
          fd.append("chat_id", chatId);
          fd.append(
            "media",
            JSON.stringify(
              sendable.map((p, i) => ({
                type: "photo",
                media: `attach://photo${i}`,
                caption: caption(i),
              })),
            ),
          );
          sendable.forEach((p, i) => fd.append(`photo${i}`, p, p.name || `photo-${start + i}.jpg`));

          let res = await tgFetch(`${api}/sendMediaGroup`, { method: "POST", body: fd });
          if (!res.ok) {
            // Fallback to document media group
            const fdDoc = new FormData();
            fdDoc.append("chat_id", chatId);
            fdDoc.append(
              "media",
              JSON.stringify(
                sendable.map((p, i) => ({
                  type: "document",
                  media: `attach://photo${i}`,
                  caption: caption(i),
                })),
              ),
            );
            sendable.forEach((p, i) => fdDoc.append(`photo${i}`, p, p.name || `photo-${start + i}.jpg`));
            res = await tgFetch(`${api}/sendMediaGroup`, { method: "POST", body: fdDoc });
          }

          if (!res.ok)
            return fail("sendMediaGroup", res.status, await res.text().catch(() => ""), sent);
          sent += sendable.length;
        }

        if (payment) {
          const fd = new FormData();
          fd.append("chat_id", chatId);
          fd.append("caption", `${ref ? `${ref} · ` : ""}💳 payment screenshot`);
          fd.append("photo", payment, payment.name || "payment-screenshot.jpg");

          let res = await tgFetch(`${api}/sendPhoto`, { method: "POST", body: fd });
          if (!res.ok) {
            const fdDoc = new FormData();
            fdDoc.append("chat_id", chatId);
            fdDoc.append("caption", `${ref ? `${ref} · ` : ""}💳 payment screenshot`);
            fdDoc.append("document", payment, payment.name || "payment-screenshot.jpg");
            res = await tgFetch(`${api}/sendDocument`, { method: "POST", body: fdDoc });
          }

          if (!res.ok)
            return fail("sendPhoto (payment)", res.status, await res.text().catch(() => ""), sent);
          sent += 1;
        }

        return Response.json({ ok: true, sent, skipped });
      },
    },
  },
});
