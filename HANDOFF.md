# HANDOFF — The Drunken Dragon website

Everything the next person needs to pick this up: what it is, where every fact
came from, which decisions were deliberate, and where the traps are.

Written 5 September 2026. Read `CONTENT.md` next — it holds the raw data and the
open questions.

---

## 1. What this is

A **single-page static site** for The Drunken Dragon, the fantasy tavern at
Weerd 13, Leeuwarden (NL).

- No build step, no framework, no package manager, no dependencies.
- Three JS files, one CSS file, one HTML file, nine images.
- Bilingual EN/NL from a single dictionary — pages are not duplicated.
- Works from `file://`. Works with JavaScript disabled (degraded, but readable).

```
the-drunken-dragon/
├── index.html          879 lines — the entire site
├── CONTENT.md          the real menu/events/people data + disputed facts
├── HANDOFF.md          this file
├── README.md           operational docs (how to edit, how to extend)
└── assets/
    ├── css/style.css   1527 lines — every style, one file, appended in layers
    ├── js/
    │   ├── i18n.js     EN/NL dictionary + switcher  (253 NL entries)
    │   ├── main.js     embers, tabs, d20 oracle, form, reveals, parallax
    │   └── chatbot.js  "Ask the Tavern Keeper" help bot (24 KB entries)
    └── img/            logo.png + 8 photographs
```

### Run it

```bash
cd the-drunken-dragon
python -m http.server 8099        # or: npx serve
```

Then <http://localhost:8099>. Double-clicking `index.html` also works — all
paths are relative and nothing does `fetch()`.

### Page structure

`#top` hero · `#about` the story · `#menu` (4 tabs) · d20 oracle · `#events` +
September calendar · founders · `#creed` · `#shop` · `#private` · `#visit` +
reservation form · footer. Nav is anchor-based with a scroll-spy.

---

## 2. Where every fact came from

**This matters more than the code.** This is a real business. Some facts are
verified, some are disputed between sources, and some were invented by an
earlier AI session and had to be removed. Do not treat page copy as ground truth
without checking this table.

| Fact | Status | Source |
|---|---|---|
| Name, tagline "Where Legends Are Born" | ✅ verified | Owner's own site + logo |
| Weerd 13, Leeuwarden (cnr. Bagijnestraat) | ✅ verified | Press (Headliner/LC) + Instagram bio |
| Founded 2026, opened on Pride Walk day | ✅ verified | Press |
| Founders: Kevin, Hester, Luanna, Mark | ✅ verified | Press + owner |
| Their classes (Mage/Bard/Druid/Ranger) + bios | ✅ verified | Owner's previous site |
| Full menu, all dishes, all prices | ✅ verified | Screenshots of the owner's menu page |
| Event programme + September 2026 calendar | ✅ verified | Photo of their own printed calendar |
| Merch + prices | ✅ verified | Owner's previous site |
| 20-minute late tolerance on bookings | ✅ verified | Owner stated it explicitly |
| `drunkendragonleeuwarden@gmail.com` | ✅ verified | Owner's transcript |
| **Opening hours** | ⚠️ **disputed** | See below |
| **"Dragonstraat 1, 8911 AB"** | ❌ **removed** | Almost certainly AI-invented |
| **"Up to 120 guests"** | ❌ **removed** | Same source as the fake address |
| `info@thedrunkendragon.nl` | ❌ superseded | Replaced by the gmail address |

### The hours conflict — unresolved

Two sources disagree and **nobody has confirmed which is right**:

- The owner's previous site footer said **Mon–Thu 17:00–01:00**.
- Their own printed September calendar has **Monday and Tuesday crossed out all
  month**, while Friday and Saturday are sometimes blank without a cross — so
  the crosses mean *closed*, not *no event*.

The calendar won, because it is a real artefact they produced. The site
currently says **Wed–Thu 17:00–01:00 · Fri–Sat 17:00–03:00 · Sun 15:00–00:00 ·
Mon–Tue closed**, and there is a `TODO` comment in `#visit` marking it.

