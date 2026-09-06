# The Drunken Dragon — real content (source of truth)

Everything below was read off the screenshots of the previous site + the September
calendar + the conversation transcript. **Corrija o que estiver errado aqui** — o
`index.html` foi montado a partir deste arquivo.

---

## ⚠️ Conflitos que preciso que você resolva

### 1. Endereço — DOIS endereços diferentes
| Fonte | Endereço |
|---|---|
| Rodapé do site anterior | **Dragonstraat 1, 8911 AB Leeuwarden** |
| Imprensa (Headliner/LC) + bio do Instagram | **Weerd 13, Leeuwarden** (esquina com Bagijnestraat) |

"Dragonstraat" (rua do Dragão) é temático demais para ser coincidência — parece
placeholder inventado na sessão anterior. **Usei Weerd 13.** Se o endereço real for
outro, troque em `index.html` (3 lugares) e no JSON-LD.

### 2. Horários — o rodapé contradiz o calendário
| Fonte | Horário |
|---|---|
| Rodapé do site anterior | Mon–Thu 5pm–1am · Fri–Sat 5pm–3am · Sun 3pm–midnight |
| Calendário de setembro | Segunda e terça **sempre marcadas com X** = fechado |

O calendário é uma peça real de marketing de vocês, então dei precedência a ele:
**Wed–Thu 17:00–01:00 · Fri–Sat 17:00–03:00 · Sun 15:00–00:00 · Mon–Tue fechado.**
Se abre segunda e terça, é só ajustar a tabela em `#visit`.

### 3. E-mail
Site anterior mostrava `info@thedrunkendragon.nl`, mas a transcrição (mais recente)
usa **`drunkendragonleeuwarden@gmail.com`** — foi esse que usei.

---

## Identidade

- **Nome:** The Drunken Dragon
- **Tagline:** Where Legends Are Born
- **Descrição curta:** A medieval fantasy tavern filled with magic, mystery and unforgettable cocktails.
- **Descrição rodapé:** Where legends are born. A medieval fantasy tavern in the heart of the Netherlands.
- **Fundado:** 2026 · Leeuwarden
- **Instagram:** @_the_drunken_dragon_

## Os fundadores (4)

| Nome | Classe | Papel |
|---|---|---|
| Kevin | The Mage | Contratos, parcerias, o lado que faz a máquina girar |
| Hester | The Bard | Eventos e experiências — noites temáticas, celebrações |
| Luanna | The Druid | Cozinha e comunidade — os snacks são dela |
| Mark | The Ranger | Operação — bar abastecido, tudo funcionando antes de abrir |

## Creed — What We Stand For
1. **Radical Inclusion** — every class, every race, every background is welcome.
2. **Community First** — a home base for your party, your guild, your people.
3. **Magic in Everything** — the fantasy never stops at the door.
4. **Stories Worth Telling** — come in as strangers, leave as legends.

---

## MENU

### Cocktail Specials (assinatura)
| Drink | Perfil | € |
|---|---|---|
| Witte Wief | Creamy & Indulgent | 11.50 |
| Mushrooms | Playful & Surprising | 14.50 |
| The Alchemist | Unpredictable (interactive) | 13.50 |
| The Rose | Floral & Delicate | 9.50 |
| Check-Mate | Herbal & Refreshing | 10.50 |
| The Elixir | Zesty & Refreshing | 9.50 |
| Black Cape | Honeyed & Intense | 12.50 |

> There are secret cocktails. Ask your bartender what they are.

### Familiar Cocktails
*"Cocktails you already know, but with a magical twist… Can you guess their original names?"*

| Drink | Perfil | € |
|---|---|---|
| Forbidden Fruit | Tropical & Velvety | 10 |
| The Bad Dragon | Fruity & Refreshing | 10.50 |
| Forest Breeze | Minty & Refreshing | 9.50 |
| Haste | Bold & Coffey | 10.50 |
| Critical Hit | Strong & Citrusy | 10.50 |
| Pirate's Paradise | Creamy & Tropical | 10.50 |
| The Phoenix | Bitter & Sparkling | 9.50 |
| Elven Summerwine | Sweet & Citrusy | 9.50 |
| Frostbolt | Tangy & Vibrant | 10.50 |
| Horizon | Tropical & Nutty | 11.50 |
| Crimson Desire | Fruity & Bittersweet | 10.50 |
| Mermaid's Tear | Sweet & Citrusy | 9.50 |

