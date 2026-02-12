const { useState, useEffect, useCallback, useRef } = React;

const TERRITORIES_KEY = "oyparaploo-territories";
const ITEMS_KEY = "oyparaploo-territory-items";

const DEFAULT_TERRITORIES = [
  "Almost Level",
  "Back to the Scene",
  "Beautiful Garbage",
  "Bright Refusal",
  "Dead Load",
  "Eighty Stairs",
  "Everything That Arrived",
  "Five Measures",
  "Hired Grief",
  "Hospitable Hostility",
  "Middle Eye",
  "Noir Song",
  "No Hands",
  "Not Touching the Floor",
  "Off the Ground",
  "Ongoing",
  "Only Thread",
  "Pressure Ghosts",
  "Raw Kindred",
  "Someone's Home",
  "Still Ripening",
  "The First Brick",
  "The Ground Is Sharp",
  "The Other Way Up",
  "The Setup",
  "The Sitting",
  "Unclaimed Ground",
  "Uninvited Growth",
  "What Arrives Twice",
  "What Grows Over",
  "What Holds",
  "What the Soil Holds",
  "What Was Done to It",
  "What You Can Carry",
  "What You Can't Read from Here",
  "Whatever's At Hand",
  "Wings Over Eyes",
  "Wonderful Garbage",
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
  { id: "item-seed-mummymask", type: "image", title: "Old Kingdom mummy mask — Abusir, Egypt", url: "https://www.smb.museum/en/museums-institutions/aegyptisches-museum-und-papyrussammlung/collection-research/collection/", imageUrl: null, notes: "Seven pieces of a face reassembled and the mouth still has that specific set. Tomb robbery ... a Prussian expedition ... two world wars ... four thousand years of hands on it. The expression did not negotiate.", territory: "What Holds", sources: [{ label: "the Berlin collection", url: "https://www.smb.museum/en/museums-institutions/aegyptisches-museum-und-papyrussammlung/collection-research/collection/" }], palette: null, created: "2026-02-11T00:01:00.000Z", updated: "2026-02-11T00:01:00.000Z" },
  { id: "item-seed-bhabha", type: "image", title: "Huma Bhabha — Untitled, 2005 (Karachi photograph)", url: "https://www.davidkordanskygallery.com/artist/huma-bhabha", imageUrl: null, notes: "She made a body from mesh and clay and carried it to Karachi and set it in the scorched ground and photographed it before anyone official arrived. An unnamed civilian returned to the scene. The ground was still warm.", territory: "Back to the Scene", sources: [{ label: "her gallery", url: "https://www.davidkordanskygallery.com/artist/huma-bhabha" }, { label: "the Whitney show", url: "https://whitney.org/exhibitions/huma-bhabha" }], palette: null, created: "2026-02-11T00:02:00.000Z", updated: "2026-02-11T00:02:00.000Z" },
  { id: "item-seed-akhavan", type: "link", title: "Abbas Akhavan — Study for a Garden: Fountain, 2012", url: "https://catrionajeffries.com/artists/abbas-akhavan/works/abbas-akhavan-study-for-a-garden-fountain-2012", imageUrl: null, notes: "A lawn sprinkler running on linoleum next to a fireplace. You cannot cross the room without getting wet. The garden tool doing what garden tools do ... on the third floor of a London townhouse. Somewhere else in the building ... a table dripping water in emulation of a waterboarding chamber. The host left both running.", territory: "Hospitable Hostility", sources: [{ label: "the fountain piece", url: "https://catrionajeffries.com/artists/abbas-akhavan/works/abbas-akhavan-study-for-a-garden-fountain-2012" }, { label: "his gallery", url: "https://catrionajeffries.com/artists/abbas-akhavan" }], palette: null, created: "2026-02-11T00:03:00.000Z", updated: "2026-02-11T00:03:00.000Z" },
  { id: "item-seed-cruzvillegas", type: "link", title: "Abraham Cruzvillegas — autoconstrucción", url: "https://www.kurimanzutto.com/artists/abraham-cruzvillegas", imageUrl: null, notes: "Steel hoops and sheepskin and a vinyl record and green tarpaulin hanging from a ceiling. A bamboo lattice where a wall might go. Nothing on the floor except what fell. A canoe that carried someone once ... ratchet-strapped to the air in a white room ... turntable where the rower sat. His parents built their house in Ajusco from what showed up ... no blueprint ... rooms added when someone needed to sleep. He took the method and hung everything from the ceiling. The house is still not finished.", territory: "Off the Ground", sources: [{ label: "kurimanzutto", url: "https://www.kurimanzutto.com/artists/abraham-cruzvillegas" }, { label: "the Walker survey", url: "https://walkerart.org/calendar/2013/abraham-cruzvillegas-autoconstruccion-suites" }, { label: "the Turbine Hall commission", url: "https://www.tate.org.uk/whats-on/tate-modern/hyundai-commission-abraham-cruzvillegas" }], palette: null, created: "2026-02-11T00:04:00.000Z", updated: "2026-02-11T00:04:00.000Z" },
  { id: "item-seed-rootstein", type: "image", title: "Adel Rootstein — John Taylor sculpting from life", url: "https://www.rootstein.com/news/an-interview-with-kevin-arpino-about-adel-rootstein", imageUrl: null, notes: "A sculptor's hand on a clay head. The model beside her own face ... both facing the lens ... one warm, one not yet. John Taylor did this for twenty-eight years in a studio off Kings Road. After the mold was pulled the clay was broken up. The sculptors kept the same clay and worked it again ... believed the oils from their hands were in the mix. The fiberglass copy stood in a window selling someone else's clothes. After a while they replaced it with a newer one.", territory: "The Sitting", sources: [{ label: "an interview about the process", url: "https://www.rootstein.com/news/an-interview-with-kevin-arpino-about-adel-rootstein" }], palette: null, created: "2026-02-11T00:05:00.000Z", updated: "2026-02-11T00:05:00.000Z" },
  { id: "item-seed-martin", type: "link", title: "Agnes Martin — grids, bands, circles", url: "https://www.artsy.net/artist/agnes-martin", imageUrl: null, notes: "Pencil on canvas. Six feet by six feet. She worked out the mathematics for hours before she picked up the pencil. Then she drew the lines by hand so they would not be perfect. In 1967 she stopped painting and drove away from New York in a pickup truck. Did not paint for seven years. Lived on a mesa in New Mexico with almost nothing. When she came back the grids had softened into bands. The bands softened into almost nothing. Pale pink next to pale white next to pale blue ... the pencil line still underneath holding it all level. Almost level.", territory: "Almost Level", sources: [{ label: "the Artforum appreciation", url: "https://www.artforum.com/features/agnes-martin-an-appreciation-213686/" }, { label: "the Guggenheim retrospective", url: "https://www.guggenheim.org/exhibition/agnes-martin" }, { label: "Phaidon on the evolution", url: "https://www.phaidon.com/en-us/blogs/stories/the-evolution-of-agnes-martin-in-5-pictures" }], palette: null, created: "2026-02-11T00:06:00.000Z", updated: "2026-02-11T00:06:00.000Z" },
  { id: "item-seed-pirici", type: "link", title: "Alexandra Pirici — Re-collection, Kunsthalle Mannheim", url: "https://www.sfmoma.org/exhibition/alexandra-pirici-re-collection/", imageUrl: null, notes: "Three people in street clothes and surgical masks making one shape on a museum floor. One covers her face. One reaches up from the ground. One stands between them holding it together. Behind them a painting that will be there tomorrow. They will not. She calls these ongoing actions. No curtain, no applause. You walk in and they are already in it. You leave and they keep going. The pandemic came and the performers put on masks and continued. The world changed around the shape and the shape absorbed it.", territory: "Ongoing", sources: [{ label: "Re-collection at SFMOMA", url: "https://www.sfmoma.org/exhibition/alexandra-pirici-re-collection/" }, { label: "the Mannheim show where this was taken", url: "https://www.kuma.art/en/upheaval" }, { label: "Attune at Hamburger Bahnhof", url: "https://artreview.com/the-interview-alexandra-pirici/" }], palette: null, created: "2026-02-11T00:07:00.000Z", updated: "2026-02-11T00:07:00.000Z" },
  { id: "item-seed-katz", type: "link", title: "Alex Katz — Purple Wind", url: "https://www.metmuseum.org/art/collection/search/689957", imageUrl: null, notes: "Four lit windows behind bare branches. The purple is one purple. No gradation, no atmosphere, just the color night turns when you stand outside in winter and look up. The branches cross everything. They don't frame the windows or lead your eye anywhere. They are in the way. Ten feet tall so you are the one standing outside. Someone behind those curtains is not thinking about you.", territory: "Someone's Home", sources: [{ label: "the painting at the Met", url: "https://www.metmuseum.org/art/collection/search/689957" }, { label: "Thaddaeus Ropac", url: "https://ropac.net/artists/50-alex-katz/" }], palette: null, created: "2026-02-11T00:08:00.000Z", updated: "2026-02-11T00:08:00.000Z" },
  { id: "item-seed-prager", type: "link", title: "Alex Prager — Crowd #3 (Pelican Beach)", url: "https://www.alexprager.com/part-ii-view", imageUrl: null, notes: "Shot from below so three strangers become monuments. Leopard print and a Coke cup. A man in a tie who does not belong at the beach. A woman in a floral swimsuit blowing a pink bubble. Blue sky. Birds. Everything looks caught. Nothing is caught. She hired every person in this photograph. Chose the prints, the bubble gum, the angle. She saw Eggleston at the Getty when she was twenty-one and started teaching herself. Builds crowds from scratch the way a director builds a scene. You know it is staged and you look for the seam and there is no seam.", territory: "The Setup", sources: [{ label: "the Crowd series", url: "https://www.alexprager.com/part-ii-view" }, { label: "the Corcoran show", url: "https://www.phillips.com/detail/alex-prager/UK040217/42" }], palette: null, created: "2026-02-11T00:09:00.000Z", updated: "2026-02-11T00:09:00.000Z" },
  { id: "item-seed-mendieta", type: "link", title: "Ana Mendieta — Imagen de Yagul", url: "https://www.sfmoma.org/artwork/93.220/", imageUrl: null, notes: "A woman lying in a Zapotec tomb in Oaxaca. White flowers placed on her body to look like they grew there. She was twenty-four. She had been sent out of Cuba at twelve, alone, through a program that moved children to the United States. Foster homes in Iowa. She found the tomb because weeds had already started covering the stone. She got in. Someone arranged the flowers and took the photograph. This was the first one. She made over two hundred more across seven years. Earth, fire, blood, sand, gunpowder. Always her shape. Always the ground taking it back.", territory: "What Grows Over", sources: [{ label: "the photograph at SFMOMA", url: "https://www.sfmoma.org/artwork/93.220/" }, { label: "Smarthistory on the Silueta series", url: "https://smarthistory.org/ana-mendieta-silueta-series/" }, { label: "Marian Goodman", url: "https://www.mariangoodman.com/artists/ana-mendieta/" }, { label: "Tate retrospective 2026", url: "https://www.tate.org.uk/whats-on/tate-modern/ana-mendieta" }], palette: null, created: "2026-02-11T00:10:00.000Z", updated: "2026-02-11T00:10:00.000Z" },
  { id: "item-seed-canossan", type: "link", title: "Canossan painted terracotta draped woman", url: "https://www.e-tiquities.com/new-arrivals/ancient-canossan-painted-terracotta-draped-woman", imageUrl: null, notes: "Nine inches tall. Pink paint on a clay dress. Made from a mold in southern Italy around 300 BCE to stand in someone's tomb and mourn. They made dozens from the same five molds. Scratched letters on the parts so the workers knew which arm went where. The pink is still there. Not all of it. Enough. She was never meant to be seen again after the stone closed. A professional mourner with no name buried with someone whose name is also gone.", territory: "Hired Grief", sources: [{ label: "the dealer listing", url: "https://www.e-tiquities.com/new-arrivals/ancient-canossan-painted-terracotta-draped-woman" }, { label: "the Getty has four from the same tradition", url: "https://www.getty.edu/publications/terracottas/catalogue/40/" }], palette: null, created: "2026-02-11T00:11:00.000Z", updated: "2026-02-11T00:11:00.000Z" },
  { id: "item-seed-bowers", type: "link", title: "Andrea Bowers — tree-sitting platform (thrift store chair)", url: "https://vielmetter.com/artists/andrea-bowers", imageUrl: null, notes: "A thrift store chair hanging from the ceiling by green straps and climbing rope. Orange safety netting where a cushion would go. Friendship bracelet cord tied next to climbing knots. A lantern. A blue cup. A water bottle. Everything you would need if you were not coming down. In 2011 she climbed a hundred feet into an oak in Arcadia and sat on a wooden platform while they cut 250 trees around her. After two days they brought a forklift and arrested her. When she got out she drove back and filled a truck with wood chips before the restraining order arrived. The trees are chips. The chair is still up.", territory: "Bright Refusal", sources: [{ label: "Vielmetter Los Angeles", url: "https://vielmetter.com/artists/andrea-bowers" }, { label: "the Hammer retrospective", url: "https://hammer.ucla.edu/exhibitions/2022/andrea-bowers" }, { label: "Andrew Kreps", url: "https://www.andrewkreps.com/artists/andrea-bowers" }], palette: null, created: "2026-02-11T00:12:00.000Z", updated: "2026-02-11T00:12:00.000Z" },
  { id: "item-seed-tsouhlarakis", type: "image", title: "Anna Tsouhlarakis — wearable sculpture (foam board, raffia)", url: "", imageUrl: null, notes: "Foam board lashed to a body with raffia. Five white rectangles angled across her head and shoulders like scaffolding for a building that hasn't been designed yet. The fiber is doing what fiber has always done. It doesn't know the material is wrong. Navajo, Creek, Greek. Grew up in Kansas with a jeweler father who brought home scraps of copper and wood. Yale MFA. Titles like SHE'S SO NATIVE SHE'LL CUT YOU WITH HER CHEEKBONE and YOU KNOW SHE BUYS HER SAGE AT URBAN OUTFITTERS. But this piece isn't the humor. This is the weight. The foam board is light and the piece looks heavy. She is looking down through the gaps and you cannot tell if she built the thing or if it landed on her.", territory: "Whatever's At Hand", sources: [{ label: "Indigenous Absurdities at MCA Denver", url: "https://mcadenver.org/exhibitions/anna-tsouhlarakis" }, { label: "Creative Capital profile", url: "https://creative-capital.org/artists/anna-tsouhlarakis/" }, { label: "Jack Tilton Gallery", url: "https://www.jacktiltongallery.com/anna-tsouhlarakis" }], palette: null, created: "2026-02-11T00:13:00.000Z", updated: "2026-02-11T00:13:00.000Z" },
  { id: "item-seed-dean", type: "link", title: "Aria Dean — fragment from skinning cattle by power 1867 (fig. 122 in gideon)", url: "https://vleeshal.nl/en/exhibitions/some-of-it-falls-from-the-belt", imageUrl: null, notes: "Red lacquered plywood and silicon rubber. Eight feet tall. Standing in the Vleeshal in Middelburg, which is Dutch for meat hall because that is what the building was. White brick vaulted ceiling checkered marble floor wooden shutters on the windows. A beautiful room. The red panel has lines incised into the rubber — shapes pulled from an 1867 illustration of mechanized cattle skinning, figure 122 in Sigfried Gideon's book about how slaughterhouse design taught modernist architecture how to move bodies through space. Henry Ford studied the disassembly line in Chicago and reversed it. The frame is a revolving knocking pen door. The mechanism works like this: the animal falls and its weight swings the door open for the next animal. The door runs on death and calls it flow. She was twenty-nine. Oberlin then five years curating net art at Rhizome then the Whitney Biennial. No blood in the piece. No bodies. Just the door and the room that already knew.", territory: "Dead Load", sources: [{ label: "Vleeshal exhibition", url: "https://vleeshal.nl/en/exhibitions/some-of-it-falls-from-the-belt" }, { label: "Greene Naftali", url: "https://greenenaftaligallery.com/artists/aria-dean" }, { label: "ICA London: Abattoir", url: "https://www.ica.art/exhibitions/aria-dean-abattoir" }, { label: "Whitney Biennial 2022", url: "https://whitney.org/exhibitions/2022-biennial" }], palette: null, created: "2026-02-11T00:14:00.000Z", updated: "2026-02-11T00:14:00.000Z" },
  { id: "item-seed-kurzen", type: "image", title: "Bénédicte Kurzen & Sanne De Wilde — from Land of Ibeji", url: "", imageUrl: null, notes: "Two girls lying in peacock flowers. Eyes closed. One in blue one in white. Shot from above so you look down at them the way you look down at something precious in a case. Igbo-Ora in southwestern Nigeria has ten times more twins than anywhere else on earth and nobody knows why. Ibeji means double birth. In Yoruba tradition twins personify Shango, god of thunder. Sacred. Powerful. Neglecting them brings ruin. Three hundred miles east the same birth was an abomination and the babies were killed. Same face, opposite story. When one twin dies a wooden figure is carved and dressed and fed as if the child is still breathing. Bénédicte Kurzen and Sanne De Wilde made this together — two photographers working as one authorship, which is the joke and the method. The flash turns the background dark. The flowers are from the flame tree. The girls are not asleep. They are being still for something that requires stillness.", territory: "What Arrives Twice", sources: [{ label: "World Press Photo 2019", url: "https://www.worldpressphoto.org/collection/photo-contest/2019" }, { label: "Land of Ibeji photobook (Hatje Cantz)", url: "https://www.hatjecantz.de/land-of-ibeji-8028.html" }, { label: "NOOR Images", url: "https://www.noorimages.com/photographers/benedicte-kurzen/" }], palette: null, created: "2026-02-11T00:15:00.000Z", updated: "2026-02-11T00:15:00.000Z" },
  { id: "item-seed-beethoven", type: "image", title: "Ludwig van Beethoven — autograph manuscript, 'Sunset,' Op. 108 No. 2", url: "", imageUrl: null, notes: "Black ink on twelve-stave paper. Five measures of a Scottish folk song called Sunset — Walter Scott's poem about a hill in Ettrick's vale — arranged for voice, violin, cello, and piano. A commission from George Thomson of Edinburgh who wanted simple settings for amateurs to play at home. Beethoven gave him 179 folk song arrangements over eleven years. Thomson said he composes for posterity. Beethoven said he is not accustomed to retouching his compositions. Look at the page. It is nothing but retouching. Notes scratched out and rewritten on top of themselves. Staves extended into the margin because he ran out of room. This is five measures of a song nobody bought. He was forty-seven. Sick. Fighting for custody of his nephew. Hadn't composed anything major in over a year. The Hammerklavier sketches start in December. This page is dated November 29th. Alexander Wheelock Thayer — Lincoln's consul to Trieste, first American to write a Beethoven biography — owned this page and gave it to the daughter of Wilhelm Grimm on New Year's Day 1859. The year her father died. A page of revisions for a song about sunset, given as a gift at the start of a year of grief.", territory: "Five Measures", sources: [{ label: "Bonhams lot 14, March 2018", url: "https://www.bonhams.com/auction/24861/lot/14/" }, { label: "Beethoven-Haus digital archives", url: "https://www.beethoven.de/en/archive" }, { label: "Staatsbibliothek zu Berlin", url: "https://digital.staatsbibliothek-berlin.de/" }], palette: null, created: "2026-02-11T00:16:00.000Z", updated: "2026-02-11T00:16:00.000Z" },
  { id: "item-seed-ndife", type: "image", title: "Brandon Ndife — Öffnung", url: "", imageUrl: null, notes: "A red bulb the size of a heart sitting in dried corn husks on a white wall. Dark matter — char or soil or both — creeping across the surface where the red gives way. It looks found. It is entirely made. Corn husk, resin, AquaResin, earth pigment, enamel, wood, aluminum. He trained as a painter and broke up with painting and the brushstrokes followed him into three dimensions. He was at Cooper Union in 2012 when Sandy hit and afterward all the furniture was on the curbs — particleboard swelling, drawers warped, fabric growing things. He started making that. Not finding it. Making it. The title is Öffnung, German for opening. Twenty-eight inches tall. Mounted at head height so you meet it face to face. The reviewer asked if there is a name for the plant equivalent of a cyborg. There isn't. The show opened March 20, 2020, the day the governor issued the stay-at-home order. Nobody came to the opening. The piece about invisible contamination hung in an empty room during a pandemic. It will never actually rot. It will never finish ripening. That is the point.", territory: "Still Ripening", sources: [{ label: "MY ZONE at Bureau", url: "https://bureau-inc.com/" }, { label: "Greene Naftali", url: "https://greenenaftaligallery.com/artists/brandon-ndife" }, { label: "Brooklyn Rail review", url: "https://brooklynrail.org/2020/06/artseen/Brandon-Ndife-MY-ZONE" }], palette: null, created: "2026-02-11T00:17:00.000Z", updated: "2026-02-11T00:17:00.000Z" },
  { id: "item-seed-drake", type: "image", title: "Carolyn Drake — from Internat", url: "", imageUrl: null, notes: "A woman sitting on a chair holding every piece of clothing she owns in a stack from her lap to above her head. Two hands gripping the pile at different heights. Face gone. Black tights and white boots with pink faux-fur trim and pink pom-poms. Peach walls. Patterned linoleum. A turquoise table edge. The Petrykhiv Internat outside Ternopil in western Ukraine — an ex-Soviet boarding house for seventy girls and women labeled disabled or abnormal, not allowed past the concrete wall, allowed to stay until thirty-five, and all of them stayed. Carolyn Drake first photographed them in 2006 as bouncing children on a Fulbright. Came back in 2014 expecting them to be gone. They were still there. Private, snarky, opinionated, complicated adults in the same building. When she couldn't photograph she brought a book about Taras Shevchenko and the women painted over the portraits — green stripes across his eyes, pink across his mouth. The faces in Drake's photographs are always hidden. Tinsel, flowers, clothing, turned away. This one hides behind everything she has. The stack could fall. The hands say it won't.", territory: "What You Can Carry", sources: [{ label: "Internat photobook", url: "https://www.carolyndrake.com/internat" }, { label: "Magnum Photos", url: "https://www.magnumphotos.com/photographer/carolyn-drake/" }, { label: "Paris Review on Internat", url: "https://www.theparisreview.org/blog/tag/carolyn-drake/" }], palette: null, created: "2026-02-11T00:18:00.000Z", updated: "2026-02-11T00:18:00.000Z" },
  { id: "item-seed-vicuna", type: "image", title: "Cecilia Vicuña — from Lo Precario", url: "", imageUrl: null, notes: "Branches laid across a concrete floor like the skeleton of something that used to hold water. Hanging from the ceiling on strings: bundles of rope, netting, driftwood, green fiber, plaid fabric, plastic, shells, wool — each one different, each one precarious. She calls them precarios. Also basuritas, which is Spanish for little rubbish said with tenderness. In 1966 she was seventeen on a beach in Chile. Drew a spiral in the sand, circled it with sticks and feathers, and let the tide take it. That was the first one. An object is not an object, she says. It is a witness to a relationship. The quipu was an Andean recording system five thousand years old — knotted colored threads hanging from a cord, read with fingers. The Spanish burned them. Vicuña has been remaking them for sixty years. Not copies. Poems. At the Guggenheim in 2022 and the Tate Turbine Hall the same year, she was seventy-four. Golden Lion at Venice. None of it is attached to anything except by thread. Thread holds the knots. Thread holds the memory of the knots the Spanish burned. Thread is the only thing between together and apart.", territory: "Only Thread", sources: [{ label: "Guggenheim: Spin Spin Triangulene", url: "https://www.guggenheim.org/exhibition/cecilia-vicuna-spin-spin-triangulene" }, { label: "Tate: Brain Forest Quipu", url: "https://www.tate.org.uk/whats-on/tate-modern/hyundai-commission-cecilia-vicuna" }, { label: "Lehmann Maupin", url: "https://www.lehmannmaupin.com/artists/cecilia-vicuna" }], palette: null, created: "2026-02-11T00:19:00.000Z", updated: "2026-02-11T00:19:00.000Z" },
  { id: "item-seed-vicuna-2", type: "image", title: "Cecilia Vicuña — precarios with paintings", url: "", imageUrl: null, notes: "The paintings are on the wall. You cannot reach them. Between you and the orange canvas with the seated figure, between you and the pink tree with the white animal, hang dozens of threads with things tied to them — sticks, netting, blue felt, green plastic, pink yarn, a metal ring, driftwood, rope. You look through the precarios the way you look through rain. The paintings are from the 1960s and 1970s — figurative, folksy, revolutionary. She stopped painting after the coup in 1973 and didn't start again for four decades. A British art historian found the canvases in 2017 and showed them at Documenta. Now they hang behind her thread work like the past behind the present. You can see both at once but you cannot hold both at once. The threads move when you walk past. The paintings do not.", territory: "Only Thread", sources: [{ label: "Guggenheim: Spin Spin Triangulene", url: "https://www.guggenheim.org/exhibition/cecilia-vicuna-spin-spin-triangulene" }, { label: "Lehmann Maupin", url: "https://www.lehmannmaupin.com/artists/cecilia-vicuna" }], palette: null, created: "2026-02-11T00:20:00.000Z", updated: "2026-02-11T00:20:00.000Z" },
  { id: "item-seed-paul", type: "image", title: "Celia Paul — My Mother with a Rose", url: "", imageUrl: null, notes: "An elderly woman in a white robe holding flowers in her lap, looking up and slightly past you. The background is fog — green, blue, yellow, no walls, no room, just atmosphere. She is emerging from it or dissolving into it. You cannot tell which direction the painting is going. Celia Paul painted her mother Pamela twice a week for thirty years. Tuesdays and Fridays. The mother took the train from Cambridge to London, climbed eighty stairs to the flat opposite the British Museum, collapsed into the battered wood-framed chair, and sat. She used the silence for prayer. Her face assumed a rapt expression. The air was charged with prayer. This is 2006. Year twenty-nine. The mother is seventy-nine. Next year she will not be able to climb the stairs and the sittings will end. She will die in 2015. Paul cannot work from someone who doesn't matter to her. She tried once with a model at the Slade and couldn't do it. The person who mattered most was her mother. The rose in the lap is almost the same color as the hands holding it. Everything in this painting is becoming the same thing.", territory: "Eighty Stairs", sources: [{ label: "Victoria Miro", url: "https://www.victoria-miro.com/artists/celia-paul" }, { label: "Yale Center for British Art", url: "https://britishart.yale.edu/" }, { label: "Self-Portrait (memoir)", url: "https://www.nyrb.com/products/self-portrait" }], palette: null, created: "2026-02-11T00:21:00.000Z", updated: "2026-02-11T00:21:00.000Z" },
  { id: "item-seed-rebet", type: "image", title: "Christine Rebet — from Thunderbird", url: "", imageUrl: null, notes: "Ink and wash on paper. One drawing out of twenty-five hundred. Five minutes and forty seconds of animation, eight months of labor. Christine Rebet draws every frame by hand, shoots them on 16mm film, because her gesture is to draw. The Thunderbird is the avatar of Ningirsu, warrior god of ancient Sumer. Around 2140 BCE the ruler Gudea dreamed it and built a temple called the White Thunderbird at Girsu in what is now southern Iraq. White meaning shining, not the color. The temple is rubble. The site has been looted and bombed and looted again. Before the Mesopotamians built their temples they buried foundation cones in the ground — terracotta cylinders covered in cuneiform that said: if someone digs this up, it will tell them how to rebuild. They planned for their own ruin. Rebet worked with the British Museum archaeologist Sebastien Rey. The soundtrack is a frantic Iraqi oud standing in for the sound of American bombardments. She draws each frame knowing it will disappear into motion the way each brick disappears into a wall. You wake up and calculate each drawing for a day. You suffer. The film runs five minutes. The drawings took eight months. The temple took a vision from a god.", territory: "The First Brick", sources: [{ label: "Thunderbird at Bureau", url: "https://bureau-inc.com/" }, { label: "Parasol Unit: Time Levitation", url: "https://www.parasol-unit.org/" }, { label: "Elephant Magazine interview", url: "https://elephant.art/" }], palette: null, created: "2026-02-11T00:22:00.000Z", updated: "2026-02-11T00:22:00.000Z" },
  { id: "item-seed-maurer", type: "image", title: "Clemens Maurer — AI-generated doves", url: "", imageUrl: null, notes: "A figure buried in white doves. Eyes closed. Two hands reaching through the birds. Approximately fifteen doves in various positions — perched, spreading, settling. Soft blue-gray background. Every feather rendered. Every pink foot precise. The skin has the quality of porcelain that was never porcelain. Nothing in this image ever existed. No doves sat for it. No figure held still. No light entered a lens. No hand drew a line. Clemens Maurer is a trained graphic designer from Stuttgart working in Berlin who types descriptions into Midjourney and selects from what it generates. He compares AI to the camera. The comparison holds in one direction: both are tools. It breaks in the other: the camera requires a room with something in it. This requires a room with nothing in it. The image is beautiful the way a sentence with no wrong words and no right ones is beautiful. The doves are symbols of peace and that is all they are. They have no weight. They have no smell. The hands in the picture are the tell. They reach through the birds as if holding something. They are holding nothing. Nothing made them.", territory: "No Hands", sources: [{ label: "Clemens Maurer portfolio", url: "https://www.clemensmaurer.com/" }], palette: null, created: "2026-02-11T00:23:00.000Z", updated: "2026-02-11T00:23:00.000Z" },
  { id: "item-seed-coderch-malavia", type: "image", title: "Coderch & Malavia — bronze with winged helmet", url: "", imageUrl: null, notes: "Bronze on glass. Coderch & Malavia, a duo working in Valencia — Joan Coderch from Barcelona and Javier Malavia from the Basque Country. They met at a porcelain factory where both felt managed by third parties. Left in 2015 to make sculpture four-handed: not dividing labor but both touching every surface. They model from life in clay, cast in bronze, and want things to last forever. The figure wears Mercury's helmet. Mercury is the messenger god — speed, flight, the space between sender and receiver. Here he sits on a glass box with his feet off the ground, going nowhere. The pedestal you can see through. The messenger cannot. Their Hamlet has covered eyes too. They keep making figures whose job is to see or move and then taking that away. Four hands building a body that can't use its own. The wings point up. The eyes point down. The message hasn't arrived because the messenger doesn't know where he is.", territory: "Wings Over Eyes", sources: [{ label: "Coderch & Malavia", url: "https://www.coderchmalavia.com/" }, { label: "ARC International Salon", url: "https://www.artrenewal.org/" }], palette: null, created: "2026-02-11T00:24:00.000Z", updated: "2026-02-11T00:24:00.000Z" },
  { id: "item-seed-codychoi", type: "image", title: "Cody Choi — from Little Shaolin Monks", url: "", imageUrl: null, notes: "Shaolin Temple, Zhengzhou. Cody Choi is a Hong Kong-born dancer based in London who toured three seasons with Matthew Bourne's Swan Lake and started taking photographs on the road. He met these monks when they performed together at an Andy Lau concert in Hong Kong after the boys had finished filming New Shaolin Temple with Jackie Chan. His philosophy for shooting dancers: follow not only the movement but breathe with them. He is a dancer photographing people who are not dancers doing something dancers also do. The handstand is foundation work. You learn it before you learn to strike or block or fly. It teaches you what the ground feels like when you push against it with your hands instead of your feet. The temple behind them was built in 495, burned for forty days in 1928, emptied during the Cultural Revolution, rebuilt after 1983. The boys will train here for years. Some will stay for life. The building stays upright. The children turn themselves over. Both are ways of lasting.", territory: "The Other Way Up", sources: [{ label: "Cody Choi portfolio", url: "https://www.codychoi.com/" }, { label: "Leica Fotografie International", url: "https://lfi-online.de/" }], palette: null, created: "2026-02-11T00:25:00.000Z", updated: "2026-02-11T00:25:00.000Z" },
  { id: "item-seed-demiddel", type: "image", title: "Cristina de Middel — from Midnight at the Crossroads", url: "", imageUrl: null, notes: "Cristina de Middel, president of Magnum Photos, born in Alicante, based between Mexico and Brazil. She spent ten years as a photojournalist in Spain making everything sharp and clear. Then she left and started making things deliberately unclear. Her breakthrough was The Afronauts — a 2012 photobook about Zambia's failed 1964 space program, staged with handmade costumes and local people. She self-published it because no one would. Martin Parr told her over coffee that her work was great and everything changed. This image is likely from Midnight at the Crossroads, a three-year project with partner Bruno Morais following the Yoruba deity Èsù along slave trade routes through Benin, Cuba, Brazil, and Haiti. Èsù is the lord of crossroads who places obstacles in your path to make you question your certainties. De Middel mixes documentary and staging and will not tell you which is which. She gave these women matching dresses or they already had them. She focused on the ground or she focused on the women and the camera moved. You do not know. That is her position: you were never going to know anyway, so at least now you know you don't.", territory: "The Ground Is Sharp", sources: [{ label: "Magnum Photos", url: "https://www.magnumphotos.com/photographer/cristina-de-middel/" }, { label: "This Book Is True", url: "https://www.thisisbookistrue.com/" }], palette: null, created: "2026-02-11T00:26:00.000Z", updated: "2026-02-11T00:26:00.000Z" },
  { id: "item-seed-orving", type: "image", title: "Diana Orving — suspended textile sculpture", url: "", imageUrl: null, notes: "Silk or cotton gauze, hand-dyed, hand-sewn. Diana Orving, born 1985, Stockholm. Self-taught. Trained in classical ballet until her knees stopped her. Won Elle Magazine's Designer of the Year in 2017, then quit fashion in 2021 because the industry's values were never hers. Her mother's studio had looms and sewing machines and fabric everywhere. Orving says her creative process is choreography — start small, assemble, cut the next piece, sew, wander astray, resist and yield. The sculpture grows bit by bit in a chain reaction that reminds her of dancing. She became a mother during the pandemic and started making forms that look like placentas and root systems. She says she creates conditions needed to lose control and be overpowered by her creations. The textiles are almost weightless yet monumental. This one fills a corner the way a held breath fills a chest. The wires are visible. The effort of suspension is not hidden. Everything about this object says it should be on the ground and everything about its installation says it will not be allowed to touch it.", territory: "Not Touching the Floor", sources: [{ label: "Diana Orving", url: "https://www.dianaorving.com/" }, { label: "CARVALHO PARK Gallery", url: "https://www.carvalhopark.com/" }], palette: null, created: "2026-02-11T00:27:00.000Z", updated: "2026-02-11T00:27:00.000Z" },
  { id: "item-seed-guruceaga", type: "image", title: "Amandine Guruceaga — installation with rope and textile sculptures", url: "", imageUrl: null, notes: "Dyed textiles, twisted rope, metal bases. Amandine Guruceaga, born 1989, Toulouse, based in Marseille. She grew up in her parents' metal enameling workshop in the Var — her first laboratory for watching heat change material. Her foundational medium is African wax fabric, which was developed by Dutch colonists imitating Indonesian batik, rejected in Indonesia, and marketed to West Africa where it became identity. Guruceaga bleaches the fabric to reveal where the dye resists and where it gives. She calls this the reactions of the matter. She spent six months at a Spanish lambskin tannery on an LVMH residency making leather translucent like stained glass. She burns copper with a blowtorch until it develops moiré patterns. She titled a 2023 exhibition Healing Surfaces and named individual pieces Your Scar is a Line and Copper Ecchymose. Every material in this room has a history that preceded the artist and a transformation the artist performed on it. The wax fabric carried colonial trade routes before she cut it. The rope held weight before she twisted it into a skeleton. She co-founded an artist-run space in Marseille called TANK. The sculptures stand like bodies whose insides are showing — not wounded, not healed, but held open for examination. The colors are beautiful. The process that made them was not gentle.", territory: "What Was Done to It", sources: [{ label: "Galerie Julie Caredda", url: "https://www.juliecaredda.com/" }], palette: null, created: "2026-02-11T00:28:00.000Z", updated: "2026-02-11T00:28:00.000Z" },
  { id: "item-seed-bopape", type: "image", title: "Dineo Seshee Bopape — from (ka) pheko ye - the dream to come", url: "", imageUrl: null, notes: "Earth, natural pigments, brass rings, fabric, clay. Dineo Seshee Bopape, born 1981, Polokwane, Limpopo Province, South Africa. Pedi. Educated at Durban, De Ateliers Amsterdam, Columbia University under Kara Walker. She sources soil from specific sites — places where slave rebellions happened, places where people resisted, places where violence occurred and was absorbed into the ground. She says the soil was inspired by the material itself, what it contains, the memories it holds, and ancient African ways of communicating with the ancestors or the spirit of the land. She squeezes clay in a clenched fist and fires it — each piece an individual gesture of revolt, inspired by Robert Sobukwe who grabbed a handful of soil and raised his fist when new prisoners arrived on Robben Island. She won the Future Generation Art Prize in 2017 and co-won Artes Mundi in 2021. She represented South Africa at Venice in 2019. Her recent exhibitions create village-like structures inside white galleries with unfired clay walls that breathe. She titles one exhibition (ka) pheko ye — the dream to come. Pheko means remedy. The yellow circles on the soil could be turmeric, which is medicine. They could be gold, which is what people took from this continent. They could be suns. The dome does not enclose. The rings do not lock. The soil is indoors but it is not contained. You cannot walk on it. You can only stand at its edge and look at what someone placed there for you to find.", territory: "What the Soil Holds", sources: [{ label: "Sfeir-Semler Gallery", url: "https://www.sfeir-semler.com/artists/dineo-seshee-bopape/" }, { label: "Kiasma Museum", url: "https://kiasma.fi/" }], palette: null, created: "2026-02-11T00:29:00.000Z", updated: "2026-02-11T00:29:00.000Z" },
  { id: "item-seed-bopape2", type: "image", title: "Dineo Seshee Bopape — from Lerole: Footnotes (the struggle of memory against forgetting)", url: "", imageUrl: null, notes: "Compressed earth, fired clay, charcoal, ash, shells, gold leaf. Dineo Seshee Bopape. From Lerole: Footnotes (the struggle of memory against forgetting). Lerole means dust in Sepedi. Bopape makes each fist piece by having someone squeeze clay in their clenched hand — the first versions were made from the hands of African immigrants in Vienna. She fires them so they last. Each one is an individual gesture of revolt. She took the gesture from Robert Sobukwe, founder of the Pan Africanist Congress, who was held in solitary confinement on Robben Island and when new political prisoners arrived grabbed a handful of soil, raised his fist, and saluted them. Bopape arranges hundreds of these fists into an asterisk — the symbol that means look down, there is more, you missed something. The title calls them footnotes. The installation is the annotation to the history books that left out African resistance to colonialism. She says it is a general myth that resistance existed only in the 1940s and 1950s and 1960s. Earlier struggles need to be remembered. The platform is too thick to step over and too sacred to step on. You walk around it the way you walk around something buried.", territory: "What the Soil Holds", sources: [{ label: "Sfeir-Semler Gallery", url: "https://www.sfeir-semler.com/artists/dineo-seshee-bopape/" }], palette: null, created: "2026-02-11T00:30:00.000Z", updated: "2026-02-11T00:30:00.000Z" },
  { id: "item-seed-alys", type: "image", title: "Francis Alÿs — wooden sculptures from The Gibraltar Projects", url: "", imageUrl: null, notes: "Wood, metal wire, painted boards, hardware. Francis Alÿs, born 1959, Antwerp, trained as architect, arrived in Mexico City in 1986 to help rebuild after the earthquake and never left. Changed his surname to reinvent himself. These sculptures are from The Gibraltar Projects — a decade-long work about the Strait of Gibraltar, where Hercules split Europe from Africa and where people now drown trying to cross. The main action happened August 12, 2008: a line of children holding boats made from shoes waded into the water from Tarifa, Spain, while another line waded in from Tangier, Morocco. They tried to reach each other. The tide brought them back. Alÿs asked whether the two lines would meet in the chimera of the horizon. These sculptures sat in the same room as sixty-four shoe-boats and three videos and fifty-four drawings. They are the studio's skeleton — easels that stopped being easels, supports that became the thing they were supporting. Alÿs pushes blocks of ice through Mexico City until they melt. He recruits five hundred people to move a sand dune ten centimeters. He walked from Tijuana to San Diego by going around the entire Pacific Rim. The art market remains profoundly puzzled by him because his most important works are available free on his website. These sculptures are what's left when the action is over. The wood held the paintings that held the ideas that sent children into the water with shoes on their hands. Now the wood leans against the wall like someone who walked a long way and hasn't decided whether to sit down.", territory: "Whatever's At Hand", sources: [{ label: "David Zwirner", url: "https://www.davidzwirner.com/artists/francis-alys" }, { label: "Francis Alÿs", url: "https://francisalys.com/" }], palette: null, created: "2026-02-11T00:31:00.000Z", updated: "2026-02-11T00:31:00.000Z" },
  { id: "item-seed-orozco", type: "image", title: "Gabriel Orozco — Sandstars", url: "", imageUrl: null, notes: "Found objects from Isla Arena, Baja California Sur, Mexico. Gabriel Orozco, born 1962, Jalapa, Veracruz. Father was a mural painter who worked with Siqueiros. Grew up watching murals get made and decided never to paint one. Studied art at UNAM, found it too conservative. Went to Madrid, felt what it was like to be the immigrant, the Other, and said that vulnerability became the work. Back in Mexico City he hosted the Friday Workshop — weekly meetings for five years with Damián Ortega, Abraham Cruzvillegas, Gabriel Kuri, Dr. Lakra. The group changed Mexican contemporary art. He cut a Citroën DS into thirds and put it back together thinner. Drew a geometric pattern across every surface of a human skull while recovering from a collapsed lung. Pushed the field of a chessboard past its edges. Moved between Tokyo, Mexico City, and New York — no home base, just wherever the next object was. His urgent struggle, he said, was to find something that was not art. In 2006 he went to Isla Arena — whale mating ground, whale cemetery, industrial wasteland — and pulled a gray whale skeleton from the sand. Drew on its bones. Hung it from the ceiling of a library in Mexico City. Six years later he went back to the same beach and collected everything else. Nearly twelve hundred objects that Pacific currents carried from across the ocean and deposited on a wildlife reserve. Buoys that marked shipping lanes. Light bulbs that lit rooms. Bottles that held things someone drank. He sorted them by color and material and laid them on a gallery floor in the Guggenheim. When the show opened in New York, Hurricane Sandy had just destroyed the city. The installation looked like what a flood leaves behind. A critic said it was more Pinterest than powerful. Another said it was entropic dissolution tempered by rigorous order. Both were right. The objects are not art and not garbage and not archaeology. They are what the ocean decided to keep and what it decided to return. Orozco's only decision was the order.", territory: "Everything That Arrived", sources: [{ label: "Guggenheim", url: "https://www.guggenheim.org/exhibition/gabriel-orozco-asterisms" }, { label: "Kurimanzutto", url: "https://www.kurimanzutto.com/artists/gabriel-orozco" }], palette: null, created: "2026-02-11T00:32:00.000Z", updated: "2026-02-11T00:32:00.000Z" },
  { id: "item-seed-ligon", type: "image", title: "Glenn Ligon — Untitled (America)", url: "", imageUrl: null, notes: "Neon and paint. Glenn Ligon, born 1960, Forest Houses Projects, South Bronx. Parents got scholarships to send him and his brother to a progressive private school on the Upper West Side. Studied at Wesleyan, then worked as a proofreader at a law firm while painting like de Kooning and Pollock in his spare time. Had a crisis when he realized there was too much of a gap between what he wanted to say and the means he had to say it. Started putting words on canvas. Stenciled Zora Neale Hurston's line 'I feel most colored when I am thrown against a sharp white background' and let the text blotch and smear as it went down the surface until the words became the color they described. Stenciled the opening of Ralph Ellison's Invisible Man in shades of black and gray until the words disappeared. Stenciled Gertrude Stein's phrase 'negro sunshine' — a broad racial stereotype from 1909 — and turned it into white neon. His job, he says, is not to produce answers but to produce good questions. In 2006 he started making the word AMERICA in neon. First version faced the wall — every letter turned away from the viewer. He named it Rückenfigur, the German term for a figure seen from behind contemplating a landscape. Second version doubled the word and stacked it against its own mirror image, imperfectly joined. This version — 2018 — hangs upside down, painted black, flickering red, buzzing. He was thinking about Dickens. Best of times, worst of times. We can elect Barack Obama and still torture people in Cuba. Those things happen at the same time. The black paint over the neon gets read as Black America, white America, he said, and those kind of binaries, which is a part of it. But maybe if the piece has richness, it is because of the ambiguity. Paint is a material. Language is a material. Neon is a material. He plays with the word AMERICA as material — crosses it out, inverts it, makes it blink on and off obnoxiously. It's all a way of playing with this word when we think we know what it means. The letters are in American Typewriter font. Each one is a single tube. They float. Remove the cables and they fall apart. From the floor looking up it feels like the word is toppling. A curator in Arkansas asked what the flickering obnoxious red neon is trying to tell you. Is it a warning. Is it a celebration. Does it represent you in any way. Ligon never answers. The room stays red.", territory: "What You Can't Read from Here", sources: [{ label: "Hauser & Wirth", url: "https://www.hauserwirth.com/artists/2917-glenn-ligon/" }, { label: "Crystal Bridges", url: "https://crystalbridges.org/" }], palette: null, created: "2026-02-11T00:33:00.000Z", updated: "2026-02-11T00:33:00.000Z" },
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
              React.createElement("p", { style: s.cardNotes }, item.notes),

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
