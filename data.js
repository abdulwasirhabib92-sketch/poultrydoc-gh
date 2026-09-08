/* PoultryDoc GH — Ghana-tailored poultry disease knowledge base
   Sources: FAO village-poultry health studies, Ghana/Tanzania poultry constraint research,
   KCOA organic poultry remedy factsheets, and standard poultry disease texts.
   NOTE: Educational information only — always confirm with a veterinary officer. */

const SPECIES = ["Chicken", "Guinea fowl", "Duck", "Turkey", "Pigeon"];

const DISEASES = [
  {
    id: "newcastle",
    name: "Newcastle Disease (ND)",
    aka: "The #1 killer of village chickens in Ghana and Northern Ghana",
    type: "Viral",
    severity: "very high",
    urgent: true,
    reportable: false,
    species: ["Chicken", "Guinea fowl", "Turkey", "Pigeon", "Duck"],
    age: "All ages; often deadliest in young and unvaccinated birds",
    symptoms: {
      droppings: ["Greenish watery diarrhoea"],
      breathing: ["Sneezing / coughing", "Gasping / rattling sound", "Nasal discharge"],
      nerves: ["Twisted neck / stargazing", "Paralysis of legs or wings", "Trembling or circling"],
      head: ["Bluish or dark comb"],
      behavior: ["Sudden deaths", "Dull, standing alone", "Not eating", "Drop in egg laying"]
    },
    match: {
      "Greenish watery diarrhoea": 3, "Sudden deaths": 3, "Twisted neck / stargazing": 4,
      "Paralysis of legs or wings": 3, "Gasping / rattling sound": 2, "Sneezing / coughing": 1,
      "Trembling or circling": 2, "Dull, standing alone": 1, "Not eating": 1,
      "Bluish or dark comb": 2, "Nasal discharge": 1, "Drop in egg laying": 1
    },
    spread: "Spreads very fast through the air, contaminated water/feed, equipment, wild birds, and people moving between farms. Outbreaks often follow hot, dry, windy weather (harmattan).",
    photoHints: "Photograph the droppings (check for green), any bird with a twisted neck, and the face/comb of a sick bird.",
    diagnosis: "Twisted neck + green diarrhoea + many sudden deaths in an unvaccinated flock is almost always Newcastle. There is no cure — act fast to save the rest of the flock.",
    chemical: [
      { name: "There is NO drug that kills the virus", how: "Treatment is supportive only.", note: "Do not waste money on antibiotics expecting them to cure ND." },
      { name: "Vitamin + electrolyte therapy", how: "e.g. Embavit, Lyvit, or any multivitamin/electrolyte (Glucose + salt mix) in drinking water for 5–7 days.", note: "Helps survivors recover strength." },
      { name: "Antibiotics (only for secondary infections)", how: "Oxytetracycline (e.g. Invert 200) or Tylosin in water as directed, if your vet advises.", note: "Controls bacteria that attack weakened birds." }
    ],
    natural: [
      { name: "Neem leaf extract (Dongoyaro / Neem)", prep: "Crush a handful of fresh neem leaves per 2 litres of water, soak overnight, strain.", how: "Give as the only drinking water for 5 days. Supports recovery and immunity.", evidence: "Widely used in West African village poultry; antibacterial and immune-supporting properties." },
      { name: "Aloe vera + chilli pepper", prep: "Crush 1 aloe leaf with 2–3 ripe bird's-eye chillies in 2 L water.", how: "Give in drinking water 3–5 days. Documented ethnoveterinary ND support in rural Africa.", evidence: "Used by farmers in multiple African countries for ND outbreaks." },
      { name: "Lime / lemon in water", prep: "Juice of 2 limes per 2 L clean water.", how: "Traditional Ghanaian supportive care during ND outbreaks; keep water fresh daily." },
      { name: "Garlic + ginger water", prep: "Crush 4 cloves garlic + thumb of ginger per 2 L water.", how: "Immune support for survivors." }
    ],
    prevention: [
      "VACCINATE — this is the single most important step. Lasota (water/eye drop) every 3 months for village birds, or I-2 vaccine (thermostable, designed for village flocks) via your vet officer or agricultural extension office.",
      "Isolate new birds for 2 weeks before mixing.",
      "Stop visitors from entering the poultry area during outbreaks; disinfect shoes.",
      "Control wild birds' access to feed and water.",
      "Sick birds: separate immediately; do not sell or eat birds that died of disease."
    ],
    vetNote: "If more than a few birds die per day with these signs, report to your District/Municipal Veterinary Office — ND outbreaks can wipe out entire village flocks."
  },

  {
    id: "gumboro",
    name: "Gumboro (Infectious Bursal Disease, IBD)",
    aka: "Kills young birds by destroying their immunity",
    type: "Viral",
    severity: "very high",
    urgent: true,
    species: ["Chicken", "Guinea fowl"],
    age: "Chicks 3–6 weeks old worst hit; up to 8 weeks",
    symptoms: {
      droppings: ["Whitish / chalky watery droppings"],
      behavior: ["Sudden deaths", "Dull, standing alone", "Not eating", "Pecking at the vent"],
      body: ["Ruffled feathers"],
      head: ["Watery eyes"]
    },
    match: {
      "Whitish / chalky watery droppings": 4, "Sudden deaths": 2, "Dull, standing alone": 2,
      "Not eating": 1, "Ruffled feathers": 2, "Pecking at the vent": 3, "Watery eyes": 1
    },
    spread: "Very tough virus — survives in the house for months. Spread via contaminated litter, water, boots, beetles. One outbreak can leave young birds permanently weak.",
    photoHints: "Photograph the whitish droppings and the vent area of sick chicks.",
    diagnosis: "Chicks 3–6 weeks old, prostrate, whitish diarrhoea, vent pecked, quick deaths — classic Gumboro. Squeeze the lower belly gently: a swollen, bluish gland (bursa) supports it.",
    chemical: [
      { name: "No cure exists — supportive care only", how: "Reduce stress. Provide vitamins + electrolytes in water.", note: "" },
      { name: "Multivitamin + electrolytes", how: "In drinking water 5–7 days (e.g. Embavit, Livestock vitamins).", note: "Reduces deaths in the flock." },
      { name: "Antibiotics only if vet advises", how: "To control secondary bacterial infection.", note: "Not for the virus itself." }
    ],
    natural: [
      { name: "Bitter leaf (Vernonia amygdalina)", prep: "Crush a handful of fresh leaves in 2 L water, strain.", how: "Give as drinking water for 5 days. KCOA/organic research supports bitter leaf as an immune booster for birds.", evidence: "Tested in organic poultry trials as natural antibiotic support." },
      { name: "Moringa leaf powder", prep: "Dry and pound moringa leaves; mix 1–2 spoons per litre of feed or water.", how: "Immune support during and after outbreak; moringa strengthens birds' resistance.", evidence: "Well-documented poultry supplement across West Africa." },
      { name: "Sugar-salt rehydration (home ORS)", prep: "6 level spoons sugar + half spoon salt + half spoon bicarbonate (kanwu/kitchen soda) in 1 L clean water.", how: "Prevents dehydration from watery droppings." }
    ],
    prevention: [
      "Vaccinate: Gumboro (IBD) vaccine around day 14 and again day 21 of age (follow your vet's program).",
      "Clean and disinfect the brooder house between batches — the virus survives months in old litter.",
      "Never rear new chicks in the same litter as previous sick batches.",
      "Give vitamins 2 days before and after vaccination to protect immunity."
    ],
    vetNote: "Birds that survive Gumboro stay weak and grow poorly — prevention through vaccination is far better than treatment."
  },

  {
    id: "coccidiosis",
    name: "Coccidiosis",
    aka: "Bloody droppings disease — one of the most common and most treatable",
    type: "Parasitic (protozoa in the gut)",
    severity: "high",
    urgent: true,
    species: ["Chicken", "Guinea fowl", "Turkey", "Duck"],
    age: "Mostly young birds 3–8 weeks; all ages in dirty, wet conditions",
    symptoms: {
      droppings: ["Bloody or red droppings", "Brownish watery droppings", "Yellow foamy droppings"],
      behavior: ["Dull, standing alone", "Not eating", "Drop in egg laying"],
      body: ["Ruffled feathers", "Pale comb / wattles"],
      head: ["Pale comb / wattles"]
    },
    match: {
      "Bloody or red droppings": 6, "Brownish watery droppings": 2, "Yellow foamy droppings": 2,
      "Ruffled feathers": 2, "Dull, standing alone": 2, "Pale comb / wattles": 2,
      "Not eating": 1, "Drop in egg laying": 1
    },
    spread: "Parasite eggs (oocysts) multiply in wet litter. Spreads through droppings-contaminated feed, water and litter. Worst in the rainy season and in overcrowded, damp houses.",
    photoHints: "Photograph the droppings — blood or mucus is the key sign. Also photograph the litter condition (wet or dry?).",
    diagnosis: "Blood in droppings + dull young birds + wet litter = coccidiosis until proven otherwise. It responds well to early treatment — act the same day.",
    chemical: [
      { name: "Amprolium", how: "In drinking water for 5–7 days per product label (e.g. Ampremyn, Amprol, Coccidiostat brands sold in Ghana agrovets).", note: "First-choice coccidiosis drug; cheap and effective." },
      { name: "Toltrazuril", how: "2 days in drinking water as per label (e.g. Baycox).", note: "Stronger option for stubborn outbreaks." },
      { name: "Sulfa drugs", how: "e.g. Sulfaquinoxaline / sulphadimidine in water 3 days, per label.", note: "Follow with vitamins; overdose harms young birds." },
      { name: "Vitamin A + K", how: "After treatment, to heal the gut and stop bleeding.", note: "Speeds recovery." }
    ],
    natural: [
      { name: "Garlic water", prep: "Crush 5–6 cloves per 2 L water; let sit 1 hour, strain.", how: "Give 5–7 days. Studies show garlic reduces oocyst shedding in poultry.", evidence: "Research-backed anticoccidial support." },
      { name: "Papaya (pawpaw) seeds", prep: "Dry and powder the seeds.", how: "Mix 1 spoon per 2 L of feed or water for a week.", evidence: "Traditional antiparasitic used across West Africa." },
      { name: "Neem leaf extract", prep: "As for Newcastle (handful of leaves / 2 L water overnight).", how: "Supports gut recovery; 5 days.", evidence: "Neem shows anticoccidial activity in studies." },
      { name: "Cayenne pepper in feed", prep: "Half spoon per 2 L feed.", how: "Traditional supportive care for bloody droppings.", evidence: "Farmer practice; some antimicrobial support in studies." }
    ],
    prevention: [
      "KEEP LITTER DRY — coccidiosis is a wet-litter disease. Turn or change wet litter immediately.",
      "Do not overcrowd; give each bird space to avoid droppings piling up.",
      "Raise feeders and drinkers so birds don't drop manure into them.",
      "Coccidiostat in commercial feed for young birds helps prevention.",
      "Treat the whole flock, not just visibly sick birds."
    ],
    vetNote: "Very treatable if caught early. If birds stop eating and stand with eyes closed, go to an agrovet for Amprolium immediately."
  },

  {
    id: "fowlpox",
    name: "Fowl Pox",
    aka: "Wart disease / sore head — scabby sores on comb and face",
    type: "Viral",
    severity: "medium",
    urgent: false,
    species: ["Chicken", "Guinea fowl", "Turkey", "Pigeon"],
    age: "All ages; slower spread than Newcastle",
    symptoms: {
      head: ["Warty nodules / scabs on comb or face", "Watery eyes"],
      breathing: ["Wet lesions in mouth (advanced)"],
      behavior: ["Dull, standing alone", "Drop in egg laying", "Not eating"],
      body: ["Wounds / sores on skin"]
    },
    match: {
      "Warty nodules / scabs on comb or face": 7, "Wounds / sores on skin": 2,
      "Watery eyes": 1, "Dull, standing alone": 1, "Not eating": 1, "Drop in egg laying": 1
    },
    spread: "Mosquitoes carry it (huge factor in Northern Ghana's season). Direct contact with scabs and contaminated water also spreads it. Slow-moving — often drags weeks.",
    photoHints: "Photograph the comb, face and wattles closely — the warty scabs are unmistakable.",
    diagnosis: "Grey-white to dark warty scabs on comb, eyelids or wattles = fowl pox. If sores are inside the mouth/throat, it is the more dangerous wet form.",
    chemical: [
      { name: "Iodine or glycerine on the sores", how: "Paint each scab with tincture of iodine or glycerine daily until dry.", note: "Prevents secondary infection." },
      { name: "Vitamin A supplement", how: "In water or feed for 7–10 days.", note: "Speeds skin healing." },
      { name: "Antibiotic only if wounds get infected", how: "Per vet advice.", note: "Optional." }
    ],
    natural: [
      { name: "Bitter kola + cayenne pepper", prep: "Grind 2–3 bitter kola nuts + 1 spoon cayenne; infuse in 2 L water overnight.", how: "Give as drinking water 5 days. KCOA organic factsheet supports this preparation for poultry skin/respiratory conditions.", evidence: "Documented organic remedy (KCOA factsheet)." },
      { name: "Aloe vera gel on sores", prep: "Fresh gel straight from the leaf.", how: "Apply to scabs twice daily to soothe and protect.", evidence: "Common village practice; mild antimicrobial." },
      { name: "Neem leaf water", prep: "As before (handful leaves / 2 L).", how: "Immune support during recovery." }
    ],
    prevention: [
      "VACCINATE with fowl pox vaccine from ~6 weeks of age (wing-web stab).",
      "CONTROL MOSQUITOES: fumigate/spray in the evening, remove stagnant water, use mosquito nets on open-sided houses.",
      "Isolate birds with scabs.",
      "Disinfect water troughs — the virus lives in scabs that fall in water."
    ],
    vetNote: "Fowl pox rarely kills adult birds but lowers egg laying and makes young birds weak for weeks. Vaccination + mosquito control solves it."
  },

  {
    id: "fowltyphoid",
    name: "Fowl Typhoid / Pullorum",
    aka: "Chalky white droppings disease — bacterial and treatable",
    type: "Bacterial (Salmonella gallinarum / pullorum)",
    severity: "high",
    urgent: true,
    species: ["Chicken", "Guinea fowl", "Turkey", "Pigeon"],
    age: "Pullorum kills chicks in week 1; typhoid hits growers and adults",
    symptoms: {
      droppings: ["Whitish / chalky watery droppings"],
      behavior: ["Sudden deaths", "Dull, standing alone", "Not eating", "Drop in egg laying"],
      body: ["Ruffled feathers", "Pale comb / wattles"],
      breathing: ["Gasping / rattling sound (chicks)"],
      nerves: ["Trembling or circling (rare)"]
    },
    match: {
      "Whitish / chalky watery droppings": 3, "Sudden deaths": 2, "Dull, standing alone": 1,
      "Ruffled feathers": 1, "Pale comb / wattles": 1, "Not eating": 1, "Drop in egg laying": 1,
      "Gasping / rattling sound": 1, "Trembling or circling": 1
    },
    spread: "Passed from hen to chick through the egg. Also spread via droppings, feed and equipment. Can become permanent in a farm if infected breeders are kept.",
    photoHints: "Photograph the whitish droppings; if a bird dies, photograph it before burial (swollen liver and spleen are what a vet looks for).",
    diagnosis: "Chalky-white diarrhoea + deaths that spread slower than Newcastle + no twisted neck = suspect fowl typhoid. Responds to antibiotics — unlike ND/Gumboro.",
    chemical: [
      { name: "Oxytetracycline or Enrofloxacin", how: "In drinking water 3–5 days per label (brands in Ghana: Invert 200, Enrocin, Vet products).", note: "Effective if started early." },
      { name: "Sulfa drugs", how: "Sulphadimidine in water per label.", note: "Alternative treatment." },
      { name: "Furazolidone", how: "Where available, in feed per label.", note: "Traditional typhoid drug." }
    ],
    natural: [
      { name: "Bitter leaf (Vernonia amygdalina)", prep: "Crushed leaves in water overnight (as Gumboro recipe).", how: "Supportive antibacterial water for 5–7 days. Best alongside antibiotics, not instead.", evidence: "KCOA organic trials used bitter leaf as natural antibiotic for birds." },
      { name: "Guava leaf tea", prep: "Handful of leaves boiled in 2 L water for 10 min; cool.", how: "Antibacterial supportive care for diarrhoea.", evidence: "Guava leaves show antibacterial activity in studies." },
      { name: "Garlic + ginger water", prep: "As before.", how: "Daily supportive care." }
    ],
    prevention: [
      "Buy chicks and eggs only from flocks known to be clean — this disease travels through eggs.",
      "Do not keep recovered birds as breeders if deaths continue — they stay carriers.",
      "Clean water daily; drinkers washed every 2–3 days.",
      "Vaccination exists for fowl typhoid in some programs — ask your vet officer.",
      "Burn or bury dead birds deep, away from the house."
    ],
    vetNote: "If chalky-white droppings continue after treatment, ask the vet office to test for typhoid carriers in the flock."
  },

  {
    id: "cholera",
    name: "Fowl Cholera (Pasteurellosis)",
    aka: "Sudden death with swollen wattles — highly fatal",
    type: "Bacterial",
    severity: "very high",
    urgent: true,
    species: ["Chicken", "Guinea fowl", "Duck", "Turkey"],
    age: "Adult birds usually; big kills in growing flocks",
    symptoms: {
      behavior: ["Sudden deaths", "Dull, standing alone", "Not eating", "Drop in egg laying"],
      head: ["Swollen face or wattles", "Bluish or dark comb"],
      droppings: ["Greenish watery diarrhoea", "Yellow foamy droppings"],
      breathing: ["Nasal discharge", "Gasping / rattling sound"],
      body: ["Lame without visible wound"]
    },
    match: {
      "Swollen face or wattles": 5, "Sudden deaths": 2, "Greenish watery diarrhoea": 2,
      "Not eating": 1, "Lame without visible wound": 2, "Bluish or dark comb": 1,
      "Nasal discharge": 1, "Yellow foamy droppings": 1, "Drop in egg laying": 1, "Dull, standing alone": 1
    },
    spread: "Spread by rats (major carriers!), wild birds, and contaminated water. Outbreaks often follow stress like weather change or new birds joining.",
    photoHints: "Photograph swollen wattles/face and any birds found dead. Fast deaths with swollen wattles is very suggestive.",
    diagnosis: "Swollen wattle + green droppings + very sudden deaths in adults = suspect cholera. Treated birds can survive if antibiotics start early.",
    chemical: [
      { name: "Oxytetracycline / Tetracycline", how: "In drinking water or injection per label for 3–5 days.", note: "First-line; works fast if early." },
      { name: "Sulfaquinoxaline", how: "In water per label.", note: "Alternative." },
      { name: "Enrofloxacin", how: "Per vet prescription for serious outbreaks.", note: "Prescription use — follow vet advice." }
    ],
    natural: [
      { name: "Neem leaf water", prep: "Standard recipe (handful / 2 L overnight).", how: "Supportive — neem shows antibacterial activity; NOT a substitute for antibiotics in cholera.", evidence: "Antibacterial studies support use as support only." },
      { name: "Moringa leaf powder", prep: "1–2 spoons dried powder per litre feed.", how: "Recovery support after antibiotics.", evidence: "Immune-supporting supplement." }
    ],
    prevention: [
      "CONTROL RATS — they are the main cholera carriers between farms.",
      "Vaccination available in some programs (ask your district vet office).",
      "Never feed birds near open water where wild waterfowl gather (ducks are carriers).",
      "Quarantine new birds 2 weeks.",
      "Disinfect drinkers regularly."
    ],
    vetNote: "Cholera kills within hours. If you see sudden deaths plus swollen wattles, start antibiotics same day and call the vet office."
  },

  {
    id: "crd",
    name: "Chronic Respiratory Disease (CRD / Mycoplasmosis)",
    aka: "The coughing and sneezing disease — slow, stubborn, treatable",
    type: "Bacterial (Mycoplasma gallisepticum)",
    severity: "medium",
    urgent: false,
    species: ["Chicken", "Guinea fowl", "Turkey", "Duck"],
    age: "All ages; spreads slowly through the flock",
    symptoms: {
      breathing: ["Sneezing / coughing", "Rattling sound / gurgling", "Nasal discharge", "Gasping / rattling sound"],
      head: ["Watery eyes", "Bubbles in the eyes", "Swollen face or wattles", "Swollen eyes"],
      behavior: ["Dull, standing alone", "Drop in egg laying", "Slow growth"],
      body: ["Ruffled feathers"]
    },
    match: {
      "Sneezing / coughing": 4, "Rattling sound / gurgling": 3, "Nasal discharge": 3,
      "Bubbles in the eyes": 3, "Watery eyes": 2, "Swollen eyes": 2, "Swollen face or wattles": 1,
      "Dull, standing alone": 1, "Drop in egg laying": 1, "Ruffled feathers": 1, "Slow growth": 2, "Gasping / rattling sound": 2
    },
    spread: "Spread through the egg from breeders AND through the air between birds. Stress (dust, ammonia, cold nights, transport) triggers outbreaks. Often complicates Newcastle vaccine reactions.",
    photoHints: "Photograph the eyes (bubbles in the corner are classic) and record a video if you hear the rattling sound.",
    diagnosis: "Long-lasting sneezing + bubbly eyes + rattling with NO sudden deaths = CRD. It hides in flocks and flares with stress.",
    chemical: [
      { name: "Tylosin", how: "In drinking water 3–5 days per label (e.g. Tylodox, Tylosin brands in Ghana).", note: "Very effective against Mycoplasma." },
      { name: "Tiamulin", how: "In water per label.", note: "Strong alternative." },
      { name: "Oxytetracycline", how: "In water 5 days.", note: "Cheaper option for mild cases." },
      { name: "Follow with vitamins", how: "Multivitamin after treatment.", note: "Recovery boost." }
    ],
    natural: [
      { name: "Bitter kola + cayenne pepper (CRD-specific)", prep: "Grind 2–3 bitter kola + 1 spoon cayenne; infuse in 2 L water overnight; strain.", how: "Give 5 days. KCOA organic factsheet documents this exact preparation for poultry cough (CRD) and growth promotion.", evidence: "Documented organic remedy (KCOA)." },
      { name: "Ginger + garlic water", prep: "Crush equal parts ginger and garlic, 1 spoon per 2 L water.", how: "Soothing respiratory support, 5–7 days.", evidence: "Common farmer practice; antimicrobial support." },
      { name: "Eucalyptus / menthol steam (for the house)", prep: "Boil eucalyptus leaves in water near (NOT inside) the house so vapour drifts in.", how: "Traditional airway relief in human and bird medicine.", evidence: "Traditional practice." }
    ],
    prevention: [
      "Buy chicks from CRD-free hatcheries — it passes through eggs.",
      "Avoid dust and ammonia: enough ventilation, dry litter, don't overcrowd.",
      "Keep night temperatures stable for chicks — cold stress triggers CRD.",
      "Complete treatment courses; CRD returns if you stop drugs early."
    ],
    vetNote: "CRD rarely kills quickly but wastes feed and slows growth for months. Treat the whole flock, not just coughing birds."
  },

  {
    id: "coryza",
    name: "Infectious Coryza",
    aka: "Swollen face disease — fast-spreading but treatable",
    type: "Bacterial",
    severity: "high",
    urgent: true,
    species: ["Chicken", "Guinea fowl", "Turkey"],
    age: "All ages",
    symptoms: {
      head: ["Swollen face or wattles", "Swollen eyes", "Watery eyes", "Bubbles in the eyes"],
      breathing: ["Nasal discharge", "Sneezing / coughing", "Rattling sound / gurgling"],
      behavior: ["Dull, standing alone", "Not eating", "Drop in egg laying"],
      body: ["Ruffled feathers"]
    },
    match: {
      "Swollen face or wattles": 4, "Swollen eyes": 3, "Nasal discharge": 2, "Sneezing / coughing": 2,
      "Watery eyes": 1, "Bubbles in the eyes": 1, "Not eating": 1, "Drop in egg laying": 1,
      "Dull, standing alone": 1, "Rattling sound / gurgling": 1, "Ruffled feathers": 1
    },
    spread: "Spreads bird-to-bird by contact and through drinking water. Carriers look healthy and shed for life — new birds often bring it in.",
    photoHints: "Photograph the swollen face from the front and side. One-sided face swelling with foul smell is classic.",
    diagnosis: "Face swells fast (sometimes one side only), watery eyes, bad smell around the nose, and egg laying crashes — coryza. It looks like cholera but no sudden deaths; treat early.",
    chemical: [
      { name: "Sulfa drugs", how: "e.g. sulphadimidine in water 3–5 days per label.", note: "Classic coryza treatment." },
      { name: "Oxytetracycline / Tylosin", how: "In water 5 days per label.", note: "Alternatives." },
      { name: "Combination for stubborn cases", how: "Sulfa + tetracycline per vet advice.", note: "For severe outbreaks." }
    ],
    natural: [
      { name: "Scent leaf (Ocimum / Nunum) tea", prep: "Crush a handful of leaves in 2 L water, strain.", how: "Antibacterial supportive water for 5 days — used by Ghanaian farmers for respiratory infections.", evidence: "Ocimum species show antibacterial activity in studies." },
      { name: "Bitter kola + cayenne water", prep: "As CRD recipe.", how: "Respiratory support." },
      { name: "Warm water with honey (individual sick birds)", prep: "1 spoon honey in half cup warm water.", how: "Dose a very sick bird by mouth twice daily as supportive care." }
    ],
    prevention: [
      "Never reintroduce recovered birds to a clean flock — they remain carriers.",
      "Separate new birds 2–3 weeks.",
      "Scrub drinkers daily during an outbreak.",
      "Cull severely disfigured birds — they keep reinfecting."
    ],
    vetNote: "Treat the WHOLE flock at once — treating individual birds never clears coryza because carriers look fine."
  },

  {
    id: "mareks",
    name: "Marek's Disease",
    aka: "Paralysis disease — legs forward one way, wings the other",
    type: "Viral (herpesvirus)",
    severity: "high",
    urgent: false,
    species: ["Chicken"],
    age: "Usually 8–20 weeks (growers)",
    symptoms: {
      nerves: ["Paralysis of legs or wings", "One leg forward, one back", "Twisted neck / stargazing (rare)"],
      body: ["Ruffled feathers", "Pale comb / wattles"],
      behavior: ["Dull, standing alone", "Not eating", "Slow growth"]
    },
    match: {
      "Paralysis of legs or wings": 5, "One leg forward, one back": 6, "Slow growth": 1,
      "Ruffled feathers": 1, "Pale comb / wattles": 1, "Dull, standing alone": 1, "Not eating": 1,
      "Twisted neck / stargazing": 1
    },
    spread: "Spread through feather dust and dander; almost every flock is exposed. Whether birds get sick depends on vaccination and stress. No cure.",
    photoHints: "Photograph the bird standing or trying to walk — the classic split-leg posture shows clearly.",
    diagnosis: "A grower with one leg stretched forward and the other back, unable to stand but still alert = classic Marek's. There is no treatment for affected birds.",
    chemical: [
      { name: "No treatment exists for sick birds", how: "Cull affected birds to stop suffering.", note: "" },
      { name: "Support the rest of the flock", how: "Vitamins in water; reduce stress.", note: "Prevention is the only cure." }
    ],
    natural: [
      { name: "Moringa + bitter leaf immune water", prep: "Standard recipes as above.", how: "General immune support for the remaining flock — will not cure paralysis but supports birds fighting the virus.", evidence: "Immune-supporting supplements." }
    ],
    prevention: [
      "VACCINATE day-old chicks with Marek's vaccine at the hatchery — this is standard and highly effective.",
      "Buy chicks only from hatcheries that vaccinate for Marek's (ask!).",
      "Reduce feather dust: good ventilation, don't disturb litter.",
      "Do not keep growing birds in old dusty houses where Marek's occurred before."
    ],
    vetNote: "Paralysis with no response to treatment after 3–5 days strongly suggests Marek's. All future chicks must be vaccinated."
  },

  {
    id: "ib",
    name: "Infectious Bronchitis (IB)",
    aka: "Fast coughing disease of chicks — also ruins eggs later",
    type: "Viral (coronavirus)",
    severity: "high",
    urgent: false,
    species: ["Chicken"],
    age: "Chicks under 4 weeks worst affected",
    symptoms: {
      breathing: ["Sneezing / coughing", "Gasping / rattling sound", "Rattling sound / gurgling", "Nasal discharge"],
      behavior: ["Dull, standing alone", "Not eating", "Drop in egg laying", "Slow growth"],
      head: ["Watery eyes"],
      droppings: ["Whitish / chalky watery droppings (kidney form)"]
    },
    match: {
      "Sneezing / coughing": 2, "Gasping / rattling sound": 3, "Rattling sound / gurgling": 2,
      "Dull, standing alone": 1, "Not eating": 1, "Watery eyes": 1, "Slow growth": 2,
      "Drop in egg laying": 2, "Whitish / chalky watery droppings": 1, "Nasal discharge": 1
    },
    spread: "Extremely contagious through the air — whole house infected in days. Cold weather and chick stress make it worse. Damages the reproductive tract — layers may never lay well again.",
    photoHints: "Photograph/record the gasping chicks. Note the age of the flock — IB targets young chicks fast.",
    diagnosis: "Sudden coughing spread through ALL chicks within days + no swollen face + deaths low in adults but chicks pile up and die = IB. Combine ND-IB vaccination to prevent.",
    chemical: [
      { name: "No direct cure — supportive care", how: "Vitamins + electrolytes; keep chicks warm.", note: "" },
      { name: "Antibiotics for secondary infection only", how: "Oxytetracycline in water per vet advice.", note: "" }
    ],
    natural: [
      { name: "Ginger + garlic water", prep: "Standard recipe.", how: "Respiratory and immune support for 5–7 days.", evidence: "Antimicrobial and immune support." },
      { name: "Warm brooder + steam relief", prep: "Ensure brooder warmth; eucalyptus steam near the house.", how: "Cold stress doubles IB deaths in chicks." }
    ],
    prevention: [
      "Vaccinate: ND-IB combined vaccine (e.g. Lasota-IB or clone) around day 7 and boost per program.",
      "Keep brooders warm and draught-free.",
      "All-in, all-out rearing — clean house between batches.",
      "Vitamin C before cold nights reduces stress deaths."
    ],
    vetNote: "IB is why chicks cough without swollen faces. If it hits your flock, future egg production of pullets may drop — ask your vet about layer IB vaccination."
  },

  {
    id: "worms",
    name: "Worms (Internal Parasites)",
    aka: "The silent profit stealer — eat your feed, slow your birds",
    type: "Parasitic (roundworms, tapeworms, threadworms)",
    severity: "medium",
    urgent: false,
    species: ["Chicken", "Guinea fowl", "Duck", "Turkey", "Pigeon"],
    age: "All ages; free-range and scavenging birds worst affected",
    symptoms: {
      droppings: ["Worms visible in droppings", "Yellow foamy droppings", "Dark tarry droppings"],
      behavior: ["Slow growth", "Drop in egg laying", "Not eating", "Dull, standing alone"],
      body: ["Ruffled feathers", "Pale comb / wattles", "Swollen belly (heavy infection)"],
      head: ["Pale comb / wattles"]
    },
    match: {
      "Worms visible in droppings": 7, "Slow growth": 3, "Pale comb / wattles": 2,
      "Yellow foamy droppings": 2, "Drop in egg laying": 2, "Ruffled feathers": 1,
      "Swollen belly (heavy infection)": 2, "Dull, standing alone": 1, "Dark tarry droppings": 1, "Not eating": 1
    },
    spread: "Birds pick up worm eggs from soil, droppings, snails/slugs (tapeworm) and insects. Free-range village flocks almost always carry worms. Wet season = peak.",
    photoHints: "Photograph droppings showing worms (long white strands or rice-grain segments).",
    diagnosis: "Pale combs, slow growth, poor laying, worms in droppings, birds eating well but thin. Deworming every 2–3 months is standard for free-range flocks.",
    chemical: [
      { name: "Levamisole", how: "In drinking water once; repeat in 2–3 weeks (per label).", note: "Cheap, effective for roundworms." },
      { name: "Albendazole", how: "Per label in water or as bolus; broad-spectrum.", note: "Common Ghana vet shops." },
      { name: "Fenbendazole / Flubendazole", how: "In feed per label.", note: "Good for tapeworms too." },
      { name: "Withdrawal: do not eat eggs from treated birds for the label period (often 5–7 days).", how: "", note: "Read the label." }
    ],
    natural: [
      { name: "Papaya (pawpaw) seeds", prep: "Dry and powder seeds; 1 spoon per 2 L feed for 7 days.", how: "Traditional dewormer with research support against roundworms.", evidence: "Papaya seeds show anthelmintic activity in studies." },
      { name: "Neem leaf water", prep: "Standard recipe.", how: "Give 5–7 days monthly as a preventive dewormer.", evidence: "Neem shows anthelmintic properties in trials." },
      { name: "Garlic water", prep: "Standard recipe.", how: "Supports natural worm control; give 3 days monthly.", evidence: "Some evidence against intestinal worms." },
      { name: "Bitter leaf water", prep: "Standard recipe.", how: "Supportive deworm support.", evidence: "Traditional use." }
    ],
    prevention: [
      "Deworm the whole flock every 2–3 months (free-range) or per vet program.",
      "Rotate ranging areas if possible — old ground builds up worm eggs.",
      "Dry litter; control snails and slugs near the house (tapeworm hosts).",
      "Deworm new birds before mixing them in."
    ],
    vetNote: "No dewormer kills every worm type — if signs continue after treatment, ask for a faecal test at the vet office."
  },

  {
    id: "mites",
    name: "Mites & Lice (External Parasites)",
    aka: "The night vampires — birds become pale and weak from blood loss",
    type: "Parasitic (mites, lice, ticks)",
    severity: "medium",
    urgent: false,
    species: ["Chicken", "Guinea fowl", "Turkey", "Pigeon", "Duck"],
    age: "All ages",
    symptoms: {
      body: ["Mites or lice visible", "Wounds / sores on skin", "Ruffled feathers", "Pale comb / wattles", "Feather loss"],
      behavior: ["Dull, standing alone", "Drop in egg laying", "Not eating", "Slow growth"],
      head: ["Pale comb / wattles", "Scaly legs / swollen scales"]
    },
    match: {
      "Mites or lice visible": 7, "Scaly legs / swollen scales": 4, "Feather loss": 2,
      "Pale comb / wattles": 2, "Wounds / sores on skin": 2, "Ruffled feathers": 1,
      "Drop in egg laying": 1, "Slow growth": 1, "Dull, standing alone": 1, "Not eating": 1
    },
    spread: "Mites hide in cracks and come out at night to suck blood. Spread by wild birds, new birds, shared equipment. Scaly-leg mite causes crusty, deformed toes.",
    photoHints: "Photograph: (1) the vent area feathers at night with a torch — red or grey dots moving; (2) the legs if scales are lifted.",
    diagnosis: "Pale birds + restless at night + visible crawling specks, especially around vent = mites. Crusty thickened leg scales = scaly-leg mite.",
    chemical: [
      { name: "Carbaryl (Sevin) dust", how: "Dust the birds and especially the house cracks/perches per label.", note: "Very effective; available in agrovets." },
      { name: "Ivermectin (drops or injection)", how: "Apply per label; repeat after 10–14 days.", note: "Also helps scaly-leg mite." },
      { name: "Scaly-leg: dip legs in kerosene-soaked cloth or oily ivermectin", how: "Careful, per vet direction.", note: "Suffocates the mites under scales." }
    ],
    natural: [
      { name: "Wood ash + sand dust bath", prep: "Box with fine wood ash + sand, half and half.", how: "Birds dust-bathe to smother parasites. Add neem powder if available. Refresh weekly.", evidence: "Traditional, effective physical control." },
      { name: "Neem leaf/seed extract spray", prep: "Soak crushed neem leaves (or 50g neem seed powder) in 2 L water overnight; strain into sprayer.", how: "Spray perches, walls cracks and birds lightly every 5–7 days.", evidence: "Neem is a documented acaricide/insecticide." },
      { name: "Coconut / palm kernel oil on scaly legs", prep: "Plain oil warmed slightly.", how: "Massage onto legs twice weekly for 3 weeks — smothers scaly-leg mites." },
      { name: "Kerosene + palm oil mix (perches)", prep: "1 part kerosene : 3 parts palm oil.", how: "Paint perches and cracks where mites hide at night. Do not put on birds' skin.", evidence: "Long-standing farmer practice for house treatment." }
    ],
    prevention: [
      "Provide dust baths year-round.",
      "Paint/clean perch cracks — that's where red mites breed.",
      "Inspect 2–3 birds at night monthly with a torch around the vent.",
      "Quarantine and inspect new birds.",
      "Clean the house between batches with soapy water and a mite spray/dust."
    ],
    vetNote: "Heavy mite loads can kill chicks and drop laying by half — the birds look 'healthy but pale'. Treat the HOUSE, not just the birds."
  },

  {
    id: "necrotic",
    name: "Necrotic Enteritis",
    aka: "Gut rot — brown/black foul droppings after wet litter or coccidiosis",
    type: "Bacterial (Clostridium)",
    severity: "high",
    urgent: true,
    species: ["Chicken", "Guinea fowl", "Turkey", "Duck"],
    age: "Young birds 2–8 weeks mostly",
    symptoms: {
      droppings: ["Dark tarry droppings", "Brownish watery droppings", "Bloody or red droppings"],
      behavior: ["Sudden deaths", "Dull, standing alone", "Not eating", "Slow growth"],
      body: ["Ruffled feathers", "Swollen belly (heavy infection)"]
    },
    match: {
      "Dark tarry droppings": 5, "Brownish watery droppings": 2, "Sudden deaths": 2,
      "Dull, standing alone": 2, "Not eating": 1, "Ruffled feathers": 1, "Bloody or red droppings": 1,
      "Swollen belly (heavy infection)": 2, "Slow growth": 1
    },
    spread: "Clostridium lives in the gut; overgrows after coccidiosis, wet litter, sudden feed change, or dirty water. Often follows coccidiosis outbreaks.",
    photoHints: "Photograph the dark, foul-smelling droppings and note recent feed changes.",
    diagnosis: "Black/brown foul droppings + quick deaths in young birds, often right after wet litter or cocci = necrotic enteritis. Treats well with antibiotics.",
    chemical: [
      { name: "Amoxicillin", how: "In water 3–5 days per label.", note: "Highly effective." },
      { name: "Lincomycin / Tylosin", how: "In water per label.", note: "Alternatives." },
      { name: "Bacitracin in feed", how: "Preventive/growth level per program.", note: "Where available." },
      { name: "Treat coccidiosis too if present", how: "Amprolium alongside per vet advice.", note: "Cocci often triggers it." }
    ],
    natural: [
      { name: "Garlic water", prep: "Standard recipe, stronger: 6–8 cloves / 2 L.", how: "Antibacterial gut support 5–7 days.", evidence: "Garlic shows activity against gut Clostridia." },
      { name: "Sour/turbulent water (probiotics)", prep: "Mix a spoon of live yogourt or fermented cereal water (koko/pito leftover) into drinking water.", how: "Restores good gut bacteria after antibiotics.", evidence: "Probiotics competitively exclude Clostridium." },
      { name: "Papaya seed powder", prep: "As worm recipe.", how: "Supportive antimicrobial in feed for a week." }
    ],
    prevention: [
      "Keep litter dry — same rule as cocci.",
      "Change feed gradually over 5–7 days, never suddenly.",
      "Clean water daily; no stale/pond water.",
      "Control coccidiosis — most necrotic enteritis follows cocci.",
      "After antibiotics, give probiotics/yoghurt water to restore gut flora."
    ],
    vetNote: "Deaths can be fast. Start antibiotics the same day and fix the wet litter or it returns."
  },

  {
    id: "heatstress",
    name: "Heat Stress",
    aka: "Harmattan & dry-season killer — panting, wings open, deaths in afternoon",
    type: "Management / environment",
    severity: "high",
    urgent: true,
    species: ["Chicken", "Guinea fowl", "Turkey", "Duck", "Pigeon"],
    age: "Broilers and heavy layers worst; all ages",
    symptoms: {
      behavior: ["Panting / open beak breathing", "Sudden deaths", "Dull, standing alone", "Not eating", "Drop in egg laying"],
      body: ["Wings held away from body", "Pale comb / wattles"],
      breathing: ["Gasping / rattling sound"]
    },
    match: {
      "Panting / open beak breathing": 7, "Wings held away from body": 5, "Sudden deaths": 1,
      "Not eating": 1, "Drop in egg laying": 2, "Gasping / rattling sound": 1, "Dull, standing alone": 1, "Pale comb / wattles": 1
    },
    spread: "Not contagious. Happens when shade is short, water is warm or finished, roofs are hot metal, and birds are crowded. Deaths peak in the afternoon.",
    photoHints: "Photograph the birds panting with wings spread, and the house showing shade/roof conditions.",
    diagnosis: "Birds panting with open beaks, wings spread, eating little during midday heat, thin-shelled eggs, and deaths around 1–4 PM = heat stress. Act on housing and water NOW.",
    chemical: [
      { name: "Vitamin C + electrolytes", how: "In drinking water during heat waves (e.g. 1g Vitamin C per litre + electrolyte per label).", note: "Proven to cut heat-stress deaths." },
      { name: "Sodium bicarbonate (bicarbonate/kitchen soda)", how: "Small pinch per litre of water during peak heat per vet guidance.", note: "Helps acid balance." }
    ],
    natural: [
      { name: "Cold clean water — changed 3–4x daily", prep: "Place drinkers in shade; add ice if possible.", how: "Birds drink more when water is cool. This alone saves lives." },
      { name: "Cassava / plantain leaf shade or grass thatch", prep: "Add shade cloth, palm fronds or woven grass over roof and west side.", how: "Reduces house temperature drastically." },
      { name: "Wet sack / misting walls", prep: "Hang wet jute sacks on walls/fence and wet the ground outside (not inside).", how: "Evaporative cooling." },
      { name: "Feed at dawn and dusk only", prep: "Remove feed from 11am–4pm in extreme heat.", how: "Digestion generates heat — let birds eat in cool hours." }
    ],
    prevention: [
      "Always provide shade and MORE water points in dry season.",
      "Plant shade trees west of the house.",
      "Reduce bird density in hot months.",
      "Give Vitamin C + electrolytes before predicted heat waves.",
      "Move feeding times to early morning and evening.",
      "Ventilate: open sides opposite each other for cross-breeze; raise metal roofs or insulate with grass."
    ],
    vetNote: "Many 'mystery' dry-season deaths in Tamale are heat stress. Fix water + shade before buying drugs."
  },

  {
    id: "nutrition",
    name: "Poor Nutrition / Rickets (Vitamin & Mineral Deficiency)",
    aka: "Weak legs, soft bones, thin birds — the 'no-disease' disease",
    type: "Management / nutrition",
    severity: "medium",
    urgent: false,
    species: ["Chicken", "Guinea fowl", "Duck", "Turkey", "Pigeon"],
    age: "Chicks & growers mostly; layers too",
    symptoms: {
      body: ["Lame without visible wound", "Ruffled feathers", "Feather loss", "Pale comb / wattles"],
      behavior: ["Slow growth", "Dull, standing alone", "Drop in egg laying", "Thin shelled or soft eggs"],
      nerves: ["Walking on hocks (weak legs)"],
      head: ["Pale comb / wattles"]
    },
    match: {
      "Walking on hocks (weak legs)": 5, "Lame without visible wound": 2, "Slow growth": 3,
      "Thin shelled or soft eggs": 5, "Feather loss": 2, "Pale comb / wattles": 1,
      "Drop in egg laying": 2, "Ruffled feathers": 1, "Dull, standing alone": 1
    },
    spread: "Not contagious. Caused by maize-only diets (no minerals), no greens, no bone/shell source, or poor-quality feed. Looks like disease but isn't.",
    photoHints: "Photograph the legs of affected birds and what the flock is being fed.",
    diagnosis: "Chicks walking on their hocks, soft beaks/bones, slow growers despite eating, soft eggs, feathers picked = nutrition. Fix the feed before blaming disease.",
    chemical: [
      { name: "Multivitamin + mineral premix", how: "In water or feed per label for 2–3 weeks.", note: "Fast correction of deficiencies." },
      { name: "Calcium source for layers", how: "Crushed oyster shell / snail shells / eggshell (baked & crushed) free-choice.", note: "Fixes soft eggs in days." },
      { name: "Vitamin D3", how: "In water per label, 5 days.", note: "Needed to absorb calcium — sunshine helps too." }
    ],
    natural: [
      { name: "Moringa leaf meal", prep: "Dry moringa leaves in shade, pound; mix 5–10% into feed.", how: "Rich in protein, vitamins A & C, calcium — documented layer growth and yolk benefits.", evidence: "Strong research support as poultry feed supplement." },
      { name: "Sprouted grains", prep: "Soak maize/beans overnight, spread on a wet sack, sprout 2–3 days.", how: "Sprouting multiplies vitamins; cheap feed upgrade." },
      { name: "Ash + bone meal", prep: "Burn clean bones to charcoal, grind; add 1–2% to feed plus a little wood ash.", how: "Traditional mineral source (calcium, phosphorus)." },
      { name: "Termites & fly larvae (local protein)", prep: "Collect termites from mounds or raise in traps.", how: "Excellent protein for village flocks; boosts growth fast." }
    ],
    prevention: [
      "Never feed maize alone — add a local protein (termites, fish waste, soya) and greens.",
      "Give young greens daily to free-range birds in dry season.",
      "Provide crushed shell/grit always for layers.",
      "Buy feed from a reputable miller; check the mill date.",
      "Sunlight helps vitamin D — open-sided houses are healthy."
    ],
    vetNote: "If deaths continue after diet improves AND vitamins don't help in 2 weeks, look again for disease (worms often hide behind poor nutrition)."
  },

  {
    id: "avianflu",
    name: "Avian Influenza (Bird Flu) — REPORT IMMEDIATELY",
    aka: "Highly deadly, can infect humans — never eat sick or dead birds",
    type: "Viral (Influenza A)",
    severity: "extreme",
    urgent: true,
    reportable: true,
    species: ["Chicken", "Guinea fowl", "Duck", "Turkey", "Pigeon"],
    age: "All ages",
    symptoms: {
      behavior: ["Sudden deaths", "Dull, standing alone", "Drop in egg laying", "Not eating"],
      head: ["Bluish or dark comb", "Swollen face or wattles", "Swollen eyes"],
      droppings: ["Greenish watery diarrhoea", "Whitish / chalky watery droppings"],
      breathing: ["Gasping / rattling sound", "Sneezing / coughing"],
      nerves: ["Twisted neck / stargazing"],
      body: ["Pale comb / wattles", "Sudden comb discoloration"]
    },
    match: {
      "Sudden deaths": 3, "Bluish or dark comb": 3, "Swollen face or wattles": 2,
      "Greenish watery diarrhoea": 2, "Twisted neck / stargazing": 1, "Swollen eyes": 1,
      "Drop in egg laying": 1, "Gasping / rattling sound": 1, "Not eating": 1, "Whitish / chalky watery droppings": 1, "Dull, standing alone": 1
    },
    spread: "Carried by wild waterbirds and spreads to domestic flocks. Extremely high deaths (can kill most of a flock in 2–3 days). Ghana has had outbreaks — always be alert, especially with ducks near water bodies.",
    photoHints: "Photograph the dead birds and count deaths per day. Do NOT touch birds with bare hands.",
    diagnosis: "When MANY birds of all ages die very fast (half the flock in days) with blue combs and swollen heads — especially with ducks/wild waterbirds around — suspect bird flu and report at once.",
    chemical: [
      { name: "NO treatment. Do NOT treat — REPORT.", how: "Call your District Veterinary Office / Veterinary Services Directorate immediately. Ghana uses movement control and depopulation.", note: "Human deaths occur from handling sick birds." }
    ],
    natural: [
      { name: "No remedy is safe or effective.", how: "Do not give herbs, do not slaughter, do not eat or sell sick or dead birds. Report and follow official instructions.", evidence: "" }
    ],
    prevention: [
      "Keep poultry away from ponds, rivers and wild waterbirds.",
      "Do not buy birds from markets during reported outbreaks.",
      "Restrict visitors; disinfect shoes and hands after handling birds.",
      "Report mass deaths immediately: District Veterinary Office or call the Ministry of Food & Agriculture (MoFA) hotline.",
      "Never touch dead birds with bare hands — use gloves/plastic bags."
    ],
    vetNote: "🚨 If your flock is dying in large numbers within days, this is reportable. Call the District Veterinary Office or MoFA immediately. Do NOT eat, sell, or give away any bird from the flock."
  },

  {
    id: "gapeworm",
    name: "Gapeworm (Breathing with open beak / stretching neck)",
    aka: "Young birds 'gaping' — red worms in the windpipe",
    type: "Parasitic (Syngamus trachea)",
    severity: "medium",
    urgent: false,
    species: ["Chicken", "Guinea fowl", "Turkey", "Pigeon"],
    age: "Chicks and growers 2–10 weeks",
    symptoms: {
      breathing: ["Gasping / rattling sound", "Stretched neck / open beak breathing", "Rattling sound / gurgling"],
      behavior: ["Dull, standing alone", "Not eating", "Slow growth"],
      body: ["Ruffled feathers"]
    },
    match: {
      "Stretched neck / open beak breathing": 6, "Gasping / rattling sound": 2,
      "Rattling sound / gurgling": 2, "Dull, standing alone": 1, "Not eating": 1, "Ruffled feathers": 1, "Slow growth": 1
    },
    spread: "Chicks pick up gapeworm from contaminated soil or by eating earthworms/snails/slugs that carry the larvae. Free-range and brooder-raised chicks on old ground are most affected.",
    photoHints: "Photograph the bird stretching its neck with open beak ('gaping').",
    diagnosis: "Young bird stretching neck, mouth open, hacking/gaping sound with NO nasal discharge or eye bubbles = suspect gapeworm. Sometimes you can see red Y-shaped worms when the mouth is opened to the light.",
    chemical: [
      { name: "Levamisole or Albendazole", how: "In water per label; repeat after 2–3 weeks.", note: "Clears lung/gapeworms effectively." },
      { name: "Ivermectin", how: "Per label, by mouth or injection.", note: "Effective alternative." }
    ],
    natural: [
      { name: "Papaya seed + garlic combination", prep: "Standard recipes.", how: "Supportive deworming for young birds; give 5 days.", evidence: "Traditional anthelmintic support." },
      { name: "Neem leaf water", prep: "Standard recipe.", how: "Preventive monthly deworming for chicks on old ground.", evidence: "Anthelmintic support." }
    ],
    prevention: [
      "Raise young birds on fresh ground or new litter, not soil used by previous flocks.",
      "Control earthworm/snail access near brooders.",
      "Deworm chicks on old ground at 3 and 6 weeks.",
      "Separate young chicks from adult free-range birds."
    ],
    vetNote: "Can be confused with IB/CRD — gapeworm birds stretch neck UP with open beak but have clean eyes and no sneezing."
  }
];

