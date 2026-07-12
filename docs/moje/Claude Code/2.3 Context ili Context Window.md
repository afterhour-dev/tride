Znas kako se gleda context

```
/context
```

Ali postoje jos dve vazne komande

```bash
# potpuno brisanje
/clear

# pravi sazetak dosadasnjeg razgovora
/compact

```

Ali koje su najbolje prakse?

Ево прегледа, plus konkretan primer prilagođen tvom `polygon-lab` workflow-u.

**Dve glavne komande, i suštinska razlika:**

- **`/compact`** — sažima dosadašnji razgovor u kraći rezime i nastavlja sesiju. Zadržava kontinuitet (arhitekturne odluke, koje fajlove ste dirali, šta je rešeno).
- **`/clear`** — potpuno briše istoriju, čist start. Brže i čistije, ali gubiš sve.

Zvanični stav Claude Code tima je iznenađujuće jasan: _"default to clear, reach for compact when continuity matters"_ — dakle `/clear` treba da bude podrazumevani izbor, a `/compact` rezerviši za slučajeve gde ti stvarno treba da se sećanje prenese.

**Kada koristiti šta — praktično pravilo:**

|Situacija|Komanda|
|---|---|
|Prelaziš na potpuno drugačiji zadatak (npr. sa Three.js na Blender pipeline)|`/clear`|
|Model je dva puta pogrešno protumačio zadatak i "zaglavio se" u pogrešnom pristupu|`/clear` + oštriji prompt koji uključuje ono što si naučio|
|Završio si jednu smislenu celinu (npr. jedno poglavlje workshop-a) i krećeš na sledeće u istom projektu|`/compact`|
|Debagovanje je uspelo, a neuspeli pokušaji sada samo zauzimaju prostor|`/compact` (odmah nakon uspeha, ne čekaj)|
|Nisi siguran šta je bitno da se sačuva|`/compact fokusiraj na [x]` — daš mu hint šta prioritetno da čuva|

**Vremenski/kapacitetski heuristik:** posmatraj indikator utilizacije konteksta (donji desni ugao terminala). Interveniši oko **60-70%** — ne čekaj do 80-90% kad se auto-compact sam pokrene, jer se to dešava kad je model već u degradiranom stanju, pa je sažimanje lošijeg kvaliteta. Ručno pokrenut `/compact` dok još ima prostora daje čistiji rezime.

**Bitna stavka baš za tvoj OpenRouter setup:** `/compact` se naplaćuje po **punoj ceni** trenutnog konteksta u tom pozivu — kod native Claude modela postoji prompt caching koji to ublažava, ali kao što smo utvrdili, tvoj setup (Qwen/DeepSeek preko OpenRoutera) **nema tu pogodnost uopšte**. To znači da za tebe konkretno `/compact` nije "besplatna" operacija — svaki put plaćaš pun ulazni kontekst da bi ga sažeo. Sa $8 kredita, ovo je argument da kod tebe **`/clear` treba da bude još dominantniji izbor** nego što bi bio za nekog sa Claude Max pretplatom, i da se oslanjaš na `CLAUDE.md` da nosi trajno znanje umesto na `/compact` rezimee.

**Konkretan primer za `polygon-lab`:**

Zamisli da radiš na Three.js poglavlju o shader-ima, u `packages/chapter-05-shaders`:

```
1. claude                                    # nova sesija, CLAUDE.md se učitava automatski
2. [radiš na shader-u, 40ak minuta, par grešaka usput]
3. Uspeo si da rešiš problem sa uniformama
   → /compact fokusiraj na rešenje uniform problema i finalnu shader strukturu
4. Nastavljaš na sledeći deo istog poglavlja (kontinuitet je bitan)
5. Poglavlje je gotovo, generisao si markdown dokumentaciju
6. Sledeći zadatak: prelaziš na chapter-06 (potpuno drugačija tema)
   → /clear
7. Nova sesija kreće čisto, ali CLAUDE.md (koji nosi tvoja pravila o monorepo strukturi,
   pnpm workflow, itd.) se i dalje automatski učitava — ne moraš ponovo da objašnjavaš setup
```


# Evo kakav data daje /context

