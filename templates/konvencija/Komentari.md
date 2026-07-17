# Konvencija za komentare u kodu

> Ovaj fajl je samo referenca za mene — podsetnik koje tagove da koristim u komentarima unutar `src/` foldera svakog app-a Čita ga `docmaker` skill kad generiše dokumentaciju, pa vredi biti dosledan.

## Tagovi

### `// EXPLAIN:`

Nešto što treba detaljno objasniti u generisanoj lekciji — ide u `Emphasis` / `## Concept` sekciju dokumentacije.

```ts
// EXPLAIN: zašto se ovde koristi useFrame umesto useEffect za animaciju
```

### `// GOTCHA:`

Lako mesto za grešku, nešto zbunjujuće ili neočigledno — ide u `## Gotchas` sekciju dokumentacije.

```ts
// GOTCHA: geometry.dispose() mora ručno da se pozove, R3F ne radi to sam
```

### `// REVISIT:`

Nešto što treba ponovo uvežbati ili produbiti kasnije — ide u `Revisit` sekciju dokumentacije.

```ts
// REVISIT: matrix transformacije mi još nisu potpuno jasne, vratiti se
```

### `// TODO:`

Nedovršen posao ili nešto što planiram da dodam — koristi se opštije, ne mapira se direktno na jednu sekciju, docmaker ga uzima u obzir po kontekstu.

```ts
// TODO: dodati OrbitControls limit za polar angle
```

### `// NOTE:`

Opšta napomena, kontekst koji nije nužno gotcha ili revisit, ali je koristan da se zapamti — koristi se opštije, po kontekstu.

```ts
// NOTE: ovaj pristup je namerno drugačiji od kursa, probam svoju varijantu
```

## Brzi pregled (cheat sheet)

| Tag | Svrha | Ide u sekciju |
|---|---|---|
| `// EXPLAIN:` | treba detaljno objašnjenje | `## Concept` (Emphasis) |
| `// GOTCHA:` | lako mesto za grešku | `## Gotchas` |
| `// REVISIT:` | vratiti se, uvežbati ponovo | `Revisit` |
| `// TODO:` | nedovršen posao | kontekstualno |
| `// NOTE:` | opšta napomena | kontekstualno |

## Napomena

Isti princip (Emphasis / Gotchas / Revisit / Concerns / Links) postoji i
u `README.md` template-u svakog app-a, kroz odgovarajuće markdown sekcije
— tagovi u kodu su samo inline, granularniji način da se isto označi na
tačnom mestu u fajlu, umesto samo na nivou celog app-a.