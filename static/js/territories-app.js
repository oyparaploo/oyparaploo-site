const { useState, useEffect, useCallback, useRef } = React;

const TERRITORIES_KEY = "oyparaploo-territories";
const ITEMS_KEY = "oyparaploo-territory-items";

const DEFAULT_TERRITORIES = [
  "Almost Level", "Back to the Scene",
  "Beautiful Garbage", "Bright Refusal",
  "Dead Load", "Eighty Stairs", "Everything That Arrived", "Five Measures",
  "Hired Grief", "Hospitable Hostility", "Middle Eye", "Noir Song",
  "No Hands", "Not Touching the Floor", "Off the Ground", "Ongoing",
  "Only Thread", "Pressure Ghosts", "Raw Kindred", "Someone's Home",
  "Still Ripening", "The First Brick", "The Ground Is Sharp", "The Other Way Up",
  "The Setup", "The Sitting", "Unclaimed Ground", "Uninvited Growth",
  "What Arrives Twice", "What Grows Over", "What Holds", "What the Soil Holds",
  "What Was Done to It", "What You Can Carry", "What You Can't Read from Here",
  "Whatever's At Hand", "Wings Over Eyes", "Wonderful Garbage",
];

const PALETTE = {
  bg: "#f9f7f4", bgWarm: "#f3efe9", bgDark: "#e8e2d9",
  text: "#1a1613", textLight: "#332c28", textMuted: "#5a5048",
  accent: "#8b4513", accentSoft: "#8b4723",
  border: "#b8aea3", borderLight: "#cdc4b9",
  card: "#fffdf9", tag: "#ddd5c9", tagHover: "#d0c6b8",
};

const fonts = {
  display: "'Lora', 'Georgia', serif",
  body: "'Source Serif Pro', 'Source Serif 4', Georgia, serif",
  ui: "'Work Sans', 'Helvetica Neue', sans-serif",
  meta: "'Inter', 'Helvetica Neue', sans-serif",
};

// --- localStorage helpers ---
function storageGet(key) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : null; }
  catch(e) { return null; }
}
function storageSet(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch(e) {}
}

function useWindowWidth() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1024);
  useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return w;
}

