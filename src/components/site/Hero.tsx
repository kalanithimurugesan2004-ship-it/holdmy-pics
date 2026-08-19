import heroImg from "@/assets/hero-polaroids.jpg";
import g1 from "@/assets/gallery-1.jpg";
import g2 from "@/assets/gallery-2.jpg";
import g3 from "@/assets/gallery-3.jpg";
import g4 from "@/assets/gallery-4.jpg";
import g5 from "@/assets/gallery-5.jpg";
import { ArrowUpRight, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-hero-gradient grain pt-32 pb-20 md:pt-40 md:pb-32">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium text-foreground/70 mb-6 animate-fade-up">
              <Sparkles size={14} className="text-primary" />
              Premium custom prints · Made in India
            </div>

            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-light leading-[0.95] tracking-tight text-balance animate-fade-up">
              Print Your <em className="italic text-gradient font-medium">Moments.</em>
              <br />
              Treasure <em className="italic text-gradient font-medium">Forever.</em>
            </h1>

            <p className="mt-6 max-w-xl text-lg text-foreground/65 animate-fade-up" style={{ animationDelay: "100ms" }}>
              Polaroids, Posters, Photo Strips, Magazines, Fairy Lights & more — designed
              with love, printed with care. Turn your camera roll into something
              you'll keep forever.
            </p>

            <div className="mt-8 flex flex-wrap gap-3 animate-fade-up" style={{ animationDelay: "200ms" }}>
              <a
                href="https://wa.me/917010249422?text=Hi!%20I'd%20like%20to%20place%20an%20order%20with%20Hold%20My%20Pics"
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-2 rounded-full bg-foreground text-background px-7 py-4 text-sm font-medium hover-lift"
              >
                Order Now
                <ArrowUpRight size={16} className="transition-transform group-hover:rotate-45" />
              </a>
              <a
                href="#products"
                className="inline-flex items-center gap-2 rounded-full glass px-7 py-4 text-sm font-medium hover-lift text-foreground"
              >
                View Products
              </a>
            </div>

            <div className="mt-12 flex items-center gap-6 text-xs text-foreground/55 animate-fade-up" style={{ animationDelay: "300ms" }}>
              <div className="flex -space-x-2">
                {([g1, g3, g5, g2]).map((src, i) => (
                  <img key={i} src={src} alt="" loading="lazy" className="h-8 w-8 rounded-full border-2 border-background object-cover" />
                ))}
              </div>
              <div>
                <div className="font-medium text-foreground">2,000+ happy customers</div>
                <div>Loved across India ♡</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative h-[440px] sm:h-[520px] lg:h-[600px]">
            <img
              src={heroImg}
              alt="Aesthetic polaroid flatlay"
              className="absolute inset-0 w-full h-full object-cover rounded-[2.5rem] shadow-glow"
            />
            {/* floating polaroids */}
            <div className="absolute -left-6 top-12 polaroid w-36 animate-float" style={{ ["--r" as never]: "-8deg" } as React.CSSProperties}>
              <img src={g1} alt="" loading="lazy" className="w-full h-36 object-cover" />
            </div>
            <div className="absolute -right-4 bottom-16 polaroid w-40 animate-float" style={{ animationDelay: "1.5s", ["--r" as never]: "6deg" } as React.CSSProperties}>
              <img src={g3} alt="" loading="lazy" className="w-full h-40 object-cover" />
            </div>
            <div className="absolute right-10 -top-4 polaroid w-28 animate-float" style={{ animationDelay: "3s", ["--r" as never]: "12deg" } as React.CSSProperties}>
              <img src={g5} alt="" loading="lazy" className="w-full h-28 object-cover" />
            </div>
            {/* additional floating polaroid */}
            <div className="absolute left-4 bottom-6 polaroid w-32 animate-float" style={{ animationDelay: "2s", ["--r" as never]: "-6deg" } as React.CSSProperties}>
              <img src={g4} alt="" loading="lazy" className="w-full h-32 object-cover" />
            </div>
          </div>
        </div>
      </div>

      {/* marquee */}
      <div className="mt-20 overflow-hidden border-y border-border/50 py-4 bg-background/40 backdrop-blur">
        <div className="flex gap-12 whitespace-nowrap text-foreground/40 font-display text-xl italic animate-[shimmer-text_20s_linear_infinite]">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="flex items-center gap-12">
              Polaroids ✦ Posters ✦ Photo Strips ✦ Magazines ✦ Fairy Lights ✦ Gifting ✦ Combo Offers
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}