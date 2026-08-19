import { useState, useMemo, useRef, useEffect, useCallback } from "react";

import { X, Search, Heart, ChevronLeft, ChevronRight, Download } from "lucide-react";

type ImageItem = {
  id: string;
  src: string;
  title: string;
  category: string;
  tags: string[];
  ar: "portrait" | "landscape" | "square";
};

// Vite glob import for all downloaded gallery images
const galleryGlob = import.meta.glob("/src/assets/gallery/*/*.jpg", { eager: true, query: "?url", import: "default" }) as Record<string, string>;

const titleTemplates: Record<string, string[]> = {
  trending: ["Trending Now", "Viral Vibes", "Hot Topic", "Popular Pick", "Buzz Worthy", "Top Hit", "Social Buzz", "Most Viewed", "Trend Alert", "Viral Moment", "Peak Popular", "Going Viral", "Hot Right Now", "On Fire", "Must See", "Hype Train", "All Time Fav", "Community Pick", "Rising Star", "Top Rated", "Trend Setter", "Viral Clip", "Share Worthy", "Weekly Top", "Famous Shot", "Talk of Town", "Influencer Pick", "Mega Viral", "Instant Hit", "Fresh Trend"],
  aesthetic: ["Soft Aesthetic", "Dreamy Vibes", "Pastel Dreams", "Minimal Mood", "Calm Waters", "Gentle Glow", "Pure Serenity", "Mellow Tone", "Subtle Beauty", "Quiet Elegance", "Soft Focus", "Pastel Sky", "Misty Morning", "Golden Haze", "Velvet Touch", "Whisper Soft", "Faded Glory", "Warm Glow", "Gentle Breeze", "Silent Peace", "Dew Drops", "Lavender Haze", "Cotton Clouds", "Silk Road", "Moon Beam", "Twilight Zone", "Blush Tone", "Rose Tint", "Linen Days", "Satin Night"],
  couple: ["Couple Moments", "Romantic Sunset", "Love Story", "Together Forever", "Date Night", "Soulmates", "Heart & Soul", "True Love", "Endless Bond", "Sweet Escape", "Forever Us", "Hold Tight", "Love Notes", "First Dance", "Sunset Walk", "Starry Eyes", "My Better Half", "Us Against World", "Perfect Match", "Love Birds", "Honeymoon", "Promise Ring", "Eternal Flame", "Warm Embrace", "Tender Kiss", "Hand in Hand", "Love Letter", "Candle Light", "Rose Petal", "Sweetheart"],
  tamil: ["Cinema Magic", "Movie Still", "Kollywood Vibes", "Film Frame", "Screen Glow", "Tamil Cinema", "Star Power", "Scene Stealer", "Box Office", "Silver Screen", "Mass Moment", "Film Reel", "Behind Scenes", "Director Cut", "Award Night", "Drama Queen", "Action Hero", "Romantic Scene", "Village Story", "City Dreams", "Dance Number", "Song Sequence", "Interval Block", "Climax Scene", "Comedy Track", "Emotional Scene", "Fight Scene", "Flashback", "Intro Scene", "Title Card"],
  english: ["Hollywood Glam", "Film Aesthetic", "Cinematic Shot", "Movie Scene", "Reel Life", "Award Season", "Red Carpet", "Star Glow", "Epic Scene", "Oscar Night", "Bollywood Vibes", "Netflix Mood", "Shot on Film", "Director Chair", "Script Page", "Blockbuster", "Indie Film", "Classic Scene", "New Release", "Fan Moment", "Streaming Now", "Premiere Night", "Critics Pick", "Audience Fav", "Behind Lens", "Movie Magic", "Screen Test", "Cameo Role", "Lead Star", "Support Cast"],
  anime: ["Anime Dreamscape", "Sakura Season", "Tokyo Nights", "Manga Art", "Otaku World", "Spirit World", "Ninja Way", "Pirate King", "Hero Rising", "Magic Realm", "Dragon Soul", "Mecha Force", "Kawaii Vibes", "Shonen Jump", "Studio Ghibli", "Fantasy Land", "Samurai Path", "Cyber Punk", "School Days", "Battle Ready", "Demon Slayer", "Cat Girl", "Robot Heart", "Flying Island", "Moon Princess", "Sword Master", "Card Captor", "Wolf Rain", "Ghost Shell", "Angel Beat"],
  cars: ["Supercar Shot", "Classic Ride", "Street Racer", "Luxury Drive", "Night Run", "Track Day", "Speed Demon", "Turbo Boost", "V8 Power", "Drift King", "Garage Find", "Showroom Ready", "Auto Art", "Muscle Car", "Euro Spec", "JDM Legend", "Exotic Dream", "Race Ready", "Modded Life", "Clean Build", "Wide Body", "Carbon Fiber", "Rolling Shot", "Sunset Drive", "Engine Bay", "Interior Shot", "Wheel Detail", "Burnout King", "Low Rider", "Canyon Run"],
  bikes: ["Cafe Racer", "Vintage Bike", "Mountain Trail", "City Ride", "Speed Demon", "Iron Horse", "Road King", "Dirt Devil", "Street Fighter", "Cruiser Life", "Bobber Style", "Chopper Vibe", "Enduro King", "Moto GP", "Dual Sport", "Adventure Time", "Night Rider", "Weekend Ride", "Custom Build", "Two Wheels", "Lean Angle", "Wheelie King", "Track Day", "Gravel Ride", "Tour Pack", "Solo Trip", "Group Ride", "Sunset Run", "Bridge Pass", "Coastal Cruise"],
  nature: ["Forest Glow", "Mist & Mountains", "Ocean Waves", "Golden Hour", "Wild Bloom", "Autumn Leaves", "River Flow", "Starry Sky", "Desert Dune", "Rain Forest", "Crystal Lake", "Mountain Peak", "Sunrise Glow", "Meadow Walk", "Waterfall Dream", "Ice & Snow", "Tropical Vibes", "Canyon View", "Lavender Field", "Coral Reef", "Pine Needles", "Moss Stone", "Sand Dune", "Northern Light", "Volcano View", "Rice Terrace", "Cherry Bloom", "Bamboo Path", "Cliff Edge", "Tidal Pool"],
  wallpapers: ["Dark Wallpaper", "Starry Night", "Abstract Art", "Neon Glow", "Deep Space", "Cyber Grid", "Geometric", "Liquid Flow", "Crystal Clear", "Fractal Eye", "Minimal Line", "Gradient Sky", "Pixel Perfect", "Glitch Art", "Hologram", "Vaporwave", "Outer Space", "Ocean Deep", "Fire & Ice", "Metallic", "Aurora Wave", "Matrix Code", "Rain Drop", "Smoke Ring", "Gold Foil", "Marble Vein", "Wood Grain", "Concrete Wall", "Brick Tex", "Stone Path"],
  music: ["Music Mood", "Concert Lights", "Studio Vibes", "Groove Session", "Beat Drop", "Vinyl Spin", "Acoustic Set", "Electric Soul", "Bass Line", "Melody Flow", "Rhythm Zone", "Live Stage", "DJ Set", "Headphone Jam", "Sound Wave", "Piano Keys", "Guitar Riff", "Drum Beat", "Vocal Harmony", "Late Night", "Record Spin", "Mic Drop", "Encore Show", "Band Jam", "Solo Set", "Festival Vibe", "Chill Wave", "Lo Fi Beats", "Retro Tune", "Amplifier"],
  motivation: ["Stay Strong", "Dream Big", "Never Give Up", "Rise & Grind", "Focus Mode", "Hustle Hard", "Mind Over Matter", "Success Path", "Grind Time", "Limitless", "Be Your Best", "No Excuses", "Push Yourself", "Chase Greatness", "Believe & Achieve", "Growth Mindset", "Level Up", "Winning Streak", "Iron Will", "Unstoppable", "Go Getter", "Peak State", "Morning Ritual", "Night Grind", "Zero Doubt", "Full Focus", "Maximum Effort", "Goal Crusher", "Dream Chaser", "Legend Mode"],
  friendship: ["Best Friends", "Squad Goals", "Good Times", "Brothers", "Sisters", "Forever Bond", "Ride or Die", "Partner Crime", "Soul Sisters", "Brotherhood", "Unbreakable", "Family Ties", "Childhood Friends", "New Friends", "Road Trip", "Late Night", "Inside Joke", "Trust & Love", "Laughter Cure", "Together Strong", "Support Crew", "Team Work", "Hang Out", "Movie Night", "Game Day", "Brunch Date", "Beach Day", "Camp Fire", "Rainy Day", "Weekend Vibes"],
  travel: ["Mountain Escape", "Paris Streets", "Beach Sunset", "City Lights", "Wanderlust", "Road Trip", "Island Life", "Country Road", "Tropical Sun", "Snowy Peak", "Ancient City", "Harbor View", "Alpine Air", "Coastal Drive", "Safari Vibes", "Lake House", "Star Gazing", "Sunset Cruise", "Train Journey", "Foreign Land", "Local Market", "Temple Visit", "River Boat", "Cable Car", "Street Food", "Night Market", "Sunrise Hike", "Desert Camp", "Canyon View", "Water Town"],
  animals: ["Wild Beauty", "Pet Love", "Majestic Beast", "Cute Paws", "Feathers & Fur", "Ocean Life", "Jungle King", "Savanna Sun", "Arctic Fox", "Forest Friend", "Born Wild", "Grace & Speed", "Furry Friend", "Bird Song", "Butterfly Wing", "Puppy Eyes", "Cat Nap", "Horse Run", "Monkey See", "Bear Hug", "Ocean Swim", "Desert Walk", "Mountain Goat", "Night Owl", "Fox Den", "Wolf Pack", "Eagle Eye", "Snake Skin", "Frog Leap", "Rabbit Hop"],
};

