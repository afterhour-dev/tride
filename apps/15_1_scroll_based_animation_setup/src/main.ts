// Supports weights 200-900
import '@fontsource-variable/manrope/wght.css';
// Supports weights 300-700
import '@fontsource-variable/fira-code/wght.css';
// Supports weights 100-900
import '@fontsource-variable/bitter/wght.css';

import * as THREE from 'three/webgpu';
// no orbit controls
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import GUI from 'lil-gui';
// import gsap from 'gsap';

import { getRequiredElement } from './util';

// loading textures -----------------------------------------
const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManager);

// EXPLAIN: we will provide gradient texture for our MeshToonMaterial
// instances
//
const gradientTexture = textureLoader.load(
	'textures/gradients/three-colors.jpg',
	// 'textures/gradients/five-colors.jpg',
);

// ---------------------------------------------------------
const canvas = getRequiredElement<HTMLCanvasElement>('canvas#tride');

// Gui -----------------------------------------------------
const gui = new GUI({
	// width: 350,
	width: 250,
	title: 'Tweaks',
	closeFolders: true,
});
const debugObject = {
	// cubeColor: new THREE.Color('#a54841'),
	// EXPLAIN: adding three new fileds for gui
	torusColor: new THREE.Color('#a54841'),
	coneColor: new THREE.Color('#2d3e63'),
	knotColor: new THREE.Color('#a259b3'),
};

// const cubeTweaks = gui.addFolder('cube Mesh');
// cubeTweaks.open();

// EXPLAIN: adding new tweaks
const torusTweaks = gui.addFolder('torus Mesh');
torusTweaks.open();
const coneTweaks = gui.addFolder('cone Mesh');
coneTweaks.open();
const knotTweaks = gui.addFolder('knot Mesh');
knotTweaks.open();

// --------------------------------------------------------
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
};
// --------------------------------------------------------

