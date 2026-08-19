import polaroidImg from "@/assets/product-polaroid.jpg";
import posterImg from "@/assets/product-poster.png";
import stripImg from "@/assets/product-strip.jpg";
import stickerImg from "@/assets/product-sticker.jpg";
import fairyImg from "@/assets/product-fairy-lights.svg";
import comboImg from "@/assets/hero-polaroids.jpg";
import magazineImg from "@/assets/product-magazine.jpg";


export type Product = {
  name: string;
  tagline: string;
  description: string;
  image: string;
  variants: { label: string; price: string }[];
  badge?: string;
  // Optional collage cover — [poster, polaroid, strip] — used instead of `image`.
  collage?: string[];
};

// Prices below match the printed Hold My Pics menu (the poster). New items
// added on top of the poster are grouped under Fairy Lights, Gifting &
// Trending and Combo Offers.
export const products: Product[] = [
  {
    name: "Polaroids",
    tagline: "Mini · Square · Matte",
    description: "Tiny pieces of joy. Iconic white borders, premium matte finish.",
    image: polaroidImg,
    badge: "Bestseller",
    variants: [
      { label: "10 Photos", price: "₹75" },
      { label: "15 Photos", price: "₹100" },
      { label: "25 Photos", price: "₹199" },
      { label: "50 Photos", price: "₹300" },
      { label: "75 Photos", price: "₹400" },
      { label: "100 Photos", price: "₹500" },
    ],
  },
  {
    name: "Sticker Polaroids",
    tagline: "Peel & stick · Custom",
    description: "Peel-and-stick polaroid stickers for laptops, walls & journals.",
    image: stickerImg,
    badge: "New",
    variants: [
      { label: "1 Pic", price: "₹10" },
      { label: "35 Pics", price: "₹300" },
    ],
  },
  {
    name: "Posters",
    tagline: "A4 · A3",
    description: "Wall-worthy prints in crisp colour on premium poster paper.",
    image: posterImg,
    variants: [
      { label: "A4 – 1 Pic", price: "₹60" },
      { label: "A4 – 2 Pic", price: "₹100" },
      { label: "A3 – 1 Pic", price: "₹100" },
      { label: "A3 – 2 Pic", price: "₹180" },
    ],
  },
  {
    name: "Photo Strips",
    tagline: "Photobooth style · Tall",
    description: "Classic photobooth strips — a row of your favourite frames.",
    image: stripImg,
    badge: "Trending",
    variants: [
      { label: "1 Strip", price: "₹50" },
      { label: "3 Strips", price: "₹120" },
      { label: "5 Strips", price: "₹200" },
      { label: "8 Strips", price: "₹300" },
    ],
  },
  {
    name: "Magazine",
    tagline: "A4 Size · Custom Cover",
    description: "A premium customized photo booklet designed like a magazine. Price depends on page count.",
    image: magazineImg,
    badge: "New",
    variants: [
      { label: "8 Pages (Standard)", price: "₹300" },
      { label: "12 Pages", price: "₹380" },
      { label: "16 Pages", price: "₹450" },
      { label: "20 Pages", price: "₹520" },
      { label: "24 Pages", price: "₹590" },
    ],
  },
  {
    name: "Fairy Lights",
    tagline: "Warm White · Multicolor",
    description: "Set the mood. Photo clips included free with every set.",
    image: fairyImg,
    badge: "New",
    variants: [
      { label: "10 Meter · Warm White", price: "₹159" },
    ],
  },
  {
    name: "Combo Offers",
    tagline: "Save more · Bundles",
    description: "Curated bundles for rooms, birthdays and couples — best value.",
    image: comboImg,
    collage: [posterImg, polaroidImg, stripImg],
    badge: "Value",
    variants: [
      { label: "A4 Poster + 15 Polaroids", price: "₹150" },
      { label: "A3 Poster + 25 Polaroids", price: "₹299" },
      { label: "30 Polaroids + Fairy Lights", price: "₹300" },
      { label: "Couple Kit", price: "₹349" },
      { label: "50 Polaroids + 10m Lights", price: "₹399" },
      { label: "Birthday Kit", price: "₹499" },
    ],
  },
];
