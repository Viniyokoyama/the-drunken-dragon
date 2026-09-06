/* ============================================================
   THE DRUNKEN DRAGON — i18n (EN / NL)
   One dictionary, no duplicated pages.

   How it works:
   - The HTML is authored in English. Every translatable node carries
     data-i18n="key" (or data-i18n-ph="key" for a placeholder).
   - On load we snapshot the English innerHTML as the "en" fallback,
     so English needs no dictionary entry unless JS generates it.
   - The choice is stored in localStorage and restored on the next visit.

   Adding a string: put data-i18n="some.key" on the element, then add
   NL.some.key below. That is the whole workflow.
   ============================================================ */
(function (global) {
  'use strict';

  var STORAGE_KEY = 'dd-lang';

  /* ---------- English strings that only exist in JS ---------- */
  var EN = {
    'oracle.roll': 'Roll the d20',
    'oracle.rollAgain': 'Roll again',
    'form.sending': 'The raven is away...',
    'form.sent': 'Request received. We will write back within a day.',
    'form.error': 'A few runes are still missing.',

    'or.1':  'Tap water, and a moment to reconsider.',
    'or.2':  'Stormwind Fries. Make them loaded.',
    'or.3':  'The Rose. Light as a fairy.',
    'or.4':  'Mead. Our personal favourite.',
    'or.5':  'Fuze Tea. The campaign runs long.',
    'or.6':  'Hertog Jan. Cold, honest, correct.',
    'or.7':  'Radler. Pace yourself, adventurer.',
    'or.8':  'Beholder Eyes, before you drink anything else.',
    'or.9':  "Tiamat's Nest. The tavern keeper's favourite.",
    'or.10': 'The Elixir. Zesty and restorative.',
    'or.11': 'Check-Mate. Herbal, clever, refreshing.',
    'or.12': 'Forest Breeze. Minty and cool.',
    'or.13': 'Grutte Pier Blond. Brewed down the road.',
    'or.14': 'Nacho Cheese. A whooole lotta cheese.',
    'or.15': 'Black Cape. Honeyed whiskey in shadow.',
    'or.16': 'Witte Wief. Visions and/or bad decisions.',
    'or.17': 'Lava Cookie. Dessert first is a valid strategy.',
    'or.18': 'The Alchemist. Think you can do it yourself?',
    'or.19': 'Mushrooms. Two glasses. No need to choose.',
    'or.20': 'Ask the bar for a secret cocktail. Show them this roll.'
  };

  /* ---------- Nederlands ---------- */
  var NL = {
    /* chrome */
    'loading': 'De haard wordt aangestoken',
    'skip': 'Naar de inhoud',
    'nav.menu': 'Menu',
    'nav.events': 'Evenementen',
    'nav.shop': 'Shop',
    'nav.about': 'Over ons',
    'nav.visit': 'Vind ons',
    'cta.reserve': 'Reserveer',
    'cta.reserveTable': 'Reserveer een tafel',
    'cta.viewMenu': 'Bekijk het menu',

    /* hero */
    'hero.tagline': 'Waar Legendes Geboren Worden',
    'hero.sub': 'Een middeleeuwse fantasy-taverne vol magie, mysterie en onvergetelijke cocktails.',
    'hero.stat1': 'Opgericht in Leeuwarden',
    'hero.stat2': 'Cocktails in het boek',
    'hero.stat3': 'Nachten vol avontuur',
    'hero.enter': 'Binnen',

    /* about */
    'about.eyebrow': 'Hoe het begon',
    'about.title': 'Een droom gegooid<br><span class="foil">op een d20</span>',
    'about.caption': 'Sinds 2026 &middot; Leeuwarden',
    'about.p1': 'The Drunken Dragon werd in 2026 geboren uit de droom van vier avonturiers die geloofden dat de wereld een plek nodig had waar fantasie niet zomaar een genre was — maar een manier van leven.',
    'about.p2': 'Geïnspireerd door de tavernes van Dungeons &amp; Dragons, het gezelschap van The Lord of the Rings, de legendarische herbergen van World of Warcraft en talloze avonden vol verhalen rond een tafel, besloten ze iets echts te bouwen.',
    'about.p3': 'Een plek waar elke gemeenschap, elke guild, elke zwervende ziel binnen kan lopen en zich echt welkom voelt. Waar de verlegen tovenaar zijn stem vindt, de eenzame ranger zijn party vindt, en de bard altijd een podium heeft. Wie je ook bent en waar je ook vandaan komt — bij The Drunken Dragon hoor je erbij.',
    'about.established': 'Opgericht',

    /* menu */
    'menu.eyebrow': 'Het tavernemenu',
    'menu.title': 'Dranken, Bieren &amp; <span class="foil">Feesten</span>',
    'menu.sub': 'Elke drank is een spreuk. Elke hap een questbeloning. Kies verstandig, avonturier.',
    'menu.tab1': 'Cocktail Specials',
    'menu.tab2': 'Bekende Cocktails',
    'menu.tab3': 'Frituur &amp; Keuken',
    'menu.tab4': 'Bier &amp; Fris',
    'menu.specialsNote': 'Onze signature creaties — in eigen huis gemaakt en anders dan alles wat je ooit hebt geproefd.',
    'menu.familiarNote': 'Cocktails die je al kent, maar met een magische twist… Raad jij hun originele namen?',
    'menu.secretTitle': 'Geheime Cocktails',
    'menu.secretType': 'Op geen enkel menu',
    'menu.secretDesc': 'Er zijn cocktails die we niet opschrijven. Vraag je bartender welke — en of je er klaar voor bent.',
    'menu.meadEyebrow': 'Onze persoonlijke favoriet',
    'menu.meadTitle': 'Mede',
    'menu.mead': 'Mede',
    'menu.cherryMead': 'Kersenmede',

    /* signature drinks */
    'd.wittewief.type': 'Romig &amp; Verleidelijk',
    'd.wittewief.desc': 'Een onschuldige romige cocktail, maar sterk genoeg voor visioenen en/of slechte beslissingen.',
    'd.mushrooms.type': 'Speels &amp; Verrassend',
    'd.mushrooms.desc': 'Avonturiers die worstelen met kiezen ontdekken dat kiezen helemaal niet nodig is — twee glazen, één vlammend oranje, één diepblauw.',
    'd.alchemist.type': 'Onvoorspelbaar',
    'd.alchemist.desc': 'Ah, dus jij denkt dat je het zelf kunt? Goed dan. Laat maar zien wat je kunt.',
    'd.blackcape.type': 'Honingzoet &amp; Intens',
    'd.blackcape.desc': 'Een gehoningde whisky-betovering gehuld in schaduw… en kaneel. Geserveerd in kristal, gekroond met een miniatuur eiken vat.',
    'd.checkmate.type': 'Kruidig &amp; Verfrissend',
    'd.checkmate.desc': "Een verfrissende reizigerstonic, gebrouwen uit verre bladeren en slimme strategie.",
    'd.rose.type': 'Bloemig &amp; Delicaat',
    'd.rose.desc': 'Als een bloem die opbloeit onder zonlicht. Licht als een fee.',
    'd.elixir.type': 'Fris &amp; Verfrissend',
    'd.elixir.desc': 'Het elixir uit verre rijken werd over oceanen gedragen door zwervende handelaren en waaghalzen.',

    /* tags */
    'tag.signature': 'Signature',
    'tag.creamy': 'Romig',
    'tag.favourite': 'Publieksfavoriet',
    'tag.interactive': 'Interactief',
    'tag.alcohol': 'Alcohol',
    'tag.refreshing': 'Verfrissend',
    'tag.light': 'Licht',
    'tag.vegan': 'Vegan',
    'tag.vegetarian': 'Vegetarisch',
    'tag.classic': 'Klassiek',
    'tag.sharing': 'Delen',
    'tag.sweet': 'Zoet',

    /* flavour profiles */
    't.tropicalVelvety': 'Tropisch &amp; Fluweelzacht',
    't.fruityRefreshing': 'Fruitig &amp; Verfrissend',
    't.mintyRefreshing': 'Muntig &amp; Verfrissend',
    't.boldCoffee': 'Krachtig &amp; Koffie',
    't.strongCitrusy': 'Sterk &amp; Citrusachtig',
    't.creamyTropical': 'Romig &amp; Tropisch',
    't.bitterSparkling': 'Bitter &amp; Bruisend',
    't.sweetCitrusy': 'Zoet &amp; Citrusachtig',
    't.tangyVibrant': 'Pittig &amp; Levendig',
    't.tropicalNutty': 'Tropisch &amp; Nootachtig',
    't.fruityBittersweet': 'Fruitig &amp; Bitterzoet',

    /* food */
    'food.frituur': 'Gesmeed in de frituur',
    'food.kitchen': 'De keuken van de druïde',
    'food.boards': 'Deelplanken',
    'food.happy': 'Happy Hour',
    'food.happyTime': '10:00 &ndash; 20:00',
    'food.mageTitle': 'Een woord van de Magiër',
    'food.mageText': 'Heb je een allergie? Vraag ons personeel naar allergeneninformatie. Ons menu verandert met de seizoenen — vraag je server naar de specials van vandaag.',
    'f.beholder': 'Goeie ouderwetse bitterballen. Vegetarische optie beschikbaar.',
    'f.mindflayers': 'Mini frikandellen, een hele hoop.',
    'f.chicken': 'Kip, maar dan hapklaar.',
    'f.tiamat': 'Braziliaanse kipkroketjes, goudbruin gefrituurd. Favoriet van de tavernehouder!',
    'f.veggie': 'Krokant vanbuiten, gloeiend heet vanbinnen. Voor de vegan lekkerbek.',
    'f.fries': "Doodgewone friet met je favoriete saus(en). Maak 'm loaded voor +2.",
    'f.mozzy': 'Mozzarellasticks. Hmm. Kaas.',
    'f.drumsticks': 'Krokante kippenpootjes. Lekker.',
    'f.bread': 'Getoast brood met ham en gesmolten kaas.',
    'f.nacho': "Nacho's met groente en een heleboel kaas. Met spek +3.",
    'f.borrel': 'Kaas, mozzarella, salami en olijven, geserveerd met sweet chilisaus of mosterd.',
    'f.frisian': 'Een klassieke borrelplank, maar met een vleugje Fryslân.',
    'f.cookie': 'Warm gebakken koek in een pannetje, gevuld met Nutella.',
    'b.raid': '6 bitterballen, 6 chickenbites &amp; friet.',
    'b.fellowship': '6 coxinhas, 6 frikandellen en loaded fries.',
    'b.hoard': '6 coxinhas, 6 bitterballen, 6 mini frikandellen, 6 chicken bites en loaded fries.',
    'h.fries': 'Bier + friet',
    'h.bitterballen': 'Bier + bitterballen',
    'h.loaded': "Bier + loaded fries / nacho's",
    'h.coxinhas': 'Bier + coxinhas',
    'h.pitcher': 'Pitcher + The Hoard plank',

    /* drinks */
    'dr.beers': 'Bieren',
    'dr.local': 'Bieren — lokaal gebrouwen!',
    'dr.sodas': 'Frisdrank',
    'dr.wines': 'Wijnen',
    'dr.mead': 'Mede',
    'w.dryWhite': 'Droge witte wijn',
    'w.sweetWhite': 'Zoete witte wijn',
    'w.red': 'Rode wijn',
    'w.rose': 'Rosé wijn',

    /* oracle */
    'oracle.eyebrow': 'Laat het lot beslissen',
    'oracle.title': 'Kun je niet kiezen?<br><span class="foil">Gooi ervoor.</span>',
    'oracle.sub': 'Twintig kanten, twintig antwoorden, allemaal van het echte menu. De bar respecteert de uitslag. Meestal.',
    'oracle.roll': 'Gooi de d20',
    'oracle.rollAgain': 'Nog een keer',
    'oracle.waiting': 'De dobbelsteen wacht.',
    'or.1':  'Kraanwater, en een moment van bezinning.',
    'or.2':  "Stormwind Fries. Maak 'm loaded.",
    'or.3':  'The Rose. Licht als een fee.',
    'or.4':  'Mede. Onze persoonlijke favoriet.',
    'or.5':  'Fuze Tea. De campagne duurt lang.',
    'or.6':  'Hertog Jan. Koud, eerlijk, correct.',
    'or.7':  'Radler. Rustig aan, avonturier.',
    'or.8':  'Beholder Eyes, voordat je iets anders drinkt.',
    'or.9':  "Tiamat's Nest. Favoriet van de tavernehouder.",
    'or.10': 'The Elixir. Fris en herstellend.',
    'or.11': 'Check-Mate. Kruidig, slim, verfrissend.',
    'or.12': 'Forest Breeze. Muntig en koel.',
    'or.13': 'Grutte Pier Blond. Om de hoek gebrouwen.',
    'or.14': 'Nacho Cheese. Een heleboel kaas.',
    'or.15': 'Black Cape. Gehoningde whisky in schaduw.',
    'or.16': 'Witte Wief. Visioenen en/of slechte beslissingen.',
    'or.17': 'Lava Cookie. Eerst toetje is een geldige strategie.',
    'or.18': 'The Alchemist. Denk je dat je het zelf kunt?',
    'or.19': 'Mushrooms. Twee glazen. Kiezen hoeft niet.',
    'or.20': 'Vraag de bar om een geheime cocktail. Laat deze worp zien.',

    /* events */
    'events.eyebrow': 'Avonturen',
    'events.title': 'Wekelijkse <span class="foil">Quests</span>',
    'events.sub': 'Elke week een nieuw avontuur. Schrijf je in en word deel van de legende.',
    'events.everyWeek': 'Elke woensdag',
    'events.biweeklyThu': 'Donderdag &middot; om de week',
    'events.biweeklySun': 'Zondag &middot; om de week',
    'events.monthly': 'Maandelijks &amp; speciaal',
    'events.boardgame': 'Bordspellenavond',
    'events.boardgameDesc': 'De kast is van jou. Bordspellen, kaartspellen en precies het soort ruzie dat alleen ontstaat bij een regeldiscussie. Loop binnen, reserveren hoeft niet.',
    'events.drinkdraw': 'Drink &amp; Draw',
    'events.drinkdrawDesc': 'Neem een schetsboek mee, bestel een toverdrank en teken wat de avond je geeft. Geen niveau vereist — alleen enthousiasme.',
    'events.dnd': 'D&amp;D Event',
    'events.dndDesc': 'Een tafel, een DM en een verhaal dat vanavond eindigt. Personages krijg je van ons, ervaring is niet nodig. Sessies zitten snel vol — schrijf je in via Instagram.',
    'events.specials': 'Quiz, Karaoke &amp; Meer',
    'events.specialsDesc': 'Fantasy pubquiz, karaoke-avonden, mede-proeverijen en community-ontmoetingen. Houd de kalender hieronder in de gaten.',
    'events.thisMonth': 'Wat er speelt',
    'events.month': 'September 2026',
    'events.closedNote': 'Maandag &amp; dinsdag gesloten',
    'events.pubquiz': 'Drunken Dragon Fantasy Pubquiz',
    'events.karaokeOliver': 'Karaoke m/ Oliver',
    'events.mead': 'Mede-proeverij',
    'events.quizEllen': 'Quiz Time m/ Ellen van Ellende',
    'events.bonusKaraoke': 'Bonus Karaoke',
    'events.furry': 'Furry Fusion Munch',
    'events.ctaText': 'Data, tickets en last-minute chaos verschijnen eerst op Instagram.',
    'events.ctaBtn': 'Volg het questbord',

    /* founders */
    'party.eyebrow': 'Het gezelschap',
    'party.title': 'Ontmoet de <span class="foil">Oprichters</span>',
    'party.sub': 'Vier vrienden. Eén droom. Een eeuwige queeste om elke avond legendarisch te maken.',
    'party.kevinClass': 'De Magiër',
    'party.kevinBio': 'Elke grote taverne heeft een meester van de arcane kunsten nodig — en Kevin is de onze. Achter elk contract, elke deal en elke samenwerking staat zijn vaste hand. Hij maakt het ingewikkelde moeiteloos en houdt de magie levend, niet alleen in de glazen maar in alles wat The Drunken Dragon draaiende houdt.',
    'party.hesterClass': 'De Bard',
    'party.hesterBio': 'Hester organiseert niet zomaar evenementen — ze maakt ervaringen. Van thema-avonden tot epische feesten: ze heeft de gave om een gewone avond te veranderen in een herinnering waarover je jaren later nog vertelt. Staat er een legendarische avond op de planning? Dan heeft Hester hem bedacht.',
    'party.luannaClass': 'De Druïde',
    'party.luannaBio': 'Hoedster van de ziel en de gemeenschap van de taverne. Luanna zorgt voor iedereen die binnenloopt — en zorgt dat niemand met honger vertrekt. Elke snack maakt ze met de hand, met zorg, om elke buik vol en elk hart warm te houden.',
    'party.markClass': 'De Ranger',
    'party.markBio': 'Altijd waakzaam, altijd voorbereid. Mark houdt de hele taverne op volle kracht draaiend — elke fakkel aan, elk vat vol, elke deur open. Hij zorgt ervoor dat er niets ontbreekt en dat alles op volle toeren draait voordat de eerste gast binnenkomt.',

    /* creed */
    'creed.eyebrow': 'Onze code',
    'creed.title': 'Waar Wij Voor <span class="foil">Staan</span>',
    'creed.c1': 'Radicale Inclusie',
    'creed.c1d': 'Elke klasse, elk ras, elke achtergrond is hier welkom. The Drunken Dragon is een veilige haven voor alle avonturiers.',
    'creed.c2': 'Community Eerst',
    'creed.c2d': 'We zijn meer dan een bar. We zijn een ontmoetingsplek — een thuisbasis voor je party, je guild, jouw mensen.',
    'creed.c3': 'Magie in Alles',
    'creed.c3d': 'Van onze cocktails tot ons decor: we stoppen verbeelding in elk detail. De fantasie stopt niet bij de deur.',
    'creed.c4': 'Verhalen Die Het Waard Zijn',
    'creed.c4d': 'Wij geloven dat elke avond uit een verhaal moet worden. Kom binnen als vreemden, vertrek als legendes.',

    /* shop */
    'shop.eyebrow': 'De schatkamer',
    'shop.title': 'Dragon <span class="foil">Merchandise</span>',
    'shop.sub': 'Draag het teken van de draak. Exclusieve merchandise voor echte legendes.',
    'shop.p1': 'Dragon Crest T-Shirt',
    'shop.p1d': 'Premium katoen met het gouden drakenlogo.',
    'shop.p2': 'Taverne Bierpul',
    'shop.p2d': 'Handgemaakte metalen pul met drakenreliëf.',
    'shop.p3': "Dragon's Reserve Pack",
    'shop.p3d': 'Exclusief proefpakket met 3 huiscocktails.',
    'shop.note': 'Verkrijgbaar aan de bar. Vraag een tavernehouder.',

    /* private events */
    'private.eyebrow': 'Besloten feesten',
    'private.title': 'Huur de <span class="foil">Hele Taverne</span>',
    'private.text': 'Vier je verjaardag, vrijgezellenfeest of bedrijfsavond in de meest epische setting van Fryslân. Jij brengt het feest — wij zorgen voor de magie.',
    'private.p1': 'Exclusief gebruik van de taverne',
    'private.p2': 'Eigen menu &amp; cocktails',
    'private.p3': 'Een eigen Dungeon Master',
    'private.p4': 'Live entertainment op aanvraag',
    'private.cta': 'Vraag een offerte aan',

    /* visit */
    'visit.eyebrow': 'Vind ons',
    'visit.title': 'Kom langs en <span class="foil">klop aan</span>',
    'visit.where': 'Waar',
    'visit.country': 'Nederland',
    'visit.maps': 'Open in Maps',
    'visit.hours': 'Openingstijden',
    'visit.closed': 'Gesloten',
    'visit.hoursNote': 'Op eventavonden kan het later worden. Check Instagram voor de week vooruit.',
    'visit.reach': 'Bereik ons',
    'visit.reachNote': 'Grote groep, afhuur of een verjaardagsfeest? Schrijf ons.',
    'day.mon': 'Maandag', 'day.tue': 'Dinsdag', 'day.wed': 'Woensdag',
    'day.thu': 'Donderdag', 'day.fri': 'Vrijdag', 'day.sat': 'Zaterdag', 'day.sun': 'Zondag',

    /* form */
    'form.title': 'Reserveer een tafel',
    'form.sub': 'Stuur een raaf. We antwoorden binnen een dag.',
    'form.name': 'Naam',
    'form.namePh': 'Je naam, of die van je personage',
    'form.email': 'E-mail',
    'form.date': 'Datum',
    'form.time': 'Tijd',
    'form.party': 'Aantal personen',
    'form.occasion': 'Gelegenheid',
    'form.occ1': 'Gewoon wat drinken',
    'form.occ2': 'Bordspellenavond',
    'form.occ3': 'D&amp;D event',
    'form.occ4': 'Pubquiz / karaoke',
    'form.occ5': 'Verjaardag / afhuur',
    'form.notes': 'Nog iets dat we moeten weten?',
    'form.notesPh': 'Allergieën, toegankelijkheid, een uitstekend achtergrondverhaal',
    'form.policy': 'We houden je tafel <b>20 minuten</b> vrij. Loop je uit? Stuur ons een bericht, dan houden we hem warm.',
    'form.submit': 'Verstuur de raaf',
    'form.sending': 'De raaf is onderweg...',
    'form.sent': 'Aanvraag ontvangen. We schrijven binnen een dag terug.',
    'form.error': 'Er ontbreken nog een paar runen.',

    /* footer */
    'footer.tag': 'Waar legendes geboren worden. Een middeleeuwse fantasy-taverne in het hart van Nederland.',
    'footer.explore': 'Ontdek',
    'footer.menuDrinks': 'Menu &amp; Drankjes',
    'footer.merch': 'Merchandise',
    'footer.aboutUs': 'Over ons',
    'footer.h1': 'Wo &ndash; do: 17:00 &ndash; 01:00',
    'footer.h2': 'Vr &ndash; za: 17:00 &ndash; 03:00',
    'footer.h3': 'Zo: 15:00 &ndash; 00:00',
    'footer.h4': 'Ma &ndash; di: gesloten',
    'footer.rights': 'Alle rechten voorbehouden.',
    'footer.drink': 'Drink met mate. Gooi eerlijk.'
  };

  var DICT = { en: EN, nl: NL };

  /* Snapshot of the English markup, filled on first run. */
  var baseline = {};
  var current = 'en';

  function nodes() {
    return Array.prototype.slice.call(document.querySelectorAll('[data-i18n],[data-i18n-ph]'));
  }

  function snapshot() {
    nodes().forEach(function (el) {
      var k = el.getAttribute('data-i18n');
      var p = el.getAttribute('data-i18n-ph');
      if (k && !(k in baseline)) baseline[k] = el.innerHTML;
      if (p && !('ph:' + p in baseline)) baseline['ph:' + p] = el.getAttribute('placeholder') || '';
    });
  }

  /* Dictionary values are authored in this file, never user input,
     so innerHTML is safe here and lets a string carry <br> or <b>. */
  function apply(lang) {
    var dict = DICT[lang] || {};

    nodes().forEach(function (el) {
      var k = el.getAttribute('data-i18n');
      if (k) {
        var v = lang === 'en' ? baseline[k] : (dict[k] !== undefined ? dict[k] : baseline[k]);
        if (v !== undefined) el.innerHTML = v;
      }
      var p = el.getAttribute('data-i18n-ph');
      if (p) {
        var pv = lang === 'en' ? baseline['ph:' + p] : (dict[p] !== undefined ? dict[p] : baseline['ph:' + p]);
        if (pv !== undefined) el.setAttribute('placeholder', decodeEntities(pv));
      }
    });

    document.documentElement.setAttribute('lang', lang);
    current = lang;

    Array.prototype.forEach.call(document.querySelectorAll('.lang__btn'), function (b) {
      var on = b.getAttribute('data-lang') === lang;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });

    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* private mode */ }

    document.dispatchEvent(new CustomEvent('dd:langchange', { detail: { lang: lang } }));
  }

  var scratch = document.createElement('textarea');
  function decodeEntities(s) { scratch.innerHTML = s; return scratch.value; }

  /* Public: translate a JS-generated string. */
  function t(key) {
    var dict = DICT[current] || {};
    if (dict[key] !== undefined) return decodeEntities(dict[key]);
    if (EN[key] !== undefined) return decodeEntities(EN[key]);
    if (baseline[key] !== undefined) return decodeEntities(baseline[key]);
    return key;
  }

  function init() {
    snapshot();

    var saved = null;
    try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) { /* ignore */ }

    // First visit: follow the browser, but only for Dutch speakers.
    if (!saved) {
      var pref = (navigator.languages || [navigator.language || 'en']).join(',').toLowerCase();
      saved = /\bnl\b|nl-/.test(pref) ? 'nl' : 'en';
    }

    apply(saved === 'nl' ? 'nl' : 'en');

    Array.prototype.forEach.call(document.querySelectorAll('.lang__btn'), function (b) {
      b.addEventListener('click', function () { apply(b.getAttribute('data-lang')); });
    });
  }

  global.DD_I18N = { t: t, apply: apply, get lang() { return current; } };

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', init)
    : init();
})(window);
