// import * as THREE from 'three/webgpu';
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

const textureLoadingManger = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(textureLoadingManger);

textureLoadingManger.onProgress = (filePaths: string) => {
	console.log('progess ', filePaths);
};
textureLoadingManger.onLoad = () => {
	console.log('texture loaded');
};
textureLoadingManger.onError = (e) => {
	console.error(e);
};
textureLoadingManger.onStart = (filePath) => {
	console.log('loading started ', filePath);
};

//

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
const envMapTweaks = gui.addFolder('Environment Map');

// const ambientTweaks = gui.addFolder('Ambient Light');
// ambientTweaks.close();
const directionalTweaks = gui.addFolder('Directional Light');
const directionalShadowTweaks = gui.addFolder(
	'Directional Light Shadow tweaks',
);

const allGroupTweaks = gui.addFolder(
	'group with floor, walls, models',
);

const textureProblemTweaks = gui.addFolder(
	"Textures tweaks (for normal map problem we didn't solve)",
);

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

	// scene.environmentIntensity = 2.1; // default is 1.0
	// scene.environmentIntensity = 1.6; // default is 1.0
	scene.environmentIntensity = 1.2; // default is 1.0

	// using defaults for now but you can change them with gui
	// scene.backgroundBlurriness = 0.2; // default is 0.0
	// scene.backgroundBlurriness = 0;
	// scene.backgroundIntensity = 2.4; // default is 1.0
	// scene.backgroundIntensity = 1;

	// ----------------------------------
	// A. ---- Loading Textures
	const woodFloorARMTexture = await textureLoader.loadAsync(
		'/textures/old_wooden_floor_03_1k/old_wooden_floor_03_arm_1k.jpg',
	);
	const woodFloorAlbedoTexture = await textureLoader.loadAsync(
		'/textures/old_wooden_floor_03_1k/old_wooden_floor_03_diff_1k.jpg',
	);
	const woodFloorNormalTexture = await textureLoader.loadAsync(
		'/textures/old_wooden_floor_03_1k/old_wooden_floor_03_nor_gl_1k.png',
	);
	const crackedConcretARMTexture = await textureLoader.loadAsync(
		'/textures/cracked_concrete_wall_1k/cracked_concrete_wall_arm_1k.jpg',
	);
	const crackedConcretAlbedoTexture = await textureLoader.loadAsync(
		'/textures/cracked_concrete_wall_1k/cracked_concrete_wall_diff_1k.jpg',
	);
	const crackedConcretNormalTexture = await textureLoader.loadAsync(
		'/textures/cracked_concrete_wall_1k/cracked_concrete_wall_nor_gl_1k.png',
	);

	// ----------------------------------
	// B. ---- Loading Models

	// complex model
	const flightHelmet = await gltfLoader.loadAsync(
		'/models/FlightHelmet/glTF/FlightHelmet.gltf',
	);

	flightHelmet.scene.traverse((child) => {
		// @ts-expect-error isMesh is a property of Object3D, but TypeScript doesn't know that child is a Mesh
		if (child.isMesh && child.material.isMeshStandardMaterial) {
			// ts-expect-error material is a property of Mesh, but TypeScript doesn't know that child is a Mesh
			// console.log(child.material.side); // 2 = THREE.DoubleSide

			child.castShadow = true;

			child.receiveShadow = true;
		}
	});

	flightHelmet.scene.scale.setScalar(10);
	flightHelmet.scene.position.y = -2;

	// scene.add(flightHelmet.scene);

	// model I created in blender
	const gamingConsoleModel = await gltfLoader.loadAsync(
		'/models/1_game_console/console-for-export.gltf',
	);

	// console.log(gamingConsoleModel);

	gamingConsoleModel.scene.traverse((child) => {
		// @ts-expect-error isMesh is a property of Object3D, but TypeScript doesn't know that child is a Mesh
		if (child.isMesh && child.material.isMeshStandardMaterial) {
			// ts-expect-error material is a property of Mesh, but TypeScript doesn't know that child is a Mesh
			// console.log(child.material.side); // 2 = THREE.DoubleSide

			// enabled shadows here
			child.castShadow = true;

			child.receiveShadow = true;
		}
	});

	gamingConsoleModel.scene.scale.setScalar(21);

	gamingConsoleModel.scene.position.x = -2;
	gamingConsoleModel.scene.position.y = -2;
	gamingConsoleModel.scene.position.z = -3.4;

	// gamingConsoleModel.scene.rotation.y = -Math.PI / 3;

	// scene.add(gamingConsoleModel.scene);
	// ------------------------------------------------------
	// 2 - Shadows stuff globaly related

	renderer.shadowMap.enabled = true;

	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	// renderer.shadowMap.type = THREE.PCFShadowMap; // default

	// ------------------------------------------------------
	// 3 -  texture stuff
	// colorSpace, magFilter and stuff
	//

	// base color texture should be annotated with
	//  THREE.SRGBColorSpace or THREE.LinearSRGBColorSpace
	woodFloorAlbedoTexture.colorSpace = THREE.SRGBColorSpace;
	crackedConcretAlbedoTexture.colorSpace = THREE.SRGBColorSpace;
	// default is THREE.NoColorSpace

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

	const directionalLight = new THREE.DirectionalLight(0xffffff);
	// directionalLight.intensity = 0.4 * Math.PI;
	// directionalLight.intensity = 1.895;
	directionalLight.intensity = 4.8;

	// directionalLight.position.set(6, 10, 6);
	directionalLight.position.set(5, 6, 5);
	// directionalLight.visible = false;

	directionalLight.target.position.set(0, 3, 0);

	directionalLight.target.updateWorldMatrix(true, false);

	// ----------------------------------------------------------
	//  5.1 - Shadow stuff related to directional light

	// console.log(directionalLight.shadow);
	// console.log(directionalLight.shadow.camera);

	directionalLight.castShadow = true;

	// directionalLight.shadow.mapSize.width = 1024;
	// directionalLight.shadow.mapSize.height = 1024;
	directionalLight.shadow.mapSize.setScalar(512);
	// shadow.radius doesn't work with PCFSoftShadowMap
	// directionalLight.shadow.radius = 10;
	// using defaults anyway
	directionalLight.shadow.intensity = 1; // default
	// directionalLight.shadow.bias = 0.0002; // also default

	// tweaking normalBias and bias
	directionalLight.shadow.bias = -0.0005;
	// directionalLight.shadow.bias = -0.001;
	directionalLight.shadow.normalBias = 0.03;
	// directionalLight.shadow.normalBias = 0.01;

	// directionalLight.shadow.camera.near = 1;
	directionalLight.shadow.camera.near = 2;
	// directionalLight.shadow.camera.far = 15;
	// directionalLight.shadow.camera.far = 25;
	directionalLight.shadow.camera.far = 20;
	// directionalLight.shadow.camera.top = 7;
	// directionalLight.shadow.camera.right = 7;
	// directionalLight.shadow.camera.bottom = -7;
	// directionalLight.shadow.camera.left = -7;
	directionalLight.shadow.camera.top = 9;
	directionalLight.shadow.camera.right = 9;
	directionalLight.shadow.camera.bottom = -9;
	directionalLight.shadow.camera.left = -9;

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

	const floorAndWallGroup = new THREE.Group();

	const allGroup = new THREE.Group();

	// instead of PlaneGeometry, let's try
	// box in order to fix the shadow problem
	const floorGeometry = new THREE.PlaneGeometry(8, 8);
	// const floorGeometry = new THREE.BoxGeometry(8, 8, 0.2);
	// floorGeometry.setAttribute('uv2', floorGeometry.attributes.uv);
	const floorMaterial = new THREE.MeshStandardMaterial();
	floorMaterial.map = woodFloorAlbedoTexture;
	floorMaterial.normalMap = woodFloorNormalTexture;
	floorMaterial.aoMap = woodFloorARMTexture;
	floorMaterial.roughnessMap = woodFloorARMTexture;
	floorMaterial.metalnessMap = woodFloorARMTexture;

	// floorMaterial.roughness = 0.4;
	// floorMaterial.metalness = 0.3;
	// floorMaterial.color = new THREE.Color('#928192');
	const floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);

	floorMesh.scale.setScalar(1.5);

	floorMesh.rotation.x = -Math.PI / 2;
	floorMesh.position.y = -2;

	floorMesh.receiveShadow = true;
	// floorMesh.visible = false;

	// instead of PlaneGeometry, let's try
	// box in order to fix the shadow problem
	const wallGeometry = new THREE.PlaneGeometry(8, 8);
	// const wallGeometry = new THREE.BoxGeometry(8, 8, 0.3);
	// wallGeometry.setAttribute('uv2', wallGeometry.attributes.uv);

	const wallMaterial = new THREE.MeshStandardMaterial();
	// wallMaterial.shadowSide = THREE.FrontSide;
	wallMaterial.map = crackedConcretAlbedoTexture;
	// ignore this flipping, I thought it woul help but it is already set up
	// crackedConcretNormalTexture.flipY = true;
	wallMaterial.normalMap = crackedConcretNormalTexture;
	wallMaterial.aoMap = crackedConcretARMTexture;
	wallMaterial.roughnessMap = crackedConcretARMTexture;
	wallMaterial.metalnessMap = crackedConcretARMTexture;
	// wallMaterial.roughness = 0.4;
	// wallMaterial.metalness = 0.3;
	// wallMaterial.color = new THREE.Color('#928192');
	// I had a problem where I couldn't see the
	// shadow on the wall only when normalMap is set, so I
	// tried to lower the Vector2 values for normalScale, from (1, 1) to
	//  (0.2, 0.2), and it didn't work
	// wallMaterial.normalScale = new THREE.Vector2(0.2, 0.2);
	//
	const wallMesh = new THREE.Mesh(wallGeometry, wallMaterial);
	wallMesh.scale.setScalar(1.5);
	wallMesh.position.z = -6;
	wallMesh.position.y = 4;

	wallMesh.receiveShadow = true;

	floorAndWallGroup.add(floorMesh, wallMesh);

	floorAndWallGroup.rotation.y = Math.PI / 4;

	//
	allGroup.add(
		floorAndWallGroup,
		gamingConsoleModel.scene,
		flightHelmet.scene,
	);

	scene.add(allGroup);

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
		0.4,
	);
	// directionalLightHelper.visible = false;

	scene.add(directionalLightHelper);

	// // // // // // // // //
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

	//
	directionalTweaks
		.add(directionalLight.target.position, 'x')
		.step(0.001)
		.name('target.position.x')
		.min(-10)
		.max(10)
		.onChange(() => {
			directionalLight.target.updateWorldMatrix(true, false);
			directionalLightHelper.update();

			directionalLightShadowCameraHelper.update();
		});
	directionalTweaks
		.add(directionalLight.target.position, 'y')
		.step(0.001)
		.name('target.position.y')
		.min(-10)
		.max(10)
		.onChange(() => {
			directionalLight.target.updateWorldMatrix(true, false);
			directionalLightHelper.update();
			//
			directionalLightShadowCameraHelper.update();
		});
	directionalTweaks
		.add(directionalLight.target.position, 'z')
		.step(0.001)
		.name('target.position.z')
		.min(-10)
		.max(10)
		.onChange(() => {
			directionalLight.target.updateWorldMatrix(true, false);
			directionalLightHelper.update();
			//
			directionalLightShadowCameraHelper.update();
		});

	// -

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
		.max(2)
		.step(0.001)
		.name('directionalLight.shadow.intensity');
	directionalShadowTweaks
		.add(directionalLight.shadow, 'bias')
		.min(-0.001)
		.max(0.001)
		.step(0.00001)
		.name('directionalLight.shadow.bias');

	directionalShadowTweaks
		.add(directionalLight.shadow, 'normalBias')
		.min(0)
		.max(0.5)
		.step(0.001)
		.name('directionalLight.shadow.normalBias');

	directionalShadowTweaks
		.add(
			directionalLight.shadow.mapSize,
			'width',
			[128, 256, 512, 1024, 2048, 4096],
		)
		.onChange(() => {
			directionalLight.shadow.mapSize.height =
				directionalLight.shadow.mapSize.width;
			directionalLight.shadow.map?.dispose();
			directionalLight.shadow.map = null; // forces regeneration at new size
		})
		.name('directionalLight.shadow.mapSize.width/height');

	/* const shadowMapSizes = {
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
		.name('directionalLight.shadow.mapSize.height'); */

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
		.min(-15)
		.max(15)
		.step(0.001)
		.name('directionalLight.shadow.camera.top')
		.onChange(() => {
			directionalLight.shadow.camera.updateProjectionMatrix();
			directionalLightShadowCameraHelper.update();

			directionalLightHelper.update();
		});
	directionalShadowTweaks
		.add(directionalLight.shadow.camera, 'right')
		.min(-15)
		.max(15)
		.step(0.001)
		.name('directionalLight.shadow.camera.right')
		.onChange(() => {
			directionalLight.shadow.camera.updateProjectionMatrix();
			directionalLightShadowCameraHelper.update();

			directionalLightHelper.update();
		});
	directionalShadowTweaks
		.add(directionalLight.shadow.camera, 'bottom')
		.min(-15)
		.max(15)
		.step(0.001)
		.name('directionalLight.shadow.camera.bottom')
		.onChange(() => {
			directionalLight.shadow.camera.updateProjectionMatrix();
			directionalLightShadowCameraHelper.update();

			directionalLightHelper.update();
		});
	directionalShadowTweaks
		.add(directionalLight.shadow.camera, 'left')
		.min(-15)
		.max(15)
		.step(0.001)
		.name('directionalLight.shadow.camera.left')
		.onChange(() => {
			directionalLight.shadow.camera.updateProjectionMatrix();
			directionalLightShadowCameraHelper.update();

			directionalLightHelper.update();
		});
	// // // // // // // // // // // // // // // //
	allGroupTweaks
		.add(allGroup.rotation, 'x')
		.min(-Math.PI)
		.max(Math.PI)
		.step(0.001)
		.name('allGroup.rotation.x');
	allGroupTweaks
		.add(allGroup.rotation, 'y')
		.min(-Math.PI)
		.max(Math.PI)
		.step(0.001)
		.name('allGroup.rotation.y');
	allGroupTweaks
		.add(allGroup.rotation, 'z')
		.min(-Math.PI)
		.max(Math.PI)
		.step(0.001)
		.name('allGroup.rotation.z');

	// // // // // // // // // // // // // // // //

	textureProblemTweaks
		.add({ a: '' }, 'a')
		.disable()
		.name(
			'remove normal map from wall material to see if shadow is visible on\n wall texture',
		);
	textureProblemTweaks
		.add(wallMaterial, 'normalMap', {
			use_map: crackedConcretNormalTexture,
			do_not_use: null,
		})
		.onChange(() => {
			wallMaterial.needsUpdate = true;
		})
		.name('wallMaterial.normalMap');
	textureProblemTweaks
		.add({ a: '' }, 'a')
		.disable()
		.name(
			'try rotating the wall full circle and chec if shadow shows up',
		);
	textureProblemTweaks
		.add(wallMesh.rotation, 'x')
		.min(-Math.PI)
		.max(Math.PI)
		.step(0.001)
		.step(0.001)
		.name('wallMesh.rotation.x');

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
