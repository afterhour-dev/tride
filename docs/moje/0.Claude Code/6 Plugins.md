# Plugins

![[Screenshot From 2026-07-12 18-34-39.png]]

## Šta je plugin

Plugin je **paket** koji grupiše više Claude Code proširenja u jedan direktorijum koji se instalira/deli kao celina: skills, sub-agente, hooks, MCP servere, LSP servere. Ništa od ovoga nije plugin-ekskluzivno — sve to već možeš da definišeš pojedinačno u `.claude/` folderu (baš kao što si radio sa svojim sub-agentima) — plugin samo **pakuje** te iste stvari da mogu da se dele, verzionišu i instaliraju kao jedna jedinica, umesto da ručno kopiraš fajlove između projekata.

## Struktura

```
my-plugin/
├── .claude-plugin/
│   └── plugin.json          # metadata: ime, opis, verzija
├── commands/                 # slash komande (opciono)
├── agents/                   # sub-agent definicije (opciono)
├── skills/                   # SKILL.md fajlovi (opciono)
├── hooks/                    # event handleri (opciono)
├── .mcp.json                 # MCP server konfiguracija (opciono)
└── README.md
```

Bitno: samo `plugin.json` ide unutar `.claude-plugin/` — sve ostalo (`commands/`, `agents/`, `skills/`, `hooks/`) mora biti na root nivou plugin foldera, ne unutra.

## Instalacija

```
/plugin install ime-plugina@marketplace-ime
```

Marketplace-i su repozitorijumi koji listaju dostupne pluginove. Anthropic drži `claude-plugins-official` (auto-registrovan pri prvom pokretanju), postoji i `claude-community` za third-party. Za tim/organizaciju, plugin se može distribuirati preko `extraKnownMarketplaces` i `enabledPlugins` u managed settings — tako svi na projektu dobijaju iste konvencije bez ručnog podešavanja.

## Praktičan primer za tebe

Zamisli da hoćeš da spakuješ ceo tvoj trenutni workshop-workflow (docs generisanje + shader review) u jedan plugin koji možeš da instaliraš u bilo koji budući Three.js projekat, ne samo `polygon-lab`:

```
threejs-workshop-kit/
├── .claude-plugin/
│   └── plugin.json
├── skills/
│   └── chapter-docs/
│       └── SKILL.md
├── agents/
│   └── glsl-checker.md
└── hooks/
    └── post-tool-use.json
```

**`plugin.json`:**

```json
{
  "name": "threejs-workshop-kit",
  "description": "Docs generation and GLSL review for Three.js learning projects",
  "version": "1.0.0"
}
```

**`skills/chapter-docs/SKILL.md`:**

```markdown
---
description: Generates per-chapter markdown documentation from workshop code. Use after completing a Three.js chapter or exercise.
---
When a chapter/exercise is finished, read the relevant source files
and produce a chapter-##.md with: concepts covered, key code snippets,
and a "gotchas" section for anything that broke during implementation.
```

**`agents/glsl-checker.md`:**

```yaml
---
name: glsl-checker
description: Reviews GLSL shaders for performance issues. Use after writing or editing shader code.
tools: Read, Grep, Glob
---
You are a GLSL/WebGL specialist. Flag branching in fragment shaders,
redundant trig calls, and unnecessary precision qualifiers.
```

**Hook** — npr. da se `chapter-docs` skill automatski predloži svaki put kad se sačuva fajl u `chapters/` folderu.

Sad kad prelaziš na sledeći Three.js projekat (ili kad daš pristup nekome ko takođe radi FrontendMasters workshop), samo `/plugin install threejs-workshop-kit@tvoj-marketplace` i dobijaš ceo taj setup odjednom — bez ručnog kopiranja `.claude/agents/` i `.claude/skills/` fajlova između repozitorijuma.

## Napomena za tvoj OpenRouter setup

Delovi plugina koji zavise od Anthropic-specifičnih mehanizama (npr. neki hook eventi ili MCP auth flow) mogu se ponašati drugačije kroz proxy — isto ono upozorenje kao i kod `/agents` i `/usage`. Skills i sub-agent definicije unutar plugina bi trebalo da rade normalno jer su to čisto markdown/YAML fajlovi koje Claude Code čita lokalno, nezavisno od toga koji model stoji iza `ANTHROPIC_BASE_URL`.

# Ne zaboravi da dodaš marketplace 

```bash
/plugin marketplace add anthropics/claude-plugins-official
```


ili da ga updatuješ

```bash

/plugin marketplace update claude-plugins-official
```


## Primer

Ako marketplace nikada nije bio dodat

```
/plugin marketplace add anthropics/claude-plugins-official
/plugin install skill-creator@claude-plugins-official
/reload-plugins
```

Ako je marketplace već dodat ranije, samo:

```
/plugin marketplace update claude-plugins-official
/plugin install skill-creator@claude-plugins-official
/reload-plugins
```

Posle `/reload-plugins` skill treba da bude odmah dostupan bez restarta cele sesije.
