import { useState } from "react";
import { Plus } from "lucide-react";

const faqs = [
  { q: "How long does delivery take?", a: "Orders ship within 24–48 hours and reach you in 4–7 working days across India." },
  { q: "Can I customize my prints?", a: "Absolutely — that's the whole point ♡ Send us your photos, layout preferences and any notes via WhatsApp and we'll handle the rest." },
  { q: "What photo quality should I send?", a: "The higher the better. Ideally upload original camera-roll quality (not screenshots). We'll let you know if anything looks low-res before printing." },
  { q: "How do I pay?", a: "Easy UPI, GPay, PhonePe, Paytm or bank transfer — shared on WhatsApp after you confirm your order." },
  { q: "Do you ship pan-India?", a: "Yes! We ship across India with tracked courier services. International requests — DM us on Instagram." },
  { q: "Can I return or change my order?", a: "Since every print is custom-made for you, we can't accept returns — but if there's any printing/quality issue from our side, we'll reprint, no questions asked." },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="relative py-12 sm:py-20 md:py-28">
      <div className="mx-auto max-w-4xl px-4">
        <div className="text-center mb-8 sm:mb-12">
          <p className="u-eyebrow mb-2 sm:mb-3">FAQ</p>
          <h2 className="font-display text-2.5xl sm:text-4xl md:text-5xl font-light leading-[1.05] text-balance">
            Questions, <em className="italic text-gradient">answered.</em>
          </h2>
        </div>

        <div className="space-y-2.5 sm:space-y-3">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={i} className={`rounded-xl sm:rounded-2xl border border-border/60 bg-card transition-all ${isOpen ? "shadow-card" : ""}`}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-3 text-left p-4 sm:p-5 md:p-6"
                >
                  <span className="font-display text-base sm:text-lg md:text-xl">{f.q}</span>
                  <span className={`grid h-8 w-8 sm:h-9 sm:w-9 shrink-0 place-items-center rounded-full bg-secondary transition-transform ${isOpen ? "rotate-45 bg-foreground text-background" : ""}`}>
                    <Plus size={16} />
                  </span>
                </button>
                <div
                  className="grid transition-[grid-template-rows] duration-500 ease-out"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <p className="px-4 sm:px-5 md:px-6 pb-4 sm:pb-6 text-xs sm:text-sm text-foreground/65 leading-relaxed">{f.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}