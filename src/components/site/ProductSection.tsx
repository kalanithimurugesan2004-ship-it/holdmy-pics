import { type Product } from "./productData";

interface SectionProps {
  products: Product[];
  title: string;
  subtitle?: string;
}

export function ProductSection({ products, title, subtitle }: SectionProps) {
  return (
    <section className="relative py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-10">
          <h2 className="font-display text-3xl md:text-5xl font-light text-balance">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-2 text-foreground/60 max-w-xl">{subtitle}</p>
          )}
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {products.map((p) => (
            <article
              key={p.name}
              className="group relative flex flex-col rounded-[2rem] bg-card overflow-hidden shadow-card hover-lift"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-secondary">
                <img src={p.image} alt={p.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                {p.badge && (
                  <span className="absolute top-3 left-3 rounded-full glass px-3 py-1 text-[10px] font-medium uppercase tracking-wider">
                    {p.badge}
                  </span>
                )}
              </div>
              <div className="p-5 flex flex-col gap-3 flex-1">
                <div>
                  <h3 className="font-display text-xl">{p.name}</h3>
                  <p className="text-xs text-primary/80 mt-0.5">{p.tagline}</p>
                </div>
                <p className="text-sm text-foreground/60 leading-relaxed flex-1">{p.description}</p>
                <ul className="space-y-1.5 text-sm border-t border-border/70 pt-3">
                  {p.variants.map((v: { label: string; price: string }) => (
                    <li key={v.label} className="flex items-center justify-between">
                      <span className="text-foreground/70">{v.label}</span>
                      <span className="font-medium">{v.price}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
