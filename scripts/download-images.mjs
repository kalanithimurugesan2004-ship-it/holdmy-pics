import https from "https";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(__dirname, "..", "src", "assets", "gallery");

fs.mkdirSync(outDir, { recursive: true });

const categories = {
  trending: [
    "photo-1611162617474-5b21e879e113", "photo-1511671782779-c97d3d27a1d4", "photo-1505236858219-8359eb29e329",
    "photo-1493225457124-a3eb161ffa5f", "photo-1519741497674-611481863552", "photo-1504711434969-e33886168d6c",
    "photo-1526374965328-7f61d4dc18c5", "photo-1559526324-593bc073d938", "photo-1517245386807-bb43f82c33c4",
    "photo-1531746790095-e5cb157e4644", "photo-1499750310107-5fef28a66643", "photo-1504674900247-0877df9cc836",
    "photo-1414235077428-338989a2e8c0", "photo-1476224203421-9ac39bcb332e", "photo-1482049016688-2d3e1b311543",
    "photo-1506354666786-959d6d497f1a", "photo-1485182708500-8ecb133252e2", "photo-1496412705862-e0087e16f4c6",
    "photo-1486427944544-d2c246c4b8f5", "photo-1490645935967-10de6ba17061",
  ],
  aesthetic: [
    "photo-1549490349-8643362247b5", "photo-1507525428034-b723cf961d3e", "photo-1519681393784-d120267933ba",
    "photo-1490730141103-6cac27aaab94", "photo-1475924156734-496f6cac6ec1", "photo-1465056506008-4a5e0f66c1f2",
    "photo-1504198453319-5ce911bafcde", "photo-1470071459604-5c3e6b8b5b5a", "photo-1518495973-ea2b1e6c6f8b",
    "photo-1501785888041-af3ef285b470", "photo-1469474968028-56623f02e42e", "photo-1441974231531-c6227db76b6e",
    "photo-1472214103451-9374bd1c798e", "photo-1475924156734-496f6cac6ec1", "photo-1439853949127-fa647821eba0",
    "photo-1447752875215-b2761acb3c5d", "photo-1504384308090-c894fdcc538d", "photo-1506744038136-46273834b3fb",
    "photo-1518837695005-2083093ee35b", "photo-1497436072909-60f360e1d4b1",
  ],
  couple: [
    "photo-1518199266791-5375a83190b7", "photo-1529333166437-7750a6dd5a70", "photo-1516589178581-6cd7833ae3b2",
    "photo-1529636798458-92182e662485", "photo-1510070112810-d4e9a46d9e91", "photo-1524502360275-0e3ae0e16577",
    "photo-1527529482834-b6245a10c5a3", "photo-1516589178581-6cd7833ae3b2", "photo-1543269865-cbf427effbad",
    "photo-1529156069898-49953e39b3ac", "photo-1516589178581-6cd7833ae3b2", "photo-1529333166437-7750a6dd5a70",
    "photo-1518199266791-5375a83190b7", "photo-1510070112810-d4e9a46d9e91", "photo-1529636798458-92182e662485",
    "photo-1543269865-cbf427effbad", "photo-1529156069898-49953e39b3ac", "photo-1524502360275-0e3ae0e16577",
    "photo-1527529482834-b6245a10c5a3", "photo-1529333166437-7750a6dd5a70",
  ],
  tamil: [
    "photo-1489599849927-2ee91cede3ba", "photo-1536440136628-849c177e76a1", "photo-1440404653325-ab127d49abc1",
    "photo-1535016120720-40c646be5580", "photo-1485846234645-a62644f84728", "photo-1536440136628-849c177e76a1",
    "photo-1489599849927-2ee91cede3ba", "photo-1440404653325-ab127d49abc1", "photo-1535016120720-40c646be5580",
    "photo-1485846234645-a62644f84728", "photo-1489599849927-2ee91cede3ba", "photo-1536440136628-849c177e76a1",
    "photo-1440404653325-ab127d49abc1", "photo-1535016120720-40c646be5580", "photo-1485846234645-a62644f84728",
    "photo-1489599849927-2ee91cede3ba", "photo-1536440136628-849c177e76a1", "photo-1440404653325-ab127d49abc1",
    "photo-1535016120720-40c646be5580", "photo-1485846234645-a62644f84728",
  ],
  english: [
    "photo-1489599849927-2ee91cede3ba", "photo-1536440136628-849c177e76a1", "photo-1440404653325-ab127d49abc1",
    "photo-1535016120720-40c646be5580", "photo-1485846234645-a62644f84728", "photo-1536440136628-849c177e76a1",
    "photo-1489599849927-2ee91cede3ba", "photo-1440404653325-ab127d49abc1", "photo-1535016120720-40c646be5580",
    "photo-1485846234645-a62644f84728", "photo-1489599849927-2ee91cede3ba", "photo-1536440136628-849c177e76a1",
    "photo-1440404653325-ab127d49abc1", "photo-1535016120720-40c646be5580", "photo-1485846234645-a62644f84728",
    "photo-1489599849927-2ee91cede3ba", "photo-1536440136628-849c177e76a1", "photo-1440404653325-ab127d49abc1",
    "photo-1535016120720-40c646be5580", "photo-1485846234645-a62644f84728",
  ],
  anime: [
    "photo-1528360983277-13d401cdc186", "photo-1480796927426-f609979314bd", "photo-1542051841857-5f90071e7989",
    "photo-1534447677768-be436bb09401", "photo-1560972550-3b7e5f2e7b8b", "photo-1528360983277-13d401cdc186",
    "photo-1480796927426-f609979314bd", "photo-1542051841857-5f90071e7989", "photo-1534447677768-be436bb09401",
    "photo-1560972550-3b7e5f2e7b8b", "photo-1528360983277-13d401cdc186", "photo-1480796927426-f609979314bd",
    "photo-1542051841857-5f90071e7989", "photo-1534447677768-be436bb09401", "photo-1560972550-3b7e5f2e7b8b",
    "photo-1528360983277-13d401cdc186", "photo-1480796927426-f609979314bd", "photo-1542051841857-5f90071e7989",
    "photo-1534447677768-be436bb09401", "photo-1560972550-3b7e5f2e7b8b",
  ],
  cars: [
    "photo-1503376780353-7e6692767b70", "photo-1492144534655-ae79c964c9d7", "photo-1544636331-e26879cd4d9b",
    "photo-1502161254119-e1442e8c7f8a", "photo-1568605117036-5fe5e7bab0b7", "photo-1503376780353-7e6692767b70",
    "photo-1492144534655-ae79c964c9d7", "photo-1544636331-e26879cd4d9b", "photo-1502161254119-e1442e8c7f8a",
    "photo-1568605117036-5fe5e7bab0b7", "photo-1503376780353-7e6692767b70", "photo-1492144534655-ae79c964c9d7",
    "photo-1544636331-e26879cd4d9b", "photo-1502161254119-e1442e8c7f8a", "photo-1568605117036-5fe5e7bab0b7",
    "photo-1503376780353-7e6692767b70", "photo-1492144534655-ae79c964c9d7", "photo-1544636331-e26879cd4d9b",
    "photo-1502161254119-e1442e8c7f8a", "photo-1568605117036-5fe5e7bab0b7",
  ],
  bikes: [
    "photo-1558981806-ec527fa84c39", "photo-1525160354320-d8e92641c563", "photo-1558618666-fcd25c85cd64",
    "photo-1507034589631-9433cc6bc453", "photo-1504215680853-026ed22f9d11", "photo-1558981806-ec527fa84c39",
    "photo-1525160354320-d8e92641c563", "photo-1558618666-fcd25c85cd64", "photo-1507034589631-9433cc6bc453",
    "photo-1504215680853-026ed22f9d11", "photo-1558981806-ec527fa84c39", "photo-1525160354320-d8e92641c563",
    "photo-1558618666-fcd25c85cd64", "photo-1507034589631-9433cc6bc453", "photo-1504215680853-026ed22f9d11",
    "photo-1558981806-ec527fa84c39", "photo-1525160354320-d8e92641c563", "photo-1558618666-fcd25c85cd64",
    "photo-1507034589631-9433cc6bc453", "photo-1504215680853-026ed22f9d11",
  ],
  nature: [
    "photo-1506905925346-21bda4d32df4", "photo-1470071459604-5c3e6b8b5b5a", "photo-1447752875215-b2761acb3c5d",
    "photo-1505144808419-1957a94ca61e", "photo-1472214103451-9374bd1c798e", "photo-1506905925346-21bda4d32df4",
    "photo-1470071459604-5c3e6b8b5b5a", "photo-1447752875215-b2761acb3c5d", "photo-1505144808419-1957a94ca61e",
    "photo-1472214103451-9374bd1c798e", "photo-1506905925346-21bda4d32df4", "photo-1470071459604-5c3e6b8b5b5a",
    "photo-1447752875215-b2761acb3c5d", "photo-1505144808419-1957a94ca61e", "photo-1472214103451-9374bd1c798e",
    "photo-1506905925346-21bda4d32df4", "photo-1470071459604-5c3e6b8b5b5a", "photo-1447752875215-b2761acb3c5d",
    "photo-1505144808419-1957a94ca61e", "photo-1472214103451-9374bd1c798e",
  ],
  wallpapers: [
    "photo-1541701494587-cb58502866ab", "photo-1519681393784-d120267933ba", "photo-1462331940025-496dfbfc7564",
    "photo-1506703719100-a0f3a48d2541", "photo-1558591710-4b4a1ae0f04d", "photo-1541701494587-cb58502866ab",
    "photo-1519681393784-d120267933ba", "photo-1462331940025-496dfbfc7564", "photo-1506703719100-a0f3a48d2541",
    "photo-1558591710-4b4a1ae0f04d", "photo-1541701494587-cb58502866ab", "photo-1519681393784-d120267933ba",
    "photo-1462331940025-496dfbfc7564", "photo-1506703719100-a0f3a48d2541", "photo-1558591710-4b4a1ae0f04d",
    "photo-1541701494587-cb58502866ab", "photo-1519681393784-d120267933ba", "photo-1462331940025-496dfbfc7564",
    "photo-1506703719100-a0f3a48d2541", "photo-1558591710-4b4a1ae0f04d",
  ],
  music: [
    "photo-1493225457124-a3eb161ffa5f", "photo-1501386761578-eac5c94b800a", "photo-1514525253161-7a46d19cd819",
    "photo-1499417266889-5fbf3f4941fb", "photo-1508700115892-45ecd05ae2ad", "photo-1493225457124-a3eb161ffa5f",
    "photo-1501386761578-eac5c94b800a", "photo-1514525253161-7a46d19cd819", "photo-1499417266889-5fbf3f4941fb",
    "photo-1508700115892-45ecd05ae2ad", "photo-1493225457124-a3eb161ffa5f", "photo-1501386761578-eac5c94b800a",
    "photo-1514525253161-7a46d19cd819", "photo-1499417266889-5fbf3f4941fb", "photo-1508700115892-45ecd05ae2ad",
    "photo-1493225457124-a3eb161ffa5f", "photo-1501386761578-eac5c94b800a", "photo-1514525253161-7a46d19cd819",
    "photo-1499417266889-5fbf3f4941fb", "photo-1508700115892-45ecd05ae2ad",
  ],
  motivation: [
    "photo-1499209974431-9dddcece7f88", "photo-1522202176988-66273c2fd55f", "photo-1526406915894-7bcd65f60845",
    "photo-1531482615713-2afd69097998", "photo-1552664730-d307ca884978", "photo-1499209974431-9dddcece7f88",
    "photo-1522202176988-66273c2fd55f", "photo-1526406915894-7bcd65f60845", "photo-1531482615713-2afd69097998",
    "photo-1552664730-d307ca884978", "photo-1499209974431-9dddcece7f88", "photo-1522202176988-66273c2fd55f",
    "photo-1526406915894-7bcd65f60845", "photo-1531482615713-2afd69097998", "photo-1552664730-d307ca884978",
    "photo-1499209974431-9dddcece7f88", "photo-1522202176988-66273c2fd55f", "photo-1526406915894-7bcd65f60845",
    "photo-1531482615713-2afd69097998", "photo-1552664730-d307ca884978",
  ],
  friendship: [
    "photo-1543269865-cbf427effbad", "photo-1529156069898-49953e39b3ac", "photo-1524502360275-0e3ae0e16577",
    "photo-1527529482834-b6245a10c5a3", "photo-1529636798458-92182e662485", "photo-1543269865-cbf427effbad",
    "photo-1529156069898-49953e39b3ac", "photo-1524502360275-0e3ae0e16577", "photo-1527529482834-b6245a10c5a3",
    "photo-1529636798458-92182e662485", "photo-1543269865-cbf427effbad", "photo-1529156069898-49953e39b3ac",
    "photo-1524502360275-0e3ae0e16577", "photo-1527529482834-b6245a10c5a3", "photo-1529636798458-92182e662485",
    "photo-1543269865-cbf427effbad", "photo-1529156069898-49953e39b3ac", "photo-1524502360275-0e3ae0e16577",
    "photo-1527529482834-b6245a10c5a3", "photo-1529636798458-92182e662485",
  ],
  travel: [
    "photo-1488646953014-85cb44e25828", "photo-1502602898657-3e91760cbb34", "photo-1488085061387-422e29b4007e",
    "photo-1469474968028-56623f02e42e", "photo-1501785888041-af3ef285b470", "photo-1488646953014-85cb44e25828",
    "photo-1502602898657-3e91760cbb34", "photo-1488085061387-422e29b4007e", "photo-1469474968028-56623f02e42e",
    "photo-1501785888041-af3ef285b470", "photo-1488646953014-85cb44e25828", "photo-1502602898657-3e91760cbb34",
    "photo-1488085061387-422e29b4007e", "photo-1469474968028-56623f02e42e", "photo-1501785888041-af3ef285b470",
    "photo-1488646953014-85cb44e25828", "photo-1502602898657-3e91760cbb34", "photo-1488085061387-422e29b4007e",
    "photo-1469474968028-56623f02e42e", "photo-1501785888041-af3ef285b470",
  ],
  animals: [
    "photo-1544568100-847a948585b9", "photo-1568572933382-74d440642117", "photo-1474511320723-9a56873867b5",
    "photo-1553882809-a4f57e595701", "photo-1543852786-1cf6624b9987", "photo-1544568100-847a948585b9",
    "photo-1568572933382-74d440642117", "photo-1474511320723-9a56873867b5", "photo-1553882809-a4f57e595701",
    "photo-1543852786-1cf6624b9987", "photo-1544568100-847a948585b9", "photo-1568572933382-74d440642117",
    "photo-1474511320723-9a56873867b5", "photo-1553882809-a4f57e595701", "photo-1543852786-1cf6624b9987",
    "photo-1544568100-847a948585b9", "photo-1568572933382-74d440642117", "photo-1474511320723-9a56873867b5",
    "photo-1553882809-a4f57e595701", "photo-1543852786-1cf6624b9987",
  ],
};