```bash
❯ /context 
  ⎿  Context Usage
     ⛁ ⛁ ⛁ ⛁ ⛁ ⛁ ⛁ ⛁ ⛁ ⛁   qwen/qwen3-coder-next
     ⛁ ⛀ ⛁ ⛀ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶   24.6k/200k tokens (12%)
     ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ 
     ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶   Estimated usage by category
     ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶   ⛁ System prompt: 1.6k tokens (0.8%)
     ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶   ⛁ System tools: 20.5k tokens (10.3%)
     ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶   ⛁ Memory files: 475 tokens (0.2%)
     ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶   ⛁ Skills: 1.9k tokens (1.0%)
     ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶   ⛁ Messages: 9 tokens (0.0%)
     ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶   ⛶ Free space: 175.4k (87.7%)

     Memory files · /memory
     └ CLAUDE.md: 475 tokens

     Skills · /skills

     Built-in
     ├ dataviz: ~380 tokens
     ├ claude-api: ~360 tokens
     ├ update-config: ~240 tokens
     ├ deep-research: ~160 tokens
     ├ verify: ~150 tokens
     ├ run: ~120 tokens
     ├ code-review: ~120 tokens
     ├ loop: ~110 tokens
     ├ keybindings-help: ~80 tokens
     ├ fewer-permission-prompts: ~60 tokens
     ├ simplify: ~60 tokens
     ├ security-review: ~30 tokens
     ├ review: ~30 tokens
     └ init: ~20 tokens
```

Ево анализе, детаљ по детаљ:

**1. Sesija je izuzetno zdrava.** 24.6k od 200k (12%) — praktično prazan kontekst. Vrednost `Messages: 9 tokens` potvrđuje da si tek pokrenuo `/context`, nisi ni napisao ništa suštinsko.

**2. Najveći "trošak" pre nego što si i kucnuo prst — sistemski alati (20.5k, 10.3%).** Ovo je fiksni baseline koji se učitava na start svake sesije, nezavisno od toga šta radiš — definicije svih built-in alata (Bash, Edit, Write, Grep, itd.) koje Claude Code mora da zna da postoje. Zanimljivo je da je ovo **veće od tvog CLAUDE.md-a i cele konverzacije zajedno** — dobar podsetnik da čak i "prazna" sesija nosi realan fiksni trošak.

**3. Skills bucket (1.9k tokens za 14 skill-ova) potvrđuje ono što smo ranije pominjali** — "Skills load only when invoked" doslovno znači da ovde vidiš samo **rutирajuće opise** (kratki triggeri, tipa "koristi ovo kada..."), a ne pune SKILL.md fajlove. Zato je 14 skill-ova ukupno samo ~1.9k tokena — puni sadržaj svakog se učitava tek kad se konkretan skill aktivira.

**4. Lista skill-ova je i indirektna potvrda onoga o čemu smo pričali za `/advisor`** — u ovoj listi (dataviz, claude-api, update-config, deep-research, verify, run, code-review, loop, keybindings-help, fewer-permission-prompts, simplify, security-review, review, init) **`/advisor` se uopšte ne pojavljuje**. To je opipljiv dokaz da ti taj skill/command stvarno nije dostupan u tvom okruženju, ne samo da se ne prikazuje slučajno.

**5. CLAUDE.md je vrlo lagan — 475 tokena.** Za tvoj monorepo sa više poglavlja, to je prilično minimalan otisak; ima prostora da dodaš više trajnih pravila (build komande, konvencije po chapteru) bez značajnog uticaja na budžet.

**6. Nešto što vredi proveriti — prozor je prikazan kao 200k, ne 262k.** Qwen3-Coder-Next zvanično ima native context window od 262,144 tokena (256k) na OpenRouter-u. Claude Code ovde prikazuje 200k, što je verovatno **konzervativna, generička pretpostavka** koju Claude Code koristi za modele koje ne prepoznaje kao svoje (native Anthropic modele), a ne stvarno očitavanje pravog kapaciteta modela od OpenRoutera. Praktično to znači: ili imaš malo više realnog prostora nego što interfejs prikazuje, ili — obrnuto i rizičnije — Claude Code može da pokuša da isprati pun 262k kontekst dok on-screen brojka kaže da si na 100%, što bi moglo da izazove grešku ako se stvarno približiš granici. Ne bih se previše oslanjao na tačnost te brojke pri velikim, dugim sesijama — vredi ranije da uradiš `/compact` nego što bi to uradio sa native Claude modelom gde je brojka pouzdana.

**7. Nema MCP tool definicija u prikazu** — znači da nemaš povezane MCP servere na ovom projektu, što je dobro za budžet (ti definicije mogu da pojedu značajan deo prostora ako ih ima puno).

Ukratko — ovo je uzoran, čist `/context` snapshot. Jedina stvar koju bih zapamtio na duže staze je tačka 6: ne veruj 200k brojci kao apsolutnoj istini za ovaj model, i budi malo konzervativniji sa `/compact` timing-om nego što bi bio sa native Sonnet/Opus modelom.