// ---- SEED DATA ----
const SEED_ITEMS = [
  { id: "item-seed-hosnedlova", type: "link", title: "Klára Hosnedlová — Nest (performance view)", url: "https://www.k-t-z.com/exhibitions/50-nest-klara-hosnedlova/", imageUrl: null, notes: "Mushrooms fruiting inside a modernist sculpture. Butterflies loose in a gallery built on transmission signals that stopped transmitting. She dressed performers in silicone and sat them on stone and let the living things do what the concrete could not ... the concrete just stood there.", territory: "Uninvited Growth", sources: [{ label: "the gallery that showed Nest", url: "https://www.k-t-z.com/exhibitions/50-nest-klara-hosnedlova/" }], palette: null, created: "2026-02-11T00:00:00.000Z", updated: "2026-02-11T00:00:00.000Z" },
  { id: "item-seed-mummymask", type: "image", title: "Old Kingdom mummy mask — Abusir, Egypt", url: "https://www.smb.museum/en/museums-institutions/aegyptisches-museum-und-papyrussammlung/collection-research/collection/", imageUrl: null, notes: "Seven pieces of a face reassembled and the mouth still has that specific set. Tomb robbery ... a Prussian expedition ... two world wars ... four thousand years of hands on it. The expression did not negotiate.", territory: "What Was Done to It", sources: [{ label: "Neues Museum, Berlin", url: "https://www.smb.museum/en/museums-institutions/aegyptisches-museum-und-papyrussammlung/collection-research/collection/" }], palette: null, created: "2026-02-11T00:00:00.000Z", updated: "2026-02-11T00:00:00.000Z" },
  { id: "item-seed-roadside", type: "note", title: "Roadside shrine, Oaxaca — plastic flowers wired to rebar", url: null, imageUrl: null, notes: "Someone bent rebar into a cross and wired plastic flowers to it and set it in concrete at the exact spot. The concrete cracked in the heat. The flowers did not fade. Nobody maintained it and nobody removed it. That is a territory.", territory: "Someone's Home", sources: [], palette: null, created: "2026-02-11T00:00:00.000Z", updated: "2026-02-11T00:00:00.000Z" },
  { id: "item-seed-merce", type: "link", title: "Merce Cunningham — Beach Birds for Camera (1991)", url: "https://www.mercecunningham.org/the-work/choreography/beach-birds/", imageUrl: null, notes: "Black and white costumes. The dancers move like shorebirds — sudden stops, diagonal walks, that specific head-tilt birds do before they commit. Cunningham separated the dance from the music from the set. Each one was made independently. They met for the first time in performance. That is the territory of things arriving at the same place by different routes.", territory: "What Arrives Twice", sources: [{ label: "Merce Cunningham Trust", url: "https://www.mercecunningham.org/the-work/choreography/beach-birds/" }], palette: null, created: "2026-02-11T00:00:00.000Z", updated: "2026-02-11T00:00:00.000Z" },
  { id: "item-seed-quipu", type: "note", title: "Quipu — the Inca accounting system made of knotted string", url: null, imageUrl: null, notes: "They encoded an empire's worth of information in knots. Color, position, direction of twist, distance between knots. The Spanish burned most of them. The ones that survived, we can count on but we cannot fully read. An entire civilization's records reduced to something that looks like a mop.", territory: "What You Can't Read from Here", sources: [], palette: null, created: "2026-02-11T00:00:00.000Z", updated: "2026-02-11T00:00:00.000Z" },
  { id: "item-seed-detroit", type: "note", title: "Detroit lots — where houses used to be, now prairie", url: null, imageUrl: null, notes: "Twelve thousand empty lots in Detroit where houses used to stand. The city couldn't mow them all so the prairie came back. Pheasants now. Fox. The soil remembers the foundations. The grass doesn't care.", territory: "What Grows Over", sources: [], palette: null, created: "2026-02-11T00:00:00.000Z", updated: "2026-02-11T00:00:00.000Z" },
  { id: "item-seed-kintsugi", type: "link", title: "Kintsugi — the Japanese art of golden repair", url: "https://en.wikipedia.org/wiki/Kintsugi", imageUrl: null, notes: "Break a bowl. Fix it with gold. The repair is now the most valuable part. This is not metaphor — it is practice. The crack is not hidden. The crack is lit.", territory: "Beautiful Garbage", sources: [{ label: "overview", url: "https://en.wikipedia.org/wiki/Kintsugi" }], palette: ["#C5A44E", "#1a1613", "#8B4513"], created: "2026-02-11T00:00:00.000Z", updated: "2026-02-11T00:00:00.000Z" },
  { id: "item-seed-taps", type: "note", title: "Taps — 24 notes, no harmony, played at every military funeral", url: null, imageUrl: null, notes: "Twenty-four notes. No harmony. One instrument. It was originally a lights-out signal. Now it means someone is being put in the ground. The melody has no resolve — it ends on the fifth, not the root. It literally does not come home.", territory: "Dead Load", sources: [], palette: null, created: "2026-02-11T00:00:00.000Z", updated: "2026-02-11T00:00:00.000Z" },
  { id: "item-seed-weiwei", type: "link", title: "Ai Weiwei — Remembering (2009)", url: "https://www.aiweiwei.com/", imageUrl: null, notes: "Nine thousand children's backpacks on the facade of the Haus der Kunst. They spelled out a sentence in Chinese: 'She lived happily in this world for seven years.' For the children killed in the Sichuan earthquake. In buildings that fell because the concrete was cut with sand.", territory: "Hired Grief", sources: [{ label: "Ai Weiwei studio", url: "https://www.aiweiwei.com/" }], palette: null, created: "2026-02-11T00:00:00.000Z", updated: "2026-02-11T00:00:00.000Z" },
  { id: "item-seed-mothership", type: "link", title: "Parliament-Funkadelic — Mothership Connection (1975)", url: "https://en.wikipedia.org/wiki/Mothership_Connection", imageUrl: null, notes: "George Clinton built a spaceship and landed it on stage. The message: Black people are from the future. The funk was the proof. The costumes were the evidence. The groove was the transport. This is what refusal looks like when it dances.", territory: "Bright Refusal", sources: [{ label: "album", url: "https://en.wikipedia.org/wiki/Mothership_Connection" }], palette: null, created: "2026-02-11T00:00:00.000Z", updated: "2026-02-11T00:00:00.000Z" },
  { id: "item-seed-stairwell", type: "note", title: "Stairwell in Marseille — Le Corbusier's Unité d'Habitation", url: null, imageUrl: null, notes: "Eighty stairs between the ground and the roof terrace. The concrete is raw. The color is in the doors — red, yellow, blue, green. A brutalist building that people actually live in and fight about and love. The stairwell smells like dinner on every floor.", territory: "Eighty Stairs", sources: [], palette: ["#CC3333", "#E8B828", "#2255AA", "#228833"], created: "2026-02-11T00:00:00.000Z", updated: "2026-02-11T00:00:00.000Z" },
  { id: "item-seed-borges", type: "note", title: "Borges — 'The Garden of Forking Paths' (1941)", url: null, imageUrl: null, notes: "A labyrinth that is a book. A book that is all possible outcomes. Every decision creates a fork and every fork is real. Borges wrote it as a spy story. The spy story is the least important part.", territory: "The Setup", sources: [], palette: null, created: "2026-02-11T00:00:00.000Z", updated: "2026-02-11T00:00:00.000Z" },
  { id: "item-seed-braille", type: "note", title: "Braille — a teenager's invention, banned for 10 years", url: null, imageUrl: null, notes: "Louis Braille was fifteen. He adapted a military night-writing code into a reading system for the blind. The school banned it for ten years because the sighted teachers couldn't read it. The students used it in secret. Knowledge as territory — who gets to read, who decides.", territory: "Bright Refusal", sources: [], palette: null, created: "2026-02-11T00:00:00.000Z", updated: "2026-02-11T00:00:00.000Z" },
  { id: "item-seed-tulsa", type: "note", title: "Greenwood District, Tulsa — before and after 1921", url: null, imageUrl: null, notes: "They called it Black Wall Street. Thirty-five blocks of Black-owned businesses, hospitals, schools, a library, hotels. Then airplanes dropped firebombs on it. Three hundred dead, ten thousand homeless, every building gone. The city paved over the mass graves and put a highway on top. That is what 'what was done to it' means.", territory: "What Was Done to It", sources: [], palette: null, created: "2026-02-11T00:00:00.000Z", updated: "2026-02-11T00:00:00.000Z" },
  { id: "item-seed-shibam", type: "link", title: "Shibam, Yemen — the Manhattan of the desert", url: "https://whc.unesco.org/en/list/192/", imageUrl: null, notes: "Mud-brick towers, some sixteen stories, built in the 1500s. Still standing. Still lived in. The whole city is made of earth. When it rains they replaster the walls by hand. Five hundred years of maintenance. That is what holding looks like.", territory: "What Holds", sources: [{ label: "UNESCO", url: "https://whc.unesco.org/en/list/192/" }], palette: null, created: "2026-02-11T00:00:00.000Z", updated: "2026-02-11T00:00:00.000Z" },
  { id: "item-seed-rauschenberg", type: "link", title: "Rauschenberg — Erased de Kooning Drawing (1953)", url: "https://www.sfmoma.org/artwork/98.298/", imageUrl: null, notes: "He asked de Kooning for a drawing. De Kooning gave him one he would miss. Rauschenberg erased it. Took a month. The eraser marks are the drawing now. You can still see ghosts of the original if you look from the right angle. Territory: the space between permission and destruction.", territory: "Off the Ground", sources: [{ label: "SFMOMA", url: "https://www.sfmoma.org/artwork/98.298/" }], palette: null, created: "2026-02-11T00:00:00.000Z", updated: "2026-02-11T00:00:00.000Z" },
  { id: "item-seed-grandmothers", type: "note", title: "Grandmothers of the Plaza de Mayo — walking since 1977", url: null, imageUrl: null, notes: "Their grandchildren were stolen. The military took pregnant prisoners, let them give birth, then gave the babies to loyalist families. The grandmothers have been walking in a circle in the plaza every Thursday since 1977. They have found 133 of the stolen children. They are still walking.", territory: "Ongoing", sources: [], palette: null, created: "2026-02-11T00:00:00.000Z", updated: "2026-02-11T00:00:00.000Z" },
  { id: "item-seed-hennessy", type: "note", title: "Keith Hennessy — Turbulence (a dance about the economy)", url: null, imageUrl: null, notes: "He danced about the 2008 financial crisis. He used a leaf blower. Money flew everywhere. The audience scrambled for it. That was the piece. The scramble was the piece.", territory: "The Ground Is Sharp", sources: [], palette: null, created: "2026-02-11T00:00:00.000Z", updated: "2026-02-11T00:00:00.000Z" },
  { id: "item-seed-thread", type: "note", title: "A single thread holding a button — the last repair", url: null, imageUrl: null, notes: "A coat button held by one thread. Someone repaired it once. That repair held for years. Now it's the last thread. The button hasn't fallen yet. Everything about wear and care and the moment before loss, in one thread.", territory: "Only Thread", sources: [], palette: null, created: "2026-02-11T00:00:00.000Z", updated: "2026-02-11T00:00:00.000Z" },
  { id: "item-seed-watts", type: "link", title: "Watts Towers — Simon Rodia worked alone for 33 years", url: "https://www.wattstowers.org/", imageUrl: null, notes: "No scaffolding. No bolts. No welds. No drawings. Just a man and found objects — broken bottles, tiles, shells, pottery. Thirty-three years of climbing and cementing. When he finished he gave the property to a neighbor and left and never came back. He never explained it.", territory: "Wonderful Garbage", sources: [{ label: "Watts Towers", url: "https://www.wattstowers.org/" }], palette: null, created: "2026-02-11T00:00:00.000Z", updated: "2026-02-11T00:00:00.000Z" },
  { id: "item-seed-hampton", type: "link", title: "James Hampton — The Throne of the Third Heaven (1950-1964)", url: "https://americanart.si.edu/artwork/throne-third-heaven-nations-millennium-general-assembly-9897", imageUrl: null, notes: "A janitor in Washington D.C. built a throne room for Jesus out of aluminum foil, old furniture, light bulbs, and purple kraft paper. In a garage. For fourteen years. Nobody knew until he died. The notebook found with it is written in a script no one has decoded.", territory: "What You Can't Read from Here", sources: [{ label: "Smithsonian American Art Museum", url: "https://americanart.si.edu/artwork/throne-third-heaven-nations-millennium-general-assembly-9897" }], palette: null, created: "2026-02-11T00:00:00.000Z", updated: "2026-02-11T00:00:00.000Z" },
  { id: "item-seed-eli", type: "note", title: "Eli — the boy who carried a refrigerator door across South Sudan", url: null, imageUrl: null, notes: "In a documentary about the Lost Boys of Sudan. A boy named Eli carried a refrigerator door for hundreds of miles across the desert. He had never seen a refrigerator work. He just wanted to carry something that opened and closed. A door to nowhere that he could open.", territory: "What You Can Carry", sources: [], palette: null, created: "2026-02-11T00:00:00.000Z", updated: "2026-02-11T00:00:00.000Z" },
  { id: "item-seed-mies", type: "note", title: "Mies van der Rohe — 'Almost nothing'", url: null, imageUrl: null, notes: "He said the goal was 'almost nothing.' Then he built buildings out of steel and glass that cost more than cathedrals. The simplicity was the most expensive thing in the room. 'Almost nothing' turns out to require everything.", territory: "Almost Level", sources: [], palette: null, created: "2026-02-11T00:00:00.000Z", updated: "2026-02-11T00:00:00.000Z" },
  { id: "item-seed-market", type: "note", title: "Mercado de Sonora, Mexico City — the witchcraft market", url: null, imageUrl: null, notes: "You can buy a cure for anything. Love potions next to plumbing supplies next to live animals next to dried herbs next to Santa Muerte candles. The categories refuse to separate. That is how markets actually work when colonialism hasn't organized them yet.", territory: "Hospitable Hostility", sources: [], palette: null, created: "2026-02-11T00:00:00.000Z", updated: "2026-02-11T00:00:00.000Z" },
  { id: "item-seed-eli2", type: "note", title: "Eliud Kipchoge — breaking the two-hour marathon (2019)", url: null, imageUrl: null, notes: "Forty-one pacers in rotating teams. A car projecting a laser on the road. Perfect weather chosen by algorithm. It doesn't count as an official record because the conditions were engineered. He ran it in 1:59:40. The asterisk is part of the territory — what counts, who decides, what the body did regardless.", territory: "The Setup", sources: [], palette: null, created: "2026-02-11T00:00:00.000Z", updated: "2026-02-11T00:00:00.000Z" },
  { id: "item-seed-sankofa", type: "note", title: "Sankofa — the Akan symbol of a bird looking backward", url: null, imageUrl: null, notes: "A bird with its feet facing forward and its head turned back, carrying an egg in its mouth. It means: go back and get it. Whatever you lost, whatever you left, whatever was taken — go back. The egg is what you're carrying into the future. The direction is both.", territory: "Back to the Scene", sources: [], palette: null, created: "2026-02-11T00:00:00.000Z", updated: "2026-02-11T00:00:00.000Z" },
  { id: "item-seed-sitting", type: "note", title: "Marina Abramović — The Artist Is Present (2010)", url: null, imageUrl: null, notes: "She sat in a chair at MoMA for 736 hours. People sat across from her. Some cried. She did not move. The piece was the sitting. Not the endurance — the willingness to receive. Every person who sat down changed the piece. None of them changed her position.", territory: "The Sitting", sources: [], palette: null, created: "2026-02-11T00:00:00.000Z", updated: "2026-02-11T00:00:00.000Z" },
  { id: "item-seed-brick", type: "note", title: "The first brick of a building that was never approved", url: null, imageUrl: null, notes: "In some cities, if you lay the first brick before the permit is denied, the building has standing. The first brick is not construction — it is a legal claim. A territory established by material fact. One brick, and the ground changes status.", territory: "The First Brick", sources: [], palette: null, created: "2026-02-11T00:00:00.000Z", updated: "2026-02-11T00:00:00.000Z" },
  { id: "item-seed-nocturne", type: "link", title: "Chopin — Nocturne in E-flat major, Op. 9 No. 2", url: "https://en.wikipedia.org/wiki/Nocturnes,_Op._9_(Chopin)", imageUrl: null, notes: "The left hand keeps time. The right hand wanders. It is the most performed piece of classical music in the world and it still sounds like someone is alone in a room at 2 AM thinking about one specific person. That is what five measures can hold — an entire interior.", territory: "Five Measures", sources: [{ label: "about the Nocturnes", url: "https://en.wikipedia.org/wiki/Nocturnes,_Op._9_(Chopin)" }], palette: null, created: "2026-02-11T00:00:00.000Z", updated: "2026-02-11T00:00:00.000Z" },
  { id: "item-seed-shipbreaking", type: "note", title: "Ship-breaking yards, Chittagong, Bangladesh", url: null, imageUrl: null, notes: "Men disassemble oil tankers by hand on the beach. No cranes. Blowtorches and gravity. The steel gets recycled into rebar for buildings. The asbestos goes into the water. The workers make four dollars a day. A ship that crossed every ocean, taken apart by hands that will never leave that beach.", territory: "Raw Kindred", sources: [], palette: null, created: "2026-02-11T00:00:00.000Z", updated: "2026-02-11T00:00:00.000Z" },
  { id: "item-seed-still", type: "note", title: "A persimmon tree still bearing fruit in a demolished neighborhood", url: null, imageUrl: null, notes: "Every house on the block was demolished. The persimmon tree was in someone's backyard. It is now in no one's backyard but it fruited in October anyway. Birds come. The fruit falls and ferments on concrete. The tree does not know the neighborhood is gone.", territory: "Still Ripening", sources: [], palette: null, created: "2026-02-11T00:00:00.000Z", updated: "2026-02-11T00:00:00.000Z" },
  { id: "item-seed-capoeira", type: "note", title: "Capoeira — the fight disguised as a dance", url: null, imageUrl: null, notes: "Enslaved people in Brazil were forbidden to practice fighting. So they made it look like dancing. The berimbau plays. The roda forms. The fight is the dance is the resistance. The disguise became the art. The art kept the fight alive. When it was no longer forbidden, the disguise stayed because it was the most beautiful part.", territory: "The Other Way Up", sources: [], palette: null, created: "2026-02-11T00:00:00.000Z", updated: "2026-02-11T00:00:00.000Z" },
  { id: "item-seed-middle", type: "note", title: "The middle eye — the thing you see when you stop choosing sides", url: null, imageUrl: null, notes: "Not the left eye. Not the right eye. The one that opens when both close. This is not mysticism — it is methodology. When you stop sorting into this/that, something else becomes visible. The middle eye sees what the choosing eyes edited out.", territory: "Middle Eye", sources: [], palette: null, created: "2026-02-11T00:00:00.000Z", updated: "2026-02-11T00:00:00.000Z" },
  { id: "item-seed-nofloor", type: "note", title: "Yoko Ono — Painting to Be Stepped On (1960)", url: null, imageUrl: null, notes: "A canvas on the floor. The instruction: step on it. The art is the permission and the hesitation. Most people can't do it. The ones who do leave a mark they didn't intend to make. Ono understood: the floor is where the authority lives.", territory: "Not Touching the Floor", sources: [], palette: null, created: "2026-02-11T00:00:00.000Z", updated: "2026-02-11T00:00:00.000Z" },
];

