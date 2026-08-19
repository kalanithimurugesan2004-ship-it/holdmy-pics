import { Sparkles, Gift, Package, Infinity as InfinityIcon, Heart } from "lucide-react";

const items = [
  { icon: Sparkles, title: "Premium Quality Prints", text: "Studio-grade paper, true-to-life colour, matte finish." },
  { icon: Package, title: "Packed with Care", text: "Every order hand-packed with little extras inside." },
  { icon: Gift, title: "Perfect for Gifting", text: "Birthdays, anniversaries, just-because surprises." },
  { icon: InfinityIcon, title: "Memories that Last", text: "Fade-resistant inks. Your moments — preserved." },
  { icon: Heart, title: "Made Specially for You", text: "Each order is customised. Nothing mass produced." },
];

export function WhyUs() {
  return (
    <section id="why" className="relative py-12 sm:py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10">
          <div className="lg:col-span-4">
            <p className="u-eyebrow mb-2 sm:mb-3">Why us</p>
            <h2 className="font-display text-2.5xl sm:text-4xl md:text-5xl font-light leading-[1.05] text-balance">
              Because your <em className="italic text-gradient">memories</em> deserve better.
            </h2>
            <p className="mt-3 sm:mt-5 text-sm sm:text-base text-foreground/60">
              We obsess over the small things — the weight of the paper, the
              corners of the polaroids, the note inside the box.
            </p>
          </div>

          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {items.map((it) => (
              <div key={it.title} className="u-card p-5 sm:p-6 hover-lift">
                <div className="u-icon mb-3 sm:mb-4">
                  <it.icon size={18} />
                </div>
                <h3 className="font-display text-base sm:text-lg mb-1">{it.title}</h3>
                <p className="text-xs sm:text-sm text-foreground/60">{it.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}