function generateImages(): ImageItem[] {
  const catIds = Object.keys(titleTemplates);
  const results: ImageItem[] = [];
  for (const catId of catIds) {
    const titles = titleTemplates[catId];
    for (let i = 0; i < titles.length; i++) {
      const imgFile = `/src/assets/gallery/${catId}/${catId}-${(i % 20) + 1}.jpg`;
      const src = galleryGlob[imgFile] ?? "";
      results.push({
        id: `${catId}-${i}`,
        src,
        title: titles[i],
        category: catId,
        tags: [catId, titles[i].toLowerCase().replace(/\s+/g, "-")],
        ar: i % 3 === 0 ? "landscape" : i % 3 === 1 ? "square" : "portrait",
      });
    }
  }
  return results;
}

const CATEGORIES = [
  { id: "trending",  label: "Trending & Viral", emoji: "🔥" },
  { id: "aesthetic", label: "Aesthetic",       emoji: "✨" },
  { id: "couple",    label: "Love & Couple",   emoji: "💕" },
  { id: "tamil",     label: "Tamil Movies",    emoji: "🎥" },
  { id: "english",   label: "English Movies",  emoji: "🎬" },
  { id: "anime",     label: "Anime",           emoji: "⛩️" },
  { id: "cars",      label: "Cars",            emoji: "🚗" },
  { id: "bikes",     label: "Bikes",           emoji: "🏍️" },
  { id: "nature",    label: "Nature",          emoji: "🌿" },
  { id: "wallpapers",label: "Wallpapers",      emoji: "🖼️" },
  { id: "music",     label: "Music",           emoji: "🎵" },
  { id: "motivation",label: "Motivation",      emoji: "💪" },
  { id: "friendship",label: "Friendship",      emoji: "🤝" },
  { id: "travel",    label: "Travel",          emoji: "✈️" },
  { id: "animals",   label: "Animals",         emoji: "🐾" },
];

