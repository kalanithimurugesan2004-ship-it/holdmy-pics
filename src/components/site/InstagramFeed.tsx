import g1 from "@/assets/gallery-1.jpg";
import g2 from "@/assets/gallery-2.jpg";
import g3 from "@/assets/gallery-3.jpg";
import g4 from "@/assets/gallery-4.jpg";
import g5 from "@/assets/gallery-5.jpg";
import g6 from "@/assets/gallery-6.jpg";

import { Instagram } from "lucide-react";

const feed = [g6, g1, g2, g3, g4, g5];

export function InstagramFeed() {
  return (
    <section className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr] items-center mb-12">
          <div className="rounded-[1.75rem] border border-border bg-background/80 p-8 shadow-soft">
            <p className="u-eyebrow mb-3">Instagram</p>
            <h2 className="font-display text-4xl md:text-5xl font-light leading-[1.05]">
              See your favourite prints come to life.
              <br />
              Follow <a href="https://instagram.com/hold_mypics" target="_blank" rel="noreferrer" className="italic text-gradient">@hold_mypics</a>
            </h2>
            <p className="mt-6 max-w-xl text-foreground/70">
              Discover fresh print inspiration, customer highlights, and behind-the-scenes product styling. Our Instagram is the best place to see real photo prints in real settings.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="https://instagram.com/hold_mypics"
                target="_blank"
                rel="noreferrer"
                className="u-btn-primary hover-lift"
              >
                <Instagram size={18} /> Follow @hold_mypics
              </a>
              <span className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-3 text-sm text-foreground/70">
                <span className="h-2.5 w-2.5 rounded-full bg-primary" /> New styles weekly
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {feed.map((src, i) => (
              <a
                key={i}
                href="https://instagram.com/hold_mypics"
                target="_blank"
                rel="noreferrer"
                className="group relative overflow-hidden rounded-[1.75rem] border border-border bg-background shadow-soft transition-transform duration-300 hover:-translate-y-1 hover:shadow-card"
              >
                <img
                  src={src}
                  alt="Instagram preview"
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-foreground/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
