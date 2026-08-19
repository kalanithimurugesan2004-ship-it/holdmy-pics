import { MessageCircle, Instagram } from "lucide-react";

export function FinalCTA() {
  return (
    <section className="relative py-12 sm:py-20 md:py-28 px-4">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl sm:rounded-[2.5rem] bg-lavender-gradient grain text-primary-foreground px-5 py-12 sm:py-20 md:py-28 text-center shadow-glow">
        <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-white/20 blur-3xl" />
        <div className="absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-white/15 blur-3xl" />

        <p className="relative text-[10px] sm:text-xs uppercase tracking-[0.3em] text-white/80 mb-3 sm:mb-5">Ready when you are</p>
        <h2 className="relative font-display text-2.5xl sm:text-4xl md:text-6xl font-light leading-[1.05] text-balance max-w-3xl mx-auto">
          Your memories deserve more than a <em className="italic">gallery.</em>
        </h2>
        <p className="relative mt-4 sm:mt-6 text-sm sm:text-base text-white/80 max-w-xl mx-auto">
          Let's turn them into something you can hold, gift, or hang on your wall.
        </p>

        <div className="relative mt-8 sm:mt-10 flex flex-wrap gap-3 justify-center">
          <a
            href="https://wa.me/917010249422?text=Hi%20Hold%20My%20Pics!%20I'd%20like%20to%20place%20an%20order."
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-6 py-3.5 text-xs sm:text-sm font-medium hover-lift"
          >
            <MessageCircle size={16} /> Order via WhatsApp
          </a>
          <a
            href="https://instagram.com/hold_mypics"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full glass-dark text-white px-6 py-3.5 text-xs sm:text-sm font-medium hover-lift"
          >
            <Instagram size={16} /> DM on Instagram
          </a>
        </div>
      </div>
    </section>
  );
}