async function init() {
	// Scene
	const scene = new THREE.Scene();

	// ------------------------------------------------------
	// 0.1 - Renderer (first part)

	const renderer = new THREE.WebGPURenderer({
		canvas,
		// EXPLAIN: I think that by default we don't need to set
		// alpha to true if we want transparency because this is the default
		// for WebGPU, so I didn't do it since I already
		// have transparency and I didn't set setClearColor with opacity 1
		// alpha: true,
	});
	await renderer.init();

	// -----------------------------------------------------
	// 1 - Environment

	// ------------------------------------------------------
	// 2 - Shadows stuff globaly related

	// ------------------------------------------------------
	// 3 -  texture stuff
	// colorSpace and stuff
	// EXPLAIN: why we used NearestFilter? this texture is very small
	// and it is gradient between three colors. Does this option
	// accomplishes, like sharp step between colors, not gradually
	// blending one color into other, or what? Does it doing something
	// since our texture is small?
	gradientTexture.magFilter = THREE.NearestFilter;

	// ------------------------------------------------------
	// 4 - Text - font loading, TextGeometry, Material, mesh

	// --------------------------------------------------
	// 5 - Lights
	// EXPLAIN: since we want to use MeshToonMaterial, we need lights
	const directionalLight = new THREE.DirectionalLight();
	directionalLight.color = new THREE.Color(0xffffff);
	directionalLight.intensity = 1 * Math.PI;

	directionalLight.position.set(1, 1, 0);

	scene.add(directionalLight);

	//
	//  5.1 - Shadow stuff related to directional light

	// -----------------------------------------------------
	// 6 - Geometries Materials Meshes

	// EXPLAIN: removing cube because we want some
	// other meshes, that use some other primitive
	// geometries
	/* const cubeGreometry = new THREE.BoxGeometry(1, 1, 1);
	const cubeMaterial = new THREE.MeshBasicMaterial();
	cubeMaterial.color = new THREE.Color(debugObject.cubeColor);
	// cubeMaterial.wireframe = true;
	const cubeMesh = new THREE.Mesh(cubeGreometry, cubeMaterial);
	scene.add(cubeMesh); */

	// EXPLAIN: adding Meshes that use TorusGeometry, ConeGeometry,
	// TorusKnot; we are also going to use MeshToonMaterial
	const torusGreometry = new THREE.TorusGeometry(1, 0.4, 16, 60);
	// const torusMaterial = new THREE.MeshBasicMaterial();
	const torusMaterial = new THREE.MeshToonMaterial();
	torusMaterial.color = new THREE.Color(debugObject.torusColor);
	// EXPLAIN: setting gradientMap
	torusMaterial.gradientMap = gradientTexture;
	// cubeMaterial.wireframe = true;
	const torusMesh = new THREE.Mesh(torusGreometry, torusMaterial);
	scene.add(torusMesh);

	const coneGreometry = new THREE.ConeGeometry(1, 2, 32);
	// const coneMaterial = new THREE.MeshBasicMaterial();
	const coneMaterial = new THREE.MeshToonMaterial();
	coneMaterial.color = new THREE.Color(debugObject.coneColor);
	// EXPLAIN: setting gradientMap
	coneMaterial.gradientMap = gradientTexture;
	// cubeMaterial.wireframe = true;
	const coneMesh = new THREE.Mesh(coneGreometry, coneMaterial);
	scene.add(coneMesh);

	const knotGreometry = new THREE.TorusKnotGeometry(
		0.8,
		0.35,
		100,
		16,
	);
	// const knotMaterial = new THREE.MeshBasicMaterial();
	const knotMaterial = new THREE.MeshToonMaterial();
	knotMaterial.color = new THREE.Color(debugObject.knotColor);
	// EXPLAIN: setting gradientMap
	knotMaterial.gradientMap = gradientTexture;
	// cubeMaterial.wireframe = true;
	const knotMesh = new THREE.Mesh(knotGreometry, knotMaterial);
	scene.add(knotMesh);

	// EXPLAIN: just for examining fov of our perspective camera
	torusMesh.position.y = 2;
	torusMesh.scale.setScalar(0.5);
	coneMesh.visible = false;
	knotMesh.position.y = -2;
	knotMesh.scale.setScalar(0.5);

	// --------------------------------------------------------
	// 7 - Camera - Perspective Camera
	const camera = new THREE.PerspectiveCamera(
		75,
		sizes.width / sizes.height,
		0.1,
		100,
	);

	// camera.position.z = 3;
	// camera.position.y = 1.5;
	// camera.position.x = 1;
	// camera.position.z = 1;
	// camera.position.y = 1;
	// camera.position.x = 2;
	camera.position.z = 3;

	// camera.lookAt(cubeMesh.position);

	scene.add(camera);

	// -----------------------------------------------------
	// 8 - Orbit Controls
	// const orbitControls = new OrbitControls(camera, canvas);

	// orbitControls.enableDamping = true;
	// orbitControls.enabled = false;
	// orbitControls.update()

	// ------------------------------------------------
	// 9 - helpers

	// // // // // // // // //
	// Light Helpers

	// // // // // // // // //

	// // // // // // // // //           // // // // // // // // //

	// // // // // // // // //           // // // // // // // // //

	const axesHelper = new THREE.AxesHelper(5);
	axesHelper.setColors('red', 'green', 'blue');
	scene.add(axesHelper);
	axesHelper.visible = false;

	// 9 - GUI ---------------------------------------------------------

	// // // // // // // // // //
	// gui - Global -----------------
	// // // // // // // // // //
	gui
		.add({ a: '' }, 'a')
		.disable()
		.name(
			'// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //',
		);
	gui.add(axesHelper, 'visible').name('show axes');
	const shadowMapAlgoType = {
		BasicShadowMap: THREE.BasicShadowMap,
		PCFShadowMap: THREE.PCFShadowMap,
		PCFSoftShadowMap: THREE.PCFSoftShadowMap,
		VSMShadowMap: THREE.VSMShadowMap,
	};
	gui
		.add(renderer.shadowMap, 'enabled')
		.name('renderer.shadowMap.enabled')
		.disable();
	gui
		.add(renderer.shadowMap, 'type', shadowMapAlgoType)
		.name('renderer.shadowMap.type')
		.disable();

	// // // // // // // // // // ---------------------------------
	// gui - Folders ----------------
	// // // // // // // // // // ---------------------------------

	// // // // // // // // // // // // // // // // // // //
	// EXPLAIN: adding new tweaks, and removing cube one

	torusTweaks
		.addColor(debugObject, 'torusColor')
		.onChange((col: THREE.Color) => {
			torusMaterial.color.set(col);
			console.log(col.getHexString());
		});
	torusTweaks
		.add(torusMesh.position, 'x')
		.step(0.001)
		.name('position.x')
		.min(-5)
		.max(5);
	torusTweaks
		.add(torusMesh.position, 'y')
		.step(0.001)
		.name('position.y')
		.min(0)
		.max(5);
	torusTweaks
		.add(torusMesh.position, 'z')
		.step(0.001)
		.name('position.z')
		.min(-5)
		.max(5);

	coneTweaks
		.addColor(debugObject, 'coneColor')
		.onChange((col: THREE.Color) => {
			coneMaterial.color.set(col);
			console.log(col.getHexString());
		});
	coneTweaks
		.add(coneMesh.position, 'x')
		.step(0.001)
		.name('position.x')
		.min(-5)
		.max(5);
	coneTweaks
		.add(coneMesh.position, 'y')
		.step(0.001)
		.name('position.y')
		.min(0)
		.max(5);
	coneTweaks
		.add(coneMesh.position, 'z')
		.step(0.001)
		.name('position.z')
		.min(-5)
		.max(5);

	knotTweaks
		.addColor(debugObject, 'knotColor')
		.onChange((col: THREE.Color) => {
			knotMaterial.color.set(col);
			console.log(col.getHexString());
		});
	knotTweaks
		.add(knotMesh.position, 'x')
		.step(0.001)
		.name('position.x')
		.min(-5)
		.max(5);
	knotTweaks
		.add(knotMesh.position, 'y')
		.step(0.001)
		.name('position.y')
		.min(0)
		.max(5);
	knotTweaks
		.add(knotMesh.position, 'z')
		.step(0.001)
		.name('position.z')
		.min(-5)
		.max(5);
	// // // // // // // // // // // // // // // // // // //

	// ----------------------------------------------------
	// ----------------------------------------------------
	// ----------------------------------------------------
	// ----------------------------------------------------
	// ----------------------------------------------------
	// 0.2 - Renderer (second part)
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
	renderer.setSize(sizes.width, sizes.height);
	// renderer.setClearColor(0x000000, 1)
	// EXPLAIN: We don't need this at all, our clearColor is transparent
	// by default
	// renderer.setClearColor(0x000000, 0);

	// EXPLAIN: just testing out setClearAlpha, not going
	// to use it
	// renderer.setClearAlpha(0.9);
	// renderer.setClearAlpha(0.2);

	renderer.render(scene, camera);

	// --------------------------------------------------------------
	// --------------------------------------------------------------
	// --------------------------------------------------------------
	// --------------------- ANIMATION ------------------------------
	// --------------------------------------------------------------
	// --------------------------------------------------------------
	// --------------------------------------------------------------
	const timer = new THREE.Timer();

	renderer.setAnimationLoop(tick);
	// ----------------------------------------------------

	function tick(timestamp: number) {
		timer.update(timestamp);

		// const elapsedTime = timer.getElapsed();

		// orbitControls.update();

		renderer.render(scene, camera);
	}

	// // // // // // // // // // // // // // // // // // // // // //
	// // // // // // // // // // // // // // // // // // // // // //
	// // // // // // // // // // // // // // // // // // // // // //
	//     TOGGLE GUI            RESIZE              FULL SCREEN
	// // // // // // // // // // // // // // // // // // // // // //
	// // // // // // // // // // // // // // // // // // // // // //
	// // // // // // // // // // // // // // // // // // // // // //

	window.addEventListener('keydown', (ev) => {
		if (ev.key === 'h') {
			gui.show(gui._hidden);
		}
	});

	window.addEventListener('resize', () => {
		sizes.width = window.innerWidth;
		sizes.height = window.innerHeight;

		camera.aspect = sizes.width / sizes.height;

		camera.updateProjectionMatrix();

		renderer.setSize(sizes.width, sizes.height);

		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
	});

	window.addEventListener('dblclick', () => {
		const fullScreenElement =
			// @ts-expect-error can't find it on document but it is there
			document.fullscreenElement || document.webkitExitFullscreenExit;

		if (!fullScreenElement) {
			if (canvas.requestFullscreen) {
				canvas.requestFullscreen();
				// @ts-expect-error can't find it on document but it is there
			} else if (canvas.webkitRequestFullScreen) {
				// @ts-expect-error can't fid it on document but it is there
				canvas.webkitRequestFullScreen();
			}
		} else {
			if (document.exitFullscreen) {
				document.exitFullscreen();
				// @ts-expect-error can't find it on document but it is there
			} else if (document.webkitExitFullscreen) {
				// @ts-expect-error can't find it on document but it is there
				document.webkitExitFullscreen();
			}
		}
	});
}

await init();
