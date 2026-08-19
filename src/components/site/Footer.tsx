import { Instagram, MessageCircle, Mail, Download } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative border-t border-border/60 pt-16 pb-28 md:pb-16">
      <div className="mx-auto max-w-7xl px-4 grid md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-lavender-gradient text-primary-foreground font-display text-lg shadow-soft">♡</span>
            <span className="font-display text-xl">Hold My Pics</span>
          </div>
          <p className="text-foreground/60 max-w-sm">
            A small print studio making big feelings. Polaroids, posters,
            photo strips, magazines & fairy lights — made with love in India.
          </p>

          <div className="flex gap-3 mt-6">
            <a href="https://instagram.com/hold_mypics" target="_blank" rel="noreferrer" className="grid h-10 w-10 place-items-center rounded-full glass hover-lift"><Instagram size={16} /></a>
            <a href="https://wa.me/917010249422" target="_blank" rel="noreferrer" className="grid h-10 w-10 place-items-center rounded-full glass hover-lift"><MessageCircle size={16} /></a>
            <a href="mailto:hello@holdmypics.in" className="grid h-10 w-10 place-items-center rounded-full glass hover-lift"><Mail size={16} /></a>
          </div>
          <div className="mt-6">
            <picture className="w-36 rounded-xl overflow-hidden shadow-soft">
              <source
                type="image/webp"
                srcSet={`/assets/holdmy-pics-1-1600.webp 1600w, /assets/holdmy-pics-1-800.webp 800w, /assets/holdmy-pics-1-400.webp 400w`}
                sizes="(max-width: 768px) 180px, 280px"
              />
              <img
                src="/assets/holdmy-pics-1-800.jpg"
                srcSet={`/assets/holdmy-pics-1-1600.jpg 1600w, /assets/holdmy-pics-1-800.jpg 800w, /assets/holdmy-pics-1-400.jpg 400w`}
                alt="Hold My Pics sample"
                className="w-full h-auto object-cover"
                loading="lazy"
                onError={(e) => {
                  const pic = (e.currentTarget as HTMLImageElement).closest("picture");
                  if (pic) (pic as HTMLElement).style.display = "none";
                }}
              />
            </picture>
          </div>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-foreground/40 mb-4">Explore</p>
          <ul className="space-y-2 text-foreground/70">
            <li><a href="#products" className="hover:text-primary">Products</a></li>
            <li><a href="#how" className="hover:text-primary">How it works</a></li>
            <li><a href="#gallery" className="hover:text-primary">Gallery</a></li>
            <li><a href="#faq" className="hover:text-primary">FAQ</a></li>
          </ul>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-foreground/40 mb-4">Reach us</p>
          <ul className="space-y-2 text-foreground/70">
            <li>
              <a href="https://wa.me/917010249422" className="hover:text-primary">WhatsApp · 70102 49422</a>
            </li>
            <li>
              <a href="https://instagram.com/hold_mypics" className="hover:text-primary">Instagram · @hold_mypics</a>
            </li>
            <li className="text-foreground/50 text-sm">Mon — Sat · 10am to 8pm</li>
          </ul>
          <div className="mt-6 text-sm">
            <div className="flex items-center gap-4">
              <a href="/assets/thanks-card.jpg" target="_blank" rel="noreferrer" className="block rounded-lg overflow-hidden shadow-soft w-20 h-14">
                <img
                  src="/assets/thanks-card.jpg"
                  alt="Thanks card"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // hide if missing
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                />
              </a>

              <a href="/assets/Holdmypic_20260522_154604_0000.pdf" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-foreground/70 hover:text-primary">
                <Download className="h-4 w-4" />
                Download order PDF
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 mt-12 flex flex-wrap justify-between gap-3 text-xs text-foreground/40">
        <p>© {new Date().getFullYear()} Hold My Pics. All moments reserved.</p>
        <p>Made with ♡ for the keepers.</p>
      </div>
    </footer>
  );
}