const galleryImages: ImageItem[] = generateImages();

const PRINT_FORMATS = [
  { id: "polaroid", name: "Polaroid Pack", price: 100, desc: "15 prints" },
  { id: "a4", name: "A4 Poster", price: 60, desc: "1 Pic" },
  { id: "a3", name: "A3 Poster", price: 100, desc: "1 Pic" },
  { id: "a2", name: "A2 Poster", price: 180, desc: "1 Pic" },
];

function MasonryGrid({ items, onImageClick }: { items: ImageItem[]; onImageClick: (item: ImageItem) => void }) {
  return (
    <div className="columns-2 md:columns-3 lg:columns-4 gap-3">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onImageClick(item)}
          className="break-inside-avoid mb-3 relative group rounded-2xl overflow-hidden cursor-pointer bg-secondary border border-border text-left shadow-card transition-shadow duration-300 hover:shadow-glow"
        >
          <img
            src={item.src}
            alt={item.title}
            loading="lazy"
            className="w-full block object-cover transition-transform duration-600 group-hover:scale-105 group-hover:brightness-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-primary bg-primary/20 backdrop-blur px-2.5 py-1 rounded-full w-fit border border-primary/20">
              {CATEGORIES.find((c) => c.id === item.category)?.emoji} {CATEGORIES.find((c) => c.id === item.category)?.label}
            </span>
            <span className="text-sm font-display text-white">{item.title}</span>
          </div>
        </button>
      ))}
    </div>
  );
}

