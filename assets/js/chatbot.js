/* ============================================================
   THE DRUNKEN DRAGON — "Ask the Tavern Keeper"
   A self-contained help bot. No backend, no API key, no cost.

   It answers from a hand-written knowledge base built out of the
   real site content, in English and Dutch, and hands off to a
   human when it does not know. Entries flagged `unknown:true` are
   questions guests WILL ask that the tavern has not answered yet —
   see README for the list to fill in.
   ============================================================ */
(function () {
  'use strict';

  var IG = 'https://www.instagram.com/_the_drunken_dragon_/';
  var MAIL = 'mailto:drunkendragonleeuwarden@gmail.com';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- interface strings ---------------- */
  var UI = {
    en: {
      launch: 'Ask the Tavern Keeper',
      title: 'The Tavern Keeper',
      sub: 'Ask me anything about the tavern',
      close: 'Close',
      placeholder: 'Type your question…',
      send: 'Send',
      greet: 'Well met, traveller. I keep the bar and the answers — ask me about our menu, our quests, or finding the door.',
      chips: ['Opening hours', 'Where are you?', 'Book a table', 'D&D nights', 'Vegan food'],
      fallback: 'That one is beyond my spellbook. The quickest way to a real answer is a message on <a href="' + IG + '" target="_blank" rel="noopener">Instagram</a> — we reply fast. You can also write to <a href="' + MAIL + '">drunkendragonleeuwarden@gmail.com</a>.',
      dunno: 'Honest answer: I do not have that one confirmed, and I would rather not guess. Ask us on <a href="' + IG + '" target="_blank" rel="noopener">Instagram</a> and you will get a straight answer from a human.',
      typing: 'The keeper is thinking…'
    },
    nl: {
      launch: 'Vraag het de tavernehouder',
      title: 'De Tavernehouder',
      sub: 'Vraag me alles over de taverne',
      close: 'Sluiten',
      placeholder: 'Typ je vraag…',
      send: 'Versturen',
      greet: 'Goed je te zien, reiziger. Ik hou de bar én de antwoorden bij — vraag me naar het menu, onze quests, of hoe je de deur vindt.',
      chips: ['Openingstijden', 'Waar zitten jullie?', 'Tafel reserveren', 'D&D-avonden', 'Veganistisch eten'],
      fallback: 'Die staat niet in mijn toverboek. De snelste weg naar een echt antwoord is een bericht op <a href="' + IG + '" target="_blank" rel="noopener">Instagram</a> — we reageren snel. Mailen kan ook: <a href="' + MAIL + '">drunkendragonleeuwarden@gmail.com</a>.',
      dunno: 'Eerlijk antwoord: dat weet ik niet zeker, en ik gok liever niet. Vraag het ons op <a href="' + IG + '" target="_blank" rel="noopener">Instagram</a>, dan krijg je een duidelijk antwoord van een mens.',
      typing: 'De tavernehouder denkt na…'
    }
  };

  /* ---------------- knowledge base ----------------
     p = trigger words/phrases (a phrase scores higher than a word)
     a = the answer, may contain links
     ------------------------------------------------ */
  var KB = [
    {
      id: 'hours',
      p: { en: ['opening hours', 'what time', 'when are you open', 'open', 'close', 'closing', 'hours', 'today', 'tonight', 'monday', 'tuesday', 'sunday'],
           nl: ['openingstijden', 'hoe laat', 'wanneer open', 'open', 'dicht', 'gesloten', 'vandaag', 'vanavond', 'maandag', 'dinsdag', 'zondag'] },
      a: { en: 'We pour from <b>Wednesday to Sunday</b>:<br>Wed &amp; Thu 17:00–01:00<br>Fri &amp; Sat 17:00–03:00<br>Sun 15:00–00:00<br><br>Closed Monday and Tuesday. Event nights can run later — the week ahead is always on <a href="' + IG + '" target="_blank" rel="noopener">Instagram</a>.',
           nl: 'We schenken van <b>woensdag tot en met zondag</b>:<br>wo &amp; do 17:00–01:00<br>vr &amp; za 17:00–03:00<br>zo 15:00–00:00<br><br>Maandag en dinsdag gesloten. Op eventavonden kan het later worden — de week vooruit staat altijd op <a href="' + IG + '" target="_blank" rel="noopener">Instagram</a>.' }
    },
    {
      id: 'address',
      p: { en: ['where are you', 'where is', 'address', 'location', 'find you', 'how do i get', 'directions', 'street', 'city', 'leeuwarden', 'map'],
           nl: ['waar zitten', 'waar is', 'adres', 'locatie', 'vinden', 'hoe kom ik', 'route', 'straat', 'stad', 'leeuwarden', 'kaart'] },
      a: { en: 'You will find us at <b>Weerd 13, Leeuwarden</b>, on the corner of Weerd and Bagijnestraat — a few minutes on foot from the Waag, in the middle of town.<br><br><a href="https://www.google.com/maps/search/?api=1&query=Weerd+13+Leeuwarden" target="_blank" rel="noopener">Open in Maps</a>',
           nl: 'Je vindt ons op <b>Weerd 13, Leeuwarden</b>, op de hoek van de Weerd en de Bagijnestraat — een paar minuten lopen vanaf de Waag, midden in de stad.<br><br><a href="https://www.google.com/maps/search/?api=1&query=Weerd+13+Leeuwarden" target="_blank" rel="noopener">Open in Maps</a>' }
    },
    {
      id: 'reserve',
      p: { en: ['book', 'booking', 'reserve', 'reservation', 'table', 'do i need to book', 'walk in'],
           nl: ['reserveren', 'reservering', 'tafel', 'boeken', 'moet ik reserveren', 'binnenlopen'] },
      a: { en: 'You can just walk in — but for a group, or on an event night, booking is wiser. Use the <a href="#reserve">reservation form</a> further down this page and we answer within a day.<br><br>One thing to know: we hold your table for <b>20 minutes</b>. Running late? Send a message and we keep it warm.',
           nl: 'Je kunt gewoon binnenlopen — maar met een groep, of op een eventavond, is reserveren slimmer. Gebruik het <a href="#reserve">reserveringsformulier</a> verderop en we antwoorden binnen een dag.<br><br>Let op: we houden je tafel <b>20 minuten</b> vrij. Loop je uit? Stuur een bericht, dan houden we hem warm.' }
    },
    {
      id: 'cocktails',
      p: { en: ['cocktail', 'signature', 'drink', 'potion', 'elixir', 'what do you drink', 'best drink', 'recommend', 'alcohol', 'witte wief', 'alchemist', 'alquimist', 'black cape', 'check mate', 'the rose', 'mushroom', 'forbidden fruit', 'bad dragon', 'forest breeze', 'critical hit', 'phoenix', 'frostbolt', 'horizon', 'crimson desire', 'mermaid'],
           nl: ['cocktail', 'signature', 'drankje', 'drinken', 'toverdrank', 'elixir', 'aanrader', 'wat moet ik drinken', 'alcohol'] },
      a: { en: 'Our signature list is the heart of the place. A few:<br><br><b>Witte Wief</b> €11.50 — creamy, strong enough for bad decisions<br><b>Mushrooms</b> €14.50 — two glasses, one orange, one blue<br><b>The Alchemist</b> €13.50 — you mix it yourself<br><b>Black Cape</b> €12.50 — honeyed whiskey and cinnamon<br><br>There is also a "Familiar Cocktails" list (€9.50–11.50): drinks you know, with a twist. And a few we do not write down — <i>ask your bartender</i>.',
           nl: 'Onze signature lijst is het hart van de zaak. Een paar:<br><br><b>Witte Wief</b> €11,50 — romig, sterk genoeg voor slechte beslissingen<br><b>Mushrooms</b> €14,50 — twee glazen, één oranje, één blauw<br><b>The Alchemist</b> €13,50 — die meng je zelf<br><b>Black Cape</b> €12,50 — gehoningde whisky en kaneel<br><br>Er is ook een lijst "Bekende Cocktails" (€9,50–11,50): drankjes die je kent, met een twist. En een paar die we niet opschrijven — <i>vraag je bartender</i>.' }
    },
    {
      id: 'secret',
      p: { en: ['secret cocktail', 'secret', 'hidden menu', 'off menu'],
           nl: ['geheime cocktail', 'geheim', 'verborgen menu', 'niet op het menu'] },
      a: { en: 'They exist. They are not written down anywhere, including here. Ask whoever is behind the bar — and be ready for the answer.',
           nl: 'Die bestaan. Ze staan nergens opgeschreven, ook hier niet. Vraag het aan wie achter de bar staat — en wees voorbereid op het antwoord.' }
    },
    {
      id: 'food',
      p: { en: ['food', 'eat', 'snack', 'kitchen', 'hungry', 'frituur', 'bitterballen', 'coxinha', 'nachos', 'fries', 'sharing', 'platter', 'dinner', 'tiamat', 'beholder', 'mindflayer', 'stormwind', 'mozzy', 'veggie flame', 'warlord', 'daily bread', 'borrel', 'frisian platter', 'lava cookie', 'the raid', 'fellowship', 'the hoard'],
           nl: ['eten', 'snack', 'keuken', 'honger', 'frituur', 'bitterballen', 'coxinha', 'nachos', 'friet', 'delen', 'plank', 'borrel'] },
      a: { en: 'Tavern food, mostly from the fryer, with a Brazilian streak:<br><br><b>Beholder Eyes</b> €7 — bitterballen<br><b>Tiamat\'s Nest</b> €9.50 — Brazilian chicken croquettes, the keeper\'s favourite<br><b>Stormwind Fries</b> €4 — loaded for +2<br><b>Frisian Platter</b> €14 — a borrelplank with a hint of Fryslân<br><br>Sharing boards for a party: The Raid €13.95, The Fellowship €18, The Hoard €29.',
           nl: 'Tavernekost, vooral uit de frituur, met een Braziliaanse inslag:<br><br><b>Beholder Eyes</b> €7 — bitterballen<br><b>Tiamat\'s Nest</b> €9,50 — Braziliaanse kipkroketjes, favoriet van de tavernehouder<br><b>Stormwind Fries</b> €4 — loaded voor +2<br><b>Frisian Platter</b> €14 — borrelplank met een vleugje Fryslân<br><br>Deelplanken voor een gezelschap: The Raid €13,95, The Fellowship €18, The Hoard €29.' }
    },
    {
      id: 'veg',
      p: { en: ['vegan', 'vegetarian', 'veggie', 'plant based', 'no meat', 'meat free'],
           nl: ['vegan', 'veganistisch', 'vegetarisch', 'geen vlees', 'plantaardig'] },
      a: { en: 'Yes, and not as an afterthought.<br><br><b>Vegan:</b> Veggie Flames €8, Stormwind Fries €4<br><b>Vegetarian:</b> Mozzy Sticks €8, Nacho Cheese €8.95, Lava Cookie €3.50, and the Beholder Eyes have a vegetarian version.<br><br>Tell the kitchen what you need and they will work with you.',
           nl: 'Ja, en niet als bijzaak.<br><br><b>Vegan:</b> Veggie Flames €8, Stormwind Fries €4<br><b>Vegetarisch:</b> Mozzy Sticks €8, Nacho Cheese €8,95, Lava Cookie €3,50, en van de Beholder Eyes is er een vegetarische versie.<br><br>Zeg de keuken wat je nodig hebt, ze denken met je mee.' }
    },
    {
      id: 'allergy',
      p: { en: ['allergy', 'allergies', 'allergic', 'gluten', 'lactose', 'nuts', 'intolerant'],
           nl: ['allergie', 'allergisch', 'gluten', 'lactose', 'noten', 'intolerant'] },
      a: { en: 'Always tell us. Our staff carry the allergen information for every dish, and the menu shifts with the seasons — so ask on the night rather than trusting a page you read last week.',
           nl: 'Zeg het altijd. Ons personeel heeft de allergeneninformatie van elk gerecht, en het menu verandert met de seizoenen — vraag het dus ter plekke in plaats van te vertrouwen op een pagina van vorige week.' }
    },
    {
      id: 'happy',
      p: { en: ['happy hour', 'deal', 'offer', 'cheap', 'discount', 'combo'],
           nl: ['happy hour', 'aanbieding', 'deal', 'goedkoop', 'korting', 'combi'] },
      a: { en: '<b>Happy Hour runs 10:00–20:00.</b><br><br>Beer + fries €9.50 · Beer + bitterballen €9.95 · Beer + loaded fries or nachos €10.95 · Beer + coxinhas €12.50 · Pitcher + The Hoard board €37.50.',
           nl: '<b>Happy Hour loopt van 10:00 tot 20:00.</b><br><br>Bier + friet €9,50 · Bier + bitterballen €9,95 · Bier + loaded fries of nacho\'s €10,95 · Bier + coxinhas €12,50 · Pitcher + The Hoard plank €37,50.' }
    },
    {
      id: 'beer',
      p: { en: ['beer', 'beers', 'tap', 'draught', 'pils', 'ipa', 'local brew', 'brewery', 'wine', 'soda'],
           nl: ['bier', 'bieren', 'tap', 'pils', 'ipa', 'lokaal', 'brouwerij', 'wijn', 'fris', 'frisdrank'] },
      a: { en: 'Hertog Jan from €3.25, Leffe Blond, Franziskaner, Goose Island.<br><br>And we are proud of the local shelf: <b>Grutte Pier</b> (Lentebier, Blond, BOCK) and <b>Frysk bier It Wetter</b>. Wines €4.75. Sodas from €3.25, including Guaraná Antarctica.',
           nl: 'Hertog Jan vanaf €3,25, Leffe Blond, Franziskaner, Goose Island.<br><br>En we zijn trots op de lokale plank: <b>Grutte Pier</b> (Lentebier, Blond, BOCK) en <b>Frysk bier It Wetter</b>. Wijnen €4,75. Frisdrank vanaf €3,25, inclusief Guaraná Antarctica.' }
    },
    {
      id: 'mead',
      p: { en: ['mead', 'honey wine', 'met'], nl: ['mede', 'honingwijn'] },
      a: { en: '<b>Mead €5.50</b> and <b>Cherry Mead €6.</b> Our personal favourite, and the most on-theme thing you can hold.',
           nl: '<b>Mede €5,50</b> en <b>Kersenmede €6.</b> Onze persoonlijke favoriet, en het meest thematische wat je kunt vasthouden.' }
    },
    {
      id: 'alcoholfree',
      p: { en: ['alcohol free', 'non alcoholic', 'no alcohol', 'sober', 'zero', 'driving', 'designated driver', 'mocktail', '0.0'],
           nl: ['alcoholvrij', 'zonder alcohol', 'geen alcohol', 'nuchter', 'rijden', 'bob', 'mocktail', '0.0'] },
      a: { en: 'Well covered. Corona Zero €4.50, Radler 0.0 €4, Hertog Jan 0.0 €3.95, plus soft drinks, coffee and tea. Free tap water, always, no need to ask twice.',
           nl: 'Ruim geregeld. Corona Zero €4,50, Radler 0.0 €4, Hertog Jan 0.0 €3,95, plus frisdrank, koffie en thee. Gratis kraanwater, altijd, je hoeft het niet twee keer te vragen.' }
    },
    {
      id: 'dnd',
      p: { en: ['dnd', 'd&d', 'dungeons', 'dragons', 'rpg', 'campaign', 'dungeon master', 'play', 'one shot', 'tabletop'],
           nl: ['dnd', 'd&d', 'dungeons', 'dragons', 'rollenspel', 'campagne', 'dungeon master', 'spelen', 'one shot'] },
      a: { en: 'Our <b>D&amp;D events run on Sunday, every two weeks.</b> A table, a DM, and a story that ends that night. Characters are provided and no experience is needed — beginners are genuinely welcome.<br><br>Sessions fill up fast, so sign-ups go on <a href="' + IG + '" target="_blank" rel="noopener">Instagram</a> first.',
           nl: 'Onze <b>D&amp;D-events zijn op zondag, om de week.</b> Een tafel, een DM, en een verhaal dat die avond eindigt. Personages krijg je van ons en ervaring is niet nodig — beginners zijn echt welkom.<br><br>Sessies zitten snel vol, dus inschrijven gaat eerst via <a href="' + IG + '" target="_blank" rel="noopener">Instagram</a>.' }
    },
    {
      id: 'boardgames',
      p: { en: ['boardgame', 'board game', 'games', 'game night', 'wednesday', 'cards'],
           nl: ['bordspel', 'bordspellen', 'spelletjes', 'spelavond', 'woensdag', 'kaartspel'] },
      a: { en: '<b>Boardgame Night, every Wednesday.</b> The shelf is yours, it costs nothing, and you do not need to book — just walk in and pick something.',
           nl: '<b>Bordspellenavond, elke woensdag.</b> De kast is van jou, het kost niets, en reserveren hoeft niet — loop binnen en pak iets uit.' }
    },
    {
      id: 'drinkdraw',
      p: { en: ['drink and draw', 'drink & draw', 'draw', 'drawing', 'sketch', 'art'],
           nl: ['drink and draw', 'tekenen', 'schetsen', 'kunst'] },
      a: { en: '<b>Drink &amp; Draw is on Thursday, every two weeks.</b> Bring a sketchbook, order a potion, draw whatever the night gives you. No skill level required — only enthusiasm.',
           nl: '<b>Drink &amp; Draw is op donderdag, om de week.</b> Neem een schetsboek mee, bestel een toverdrank en teken wat de avond je geeft. Geen niveau vereist — alleen enthousiasme.' }
    },
    {
      id: 'quiz',
      p: { en: ['quiz', 'pubquiz', 'pub quiz', 'trivia', 'karaoke', 'sing', 'mead tasting', 'tasting'],
           nl: ['quiz', 'pubquiz', 'trivia', 'karaoke', 'zingen', 'mede proeverij', 'proeverij'] },
      a: { en: 'Both, regularly. The <b>Drunken Dragon Fantasy Pub Quiz</b>, <b>karaoke nights</b> (with Oliver, and the occasional bonus round), and now and then a <b>mead tasting</b>.<br><br>Dates change every month — the current calendar is on <a href="#events">this page</a> and on <a href="' + IG + '" target="_blank" rel="noopener">Instagram</a>.',
           nl: 'Allebei, regelmatig. De <b>Drunken Dragon Fantasy Pubquiz</b>, <b>karaoke-avonden</b> (met Oliver, en af en toe een bonusronde), en zo nu en dan een <b>mede-proeverij</b>.<br><br>Data wisselen per maand — de actuele kalender staat op <a href="#events">deze pagina</a> en op <a href="' + IG + '" target="_blank" rel="noopener">Instagram</a>.' }
    },
    {
      id: 'cosplay',
      p: { en: ['cosplay', 'costume', 'dress up', 'dress code', 'what to wear', 'armour', 'outfit'],
           nl: ['cosplay', 'kostuum', 'verkleden', 'dresscode', 'wat aantrekken', 'outfit'] },
      a: { en: 'Come in whatever you like — armour on a Tuesday raises no eyebrows here. There is no dress code, cosplay is always welcome, and on themed nights it is actively encouraged.<br><br>One house rule: ask before you touch someone\'s costume.',
           nl: 'Kom in wat je wilt — harnas op dinsdag valt hier niemand op. Er is geen dresscode, cosplay is altijd welkom, en op thema-avonden wordt het aangemoedigd.<br><br>Eén huisregel: vraag het even voor je iemands kostuum aanraakt.' }
    },
    {
      id: 'private',
      p: { en: ['private', 'rent', 'hire', 'birthday', 'party', 'company', 'corporate', 'group', 'bachelor', 'event booking', 'quote'],
           nl: ['besloten', 'afhuren', 'huren', 'verjaardag', 'feest', 'bedrijf', 'zakelijk', 'groep', 'vrijgezellen', 'offerte'] },
      a: { en: 'Yes — you can take the whole tavern. Exclusive use, a custom menu and cocktails, a dedicated Dungeon Master, and live entertainment on request.<br><br>Tell us what you have in mind through the <a href="#reserve">form</a> or by <a href="' + MAIL + '">email</a> and we will put a quote together.',
           nl: 'Ja — je kunt de hele taverne afhuren. Exclusief gebruik, een eigen menu en cocktails, een eigen Dungeon Master, en live entertainment op aanvraag.<br><br>Vertel ons wat je in gedachten hebt via het <a href="#reserve">formulier</a> of per <a href="' + MAIL + '">e-mail</a>, dan maken we een offerte.' }
    },
    {
      id: 'merch',
      p: { en: ['merch', 'merchandise', 'shop', 'shirt', 'tshirt', 't-shirt', 'mug', 'buy', 'souvenir', 'gift', 'dragon crest', 'reserve pack', 'tankard'],
           nl: ['merch', 'merchandise', 'shop', 'shirt', 'mok', 'kopen', 'souvenir', 'cadeau'] },
      a: { en: 'Dragon Crest T-Shirt €29.95, Tavern Drinking Mug €24.95, and the Dragon\'s Reserve Pack €39.95 — a tasting set of three house cocktails.<br><br>All of it is at the bar. Ask a tavern keeper.',
           nl: 'Dragon Crest T-Shirt €29,95, Taverne Bierpul €24,95, en het Dragon\'s Reserve Pack €39,95 — een proefset met drie huiscocktails.<br><br>Alles is aan de bar te krijgen. Vraag een tavernehouder.' }
    },
    {
      id: 'who',
      p: { en: ['who are you', 'who runs', 'who owns', 'who started', 'owns', 'owner', 'founder', 'founders', 'staff', 'team', 'behind the bar', 'kevin', 'hester', 'luanna', 'mark'],
           nl: ['wie zijn', 'wie runt', 'wie is de eigenaar', 'eigenaar', 'oprichter', 'oprichters', 'personeel', 'team', 'achter de bar', 'kevin', 'hester', 'luanna', 'mark'] },
      a: { en: 'Four friends, since 2026: <b>Kevin</b> the Mage (deals and contracts), <b>Hester</b> the Bard (events and experiences), <b>Luanna</b> the Druid (the kitchen — the coxinhas are hers), and <b>Mark</b> the Ranger (keeps everything running).<br><br>Their faces are <a href="#keepers">further down this page</a>.',
           nl: 'Vier vrienden, sinds 2026: <b>Kevin</b> de Magiër (deals en contracten), <b>Hester</b> de Bard (events en ervaringen), <b>Luanna</b> de Druïde (de keuken — de coxinhas zijn van haar), en <b>Mark</b> de Ranger (houdt alles draaiende).<br><br>Hun gezichten staan <a href="#keepers">verderop op deze pagina</a>.' }
    },
    {
      id: 'inclusive',
      p: { en: ['lgbt', 'lgbtq', 'queer', 'gay', 'trans', 'safe', 'inclusive', 'welcome', 'pride', 'alone', 'by myself'],
           nl: ['lhbt', 'lhbtq', 'queer', 'homo', 'trans', 'veilig', 'inclusief', 'welkom', 'pride', 'alleen'] },
      a: { en: 'Everyone is welcome here, and we mean it as a rule rather than a slogan. This room was a home for Leeuwarden\'s queer community before it was ours, and it still is. We opened on the day of the Pride Walk.<br><br>Coming alone is completely normal — game nights are how half our regulars met each other. Bigotry is the only thing barred at the door.',
           nl: 'Iedereen is hier welkom, en dat is een regel, geen slogan. Deze ruimte was een thuis voor de queer gemeenschap van Leeuwarden voordat het van ons was, en dat is het nog steeds. We openden op de dag van de Pride Walk.<br><br>Alleen komen is heel normaal — de helft van onze vaste gasten heeft elkaar op een spelavond ontmoet. Alleen onverdraagzaamheid komt er niet in.' }
    },
    {
      id: 'price',
      p: { en: ['how much', 'price', 'prices', 'expensive', 'cost', 'budget', 'cover charge', 'entrance fee'],
           nl: ['hoeveel kost', 'prijs', 'prijzen', 'duur', 'kosten', 'entree', 'toegang'] },
      a: { en: 'No entrance fee, and game nights cost nothing to join. Beer from €3.25, snacks from €4, signature cocktails €9.50–14.50. Ticketed D&amp;D events are the exception — those are priced per session and announced with the date.',
           nl: 'Geen entree, en meedoen met spelavonden kost niets. Bier vanaf €3,25, snacks vanaf €4, signature cocktails €9,50–14,50. Ticket-D&amp;D-events zijn de uitzondering — die hebben een prijs per sessie en worden met de datum aangekondigd.' }
    },
    {
      id: 'contact',
      p: { en: ['contact', 'phone', 'call', 'email', 'instagram', 'social', 'message', 'reach you'],
           nl: ['contact', 'telefoon', 'bellen', 'mail', 'instagram', 'bericht', 'bereiken'] },
      a: { en: '<a href="' + IG + '" target="_blank" rel="noopener">@_the_drunken_dragon_</a> on Instagram is the fastest — that is where dates and last-minute changes go first.<br><br>For anything longer: <a href="' + MAIL + '">drunkendragonleeuwarden@gmail.com</a>.',
           nl: '<a href="' + IG + '" target="_blank" rel="noopener">@_the_drunken_dragon_</a> op Instagram is het snelst — daar komen data en last-minute wijzigingen als eerste.<br><br>Voor iets langers: <a href="' + MAIL + '">drunkendragonleeuwarden@gmail.com</a>.' }
    },

    /* ---- recognised, but the tavern has not confirmed an answer ---- */
    {
      id: 'unconfirmed',
      unknown: true,
      p: { en: ['parking', 'park', 'wifi', 'wi-fi', 'internet', 'dog', 'dogs', 'pet', 'card', 'cash', 'pay', 'payment', 'pin', 'wheelchair', 'accessible', 'accessibility', 'age', 'minimum age', 'kids', 'children', 'under 18', 'smoking', 'toilet'],
           nl: ['parkeren', 'parkeerplaats', 'wifi', 'internet', 'hond', 'honden', 'huisdier', 'pinnen', 'contant', 'betalen', 'betaling', 'rolstoel', 'toegankelijk', 'leeftijd', 'kinderen', 'onder 18', 'roken', 'wc', 'toilet'] }
    }
  ];

  /* ---------------- matching ---------------- */
  function norm(s) {
    return (' ' + s + ' ').toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9&\s]/g, ' ')
      .replace(/\s+/g, ' ');
  }
  function lang() {
    return (window.DD_I18N && window.DD_I18N.lang === 'nl') ? 'nl' : 'en';
  }
  function answer(qRaw) {
    var L = lang(), q = norm(qRaw), best = null, bestScore = 0;
    // crude de-pluraliser, so "mugs" still finds "mug"
    var qs = q.replace(/([a-z0-9]{3,})s /g, '$1 ');

    for (var i = 0; i < KB.length; i++) {
      var pats = KB[i].p[L].concat(KB[i].p[L === 'en' ? 'nl' : 'en']); // accept either language
      var s = 0;
      for (var j = 0; j < pats.length; j++) {
        // keep the surrounding spaces: without them "parties" matches "art"
        var p = ' ' + norm(pats[j]).trim() + ' ';
        if (q.indexOf(p) !== -1 || qs.indexOf(p) !== -1) s += pats[j].indexOf(' ') !== -1 ? 3.2 : 1.4;
      }
      if (s > bestScore) { bestScore = s; best = KB[i]; }
    }

    if (!best || bestScore < 1.4) return UI[L].fallback;
    if (best.unknown) return UI[L].dunno;
    return best.a[L];
  }

  /* ---------------- widget ---------------- */
  var root, log, input, panel, launcher, chipRow;
  var open = false;

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }

  function build() {
    var L = lang(), t = UI[L];

    root = el('div', 'tk');

    launcher = el('button', 'tk__launch');
    launcher.type = 'button';
    launcher.setAttribute('aria-label', t.launch);
    launcher.innerHTML =
      '<img src="assets/img/logo.png" alt="" width="455" height="496">' +
      '<span class="tk__launch-label">' + t.launch + '</span>';

    panel = el('div', 'tk__panel');
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', t.title);
    panel.hidden = true;
    panel.innerHTML =
      '<header class="tk__head">' +
        '<img class="tk__avatar" src="assets/img/logo.png" alt="" width="455" height="496">' +
        '<div><p class="tk__title">' + t.title + '</p><p class="tk__sub">' + t.sub + '</p></div>' +
        '<button type="button" class="tk__close" aria-label="' + t.close + '">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>' +
        '</button>' +
      '</header>' +
      '<div class="tk__log" aria-live="polite"></div>' +
      '<div class="tk__chips"></div>' +
      '<form class="tk__form">' +
        '<input class="tk__input" type="text" autocomplete="off" placeholder="' + t.placeholder + '">' +
        '<button class="tk__send" type="submit" aria-label="' + t.send + '">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h14M13 6l6 6-6 6"/></svg>' +
        '</button>' +
      '</form>';

    root.appendChild(panel);
    root.appendChild(launcher);
    document.body.appendChild(root);

    log = panel.querySelector('.tk__log');
    input = panel.querySelector('.tk__input');
    chipRow = panel.querySelector('.tk__chips');

    launcher.addEventListener('click', toggle);
    panel.querySelector('.tk__close').addEventListener('click', toggle);
    panel.querySelector('.tk__form').addEventListener('submit', function (e) {
      e.preventDefault();
      var v = input.value.trim();
      if (!v) return;
      ask(v);
      input.value = '';
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && open) toggle(); });

    greet();
  }

  function bubble(who, html) {
    var b = el('div', 'tk__msg tk__msg--' + who, html);
    log.appendChild(b);
    log.scrollTop = log.scrollHeight;
    return b;
  }

  function chips() {
    var t = UI[lang()];
    chipRow.innerHTML = '';
    t.chips.forEach(function (c) {
      var b = el('button', 'tk__chip', c);
      b.type = 'button';
      b.addEventListener('click', function () { ask(c); });
      chipRow.appendChild(b);
    });
  }

  function greet() {
    log.innerHTML = '';
    bubble('bot', UI[lang()].greet);
    chips();
  }

  function ask(q) {
    bubble('me', q.replace(/</g, '&lt;'));
    var typing = bubble('bot', '<span class="tk__dots"><i></i><i></i><i></i></span>');
    setTimeout(function () {
      typing.innerHTML = answer(q);
      log.scrollTop = log.scrollHeight;
    }, reduced ? 60 : 420 + Math.random() * 320);
  }

  function toggle() {
    open = !open;
    panel.hidden = !open;
    root.classList.toggle('is-open', open);
    launcher.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) setTimeout(function () { input.focus(); }, 60);
  }

  /* rebuild the interface when the visitor switches EN/NL */
  document.addEventListener('dd:langchange', function () {
    if (!root) return;
    var t = UI[lang()];
    launcher.setAttribute('aria-label', t.launch);
    launcher.querySelector('.tk__launch-label').textContent = t.launch;
    panel.querySelector('.tk__title').textContent = t.title;
    panel.querySelector('.tk__sub').textContent = t.sub;
    panel.querySelector('.tk__close').setAttribute('aria-label', t.close);
    input.placeholder = t.placeholder;
    greet();
  });

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', build)
    : build();
})();
