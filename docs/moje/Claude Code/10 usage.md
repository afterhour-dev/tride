
Evo šta `/usage` radi, i par nijansi bitnih baš za tvoj OpenRouter setup.

## Šta prikazuje

`/usage` (aliasi: `/cost`, `/stats`) pokazuje trošak sesije, limite plana i statistiku aktivnosti. Na Pro, Max, Team ili Enterprise planu, uključuje i **raspodelu po skill-u, sub-agentu, plugin-u i MCP serveru** — dakle možeš tačno da vidiš koliko ti je npr. `docs-writer` sub-agent pojeo u odnosu na glavni razgovor.

`/stats` otvara isti prozor ali na Stats tabu specifično.

## Bitna razlika: subscription vs API

Ovde ima praktičnog konflikta u zajednici (video sam par blogova koji se protive) — najverovatnije objašnjenje:

- Na **Pro/Max** (subscription) — vidiš session trošak i procenat iskorišćenih limita (5-časovni rolling prozor + nedeljni cap, deljen između Claude.ai i Claude Code)
- Na **API pay-as-you-go** — vidiš token potrošnju i procenjeni dolarski trošak

## Za tvoj OpenRouter setup — ovo je ključno

Pošto ti koristiš `ANTHROPIC_BASE_URL` preusmeren na OpenRouter (sa `ANTHROPIC_API_KEY` praznim), `/usage` verovatno **neće davati tačnu sliku** — jer ta komanda komunicira sa Anthropic-ovim Console/billing sistemom da izvuče podatke o trošku, a ti tehnički ne prolaziš kroz taj billing put. Isto važi i za tvoju listu poznatih ograničenja (bez `/advisor`, `/effort` itd.) — `/usage` bi mogao da spada u istu kategoriju "radi ali prikazuje pogrešne/prazne podatke" ili jednostavno ne radi.

Za tebe realnije rešenje:

- **OpenRouter dashboard** (openrouter.ai/activity) — tačan izvor istine za tvoju potrošnju, po modelu, po ključu
- `/context` — i dalje bi trebalo da radi lokalno jer samo vizualizuje trenutni kontekst prozor, ne zove Anthropic billing
- Lokalni JSONL logovi u `~/.claude/projects/` — Claude Code piše ove fajlove bez obzira na provajdera, pa alati poput `ccusage` mogu da ih čitaju lokalno (iako će cene koje `ccusage` prikazuje biti Anthropic API cene, ne OpenRouter cene za Qwen3-Coder-Next/DeepSeek)

Ako želiš, mogu ti pomoći da napraviš mali skript koji čita te JSONL fajlove i mapira token brojeve na tvoje stvarne OpenRouter cene — bilo bi tačnije od bilo koje ugrađene komande u tvom slučaju.