# U ovoj lekciji govorićemo o tome šta je Claude Code under the hood

![[Screenshot From 2026-07-08 21-52-18.png]]

## Claude Code je `Harness`

Da koristiš deсktop app, desktop app bi bio harness, a u ovom slušaju harness je claude code.

Model služi samo za rezonovanje dok je harness taj koji na kraju generise i menja fajlove.

Model nema naš git history dostupan, harness ima.

Harness expose-uje alate modelu, na primer sve shell komande ili tvoj codebase.

## Vrste modela za Antropic API

- Opus
	- task zahteva duboko rezonovanje: odgovor nije samo u code-u
- Sonnet
	- kada odgovor na task treba da razume code
- Haiku
	- kada task nema pravu odluku, samo korake za egzekuciju

# Malo detaljnije o modelima

![[Screenshot From 2026-07-08 21-55-21.png]]

Dakle razlika je u ceni i mogucnostima.

Opus je najskuplji i ne bi ga trebalo koristiti za simple task-ove.

Sonnet je savrsen balans. Za general purpose tasks.

Haiku najslabije ali dobar za stvari poput refactoring-a, na primer.

## Možes izabrati i Effort Level za svaki od modela

low level, medium level, high level i mozda jos neki, ali to ne radi na third party modelima koje koristiš.

## Model je stateless

Nema nikakav in session memory.

## Nemoj menjati model kroz istu sesiju

cach ce ti biti obrisan.

## Harness je taj koji ti obezbeđjuje state

![[Screenshot From 2026-07-08 22-05-41.png]]

![[Screenshot From 2026-07-08 22-10-04.png]]
![[Screenshot From 2026-07-08 22-12-05.png]]![[Screenshot From 2026-07-08 22-17-20.png]]
![[Screenshot From 2026-07-08 22-17-49.png]]
![[Screenshot From 2026-07-08 22-21-27.png]]

![[Screenshot From 2026-07-08 22-22-51.png]]