This appears in **four places** — change all of them together:
`#visit` hours table, the footer hours block, the JSON-LD
`openingHoursSpecification`, and the `hours` entry in `chatbot.js`.

---

## 3. How it was built, and the two things that went wrong

Useful because it explains why the file has the shape it has.

### Round 1 — research first, then design

The brief was just "an amazing site for this bar" plus a logo and an Instagram
handle. The first real work was **finding out what the place actually is**: a
fantasy café opened by four friends, D&D nights, drag pub quiz, Brazilian
snacks, explicitly queer-friendly, in the room of a former LGBTQ+ venue.

That research set the direction — **"Tavern Grimoire"** — and the one idea the
site is built around: *signature cocktails are laid out as D&D spell cards, and
a working d20 decides your order.*

### Mistake 1 — inventing the menu

With no real menu available, round 1 shipped plausible invented cocktails and
prices, clearly flagged as placeholders in the README.

**That was the wrong call for a real business.** Flagged placeholders still get
published by accident. When the owner later supplied screenshots of the real
menu, every invented item was deleted and replaced. Nothing fictional remains in
the food or drink lists.

*Lesson for the next person: for a real venue, an empty section is safer than a
plausible one.*

### Mistake 2 — drawing artwork instead of finding the photos

The owner pasted photographs into the conversation. They could be seen but not
written to disk, and the searches for them on the filesystem came up empty. The
response was to **draw substitutes in SVG** — an illustrated tree, a drawn
Potions Book, a redrawn dragon.

The owner, correctly and repeatedly, did not want drawings. They wanted their
photographs.

**The photos were on disk the whole time.** Claude Code stores the session
transcript at `~/.claude/projects/<project>/<session>.jsonl`, and pasted images
are embedded in it as base64. The file was 13.5 MB for a text conversation,
which should have been the clue much earlier. A small parser walked the JSONL,
found 41 embedded images and decoded them to real files.

Every drawn asset was then deleted — `hero-tree.svg`, `potions-book.svg`,
`founders.svg`, `logo.svg`, `logo-mark.svg`, `favicon.svg`, and the whole
`<symbol id="i-dragon">` sprite. The site now uses only the tavern's own
photography and its official logo.

*Lesson: before concluding an asset is unreachable, check where the tool stores
its own conversation state.*

### Round 2 — the real material

Real menu, real founders with real portraits, real calendar, official logo,
EN/NL translation, the Private Events section recovered from their old site, and
the help bot.

---

## 4. Architecture

### `index.html`

One file. An inline `<svg class="sprite">` at the top defines 14 icon symbols
referenced via `<use href="#i-…">` — this is why there is exactly one copy of
each icon. JSON-LD `BarOrPub` schema sits in `<head>`.

Every translatable node carries `data-i18n="key"` (or `data-i18n-ph` for input
placeholders). **229 keys.**

### `assets/css/style.css`

One file, ~1500 lines, **written in appended layers** rather than refactored:
base tokens → components → v2 (real content) → brand assets → bot. Later blocks
deliberately override earlier ones; two early rules are stubbed with a comment
pointing at their final values further down. If you refactor, collapse the
duplicates rather than reordering blindly.

Palette is sampled from the logo: `--plum-500 #6B4B7C`, `--gold-400 #E8C766`,
night-time ground `--plum-900 #1B1026`. Type: Grenze Gotisch (display), Cinzel
(small-caps labels), Spectral (body).

### `assets/js/i18n.js`

One dictionary, no duplicated pages. English lives in the HTML; on load the
English markup is **snapshotted** so it needs no dictionary entry. Dutch is the
`NL` object. Choice persists in `localStorage`; first-time Dutch-locale visitors
get NL automatically. Fires `dd:langchange`, which `main.js` and `chatbot.js`
both listen to. `DD_I18N.t('key')` translates JS-generated strings.

### `assets/js/main.js`

