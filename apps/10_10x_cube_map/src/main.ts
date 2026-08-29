import * as THREE from 'three/webgpu';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import GUI from 'lil-gui';
// import gsap from 'gsap';

import { getRequiredElement } from './util';

// loading textures -----------------------------------------
const loadingManager = new THREE.LoadingManager();
// const textureLoader = new THREE.TextureLoader(loadingManager);
// EXPLAIN: we are using CubeTextureLoader to load environment map
const cubeTextureLoader = new THREE.CubeTextureLoader(
	loadingManager,
); /* .setPath('/textures/environmentMaps/') */

loadingManager.onProgress = (textureFilePath: string) => {
	console.log(textureFilePath);
};

// EXPLAIN: I synchronously loaded these textures here like this
// but when I tried to override gloabal env map for some
// materials I got this kind of error:
/* installHook.js:1 THREE.TSL: TypeError: Cannot read properties of null (reading 'isRenderTargetTexture') "PMREMNode.setup()" at "three_webgpu.js:18385"
    at PMREMNode.setup (:5173/three_webgpu.js:18385:24)
    at PMREMNode.build (:5173/three_webgpu.js:1456:34)
    at PMREMNode.build (:5173/three_webgpu.js:1769:16)
    at ContextNode.setup (:5173/three_webgpu.js:5507:13)
    at ContextNode.build (:5173/three_webgpu.js:1456:34)
    at OperatorNode.build (:5173/three_webgpu.js:1463:16)
    at OperatorNode.build (:5173/three_webgpu.js:1769:16)
    at VarNode.build (:5173/three_webgpu.js:5751:58)
    at IsolateNode.build (:5173/three_webgpu.js:7227:26)
    at OperatorNode.build (:5173/three_webgpu.js:1463:16) */
// so I decided to load textures async in the body in init
// function but with awaiting the async loads
// Can yo uexplain why is this happening
/* const environmentMapTextureStudio = cubeTextureLoader
	.setPath('/textures/environmentMaps/studio/')
	.load(['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png']);
const environmentMapTextureLumber = cubeTextureLoader
	.setPath('/textures/environmentMaps/lumber/')
	.load(['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png']);
const environmentMapTextureCreek = cubeTextureLoader
	.setPath('/textures/environmentMaps/creek/')
	.load(['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png']);
const environmentMapTextureGlasshouse = cubeTextureLoader
	.setPath('/textures/environmentMaps/glasshouse/')
	.load(['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png']);
 */
// ---------------------------------------------------------
const canvas = getRequiredElement<HTMLCanvasElement>('canvas#tride');

// Gui -----------------------------------------------------
const gui = new GUI({
	width: 250,
	title: 'Tweaks',
	closeFolders: true,
});
const debugObject = {
	directLookAtCenter: () => {},
};

