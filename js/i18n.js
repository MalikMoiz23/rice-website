/* ============================================================
   i18n.js — English and Urdu
   English is written plainly on purpose: short sentences, no
   trade jargon. Where a technical word is unavoidable it is
   explained in the same line.

   Urdu is the everyday Urdu a Pakistani trader speaks, so common
   loanwords stay as loanwords (ریٹ، آرڈر، بوری، مل) rather than
   being replaced with formal words nobody uses out loud.

   Digits stay Western (1, 2, 3) in both languages — that is what
   Pakistani price lists and invoices use.
   ============================================================ */

const NASTALIQ =
  'https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400;600&family=Noto+Naskh+Arabic:wght@400;500;600&display=swap';

export const DICT = {
  en: {
    /* ---- header ---- */
    'nav.range': 'Our rice',
    'nav.grade': 'The grain',
    'nav.sack': 'The bag',
    'nav.process': 'How we make it',
    'nav.quality': 'Quality',
    'nav.order': 'Bulk order',
    'nav.cta': "Today's price",
    'nav.contact': 'Contact',
    'nav.menu': 'Menu',
    'skip': 'Skip to content',
    'brand.name': 'Sunehri',
    'brand.sub': 'Rice Mills',
    'lang.switch': 'اردو',
    'lang.label': 'Switch to Urdu',

    /* ---- hero ---- */
    'hero.eyebrow': 'Sheikhupura, Punjab · making rice since 1974',
    'hero.title': 'Aged basmati,<br><span class="hero__title-accent">packed at our mill.</span>',
    'hero.lede':
      'We buy paddy at the mandi, keep it for a full season, then husk, polish ' +
      'and clean it in our own mill. It goes out in 25 kg and 50 kg bags — sewn ' +
      'shut, stamped with the batch, and on a truck the same week.',
    'hero.cta1': 'See our rice',
    'hero.cta2': 'Work out a price',
    'hero.stat1': 'Bags sent each month',
    'hero.stat1u': 'bags',
    'hero.stat2': 'Kept at least',
    'hero.stat2u': 'months',
    'hero.stat3': 'We sell in',
    'hero.stat3u': 'countries',
    'hero.stage': 'Step 01 — growing in the field',
    'hero.scroll': 'Scroll down to our rice',

    /* ---- marquee ---- */
    'mq.1': 'Super Basmati',
    'mq.2': '1121 Sella',
    'mq.3': '1121 Steam',
    'mq.4': 'Irri-6 Long Grain',
    'mq.5': 'Broken Basmati',
    'mq.6': 'Machine cleaned',
    'mq.7': 'Delivery all over Pakistan',

    /* ---- who we sell to ---- */
    'b.eyebrow': '01 — Who we sell to',
    'b.title': 'One bag, or a full truck',
    'b.lede':
      'We are a wholesale mill, but there is no minimum order. The rice in a ' +
      'single bag going to a house comes off the same stack as the twenty-six ' +
      'tonnes going to a trader — same batch, same lot card, same mill.',
    'b.vol': 'Order size',
    'b.1t': 'Traders and wholesale',
    'b.1m': '100 bags to a full truck',
    'b.1d':
      'Mill price, collected from Sheikhupura or delivered. Loaded the same day ' +
      'you confirm, when we have the stock. Once we have traded a few times we ' +
      'can talk about credit.',
    'b.1c': 'Ask for a truck rate',
    'b.2t': 'Shops, hotels and caterers',
    'b.2m': '10 to 100 bags',
    'b.2d':
      'A standing monthly order of the same grade every time, so what comes out ' +
      'of your pot does not change from one bag to the next. Delivered to your ' +
      'city.',
    'b.2c': 'Ask for a shop rate',
    'b.3t': 'For the home',
    'b.3m': '1 or 2 bags',
    'b.3d':
      'Yes, we sell single bags. The same rice, from the same mill, with the same ' +
      'lot card a trader gets. To your door across Punjab, by courier anywhere ' +
      'else in Pakistan.',
    'b.3c': 'Order one bag',

    /* ---- range ---- */
    'range.eyebrow': '02 — Our rice',
    'range.title': 'Five types, two bag sizes',
    'range.lede':
      'These are our prices at the mill in Sheikhupura. Delivery is not included. ' +
      'Prices move with the mandi, so please call or WhatsApp us for today’s rate.',
    'range.size': 'Bag size',
    'range.25': '25 kg',
    'range.50': '50 kg',
    'card.hint': 'See this grain close up',
    'card.order': 'Order',
    'card.wa': 'WhatsApp',
    'card.per': 'kg bag',
    'spec.broken': 'Broken bits',
    'spec.moisture': 'Water',
    'spec.aged': 'Kept for',
    'spec.clean': 'Cleaning',
    'spec.cleaned': 'Machine cleaned',

    'p0.tag': 'Best',
    'p0.name': 'Super Basmati',
    'p0.note':
      'Kept twelve months before milling. Thin, long, and does not stick. It gets ' +
      'about twice as long when cooked. This is our biryani rice.',
    'p1.tag': 'Steamed in husk',
    'p1.name': '1121 Sella Kainat',
    'p1.note':
      'Steamed and dried while still in the husk, so the grain stays whole. Golden ' +
      'colour, and it grows the most of any rice we sell. Our main export type.',
    'p2.tag': 'Steamed',
    'p2.name': '1121 Steam White',
    'p2.note':
      'The same long grain, steamed white instead of golden. Cooks loose and clean. ' +
      'What most hotels and canteens buy.',
    'p3.tag': 'Everyday',
    'p3.name': 'Irri-6 Long Grain',
    'p3.note':
      'A hard grain that soaks up plenty of water and is hard to spoil. Used where ' +
      'large amounts are cooked. Machine cleaned like everything else here.',
    'p4.tag': 'Cheapest',
    'p4.name': 'Broken Basmati (Tota)',
    'p4.note':
      'Broken pieces of basmati. Same smell, about one third of the price. Used for ' +
      'kheer, khichri and the snack trade.',

    /* ---- grade, up close ---- */
    'grade.eyebrow': '03 — Quality up close',
    'grade.title': 'See the grain yourself',
    'grade.lede':
      'Pick a type. The grain turning beside it is that rice at about forty times ' +
      'its real size, next to a sack of the same rice. The length, colour and shape ' +
      'are the real ones, not a photo.',
    'grade.len': 'Grain length',
    'grade.broken': 'Broken bits',
    'grade.age': 'Kept for',
    'grade.elong': 'Grows when cooked',
    'grade.tabs': 'Rice type',

    'g0.name': 'Super Basmati',
    'g0.cap': 'Super Basmati · 25 kg bag',
    'g0.len': '7.2 mm',
    'g0.broken': 'up to 2%',
    'g0.age': '12 months',
    'g0.elong': '2.1 times',
    'g0.note':
      'Kept twelve months before milling, so the grain hardens and stays separate ' +
      'when cooked. This is the biryani rice.',
    'g1.name': '1121 Sella',
    'g1.cap': '1121 Sella Kainat · 25 kg bag',
    'g1.len': '8.4 mm',
    'g1.broken': 'up to 1%',
    'g1.age': '18 months',
    'g1.elong': '2.4 times',
    'g1.note':
      'Steamed inside the husk before milling. That pushes the colour into the grain ' +
      'and hardens it. It grows more than any rice we sell.',
    'g2.name': '1121 Steam',
    'g2.cap': '1121 Steam White · 25 kg bag',
    'g2.len': '8.2 mm',
    'g2.broken': 'up to 2%',
    'g2.age': '12 months',
    'g2.elong': '2.2 times',
    'g2.note':
      'The same 1121 paddy, steamed white instead of golden. Cooks loose and clean, ' +
      'which is what most hotel kitchens want.',
    'g3.name': 'Irri-6',
    'g3.cap': 'Irri-6 Long Grain · 50 kg bag',
    'g3.len': '6.4 mm',
    'g3.broken': 'up to 5%',
    'g3.age': '3 months',
    'g3.elong': '1.6 times',
    'g3.note':
      'Short, hard and thirsty. It takes a lot of water and forgives a rough boil, ' +
      'which is why big kitchens run on it.',
    'g4.name': 'Broken (Tota)',
    'g4.cap': 'Broken Basmati · 50 kg bag',
    'g4.len': '2–4 mm',
    'g4.broken': '—',
    'g4.age': '—',
    'g4.elong': '—',
    'g4.note':
      'Pieces taken out by the sorting machine. Same smell as whole basmati at about ' +
      'a third of the price — kheer, khichri and snacks.',

    /* ---- story acts ---- */
    'a1.tag': 'Step 02',
    'a1.title': 'It comes out of the field wearing a shell',
    'a1.text':
      'Every grain leaves the field inside a hard, lined husk. That husk is why paddy ' +
      'can be stored for a whole season. It is the first thing we take off at the mill.',
    'a2.tag': 'Step 03',
    'a2.title': 'The shell comes off',
    'a2.text':
      'Two rubber rollers turn at different speeds and rub the husk off without breaking ' +
      'the grain inside. What comes out is rice — brown first, then white after polishing.',
    'a3.tag': 'Step 04',
    'a3.title': 'The same grain, before and after',
    'a3.text':
      'Paddy on one side, milled rice on the other. About one third of the weight is husk ' +
      'and bran. Nothing is wasted — the husk burns in our boiler and the bran goes for oil.',
    'a4.tag': 'Step 05',
    'a4.title': 'Into the bag',
    'a4.text':
      'Weighed to exactly 25 or 50 kg, sewn at the top, and stamped with the batch and the ' +
      'mill date. After that it is a truck and an address.',

    /* ---- sack viewer ---- */
    'sack.eyebrow': '04 — The bag',
    'sack.title': 'See what arrives at your shop',
    'sack.lede':
      'Coated woven bag, double-sewn top, and the batch number and mill date printed on ' +
      'every bag. Drag the bag to turn it. Switch the weight to see both sizes.',
    'sack.p1': 'Coated woven bag',
    'sack.p1t': '— keeps damp out, hard for rats to chew through.',
    'sack.p2': 'Double-sewn top',
    'sack.p2t': '— machine stitched, opens with one cut.',
    'sack.p3': 'Batch stamp',
    'sack.p3t': '— mill date, batch number and type printed on the back.',
    'sack.p4': 'On pallets',
    'sack.p4t': '— 40 bags of 25 kg or 20 bags of 50 kg, wrapped.',
    'sack.b25': '25 kg bag',
    'sack.b50': '50 kg bag',
    'sack.drag': 'Drag to turn',
    'sack.net': 'Net weight',
    'sack.dims': 'Bag size',
    'sack.pallet': 'Per pallet',

    /* ---- process ---- */
    'pr.eyebrow': '05 — How we make it',
    'pr.title': 'Paddy in, bags out',
    'pr.lede':
      'Six steps, all done in our own mill. We do not send our rice out to be milled, and ' +
      'we do not buy finished rice and just put our name on it.',
    'pr.cta': 'Come and see the mill',
    'pr.1t': 'Buying',
    'pr.1d':
      'We buy paddy at the Sheikhupura and Hafizabad mandis from dealers we have used for ' +
      'twenty years. Every lot is checked for water when it arrives.',
    'pr.2t': 'Drying',
    'pr.2d':
      'Dried slowly down to 13% water. Dry it too fast and the grain cracks when the husk ' +
      'comes off — that is where broken rice comes from.',
    'pr.3t': 'Storing',
    'pr.3d':
      'Twelve to twenty-four months in airy bins, still in the husk. The grain hardens, the ' +
      'water spreads evenly, and the smell gets stronger.',
    'pr.4t': 'Husking and polishing',
    'pr.4d':
      'We use rubber rollers instead of stone discs, because they are gentler on a long ' +
      'grain. Then two polishing runs, the second one with water.',
    'pr.5t': 'Sorting',
    'pr.5d':
      'One machine pulls out the broken pieces by length. Then a colour machine removes ' +
      'chalky, off-colour and foreign grain. It runs twice.',
    'pr.6t': 'Bagging',
    'pr.6d':
      'Weighed to exactly 25 or 50 kg, sewn, stamped and stacked. Loaded the same day you ' +
      'confirm, as long as we have stock.',

    /* ---- quality ---- */
    'q.eyebrow': '06 — Our limits',
    'q.title': 'The numbers we promise',
    'q.lede':
      'These are our limits for top grade. Every load leaves with a card showing the real ' +
      'readings for that batch, not just these limits.',
    'q.1': 'Water when packed',
    'q.2': 'Broken bits, top grade',
    'q.3': 'Damaged or off-colour',
    'q.4': 'Same type throughout',
    'q.5': 'Dust and stones',
    'q.6': 'Colour machine runs',
    'q.assure':
      'Not sure which type you need? Ask for a one kilo sample. We post it free anywhere in ' +
      'Pakistan, so you can cook it before you order a truck.',
    'q.cta': 'Ask for a sample',

    /* ---- bulk order ---- */
    'o.eyebrow': '07 — Bulk order',
    'o.title': 'Work out your load',
    'o.lede':
      'A guide price at our mill, before delivery and tax. Half a truck is 130 bags of 50 kg ' +
      'and a full truck is 260. Discounts start at 100 bags.',
    'o.grade': 'Rice type',
    'o.size': 'Bag size',
    'o.qty': 'Bags',
    'o.tonnes': 'Total weight',
    'o.discount': 'Discount',
    'o.truck': 'Truck',
    'o.total': 'Guide total',
    'o.cta': 'Send this on WhatsApp',
    'o.part': 'Part load',
    'o.half': 'Half truck',
    'o.full': 'Full truck',
    'o.none': '—',

    /* ---- buyers ---- */
    'v.eyebrow': '08 — Our buyers',
    'v.title': 'Who buys from us',
    'v.1':
      'Four years of 50 kg Sella and not once a short weight. The batch cards match what the ' +
      'lab says.',
    'v.1n': 'Hamza Traders',
    'v.1r': 'Wholesale · Lahore',
    'v.2':
      'We cook for 300 people a night. The Steam type cooks the same from every bag. That is ' +
      'all a kitchen wants.',
    'v.2n': 'Dera Restaurant Group',
    'v.2r': 'Restaurants · Islamabad',
    'v.3':
      'They sent a container of Kainat to Dubai in eleven days with clean papers. That is ' +
      'rarer than it should be.',
    'v.3n': 'Gulf Crescent FZE',
    'v.3r': 'Export · Dubai',

    /* ---- contact ---- */
    'c.eyebrow': '09 — Contact',
    'c.title': "Ask for today's price",
    'c.lede':
      'Tell us the type, the bag size and roughly how many. We will give you a firm price, a ' +
      'delivery date, and the freight to your city.',
    'c.mill': 'Mill and office',
    'c.phone': 'Phone and WhatsApp',
    'c.email': 'Email',
    'c.hours': 'Open hours',
    'c.hoursv': 'Monday to Saturday, 8:00 am – 6:00 pm',
    'c.wa': 'Message us on WhatsApp',
    'f.name': 'Your name',
    'f.firm': 'Shop or company',
    'f.phone': 'Phone number',
    'f.phoneph': '+92 3xx xxxxxxx',
    'f.city': 'Your city',
    'f.grade': 'Rice type',
    'f.unsure': 'Not sure — please advise',
    'f.qty': 'How many bags',
    'f.qtyph': '40',
    'f.msg': 'Anything else',
    'f.msgph': 'Delivery city, packing, when you need it…',
    'f.send': 'Send message',
    'f.errname': 'Please write your name so we know who to call back.',
    'f.errphone': 'That phone number looks short — please check it.',
    'f.ok': 'Thank you {name} — we will call you back with today’s price.',

    /* ---- footer ---- */
    'ft.blurb': 'Paddy bought in Punjab, stored a season, milled and bagged at our own mill.',
    'ft.site': 'Pages',
    'ft.mill': 'Mill',
    'ft.rights': 'Sunehri Rice Mills. All rights reserved.',
    'ft.note': 'Prices change with the mandi.',
    'wa.float': 'Order on WhatsApp',
    'wa.card':
      'Assalam o alaikum. Please send me today’s price for {name}, {kg} kg bag.',
    'wa.buyer':
      'Assalam o alaikum. I am buying as: {who}, {size}. Please send me your rates.',
    'wa.calc':
      'Assalam o alaikum. Please quote: {name}, {kg} kg bags × {qty}. ' +
      'Total weight about {tonnes}. Guide price {total}.',

    /* ---- the dish pages ---- */
    'nav.dishes': 'What to cook',
    'card.cook': 'What it cooks best',
    'dp.eyebrow': 'What it cooks best',
    'dp.back': 'All five rices',
    'dp.why': 'Why this rice',
    'dp.how': 'How it is made',
    'dp.grow': 'Cooked length',
    'dp.growv': 'grows {x} times',
    'dp.scroll': 'Scroll to watch it cook',
    'dp.other': 'The other four',
    'dp.otherlede': 'Every rice we mill has a job it is better at than the rest.',
    'dp.cta': 'Order this rice on WhatsApp',
    'dp.price': 'See the price',
    'dp.step': 'Step',
    'wa.dish':
      'Assalam o alaikum. I want {rice} for {dish}. Please send me today\u2019s price.',

    'd0.dish': 'Biryani',
    'd0.tag': 'The rice biryani is actually made with',
    'd0.why':
      'Biryani asks a lot of a grain. It has to sit under a heavy layer of masala, ' +
      'take the steam, and still come out separate when you fold it. Super Basmati ' +
      'is rested twelve months before milling so it cooks firm instead of breaking, ' +
      'and it grows to about 2.1 times its length \u2014 which is why a good biryani ' +
      'looks long and loose rather than packed down.',
    'd0.s1t': 'Wash the rice',
    'd0.s1d': 'Rinse it in a colander until the water runs clear, then leave it to soak about thirty minutes. Longer than that and the grain goes soft before it ever sees heat.',
    'd0.s2t': 'Boil the rice',
    'd0.s2d': 'Into a degchi of salted water over a high flame. Lift it out at about seventy percent done \u2014 it finishes later in the steam, so taking it early is the point.',
    'd0.s3t': 'Simmer the chicken salan',
    'd0.s3d': 'Onion browned in oil, then tomato, yoghurt, green chilli and whole spice, then the chicken. It is ready when the oil comes back up to the top.',
    'd0.s4t': 'Layer it',
    'd0.s4d': 'The salan in the bottom of the degchi, the boiled rice over it, then the saffron colour, the fried onion and the coriander. It is layered, not stirred.',
    'd0.s5t': 'Seal it for the dum',
    'd0.s5d': 'A rope of dough round the rim, the lid pressed down on it, the lowest flame underneath. The steam cannot get out, so it goes up through the rice instead.',
    'd0.s6t': 'Serve it',
    'd0.s6d': 'Onto the plate, chicken side up, lifting from the bottom so the grain does not break.',

    'd1.dish': 'Pulao and kabuli chawal',
    'd1.tag': 'For rice that has to hold its shape in stock',
    'd1.why':
      'Sella is steamed inside the husk before it is milled, which hardens the grain ' +
      'right through. It will sit in stock, take a fry, and still come out as separate ' +
      'grains. It grows about 2.4 times, the longest of anything we sell, so a plate ' +
      'of pulao looks generous.',
    'd1.s1t': 'Rinse',
    'd1.s1d': 'A short rinse only. Sella does not want a long soak \u2014 the parboiling has already done half that work.',
    'd1.s2t': 'Fry it in the yakhni',
    'd1.s2d': 'Whole spice into hot oil, then the rice, turned over until every grain is coated.',
    'd1.s3t': 'Add the stock and boil',
    'd1.s3d': 'Measured stock, hard boil, uncovered, until the liquid is down level with the rice.',
    'd1.s4t': 'Simmer covered',
    'd1.s4d': 'Lowest flame, lid on, and leave it alone. Stirring is what breaks a pulao.',
    'd1.s5t': 'Rest it',
    'd1.s5d': 'Off the heat, still covered, ten minutes. The last of the stock finishes going into the grain.',
    'd1.s6t': 'Serve with kebab',
    'd1.s6d': 'Onto a plate with the chicken, and a shami kebab or two beside it.',

    'd2.dish': 'Everyday boiled rice',
    'd2.tag': 'The one that cooks the same from every bag',
    'd2.why':
      'This is what a kitchen runs on when the same plate has to leave the pass a ' +
      'hundred times a night. Steamed white rather than parboiled, so it cooks loose ' +
      'and clean with no colour and no surprises. What you measured last week still ' +
      'works this week.',
    'd2.s1t': 'Rinse',
    'd2.s1d': 'Two or three changes of water in a steel bowl, until it stops going cloudy.',
    'd2.s2t': 'Boil',
    'd2.s2d': 'Plenty of salted water, a hard boil, no lid on it.',
    'd2.s3t': 'Test a grain',
    'd2.s3d': 'At about eight minutes. Press one between your fingers \u2014 it should give, with no chalk left in the middle.',
    'd2.s4t': 'Drain',
    'd2.s4d': 'The moment it is done. Rice left standing in hot water carries on cooking.',
    'd2.s5t': 'Fluff',
    'd2.s5d': 'A fork, not a spoon, and only once. Then the lid back on for five minutes.',
    'd2.s6t': 'Serve',
    'd2.s6d': 'Into a bowl, still steaming.',

    'd3.dish': 'Deg cooking',
    'd3.tag': 'When you are cooking for three hundred',
    'd3.why':
      'A hard grain that drinks a lot of water and forgives a rough boil, which is ' +
      'exactly what you want in a deg the size of a table. It costs about half what ' +
      'basmati costs per plate, and at that scale that is the whole argument.',
    'd3.s1t': 'Wash it in the deg',
    'd3.s1d': 'Wash it where you are going to cook it. Moving soaked rice around in that quantity is how it breaks.',
    'd3.s2t': 'Measure the water',
    'd3.s2d': 'By measure, not by eye. At this size a small error is twenty kilos of wrong.',
    'd3.s3t': 'Boil hard',
    'd3.s3d': 'A hard rolling boil on a full flame, then the flame right down and the lid on.',
    'd3.s4t': 'Make the salan',
    'd3.s4d': 'In a karahi alongside, so the deg is not standing there waiting for it.',
    'd3.s5t': 'Fold them together',
    'd3.s5d': 'Gently, from the bottom, two or three turns and no more. Any more than that and you are making a paste.',
    'd3.s6t': 'Serve from the deg',
    'd3.s6d': 'It holds heat for hours, which is half the reason it gets used for functions.',

    'd4.dish': 'Kheer and khichri',
    'd4.tag': 'Short pieces that thicken a pot',
    'd4.why':
      'Broken basmati is not a lesser rice, it is a different job. The pieces come ' +
      'off the sorting machine short, so they let go of their starch quickly and ' +
      'thicken milk without you adding anything. The same aroma as the whole grain, ' +
      'at about a third of the price.',
    'd4.s1t': 'Rinse briefly',
    'd4.s1d': 'Rinse once, quickly. You want to keep some of that starch \u2014 it is what does the thickening.',
    'd4.s2t': 'Bring the milk up',
    'd4.s2d': 'Full-fat milk in a heavy pot, brought to the boil and then held just under it.',
    'd4.s3t': 'Add the rice',
    'd4.s3d': 'The broken grain goes in, and from here it needs watching, because it catches on the bottom in a moment.',
    'd4.s4t': 'Simmer it down',
    'd4.s4d': 'Low flame, moved often, until it coats the back of a spoon.',
    'd4.s5t': 'Sweeten it late',
    'd4.s5d': 'Sugar goes in near the end. Add it early and the rice stops softening.',
    'd4.s6t': 'Garnish and cool',
    'd4.s6d': 'Cardamom, pistachio, almond. It thickens again as it cools, so stop just before you think it is right.',

  },

  ur: {
    /* ---- header ---- */
    'nav.range': 'ہمارے چاول',
    'nav.grade': 'دانہ',
    'nav.sack': 'بوری',
    'nav.process': 'تیاری کا طریقہ',
    'nav.quality': 'کوالٹی',
    'nav.order': 'بڑا آرڈر',
    'nav.cta': 'آج کا ریٹ',
    'nav.contact': 'رابطہ',
    'nav.menu': 'مینو',
    'skip': 'مواد پر جائیں',
    'brand.name': 'سنہری',
    'brand.sub': 'رائس ملز',
    'lang.switch': 'English',
    'lang.label': 'انگریزی میں دیکھیں',

    /* ---- hero ---- */
    'hero.eyebrow': 'شیخوپورہ، پنجاب · 1974 سے چاول بنا رہے ہیں',
    'hero.title': 'پرانا باسمتی،<br><span class="hero__title-accent">ہماری اپنی مل سے۔</span>',
    'hero.lede':
      'ہم منڈی سے دھان خریدتے ہیں، اسے پورا ایک سیزن رکھتے ہیں، پھر اپنی مل میں ' +
      'چھلکا اتار کر، پالش اور صفائی کرتے ہیں۔ چاول 25 کلو اور 50 کلو کی بوریوں میں ' +
      'جاتا ہے — سلائی شدہ، بیچ نمبر لگا ہوا، اور اسی ہفتے ٹرک پر۔',
    'hero.cta1': 'ہمارے چاول دیکھیں',
    'hero.cta2': 'قیمت لگائیں',
    'hero.stat1': 'ہر ماہ بھیجی جانے والی بوریاں',
    'hero.stat1u': 'بوریاں',
    'hero.stat2': 'کم از کم رکھا جاتا ہے',
    'hero.stat2u': 'مہینے',
    'hero.stat3': 'ہم بیچتے ہیں',
    'hero.stat3u': 'ممالک میں',
    'hero.stage': 'مرحلہ 01 — کھیت میں فصل',
    'hero.scroll': 'نیچے ہمارے چاول دیکھیں',

    /* ---- marquee ---- */
    'mq.1': 'سپر باسمتی',
    'mq.2': '1121 سیلہ',
    'mq.3': '1121 سٹیم',
    'mq.4': 'اری-6 لمبا دانہ',
    'mq.5': 'ٹوٹا باسمتی',
    'mq.6': 'مشین سے صاف',
    'mq.7': 'پورے پاکستان میں ڈلیوری',

    /* ---- who we sell to ---- */
    'b.eyebrow': '01 — ہم کس کو بیچتے ہیں',
    'b.title': 'ایک بوری ہو یا پورا ٹرک',
    'b.lede':
      'ہم ہول سیل مل ہیں، لیکن کم از کم آرڈر کی کوئی شرط نہیں۔ ایک گھر کو ' +
      'جانے والی اکیلی بوری کا چاول اسی ڈھیر سے نکلتا ہے جس سے تاجر کا چھبیس ٹن — ' +
      'وہی بیچ، وہی کارڈ، وہی مل۔',
    'b.vol': 'آرڈر کا سائز',
    'b.1t': 'تاجر اور ہول سیل',
    'b.1m': '100 بوریاں سے پورا ٹرک',
    'b.1d':
      'مل کا ریٹ، شیخوپورہ سے خود اٹھائیں یا ہم پہنچا دیں۔ آرڈر پکا ہونے ' +
      'والے دن ہی لوڈنگ، اگر مال موجود ہو۔ چند بار کام کرنے کے بعد ' +
      'ادھار کی بات بھی ہو سکتی ہے۔',
    'b.1c': 'ٹرک کا ریٹ پوچھیں',
    'b.2t': 'دکاندار، ہوٹل اور کیٹرر',
    'b.2m': '10 سے 100 بوریاں',
    'b.2d':
      'ہر مہینے کا پکا آرڈر، ہر بار وہی قسم، تاکہ آپ کی دیگ ایک بوری ' +
      'سے دوسری بوری تک نہ بدلے۔ آپ کے شہر تک ڈلیوری۔',
    'b.2c': 'دکان کا ریٹ پوچھیں',
    'b.3t': 'گھر کے لیے',
    'b.3m': '1 یا 2 بوریاں',
    'b.3d':
      'جی ہاں، ہم اکیلی بوری بھی بیچتے ہیں۔ وہی چاول، وہی مل، اور وہی ' +
      'بیچ کارڈ جو تاجر کو ملتا ہے۔ پنجاب میں آپ کے گھر تک، باقی ' +
      'پاکستان میں کورئیر سے۔',
    'b.3c': 'ایک بوری آرڈر کریں',

    /* ---- range ---- */
    'range.eyebrow': '02 — ہمارے چاول',
    'range.title': 'پانچ اقسام، دو بوری سائز',
    'range.lede':
      'یہ شیخوپورہ میں ہماری مل کے ریٹ ہیں۔ ان میں ڈلیوری شامل نہیں۔ ریٹ منڈی کے ' +
      'ساتھ بدلتے رہتے ہیں، اس لیے آج کے ریٹ کے لیے فون یا واٹس ایپ کریں۔',
    'range.size': 'بوری کا سائز',
    'range.25': '25 کلو',
    'range.50': '50 کلو',
    'card.hint': 'یہ دانہ قریب سے دیکھیں',
    'card.order': 'آرڈر',
    'card.wa': 'واٹس ایپ',
    'card.per': 'کلو بوری',
    'spec.broken': 'ٹوٹے دانے',
    'spec.moisture': 'نمی',
    'spec.aged': 'رکھا گیا',
    'spec.clean': 'صفائی',
    'spec.cleaned': 'مشین سے صاف',

    'p0.tag': 'بہترین',
    'p0.name': 'سپر باسمتی',
    'p0.note':
      'پیسنے سے پہلے بارہ مہینے رکھا جاتا ہے۔ باریک، لمبا اور آپس میں نہیں چپکتا۔ ' +
      'پکنے پر تقریباً دوگنا لمبا ہو جاتا ہے۔ یہ ہمارا بریانی والا چاول ہے۔',
    'p1.tag': 'چھلکے سمیت سٹیم',
    'p1.name': '1121 سیلہ کائنات',
    'p1.note':
      'چھلکے کے اندر ہی سٹیم اور خشک کیا جاتا ہے، اس لیے دانہ ثابت رہتا ہے۔ سنہری ' +
      'رنگ، اور پکنے پر سب سے زیادہ لمبا ہوتا ہے۔ ہمارا بڑا ایکسپورٹ مال۔',
    'p2.tag': 'سٹیم',
    'p2.name': '1121 سٹیم وائٹ',
    'p2.note':
      'وہی لمبا دانہ، سنہری کی بجائے سفید سٹیم کیا ہوا۔ کھلا کھلا اور صاف پکتا ہے۔ ' +
      'زیادہ تر ہوٹل اور کینٹین یہی لیتے ہیں۔',
    'p3.tag': 'روزمرہ',
    'p3.name': 'اری-6 لمبا دانہ',
    'p3.note':
      'سخت دانہ جو کافی پانی پیتا ہے اور جلدی خراب نہیں ہوتا۔ جہاں زیادہ مقدار میں ' +
      'پکانا ہو وہاں استعمال ہوتا ہے۔ باقی سب کی طرح مشین سے صاف۔',
    'p4.tag': 'سب سے سستا',
    'p4.name': 'ٹوٹا باسمتی',
    'p4.note':
      'باسمتی کے ٹوٹے ہوئے دانے۔ خوشبو وہی، قیمت تقریباً ایک تہائی۔ کھیر، کھچڑی اور ' +
      'سنیکس میں استعمال ہوتا ہے۔',

    /* ---- grade, up close ---- */
    'grade.eyebrow': '03 — کوالٹی، قریب سے',
    'grade.title': 'دانہ خود دیکھ لیں',
    'grade.lede':
      'کوئی قسم چنیں۔ ساتھ گھومتا ہوا دانہ اسی چاول کا ہے، اصل سے تقریباً چالیس گنا ' +
      'بڑا، اور ساتھ اسی چاول کی بوری۔ لمبائی، رنگ اور شکل اصلی ہیں، تصویر نہیں۔',
    'grade.len': 'دانے کی لمبائی',
    'grade.broken': 'ٹوٹے دانے',
    'grade.age': 'رکھا گیا',
    'grade.elong': 'پکنے پر بڑھتا ہے',
    'grade.tabs': 'چاول کی قسم',

    'g0.name': 'سپر باسمتی',
    'g0.cap': 'سپر باسمتی · 25 کلو بوری',
    'g0.len': '7.2 ملی میٹر',
    'g0.broken': '2% تک',
    'g0.age': '12 مہینے',
    'g0.elong': '2.1 گنا',
    'g0.note':
      'پیسنے سے پہلے بارہ مہینے رکھا جاتا ہے، جس سے دانہ سخت ہو جاتا ہے اور پکنے پر ' +
      'کھلا رہتا ہے۔ یہی بریانی والا چاول ہے۔',
    'g1.name': '1121 سیلہ',
    'g1.cap': '1121 سیلہ کائنات · 25 کلو بوری',
    'g1.len': '8.4 ملی میٹر',
    'g1.broken': '1% تک',
    'g1.age': '18 مہینے',
    'g1.elong': '2.4 گنا',
    'g1.note':
      'پیسنے سے پہلے چھلکے کے اندر ہی سٹیم کیا جاتا ہے۔ اس سے رنگ دانے کے اندر بیٹھ ' +
      'جاتا ہے اور دانہ سخت ہو جاتا ہے۔ ہمارے سب چاولوں سے زیادہ بڑھتا ہے۔',
    'g2.name': '1121 سٹیم',
    'g2.cap': '1121 سٹیم وائٹ · 25 کلو بوری',
    'g2.len': '8.2 ملی میٹر',
    'g2.broken': '2% تک',
    'g2.age': '12 مہینے',
    'g2.elong': '2.2 گنا',
    'g2.note':
      'وہی 1121 دھان، سنہری کی بجائے سفید سٹیم کیا ہوا۔ کھلا اور صاف پکتا ہے، جو ہوٹل ' +
      'کے باورچی خانوں کو چاہیے ہوتا ہے۔',
    'g3.name': 'اری-6',
    'g3.cap': 'اری-6 لمبا دانہ · 50 کلو بوری',
    'g3.len': '6.4 ملی میٹر',
    'g3.broken': '5% تک',
    'g3.age': '3 مہینے',
    'g3.elong': '1.6 گنا',
    'g3.note':
      'چھوٹا، سخت اور زیادہ پانی پینے والا دانہ۔ تیز پکانے پر بھی خراب نہیں ہوتا، اسی ' +
      'لیے بڑے باورچی خانے یہی چلاتے ہیں۔',
    'g4.name': 'ٹوٹا',
    'g4.cap': 'ٹوٹا باسمتی · 50 کلو بوری',
    'g4.len': '2–4 ملی میٹر',
    'g4.broken': '—',
    'g4.age': '—',
    'g4.elong': '—',
    'g4.note':
      'چھانٹنے والی مشین سے نکلے ہوئے ٹکڑے۔ خوشبو ثابت باسمتی جیسی، قیمت تقریباً ایک ' +
      'تہائی — کھیر، کھچڑی اور سنیکس کے لیے۔',

    /* ---- story acts ---- */
    'a1.tag': 'مرحلہ 02',
    'a1.title': 'کھیت سے دانہ چھلکے کے اندر آتا ہے',
    'a1.text':
      'ہر دانہ کھیت سے ایک سخت، دھاری دار چھلکے کے اندر نکلتا ہے۔ اسی چھلکے کی وجہ سے ' +
      'دھان پورا سیزن سنبھالا جا سکتا ہے۔ مل میں سب سے پہلے یہی اتارا جاتا ہے۔',
    'a2.tag': 'مرحلہ 03',
    'a2.title': 'چھلکا الگ ہو جاتا ہے',
    'a2.text':
      'دو ربڑ کے رولر مختلف رفتار سے گھومتے ہیں اور اندر کا دانہ توڑے بغیر چھلکا رگڑ ' +
      'کر اتار دیتے ہیں۔ جو نکلتا ہے وہ چاول ہے — پہلے براؤن، پالش کے بعد سفید۔',
    'a3.tag': 'مرحلہ 04',
    'a3.title': 'ایک ہی دانہ، پہلے اور بعد میں',
    'a3.text':
      'ایک طرف دھان، دوسری طرف صاف چاول۔ تقریباً ایک تہائی وزن چھلکا اور چوکر ہوتا ہے۔ ' +
      'کچھ ضائع نہیں ہوتا — چھلکا بوائلر میں جلتا ہے اور چوکر تیل کے لیے جاتا ہے۔',
    'a4.tag': 'مرحلہ 05',
    'a4.title': 'بوری میں',
    'a4.text':
      'پورے 25 یا 50 کلو تولا جاتا ہے، اوپر سے سلائی، اور بیچ نمبر و مل کی تاریخ کی ' +
      'مہر۔ اس کے بعد بس ٹرک اور آپ کا پتہ۔',

    /* ---- sack viewer ---- */
    'sack.eyebrow': '04 — بوری',
    'sack.title': 'دیکھیں آپ کی دکان پر کیا پہنچے گا',
    'sack.lede':
      'لیمینیٹ شدہ بنی ہوئی بوری، اوپر سے ڈبل سلائی، اور ہر بوری پر بیچ نمبر اور مل کی ' +
      'تاریخ چھپی ہوئی۔ بوری کو گھما کر دیکھیں۔ وزن بدل کر دونوں سائز دیکھیں۔',
    'sack.p1': 'لیمینیٹ بنی بوری',
    'sack.p1t': '— نمی اندر نہیں آتی، چوہے آسانی سے نہیں کاٹ سکتے۔',
    'sack.p2': 'اوپر ڈبل سلائی',
    'sack.p2t': '— مشین کی سلائی، ایک کٹ سے کھل جاتی ہے۔',
    'sack.p3': 'بیچ کی مہر',
    'sack.p3t': '— مل کی تاریخ، بیچ نمبر اور قسم پیچھے چھپی ہوتی ہے۔',
    'sack.p4': 'پیلٹ پر',
    'sack.p4t': '— 25 کلو کی 40 بوریاں یا 50 کلو کی 20 بوریاں، ریپ شدہ۔',
    'sack.b25': '25 کلو بوری',
    'sack.b50': '50 کلو بوری',
    'sack.drag': 'گھمانے کے لیے کھینچیں',
    'sack.net': 'خالص وزن',
    'sack.dims': 'بوری کا سائز',
    'sack.pallet': 'فی پیلٹ',

    /* ---- process ---- */
    'pr.eyebrow': '05 — تیاری کا طریقہ',
    'pr.title': 'دھان اندر، بوریاں باہر',
    'pr.lede':
      'چھ مرحلے، سب ہماری اپنی مل میں۔ ہم اپنا چاول باہر پسوانے نہیں بھیجتے، اور نہ ہی ' +
      'تیار چاول خرید کر اپنے نام سے بوری میں ڈالتے ہیں۔',
    'pr.cta': 'مل دیکھنے آئیں',
    'pr.1t': 'خریداری',
    'pr.1d':
      'ہم شیخوپورہ اور حافظ آباد کی منڈیوں سے دھان خریدتے ہیں، انہی آڑھتیوں سے جن کے ' +
      'ساتھ بیس سال کا کام ہے۔ ہر لاٹ آتے ہی نمی کے لیے چیک ہوتی ہے۔',
    'pr.2t': 'خشک کرنا',
    'pr.2d':
      'آہستہ آہستہ 13% نمی تک خشک کیا جاتا ہے۔ جلدی خشک کریں تو چھلکا اتارتے وقت دانہ ' +
      'ٹوٹ جاتا ہے — ٹوٹا چاول یہیں سے بنتا ہے۔',
    'pr.3t': 'رکھنا',
    'pr.3d':
      'بارہ سے چوبیس مہینے ہوادار بِنوں میں، چھلکے سمیت۔ دانہ سخت ہوتا ہے، نمی برابر ' +
      'ہو جاتی ہے، اور خوشبو تیز ہو جاتی ہے۔',
    'pr.4t': 'چھلکا اور پالش',
    'pr.4d':
      'ہم پتھر کی چکی کی بجائے ربڑ کے رولر استعمال کرتے ہیں، کیونکہ وہ لمبے دانے پر ' +
      'نرم رہتے ہیں۔ پھر دو بار پالش، دوسری بار پانی کے ساتھ۔',
    'pr.5t': 'چھانٹی',
    'pr.5d':
      'ایک مشین لمبائی کے حساب سے ٹوٹے دانے الگ کرتی ہے۔ پھر رنگ والی مشین سفیدی مائل، ' +
      'بدرنگ اور باہر کا دانہ نکال دیتی ہے۔ یہ دو بار چلتی ہے۔',
    'pr.6t': 'بوری بھرنا',
    'pr.6d':
      'پورے 25 یا 50 کلو تولا جاتا ہے، سلائی، مہر اور سٹیک۔ آرڈر پکا ہونے والے دن ہی ' +
      'لوڈنگ، بشرطیکہ مال موجود ہو۔',

    /* ---- quality ---- */
    'q.eyebrow': '06 — ہماری حدیں',
    'q.title': 'وہ نمبر جن کا ہم وعدہ کرتے ہیں',
    'q.lede':
      'یہ ٹاپ گریڈ کی حدیں ہیں۔ ہر لوڈ کے ساتھ ایک کارڈ جاتا ہے جس پر اس بیچ کی اصل ' +
      'ریڈنگ لکھی ہوتی ہے، صرف یہ حدیں نہیں۔',
    'q.1': 'بوری بھرتے وقت نمی',
    'q.2': 'ٹوٹے دانے، ٹاپ گریڈ',
    'q.3': 'خراب یا بدرنگ',
    'q.4': 'ایک ہی قسم',
    'q.5': 'مٹی اور کنکر',
    'q.6': 'رنگ والی مشین کے چکر',
    'q.assure':
      'سمجھ نہیں آ رہا کون سی قسم چاہیے؟ ایک کلو کا نمونہ منگوا لیں۔ ہم پورے پاکستان ' +
      'میں مفت بھیجتے ہیں، تاکہ آپ ٹرک منگوانے سے پہلے پکا کر دیکھ لیں۔',
    'q.cta': 'نمونہ منگوائیں',

    /* ---- bulk order ---- */
    'o.eyebrow': '07 — بڑا آرڈر',
    'o.title': 'اپنا لوڈ نکالیں',
    'o.lede':
      'یہ ہماری مل پر اندازاً قیمت ہے، ڈلیوری اور ٹیکس سے پہلے۔ آدھا ٹرک 50 کلو کی 130 ' +
      'بوریاں اور پورا ٹرک 260 بوریاں ہے۔ رعایت 100 بوریوں سے شروع ہوتی ہے۔',
    'o.grade': 'چاول کی قسم',
    'o.size': 'بوری کا سائز',
    'o.qty': 'بوریاں',
    'o.tonnes': 'کل وزن',
    'o.discount': 'رعایت',
    'o.truck': 'ٹرک',
    'o.total': 'اندازاً کل',
    'o.cta': 'یہ واٹس ایپ پر بھیجیں',
    'o.part': 'تھوڑا لوڈ',
    'o.half': 'آدھا ٹرک',
    'o.full': 'پورا ٹرک',
    'o.none': '—',

    /* ---- buyers ---- */
    'v.eyebrow': '08 — ہمارے خریدار',
    'v.title': 'کون ہم سے خریدتا ہے',
    'v.1':
      'چار سال سے 50 کلو سیلہ لے رہے ہیں اور ایک بار بھی وزن کم نہیں نکلا۔ بیچ کارڈ پر ' +
      'وہی لکھا ہوتا ہے جو لیب کہتی ہے۔',
    'v.1n': 'حمزہ ٹریڈرز',
    'v.1r': 'ہول سیل · لاہور',
    'v.2':
      'ہم رات کو 300 بندوں کا کھانا بناتے ہیں۔ سٹیم والا چاول ہر بوری سے ایک جیسا پکتا ' +
      'ہے۔ باورچی خانے کو اس کے علاوہ کچھ نہیں چاہیے۔',
    'v.2n': 'ڈیرہ ریسٹورنٹ گروپ',
    'v.2r': 'ریسٹورنٹ · اسلام آباد',
    'v.3':
      'انہوں نے کائنات کا کنٹینر گیارہ دن میں دبئی بھیجا، کاغذات بالکل صاف۔ یہ آج کل ' +
      'کم ہی ہوتا ہے۔',
    'v.3n': 'گلف کریسنٹ FZE',
    'v.3r': 'ایکسپورٹ · دبئی',

    /* ---- contact ---- */
    'c.eyebrow': '09 — رابطہ',
    'c.title': 'آج کا ریٹ پوچھیں',
    'c.lede':
      'ہمیں قسم، بوری کا سائز اور اندازاً تعداد بتا دیں۔ ہم آپ کو پکا ریٹ، ڈلیوری کی ' +
      'تاریخ اور آپ کے شہر تک کرایہ بتا دیں گے۔',
    'c.mill': 'مل اور دفتر',
    'c.phone': 'فون اور واٹس ایپ',
    'c.email': 'ای میل',
    'c.hours': 'کھلنے کا وقت',
    'c.hoursv': 'پیر تا ہفتہ، صبح 8:00 – شام 6:00',
    'c.wa': 'واٹس ایپ پر پیغام بھیجیں',
    'f.name': 'آپ کا نام',
    'f.firm': 'دکان یا کمپنی',
    'f.phone': 'فون نمبر',
    'f.phoneph': '+92 3xx xxxxxxx',
    'f.city': 'آپ کا شہر',
    'f.grade': 'چاول کی قسم',
    'f.unsure': 'پتہ نہیں — آپ بتائیں',
    'f.qty': 'کتنی بوریاں',
    'f.qtyph': '40',
    'f.msg': 'اور کچھ کہنا ہے؟',
    'f.msgph': 'ڈلیوری کا شہر، پیکنگ، کب چاہیے…',
    'f.send': 'پیغام بھیجیں',
    'f.errname': 'براہ کرم اپنا نام لکھیں تاکہ ہمیں پتہ ہو کس کو کال کرنی ہے۔',
    'f.errphone': 'یہ فون نمبر چھوٹا لگ رہا ہے — دوبارہ دیکھ لیں۔',
    'f.ok': 'شکریہ {name} — ہم آپ کو آج کے ریٹ کے ساتھ کال کریں گے۔',

    /* ---- footer ---- */
    'ft.blurb': 'دھان پنجاب سے خریدا، ایک سیزن رکھا، اور اپنی مل میں پیس کر بوری میں بھرا۔',
    'ft.site': 'صفحات',
    'ft.mill': 'مل',
    'ft.rights': 'سنہری رائس ملز۔ جملہ حقوق محفوظ ہیں۔',
    'ft.note': 'ریٹ منڈی کے ساتھ بدلتے رہتے ہیں۔',
    'wa.float': 'واٹس ایپ پر آرڈر',
    'wa.card':
      'السلام علیکم۔ مجھے {name}، {kg} کلو بوری کا آج کا ریٹ بھیج دیں۔',
    'wa.buyer':
      'السلام علیکم۔ میں {who}، {size} کے طور پر لینا چاہتا ہوں۔ براہ کرم ریٹ بھیج دیں۔',
    'wa.calc':
      'السلام علیکم۔ ریٹ بتا دیں: {name}، {kg} کلو کی {qty} بوریاں۔ ' +
      'کل وزن تقریباً {tonnes}۔ اندازاً قیمت {total}۔',

    /* ---- the dish pages ---- */
    'nav.dishes': 'کیا پکائیں',
    'card.cook': 'یہ کس کھانے کے لیے بہترین ہے',
    'dp.eyebrow': 'یہ کس کھانے کے لیے بہترین ہے',
    'dp.back': 'پانچوں چاول',
    'dp.why': 'یہی چاول کیوں',
    'dp.how': 'کیسے بنتا ہے',
    'dp.grow': 'پکنے کے بعد لمبائی',
    'dp.growv': '{x} گنا بڑھتا ہے',
    'dp.scroll': 'پکتے ہوئے دیکھنے کے لیے سکرول کریں',
    'dp.other': 'باقی چار',
    'dp.otherlede': 'ہمارے ہر چاول کا ایک کام ہے جس میں وہ باقی سب سے بہتر ہے۔',
    'dp.cta': 'یہ چاول واٹس ایپ پر آرڈر کریں',
    'dp.price': 'قیمت دیکھیں',
    'dp.step': 'مرحلہ',
    'wa.dish':
      'السلام علیکم۔ مجھے {dish} کے لیے {rice} چاہیے۔ براہ کرم آج کا ریٹ بھیج دیں۔',

    'd0.dish': 'بریانی',
    'd0.tag': 'بریانی اصل میں اسی چاول سے بنتی ہے',
    'd0.why':
      'بریانی دانے سے بہت کچھ مانگتی ہے۔ اسے مصالحے کی بھاری تہہ کے نیچے بیٹھنا ہے، ' +
      'بھاپ سہنی ہے، اور پھر بھی ہلاتے وقت کھلا رہنا ہے۔ سپر باسمتی کو پیسنے سے پہلے ' +
      'بارہ مہینے رکھا جاتا ہے، اس لیے یہ ٹوٹنے کی بجائے سخت پکتا ہے، اور تقریباً 2.1 ' +
      'گنا لمبا ہو جاتا ہے — اسی لیے اچھی بریانی دبی ہوئی نہیں، لمبی اور کھلی لگتی ہے۔',
    'd0.s1t': 'چاول دھوئیں',
    'd0.s1d': 'چھلنی میں اتنا دھوئیں کہ پانی صاف آنے لگے، پھر تقریباً تیس منٹ بھگو دیں۔ اس سے زیادہ رکھیں تو دانہ آگ دیکھنے سے پہلے ہی نرم ہو جاتا ہے۔',
    'd0.s2t': 'چاول ابالیں',
    'd0.s2d': 'تیز آنچ پر دیگچی میں نمکین پانی ڈال کر ابالیں۔ تقریباً ستر فیصد پر اتار لیں \u2014 باقی پکائی بعد میں بھاپ سے ہوتی ہے، اسی لیے جلدی اتارنا ہی اصل بات ہے۔',
    'd0.s3t': 'چکن کا سالن پکائیں',
    'd0.s3d': 'تیل میں پیاز براؤن کریں، پھر ٹماٹر، دہی، ہری مرچ اور ثابت گرم مصالحہ، پھر چکن۔ جب تیل اوپر آ جائے تو سالن تیار ہے۔',
    'd0.s4t': 'تہہ لگائیں',
    'd0.s4d': 'سالن دیگچی کی تہہ میں، اوپر ابلا ہوا چاول، پھر زعفرانی رنگ، تلی ہوئی پیاز اور ہرا دھنیا۔ یہ تہہ در تہہ لگتا ہے، ہلایا نہیں جاتا۔',
    'd0.s5t': 'دم پر رکھیں',
    'd0.s5d': 'کناروں پر آٹے کی پٹی لگا کر ڈھکن جما دیں اور نیچے سب سے ہلکی آنچ۔ بھاپ باہر نہیں نکل سکتی، اس لیے چاول میں سے ہوتی ہوئی اوپر جاتی ہے۔',
    'd0.s6t': 'پیش کریں',
    'd0.s6d': 'پلیٹ میں، چکن اوپر کی طرف، اور نیچے سے اٹھا کر نکالیں تاکہ دانہ ٹوٹے نہیں۔',

    'd1.dish': 'پلاؤ اور کابلی چاول',
    'd1.tag': 'جب چاول کو یخنی میں بھی ثابت رہنا ہو',
    'd1.why':
      'سیلہ کو پیسنے سے پہلے چھلکے کے اندر ہی سٹیم کیا جاتا ہے، جس سے دانہ اندر تک ' +
      'سخت ہو جاتا ہے۔ یہ یخنی میں بیٹھ سکتا ہے، بھُن سکتا ہے، اور پھر بھی کھلا کھلا ' +
      'نکلتا ہے۔ یہ تقریباً 2.4 گنا بڑھتا ہے، ہمارے سب چاولوں سے زیادہ، اس لیے پلاؤ ' +
      'کی پلیٹ بھری بھری لگتی ہے۔',
    'd1.s1t': 'ہلکا دھوئیں',
    'd1.s1d': 'بس ایک ہلکی دھلائی۔ سیلہ کو لمبے بھگونے کی ضرورت نہیں \u2014 سٹیم پہلے ہی آدھا کام کر چکی ہے۔',
    'd1.s2t': 'یخنی میں بھونیں',
    'd1.s2d': 'گرم تیل میں ثابت مصالحہ، پھر چاول، اور اتنا چلائیں کہ ہر دانے پر چڑھ جائے۔',
    'd1.s3t': 'یخنی ڈال کر ابالیں',
    'd1.s3d': 'ناپی ہوئی یخنی، تیز ابال، بغیر ڈھکن، جب تک پانی چاول کے برابر نہ آ جائے۔',
    'd1.s4t': 'ڈھک کر دم پر',
    'd1.s4d': 'سب سے ہلکی آنچ، ڈھکن بند، اور چھیڑیں نہیں۔ ہلانا ہی پلاؤ کو توڑتا ہے۔',
    'd1.s5t': 'تھوڑی دیر رکھیں',
    'd1.s5d': 'آنچ بند، ڈھکن بند، دس منٹ۔ بچی ہوئی یخنی دانے کے اندر چلی جاتی ہے۔',
    'd1.s6t': 'کباب کے ساتھ پیش کریں',
    'd1.s6d': 'پلیٹ میں چکن کے ساتھ، اور ساتھ ایک دو شامی کباب۔',

    'd2.dish': 'روز کا ابلا چاول',
    'd2.tag': 'جو ہر بوری سے ایک جیسا پکتا ہے',
    'd2.why':
      'یہ وہ چاول ہے جس پر باورچی خانہ چلتا ہے جب ایک ہی پلیٹ رات میں سو بار باہر ' +
      'جانی ہو۔ سنہری کی بجائے سفید سٹیم کیا ہوا، اس لیے کھلا اور صاف پکتا ہے، نہ رنگ ' +
      'نہ کوئی حیرانی۔ پچھلے ہفتے کا ناپ اس ہفتے بھی چلتا ہے۔',
    'd2.s1t': 'دھوئیں',
    'd2.s1d': 'سٹیل کے پیالے میں دو تین بار پانی بدلیں، جب تک گدلا آنا بند نہ ہو جائے۔',
    'd2.s2t': 'ابالیں',
    'd2.s2d': 'کھلا نمکین پانی، تیز ابال، ڈھکن نہیں۔',
    'd2.s3t': 'ایک دانہ چکھیں',
    'd2.s3d': 'تقریباً آٹھ منٹ پر۔ ایک دانہ انگلیوں میں دبائیں \u2014 دبنا چاہیے، بیچ میں سفیدی نہ رہے۔',
    'd2.s4t': 'پانی نکالیں',
    'd2.s4d': 'پکتے ہی نکال دیں۔ گرم پانی میں پڑا چاول پکتا رہتا ہے۔',
    'd2.s5t': 'کھلائیں',
    'd2.s5d': 'چمچ نہیں، کانٹا، اور صرف ایک بار۔ پھر پانچ منٹ ڈھکن بند۔',
    'd2.s6t': 'پیش کریں',
    'd2.s6d': 'پیالے میں، بھاپ اڑتی ہوئی۔',

    'd3.dish': 'دیگ کا کھانا',
    'd3.tag': 'جب تین سو بندوں کا پکانا ہو',
    'd3.why':
      'سخت دانہ جو کافی پانی پیتا ہے اور تیز ابال بھی سہہ لیتا ہے، اور میز جتنی بڑی ' +
      'دیگ میں آپ کو یہی چاہیے۔ فی پلیٹ باسمتی سے تقریباً آدھی لاگت پڑتی ہے، اور اس ' +
      'پیمانے پر یہی پوری بات ہے۔',
    'd3.s1t': 'دیگ میں ہی دھوئیں',
    'd3.s1d': 'جہاں پکانا ہے وہیں دھوئیں۔ اتنی مقدار میں بھیگا چاول اِدھر اُدھر کرنے سے ہی ٹوٹتا ہے۔',
    'd3.s2t': 'پانی ناپ کر ڈالیں',
    'd3.s2d': 'اندازے سے نہیں، ناپ سے۔ اس سائز پر چھوٹی سی غلطی بیس کلو کی غلطی بن جاتی ہے۔',
    'd3.s3t': 'تیز ابال دیں',
    'd3.s3d': 'پوری آنچ پر تیز ابال، پھر آنچ بالکل ہلکی اور ڈھکن بند۔',
    'd3.s4t': 'سالن بنائیں',
    'd3.s4d': 'ساتھ ہی کڑاہی میں، تاکہ دیگ اس کے انتظار میں کھڑی نہ رہے۔',
    'd3.s5t': 'دونوں کو ملائیں',
    'd3.s5d': 'آہستہ سے، نیچے سے، دو تین ہاتھ اور بس۔ اس سے زیادہ ہلایا تو لئی بن جائے گی۔',
    'd3.s6t': 'دیگ سے ہی نکالیں',
    'd3.s6d': 'یہ گھنٹوں گرم رہتی ہے، اور تقریبات میں اسی لیے استعمال ہوتی ہے۔',

    'd4.dish': 'کھیر اور کھچڑی',
    'd4.tag': 'چھوٹے ٹکڑے جو دیگچی گاڑھی کر دیں',
    'd4.why':
      'ٹوٹا باسمتی کم درجے کا چاول نہیں، یہ الگ کام کا چاول ہے۔ چھانٹنے والی مشین سے ' +
      'ٹکڑے چھوٹے نکلتے ہیں، اس لیے یہ اپنا نشاستہ جلدی چھوڑتے ہیں اور دودھ کو بغیر ' +
      'کچھ ڈالے گاڑھا کر دیتے ہیں۔ خوشبو ثابت دانے جیسی، قیمت تقریباً ایک تہائی۔',
    'd4.s1t': 'ہلکا دھوئیں',
    'd4.s1d': 'ایک بار، جلدی سے۔ کچھ نشاستہ رہنے دیں \u2014 گاڑھا وہی کرتا ہے۔',
    'd4.s2t': 'دودھ گرم کریں',
    'd4.s2d': 'موٹے پیندے کی دیگچی میں پورے کریم والا دودھ، ابال آنے تک، پھر اس سے ذرا نیچے رکھیں۔',
    'd4.s3t': 'چاول ڈالیں',
    'd4.s3d': 'ٹوٹا چاول ڈالیں، اور اب نظر رکھنی پڑے گی، کیونکہ یہ پل بھر میں نیچے لگ جاتا ہے۔',
    'd4.s4t': 'گاڑھا کریں',
    'd4.s4d': 'ہلکی آنچ، بار بار ہلاتے رہیں، جب تک چمچ کی پشت پر نہ جمنے لگے۔',
    'd4.s5t': 'چینی آخر میں',
    'd4.s5d': 'چینی آخر میں ڈالیں۔ پہلے ڈال دیں تو چاول نرم ہونا بند کر دیتا ہے۔',
    'd4.s6t': 'سجا کر ٹھنڈا کریں',
    'd4.s6d': 'الائچی، پستہ، بادام۔ ٹھنڈی ہو کر اور گاڑھی ہوتی ہے، اس لیے ٹھیک لگنے سے ذرا پہلے ہی روک دیں۔',

  },
};

