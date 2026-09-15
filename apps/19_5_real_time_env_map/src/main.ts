import * as THREE from 'three/webgpu';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

// EXPLAIN: we need EXRLoader
import { EXRLoader } from 'three/addons/loaders/EXRLoader.js';

import GUI from 'lil-gui';
// import gsap from 'gsap';

import { getRequiredElement } from './util';

// for loading textures -----------------------------------------

const loadingManager = new THREE.LoadingManager();

// EXPLAIN: we will load some LDR equirectangular maps with this
const textureLoader = new THREE.TextureLoader(loadingManager);

loadingManager.onProgress = (filePaths: string) => {
	console.log('progess ', filePaths);
};
loadingManager.onLoad = () => {
	console.log('image loaded');
};
loadingManager.onError = (e) => {
	console.error(e);
};
loadingManager.onStart = (filePath) => {
	console.log('loading started ', filePath);
};

// for loading models ----------------------------------------
const dracoLoader = new DRACOLoader();

dracoLoader.setDecoderPath('/draco/');
const modelLoadingManager = new THREE.LoadingManager();
const gltfLoader = new GLTFLoader(modelLoadingManager);
gltfLoader.setDRACOLoader(dracoLoader);

modelLoadingManager.onProgress = (filePaths: string) => {
	// console.log('progess ', filePaths);
};
modelLoadingManager.onLoad = () => {
	console.log('model/s loaded');
};
modelLoadingManager.onError = (e) => {
	console.error(e);
};
modelLoadingManager.onStart = (filePath) => {
	console.log('loading started ', filePath);
};

// ---------------------------------------------------------
const canvas = getRequiredElement<HTMLCanvasElement>('canvas#tride');

// Gui -----------------------------------------------------
const gui = new GUI({
	width: 250,
	title: 'Tweaks',
	closeFolders: true,
});
const debugObject = {
	//
};

const envMapTweaks = gui.addFolder('Environment Map');

