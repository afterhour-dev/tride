# `renderer.setAnimationLoop`

ovo: `renderer.setAnimationLoop(tick)` se sda koristi umesto `window.requestAnimationFrame(tick)`

popravi to

setAnimationLoop() интерно управља WebGPU backend-ом (укључујући случајеве кад позовеш renderer.render() пре него што је init() завршен — аутоматски sinhronizuje то уместо да ти ручно管ираш RAF ланац). Твоја верзија ради јер си већ ти ручно урадио await renderer.init() раније, али setAnimationLoop је "the recommended approach" из three.js docs специфично за WebGPU и вреди да ти буде default навика убудуће.

```ts

function tick(timestamp: number) {
	// ... isto kao sad, samo bez renderer.render() na kraju i bez RAF poziva
	renderer.render(scene, camera);
}

renderer.setAnimationLoop(tick);
```