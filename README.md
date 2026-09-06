# The Drunken Dragon — website

Static site for **The Drunken Dragon**, the fantasy tavern in Leeuwarden.
No build step, no dependencies, no framework. Open `index.html` and it runs.

```
the-drunken-dragon/
├── index.html          ← the whole site (single page, anchor nav)
├── HANDOFF.md          ← how it was built, provenance, traps ⚠️ start here
├── CONTENT.md          ← real menu/events/people data + disputed facts
├── README.md
└── assets/
    ├── css/style.css
    ├── js/
    │   ├── i18n.js     ← EN/NL dictionary + switcher
    │   ├── main.js     ← embers, tabs, d20 oracle, form, reveals
    │   └── chatbot.js  ← "Ask the Tavern Keeper" help bot
    └── img/            ← logo.png + the tavern's own photographs
```

## Run it

```bash
python -m http.server 8000    # then open http://localhost:8000
```

Or double-click `index.html` — everything is relative, `file://` works too.

---

## Images

All of these are the tavern's own material — the official logo and their own
photographs. Nothing here is drawn, stock, or generated.

| File | What it is | Where it appears |
|---|---|---|
| `logo.png` | The official lockup | Header, preloader, footer, hero crest, Private Events, favicon |
| `hero-tree.jpg` | The lit blossom tree | Hero background |
| `potions-book.jpg` | Potions Book cover | Menu section backdrop, held at `.13` opacity |
| `founders.png` | The four of them outside the bar | About section |
| `kevin.jpg` `hester.jpg` `luanna.png` `mark.jpg` | The founders | Round portraits in Meet the Founders |
| `potions-book-spine.jpg` | Gold spine close-up | **unused** — see HANDOFF §6 |

**To swap one:** keep the filename, drop the new file in, hard-refresh. Framing is
set per image in CSS — `object-position` for the portraits, `background-position`
for the backdrops — so a differently-cropped replacement may need one line adjusted.

---

## EN / NL translation

`assets/js/i18n.js` holds **one dictionary for the whole site** — no duplicated pages.

- The HTML is authored in English. Each translatable node carries `data-i18n="key"`
  (or `data-i18n-ph="key"` for an input placeholder).
- On load the English markup is snapshotted, so English needs no dictionary entry.
- The choice is saved to `localStorage`. First-time Dutch-locale visitors get NL.
- Coverage is currently **229 keys, 100 % translated**.

**To add a string:** put `data-i18n="some.key"` on the element, add `'some.key'` to
the `NL` object. That is the entire workflow.

Dictionary values may contain markup (`<br>`, `<b>`, `<span class="foil">`) because
they are authored in that file and never come from user input.

For a string generated in JavaScript, call `DD_I18N.t('key')` — see how `main.js`
does it for the dice results and form messages.

---

## Design — "Tavern Grimoire"

| Token | Value | Source |
|---|---|---|
| `--plum-500` | `#6B4B7C` | the purple of the logo (real ground sampled at `#473A54`) |
| `--gold-400` | `#E8C766` | the gold of the dragon |
| `--plum-900` | `#1B1026` | night-time version of the brand purple |

Type: **Grenze Gotisch** (display) · **Cinzel** (small-caps labels) · **Spectral** (body).
Dark by design — it is a tavern, at night.

### Signature moves
- Canvas ember field drifting through the hero, paused when off-screen.
- Foil-sweep gradient across the gold headline words.
- Signature cocktails laid out as **D&D spell cards**.
- A working **d20 oracle** whose twenty results are all real items off the menu,
  and which follows the EN/NL switch.
- Cursor-tracking glow on the drink cards, magnetic CTAs, grain overlay,
  scroll progress, scroll-spy nav.

### Accessibility
Skip link, visible focus rings, ARIA tabs with arrow-key navigation, `aria-live` on
the dice result and form status, `aria-pressed` on the language buttons, and a full
`prefers-reduced-motion` path that disables every animation. Readable with JS off.

