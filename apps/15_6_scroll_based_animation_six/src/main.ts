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
	torusColor: new THREE.Color('#a54841'),
	coneColor: new THREE.Color('#2d3e63'),
	knotColor: new THREE.Color('#a259b3'),

	// objectsDistance: 2,
	objectsDistance: 4,
};

// const cubeTweaks = gui.addFolder('cube Mesh');
// cubeTweaks.open();

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
		// alpha: true, // default
	});
	await renderer.init();

	// -----------------------------------------------------
	// 1 - Environment

	// ------------------------------------------------------
	// 2 - Shadows stuff globaly related

	// ------------------------------------------------------
	// 3 -  texture stuff
	// colorSpace, magFilter etc.

	gradientTexture.magFilter = THREE.NearestFilter;

	// ------------------------------------------------------
	// 4 - Text - font loading, TextGeometry, Material, mesh

	// --------------------------------------------------
	// 5 - Lights
	const directionalLight = new THREE.DirectionalLight();
	directionalLight.color = new THREE.Color(0xffffff);
	directionalLight.intensity = 1 * Math.PI;

	directionalLight.position.set(1, 1, 0);

	scene.add(directionalLight);

	//
	//  5.1 - Shadow stuff related to directional light

	// -----------------------------------------------------
	// 6 - Geometries Materials Meshes

	const torusGreometry = new THREE.TorusGeometry(1, 0.4, 16, 60);
	const torusMaterial = new THREE.MeshToonMaterial();
	torusMaterial.color = new THREE.Color(debugObject.torusColor);
	torusMaterial.gradientMap = gradientTexture;
	const torusMesh = new THREE.Mesh(torusGreometry, torusMaterial);

	const coneGreometry = new THREE.ConeGeometry(1, 2, 32);
	const coneMaterial = new THREE.MeshToonMaterial();
	coneMaterial.color = new THREE.Color(debugObject.coneColor);
	coneMaterial.gradientMap = gradientTexture;
	const coneMesh = new THREE.Mesh(coneGreometry, coneMaterial);

	const knotGreometry = new THREE.TorusKnotGeometry(
		0.8,
		0.35,
		100,
		16,
	);
	const knotMaterial = new THREE.MeshToonMaterial();
	knotMaterial.color = new THREE.Color(debugObject.knotColor);
	knotMaterial.gradientMap = gradientTexture;
	const knotMesh = new THREE.Mesh(knotGreometry, knotMaterial);

	torusMesh.position.y = -debugObject.objectsDistance * 0;
	coneMesh.position.y = -debugObject.objectsDistance * 1;
	knotMesh.position.y = -debugObject.objectsDistance * 2;

	torusMesh.position.x = 2;
	coneMesh.position.x = -2;
	knotMesh.position.x = 2;

	scene.add(torusMesh, coneMesh, knotMesh);

	const selectionMeshes = [torusMesh, coneMesh, knotMesh];

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

	const cameraGroup = new THREE.Group();
	cameraGroup.add(camera);
	scene.add(cameraGroup);
	// scene.add(camera);

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

	// it is transparent by default, no need for these
	// just tested them
	// renderer.setClearColor(0x000000, 1)
	// renderer.setClearColor(0x000000, 0);
	// renderer.setClearAlpha(0.9);
	// renderer.setClearAlpha(0.2);

	renderer.render(scene, camera);

	// --------------------------------------------------------------
	// --------------------------------------------------------------
	// --------------------------------------------------------------
	// --------------------- Getting Scroll value ------------------------------

	let scrollY = window.scrollY;
	// console.log(scrollY);
	window.addEventListener('scroll', () => {
		scrollY = window.scrollY;
		// console.log(scrollY);
		// console.log(document.body.scrollHeight, window.scrollY);
	});

	// --------------------------------------------------------------
	// --------------------------------------------------------------
	// --------------------------------------------------------------
	// --------------------- Getting cursor values ------------------------------
	const cursor = { x: 0, y: 0 };
	window.addEventListener('mousemove', (ev) => {
		// console.log(ev.clientX, ev.clientY);

		cursor.x = ev.clientX / sizes.width - 0.5;
		cursor.y = ev.clientY / sizes.height - 0.5;

		// console.log(`${cursor.x}\n\n${cursor.y}`);
	});

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

		const elapsedTime = timer.getElapsed();

		camera.position.y =
			-(scrollY * debugObject.objectsDistance) / sizes.height;

		// const parallaxX = cursor.x;
		const parallaxX = cursor.x * 0.5;
		// const parallaxY = -cursor.y;
		const parallaxY = -cursor.y * 0.5;

		const delta = timer.getDelta();

		// console.log(delta, deltaTime);

		cameraGroup.position.x +=
			(parallaxX - cameraGroup.position.x) /* * 0.08 */ * 5 * delta;
		cameraGroup.position.y +=
			(parallaxY - cameraGroup.position.y) /* * 0.08 */ * 5 * delta;

		for (const mesh of selectionMeshes) {
			mesh.rotation.x = elapsedTime * 0.1;
			mesh.rotation.y = elapsedTime * 0.12;
		}

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
