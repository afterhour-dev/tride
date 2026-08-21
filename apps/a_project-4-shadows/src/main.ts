import * as THREE from 'three/webgpu';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import GUI from 'lil-gui';
// import gsap from 'gsap';

import { getRequiredElement } from './util';

import { createWallBoxGeometry } from './geo-util';

export type Three = typeof THREE;

// loading textures -----------------------------------------
const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManager);

loadingManager.onError = (e) => {
	console.error('Texture loading error: ', e);
};
loadingManager.onProgress = (path) => {
	// console.log('Texture loaded', path);
};

const albedoDoorTexture = textureLoader.load(
	'/textures/wooden_door/Door_Wood_001_basecolor.jpg',
);
const aoDoorTexture = textureLoader.load(
	'/textures/wooden_door/Door_Wood_001_ambientOcclusion.jpg',
);
const heightDoorTexture = textureLoader.load(
	'/textures/wooden_door/Door_Wood_001_height.png',
);
const metalnessDoorTexture = textureLoader.load(
	'/textures/wooden_door/Door_Wood_001_metallic.jpg',
);
const normalDoorTexture = textureLoader.load(
	'/textures/wooden_door/Door_Wood_001_normal.jpg',
);
const alphaDoorTexture = textureLoader.load(
	'/textures/wooden_door/Door_Wood_001_opacity.jpg',
);
const roughnessDoorTexture = textureLoader.load(
	'/textures/wooden_door/Door_Wood_001_roughness.jpg',
);
const albedoBricksTexture = textureLoader.load(
	'/textures/bricks/Stylized_Bricks_004_basecolor.png',
);
const aoBricksTexture = textureLoader.load(
	'/textures/bricks/Stylized_Bricks_004_ambientOcclusion.png',
);
const heightBricksTexture = textureLoader.load(
	'/textures/bricks/Stylized_Bricks_004_height.png',
);
const normalBricksTexture = textureLoader.load(
	'/textures/bricks/Stylized_Bricks_004_normal.png',
);
const roughnessBricksTexture = textureLoader.load(
	'/textures/bricks/Stylized_Bricks_004_roughness.png',
);
const albedoGrassTexture = textureLoader.load(
	'/textures/grass/Stylized_Grass_002_basecolor.jpg',
);
const aoGrassTexture = textureLoader.load(
	'/textures/grass/Stylized_Grass_002_ambientOcclusion.jpg',
);
const heightGrassTexture = textureLoader.load(
	'/textures/grass/Stylized_Grass_002_height.png',
);
const normalGrassTexture = textureLoader.load(
	'/textures/grass/Stylized_Grass_002_normal.jpg',
);
const roughnessGrassTexture = textureLoader.load(
	'/textures/grass/Stylized_Grass_002_roughness.jpg',
);
const albedoLeavesTexture = textureLoader.load(
	'/textures/leaves/Stylized_Leaves_002_basecolor.jpg',
);
const aoLeavesTexture = textureLoader.load(
	'/textures/leaves/Stylized_Leaves_002_ambientOcclusion.jpg',
);
const heightLeavesTexture = textureLoader.load(
	'/textures/leaves/Stylized_Leaves_002_height.png',
);
const normalLeavesTexture = textureLoader.load(
	'/textures/leaves/Stylized_Leaves_002_normal.jpg',
);
const roughnessLeavesTexture = textureLoader.load(
	'/textures/leaves/Stylized_Leaves_002_roughness.jpg',
);
const albedoPlanksTexture = textureLoader.load(
	'/textures/planks/Stylized_Wood_Planks_001_basecolor.jpg',
);
const aoPlanksTexture = textureLoader.load(
	'/textures/planks/Stylized_Wood_Planks_001_ambientOcclusion.jpg',
);
const heightPlanksTexture = textureLoader.load(
	'/textures/planks/Stylized_Wood_Planks_001_height.png',
);
const normalPlanksTexture = textureLoader.load(
	'/textures/planks/Stylized_Wood_Planks_001_normal.jpg',
);
const roughnessPlanksTexture = textureLoader.load(
	'/textures/planks/Stylized_Wood_Planks_001_roughness.jpg',
);
const albedoRoofTexture = textureLoader.load(
	'/textures/roof/Stylized_Metal_Shingles_001_basecolor.png',
);
const aoRoofTexture = textureLoader.load(
	'/textures/roof/Stylized_Metal_Shingles_001_ambientOcclusion.png',
);
const heightRoofTexture = textureLoader.load(
	'/textures/roof/Stylized_Metal_Shingles_001_height.png',
);
const normalRoofTexture = textureLoader.load(
	'/textures/roof/Stylized_Metal_Shingles_001_normal.png',
);
const roughnessRoofTexture = textureLoader.load(
	'/textures/roof/Stylized_Metal_Shingles_001_roughness.png',
);
const metalnessRoofTexture = textureLoader.load(
	'/textures/roof/Stylized_Metal_Shingles_001_metallic.png',
);

