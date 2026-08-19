import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import logoImg from "../../assets/logo.png";

const links = [
  { href: "#products", label: "Products" },
  { href: "#how", label: "How it Works" },
  { href: "#gallery", label: "Gallery" },
  { href: "#why", label: "Why Us" },
  { href: "#faq", label: "FAQ" },
];

function LogoOrFallback() {
  return (
    <img
      src={logoImg}
      alt="Hold My Pics logo"
      className="h-11 md:h-14 w-auto max-w-[9rem] md:max-w-[12rem] object-contain transition-all duration-300 filter brightness-[0.5] contrast-[1.3] saturate-[1.3]"
    />
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? "py-2" : "py-4"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4">
        <nav
          className={`flex items-center justify-between rounded-full px-5 py-2 md:py-2.5 transition-all duration-500 ${
            scrolled ? "glass shadow-soft" : ""
          }`}
        >
          <a href="#top" className="flex items-center gap-3 group">
            <LogoOrFallback />
          </a>

          <ul className="hidden md:flex items-center gap-8 text-sm lg:text-base font-semibold text-foreground/90">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="relative hover:text-primary transition-colors after:absolute after:left-0 after:-bottom-1 after:h-px after:w-0 after:bg-primary hover:after:w-full after:transition-all"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <a
            href="https://wa.me/917010249422"
            target="_blank"
            rel="noreferrer"
            className="hidden md:inline-flex items-center gap-2 rounded-full bg-foreground text-background px-5 py-2 text-sm lg:text-base font-semibold hover-lift"
          >
            Order Now
          </a>

          <button
            className="md:hidden grid place-items-center h-10 w-10 rounded-full glass"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </nav>

        {open && (
          <div className="md:hidden mt-2 glass rounded-3xl p-4 animate-fade-up">
            <ul className="flex flex-col gap-2">
              {links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-xl px-4 py-3 hover:bg-secondary"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="https://wa.me/917010249422"
                  className="block rounded-xl px-4 py-3 bg-foreground text-background text-center font-medium"
                >
                  Order on WhatsApp
                </a>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}