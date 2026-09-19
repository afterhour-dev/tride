![[Screenshot From 2026-07-11 16-54-29.png]]

## Šta su hooks

Hooks su **shell komande koje se automatski okidaju** u određenim tačkama Claude Code lifecycle-a — deterministički mehanizam, za razliku od skillova (koji zavise od toga da li model _odluči_ da ih pozove). Hook se izvršava **uvek** kad se uslov ispuni, bez obzira šta model "misli" da treba da uradi.

Ključna razlika naspram drugih mehanizama: MCP proširuje mogućnosti Claude-a (novi alati), skillovi definišu ponašanje (uputstva), a hooks **presreću tok izvršavanja** i ubacuju spoljnu logiku — mogu da blokiraju, dozvole, ili modifikuju akciju pre/posle nego što se desi.

## Tri dela svakog hook-a

1. **Event** — trenutak u lifecycle-u kad se okida (`PreToolUse`, `PostToolUse`, `SessionStart`, `Stop`, itd.)
2. **Matcher** — regex filter koji sužava kada se hook pokreće (npr. samo za `Bash` pozive, ili samo `Edit|Write`)
3. **Handler** — šta se zapravo dešava: obično shell komanda, ali može biti i prompt poslat lakšem modelu na evaluaciju, ili čak subagent sa svojim alatima za verifikaciju

Claude Code trenutno definiše preko 30 lifecycle event-a.

## Najbitniji event: `PreToolUse`

Ovo je najmoćniji hook jer može da **odobri ili odbije** akciju pre nego što se desi. Dve stvari ga čine posebno jakim: PreToolUse deny se evaluira pre bilo koje provere permission-mode-a, tako da blokira alat čak i pod `bypassPermissions` ili `--dangerously-skip-permissions` — korisnik ne može to da zaobiđe promenom permission mode-a. I važi pravilo — hook može samo da **pooštri**, nikad da olabavi: `allow` samo preskače interaktivni prompt, ali ne poništava postojeći `deny` ili `ask`.

## Format odgovora (JSON)

```json
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "allow",
    "permissionDecisionReason": "Safe read operation",
    "updatedInput": { "command": "modified-command" },
    "additionalContext": "Context for Claude"
  }
}
```

- `allow` — zaobilazi permission sistem
- `deny` — blokira alat, javlja Claude-u zašto
- `ask` — traži potvrdu od korisnika
- `updatedInput` — menja parametre alata pre izvršavanja

Univerzalno pravilo preko exit kodova: **exit kod 2 je "power tool"** — `PreToolUse` hook koji izađe sa 2 zaustavlja alat, a `Stop` hook koji izađe sa 2 tera Claude-a da nastavi da radi.

## Praktičan primer — auto-format posle svakog write-a

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit|MultiEdit",
        "hooks": [
          { "type": "command", "command": "npx prettier --write \"$CLAUDE_TOOL_INPUT_FILE_PATH\"" }
        ]
      }
    ]
  }
}
```

## Gde se konfigurišu

U `.claude/settings.json` — non-negotiable pravila stavljaš na **projektni nivo** da ceo tim deli iste guardrail-ove; lični preferences idu u `~/.claude/settings.json`.

## Debugovanje

```bash
claude --debug
```

kad hook ne okine kako očekuješ. `Ctrl+O` (toggle verbose mode) prikazuje stdout/stderr iz hook izvršavanja uživo.

## Za tvoj setup — konkretni predlozi

S obzirom da imaš **Prettier kao default formatter** već podešen u VS Code-u, prirodan sledeći korak je da isti standard nametneš i kad Claude Code piše fajlove, nezavisno od editora:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit|MultiEdit",
        "hooks": [{ "type": "command", "command": "npx prettier --write \"$CLAUDE_TOOL_INPUT_FILE_PATH\"" }]
      }
    ]
  }
}
```

Za `polygon-lab` monorepo, `PreToolUse` hook sa matcher-om na `Bash` bi ti mogao sprečiti slučajan `git push --force` ili `rm -rf` u pogrešnom workspace paketu — posebno korisno jer se ponekad radi paralelno kroz više sesija.

**Napomena vezano za OpenRouter setup** — pošto hooks izvršavaju shell komande na tvom sistemu nezavisno od toga koji LLM je "iza volana" (Qwen3-Coder-Next/DeepSeek), mehanizam bi trebalo da radi identično kao sa nativnim Claude modelom, jer se sve dešava na nivou CLI harnessa, pre/posle poziva modela — slično kao `!` sintaksa koju smo ranije prošli.

# Komanda /hooks

read only prikaz hook-ova