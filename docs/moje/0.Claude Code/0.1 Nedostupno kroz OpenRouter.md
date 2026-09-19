Ево целог пресека — састављен из свега што смо покрили плус пар додатних ставки које нисам поменуо раније:

**1. `/advisor`** — захтева директан приступ Anthropic API-ју, server-side orkestraciju koju OpenRouter ne posreduje uopšte. (Ljudi ga cesto koriste da definisu da korriste opus za plan mode bez eksplicitnog menjanja kroz komande)

**2. `/effort`** — dizajniran oko Anthropic-ovog native "extended thinking" mehanizma; kod modela van Claude familije verovatno je no-op ili se ponaša nepredvidivo.

**3. Auto mode** — dupla prepreka za tebe: (a) klasifikator je zvanično gejtovan na Opus 4.6+/Sonnet 4.6, i (b) čak i sa nativnim Claude modelima, dostupan je samo na Max/Team Premium/Enterprise nalozima, ne na plain API pay-as-you-go.

**4. `/fast` (fast mode)** — radi **isključivo** sa Anthropic first-party provajderom i **isključivo** sa Opus modelima (4.6/4.7/4.8). Kod tebe se `speed: "fast"` parametar jednostavno tiho ignoriše (OpenRouter ga drop-uje bez greške), pa komanda postoji ali nema efekta.

**5. Extended thinking (native "misli pre odgovora" mod)** — ista priča kao effort, podržano samo na pravim Claude modelima.

**6. Prompt caching** — ovo je verovatno **najskuplja** stavka koju nismo pomenuli. Anthropic modeli podržavaju keširanje stabilnih delova konteksta (sistemski prompt, sadržaj fajlova) po znatno nižoj ceni na ponovljenim pozivima. Pošto ti koristiš Qwen i DeepSeek (ne Claude modele) preko OpenRoutera, ovo se uopšte ne primenjuje na tvoj setup — svaki poziv plaćaš po punoj ceni ulaznih tokena, bez obzira koliko se kontekst ponavlja iz koraka u korak. Za agentne sesije (gde se veliki kontekst šalje iznova i iznova) ovo može biti glavni pokretač troška.

**7. Pouzdanost tool-use/function-calling formata** — Claude Code je optimizovan za Anthropic-ov format poziva alata. DeepSeek generalno ima solidnu podršku, ali generalno—ne garantovano—što znači da povremeno možeš naići na zaglavljene agentske petlje ili loše formirane izmene fajlova, nešto što se retko dešava sa native Claude modelima.

**8. `opusplan` mod** — nativna Anthropic funkcija (Opus planira, Sonnet izvršava automatski) — pošto se tvoji slotovi već ručno mapiraju na DeepSeek/Qwen, ovaj automatizovani prelaz verovatno neće raditi kako je zamišljeno.

**9. Computer use / napredne agentske mogućnosti** — zavise od specifičnih Anthropic API funkcija koje nisu garantovane na svim modelima kroz OpenRouter.

**10. Vision/multimodalni input** — kao što smo utvrdili, ovo zavisi od _konkretnog modela_ (qwen3-coder-next nema vision), ne od OpenRouter-a kao takvog — ali vredi ponoviti jer se uklapa u istu kategoriju "nešto što native Claude subscription korisnici uzimaju zdravo za gotovo".

Укратко: све што захтева _server-side saradnju sa Anthropic-ovom infrastrukturom_ (advisor, fast mode, prompt caching, auto mode klasifikator) ti jednostavno nemaš, jer OpenRouter, iako govori isti API "jezik", fizički nije Anthropic-ov server. Sve što je čisto model-capability stvar (effort, extended thinking, vision) zavisi od toga da li Qwen/DeepSeek uopšte imaju tu sposobnost ugrađenu.