const titleTemplates = {
  trending: ["Trending Now", "Viral Vibes", "Hot Topic", "Popular Pick", "Buzz Worthy", "Top Hit", "Social Buzz", "Most Viewed", "Trend Alert", "Viral Moment", "Peak Popular", "Going Viral", "Hot Right Now", "On Fire", "Must See", "Hype Train", "All Time Fav", "Community Pick", "Rising Star", "Top Rated"],
  aesthetic: ["Soft Aesthetic", "Dreamy Vibes", "Pastel Dreams", "Minimal Mood", "Calm Waters", "Gentle Glow", "Pure Serenity", "Mellow Tone", "Subtle Beauty", "Quiet Elegance", "Soft Focus", "Pastel Sky", "Misty Morning", "Golden Haze", "Velvet Touch", "Whisper Soft", "Faded Glory", "Warm Glow", "Gentle Breeze", "Silent Peace"],
  couple: ["Couple Moments", "Romantic Sunset", "Love Story", "Together Forever", "Date Night", "Soulmates", "Heart & Soul", "True Love", "Endless Bond", "Sweet Escape", "Forever Us", "Hold Tight", "Love Notes", "First Dance", "Sunset Walk", "Starry Eyes", "My Better Half", "Us Against World", "Perfect Match", "Love Birds"],
  tamil: ["Cinema Magic", "Movie Still", "Kollywood Vibes", "Film Frame", "Screen Glow", "Tamil Cinema", "Star Power", "Scene Stealer", "Box Office", "Silver Screen", "Mass Moment", "Film Reel", "Behind Scenes", "Director Cut", "Award Night", "Drama Queen", "Action Hero", "Romantic Scene", "Village Story", "City Dreams"],
  english: ["Hollywood Glam", "Film Aesthetic", "Cinematic Shot", "Movie Scene", "Reel Life", "Award Season", "Red Carpet", "Star Glow", "Epic Scene", "Oscar Night", "Bollywood Vibes", "Netflix Mood", "Shot on Film", "Director Chair", "Script Page", "Blockbuster", "Indie Film", "Classic Scene", "New Release", "Fan Moment"],
  anime: ["Anime Dreamscape", "Sakura Season", "Tokyo Nights", "Manga Art", "Otaku World", "Spirit World", "Ninja Way", "Pirate King", "Hero Rising", "Magic Realm", "Dragon Soul", "Mecha Force", "Kawaii Vibes", "Shonen Jump", "Studio Ghibli", "Fantasy Land", "Samurai Path", "Cyber Punk", "School Days", "Battle Ready"],
  cars: ["Supercar Shot", "Classic Ride", "Street Racer", "Luxury Drive", "Night Run", "Track Day", "Speed Demon", "Turbo Boost", "V8 Power", "Drift King", "Garage Find", "Showroom Ready", "Auto Art", "Muscle Car", "Euro Spec", "JDM Legend", "Exotic Dream", "Race Ready", "Modded Life", "Clean Build"],
  bikes: ["Cafe Racer", "Vintage Bike", "Mountain Trail", "City Ride", "Speed Demon", "Iron Horse", "Road King", "Dirt Devil", "Street Fighter", "Cruiser Life", "Bobber Style", "Chopper Vibe", "Enduro King", "Moto GP", "Dual Sport", "Adventure Time", "Night Rider", "Weekend Ride", "Custom Build", "Two Wheels"],
  nature: ["Forest Glow", "Mist & Mountains", "Ocean Waves", "Golden Hour", "Wild Bloom", "Autumn Leaves", "River Flow", "Starry Sky", "Desert Dune", "Rain Forest", "Crystal Lake", "Mountain Peak", "Sunrise Glow", "Meadow Walk", "Waterfall Dream", "Ice & Snow", "Tropical Vibes", "Canyon View", "Lavender Field", "Coral Reef"],
  wallpapers: ["Dark Wallpaper", "Starry Night", "Abstract Art", "Neon Glow", "Deep Space", "Cyber Grid", "Geometric", "Liquid Flow", "Crystal Clear", "Fractal Eye", "Minimal Line", "Gradient Sky", "Pixel Perfect", "Glitch Art", "Hologram", "Vaporwave", "Outer Space", "Ocean Deep", "Fire & Ice", "Metallic"],
  music: ["Music Mood", "Concert Lights", "Studio Vibes", "Groove Session", "Beat Drop", "Vinyl Spin", "Acoustic Set", "Electric Soul", "Bass Line", "Melody Flow", "Rhythm Zone", "Live Stage", "DJ Set", "Headphone Jam", "Sound Wave", "Piano Keys", "Guitar Riff", "Drum Beat", "Vocal Harmony", "Late Night"],
  motivation: ["Stay Strong", "Dream Big", "Never Give Up", "Rise & Grind", "Focus Mode", "Hustle Hard", "Mind Over Matter", "Success Path", "Grind Time", "Limitless", "Be Your Best", "No Excuses", "Push Yourself", "Chase Greatness", "Believe & Achieve", "Growth Mindset", "Level Up", "Winning Streak", "Iron Will", "Unstoppable"],
  friendship: ["Best Friends", "Squad Goals", "Good Times", "Brothers", "Sisters", "Forever Bond", "Ride or Die", "Partner Crime", "Soul Sisters", "Brotherhood", "Unbreakable", "Family Ties", "Childhood Friends", "New Friends", "Road Trip", "Late Night", "Inside Joke", "Trust & Love", "Laughter Cure", "Together Strong"],
  travel: ["Mountain Escape", "Paris Streets", "Beach Sunset", "City Lights", "Wanderlust", "Road Trip", "Island Life", "Country Road", "Tropical Sun", "Snowy Peak", "Ancient City", "Harbor View", "Alpine Air", "Coastal Drive", "Safari Vibes", "Lake House", "Star Gazing", "Sunset Cruise", "Train Journey", "Foreign Land"],
  animals: ["Wild Beauty", "Pet Love", "Majestic Beast", "Cute Paws", "Feathers & Fur", "Ocean Life", "Jungle King", "Savanna Sun", "Arctic Fox", "Forest Friend", "Born Wild", "Grace & Speed", "Furry Friend", "Bird Song", "Butterfly Wing", "Puppy Eyes", "Cat Nap", "Horse Run", "Monkey See", "Bear Hug"],
};

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        fs.unlinkSync(dest);
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      res.pipe(file);
      file.on("finish", () => { file.close(); resolve(); });
    }).on("error", (err) => { fs.unlinkSync(dest); reject(err); });
  });
}

async function main() {
  let total = 0;
  for (const [cat, photos] of Object.entries(categories)) {
    const catDir = path.join(outDir, cat);
    fs.mkdirSync(catDir, { recursive: true });
    // clean existing
    for (const f of fs.readdirSync(catDir)) fs.unlinkSync(path.join(catDir, f));
    for (let i = 0; i < photos.length; i++) {
      const photoId = photos[i];
      const dest = path.join(catDir, `${cat}-${i + 1}.jpg`);
      const url = `https://images.unsplash.com/${photoId}?w=600&q=80`;
      try {
        process.stdout.write(`Downloading ${cat} ${i + 1}/${photos.length}... `);
        await download(url, dest);
        console.log("OK");
        total++;
      } catch (e) {
        console.log("FAILED -", e.message);
      }
    }
  }
  console.log(`\nDone! Downloaded ${total} images to ${outDir}`);
}

main();