### Frituur
| Item | Descrição | € |
|---|---|---|
| Beholder Eyes | Bitterballen. Vegetarian option available | 7 |
| Mindflayers | Mini frikandellen | 6 |
| Chicken Bites | Chicken, but bitesize | 7 |
| Tiamat's Nest | Brazilian chicken croquettes (coxinhas) | 9.50 |
| Veggie Flames | Crispy outside, hot inside. Vegan | 8 |
| Stormwind Fries | Regular fries. Loaded +2. Vegan | 4 |
| Mozzy Sticks | Mozzarella sticks | 8 |

**Sharing Boards:** The Raid €13.95 · The Fellowship €18 · The Hoard €29

### Other Snacks (Druid's Kitchen)
Warlord's Drumsticks €9.50 · Daily Bread €7.50 · Nacho Cheese €8.95 (bacon +3) ·
Borrel Platter €12 · Frisian Platter €14 · Lava Cookie €3.50

### Happy Hour — 10:00 to 20:00
Beer + fries €9.50 · Beer + bitterballen €9.95 · Beer + loaded fries/nachos €10.95 ·
Beer + coxinhas €12.50 · Pitcher + The Hoard board €37.50

### "Normal" Drinks
- **Sodas** €3.25–4.50 (Coca Cola, Zero, Fuze Tea, Sprite, Fanta, Cassis, Rivella, Royal Bliss Tonic/Ginger Ale/Bitter Lemon/Ginger Beer, Guaraná Antarctica €4.50)
- **Wines** €4.75 (droge wit, zoete wit, rood, rosé)
- **Mead** €5.50 · Cherry Mead €6 — *our personal favourite*
- **Beers** Hertog Jan 3.25/5.75 · Leffe Blond 4.25/6.95 · Franziskaner 4/6.75 · Goose Island 5.75/7.25
- **Locally brewed** Grutte Pier Lentebier 4.75 · Blond 4.50 · BOCK 4.75 · Frysk bier It Wetter 5.50 · Corona 4.75 · Corona Zero 4.50 · Radler 4.25 · Radler 0.0 4 · Hertog Jan 0.0 3.95

---

## EVENTOS

### Programação fixa
- **Boardgame Night** — toda quarta
- **Drink & Draw** — quinta, quinzenal
- **D&D Event** — domingo, quinzenal

### Setembro 2026 (do calendário)
| Data | Evento |
|---|---|
| Wed 2, 9, 16, 23, 30 | Boardgame night |
| Thu 3, 17 | Drink & Draw |
| Sun 6, 20 | D&D event |
| Thu 10 | Drunken Dragon Fantasy Pubquiz |
| Fri 18 | Karaoke w/ Oliver |
| Thu 24 | Mead tasting |
| Fri 25 | Quiz Time w/ Ellen van Ellende |
| Sat 26 | Bonus Karaoke |
| Sun 27 | Furry Fusion Munch |

> Mon/Tue marcados com X o mês inteiro.

---

## MERCH (The Treasury)
- Dragon Crest T-Shirt — €29.95
- Tavern Drinking Mug — €24.95
- Dragon's Reserve Pack — €39.95 (tasting pack com 3 cocktails da casa)

## RESERVA
- Tolerância de atraso: **20 minutos**

---

## IMAGENS — precisam ser salvas em `assets/img/`

Não consigo salvar imagens que chegam pelo chat como arquivo. Salve cada uma com
**exatamente** estes nomes e o site as usa automaticamente:

| Arquivo | Qual foto | Onde aparece |
|---|---|---|
| `hero-tree.jpg` | A árvore iluminada vermelha/rosa | Fundo do hero *(você pediu)* |
| `potions-book.jpg` | Capa do Potions Book (vermelho, com bokeh) | Fundo da seção Menu *(você pediu)* |
| `potions-book-spine.jpg` | Lombada dourada em closeup | Lateral decorativa do Menu |
| `founders.jpg` | Os 4 fundadores na frente do bar | Seção About |
| `logo.png` | Logo oficial em alta | Substitui o SVG que desenhei |

Enquanto os arquivos não existirem, o site cai num gradiente — **não quebra**, só
fica sem foto.