// ---------------------------------------------------------
const canvas = getRequiredElement<HTMLCanvasElement>('canvas#tride');

const mesuresAndColors = {
	wallHeight: 2.5,
	wallWidt: 4,
	wallDepth: 4,
	roofHeight: 1.6,
	roofRadiusBottom: 3.4,

	roofRadiusTop: 0,

	doorHeight: 2.2,
	doorWidth: 2.2,
	grassColor: '#355250',

	fogBackground: '#201b2f',
};

// Gui -----------------------------------------------------
const gui = new GUI({
	width: 350,
	title: 'Tweaks',
	closeFolders: true,
});
const debugObject = {};

const floorTweaks = gui.addFolder('floor Mesh');
floorTweaks.close();
const ambientTweaks = gui.addFolder('Ambient Light');
ambientTweaks.close();
const directionalTweaks = gui.addFolder(
	'Directional Light - Moon Light',
);
directionalTweaks.close();
const directionalShadowTweaks = gui.addFolder(
	'Directional Light Shadow tweaks - Moon Light shadow tweaks',
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

	//
	const fog = new THREE.Fog(mesuresAndColors.fogBackground);
	fog.near = 1;
	fog.far = 15;

	scene.fog = fog;
	//

	//
	scene.background = new THREE.Color(mesuresAndColors.fogBackground);

	// -----------------------------------------------------
	// 1 - Environment

	// ------------------------------------------------------
	// 0.2 - Shadows stuff globaly related

	// shadows disabled for now gloabaly
	// renderer.shadowMap.enabled = true;

	// renderer.shadowMap.type = THREE.PCFSoftShadowMap; // oter ones in gui
	// using default for a start (don't need to set default but I will be explicit)
	renderer.shadowMap.type = THREE.PCFShadowMap;

	// ------------------------------------------------------
	// 3 -  texture stuff
	// colorSpace, reapeat and stuff ...

	albedoDoorTexture.colorSpace = THREE.SRGBColorSpace;
	albedoBricksTexture.colorSpace = THREE.SRGBColorSpace;
	albedoRoofTexture.colorSpace = THREE.SRGBColorSpace;
	albedoPlanksTexture.colorSpace = THREE.SRGBColorSpace;
	albedoLeavesTexture.colorSpace = THREE.SRGBColorSpace;
	albedoGrassTexture.colorSpace = THREE.SRGBColorSpace;

	albedoRoofTexture.wrapS = THREE.RepeatWrapping;
	albedoRoofTexture.wrapT = THREE.RepeatWrapping;
	aoRoofTexture.wrapS = THREE.RepeatWrapping;
	aoRoofTexture.wrapT = THREE.RepeatWrapping;
	heightRoofTexture.wrapS = THREE.RepeatWrapping;
	heightRoofTexture.wrapT = THREE.RepeatWrapping;
	normalRoofTexture.wrapS = THREE.RepeatWrapping;
	normalRoofTexture.wrapT = THREE.RepeatWrapping;
	roughnessRoofTexture.wrapS = THREE.RepeatWrapping;
	roughnessRoofTexture.wrapT = THREE.RepeatWrapping;
	metalnessRoofTexture.wrapS = THREE.RepeatWrapping;
	metalnessRoofTexture.wrapT = THREE.RepeatWrapping;
	albedoRoofTexture.repeat.set(8, 1); // Adjust numbers to fit your scale
	aoRoofTexture.repeat.set(8, 1);
	heightRoofTexture.repeat.set(8, 1);
	normalRoofTexture.repeat.set(8, 1);
	roughnessRoofTexture.repeat.set(8, 1);
	metalnessRoofTexture.repeat.set(8, 1);

	albedoPlanksTexture.wrapS = THREE.RepeatWrapping;
	albedoPlanksTexture.wrapT = THREE.RepeatWrapping;
	aoPlanksTexture.wrapS = THREE.RepeatWrapping;
	aoPlanksTexture.wrapT = THREE.RepeatWrapping;
	heightPlanksTexture.wrapS = THREE.RepeatWrapping;
	heightPlanksTexture.wrapT = THREE.RepeatWrapping;
	normalPlanksTexture.wrapS = THREE.RepeatWrapping;
	normalPlanksTexture.wrapT = THREE.RepeatWrapping;
	roughnessPlanksTexture.wrapS = THREE.RepeatWrapping;
	roughnessPlanksTexture.wrapT = THREE.RepeatWrapping;
	albedoPlanksTexture.repeat.set(2, 2);
	aoPlanksTexture.repeat.set(2, 2);
	heightPlanksTexture.repeat.set(2, 2);
	normalPlanksTexture.repeat.set(2, 2);
	roughnessPlanksTexture.repeat.set(2, 2);

	albedoGrassTexture.wrapS = THREE.RepeatWrapping;
	albedoGrassTexture.wrapT = THREE.RepeatWrapping;
	aoGrassTexture.wrapS = THREE.RepeatWrapping;
	aoGrassTexture.wrapT = THREE.RepeatWrapping;
	normalGrassTexture.wrapS = THREE.RepeatWrapping;
	normalGrassTexture.wrapT = THREE.RepeatWrapping;
	roughnessGrassTexture.wrapS = THREE.RepeatWrapping;
	roughnessGrassTexture.wrapT = THREE.RepeatWrapping;
	albedoGrassTexture.repeat.set(10, 10);
	aoGrassTexture.repeat.set(10, 10);
	heightGrassTexture.repeat.set(10, 10);
	normalGrassTexture.repeat.set(10, 10);
	roughnessGrassTexture.repeat.set(10, 10);
	// ------------------------------------------------------
	// 4 - Text - font loading, TextGeometry, material, mesh

	// --------------------------------------------------
	// 5 - Lights

	const ambientLight = new THREE.AmbientLight();
	ambientLight.color = new THREE.Color('#987dd6');
	ambientLight.intensity = 0.12;

	// ambientLight.visible = false;

	scene.add(ambientLight);

	// // // // // // // // -------------------------------

	const directionalLight = new THREE.DirectionalLight();
	directionalLight.color = new THREE.Color('#987dd6');
	// directionalLight.intensity = 1.5 * Math.PI;
	// directionalLight.intensity = 0.9 * Math.PI;
	directionalLight.intensity = 0.02 * Math.PI;
	directionalLight.position.set(4, 5, -2);

	// directionalLight.visible = false;

	// ----------------------------------------------------------
	//  5.1 - Shadow stuff related to directional light

	// console.log(directionalLight.shadow);
	// console.log(directionalLight.shadow.camera);

	/* directionalLight.castShadow = true;
	directionalLight.shadow.mapSize.width = 1024;
	directionalLight.shadow.mapSize.height = 1024;
	directionalLight.shadow.camera.near = 1;
	directionalLight.shadow.camera.far = 10;
	// directionalLight.shadow.camera.far = 6;
	directionalLight.shadow.camera.top = 2;
	directionalLight.shadow.camera.right = 2;
	directionalLight.shadow.camera.bottom = -2;
	directionalLight.shadow.camera.left = -2;
	directionalLight.shadow.radius = 10;
	directionalLight.shadow.intensity = 1; */ // default
	// directionalLight.shadow.bias = 0.0002; // default

	//   //     //     //      //      //        //
	scene.add(directionalLight);

	const doorPointLight = new THREE.PointLight('#c7a87e');

	// doorPointLight.intensity = 1.5 * Math.PI;
	doorPointLight.intensity = 1.7 * Math.PI;
	doorPointLight.distance = 7;

	doorPointLight.position.set(
		0,
		mesuresAndColors.doorHeight + 0.1,
		mesuresAndColors.doorWidth + 0.6,
	);

	// // // // // // // // -------------------------------
	// EXPLAIN: adding 3 point lights that will move through the scene
	const energy1 = new THREE.PointLight('#8c499a', 4 * Math.PI, 3);
	const energy2 = new THREE.PointLight('#6fbcc0', 4 * Math.PI, 3);
	const energy3 = new THREE.PointLight('#c75339', 4 * Math.PI, 3);

	scene.add(energy1, energy2, energy3);
	// -----------------------------------------------------
	// 6 - Geometries Materials Meshes

	const floorGeometry = new THREE.PlaneGeometry(20, 20, 64, 64);
	const floorMaterial = new THREE.MeshStandardMaterial({
		map: albedoGrassTexture,
		aoMap: aoGrassTexture,
		displacementMap: heightGrassTexture,
		displacementScale: 0.6,
		normalMap: normalGrassTexture,
		roughnessMap: roughnessGrassTexture,
	});

	// floorMaterial.color = new THREE.Color(mesuresAndColors.grassColor);
	// floorMaterial.roughness = 0.7;
	const floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);
	floorMesh.rotation.x = -Math.PI / 2;
	floorMesh.position.y = 0;
	// floorMesh.receiveShadow = true;
	scene.add(floorMesh);

	const wallsGeometry = createWallBoxGeometry(
		THREE,
		mesuresAndColors.wallWidt,
		mesuresAndColors.wallDepth,
		mesuresAndColors.wallHeight,
		128,
		128,
	);

	const wallsMaterial = new THREE.MeshStandardMaterial({
		// color: '#353042',
		map: albedoBricksTexture,

		aoMap: aoBricksTexture,
		normalMap: normalBricksTexture,
		displacementMap: heightBricksTexture,

		displacementScale: 0.05,
		displacementBias: -0.038,
		roughnessMap: roughnessBricksTexture,
		roughness: 0.8,
	});
	const wallsMesh = new THREE.Mesh(wallsGeometry, wallsMaterial);
	//
	const roofGeometry = new THREE.CylinderGeometry(
		mesuresAndColors.roofRadiusTop,
		mesuresAndColors.roofRadiusBottom,
		mesuresAndColors.roofHeight,
		4,
		128,
		// open cylinder
		true,
	);

	const roofMaterial = new THREE.MeshStandardMaterial({
		// color: '#d4def4',
		map: albedoRoofTexture,
		aoMap: aoRoofTexture,
		displacementMap: heightRoofTexture,
		displacementScale: 0.34,
		// displacementBias: -0.01,
		normalMap: normalRoofTexture,
		roughnessMap: roughnessRoofTexture,
		metalnessMap: metalnessRoofTexture,
		// roughness: 0.3,
		// metalness: 0.5,
	});
	const roofMesh = new THREE.Mesh(roofGeometry, roofMaterial);
	roofMesh.position.y =
		mesuresAndColors.wallHeight +
		mesuresAndColors.roofHeight / 2 -
		0.029;
	roofMesh.rotation.y = Math.PI / 4;

	const planksRoofPlane = new THREE.PlaneGeometry(
		mesuresAndColors.roofRadiusBottom + 1.33,
		mesuresAndColors.roofRadiusBottom + 1.33,
		128,
		128,
	);

	const planksRoofMaterial = new THREE.MeshStandardMaterial({
		// color: '#a54841',
		map: albedoPlanksTexture,
		aoMap: aoPlanksTexture,
		displacementMap: heightPlanksTexture,
		displacementScale: 0.05,
		normalMap: normalPlanksTexture,
		roughnessMap: roughnessPlanksTexture,
	});
	const planksRoofMesh = new THREE.Mesh(
		planksRoofPlane,
		planksRoofMaterial,
	);
	planksRoofMesh.rotation.x = Math.PI / 2;
	planksRoofMesh.position.y = mesuresAndColors.wallHeight + 0.04;
	// planksRoofMesh.scale.set(0.99, 1, 0.99);

	const doorGeometry = new THREE.PlaneGeometry(
		mesuresAndColors.doorWidth,
		mesuresAndColors.doorHeight,

		100,
		100,
	);

	//
	const doorMaterial = new THREE.MeshStandardMaterial({
		// color: '#5d4534',

		map: albedoDoorTexture,
		aoMap: aoDoorTexture,
		aoMapIntensity: 1,

		transparent: true,
		alphaMap: alphaDoorTexture,
		displacementMap: heightDoorTexture,

		displacementScale: 0.1,
		//
		normalMap: normalDoorTexture,
		roughnessMap: roughnessDoorTexture,
		metalnessMap: metalnessDoorTexture,
		roughness: 1,
		metalness: 1,
	});

	/* doorGeometry.setAttribute(
		'uv2',
		new THREE.Float32BufferAttribute(
			doorGeometry.attributes.uv.array,
			2,
		),
	);
	if (doorMaterial.aoMap) {
		
		doorMaterial.aoMap.channel = 1;
	} */

	const doorMesh = new THREE.Mesh(doorGeometry, doorMaterial);

	doorMesh.position.z = mesuresAndColors.wallDepth / 2;
	// lower it down a little bit
	// doorMesh.position.y = mesuresAndColors.doorHeight / 2;
	doorMesh.position.y = mesuresAndColors.doorHeight / 2 + 0.05;

	const bushGeometry = new THREE.TetrahedronGeometry(0.3, 16);

	const bushMaterial = new THREE.MeshStandardMaterial({
		// color: '#a6ddd9',
		map: albedoLeavesTexture,
		aoMap: aoLeavesTexture,
		displacementMap: heightLeavesTexture,
		displacementScale: 0.4,
		normalMap: normalLeavesTexture,
		roughnessMap: roughnessLeavesTexture,
	});

	const bushOneMesh = new THREE.Mesh(bushGeometry, bushMaterial);
	const bushTwoMesh = new THREE.Mesh(bushGeometry, bushMaterial);
	const bushThreeMesh = new THREE.Mesh(bushGeometry, bushMaterial);
	const bushFourMesh = new THREE.Mesh(bushGeometry, bushMaterial);

	bushOneMesh.position.z = mesuresAndColors.wallDepth / 2 + 0.3;
	bushOneMesh.position.x = mesuresAndColors.doorWidth / 2;
	bushOneMesh.position.y = 0.5;
	bushOneMesh.scale.y = 2.6;
	bushTwoMesh.position.z = mesuresAndColors.wallDepth / 2 + 0.3;
	bushTwoMesh.position.x = -mesuresAndColors.doorWidth / 2;
	bushTwoMesh.position.y = 0.5;
	bushTwoMesh.scale.y = 2.6;
	bushThreeMesh.position.z = mesuresAndColors.wallDepth / 2 + 0.5;
	bushThreeMesh.position.x = mesuresAndColors.doorWidth / 2 + 0.4;
	bushThreeMesh.position.y = 0.3;
	bushThreeMesh.scale.y = 1.9;
	bushFourMesh.position.z = mesuresAndColors.wallDepth / 2 + 0.5;
	bushFourMesh.position.x = -mesuresAndColors.doorWidth / 2 - 0.2;
	bushFourMesh.position.y = 0.1;
	bushFourMesh.scale.y = 1.1;

	const house = new THREE.Group();

	house.add(
		wallsMesh,
		roofMesh,
		doorMesh,
		bushOneMesh,
		bushTwoMesh,
		bushThreeMesh,
		bushFourMesh,
		//
		doorPointLight,
		planksRoofMesh,
	);

	const toombstoneGeometry = new THREE.BoxGeometry(0.6, 0.9, 0.2);
	const toobstoneMaterial = new THREE.MeshStandardMaterial({
		color: '#fde6e3',
	});
	const toombstones = new THREE.Group();

	for (let i = 0; i < 50; i++) {
		const angle = Math.random() * Math.PI * 2;

		const radius = 3.5 + Math.random() * 5.5;

		const x = Math.cos(angle) * radius;
		const z = Math.sin(angle) * radius;

		const toomb = new THREE.Mesh(
			toombstoneGeometry,
			toobstoneMaterial,
		);

		toomb.position.set(x, 0.35, z);

		toomb.rotation.y = (Math.random() - 0.5) * 0.2;
		toomb.rotation.z = (Math.random() - 0.5) * 0.4;

		toombstones.add(toomb);
	}

	scene.add(house, toombstones);

	// --------------------------------------------------------
	// 7 - Camera - Perspective Camera
	const camera = new THREE.PerspectiveCamera(
		75,
		sizes.width / sizes.height,
		0.1,
		100,
	);

	camera.position.z = 4;
	camera.position.y = 2;
	camera.position.x = 5;

	// camera.lookAt(boxMesh.position);

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

	// // // // // // // // // // // // // // // // // // // // //

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
		.min(-5)
		.max(5)
		.step(0.001)
		.name('directionalLight.shadow.camera.top')
		.onChange(() => {
			directionalLight.shadow.camera.updateProjectionMatrix();
			directionalLightShadowCameraHelper.update();
		});
	directionalShadowTweaks
		.add(directionalLight.shadow.camera, 'right')
		.min(-5)
		.max(5)
		.step(0.001)
		.name('directionalLight.shadow.camera.right')
		.onChange(() => {
			directionalLight.shadow.camera.updateProjectionMatrix();
			directionalLightShadowCameraHelper.update();
		});
	directionalShadowTweaks
		.add(directionalLight.shadow.camera, 'bottom')
		.min(-5)
		.max(5)
		.step(0.001)
		.name('directionalLight.shadow.camera.bottom')
		.onChange(() => {
			directionalLight.shadow.camera.updateProjectionMatrix();
			directionalLightShadowCameraHelper.update();
		});
	directionalShadowTweaks
		.add(directionalLight.shadow.camera, 'left')
		.min(-5)
		.max(5)
		.step(0.001)
		.name('directionalLight.shadow.camera.left')
		.onChange(() => {
			directionalLight.shadow.camera.updateProjectionMatrix();
			directionalLightShadowCameraHelper.update();
		});

	// // // // // // // // // // // // // // // // // // //

	floorTweaks.add(floorMesh, 'receiveShadow');
	// // // // // // // // // // // // // // // // // // //

	// // // // // // // // // // // // // // // // // // //

	ambientTweaks
		.add(ambientLight, 'intensity')
		.min(0)
		.max(1)
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
	// using scene.background instead of this
	// renderer.setClearColor(0x000000, 1);
	// renderer.setClearColor(mesuresAndColors.fogBackground, 1);
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

		const elapsedTime = timer.getElapsed();
		// EXPLAIN: moving lights in a circle around the house
		// EXPLAIN: 0.5 will determine speed, speed will be decreased
		// can you explain mre why
		const energyAngle1 = elapsedTime * 0.5;
		energy1.position.x = Math.cos(energyAngle1) * 4;
		energy1.position.z = Math.sin(energyAngle1) * 4;
		energy1.position.y = Math.sin(elapsedTime * 3);

		const energyAngle2 = elapsedTime * 0.34;
		energy2.position.x = Math.sin(energyAngle2) * 5;
		energy2.position.z = Math.cos(energyAngle2) * 5;
		energy2.position.y = Math.sin(elapsedTime * 3);

		/* const energyAngle3 = elapsedTime * 0.5;
		energy3.position.x = Math.cos(energyAngle3) * 4;
		energy3.position.z = Math.sin(energyAngle3) * 4;
		energy3.position.y = Math.sin(elapsedTime * 3);
 */
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