/* ------------------------------------------------------------ runtime */

let lang = 'en';
let fontsAdded = false;
const listeners = new Set();

export const t = (key, vars) => {
  let s = DICT[lang][key] ?? DICT.en[key] ?? key;
  if (vars) for (const k in vars) s = s.replace('{' + k + '}', vars[k]);
  return s;
};

export const current = () => lang;
export const onLangChange = (fn) => listeners.add(fn);

/* Nastaliq is a heavy file, so it is only fetched if Urdu is actually asked for */
function loadUrduFonts() {
  if (fontsAdded) return;
  fontsAdded = true;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = NASTALIQ;
  document.head.appendChild(link);
}

export function setLang(next) {
  lang = DICT[next] ? next : 'en';
  if (lang === 'ur') loadUrduFonts();

  const root = document.documentElement;
  root.lang = lang;
  root.dir = lang === 'ur' ? 'rtl' : 'ltr';

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll('[data-i18n-html]').forEach((el) => {
    el.innerHTML = t(el.dataset.i18nHtml);
  });
  document.querySelectorAll('[data-i18n-attr]').forEach((el) => {
    el.dataset.i18nAttr.split(',').forEach((pair) => {
      const [attr, key] = pair.split(':');
      el.setAttribute(attr, t(key));
    });
  });

  try {
    localStorage.setItem('lang', lang);
  } catch {
    /* private window — the choice just will not stick */
  }

  listeners.forEach((fn) => fn(lang));
}

export function initLang() {
  let saved = null;
  try {
    saved = localStorage.getItem('lang');
  } catch {
    /* ignore */
  }
  setLang(saved || 'en');
}
