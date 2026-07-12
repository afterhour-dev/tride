![[Screenshot From 2026-07-11 09-42-11.png]]

## Šta su skill-ovi

Skill je folder sa uputstvima (SKILL.md fajl), skriptama i resursima koji Claude Code učitava kada je relevantan za zadatak. Prate **Agent Skills** otvoreni standard, koji radi kroz više AI alata (ne samo Claude). Claude Code proširuje standard dodatnim mogućnostima kao što su kontrola invokacije, izvršavanje kroz subagente i dinamičko ubacivanje konteksta.

## Kako se prave

Fajl ide u `~/.claude/skills/ime-skilla/SKILL.md` (lično), `.claude/skills/` u projektu, ili preko plugin marketplace-a. Ime foldera postaje komanda koju kucaš, a `description` polje u frontmatter-u pomaže Claude-u da automatski zaključi kada da učita skill.

Primer strukture:

```markdown
---
description: Sumira necommit-ovane promene i upozorava na rizike. Koristi se kad korisnik pita šta se promenilo ili traži commit poruku.
---
## Trenutne izmene
!`git diff HEAD`
## Uputstvo
...
```

Zanimljivo — `!` sintaksa omogućava **dinamičko ubacivanje konteksta**: Claude Code sam izvrši komandu (npr. `git diff HEAD`) i zameni tu liniju rezultatom pre nego što Claude uopšte vidi sadržaj skilla.

## Nivoi i prioritet

Kad se imena poklapaju: enterprise > lični > projektni nivo, a svaki od njih ima prednost nad bundled (ugrađenim) skillom istog imena. Plugin skill-ovi koriste `plugin-name:skill-name` namespace pa se ne sudaraju. Takođe — skill-ovi se učitavaju i iz ugnežđenih `.claude/skills/` direktorijuma ispod tvog radnog direktorijuma, tako da paket u monorepo-u može imati sopstvene skillove koji važe samo dok radiš u tom paketu, čak i ako je sesija počela iz root-a repozitorijuma. Ovo bi ti moglo biti korisno za `polygon-lab` monorepo — svaki workspace paket bi mogao imati svoj skill.

## Budžet za listing

Ako imaš puno skillova, Claude Code skraćuje opise da bi stali u budžet (1% context window-a modela). Kad se pređe budžet, prvo se skraćuju opisi skillova koje najređe koristiš. `/doctor` daje procenu koliko listing skillova košta kontekst, a `/context` prikazuje realnu veličinu.

## Bundle-ovani skillovi

Anthropic isporučuje gotove skillove (npr. `document-skills` plugin sa docx/pptx/xlsx/pdf), koje instaliraš preko marketplace-a:

```
/plugin install document-skills@anthropic-agent-skills
```

Pošto koristiš OpenRouter setup sa Qwen3-Coder-Next umesto direktne Anthropic auth — vredi proveriti da li ti bundled/marketplace skillovi rade normalno preko tog rutiranja, s obzirom da si već imao ograničenja tipa `/advisor` i `/effort` koji ne rade preko OpenRoutera.

Ako želiš, mogu ti pomoći da napraviš custom skill za `polygon-lab` (npr. za Three.js konvencije koje koristiš, ili za dokumentaciju lekcija koju Claude Code generiše po poglavljima).



**Шта је skill у суштини**
Skill = folder sa `SKILL.md` fajlom koji pretvara ponavljajući workflow u komandu koju Claude ili sam prepoznaje kad je relevantna, ili je ti eksplicitno pozivaš sa `/ime-skilla`. Zamisli ga kao kuvar na polici — ne pamtiš svaki recept napamet, već ga izvučeš kad ti zatreba.

**Progressive disclosure — zašto tvoj `/context` prikaz ima smisla**

```
/context
```

❯ /context 
  ⎿  Context Usage
     ⛁ ⛁ ⛁ ⛁ ⛁ ⛁ ⛁ ⛁ ⛁ ⛁   qwen/qwen3-coder-next
     ⛁ ⛀ ⛁ ⛀ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶   24.8k/200k tokens (12%)
     ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶
     ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶   Estimated usage by category
     ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶   ⛁ System prompt: 1.6k tokens (0.8%)
     ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶   ⛁ System tools: 20.5k tokens (10.3%)
     ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶   ⛁ Memory files: 658 tokens (0.3%)
     ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶   ⛁ Skills: 1.9k tokens (1.0%)
     ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶   ⛁ Messages: 9 tokens (0.0%)
     ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶   ⛶ Free space: 175.2k (87.6%)

     Memory files · /memory
     └ CLAUDE.md: 658 tokens

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