export function Gallery() {
  const [activeCategory, setActiveCategory] = useState("trending");
  const [search, setSearch] = useState("");
  const [lightboxItem, setLightboxItem] = useState<ImageItem | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState("polaroid");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const [showAll, setShowAll] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const filteredImages = useMemo(() => {
    let result = galleryImages.filter((img) => img.category === activeCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (img) =>
          img.title.toLowerCase().includes(q) ||
          img.tags.some((t) => t.includes(q)) ||
          CATEGORIES.find((c) => c.id === img.category)?.label.toLowerCase().includes(q)
      );
    }
    return result;
  }, [activeCategory, search]);

  const filteredIds = useMemo(() => new Set(filteredImages.map((i) => i.id)), [filteredImages]);

  useEffect(() => { setShowAll(false); }, [activeCategory, search]);

  useEffect(() => {
    const ids = filteredImages.map((i) => i.id);
    const timer = setTimeout(() => setRevealed(new Set(ids)), 100);
    return () => clearTimeout(timer);
  }, [filteredImages]);

  useEffect(() => {
    if (lightboxItem) {
      const idx = filteredImages.findIndex((i) => i.id === lightboxItem.id);
      setLightboxIndex(idx);
    }
  }, [lightboxItem, filteredImages]);

  const openLightbox = useCallback((item: ImageItem) => {
    setLightboxItem(item);
    document.body.style.overflow = "hidden";
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxItem(null);
    document.body.style.overflow = "";
  }, []);

  const navigateLightbox = useCallback(
    (dir: number) => {
      const current = filteredImages.findIndex((i) => i.id === lightboxItem?.id);
      const next = (current + dir + filteredImages.length) % filteredImages.length;
      setLightboxItem(filteredImages[next]);
    },
    [lightboxItem, filteredImages]
  );

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!lightboxItem) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") navigateLightbox(-1);
      if (e.key === "ArrowRight") navigateLightbox(1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxItem, closeLightbox, navigateLightbox]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <section id="gallery" className="relative py-24 md:py-32 overflow-hidden bg-background">
      <div className="mx-auto max-w-7xl px-4 relative z-[1]">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-6 mb-8">
          <div>
            <p className="u-eyebrow mb-3">Gallery</p>
            <h2 className="font-display text-4xl md:text-6xl font-light leading-[1.05] text-balance max-w-xl">
              Real prints, <em className="italic text-gradient">real love.</em>
            </h2>
          </div>
          <p className="max-w-md text-foreground/60">
            A peek into the moments our customers chose to keep forever.
          </p>
        </div>

        <div className="rounded-[1.75rem] p-6 md:p-8 bg-secondary/50 border border-border">
          {/* Search */}
          <div className="relative mb-6 max-w-sm">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-primary/60" />
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search images…"
              className="w-full rounded-full py-2.5 pl-10 pr-4 text-sm outline-none transition-all duration-300 bg-background border border-border text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-foreground/40"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full grid place-items-center bg-foreground/10 text-foreground/60 hover:bg-primary/20 hover:text-primary transition-colors">
                <X size={12} />
              </button>
            )}
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 mb-6 pb-4 border-b border-border">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                  activeCategory === cat.id
                    ? "bg-lavender-gradient text-primary-foreground shadow-soft border-transparent"
                    : "bg-transparent text-foreground/60 border border-border hover:border-primary/50"
                }`}
              >
                <span>{cat.emoji}</span>
                {cat.label}
                <span
                  className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                    activeCategory === cat.id ? "bg-white/25 text-white" : "bg-foreground/10"
                  }`}
                >
                  {galleryImages.filter((i) => i.category === cat.id).length}
                </span>
              </button>
            ))}
          </div>

          {/* Results Info */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h3 className="font-display text-2xl font-light text-foreground">
                <em className="italic text-gradient">
                  {CATEGORIES.find((c) => c.id === activeCategory)?.label}
                </em>
              </h3>
            </div>
            <span className="text-xs text-foreground/40">
              <strong className="text-primary">{filteredImages.length}</strong> images
            </span>
          </div>

          {/* Grid */}
          {filteredImages.length > 0 ? (
            <>
              <MasonryGrid items={showAll ? filteredImages : filteredImages.slice(0, 10)} onImageClick={openLightbox} />
              {filteredImages.length > 10 && (
                <div className="flex justify-center mt-8">
                  <button
                    onClick={() => setShowAll((v) => !v)}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 border border-border text-foreground/70 hover:bg-secondary hover:border-primary/50"
                  >
                    {showAll ? "Show Less ↑" : `View More (${filteredImages.length - 10} more) ↓`}
                  </button>
                </div>
              )}
            </>
          ) : (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
            <span className="text-5xl opacity-40">🔍</span>
            <h3 className="font-display text-2xl font-light italic text-foreground/60">No images found</h3>
            <p className="text-sm text-foreground/40">Try a different search term or category.</p>
          </div>
        )}
      </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxItem && (
        <div
          className="fixed inset-0 z-[1000] flex items-start sm:items-center justify-center overflow-y-auto p-4 sm:p-5"
          style={{ background: "rgba(8,6,16,0.94)", backdropFilter: "blur(24px)" }}
        >
          <div className="relative z-[1] max-w-5xl w-full grid md:grid-cols-[1fr_280px] rounded-3xl overflow-hidden border" style={{ background: "#161221", borderColor: "rgba(167,139,250,0.12)", boxShadow: "0 0 0 1px rgba(167,139,250,0.15), 0 20px 60px rgba(124,58,237,0.25)" }}>
            {/* Image */}
            <div className="relative flex items-center justify-center min-h-[300px] bg-[#0e0c14]">
              <img src={lightboxItem.src} alt={lightboxItem.title} className="w-full h-full object-contain max-h-[55vh] md:max-h-[85vh]" />
              <button onClick={closeLightbox} className="absolute top-4 right-4 w-9 h-9 rounded-full grid place-items-center text-lg z-10 transition-colors hover:bg-[#e11d48] hover:text-white" style={{ background: "rgba(14,12,20,0.7)", backdropFilter: "blur(10px)", border: "1px solid rgba(167,139,250,0.12)", color: "rgba(248,245,255,0.6)" }}>
                <X size={16} />
              </button>
              <button onClick={() => navigateLightbox(-1)} className="absolute left-3.5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full grid place-items-center text-lg z-10 transition-colors hover:bg-[#7c3aed] hover:text-white" style={{ background: "rgba(14,12,20,0.7)", backdropFilter: "blur(10px)", border: "1px solid rgba(167,139,250,0.12)", color: "rgba(248,245,255,0.6)" }}>
                <ChevronLeft size={18} />
              </button>
              <button onClick={() => navigateLightbox(1)} className="absolute right-3.5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full grid place-items-center text-lg z-10 transition-colors hover:bg-[#7c3aed] hover:text-white" style={{ background: "rgba(14,12,20,0.7)", backdropFilter: "blur(10px)", border: "1px solid rgba(167,139,250,0.12)", color: "rgba(248,245,255,0.6)" }}>
                <ChevronRight size={18} />
              </button>
              <span className="absolute bottom-3.5 left-1/2 -translate-x-1/2 text-xs px-3 py-1 rounded-full whitespace-nowrap" style={{ background: "rgba(14,12,20,0.6)", backdropFilter: "blur(8px)", border: "1px solid rgba(167,139,250,0.12)", color: "rgba(248,245,255,0.3)" }}>
                {lightboxIndex + 1} / {filteredImages.length}
              </span>
            </div>

            {/* Sidebar */}
            <div className="p-6 md:p-7 flex flex-col gap-5 overflow-y-auto" style={{ borderLeft: "1px solid rgba(167,139,250,0.12)" }}>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider w-fit" style={{ background: "rgba(167,139,250,0.08)", border: "1px solid rgba(167,139,250,0.12)", color: "#a78bfa" }}>
                {CATEGORIES.find((c) => c.id === lightboxItem.category)?.emoji} {CATEGORIES.find((c) => c.id === lightboxItem.category)?.label}
              </span>
              <h3 className="font-display text-xl font-light italic" style={{ color: "#f8f5ff" }}>{lightboxItem.title}</h3>

              <div className="flex flex-col gap-2 text-xs" style={{ color: "rgba(248,245,255,0.3)" }}>
                {lightboxItem.tags.map((tag) => (
                  <div key={tag} className="flex justify-between pb-2" style={{ borderBottom: "1px solid rgba(167,139,250,0.12)" }}>
                    <strong style={{ color: "rgba(248,245,255,0.6)" }}>#{tag}</strong>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-2 mt-auto">
                <button
                  onClick={() => toggleFavorite(lightboxItem.id)}
                  className="flex items-center justify-center gap-2 py-3 px-5 rounded-xl text-sm font-semibold transition-all"
                  style={
                    favorites.has(lightboxItem.id)
                      ? { background: "rgba(167,139,250,0.25)", border: "1px solid rgba(167,139,250,0.25)", color: "#c4b5fd" }
                      : { background: "rgba(167,139,250,0.08)", border: "1px solid rgba(167,139,250,0.2)", color: "#c4b5fd" }
                  }
                >
                  <Heart size={14} fill={favorites.has(lightboxItem.id) ? "#c4b5fd" : "none"} />
                  {favorites.has(lightboxItem.id) ? "Saved" : "Save to Favourites"}
                </button>
                <button
                  onClick={() => { setShowPrintModal(true); }}
                  className="flex items-center justify-center gap-2 py-3 px-5 rounded-xl text-sm font-semibold transition-all hover:-translate-y-0.5"
                  style={{
                    background: "linear-gradient(135deg, #a78bfa, #7c3aed)",
                    color: "white",
                    boxShadow: "0 6px 20px rgba(124,58,237,0.35)",
                    border: "none",
                  }}
                >
                  🖨️ Print This Photo
                </button>
                <a
                  href={lightboxItem.src}
                  download
                  className="flex items-center justify-center gap-2 py-3 px-5 rounded-xl text-sm font-semibold transition-all"
                  style={{ background: "#1e1830", border: "1px solid rgba(167,139,250,0.12)", color: "rgba(248,245,255,0.6)" }}
                >
                  <Download size={14} /> Download
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Print Modal */}
      {showPrintModal && lightboxItem && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-5" style={{ background: "rgba(8,6,16,0.96)", backdropFilter: "blur(20px)" }}>
          <div className="relative z-[1] max-w-md w-full rounded-3xl p-8 border" style={{ background: "#161221", borderColor: "rgba(167,139,250,0.12)", boxShadow: "0 0 0 1px rgba(167,139,250,0.15), 0 20px 60px rgba(124,58,237,0.25)" }}>
            <h3 className="font-display text-2xl font-light italic mb-1" style={{ color: "#f8f5ff" }}>Print This Memory</h3>
            <p className="text-xs mb-6 leading-relaxed" style={{ color: "rgba(248,245,255,0.3)" }}>
              Choose your format and we'll have it ready for you. Share via WhatsApp to confirm your order.
            </p>
            <div className="rounded-xl overflow-hidden mb-5 max-h-[180px] flex items-center justify-center" style={{ background: "#0e0c14" }}>
              <img src={lightboxItem.src} alt="" className="w-full max-h-[180px] object-contain" />
            </div>
            <div className="grid grid-cols-2 gap-2.5 mb-5">
              {PRINT_FORMATS.map((fmt) => (
                <button
                  key={fmt.id}
                  onClick={() => setSelectedFormat(fmt.id)}
                  className="p-3 rounded-xl text-center transition-all"
                  style={
                    selectedFormat === fmt.id
                      ? { border: "2px solid #a78bfa", background: "rgba(167,139,250,0.08)" }
                      : { border: "2px solid transparent", background: "#1e1830" }
                  }
                >
                  <div className="text-sm font-semibold" style={{ color: "#f8f5ff" }}>{fmt.name}</div>
                  <div className="text-xs font-semibold" style={{ color: "#a78bfa" }}>₹{fmt.price} / {fmt.desc}</div>
                </button>
              ))}
            </div>
            <div className="flex gap-2.5">
              <button
                onClick={() => setShowPrintModal(false)}
                className="px-5 py-3 rounded-xl text-sm transition-all whitespace-nowrap"
                style={{ background: "#1e1830", border: "1px solid rgba(167,139,250,0.12)", color: "rgba(248,245,255,0.6)" }}
              >
                Cancel
              </button>
              <a
                href={`https://wa.me/917010249422?text=${encodeURIComponent(`Hi Hold My Pics! I'd like to order a print:\n\n• ${PRINT_FORMATS.find((f) => f.id === selectedFormat)?.name} (₹${PRINT_FORMATS.find((f) => f.id === selectedFormat)?.price})\n• Image: ${lightboxItem.title}\n\nLet me know the next steps!`)}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5"
                style={{
                  background: "linear-gradient(135deg, #a78bfa, #7c3aed)",
                  color: "white",
                  boxShadow: "0 6px 20px rgba(124,58,237,0.4)",
                  textDecoration: "none",
                }}
              >
                Order on WhatsApp →
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
