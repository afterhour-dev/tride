
## `/powerup`

Ugrađena, in-terminal interaktivna tutorial funkcija dodata u v2.1.90 (1. april 2026). Umesto da čitaš dokumentaciju ili gledaš YouTube, komanda ti direktno u terminalu prikazuje meni lekcija sa animiranim demo-ima za funkcije Claude Code-a koje ljudi obično promaše.

## Kako izgleda

Ukucaš `/powerup` i dobiješ listu "power-up-ova" sa statusom otključano/zaključano, npr:

```
Power-ups 5/10 unlocked ████████
✔ Talk to your codebase       @ files, line refs
✔ Steer with modes            shift+tab, plan, auto
✔ Undo anything                /rewind, Esc-Esc
◯ Run in the background        tasks, /tasks
◯ Teach Claude your rules      CLAUDE.md, /memory
✔ Extend with tools            MCP, /mcp
◯ Automate your workflow       skills, hooks
◯ Multiply yourself            subagents, /agents
◯ Code from anywhere           /remote-control, /teleport
✔ Dial the model               /model, /effort
```

Strelicama biraš lekciju, Enter otvara — tekst objašnjenje + animirani demo, pa označiš kao završeno i ideš dalje. Progres se čuva između sesija.

## Ključni detalji

- **Dostupno svima**, bez obzira na plan/tier — nema Pro ograničenja
- Pokriva raspon od osnova (kontekst, plan mode, model selekcija) do naprednog (subagent orkestracija, hooks, worktrees, `/schedule`)
- Zahteva Claude Code **v2.1.90 ili noviji** — ako dobiješ "unknown command", proveri verziju sa `claude --version` i ažuriraj preko `npm update -g @anthropic-ai/claude-code`
- Renderuje se preko React + Ink terminalnog UI pipeline-a — ako animacije izgledaju izobličeno, terminal prozor ti je verovatno preuzak

## Za tvoj setup

Pošto koristiš Claude Code kroz OpenRouter (a ne direktnu Anthropic auth), vredi proveriti da li `/powerup` uopšte radi kod tebe pre nego što uložiš vreme — pošto je ovo UI/tutorial sloj koji verovatno ne zavisi od modela iza rutiranja (Qwen3-Coder-Next), za razliku od `/effort` ili `/advisor` koji su vezani direktno za Anthropic model capabilities. Prvo proveri verziju:

```bash
claude --version
```

Ako ti je ispod v2.1.90, update-uj claude code pa probaj ponovo.