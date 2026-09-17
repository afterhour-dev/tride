// using WEbGL instead of WebGPU because of the problem we
// covered in 20.2
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js';

import GUI from 'lil-gui';
// import gsap from 'gsap';

import { getRequiredElement } from './util';

// for loading textures -----------------------------------------
const hdrLoadingManager = new THREE.LoadingManager();
// const textureLoader = new THREE.TextureLoader(loadingManager);

const hdriLoader = new HDRLoader(hdrLoadingManager);

hdrLoadingManager.onProgress = (filePaths: string) => {
	console.log('progess ', filePaths);
};
hdrLoadingManager.onLoad = () => {
	console.log('hdri loaded');
};
hdrLoadingManager.onError = (e) => {
	console.error(e);
};
hdrLoadingManager.onStart = (filePath) => {
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
	width: 350,
	title: 'Tweaks',
	closeFolders: true,
});
const debugObject = {
	//
};

const toneAntAliasTweaks = gui.addFolder(
	'Tone Mapping and antialiasing',
);
toneAntAliasTweaks.open();
const envMapTweaks = gui.addFolder('Environment Map');

// const floorTweaks = gui.addFolder('floor Mesh');
// const knotTweaks = gui.addFolder('torus knot Mesh and Material');
// const ambientTweaks = gui.addFolder('Ambient Light');
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
	/* const renderer = new THREE.WebGPURenderer({
		canvas,

		antialias: true,
	}); */
	// using WEbGL instead of WebGPU because of the problem we
	// covered in 20.2
	const renderer = new THREE.WebGLRenderer({
		canvas,

		antialias: true,
	});

	// renderer.toneMapping = THREE.NoToneMapping;// default
	renderer.toneMapping = THREE.ReinhardToneMapping;

	// renderer.toneMappingExposure = 2;
	renderer.toneMappingExposure = 3;

	// using WEbGL instead of WebGPU because of the problem we
	// covered in 20.2
	// await renderer.init();

	// -----------------------------------------------------
	// 1 - Environment

	const environmentMapAbandonedGarageTexture =
		await hdriLoader.loadAsync(
			'/textures/environmentMaps/abandoned_garage/2k.hdr',
		);

	scene.environment = environmentMapAbandonedGarageTexture;
	scene.background = environmentMapAbandonedGarageTexture;

	environmentMapAbandonedGarageTexture.mapping =
		THREE.EquirectangularReflectionMapping;

	// EXPLAIN: I think I'll lower it a little bit to better see shadows
	// scene.environmentIntensity = 2.1; // default is 1.0
	scene.environmentIntensity = 1.6; // default is 1.0

	// using defaults for now but you can change them with gui
	// scene.backgroundBlurriness = 0.2; // default is 0.0
	// scene.backgroundBlurriness = 0;
	// scene.backgroundIntensity = 2.4; // default is 1.0
	// scene.backgroundIntensity = 1;
	// ----------------------------------
	// A. ---- Loading Models

	// complex model
	const flightHelmet = await gltfLoader.loadAsync(
		'/models/FlightHelmet/glTF/FlightHelmet.gltf',
	);

	// EXPLAIN: flight helmet meshes need to cast the shadow
	// but only meshes that have MeshStandardMaterial can cast shadows,
	// so we will check for that
	flightHelmet.scene.traverse((child) => {
		// @ts-expect-error isMesh is a property of Object3D, but TypeScript doesn't know that child is a Mesh
		if (child.isMesh && child.material.isMeshStandardMaterial) {
			// ts-expect-error material is a property of Mesh, but TypeScript doesn't know that child is a Mesh
			// console.log(child.material.side); // 2 = THREE.DoubleSide

			child.castShadow = true;

			// EXPLAIN: but this time our meshes should also receive shadows,
			// to increase realism so we will enable that also
			child.receiveShadow = true;
		}
	});

	flightHelmet.scene.scale.setScalar(10);
	flightHelmet.scene.position.y = -2;

	scene.add(flightHelmet.scene);

	// model I created in blender
	const gamingConsoleModel = await gltfLoader.loadAsync(
		'/models/1_game_console/console-for-export.gltf',
	);

	// console.log(gamingConsoleModel);

	// EXPLAIN: gaming console needs to cast shadow also
	// we could isolate this logic in separate function and use it
	// for all models we load, but we did it here anyway
	gamingConsoleModel.scene.traverse((child) => {
		// @ts-expect-error isMesh is a property of Object3D, but TypeScript doesn't know that child is a Mesh
		if (child.isMesh && child.material.isMeshStandardMaterial) {
			// ts-expect-error material is a property of Mesh, but TypeScript doesn't know that child is a Mesh
			// console.log(child.material.side); // 2 = THREE.DoubleSide

			// enabled shadows here
			child.castShadow = true;

			// EXPLAIN: but this time our meshes should also receive shadows,
			// to increase realism so we will enable that also
			child.receiveShadow = true;
		}
	});

	gamingConsoleModel.scene.scale.setScalar(21);

	// EXPLAIN: we will place gaming console so shadow of the flight helmet
	// catches the gaming console,
	gamingConsoleModel.scene.position.x = -2.1;
	gamingConsoleModel.scene.position.y = -2;
	gamingConsoleModel.scene.position.z = -4.2;

	// gamingConsoleModel.scene.rotation.y = -Math.PI / 3;

	scene.add(gamingConsoleModel.scene);
	// ------------------------------------------------------
	// 2 - Shadows stuff globaly related

	// EXPLAIN: enabling shadow map
	renderer.shadowMap.enabled = true;
	// EXPLAIN: picking PCFSoftShadowMap
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	// renderer.shadowMap.type = THREE.PCFShadowMap; // default

	// ------------------------------------------------------
	// 3 -  texture stuff
	// colorSpace, magFilter and stuff

	// ------------------------------------------------------
	// 4 - Text - font loading, TextGeometry, material, mesh

	// --------------------------------------------------
	// 5 - Lights

	/* const ambientLight = new THREE.AmbientLight();
	ambientLight.color = new THREE.Color(0xffffff);
	// ambientLight.intensity = 0.3;
	ambientLight.intensity = 2.1;
	// not showing lights
	ambientLight.visible = false;

	scene.add(ambientLight);
 */
	// // // // // // // // -------------------------------

	// EXPLAIN: so we will make our directional light visible
	// and also we will place it rougly where source of light is in
	// environment map; and light helper can help us to place the light
	// we can also add position to the gui which we did
	const directionalLight = new THREE.DirectionalLight(0xffffff);
	// directionalLight.intensity = 0.4 * Math.PI;
	// directionalLight.intensity = 1.895;
	directionalLight.intensity = Math.PI;
	directionalLight.position.set(6, 10, 6);
	// directionalLight.visible = false;

	// EXPLAIN: setting target of directional light.
	// by default it is in 0,0,0 but we want to lift it a little bit
	// so it goes closer to the middle of the flight helmet model, and
	// not at its base since flight helmet is placed at 0,0,0
	directionalLight.target.position.set(0, 3, 0);
	// EXPLAIN: so in some tutorial this changing of posi(tion of target didn't
	// work, but it worked for me (So why there i nsome older version
	// it didn't work? And they were using WebGL is that matters?)
	// So I did it it anyway to be consistent (updating ow world matrix), because I needed
	// to do it in onChange of gui (there I needed to do it because it didn't work)
	directionalLight.target.updateWorldMatrix(true, false);

	// ----------------------------------------------------------
	//  5.1 - Shadow stuff related to directional light

	// console.log(directionalLight.shadow);
	// console.log(directionalLight.shadow.camera);

	// EXPLAIN: directional light needs to cast the shadow
	directionalLight.castShadow = true;

	// EXPLAIN: and we are setting shadow map settings
	// and other shadow settings we can change with gui also
	// directionalLight.shadow.mapSize.width = 1024;
	// directionalLight.shadow.mapSize.height = 1024;
	// EXPLAIN: to improve performance we will lower shadow map
	// resolution
	directionalLight.shadow.mapSize.setScalar(512);
	// doesn't work with PCFSoftShadowMap
	directionalLight.shadow.radius = 10;
	// using defaults anyway
	directionalLight.shadow.intensity = 1; // default
	directionalLight.shadow.bias = 0.0002; // also default

	// EXPLAIN: also setting shadow camera settings
	// we can change with gui also
	directionalLight.shadow.camera.near = 1;
	// directionalLight.shadow.camera.far = 15;
	directionalLight.shadow.camera.far = 25;
	directionalLight.shadow.camera.top = 7;
	directionalLight.shadow.camera.right = 7;
	directionalLight.shadow.camera.bottom = -7;
	directionalLight.shadow.camera.left = -7;

	// -----------------------------------------------------------
	scene.add(directionalLight);

	// -----------------------------------------------------
	// 6 - Geometries Materials Meshes

	/* const knotGeometry = new THREE.TorusKnotGeometry(1.5, 0.5, 100, 16);
	const knotMaterial = new THREE.MeshStandardMaterial();
	knotMaterial.color = new THREE.Color(0xaaaaaa);
	knotMaterial.roughness = 0.1;
	knotMaterial.metalness = 1;
	const knotMesh = new THREE.Mesh(knotGeometry, knotMaterial);

	knotMesh.position.set(8, 4);

	knotMesh.castShadow = true;
	// knotMesh.visible = false;

	scene.add(knotMesh); */
	// EXPLAIN: untill we make better floor and walls
	// with textures and materials, we will make a simple floor
	// to test shadows, and we will make it bigger than the default 10x10 plane
	const floorGeometry = new THREE.PlaneGeometry(10, 10);
	const floorMaterial = new THREE.MeshStandardMaterial();
	floorMaterial.roughness = 0.4;
	floorMaterial.metalness = 0.3;
	floorMaterial.color = new THREE.Color('#928192');
	const floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);

	floorMesh.scale.setScalar(3);

	floorMesh.rotation.x = -Math.PI / 2;
	floorMesh.position.y = -2;
	floorMesh.receiveShadow = true;

	// floorMesh.visible = false;
	//  ------------------------

	scene.add(floorMesh);

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

	// EXPLAIN: we will make this helper visible
	const directionalLightHelper = new THREE.DirectionalLightHelper(
		directionalLight,
		0.2,
	);
	// directionalLightHelper.visible = false;

	scene.add(directionalLightHelper);

	// // // // // // // // //
	// EXPLAIN: we will also make visible shadow camera helper
	const directionalLightShadowCameraHelper = new THREE.CameraHelper(
		directionalLight.shadow.camera,
	);
	// directionalLightShadowCameraHelper.visible = false;

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

	const toneMappingValues = {
		NoToneMapping: THREE.NoToneMapping,
		LinearToneMapping: THREE.LinearToneMapping,
		ReinhardToneMapping: THREE.ReinhardToneMapping,
		CineonToneMapping: THREE.CineonToneMapping,
		ACESFilmicToneMapping: THREE.ACESFilmicToneMapping,
	};

	toneAntAliasTweaks
		.add(renderer, 'toneMapping', toneMappingValues)
		.name('renderer.toneMapping');

	toneAntAliasTweaks
		.add(renderer, 'toneMappingExposure')
		.min(1)
		.max(10)
		.step(0.001)
		.name('renderer.toneMappingExposure');

	// // // // // // // // // // // // // // // // // // // // //
	const myEnvMaps = {
		abandoned_garage: environmentMapAbandonedGarageTexture,

		none: null,
	};

	envMapTweaks
		.add(scene, 'environment', myEnvMaps)
		.name('scene.environment');
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

	// // // // // // // // // // // // // // // // // // // // //

	// EXPLAIN: these directional light tweaks are important now
	// since as we use gui in oour app it is easier to adopt
	// values that will make scene more realistic
	directionalTweaks
		.add(directionalLight, 'visible')
		.name('show directional light');

	directionalTweaks
		.add(directionalLightHelper, 'visible')
		.name('helper');
	directionalTweaks.add(directionalLight, 'castShadow');
	directionalTweaks
		.add(directionalLight, 'intensity')
		.min(0)
		.max(10)
		.step(0.001);
	directionalTweaks
		.add(directionalLight.position, 'x')
		.step(0.001)
		.name('position.x')
		.min(-10)
		.max(10);
	directionalTweaks
		.add(directionalLight.position, 'y')
		.step(0.001)
		.name('position.y')
		.min(-10)
		.max(10);
	directionalTweaks
		.add(directionalLight.position, 'z')
		.step(0.001)
		.name('position.z')
		.min(-10)
		.max(10);
	directionalTweaks.addColor(directionalLight, 'color');
	// EXPLAIN: it seams that rotation of directional ligh
	// isn't doing anything so I am commenting it out
	// since I am changing position of light and its target position,
	// I don't need to change its rotation
	/* directionalTweaks
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
 */
	//
	directionalTweaks
		.add(directionalLight.target.position, 'x')
		.step(0.001)
		.name('target.position.x')
		.min(-10)
		.max(10)
		.onChange(() => {
			// EXPLAIN: this kind of update we did here
			// directionalLight.target.updateMatrixWorld();
			directionalLight.target.updateWorldMatrix(true, false);
			directionalLightHelper.update();
		});
	directionalTweaks
		.add(directionalLight.target.position, 'y')
		.step(0.001)
		.name('target.position.y')
		.min(-10)
		.max(10)
		.onChange(() => {
			// directionalLight.target.updateMatrixWorld();
			directionalLight.target.updateWorldMatrix(true, false);
			directionalLightHelper.update();
		});
	directionalTweaks
		.add(directionalLight.target.position, 'z')
		.step(0.001)
		.name('target.position.z')
		.min(-10)
		.max(10)
		.onChange(() => {
			// directionalLight.target.updateMatrixWorld();
			directionalLight.target.updateWorldMatrix(true, false);
			directionalLightHelper.update();
		});

	// -

	// // // // // // // // // // // // // // // //

	// EXPLAIN: also these tweaks of shadow camera are now important to
	// set them right
	// EXPLAIN: did I make any mistakes for the min and max values for the shadow camera settings?

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
			// EXPLAIN: this kind of update we did here
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

	// // // // // // // // // // // // // // // // // // //
	/* knotTweaks.add(knotMesh, 'visible');
	knotTweaks.add(knotMesh, 'receiveShadow');
	knotTweaks.add(knotMaterial, 'roughness').min(0).max(1).step(0.001);
	knotTweaks.add(knotMaterial, 'metalness').min(0).max(1).step(0.001);
 */
	// // // // // // // // // // // // // // // // // // //
	// floorTweaks.add(floorMesh, 'receiveShadow');
	// floorTweaks.add(floorMesh, 'visible');

	// // // // // // // // // // // // // // // // // // //

	/* ambientTweaks
		.add(ambientLight, 'intensity')
		.min(0)
		.max(5)
		.step(0.001);

	ambientTweaks.addColor(ambientLight, 'color');

	ambientTweaks
		.add(ambientLight, 'visible')
		.name('show ambient light'); */

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
