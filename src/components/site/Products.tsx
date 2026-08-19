import { useState, useEffect } from "react";
import { products } from "./productData";
import { ArrowUpRight } from "lucide-react";

export function Products() {
  return (
    <section id="products" className="relative py-12 sm:py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-wrap items-end justify-between gap-4 sm:gap-6 mb-8 sm:mb-12">
          <div>
            <p className="u-eyebrow mb-2 sm:mb-3">
              Shop the prints
            </p>
            <h2 className="font-display text-2.5xl sm:text-4xl md:text-5xl font-light leading-[1.05] text-balance">
              Memories you can <em className="italic text-gradient">hold.</em>
            </h2>
          </div>
          <p className="max-w-md text-sm sm:text-base text-foreground/60">
            Hand-finished, photo-paper perfect. Pick a format, upload your pics and we&apos;ll do
            the rest.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 items-start">
          {products.map((p, i) => (
            <article
              key={p.name}
              className="group relative flex flex-col u-card overflow-hidden hover-lift"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-secondary">
                {p.collage ? (
                  <CollageImage images={p.collage} />
                ) : (
                  <ProductImage fallback={p.image} alt={p.name} />
                )}
                {p.badge && (
                  <span className="absolute top-3 left-3 rounded-full glass px-3 py-1 text-[10px] font-medium uppercase tracking-wider">
                    {p.badge}
                  </span>
                )}
              </div>
              <div className="flex flex-col flex-1 p-4 sm:p-5">
                <h3 className="font-display text-lg sm:text-xl">{p.name}</h3>
                <p className="text-xs text-primary/80 mt-0.5">{p.tagline}</p>
                <p className="text-xs sm:text-sm text-foreground/60 leading-relaxed mt-2 break-words">
                  {p.description}
                </p>

                <ul className="space-y-1.5 text-xs sm:text-sm border-t border-border/70 pt-3 mt-4">
                  {p.variants.map((v) => (
                    <li key={v.label} className="flex items-center justify-between">
                      <span className="text-foreground/70">{v.label}</span>
                      <span className="font-medium">{v.price}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href={`#customize`}
                  className="mt-4 inline-flex items-center justify-center gap-1.5 rounded-full bg-secondary hover:bg-foreground hover:text-background transition-colors px-4 py-2.5 text-xs sm:text-sm font-medium"
                >
                  Customize Now
                  <ArrowUpRight size={14} />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function CollageImage({ images }: { images: string[] }) {
  const [poster, polaroid, strip] = images;
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-[#efe9ff] to-[#e4d7fb] transition-transform duration-700 group-hover:scale-105">
      {/* Poster — back layer */}
      <img
        src={poster}
        alt=""
        loading="lazy"
        className="absolute left-[6%] top-[8%] w-[54%] aspect-[3/4] object-cover rounded-md shadow-lg -rotate-6 ring-1 ring-black/5"
      />
      {/* Photo strip — tall, right edge */}
      <img
        src={strip}
        alt=""
        loading="lazy"
        className="absolute right-[7%] top-[6%] w-[21%] h-[72%] object-cover rounded-md shadow-lg rotate-3 ring-1 ring-black/5"
      />
      {/* Polaroid — front, framed */}
      <div className="absolute right-[10%] bottom-[8%] w-[46%] bg-white p-[3%] pb-[11%] rounded-sm shadow-xl rotate-6">
        <img src={polaroid} alt="" loading="lazy" className="w-full aspect-square object-cover" />
      </div>
    </div>
  );
}

function ProductImage({ fallback, alt }: { fallback: string; alt: string }) {
  const [src, setSrc] = useState(fallback);

  const slug = alt
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const runtime = `/assets/${slug}.jpg`;

  useEffect(() => {
    let cancelled = false;

    fetch(runtime, { method: "HEAD" })
      .then((res) => {
        if (!cancelled && res.ok) setSrc(runtime);
      })
      .catch(() => {
        /* ignore, keep fallback */
      });

    return () => {
      cancelled = true;
    };
  }, [runtime]);

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
    />
  );
}
