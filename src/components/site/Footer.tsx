import { Instagram, MessageCircle, Mail, Download } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative border-t border-border/60 pt-10 sm:pt-16 pb-24 md:pb-16">
      <div className="mx-auto max-w-7xl px-4 grid sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
        <div className="sm:col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-lavender-gradient text-primary-foreground font-display text-base shadow-soft">♡</span>
            <span className="font-display text-lg sm:text-xl">Hold My Pics</span>
          </div>
          <p className="text-xs sm:text-sm text-foreground/60 max-w-sm">
            A small print studio making big feelings. Polaroids, posters,
            photo strips, magazines & fairy lights — made with love in India.
          </p>

          <div className="flex gap-2.5 mt-5">
            <a href="https://instagram.com/hold_mypics" target="_blank" rel="noreferrer" className="grid h-9 w-9 place-items-center rounded-full glass hover-lift"><Instagram size={15} /></a>
            <a href="https://wa.me/917010249422" target="_blank" rel="noreferrer" className="grid h-9 w-9 place-items-center rounded-full glass hover-lift"><MessageCircle size={15} /></a>
            <a href="mailto:hello@holdmypics.in" className="grid h-9 w-9 place-items-center rounded-full glass hover-lift"><Mail size={15} /></a>
          </div>
        </div>

        <div>
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-foreground/40 mb-3 sm:mb-4">Explore</p>
          <ul className="space-y-2 text-xs sm:text-sm text-foreground/70">
            <li><a href="#products" className="hover:text-primary">Products</a></li>
            <li><a href="#how" className="hover:text-primary">How it works</a></li>
            <li><a href="#gallery" className="hover:text-primary">Gallery</a></li>
            <li><a href="#faq" className="hover:text-primary">FAQ</a></li>
          </ul>
        </div>

        <div>
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-foreground/40 mb-3 sm:mb-4">Reach us</p>
          <ul className="space-y-2 text-xs sm:text-sm text-foreground/70">
            <li>
              <a href="https://wa.me/917010249422" className="hover:text-primary">WhatsApp · 70102 49422</a>
            </li>
            <li>
              <a href="https://instagram.com/hold_mypics" className="hover:text-primary">Instagram · @hold_mypics</a>
            </li>
            <li className="text-foreground/50 text-xs">Mon — Sat · 10am to 8pm</li>
          </ul>
          <div className="mt-4 text-xs sm:text-sm">
            <a href="/assets/Holdmypic_20260522_154604_0000.pdf" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-foreground/70 hover:text-primary">
              <Download className="h-4 w-4" />
              Download order PDF
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 mt-8 sm:mt-12 flex flex-wrap justify-between gap-3 text-[11px] sm:text-xs text-foreground/40">
        <p>© {new Date().getFullYear()} Hold My Pics. All moments reserved.</p>
        <p>Made with ♡ for the keepers.</p>
      </div>
    </footer>
  );
}