Pogledaj koji podaci su izlistani at the bottom.

Ovo objašnjava zašto si video da 14 skill-ova zauzima samo 1.9k tokena ukupno u tvom prethodnom `/context` pozivu:
1. **Nivo 1 (uvek učitano):** samo `description` polje iz YAML frontmatter-a — kratak opis koji Claude koristi da odluči da li je skill relevantan. To je ono što si video kao ~20-380 tokena po skill-u.
2. **Nivo 2 (učitava se tek kad se aktivira):** ceo sadržaj `SKILL.md` fajla ulazi u kontekst tek kada Claude proceni da mu treba.
3. **Nivo 3 (opciono):** ako skill referencira dodatne fajlove (npr. `REFERENCE.md`, skripte), Claude ih čita po potrebi preko bash-a — kod skripti se čak i sam kod skripte nikad ne učitava u kontekst, samo njen **output**.

**Skills i slash komande su sada isto**
Ranije su to bila dva odvojena sistema (`.claude/commands/*.md` i `.claude/skills/*/SKILL.md`), ali su spojeni. Fajl na bilo kojoj od te dve lokacije pravi identičan `/komanda` interfejs. Skills sistem je preporučeni pristup jer podržava dodatne stvari koje obična komanda ne može — prateće fajlove, kontrolu preko frontmatter-a (`disable-model-invocation`, `user-invocable`, `allowed-tools`), i dinamičko ubacivanje konteksta preko shell komandi.

**Gde žive (tri nivoa, po prioritetu)**
- `.claude/skills/` — projektni nivo, deli se sa timom preko git-a, **najviši prioritet**
- `~/.claude/skills/` — lični nivo, dostupno u svim tvojim projektima
- Plugin nivo — skill-ovi koji dolaze upakovani sa plugin-ima

Projektni skill sa istim imenom pregazi lični — korisno za override po projektu.

**Live reload — nema restart**
Ako izmeniš `SKILL.md` usred sesije, promena se odmah primenjuje. Dobro za iterativno doterivanje ("write, test, observe, refine" ciklus).

**Konkretan primer prilagođen tvom `polygon-lab` monorepo-u:**

```bash
mkdir -p ~/.claude/skills/three-chapter-docs
cat > ~/.claude/skills/three-chapter-docs/SKILL.md << 'EOF'
---
name: three-chapter-docs
description: Generiši markdown dokumentaciju za Three.js chapter u polygon-lab monorepo-u. Koristi kada je poglavlje završeno i treba dokumentacija za buduću referencu.
---
# Chapter dokumentacija

1. Pročitaj sve fajlove u trenutnom chapter package-u
2. Identifikuj ključne Three.js koncepte koji su korišćeni (OrbitControls, Clock/Timer, GSAP integracija, itd.)
3. Napiši markdown fajl `NOTES.md` u root-u tog chapter-a sa:
   - Kratkim opisom šta poglavlje pokriva
   - Objašnjenjem netrivijalnih delova koda
   - Linkovima ka zvaničnoj Three.js dokumentaciji gde je relevantno
4. Ne diraj postojeći kod, samo dokumentaciju
EOF
```

Nakon ovoga, `/three-chapter-docs` postaje dostupna komanda, i Claude će je i sam prepoznati i predložiti kada završiš rad na nekom poglavlju — tačno ono što si ranije pominjao da radiš ("Claude Code generating markdown documentation per lesson").

**Jedna praktična sitnica za kraj:** ako nakupiš puno custom skill-ova, postoji budžet za listing opisa (default 1% konteksta modela) — ako Claude počne da odseca opise, `/doctor` će te upozoriti, a limit se podešava preko `skillListingBudgetFraction` u settings.json.

## pokreni /relaod-skills ako si u sesiji a u medjuvremenu si definisao skill

nisam siguran da li koristim ovo ili `/reload-plugins`


# `disable-model-invocation` frontmatter prop

ako ovo podesis na true, sam model ce biti preventiran da pokrene tvoj skill, sem ako ti nisi eksplicitno pokrenuo ovaj skill

# `user-invocable` frontmatter-prop