/* Droppings quick-reference guide (image keys) */
const DROPPINGS_GUIDE = [
  {
    key: "normal", title: "Healthy droppings",
    color: "#7a5230", border: "#4e341f",
    meaning: "Firm, brown with a white cap — this is normal. A healthy gut.",
    likely: "No disease. Keep water clean and litter dry.",
    image: "https://media.base44.com/images/public/6a905b28db05fd158cb14c9d/d5fd849f2_generated_image.png"
  },
  {
    key: "blood", title: "Red / bloody droppings",
    color: "#a02020", border: "#5e0f0f",
    meaning: "Blood in the droppings — the gut is bleeding.",
    likely: "Coccidiosis is the most common cause in Ghana. Treat the same day with Amprolium or supportive garlic water. Also seen in necrotic enteritis.",
    image: "https://media.base44.com/images/public/6a905b28db05fd158cb14c9d/9f29930b3_generated_image.png"
  },
  {
    key: "white", title: "Chalky / white watery droppings",
    color: "#e8e2d0", border: "#b3aa8c",
    meaning: "Whitish pasty droppings — kidneys or gut infection.",
    likely: "Think Gumboro (chicks 3–6 weeks) or Fowl Typhoid/Pullorum. Compare: Gumboro = young chicks + prostrate; Typhoid = treatable with antibiotics.",
    image: "https://media.base44.com/images/public/6a905b28db05fd158cb14c9d/d3248273a_generated_image.png"
  },
  {
    key: "green", title: "Greenish watery droppings",
    color: "#4c7a2a", border: "#2e4b18",
    meaning: "Bright green diarrhoea — birds not eating + bile.",
    likely: "Newcastle disease (check for twisted neck + sudden deaths). Also fowl cholera (swollen wattles). Vaccinate survivors' flock after outbreak.",
    image: "https://media.base44.com/images/public/6a905b28db05fd158cb14c9d/0a0e784a4_generated_image.png"
  },
  {
    key: "yellow", title: "Yellow / foamy droppings",
    color: "#c9a227", border: "#8a6f1a",
    meaning: "Yellow frothy droppings, often sticky.",
    likely: "Often worms (especially tapeworm) or coccidiosis; in grower flocks also necrotic enteritis or blackhead (esp. turkeys). Deworm + treat cocci if blood appears.",
    image: ""
  },
  {
    key: "dark", title: "Dark / tarry droppings",
    color: "#2b2b2b", border: "#111111",
    meaning: "Black sticky, foul-smelling droppings.",
    likely: "Gut bleeding — necrotic enteritis is most likely, often after wet litter or cocci. Antibiotics (amoxicillin) + dry the litter.",
    image: ""
  }
];