---

## Still to wire up

**The booking form** validates for real but fakes the send. Point it at your
endpoint — in the submit handler of `main.js`, replace the `setTimeout` block:

```js
fetch('https://formspree.io/f/YOUR_ID', {
  method: 'POST',
  body: new FormData(form),
  headers: { Accept: 'application/json' }
})
  .then(function () { status.textContent = t('form.sent'); form.reset(); })
  .catch(function () { status.textContent = t('form.error'); });
```

If reservations already go through another system, delete the form and point the
"Reserve" buttons at that link instead.

**The events calendar** is hard-coded for September 2026 in `#calendar`. Update the
`<li>` rows each month, or move the list into a small JSON file if it becomes a chore.

**Facts to confirm** — address, opening hours and the e-mail all had conflicting
sources. See the table at the top of `CONTENT.md`.

---

## "Ask the Tavern Keeper" — the help bot

`assets/js/chatbot.js` is a self-contained support bot. **No backend, no API key,
no cost per message, works offline.** It answers from a hand-written knowledge
base built out of this site's own content, in English and Dutch, and follows the
EN/NL switch automatically.

### How it decides what to answer

Each knowledge-base entry has trigger words in both languages. The visitor's
question is normalised (lowercased, accents stripped, punctuation removed,
padded with spaces) and scored against every entry — a multi-word phrase is worth
3.2, a single word 1.4. Highest score above the threshold wins.

Two details that matter and are easy to break if you edit this:

- **Patterns are matched with their surrounding spaces.** Without them, `art`
  matches inside `parties` and "do you do private parties" gets answered with
  Drink & Draw. The padding is the word boundary.
- A crude de-pluraliser runs a second pass, so `mugs` still finds `mug`.

Triggers from *both* languages are checked on every question, so a Dutch guest
typing an English drink name still gets an answer.

### Adding an answer

```js
{
  id: 'parking',
  p: { en: ['parking', 'where do i park'], nl: ['parkeren', 'waar kan ik parkeren'] },
  a: { en: 'The nearest garage is …', nl: 'De dichtstbijzijnde garage is …' }
}
```

Answers may contain links and `<b>`, because they are authored in that file and
never come from user input.

### ⚠️ Questions guests ask that you have not answered yet

There is one entry flagged `unknown: true`. It recognises these topics and
honestly says *"I don't know, ask us on Instagram"* rather than inventing
something about a real business:

**parking · wifi · dogs and pets · card or cash payment · wheelchair access ·
minimum age / children · smoking · toilets**

These are among the most-asked questions a bar gets. Give me the real answers and
each becomes a proper entry — until then the bot hands off to a human, which is
the correct behaviour but a missed opportunity.

### If you want a real LLM instead

The rule-based bot handles the common questions perfectly and costs nothing. An
LLM would handle *anything*, including questions you never anticipated. That
needs two things:

**1. Never put an API key in the front-end.** Anyone can open DevTools and read
it, and the bill is yours. A key in `chatbot.js` is a key that is already stolen.

**2. Put a tiny serverless function in between.** Vercel, Netlify or Cloudflare
Workers all have a free tier that covers a bar's traffic:

```js
// api/ask.js  — the key lives in the host's environment, never in the browser
export default async function handler(req, res) {
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 400,
      system: TAVERN_FACTS,   // paste CONTENT.md in here
      messages: [{ role: 'user', content: req.body.question }]
    })
  });
  res.json(await r.json());
}
```

Then in `chatbot.js`, replace the `answer()` call in `ask()` with a `fetch` to
`/api/ask`. Keep the knowledge base as the offline fallback for when the network
or the API is down — a bot that says nothing is worse than a bot that says the
opening hours.

Put `CONTENT.md` in the system prompt and tell the model to say "I don't know,
ask on Instagram" rather than guess. Haiku is the right model here: it is fast,
cheap, and this is not a hard reasoning task.
