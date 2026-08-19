import { useEffect, useMemo, useRef, useState } from "react";
import { Minus, Plus, Upload, X, MessageCircle, Copy, Check, Paperclip } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";

const UPI_ID = "7010249422@ptsbi";
const UPI_NAME = "Hold My Pics";

const MAX_PHOTOS = 100;
// Photos are delivered to Telegram in albums of at most 10 documents.
const UPLOAD_BATCH_SIZE = 10;

const PHOTOS_PER_STRIP = 4;

// How many photos one unit of a tier covers, for photo-count based products.
const tierCapacity = (typeId: string, label: string): number | null => {
  if (typeId === "polaroid" || typeId === "sticker") {
    const m = label.match(/^(\d+)\s+(?:Photos?|Pics?)/i);
    return m ? Number(m[1]) : null;
  }
  if (typeId === "poster") {
    const m = label.match(/(\d+)\s*Pic/i);
    return m ? Number(m[1]) : null;
  }
  if (typeId === "strip") {
    const m = label.match(/^(\d+)\s+Strips?/i);
    return m ? Number(m[1]) * PHOTOS_PER_STRIP : null;
  }
  return null;
};

type ComboItem = { tierIdx: number; qty: number };

// Cheapest combination of packs that covers `count` photos, so bulk
// discounts apply (e.g. 7 poster pics -> 3 x "A4 – 2 Pic" + 1 x "A4 – 1 Pic").
const fitCombo = (
  t: (typeof types)[number],
  count: number,
  allow?: (label: string) => boolean,
): ComboItem[] | null => {
  const opts: { idx: number; cap: number; price: number }[] = [];
  for (let i = 0; i < t.tiers.length; i++) {
    if (allow && !allow(t.tiers[i].label)) continue;
    const cap = tierCapacity(t.id, t.tiers[i].label);
    if (cap) opts.push({ idx: i, cap, price: t.tiers[i].price });
  }
  if (opts.length === 0) return null;

  // dp[i] = min cost to cover at least i photos; choice[i] = pack used.
  const dp = new Array<number>(count + 1).fill(Infinity);
  const choice = new Array<number>(count + 1).fill(-1);
  dp[0] = 0;
  for (let i = 1; i <= count; i++) {
    for (const o of opts) {
      const rest = Math.max(0, i - o.cap);
      if (dp[rest] + o.price < dp[i]) {
        dp[i] = dp[rest] + o.price;
        choice[i] = o.idx;
      }
    }
  }
  if (!Number.isFinite(dp[count])) return null;

  const counts = new Map<number, number>();
  for (let i = count; i > 0; ) {
    const idx = choice[i];
    counts.set(idx, (counts.get(idx) ?? 0) + 1);
    const cap = tierCapacity(t.id, t.tiers[idx].label) ?? count;
    i = Math.max(0, i - cap);
  }
  return [...counts.entries()]
    .map(([tierIdx, qty]) => ({ tierIdx, qty }))
    .sort((a, b) => a.tierIdx - b.tierIdx);
};

// Tiers mirror the printed menu (poster) plus the new add-on categories.
const types = [
  {
    id: "polaroid",
    name: "Polaroids",
    tiers: [
      { label: "10 Photos", price: 75 },
      { label: "15 Photos", price: 100 },
      { label: "25 Photos", price: 199 },
      { label: "50 Photos", price: 300 },
      { label: "75 Photos", price: 400 },
      { label: "100 Photos", price: 500 },
    ],
  },
  {
    id: "sticker",
    name: "Sticker Polaroids",
    tiers: [
      { label: "1 Pic", price: 10 },
      { label: "35 Pics", price: 300 },
    ],
  },
  {
    id: "poster",
    name: "Poster",
    tiers: [
      { label: "A4 – 1 Pic", price: 60 },
      { label: "A4 – 2 Pic", price: 100 },
      { label: "A3 – 1 Pic", price: 100 },
      { label: "A3 – 2 Pic", price: 180 },
    ],
  },
  {
    id: "strip",
    name: "Photo Strips",
    tiers: [
      { label: "1 Strip", price: 50 },
      { label: "3 Strips", price: 120 },
      { label: "5 Strips", price: 200 },
      { label: "8 Strips", price: 300 },
    ],
  },
  {
    id: "magazine",
    name: "Magazine",
    tiers: [
      { label: "8 Pages (Standard)", price: 300 },
      { label: "12 Pages", price: 380 },
      { label: "16 Pages", price: 450 },
      { label: "20 Pages", price: 520 },
      { label: "24 Pages", price: 590 },
    ],
  },
  {
    id: "fairy-lights",
    name: "Fairy Lights",
    tiers: [{ label: "10 Meter · Warm White", price: 159 }],
  },
  {
    id: "combo",
    name: "Combo Offers",
    tiers: [
      { label: "A4 Poster + 15 Polaroids", price: 150 },
      { label: "A3 Poster + 25 Polaroids", price: 299 },
      { label: "30 Polaroids + Fairy Lights", price: 300 },
      { label: "Couple Kit", price: 349 },
      { label: "50 Polaroids + 10m Lights", price: 399 },
      { label: "Birthday Kit", price: 499 },
    ],
  },
];

