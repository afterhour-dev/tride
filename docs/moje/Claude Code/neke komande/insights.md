
## `/insights`

Ugrađena komanda koja analizira tvojih poslednjih **30 dana** lokalnih Claude Code sesija i generiše interaktivni HTML izveštaj — bez potrebe za podešavanjem, bez eksternog trekovanja, sve na osnovu podataka koji su već sačuvani na tvom računaru. Najavljena je početkom februara 2026. od strane Anthropic-ovog Thariqa Shihipara.

**Kako se koristi:** ukucaš `/insights` unutar aktivne sesije, sačekaš par minuta, i izveštaj se automatski otvori u browseru.

**Šta pokriva:**

- Izveštaj se čuva na ~/.claude/usage-data/report.html i otvara automatski u default browseru
- Kategorizacija zahteva — debug/fix bug, implementacija, refaktoring, pisanje testova, dokumentacija, deploy, itd. — distribucija toga koliko vremena trošiš na koju vrstu zadatka
- Otkriva ponovljene prompt strukture — slične formulacije, slične tipove zadataka, slične kontekste — koje su kandidati za CLAUDE.md instrukcije, custom slash komande, ili automatizovane workflow-e
- Automatski identifikuje makro-projekte na kojima si radio, sa brojem sesija za svaki
- Konkretan primer generisanog CLAUDE.md predloga: pravila oko testiranja (npr. koristi vitest umesto jest) i konvencija (apsolutni importi sa @/ alias-om, kebab-case imenovanje fajlova)

**Privatnost:** sve se dešava lokalno — analiza se zasniva isključivo na session logovima koji su već prisutni na tvom računaru u ~/.claude/, ništa se ne šalje eksternim serverima.

Za tebe konkretno — pošto radiš kroz OpenRouter rutiranje, ovo bi ti moglo dati zanimljiv uvid u to koliko vremena zapravo trošiš na `polygon-lab` sesije po paketu, i da li se neki friction pattern ponavlja (npr. isto objašnjavanje Three.js konvencija iznova i iznova umesto da to stoji u `CLAUDE.md`).