ovo tebe preventira da pokrenes skill ali, claude code moze da pokrene skill ako za to postoji potreba


ova dva pomenuta frontmatter propertija ne trba da budu definisan zajedno, i sam vidis zasto. Ili je jedno ili drugo.

## `$ARGUMENTS`

`$ARGUMENTS` je placeholder koji koristiš unutar SKILL.md (ili starijeg `.claude/commands/*.md` formata) da uhvatiš tekst koji korisnik ukuca **posle** naziva komande.

```markdown
---
name: fix-issue
description: Fix a GitHub issue by number
---
Fix issue #$ARGUMENTS following our coding standards
```

Kad ukucaš:

```
/fix-issue 123
```

`$ARGUMENTS` se zameni sa `"123"`, i Claude Code dobija ceo prompt kao "Fix issue #123 following our coding standards".

## Bitno — ceo string, ne parsiran

`$ARGUMENTS` je **jedan string**, ne lista argumenata. Ako pošalješ `/fix-issue 123 high`, `$ARGUMENTS` postaje `"123 high"` u celini — Claude ga onda sam parsira po smislu iz teksta komande, ne po nekoj ugrađenoj logici.

Ako ti treba struktura, dve opcije:

1. **Pozicioni argumenti** — `$1`, `$2`, `$0` itd. (radi kao bash):

```markdown
Fix issue #$1 with priority $2.
```

```
/fix-issue 123 high
→ $1 = "123", $2 = "high"
```

2. **Neka Claude parsira** — napišeš uputstvo tipa "Tretiraj $ARGUMENTS kao listu putanja fajlova razdvojenih zarezom" i pustiš model da sam izvuče strukturu. Ovo je pouzdanije od pokušaja da izmišljaš sopstvenu sintaksu.

## Praktičan primer za `polygon-lab`

Recimo, skill za pokretanje testova u konkretnom workspace paketu:

```markdown
---
name: test-pkg
description: Run tests in a specific polygon-lab workspace package
argument-hint: [package-name] [test-pattern]
allowed-tools: Bash(pnpm *)
---
Run tests for package $1, matching pattern: $2
1. cd u packages/$1
2. pnpm test -- $2
3. Ako padnu testovi, analiziraj i predloži fix
```

```
/test-pkg three-demo shader
```

## Napomena za tvoj setup

`argument-hint` polje u frontmatter-u je čisto kozmetičko — prikazuje se korisniku kao podsetnik u pickeru, ne utiče na parsing. Kod modela rutiranih kroz OpenRouter (Qwen3-Coder-Next), samo parsiranje `$ARGUMENTS`/`$1`/`$2` radi na nivou CLI harnessa pre nego što tekst uopšte stigne modelu, tako da tu nema razlike u odnosu na nativni Claude — problem bi mogao nastati tek ako model treba _sam_ da protumači nestruktuirani `$ARGUMENTS` string na pametan način.


## Sintaksa: `!` + backtick-ovana komanda

Format je:

```markdown
!`komanda`
```

Znak `!` mora biti **na početku linije** (ili odmah posle whitespace-a) — ako je usred linije, npr. `KEY=!\`cmd``, tretira se kao običan tekst i **ne izvršava** se.

## Šta se dešava

Kad pozoveš skill, Claude Code **pre** nego što prompt uopšte stigne do modela:

1. Pronađe sve linije koje počinju sa `!` + backtick komandom
2. Izvrši tu bash komandu lokalno
3. Zameni celu liniju (uključujući `!` i backtick-ove) **izlazom** te komande
4. Tek taj konačni, već-popunjeni tekst šalje modelu

Bitno — model **nikad ne vidi samu komandu**, samo rezultat. To je čisto preprocessing na nivou CLI harnessa, ne nešto što model "poziva" tokom rada.

## Primer

```markdown
---
name: commit
description: Create a git commit with context
allowed-tools: Bash(git *)
---
## Kontekst
- Trenutni git status: !`git status`
- Trenutni diff: !`git diff HEAD`

## Zadatak
Napravi commit poruku na osnovu gornjih izmena.
```

Kad pokreneš `/commit`, linije sa `!git status` i `!git diff HEAD` se zamene stvarnim outputom tih komandi pre nego što Claude uopšte "vidi" prompt — kao da si ti ručno kucao/pejstovao izlaz `git status`-a u poruku.

## Za multi-line blokove

Ako ti treba veći blok bash izlaza (ne samo jedna linija), koristi fenced code block sa ` ```! ` umesto obične trostruke ograde.