function Territories() {
  const [items, setItems] = useState([]);
  const [territories, setTerritories] = useState(DEFAULT_TERRITORIES);
  const [activeTerritory, setActiveTerritory] = useState("All");
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [showAddTerritory, setShowAddTerritory] = useState(false);
  const [newTerritoryName, setNewTerritoryName] = useState("");
  const [expandedItem, setExpandedItem] = useState(null);
  const formRef = useRef(null);
  const width = useWindowWidth();
  const mobile = width < 768;
  const pad = mobile ? "16px" : "32px";

  const [form, setForm] = useState({
    type: "link", title: "", url: "", imageUrl: "", notes: "",
    territory: "Unclaimed Ground", palette: [], paletteInput: "",
    sources: [{ label: "", url: "" }],
  });

  // Load data
  useEffect(() => {
    const saved = storageGet(ITEMS_KEY);
    const savedTerr = storageGet(TERRITORIES_KEY);
    if (savedTerr) setTerritories(savedTerr);
    if (saved && saved.length > 0) {
      setItems(saved);
    } else {
      setItems(SEED_ITEMS);
      storageSet(ITEMS_KEY, SEED_ITEMS);
    }
    setLoading(false);
  }, []);

  // Save data
  useEffect(() => {
    if (!loading) {
      storageSet(ITEMS_KEY, items);
      storageSet(TERRITORIES_KEY, territories);
    }
  }, [items, territories, loading]);

  const filtered = activeTerritory === "All" ? items : items.filter(i => i.territory === activeTerritory);
  const counts = {};
  items.forEach(i => { counts[i.territory] = (counts[i.territory] || 0) + 1; });

  function resetForm() {
    setForm({ type: "link", title: "", url: "", imageUrl: "", notes: "", territory: "Unclaimed Ground", palette: [], paletteInput: "", sources: [{ label: "", url: "" }] });
    setEditingItem(null);
  }

  function handleSubmit() {
    if (!form.title.trim()) return;
    const now = new Date().toISOString();
    const pal = form.paletteInput ? form.paletteInput.split(",").map(s => s.trim()).filter(Boolean) : form.palette;
    if (editingItem) {
      setItems(prev => prev.map(i => i.id === editingItem ? { ...i, ...form, palette: pal, sources: form.sources.filter(s => s.label || s.url), updated: now } : i));
    } else {
      const newItem = { ...form, id: "item-" + Date.now(), palette: pal, sources: form.sources.filter(s => s.label || s.url), created: now, updated: now };
      setItems(prev => [newItem, ...prev]);
    }
    resetForm();
    setShowAddForm(false);
  }

  function startEdit(item) {
    setForm({ ...item, paletteInput: (item.palette || []).join(", "), sources: item.sources && item.sources.length ? item.sources : [{ label: "", url: "" }] });
    setEditingItem(item.id);
    setShowAddForm(true);
    setTimeout(() => formRef.current && formRef.current.scrollIntoView({ behavior: "smooth" }), 100);
  }

  function deleteItem(id) {
    if (confirm("Delete this entry?")) setItems(prev => prev.filter(i => i.id !== id));
  }

  function addTerritory() {
    const name = newTerritoryName.trim();
    if (name && !territories.includes(name)) {
      setTerritories(prev => [...prev, name].sort());
      setNewTerritoryName("");
      setShowAddTerritory(false);
    }
  }

  // ---- STYLES ----
  const s = {
    page: { background: PALETTE.bg, minHeight: "100%", fontFamily: fonts.body },
    hero: { padding: mobile ? "40px 16px 32px" : "56px 32px 40px", borderBottom: "1px solid " + PALETTE.borderLight },
    heroTitle: { fontFamily: fonts.display, fontSize: mobile ? "32px" : "44px", fontWeight: 600, color: PALETTE.text, letterSpacing: "0.03em", marginBottom: "12px" },
    heroSub: { fontFamily: fonts.body, fontSize: mobile ? "17px" : "19px", color: PALETTE.textMuted, lineHeight: 1.6, maxWidth: "600px" },
    toolbar: { display: "flex", flexWrap: "wrap", gap: "8px", padding: pad, borderBottom: "1px solid " + PALETTE.borderLight, alignItems: "center" },
    tag: (active) => ({ fontFamily: fonts.ui, fontSize: "14px", fontWeight: active ? 600 : 400, padding: "6px 14px", borderRadius: "20px", border: "1px solid " + (active ? PALETTE.accent : PALETTE.borderLight), background: active ? PALETTE.accent : PALETTE.card, color: active ? "#fff" : PALETTE.textLight, cursor: "pointer", transition: "all 0.15s", whiteSpace: "nowrap" }),
    addBtn: { fontFamily: fonts.ui, fontSize: "14px", fontWeight: 600, padding: "8px 18px", borderRadius: "20px", border: "none", background: PALETTE.text, color: PALETTE.bg, cursor: "pointer", marginLeft: "auto" },
    grid: { display: "grid", gridTemplateColumns: mobile ? "1fr" : "repeat(auto-fill, minmax(340px, 1fr))", gap: "20px", padding: pad },
    card: { background: PALETTE.card, border: "1px solid " + PALETTE.borderLight, borderRadius: "8px", padding: "24px", transition: "box-shadow 0.2s", cursor: "pointer" },
    cardTitle: { fontFamily: fonts.display, fontSize: "20px", fontWeight: 600, color: PALETTE.text, lineHeight: 1.35, marginBottom: "8px" },
    cardTerritory: { fontFamily: fonts.meta, fontSize: "13px", fontWeight: 500, color: PALETTE.accent, marginBottom: "12px", letterSpacing: "0.02em" },
    cardNotes: { fontFamily: fonts.body, fontSize: "16px", color: PALETTE.textLight, lineHeight: 1.65, marginBottom: "16px" },
    cardMeta: { fontFamily: fonts.meta, fontSize: "12px", color: PALETTE.textMuted, display: "flex", gap: "12px", flexWrap: "wrap" },
    sourceLink: { fontFamily: fonts.meta, fontSize: "13px", color: PALETTE.accent, textDecoration: "underline", textUnderlineOffset: "2px" },
    formWrap: { background: PALETTE.bgWarm, border: "1px solid " + PALETTE.borderLight, borderRadius: "8px", margin: pad, padding: "24px" },
    input: { fontFamily: fonts.ui, fontSize: "15px", padding: "10px 14px", border: "1px solid " + PALETTE.borderLight, borderRadius: "6px", background: PALETTE.card, color: PALETTE.text, width: "100%", marginBottom: "12px", outline: "none" },
    textarea: { fontFamily: fonts.body, fontSize: "15px", padding: "10px 14px", border: "1px solid " + PALETTE.borderLight, borderRadius: "6px", background: PALETTE.card, color: PALETTE.text, width: "100%", minHeight: "100px", marginBottom: "12px", resize: "vertical", outline: "none" },
    select: { fontFamily: fonts.ui, fontSize: "15px", padding: "10px 14px", border: "1px solid " + PALETTE.borderLight, borderRadius: "6px", background: PALETTE.card, color: PALETTE.text, width: "100%", marginBottom: "12px" },
    label: { fontFamily: fonts.ui, fontSize: "13px", fontWeight: 600, color: PALETTE.textMuted, display: "block", marginBottom: "4px", letterSpacing: "0.04em", textTransform: "uppercase" },
    formBtn: (primary) => ({ fontFamily: fonts.ui, fontSize: "14px", fontWeight: 600, padding: "10px 20px", borderRadius: "6px", border: primary ? "none" : "1px solid " + PALETTE.borderLight, background: primary ? PALETTE.accent : PALETTE.card, color: primary ? "#fff" : PALETTE.textLight, cursor: "pointer", marginRight: "8px" }),
    paletteRow: { display: "flex", gap: "6px", marginBottom: "12px", flexWrap: "wrap" },
    paletteSwatch: (c) => ({ width: "28px", height: "28px", borderRadius: "50%", background: c, border: "2px solid " + PALETTE.borderLight }),
    empty: { fontFamily: fonts.body, fontSize: "17px", color: PALETTE.textMuted, textAlign: "center", padding: "60px 20px", lineHeight: 1.6 },
  };

  if (loading) return React.createElement("div", { style: { ...s.page, display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" } },
    React.createElement("p", { style: { fontFamily: fonts.ui, color: PALETTE.textMuted } }, "Loading territories...")
  );

  // ---- RENDER ----
  return React.createElement("div", { style: s.page },
    // Hero
    React.createElement("div", { style: s.hero },
      React.createElement("h1", { style: s.heroTitle }, "Territories"),
      React.createElement("p", { style: s.heroSub }, "A collection of references, gestures, and source materials. Things that arrived and were given a name.")
    ),

    // Territory tags
    React.createElement("div", { style: s.toolbar },
      React.createElement("span", { style: s.tag(activeTerritory === "All"), onClick: () => setActiveTerritory("All") }, "All (" + items.length + ")"),
      territories.filter(t => counts[t]).map(t =>
        React.createElement("span", { key: t, style: s.tag(activeTerritory === t), onClick: () => setActiveTerritory(t) }, t + " (" + (counts[t] || 0) + ")")
      ),
      !showAddTerritory && React.createElement("span", { style: { ...s.tag(false), borderStyle: "dashed", fontSize: "13px" }, onClick: () => setShowAddTerritory(true) }, "+ territory"),
      showAddTerritory && React.createElement("span", { style: { display: "flex", gap: "4px", alignItems: "center" } },
        React.createElement("input", { style: { ...s.input, width: "160px", marginBottom: 0, fontSize: "13px", padding: "6px 10px" }, placeholder: "Territory name", value: newTerritoryName, onChange: e => setNewTerritoryName(e.target.value), onKeyDown: e => e.key === "Enter" && addTerritory() }),
        React.createElement("button", { style: { ...s.formBtn(true), padding: "6px 12px", fontSize: "13px", marginRight: 0 }, onClick: addTerritory }, "Add"),
        React.createElement("button", { style: { ...s.formBtn(false), padding: "6px 12px", fontSize: "13px", marginRight: 0 }, onClick: () => { setShowAddTerritory(false); setNewTerritoryName(""); } }, "×")
      ),
      React.createElement("button", { style: s.addBtn, onClick: () => { resetForm(); setShowAddForm(!showAddForm); } }, showAddForm ? "Cancel" : "+ Add Entry")
    ),

    // Add/Edit form
    showAddForm && React.createElement("div", { ref: formRef, style: s.formWrap },
      React.createElement("div", { style: { display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: "12px", marginBottom: "12px" } },
        React.createElement("div", null,
          React.createElement("label", { style: s.label }, "Type"),
          React.createElement("select", { style: s.select, value: form.type, onChange: e => setForm(f => ({ ...f, type: e.target.value })) },
            React.createElement("option", { value: "link" }, "Link"),
            React.createElement("option", { value: "image" }, "Image"),
            React.createElement("option", { value: "note" }, "Note")
          )
        ),
        React.createElement("div", null,
          React.createElement("label", { style: s.label }, "Territory"),
          React.createElement("select", { style: s.select, value: form.territory, onChange: e => setForm(f => ({ ...f, territory: e.target.value })) },
            territories.map(t => React.createElement("option", { key: t, value: t }, t))
          )
        )
      ),
      React.createElement("label", { style: s.label }, "Title"),
      React.createElement("input", { style: s.input, value: form.title, onChange: e => setForm(f => ({ ...f, title: e.target.value })), placeholder: "What is this?" }),
      (form.type === "link" || form.type === "image") && React.createElement(React.Fragment, null,
        React.createElement("label", { style: s.label }, "URL"),
        React.createElement("input", { style: s.input, value: form.url, onChange: e => setForm(f => ({ ...f, url: e.target.value })), placeholder: "https://..." })
      ),
      React.createElement("label", { style: s.label }, "Notes"),
      React.createElement("textarea", { style: s.textarea, value: form.notes, onChange: e => setForm(f => ({ ...f, notes: e.target.value })), placeholder: "What does this hold? Why does it belong here?" }),
      React.createElement("label", { style: s.label }, "Palette (comma-separated hex)"),
      React.createElement("input", { style: s.input, value: form.paletteInput, onChange: e => setForm(f => ({ ...f, paletteInput: e.target.value })), placeholder: "#8b4513, #1a1613, #f9f7f4" }),
      React.createElement("label", { style: s.label }, "Sources"),
      form.sources.map((src, i) =>
        React.createElement("div", { key: i, style: { display: "flex", gap: "8px", marginBottom: "8px" } },
          React.createElement("input", { style: { ...s.input, flex: 1, marginBottom: 0 }, value: src.label, onChange: e => { const ns = [...form.sources]; ns[i] = { ...ns[i], label: e.target.value }; setForm(f => ({ ...f, sources: ns })); }, placeholder: "Label" }),
          React.createElement("input", { style: { ...s.input, flex: 2, marginBottom: 0 }, value: src.url, onChange: e => { const ns = [...form.sources]; ns[i] = { ...ns[i], url: e.target.value }; setForm(f => ({ ...f, sources: ns })); }, placeholder: "URL" }),
          form.sources.length > 1 && React.createElement("button", { style: { ...s.formBtn(false), padding: "6px 10px", marginRight: 0 }, onClick: () => setForm(f => ({ ...f, sources: f.sources.filter((_, j) => j !== i) })) }, "×")
        )
      ),
      React.createElement("button", { style: { ...s.formBtn(false), fontSize: "13px", marginBottom: "16px" }, onClick: () => setForm(f => ({ ...f, sources: [...f.sources, { label: "", url: "" }] })) }, "+ Source"),
      React.createElement("div", { style: { display: "flex", gap: "8px" } },
        React.createElement("button", { style: s.formBtn(true), onClick: handleSubmit }, editingItem ? "Save Changes" : "Add Entry"),
        React.createElement("button", { style: s.formBtn(false), onClick: () => { resetForm(); setShowAddForm(false); } }, "Cancel")
      )
    ),

    // Items grid
    filtered.length === 0
      ? React.createElement("div", { style: s.empty }, activeTerritory === "All" ? "No entries yet. Add your first one above." : 'No entries in "' + activeTerritory + '" yet.')
      : React.createElement("div", { style: s.grid },
          filtered.map(item => {
            const expanded = expandedItem === item.id;
            return React.createElement("div", {
              key: item.id,
              style: { ...s.card, boxShadow: expanded ? "0 4px 20px rgba(0,0,0,0.08)" : "none" },
              onClick: () => setExpandedItem(expanded ? null : item.id)
            },
              // Type badge
              React.createElement("div", { style: { fontFamily: fonts.meta, fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: PALETTE.textMuted, marginBottom: "8px" } },
                item.type === "link" ? "🔗 Link" : item.type === "image" ? "🖼 Image" : "📝 Note"
              ),
              React.createElement("div", { style: s.cardTerritory }, item.territory),
              React.createElement("h3", { style: s.cardTitle }, item.title),
              React.createElement("p", { style: { ...s.cardNotes, ...(expanded ? {} : { display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }) } }, item.notes),

              // Palette swatches
              item.palette && item.palette.length > 0 && React.createElement("div", { style: s.paletteRow },
                item.palette.map((c, i) => React.createElement("div", { key: i, style: s.paletteSwatch(c) }))
              ),

              // Sources
              expanded && item.sources && item.sources.length > 0 && React.createElement("div", { style: { marginBottom: "12px" } },
                item.sources.map((src, i) =>
                  src.url ? React.createElement("a", { key: i, href: src.url, target: "_blank", rel: "noopener", style: { ...s.sourceLink, display: "block", marginBottom: "4px" }, onClick: e => e.stopPropagation() }, src.label || src.url) : src.label ? React.createElement("span", { key: i, style: { ...s.sourceLink, color: PALETTE.textMuted, textDecoration: "none" } }, src.label) : null
                )
              ),

              // Meta + actions
              React.createElement("div", { style: s.cardMeta },
                React.createElement("span", null, new Date(item.created).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })),
                item.url && React.createElement("a", { href: item.url, target: "_blank", rel: "noopener", style: { color: PALETTE.accent, textDecoration: "underline" }, onClick: e => e.stopPropagation() }, "visit →"),
                expanded && React.createElement("span", { style: { color: PALETTE.accent, cursor: "pointer" }, onClick: e => { e.stopPropagation(); startEdit(item); } }, "edit"),
                expanded && !item.id.startsWith("item-seed-") && React.createElement("span", { style: { color: "#c44", cursor: "pointer" }, onClick: e => { e.stopPropagation(); deleteItem(item.id); } }, "delete")
              )
            );
          })
        ),

    // Footer
    React.createElement("div", { style: { padding: "40px " + pad + " 60px", textAlign: "center", borderTop: "1px solid " + PALETTE.borderLight, marginTop: "20px" } },
      React.createElement("p", { style: { fontFamily: fonts.meta, fontSize: "13px", color: PALETTE.textMuted } },
        filtered.length + " entr" + (filtered.length === 1 ? "y" : "ies") + (activeTerritory !== "All" ? " in " + activeTerritory : "") + " · " + territories.length + " territor" + (territories.length === 1 ? "y" : "ies")
      )
    )
  );
}

ReactDOM.createRoot(document.getElementById("territories-root")).render(React.createElement(Territories));
