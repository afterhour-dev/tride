# Full screen provera

```ts
const fullScreenElement =
	document.fullscreenElement || document.webkitExitFullscreenExit;
```

document.webkitExitFullscreenExit не постоји ни на једном browser API-ју — ни као стандард ни као vendor-prefixed верзија. Оно што си вероватно хтео је document.webkitFullscreenElement (elementgetter, аналоган стандардном fullscreenElement, само prefixed). Тренутно овај fallback увек враћа undefined, па на Safari/старијим WebKit browser-има double-click fullscreen неће радити исправно.

```ts
const fullScreenElement =
	document.fullscreenElement ||
	// @ts-expect-error webkit prefix
	document.webkitFullscreenElement;
```