/* Vaccination & management schedule (typical Ghana village/commercial program) */
const SCHEDULE = [
  { day: "Day 1", action: "Marek's vaccine (hatchery injection)", note: "Ask your chick supplier to confirm" },
  { day: "Day 5–7", action: "Newcastle + IB vaccine (Lasota or clone) — eye drop or drinking water", note: "Use clean, chlorine-free water; no vitamins same day" },
  { day: "Day 14", action: "Gumboro (IBD) vaccine — drinking water", note: "Give vitamins 2 days after" },
  { day: "Day 21", action: "Gumboro (IBD) booster", note: "Repeat protects against strong field strains" },
  { day: "Day 28", action: "Newcastle (Lasota) booster", note: "" },
  { day: "Week 6", action: "Fowl pox vaccine (wing-web stab)", note: "Before mosquito season if possible" },
  { day: "Week 8", action: "Newcastle booster (e.g. I-2 / LaSota)", note: "Village flocks: repeat every 3 months" },
  { day: "Week 8–10", action: "Deworm (levamisole) then repeat every 2–3 months", note: "Especially free-range birds" },
  { day: "Week 16–18", action: "Newcastle killed vaccine before laying starts", note: "For layers" }
];

const BIOSECURITY = [
  "House new birds separately for 2 weeks before mixing.",
  "Wash drinkers daily; provide clean water — dirty water spreads half of these diseases.",
  "Keep a footbath (disinfectant in a basin) at the house entrance.",
  "Control rodents — rats carry fowl cholera and steal feed.",
  "Limit visitors; never let strangers handle your birds.",
  "Burn or bury dead birds immediately, deep, away from water sources.",
  "Clean and rest the house 2 weeks between batches (all-in, all-out).",
  "Do not buy birds from markets during disease outbreaks in your area."
];

const DISCLAIMER = "PoultryDoc GH gives educational guidance based on documented poultry health research and Ghana farmer practice. It does not replace a veterinary officer. For severe outbreaks, sudden mass deaths, or before eating/selling treated birds, always contact your District/Municipal Veterinary Office.";