const envMapTweaks = gui.addFolder('Environment Map (cube map)');
const sphereMaterialTweaks = gui.addFolder('sphere Material');
const sphereMeshTweaks = gui.addFolder('sphere Mesh');
const floorTweaks = gui.addFolder('floor Mesh');
const ambientTweaks = gui.addFolder('Ambient Light');
// ambientTweaks.close();
const directionalTweaks = gui.addFolder('Directional Light');
const directionalShadowTweaks = gui.addFolder(
	'Directional Light Shadow tweaks',
);
directionalShadowTweaks.close();

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
	const renderer = new THREE.WebGPURenderer({ canvas });
	await renderer.init();

	// -----------------------------------------------------
	// 1 - Environment

	// EXPLAIN: like I mentioned I loaded them async and error disapeard
	// and it worked
	const environmentMapTextureStudio = await cubeTextureLoader
		.setPath('/textures/environmentMaps/studio/')
		.loadAsync([
			'px.png',
			'nx.png',
			'py.png',
			'ny.png',
			'pz.png',
			'nz.png',
		]);
	const environmentMapTextureLumber = await cubeTextureLoader
		.setPath('/textures/environmentMaps/lumber/')
		.loadAsync([
			'px.png',
			'nx.png',
			'py.png',
			'ny.png',
			'pz.png',
			'nz.png',
		]);
	const environmentMapTextureCreek = await cubeTextureLoader
		.setPath('/textures/environmentMaps/creek/')
		.loadAsync([
			'px.png',
			'nx.png',
			'py.png',
			'ny.png',
			'pz.png',
			'nz.png',
		]);
	const environmentMapTextureGlasshouse = await cubeTextureLoader
		.setPath('/textures/environmentMaps/glasshouse/')
		.loadAsync([
			'px.png',
			'nx.png',
			'py.png',
			'ny.png',
			'pz.png',
			'nz.png',
		]);

	// EXPLAIN: we are using lights from environment map
	scene.environment = environmentMapTextureStudio;
	// EXPLAIN: we don't need to see env map so I am not
	// setting it as background, but we can with gui if we want
	// scene.background = environmentMapTexture;
	// ------------------------------------------------------
	// 2 - Shadows stuff globaly related

	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	// renderer.shadowMap.type = THREE.PCFShadowMap; // default

	// ------------------------------------------------------
	// 3 -  texture stuff
	// colorSpace, magFilter and stuff

	// ------------------------------------------------------
	// 4 - Text - font loading, TextGeometry, material, mesh

	// --------------------------------------------------
	// 5 - Lights

	const ambientLight = new THREE.AmbientLight();
	ambientLight.color = new THREE.Color(0xffffff);
	// ambientLight.intensity = 0.3;
	ambientLight.intensity = 2.1;
	// ambientLight.visible = false;

	scene.add(ambientLight);

	// // // // // // // // -------------------------------

	const directionalLight = new THREE.DirectionalLight(0xffffff);
	directionalLight.intensity = 0.4 * Math.PI;
	directionalLight.position.set(5, 5, 5);
	// directionalLight.visible = false;

	// ----------------------------------------------------------
	//  5.1 - Shadow stuff related to directional light

	// console.log(directionalLight.shadow);
	// console.log(directionalLight.shadow.camera);

	directionalLight.castShadow = true;

	//
	// directionalLight.shadow.mapSize.width = 1024;
	// directionalLight.shadow.mapSize.height = 1024;
	directionalLight.shadow.mapSize.setScalar(1024);
	// near is by default 0.5, we will leave that value
	// (I think when I hover near it says that it is 0.1 default,
	// but I don't think that's true)
	// directionalLight.shadow.camera.near = 1;
	directionalLight.shadow.camera.far = 15;
	directionalLight.shadow.camera.top = 7;
	directionalLight.shadow.camera.right = 7;
	directionalLight.shadow.camera.bottom = -7;
	directionalLight.shadow.camera.left = -7;
	// doesn't work with PCFSoftShadowMap
	// directionalLight.shadow.radius = 10;
	// using defaults anyway
	// directionalLight.shadow.intensity = 1; // default
	// directionalLight.shadow.bias = 0.0002; // also default

	// -----------------------------------------------------------
	scene.add(directionalLight);

	// -----------------------------------------------------
	// 6 - Geometries Materials Meshes

	const sphereGreometry = new THREE.SphereGeometry(0.5, 32, 32);
	const sphereMaterial = new THREE.MeshStandardMaterial();
	sphereMaterial.roughness = 0.4;
	sphereMaterial.metalness = 0.3;
	// EXPLAIN: I wanted to override current global environment map
	// just for one material, by adding texture to desired material
	sphereMaterial.envMap = environmentMapTextureCreek;
	// EXPLAIN: envMapIntensity is set to 1 by default I think
	// so I decreased it
	sphereMaterial.envMapIntensity = 0.5;

	const sphereMesh = new THREE.Mesh(sphereGreometry, sphereMaterial);

	sphereMesh.position.y = 0.5;

	sphereMesh.castShadow = true;

	// sphereMaterial.wireframe = true;

	const floorGeometry = new THREE.PlaneGeometry(10, 10);
	const floorMaterial = new THREE.MeshStandardMaterial();
	floorMaterial.roughness = 0.4;
	floorMaterial.metalness = 0.3;
	floorMaterial.color = new THREE.Color('#928192');
	const floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);

	floorMesh.rotation.x = -Math.PI / 2;

	floorMesh.receiveShadow = true;
	//  ------------------------

	scene.add(sphereMesh, floorMesh);

	// --------------------------------------------------------
	// 7 - Camera - Perspective Camera
	const camera = new THREE.PerspectiveCamera(
		75,
		sizes.width / sizes.height,
		0.1,
		100,
	);

	// camera.position.z = 1;
	// camera.position.y = 1;
	// camera.position.x = 2;

	camera.position.set(-3, 3, 3);

	scene.add(camera);

	// -----------------------------------------------------
	// 8 - Orbit Controls
	const orbitControls = new OrbitControls(camera, canvas);

	orbitControls.enableDamping = true;
	// orbitControls.enabled = false;
	// orbitControls.update()

	// ------------------------------------------------
	// 9 - helpers

	// // // // // // // // //
	// Light Helpers

	const directionalLightHelper = new THREE.DirectionalLightHelper(
		directionalLight,
		0.2,
	);

	directionalLightHelper.visible = false;

	directionalTweaks
		.add(directionalLightHelper, 'visible')
		.name('visualize directional light');

	scene.add(directionalLightHelper);

	const arrowHelper = new THREE.ArrowHelper(
		directionalLight.position.clone().normalize(), // direction
		new THREE.Vector3(0, 0, 0), // origin
		1, // length
		0xffffff, // color
	);

	arrowHelper.visible = false;

	scene.add(arrowHelper);

	// // // // // // // // //
	const directionalLightShadowCameraHelper = new THREE.CameraHelper(
		directionalLight.shadow.camera,
	);

	directionalLightShadowCameraHelper.visible = false;

	scene.add(directionalLightShadowCameraHelper);

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
		.name('renderer.shadowMap.enabled');
	gui
		.add(renderer.shadowMap, 'type', shadowMapAlgoType)
		.name('renderer.shadowMap.type');

	// // // // // // // // // // ---------------------------------
	// gui - Folders ----------------
	// // // // // // // // // // ---------------------------------

	// EXPLAIN: all tweaks we created for environment map
	const envMapTextures = {
		studio: environmentMapTextureStudio,
		lumber: environmentMapTextureLumber,
		glasshouse: environmentMapTextureGlasshouse,
		creek: environmentMapTextureCreek,
		none: null,
	};

	envMapTweaks
		.add(scene, 'environment', envMapTextures)
		.name('scene.environment');
	envMapTweaks
		.add(scene, 'background', envMapTextures)
		.name('scene.background');

	// // // // // // // // // // // // // // // //

	directionalShadowTweaks
		.add({ a: '' }, 'a')
		.disable()
		.name(
			'helper will not work without `renderer.shadowMap.enabled` === `true`',
		);
	directionalShadowTweaks
		.add(directionalLightShadowCameraHelper, 'visible')
		.name('Directional Light Shadow Camera Helper');
	directionalShadowTweaks
		.add({ a: '' }, 'a')
		.disable()
		.name("radius (blur) doesn't work with `THREE.PCFSoftShadowMap`");
	directionalShadowTweaks
		.add(directionalLight.shadow, 'radius')
		.min(-30)
		.max(30)
		.step(0.001)
		.name('directionalLight.shadow.radius (blur)');
	directionalShadowTweaks
		.add(directionalLight.shadow, 'intensity')
		.min(0)
		.max(1)
		.step(0.001)
		.name('directionalLight.shadow.intensity');
	directionalShadowTweaks
		.add(directionalLight.shadow, 'bias')
		.min(-0.0002)
		.max(0.0002)
		.step(0.00001)
		.name('directionalLight.shadow.bias');

	directionalShadowTweaks
		.add({ a: '' }, 'a')
		.disable()
		.name(
			'keep width and height for mapSize the same --------------------------------',
		);
	const shadowMapSizes = {
		128: 128,
		256: 256,
		512: 512,
		1024: 1024,
		2048: 2048,
	};
	directionalShadowTweaks
		.add(directionalLight.shadow.mapSize, 'width', shadowMapSizes)
		.name('directionalLight.shadow.mapSize.width');

	directionalShadowTweaks
		.add(directionalLight.shadow.mapSize, 'height', shadowMapSizes)
		.name('directionalLight.shadow.mapSize.height');

	directionalShadowTweaks
		.add({ a: '' }, 'a')
		.disable()
		.name(
			'--------------------------------------------------------------------------------------------',
		);

	directionalShadowTweaks
		.add(directionalLight.shadow.camera, 'far')
		.name('directionalLight.shadow.camera.far')
		.max(100)
		.min(0.5)
		.step(0.001)
		.onChange(() => {
			directionalLight.shadow.camera.updateProjectionMatrix();
			directionalLightShadowCameraHelper.update();
		});
	directionalShadowTweaks
		.add(directionalLight.shadow.camera, 'near')
		.name('directionalLight.shadow.camera.near')
		.max(100)
		.min(0.5)
		.step(0.001)
		.onChange(() => {
			directionalLight.shadow.camera.updateProjectionMatrix();
			directionalLightShadowCameraHelper.update();
		});
	directionalShadowTweaks
		.add({ a: '' }, 'a')
		.disable()
		.name(
			'--------------------------------------------------------------------------------------------',
		);
	directionalShadowTweaks
		.add(directionalLight.shadow.camera, 'top')
		.min(-8)
		.max(8)
		.step(0.001)
		.name('directionalLight.shadow.camera.top')
		.onChange(() => {
			directionalLight.shadow.camera.updateProjectionMatrix();
			directionalLightShadowCameraHelper.update();
		});
	directionalShadowTweaks
		.add(directionalLight.shadow.camera, 'right')
		.min(-8)
		.max(8)
		.step(0.001)
		.name('directionalLight.shadow.camera.right')
		.onChange(() => {
			directionalLight.shadow.camera.updateProjectionMatrix();
			directionalLightShadowCameraHelper.update();
		});
	directionalShadowTweaks
		.add(directionalLight.shadow.camera, 'bottom')
		.min(-8)
		.max(8)
		.step(0.001)
		.name('directionalLight.shadow.camera.bottom')
		.onChange(() => {
			directionalLight.shadow.camera.updateProjectionMatrix();
			directionalLightShadowCameraHelper.update();
		});
	directionalShadowTweaks
		.add(directionalLight.shadow.camera, 'left')
		.min(-8)
		.max(8)
		.step(0.001)
		.name('directionalLight.shadow.camera.left')
		.onChange(() => {
			directionalLight.shadow.camera.updateProjectionMatrix();
			directionalLightShadowCameraHelper.update();
		});

	// // // // // // // // // // // // // // // // // // // // //
	directionalTweaks.add(directionalLight, 'castShadow');
	directionalTweaks
		.add(directionalLight, 'intensity')
		.min(0)
		.max(6)
		.step(0.001);
	directionalTweaks
		.add(directionalLight.position, 'x')
		.step(0.001)
		.name('position.x')
		.min(-5)
		.max(5);
	directionalTweaks
		.add(directionalLight.position, 'y')
		.step(0.001)
		.name('position.y')
		.min(-5)
		.max(5);
	directionalTweaks
		.add(directionalLight.position, 'z')
		.step(0.001)
		.name('position.z')
		.min(-5)
		.max(5);
	directionalTweaks.addColor(directionalLight, 'color');
	directionalTweaks
		.add(directionalLight.rotation, 'x')
		.min(-2 * Math.PI)
		.max(2 * Math.PI)
		.name('rotation.x')
		.step(0.001);
	directionalTweaks
		.add(directionalLight.rotation, 'y')
		.min(-2 * Math.PI)
		.max(2 * Math.PI)
		.name('rotation.y')
		.step(0.001);
	directionalTweaks
		.add(directionalLight.rotation, 'z')
		.min(-2 * Math.PI)
		.max(2 * Math.PI)
		.name('rotation.z')
		.step(0.001);

	// should be removed -
	directionalTweaks
		.add({ a: '' }, 'a')
		.disable()
		.name(
			"this `directLookAtCenter` isn't doing what I thought it would. Which\n would be pointing to the center of the scene.\nBut it doesen't do an rotations",
		)
		.hide();
	debugObject.directLookAtCenter = () => {
		directionalLight.lookAt(new THREE.Vector3());
	};
	directionalTweaks.add(debugObject, 'directLookAtCenter').hide();
	// -

	directionalTweaks
		.add(directionalLight, 'visible')
		.name('show directional light');

	directionalTweaks
		.add({ a: '' }, 'a')
		.disable()
		.name(
			"The arrow direction is computed **once** at creation and never\nupdated. If you move the directional light, the arrow stays where it\nwas. For a dynamic arrow, you'd need to recreate or manually update\nit each frame.",
		);

	directionalTweaks
		.add(arrowHelper, 'visible')
		.name('what direction is light comming from')
		.hide();

	// // // // // // // // // // // // // // // // // // //
	sphereMeshTweaks.add(sphereMesh, 'castShadow');
	sphereMeshTweaks
		.add(sphereMesh.position, 'x')
		.step(0.001)
		.name('position.x')
		.min(-5)
		.max(5);
	sphereMeshTweaks
		.add(sphereMesh.position, 'y')
		.step(0.001)
		.name('position.y')
		.min(0)
		.max(5);
	sphereMeshTweaks
		.add(sphereMesh.position, 'z')
		.step(0.001)
		.name('position.z')
		.min(-5)
		.max(5);

	// EXPLAIN: added this tweak mainly for overring global env map
	// for this spere material
	// EXPLAIN: but also as I switch between environment maps I don't
	// se any difference just when I set it to null or when I change to
	// some map, chenging between maps looks the same, can you explain
	// what could be the issue
	// and should I opt out from overriding the environment map on the
	// specifiv material and just set global one
	sphereMaterialTweaks.add(sphereMaterial, 'envMap', envMapTextures);
	sphereMaterialTweaks
		.add(sphereMaterial, 'envMapIntensity')
		.step(0.001)
		.min(0)
		.max(5);
	sphereMaterialTweaks
		.add(sphereMaterial, 'metalness')
		.step(0.001)
		.min(0)
		.max(1);
	sphereMaterialTweaks
		.add(sphereMaterial, 'roughness')
		.step(0.001)
		.min(0)
		.max(1);
	// // // // // // // // // // // // // // // // // // //

	// // // // // // // // // // // // // // // // // // //
	floorTweaks.add(floorMesh, 'receiveShadow');

	// // // // // // // // // // // // // // // // // // //

	ambientTweaks
		.add(ambientLight, 'intensity')
		.min(0)
		.max(5)
		.step(0.001);

	ambientTweaks.addColor(ambientLight, 'color');

	ambientTweaks
		.add(ambientLight, 'visible')
		.name('show ambient light');

	// // // // // // // // // // // // // // // // // // //

	// ----------------------------------------------------
	// ----------------------------------------------------
	// ----------------------------------------------------
	// ----------------------------------------------------
	// ----------------------------------------------------
	// 0.2 - Renderer (second part)
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
	renderer.setSize(sizes.width, sizes.height);
	renderer.setClearColor(0x000000, 1);
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

		orbitControls.update();

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