// const floorTweaks = gui.addFolder('floor Mesh');
const knotTweaks = gui.addFolder('torus knot Mesh and Material');
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

	// EXPLAIN: loading mentioned jpeg format
	// of environment maps that are AI generated
	// LDR equirectangular
	const cabinTexture = await textureLoader.loadAsync(
		'/textures/environmentMaps/ai-images/cabin_interior.jpg',
	);
	const castleTexture = await textureLoader.loadAsync(
		'/textures/environmentMaps/ai-images/castle.jpg',
	);
	const japanTreesTexture = await textureLoader.loadAsync(
		'/textures/environmentMaps/ai-images/japan_trees_cherry.jpg',
	);
	const neonCityTexture = await textureLoader.loadAsync(
		'/textures/environmentMaps/ai-images/neon_city.jpg',
	);
	const sciFiSkyTexture = await textureLoader.loadAsync(
		'/textures/environmentMaps/ai-images/scifi_white_sky.jpg',
	);

	// EXPLAIN: we are not setting our environment map for light
	// so no setting env map to scene.environment (we will also lock this part in gui)
	// scene.environment = cabinTexture;

	// EXPLAIN: but we will set it as background
	scene.background = cabinTexture;

	// EXPLAIN: also we don't want to forget mapping, we
	// explained this when we were deling with LDR in lesson
	// before the previous one
	cabinTexture.mapping = THREE.EquirectangularReflectionMapping;
	castleTexture.mapping = THREE.EquirectangularReflectionMapping;
	japanTreesTexture.mapping = THREE.EquirectangularReflectionMapping;
	neonCityTexture.mapping = THREE.EquirectangularReflectionMapping;
	sciFiSkyTexture.mapping = THREE.EquirectangularReflectionMapping;

	// EXPLAIN: these ones, LDR equirectangular need different
	// colorSpace to look better; without it env map would
	// look washed out ;we explained this when we were deling with LDR in lesson
	// before the previous one
	cabinTexture.colorSpace = THREE.SRGBColorSpace;
	castleTexture.colorSpace = THREE.SRGBColorSpace;
	japanTreesTexture.colorSpace = THREE.SRGBColorSpace;
	neonCityTexture.colorSpace = THREE.SRGBColorSpace;
	sciFiSkyTexture.colorSpace = THREE.SRGBColorSpace;

	// EXPLAIN: I'l lset all of these to be default values
	// scene.environmentIntensity = 1.9; // default is 1.0
	// scene.backgroundBlurriness = 0.2; // default is 0.0
	// scene.backgroundBlurriness = 0;
	// scene.backgroundIntensity = 2.4; // default is 1.0
	// scene.backgroundIntensity = 1;

	// EXPLAIN: here we will define torus that will have emission material
	const iluminatingTorus = new THREE.Mesh(
		new THREE.TorusGeometry(8, 0.4),
		new THREE.MeshBasicMaterial({
			// EXPLAIN: we changed this at the end
			// to have rgb values bigger than 1
			// color: 'white',
			color: new THREE.Color(10, 4, 2),
		}),
	);

	iluminatingTorus.position.y = 1;

	// EXPLAIN: we did this at the end to fix the bug
	iluminatingTorus.layers.enable(1);

	scene.add(iluminatingTorus);

	// EXPLAIN: usage of CubeRenderTarget
	// EXPLAIN: all parameters we used when instantiating
	// CubeRenderTarget
	const cubeRenderTarget = new THREE.CubeRenderTarget(256, {
		type: THREE.HalfFloatType,
		// EXPLAIN: what happens when we set next two properties
		generateMipmaps: true,
		minFilter: THREE.LinearMipMapLinearFilter,
	});

	// EXPLAIN: now we set up texture from cubeRenderTarget as a lighting
	scene.environment = cubeRenderTarget.texture;

	// EXPLAIN: we use CubeCamera
	const cubeCamera = new THREE.CubeCamera(0.1, 100, cubeRenderTarget);

	// EXPLAIN: to fix the mentioned bug at the end we did this
	cubeCamera.layers.set(1);

	scene.add(cubeCamera);
	// ----------------------------------
	// A. ---- Loading Models

	// complex model
	const flightHelmet = await gltfLoader.loadAsync(
		'/models/FlightHelmet/glTF/FlightHelmet.gltf',
	);

	// flightHelmet.scene.traverse((child) => {
	// 	// @ts-expect-error isMesh is a property of Object3D, but TypeScript doesn't know that child is a Mesh
	// 	if (child.isMesh) {
	// 		// ts-expect-error material is a property of Mesh, but TypeScript doesn't know that child is a Mesh
	// 		// console.log(child.material.side); // 2 = THREE.DoubleSide

	// 		child.castShadow = true;
	// 	}
	// });

	flightHelmet.scene.scale.setScalar(10);
	flightHelmet.scene.position.y = -2;

	scene.add(flightHelmet.scene);

	// model I created in blender
	const gamingConsoleModel = await gltfLoader.loadAsync(
		'/models/1_game_console/console-for-export.gltf',
	);

	// console.log(gamingConsoleModel);

	// kept this here only for the reason if you ever revisit this
	// app to see that you can use traverse
	/* gamingConsoleModel.scene.traverse((child) => {
		// @ts-expect-error isMesh is a property of Object3D, but TypeScript doesn't know that child is a Mesh
		if (child.isMesh) {
			// ts-expect-error material is a property of Mesh, but TypeScript doesn't know that child is a Mesh
			// console.log(child.material.side); // 2 = THREE.DoubleSide

			// enabled shadows here
			child.castShadow = true;
		}
	}); */

	gamingConsoleModel.scene.scale.setScalar(21);

	gamingConsoleModel.scene.position.x = -4;

	scene.add(gamingConsoleModel.scene);
	// ------------------------------------------------------
	// 2 - Shadows stuff globaly related

	// renderer.shadowMap.enabled = true;
	// renderer.shadowMap.type = THREE.PCFSoftShadowMap;
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

	ambientLight.visible = false;

	scene.add(ambientLight);

	// // // // // // // // -------------------------------

	const directionalLight = new THREE.DirectionalLight(0xffffff);
	directionalLight.intensity = 0.4 * Math.PI;
	directionalLight.position.set(5, 5, 5);

	directionalLight.visible = false;

	// ----------------------------------------------------------
	//  5.1 - Shadow stuff related to directional light

	// console.log(directionalLight.shadow);
	// console.log(directionalLight.shadow.camera);

	// directionalLight.castShadow = true;

	//
	// directionalLight.shadow.mapSize.width = 1024;
	// directionalLight.shadow.mapSize.height = 1024;
	// directionalLight.shadow.mapSize.setScalar(1024);

	// directionalLight.shadow.camera.near = 1;
	// directionalLight.shadow.camera.far = 15;
	// directionalLight.shadow.camera.top = 7;
	// directionalLight.shadow.camera.right = 7;
	// directionalLight.shadow.camera.bottom = -7;
	// directionalLight.shadow.camera.left = -7;
	// doesn't work with PCFSoftShadowMap
	// directionalLight.shadow.radius = 10;
	// using defaults anyway
	// directionalLight.shadow.intensity = 1; // default
	// directionalLight.shadow.bias = 0.0002; // also default

	// -----------------------------------------------------------
	scene.add(directionalLight);

	// -----------------------------------------------------
	// 6 - Geometries Materials Meshes

	const knotGeometry = new THREE.TorusKnotGeometry(1.5, 0.5, 100, 16);
	const knotMaterial = new THREE.MeshStandardMaterial();
	knotMaterial.color = new THREE.Color(0xaaaaaa);

	knotMaterial.roughness = 0.1;
	knotMaterial.metalness = 1;
	const knotMesh = new THREE.Mesh(knotGeometry, knotMaterial);

	knotMesh.position.set(4.5, 2);
	knotMesh.scale.setScalar(0.6);

	knotMesh.castShadow = true;
	// knotMesh.visible = false;

	scene.add(knotMesh);

	/* const floorGeometry = new THREE.PlaneGeometry(10, 10);
	const floorMaterial = new THREE.MeshStandardMaterial();
	floorMaterial.roughness = 0.4;
	floorMaterial.metalness = 0.3;
	floorMaterial.color = new THREE.Color('#928192');
	const floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);

	floorMesh.scale.setScalar(3);

	floorMesh.rotation.x = -Math.PI / 2;
	floorMesh.receiveShadow = true;

	floorMesh.visible = false;
	//  ------------------------

	scene.add(floorMesh); */

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

	camera.position.set(-8, 2, 6);

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

	// EXPLAIN: don't think we would need other env maps
	// besides cabin one, but they are all here available through gui
	const myEnvMaps = {
		cabin: cabinTexture,
		castle: castleTexture,
		japan_trees: japanTreesTexture,
		neon_city: neonCityTexture,
		sci_fi_sky: sciFiSkyTexture,
		none: null,
	};

	// EXPLAIN: we are disabling setting env map as environment (as light)
	envMapTweaks
		.add(scene, 'environment', myEnvMaps)
		.name('scene.environment')
		.disable();

	// EXPLAIN: you can still switch environment maps for background
	envMapTweaks
		.add(scene, 'background', myEnvMaps)
		.name('scene.background');

	envMapTweaks
		.add(scene, 'environmentIntensity')
		.min(0)
		.max(5)
		.step(0.001)
		.name('scene.environmentIntensity');
	envMapTweaks
		.add(scene, 'backgroundBlurriness')
		.min(0)
		.max(1)
		.step(0.001)
		.name('scene.backgroundBlurriness');
	envMapTweaks
		.add(scene, 'backgroundIntensity')
		.min(0)
		.max(10)
		.step(0.001)
		.name('scene.backgroundIntensity');

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

	// // // // // // // // // // // // // // // // // // //
	knotTweaks.add(knotMesh, 'visible');
	knotTweaks.add(knotMesh, 'receiveShadow');
	knotTweaks.add(knotMaterial, 'roughness').min(0).max(1).step(0.001);
	knotTweaks.add(knotMaterial, 'metalness').min(0).max(1).step(0.001);

	// // // // // // // // // // // // // // // // // // //
	// floorTweaks.add(floorMesh, 'receiveShadow');
	// floorTweaks.add(floorMesh, 'visible');

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

		// EXPLAIN: we are rotating lighting torus by x
		iluminatingTorus.rotation.x =
			Math.sin(timer.getElapsed() * 0.2) * 2;

		// EXPLAIN: updating cumeCamera on each frame
		cubeCamera.update(renderer, scene);

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
