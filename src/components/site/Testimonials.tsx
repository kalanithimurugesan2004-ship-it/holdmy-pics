import { Star } from "lucide-react";

const reviews = [
  { name: "Ananya R.", handle: "@ananyaaa", text: "Literally cried when I opened the box. The polaroids look unreal — packaging was a whole moment.", rating: 5 },
  { name: "Riya K.", handle: "@riyakapoor", text: "Got the photobook for my best friend's birthday. She hasn't stopped flipping through it. Worth every rupee.", rating: 5 },
  { name: "Aarav S.", handle: "@aaravv", text: "Posters arrived in 3 days. Print quality is insane and the colours actually match the originals.", rating: 5 },
  { name: "Meher T.", handle: "@meher.t", text: "The little handwritten note inside made my day. Brand has so much soul ♡", rating: 5 },
];

export function Testimonials() {
  return (
    <section className="relative py-12 sm:py-20 md:py-28 bg-soft-gradient grain overflow-hidden">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <p className="u-eyebrow mb-2 sm:mb-3">Loved by</p>
          <h2 className="font-display text-2.5xl sm:text-4xl md:text-5xl font-light leading-[1.05] text-balance">
            Words from our <em className="italic text-gradient">people.</em>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {reviews.map((r, i) => (
            <article
              key={i}
              className="u-card p-5 sm:p-6 hover-lift flex flex-col"
            >
              <div className="flex gap-0.5 mb-3 sm:mb-4 text-primary">
                {Array.from({ length: r.rating }).map((_, j) => (
                  <Star key={j} size={14} fill="currentColor" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed flex-1">"{r.text}"</p>
              <div className="mt-4 sm:mt-5 pt-3 sm:pt-4 border-t border-border/60">
                <p className="font-medium text-sm sm:text-base">{r.name}</p>
                <p className="text-xs text-primary/80">{r.handle}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}