Preloader, sticky nav, scroll progress, scroll-spy, mobile menu, IntersectionObserver
reveals, hero parallax, the canvas ember field, menu tabs (ARIA + arrow keys),
cursor-glow on cards, magnetic buttons, the d20 oracle, and the booking form.

### `assets/js/chatbot.js`

Self-contained help bot. No backend, no API key, no per-message cost. 24
knowledge-base entries, bilingual, scored keyword matching. Full explanation and
the LLM upgrade path are in `README.md`.

---

## 5. Traps

Things that already broke once, or that will break if you edit carelessly.

**CSS animations beat inline `transform`.** The hero parallax originally set
`el.style.transform` on an element that also had a float animation — the
animation silently won. Fixed by writing a `--py` custom property that the
keyframes consume. Do not "simplify" that back into a transform.

**`<use>` has a shadow DOM.** External CSS cannot reach paths inside a `<symbol>`.
An early wing-flap animation targeting `.wing--near` was dead code. Only
inherited properties (`color`, `fill`) cross the boundary — which is why the
icons use `currentColor`.

**The chatbot matcher needs its spaces.** Patterns are matched *with* their
surrounding spaces. Without them `art` matches inside `parties`, and "do you do
private parties" gets answered with Drink & Draw. The padding is the word
boundary.

**`node --check` is not enough.** A patch once stripped the quotes from
`'NFD'`, leaving a bare identifier. Syntactically valid, `ReferenceError` on the
first message. The bot has a runnable test harness — use it after editing the
knowledge base.

**A long e-mail overflows a flex child.** `overflow-wrap` alone does not work;
a flex/grid child will not shrink below its content width without `min-width:0`.
Both are applied to `.contact-lines a` and `.footer__mail`.

**Do not float decoration into the bottom-right corner.** A book-spine ornament
at `position:absolute; right:0` collided with the chat launcher and looked
broken. It was removed.

**Portrait photos as `background-size: cover` on a wide section** get cropped
hard and read as abstract shapes. The menu backdrop is held at `.13` opacity for
exactly this reason.

**Heredocs mangle this content.** Writing these files through shell heredocs
failed repeatedly on the quoting. Use the file-write tools, or write to a temp
file and concatenate.

---

## 6. Not done yet

| Item | Where | Note |
|---|---|---|
| **Confirm the opening hours** | 4 places, §2 above | Highest priority |
| **Confirm the address** | `#visit`, footer, JSON-LD, bot | Weerd 13 assumed |
| Booking form does not send | `main.js` submit handler | Validates for real; send is faked. Formspree snippet in README |
| 8 bot topics unanswered | `chatbot.js`, `unknown:true` | parking · wifi · pets · card payment · accessibility · age · smoking · toilets |
| Calendar is hard-coded | `#calendar` | September 2026. Update `<li>` rows monthly |
| `potions-book-spine.jpg` unused | `assets/img/` | 351 KB, not referenced. Delete, or place it inside the Secret Cocktails card |
| No canonical URL / OG absolute URLs | `<head>` | Set when the domain exists |
| Not deployed | — | Static: Netlify, Vercel or GitHub Pages, drag-and-drop |

---

## 7. Recipes

**Change a price** — `index.html` only. Prices are plain text; the `€` comes from
CSS `::before`. If the item is also named in `chatbot.js`, change it there too.

**Add a menu item** — copy a `.spell` (signature cocktails), `.mini` (familiar
cocktails) or `<li>` (ledger). Give any new visible text a `data-i18n` key and add
the Dutch string to `NL` in `i18n.js`.

**Add a translatable string** — `data-i18n="some.key"` on the element, then
`'some.key': '…'` in the `NL` object. English needs no entry.

**Add a bot answer** — see README. Then run the test harness.

**Update the month's events** — replace the `<li>` rows in `#calendar` and the
`events.month` key in both languages.

**Swap a photo** — same filename, same folder, hard-refresh. Framing is per-image
in CSS (`object-position` for the portraits, `background-position` for the
backdrops).
