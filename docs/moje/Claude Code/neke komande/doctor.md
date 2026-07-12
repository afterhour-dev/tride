
```bash
#komanda
/doctor
```

`/doctor` je dijagnostička komanda koja proverava zdravlje tvoje Claude Code instalacije i podešavanja, i može čak sama da ponudi popravku.

## Šta proverava

- **Instalaciju** — tip instalacije (npm global, lokalna, native/Homebrew), putanju, verziju. Ako imaš više paralelnih instalacija istovremeno, upozorava te na to.
- **Podešavanja** — validnost `~/.claude/settings.json` i drugih config fajlova.
- **API konekciju** — da li je dostupna, da li je auth ispravan.
- **MCP servere** — validnost JSON konfiguracije, konekcije (npr. hvata greške tipa pogrešan port, nepostojeća komanda, falš zapeta u JSON-u).
- **Sandbox** — status izolacije za izvršavanje alata; ako sandbox nije dostupan a misliš da te štiti, to ti jasno prijavi kao bezbednosni rizik.
- **Skill-ove** — koliko je učitano, da li ima grešaka.
- **Iskorišćenost konteksta** — npr. upozorenje na 72% i predlog da pokreneš `/compact`.
- Env varijable poput `BASH_MAX_OUTPUT_LENGTH`, `TASK_MAX_OUTPUT_LENGTH`, `CLAUDE_CODE_MAX_OUTPUT_TOKENS` — upozorava ako je nešto podešeno van razumnih granica.
- Asinhrono proverava i da li postoji novija verzija Claude Code-a (i na kom update kanalu si — stable, latest, itd.)

## Kako izgleda izlaz

Svaka stavka dobija status ikonicu — zeleno (OK), žuto (upozorenje), crveno (greška). Na kraju možeš pritisnuti `f` da Claude sam pokuša da popravi prijavljene probleme (npr. detektuje da MCP server gađa pogrešan port, pročita tvoj `mcp.json`, predloži i primeni ispravku).

## Van sesije

Ako Claude Code uopšte neće da se pokrene i ne možeš da kucaš slash komande, postoji i shell varijanta: `claude doctor` direktno iz terminala daje isti izveštaj.

## Za tvoj setup

S obzirom da rutiraš kroz OpenRouter (Qwen3-Coder-Next + DeepSeek), `/doctor` bi trebalo da ti bude posebno koristan za proveru API konekcije — pošto ne koristiš direktnu Anthropic auth, vredi ga pokrenuti kad god posumnjaš da nešto ne štima sa env varijablama (`ANTHROPIC_BASE_URL`, `ANTHROPIC_AUTH_TOKEN`) ili kad se pojavi onaj poznati Plan mode auth bug — pre nego što pribegneš `/logout` i restartu.