## Bitne kvake koje treba da znaš

**1. `allowed-tools` je obavezan da izbegneš permission prompt.** Injection se dešava kao preprocessing korak, i taj korak i dalje prolazi kroz Bash permission sistem — treba ga eksplicitno dozvoliti u frontmatter-u (`allowed-tools: Bash(git *)`), inače ćeš dobijati potvrde svaki put.

**2. Poznat bug sa `!` unutar inline code backtick-ova u _dokumentaciji_.** Ako u svom SKILL.md-u _pišeš o_ ovoj sintaksi (kao demonstraciju, npr. u komentaru "koristi `!` sintaksu"), parser može pogrešno pokušati da izvrši taj tekst kao pravu bash komandu jer ne razlikuje uvek "ovo je primer u dokumentaciji" od "ovo je stvarna komanda". Ako praviš skill koji _objašnjava_ ovu sintaksu drugima (npr. meta-skill za tim), izbegavaj `!` unutar backtick-ova u prozi — opiši je opisno umesto da je citiraš doslovno.

**3. Podpoznata razlika naspram `command` polja u `hooks`.** Ovo je za jednokratno ubacivanje konteksta u sam prompt, dok su hooks (`PreToolUse`, itd.) za validaciju/blokiranje akcija — različit mehanizam, nemoj ih mešati.

## Za `polygon-lab`

Ovo bi ti bilo korisno npr. za skill koji pre svakog build-a automatski ubaci trenutni pnpm workspace status:

```markdown
## Kontekst
- Workspace paketi: !`pnpm ls -r --depth -1`
- Poslednji commit: !`git log -1 --oneline`
```

Tako Claude uvek vidi svež snapshot monorepo strukture bez da mu ti ručno kucaš to svaki put.

## `when_to_use`

Opciono polje u frontmatter-u koje služi kao **prošireno uputstvo za triggerovanje** — dopunjuje `description` detaljnijim pravilima o tome kada da se skill aktivira.

## Zašto postoji odvojeno od `description`

`description` je glavno polje koje agent koristi da odluči da li je skill relevantan, i obično je jedna do dve rečenice. `when_to_use` ti daje prostor da to razložiš na **listu konkretnih uslova** — kad da se pokrene, kojim frazama, i (bitno) kad **ne** treba da se pokrene:

```yaml
---
name: code-reviewer
description: Reviews code for bugs, security issues, and style violations.
when_to_use: |
  - User asks to review code, check for bugs, or audit a file
  - User opens a PR and asks for feedback
  - User says "review", "check", "audit", or "find issues"
  - Do NOT use for: formatting, linting, or style-only checks
---
```

## Podrška po alatima

Podržano je u Claude Code-u, kao i u OpenClaw i Codex CLI. Drugi agenti koji ga ne prepoznaju ga jednostavno ignorišu — ne izaziva grešku, samo se ne koristi.

## Praktičan značaj

Ovo ti direktno rešava problem koji smo ranije pominjali sa skill-creator-om — kad se skill pogrešno okida (ili se ne okida kad treba). Umesto da samo doteruješ `description`, `when_to_use` ti daje mesto da eksplicitno navedeš **negativne primere** ("Do NOT use for..."), što je često efikasnije za sprečavanje lažnih pozitiva nego doterivanje jedne rečenice u `description`.

## Za `polygon-lab`

Ako praviš skill za, recimo, generisanje lekcija dokumentacije, `when_to_use` bi ti pomogao da eksplicitno isključiš slučajeve gde ne želiš auto-trigger:

```yaml
when_to_use: |
  - User asks to document a new Three.js chapter/lesson
  - User says "napravi dokumentaciju za ovo poglavlje"
  - Do NOT use for: general README edits, package.json changes, or one-off code comments
```

Napomena — pošto je ovo relativno novije/opciono polje sa mešovitom podrškom po alatima, vredi proveriti da li ga tvoja trenutna verzija Claude Code-a zaista poštuje (`/doctor` ili test sa svesno kontradiktornim `description` vs `when_to_use` da vidiš koje polje "pobeđuje" u praksi), pre nego što se osloniš na njega kao primarni mehanizam.

# Frontmatter reference

https://code.claude.com/docs/en/skills#frontmatter-reference