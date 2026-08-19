import { Upload, Palette, ShoppingBag, Heart } from "lucide-react";

const steps = [
  { icon: Upload, title: "Upload Photos", text: "Send us your favourite pics via WhatsApp or here on the site." },
  { icon: Palette, title: "Choose Style", text: "Pick polaroids, posters, photo strips, magazines or fairy lights." },
  { icon: ShoppingBag, title: "Place Order", text: "Confirm on WhatsApp or Instagram DM. Pay easy via UPI." },
  { icon: Heart, title: "Receive Your Memories", text: "Hand-packed with love, shipped pan-India in 4–7 days." },
];

export function HowItWorks() {
  return (
    <section id="how" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="u-eyebrow mb-3">How it works</p>
          <h2 className="font-display text-4xl md:text-6xl font-light leading-[1.05] text-balance">
            From your gallery to your <em className="italic text-gradient">wall.</em>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {steps.map((s, i) => (
            <div key={s.title} className="u-card p-6 sm:p-7 hover-lift">
              <div className="flex items-center justify-between gap-3 mb-4 sm:mb-5">
                <div className="u-icon">
                  <s.icon size={20} />
                </div>
                <span className="font-display text-4xl sm:text-5xl leading-none text-primary/15">
                  0{i + 1}
                </span>
              </div>
              <h3 className="font-display text-lg sm:text-xl mb-2 text-balance">{s.title}</h3>
              <p className="text-sm text-foreground/60 leading-relaxed">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}