export function Customize() {
  const [typeIdx, setTypeIdx] = useState(0);
  const [tierIdx, setTierIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const [files, setFiles] = useState<File[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [payment, setPayment] = useState<File | null>(null);
  const [copied, setCopied] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  // Active pack combination (bulk-discount optimal); null = manual single pack.
  const [combo, setCombo] = useState<ComboItem[] | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const paymentInputRef = useRef<HTMLInputElement>(null);

  const type = types[typeIdx];
  const tier = type.tiers[tierIdx];
  const total = useMemo(
    () =>
      combo
        ? combo.reduce((sum, c) => sum + c.qty * type.tiers[c.tierIdx].price, 0)
        : tier.price * qty,
    [combo, type, tier, qty],
  );

  // Auto-fit the packs & quantity to the number of uploaded photos,
  // always picking the cheapest combination (bulk discounts apply).
  useEffect(() => {
    if (files.length === 0) {
      setCombo(null);
      return;
    }
    let fit: ComboItem[] | null = null;
    if (type.id === "polaroid" || type.id === "sticker" || type.id === "strip") {
      fit = fitCombo(type, files.length);
    } else if (type.id === "poster") {
      // Keep the customer's chosen paper size (A4/A3); only adjust pics & qty.
      const size = tier.label.split("–")[0].trim();
      fit = fitCombo(type, files.length, (label) => label.startsWith(size));
    }
    if (fit && fit.length === 1) {
      setTierIdx(fit[0].tierIdx);
      setQty(fit[0].qty);
      setCombo(null);
    } else if (fit) {
      setTierIdx(fit[0].tierIdx);
      setQty(1);
      setCombo(fit);
    } else {
      setCombo(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files.length, typeIdx]);

  // Human-readable label of what's selected (single pack or combination).
  const selectionLabel = combo
    ? combo.map((c) => `${c.qty} × ${type.tiers[c.tierIdx].label}`).join(" + ")
    : tier.label;

  // Warn when the selection covers fewer photos than were uploaded.
  const coverage = combo
    ? combo.reduce(
        (sum, c) => sum + c.qty * (tierCapacity(type.id, type.tiers[c.tierIdx].label) ?? 0),
        0,
      )
    : tierCapacity(type.id, tier.label) !== null
      ? (tierCapacity(type.id, tier.label) as number) * qty
      : null;
  const underCoverage = coverage !== null && files.length > coverage;

  const upiLink = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&am=${total}&cu=INR&tn=${encodeURIComponent("Hold My Pics order")}`;

  const copyUpiId = async () => {
    try {
      await navigator.clipboard.writeText(UPI_ID);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Couldn't copy — long-press the UPI ID instead.");
    }
  };

  const handleOrder = async (e: React.MouseEvent) => {
    e.preventDefault();

    const name = customerName.trim();
    const cleanPhone = customerPhone.replace(/\D/g, "").replace(/^91(?=\d{10}$)/, "");

    const baseMessage = `Hi Hold My Pics! ♡\n\nI'd like to order:\n• ${type.name} — ${selectionLabel}${combo ? "" : `\n• Qty: ${qty}`}\n• Estimated total: ₹${total}${name ? `\n• Name: ${name}` : ""}`;

    if (files.length === 0 && !payment) {
      window.open(
        `https://wa.me/917010249422?text=${encodeURIComponent(`${baseMessage}\n\nI'll share my photos here next.`)}`,
        "_blank",
      );
      return;
    }

    if (!name) {
      toast.error("Please enter your name", {
        description: "So we know who these photos belong to.",
      });
      return;
    }
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      toast.error("Please enter a valid 10-digit WhatsApp number", {
        description: "So we can reach you about your order.",
      });
      return;
    }

    // Short order reference so the WhatsApp chat can be matched to the photos.
    const ref = `HMP-${Date.now().toString(36).slice(-4).toUpperCase()}${Math.floor(Math.random() * 10)}`;
    const photoCount = `${files.length} photo${files.length > 1 ? "s" : ""}`;
    const sendingLabel =
      files.length > 0
        ? `your ${photoCount}${payment ? " + payment screenshot" : ""}`
        : "your payment screenshot";

    setIsUploading(true);
    const toastId = toast.loading(`Sending ${sendingLabel} in HD...`, {
      description: "Originals are delivered as uncompressed documents.",
    });

    try {
      const post = async (fd: FormData) => {
        const res = await fetch("/api/send-order", { method: "POST", body: fd });
        const json = (await res.json().catch(() => null)) as {
          ok?: boolean;
          error?: string;
        } | null;
        if (!res.ok || !json?.ok) {
          throw new Error(json?.error ?? `Upload failed (${res.status})`);
        }
      };

      // 1. Order summary message.
      const summaryFd = new FormData();
      summaryFd.append("ref", ref);
      summaryFd.append(
        "summary",
        `🛍 New order ${ref}\n👤 ${name} · +91 ${cleanPhone}\n• ${type.name} — ${selectionLabel}${combo ? "" : `\n• Qty: ${qty}`}\n• Total: ₹${total}\n💳 ${payment ? "Payment screenshot attached ↓" : "Payment screenshot not attached"}\n\n${files.length > 0 ? `${photoCount} incoming as HD documents ↓` : "No photos attached"}`,
      );
      await post(summaryFd);

      // 2. Photos in batches of 10 (delivered as Telegram document albums).
      for (let i = 0; i < files.length; i += UPLOAD_BATCH_SIZE) {
        const batch = files.slice(i, i + UPLOAD_BATCH_SIZE);
        toast.loading(
          `Sending photos ${i + 1}–${Math.min(i + batch.length, files.length)} of ${files.length}...`,
          { id: toastId, description: "Originals are delivered as uncompressed documents." },
        );
        const fd = new FormData();
        fd.append("ref", ref);
        fd.append("start", String(i + 1));
        fd.append("count", String(files.length));
        batch.forEach((f, j) => fd.append("photos", f, f.name || `photo-${i + j + 1}.jpg`));
        await post(fd);
      }

      // 3. Payment screenshot last.
      if (payment) {
        toast.loading("Sending payment screenshot...", { id: toastId });
        const fd = new FormData();
        fd.append("ref", ref);
        fd.append("payment", payment, payment.name || "payment-screenshot.jpg");
        await post(fd);
      }

      toast.success("Sent! Opening WhatsApp...", {
        id: toastId,
        description: "Send the WhatsApp message to confirm your order.",
      });

      const completeMessage = `${baseMessage}\n\nOrder ref: ${ref}\nI've already sent ${files.length > 0 ? `my ${photoCount} in original HD quality` : "everything"}${payment ? " and my payment screenshot" : ""} through the website. ✅`;
      const link = `https://wa.me/917010249422?text=${encodeURIComponent(completeMessage)}`;

      // Open WhatsApp only after the photos are delivered (within the user gesture via setTimeout 0)
      setTimeout(() => {
        window.open(link, "_blank");
      }, 0);
    } catch (error) {
      console.error(error);
      toast.error("Couldn't send your photos. Please try again.", {
        id: toastId,
        description:
          error instanceof Error ? error.message : "Check your internet connection and retry.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const previews = useMemo(
    () => files.map((f) => ({ name: f.name, url: URL.createObjectURL(f) })),
    [files],
  );

  const onPick = (list: FileList | null) => {
    if (!list) return;
    setFiles((prev) => {
      const next = [...prev, ...Array.from(list)].slice(0, MAX_PHOTOS);
      if (prev.length + list.length > MAX_PHOTOS) {
        toast.info(`Maximum ${MAX_PHOTOS} photos per order.`);
      }
      return next;
    });
  };

  return (
    <section
      id="customize"
      className="relative py-24 md:py-32 bg-soft-gradient grain overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
          <div>
            <p className="u-eyebrow mb-3">Customize</p>
            <h2 className="font-display text-4xl md:text-6xl font-light leading-[1.05] text-balance">
              Build your <em className="italic text-gradient">order.</em>
            </h2>
          </div>
          <p className="max-w-md text-foreground/60">
            Upload your pics, pick a format, see your total in real-time, then send it straight to
            us on WhatsApp.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Upload */}
          <div className="lg:col-span-3 rounded-[2rem] glass p-6 md:p-8 shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-2xl">Upload your photos</h3>
              <span className="text-xs text-foreground/50">
                {files.length}/{MAX_PHOTOS}
              </span>
            </div>

            <button
              onClick={() => inputRef.current?.click()}
              className="group w-full border-2 border-dashed border-primary/40 rounded-2xl p-8 grid place-items-center text-center hover:bg-primary/5 transition-colors"
            >
              <div className="grid h-14 w-14 place-items-center rounded-full bg-lavender-gradient text-primary-foreground shadow-soft mb-3 group-hover:scale-110 transition-transform">
                <Upload size={20} />
              </div>
              <p className="font-medium">Drop or click to upload</p>
              <p className="text-xs text-foreground/50 mt-1">
                JPG / PNG / HEIC · up to {MAX_PHOTOS} photos
              </p>
              <input
                ref={inputRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => onPick(e.target.files)}
              />
              {import.meta.env.DEV && (
                // span, not button — a nested <button> is invalid HTML and breaks hydration
                <span
                  id="mock-upload-btn"
                  role="button"
                  style={{ position: "absolute", opacity: 0, width: "1px", height: "1px" }}
                  onClick={async (e) => {
                    e.stopPropagation();
                    try {
                      const res = await fetch("/test-image.png");
                      const blob = await res.blob();
                      const file = new File([blob], "test-image.png", { type: "image/png" });
                      setFiles((prev) => [...prev, file].slice(0, MAX_PHOTOS));
                      toast.success("Mock photo loaded for testing");
                    } catch (err) {
                      console.error("Mock upload failed", err);
                      toast.error("Failed to load mock photo");
                    }
                  }}
                />
              )}
            </button>

            {previews.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-5">
                {previews.map((p, i) => (
                  <div
                    key={i}
                    className="relative aspect-square rounded-xl overflow-hidden polaroid !p-1 !pb-1"
                  >
                    <img
                      src={p.url}
                      alt={p.name}
                      className="h-full w-full object-cover rounded-lg"
                    />
                    <button
                      onClick={() => setFiles((prev) => prev.filter((_, j) => j !== i))}
                      className="absolute -top-1 -right-1 grid h-6 w-6 place-items-center rounded-full bg-foreground text-background"
                      aria-label="Remove"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Customer details — so the shop knows who sent the photos & payment */}
            <div className="mt-6">
              <h4 className="text-xs uppercase tracking-widest text-foreground/50 mb-3">
                Your details
              </h4>
              <div className="grid sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Your name *"
                  autoComplete="name"
                  className="w-full rounded-xl border border-primary/30 bg-white/70 px-4 py-3 text-sm outline-none transition-colors focus:border-primary placeholder:text-foreground/40"
                />
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="WhatsApp number *"
                  inputMode="numeric"
                  autoComplete="tel"
                  maxLength={13}
                  className="w-full rounded-xl border border-primary/30 bg-white/70 px-4 py-3 text-sm outline-none transition-colors focus:border-primary placeholder:text-foreground/40"
                />
              </div>
              <p className="text-[11px] text-foreground/40 mt-2">
                We use these to match your photos & payment to your order.
              </p>
            </div>
          </div>

          {/* Configurator */}
          <div className="lg:col-span-2 rounded-[2rem] bg-foreground text-background p-6 md:p-8 shadow-glow flex flex-col">
            <h3 className="font-display text-2xl mb-5">Your order</h3>

            <label className="text-xs uppercase tracking-widest text-background/50 mb-2">
              Product
            </label>
            <div className="flex flex-wrap gap-2 mb-5">
              {types.map((t, i) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setTypeIdx(i);
                    setTierIdx(0);
                    setQty(1);
                  }}
                  className={`rounded-full px-3.5 py-1.5 text-xs transition-all ${
                    i === typeIdx
                      ? "bg-background text-foreground"
                      : "bg-white/10 hover:bg-white/20"
                  }`}
                >
                  {t.name}
                </button>
              ))}
            </div>

            <label className="text-xs uppercase tracking-widest text-background/50 mb-2">
              Size / Pack
            </label>
            <div className="flex flex-wrap gap-2 mb-5">
              {type.tiers.map((t, i) => (
                <button
                  key={t.label}
                  onClick={() => {
                    setTierIdx(i);
                    setCombo(null);
                    // Adjust quantity so the chosen pack still covers all photos.
                    const cap = tierCapacity(type.id, type.tiers[i].label);
                    if (files.length > 0 && cap) {
                      setQty(Math.ceil(files.length / cap));
                    } else {
                      setQty(1);
                    }
                  }}
                  className={`rounded-full px-3.5 py-1.5 text-xs transition-all ${
                    (combo ? combo.some((c) => c.tierIdx === i) : i === tierIdx)
                      ? "bg-background text-foreground"
                      : "bg-white/10 hover:bg-white/20"
                  }`}
                >
                  {t.label} · ₹{t.price}
                </button>
              ))}
            </div>

            {combo ? (
              <>
                <label className="text-xs uppercase tracking-widest text-background/50 mb-2">
                  Best price combo
                </label>
                <p className="text-sm mb-6 text-emerald-300">
                  {selectionLabel}{" "}
                  <span className="text-background/50">(cheapest for {files.length} photos)</span>
                </p>
              </>
            ) : (
              <>
                <label className="text-xs uppercase tracking-widest text-background/50 mb-2">
                  Quantity
                </label>
                <div className="flex items-center gap-3 mb-6">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="grid h-10 w-10 place-items-center rounded-full bg-white/10 hover:bg-white/20"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="font-display text-2xl w-10 text-center">{qty}</span>
                  <button
                    onClick={() => setQty((q) => q + 1)}
                    className="grid h-10 w-10 place-items-center rounded-full bg-white/10 hover:bg-white/20"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </>
            )}

            {coverage !== null && files.length > 0 && (
              <p
                className={`text-[11px] -mt-3 mb-4 ${underCoverage ? "text-amber-300" : "text-emerald-300"}`}
              >
                {underCoverage
                  ? `⚠ You've uploaded ${files.length} photos, but this selection covers only ${coverage}. Pick a bigger pack or increase quantity.`
                  : `✓ Covers your ${files.length} uploaded photo${files.length > 1 ? "s" : ""} (${coverage} total)`}
              </p>
            )}

            <div className="mt-auto pt-5 border-t border-white/15">
              <div className="flex items-end justify-between mb-4">
                <span className="text-background/60 text-sm">Total</span>
                <span className="font-display text-4xl">₹{total}</span>
              </div>

              {/* UPI payment */}
              <div className="rounded-2xl bg-white/5 border border-white/10 p-4 mb-4">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs uppercase tracking-widest text-background/50">
                    Pay via UPI
                  </span>
                  <button
                    onClick={copyUpiId}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white/10 hover:bg-white/20 px-3 py-1 text-xs transition-colors"
                  >
                    {UPI_ID}
                    {copied ? <Check size={12} /> : <Copy size={12} />}
                  </button>
                </div>
                <div className="flex items-center gap-4">
                  <div className="shrink-0 rounded-xl bg-white p-2">
                    <QRCodeSVG value={upiLink} size={92} />
                  </div>
                  <div className="text-xs text-background/70 space-y-2 min-w-0">
                    <p>
                      Scan with any UPI app — <strong>₹{total}</strong> is pre-filled.
                    </p>
                    <a
                      href={upiLink}
                      className="md:hidden inline-flex items-center rounded-full bg-background text-foreground px-3.5 py-1.5 font-medium"
                    >
                      Pay ₹{total} in UPI app
                    </a>
                    <div>
                      <input
                        ref={paymentInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          setPayment(e.target.files?.[0] ?? null);
                          e.target.value = "";
                        }}
                      />
                      {payment ? (
                        <span className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5">
                          <Paperclip size={12} className="shrink-0" />
                          <span className="truncate">{payment.name}</span>
                          <button
                            onClick={() => setPayment(null)}
                            aria-label="Remove payment screenshot"
                            className="shrink-0 hover:text-background"
                          >
                            <X size={12} />
                          </button>
                        </span>
                      ) : (
                        <button
                          onClick={() => paymentInputRef.current?.click()}
                          className="inline-flex items-center gap-1.5 rounded-full border border-white/20 hover:bg-white/10 px-3.5 py-1.5 transition-colors"
                        >
                          <Paperclip size={12} />
                          Attach payment screenshot
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={handleOrder}
                disabled={isUploading}
                className="w-full flex items-center justify-center gap-2 rounded-full bg-background text-foreground py-3.5 font-medium hover-lift disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <MessageCircle size={16} />
                {isUploading ? `Sending ${files.length} photos in HD...` : "Order on WhatsApp"}
              </button>
              <p className="text-[11px] text-background/60 text-center mt-2 leading-relaxed">
                {files.length > 0
                  ? "✓ Photos are delivered as uncompressed documents (original HD quality preserved)"
                  : "💡 Tip: For best results, select the 'HD' quality or attach as 'Document' when sharing in WhatsApp."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
