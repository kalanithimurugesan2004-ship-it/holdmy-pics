import { Upload, Palette, ShoppingBag, Heart } from "lucide-react";

const steps = [
  { icon: Upload, title: "Upload Photos", text: "Send us your favourite pics via WhatsApp or here on the site." },
  { icon: Palette, title: "Choose Style", text: "Pick polaroids, posters, photo strips, magazines or fairy lights." },
  { icon: ShoppingBag, title: "Place Order", text: "Confirm on WhatsApp or Instagram DM. Pay easy via UPI." },
  { icon: Heart, title: "Receive Your Memories", text: "Hand-packed with love, shipped pan-India in 4–7 days." },
];

export function HowItWorks() {
  return (
    <section id="how" className="relative py-12 sm:py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <p className="u-eyebrow mb-2 sm:mb-3">How it works</p>
          <h2 className="font-display text-2.5xl sm:text-4xl md:text-5xl font-light leading-[1.05] text-balance">
            From your gallery to your <em className="italic text-gradient">wall.</em>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {steps.map((s, i) => (
            <div key={s.title} className="u-card p-5 sm:p-7 hover-lift">
              <div className="flex items-center justify-between gap-3 mb-3 sm:mb-5">
                <div className="u-icon">
                  <s.icon size={18} />
                </div>
                <span className="font-display text-3xl sm:text-5xl leading-none text-primary/15">
                  0{i + 1}
                </span>
              </div>
              <h3 className="font-display text-base sm:text-xl mb-1.5 text-balance">{s.title}</h3>
              <p className="text-xs sm:text-sm text-foreground/60 leading-relaxed">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}