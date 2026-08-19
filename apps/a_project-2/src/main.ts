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

// ---------------------------------------------------------
const canvas = getRequiredElement<HTMLCanvasElement>('canvas#tride');

const mesure = {
	wallHeight: 2.5,
	wallWidt: 4,
	wallDepth: 4,
	roofHeight: 1,
	roofRadiusBottom: 3.4,
	roofRadiusTop: 1,
	doorHeight: 2,
	doorWidth: 2,
};

// Gui -----------------------------------------------------
const gui = new GUI({
	width: 350,
	title: 'Tweaks',
	closeFolders: true,
});
const debugObject = {
	directLookAtCenter: () => {},
};

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
	// colorSpace and stuff

	// ------------------------------------------------------
	// 4 - Text - font loading, TextGeometry, material, mesh

	// --------------------------------------------------
	// 5 - Lights

	const ambientLight = new THREE.AmbientLight();
	// EXPLAIN: changing original color to
	// something more purpleish
	// ambientLight.color = new THREE.Color(0xffffff);
	ambientLight.color = new THREE.Color('#987dd6');

	// EXPLAIN: lowering intensity
	// ambientLight.intensity = 0.5;
	ambientLight.intensity = 0.12;
	// ambientLight.visible = false;

	scene.add(ambientLight);

	// // // // // // // // -------------------------------

	// const directionalLight = new THREE.DirectionalLight(0xffffff);
	const directionalLight = new THREE.DirectionalLight();
	directionalLight.color = new THREE.Color('#987dd6');
	// directionalLight.intensity = 1.5 * Math.PI;
	// EXPLAIN: lowering intensity
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

	// EXPLAIN: adding point light above the door
	const doorPointLight = new THREE.PointLight('#c7a87e');
	doorPointLight.intensity = 1.5 * Math.PI;
	doorPointLight.distance = 7;

	doorPointLight.position.set(
		0,
		mesure.doorHeight + 0.1,
		mesure.doorWidth + 0.6,
	);

	// EXPLAIN: bellow in code we added pointLight to the house group

	// -----------------------------------------------------
	// 6 - Geometries Materials Meshes

	const floorGeometry = new THREE.PlaneGeometry(20, 20);
	const floorMaterial = new THREE.MeshStandardMaterial();
	floorMaterial.color = new THREE.Color(0x59b4af);
	// floorMaterial.roughness = 0.7;
	const floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);
	floorMesh.rotation.x = -Math.PI / 2;
	floorMesh.position.y = 0;
	// floorMesh.receiveShadow = true;
	scene.add(floorMesh);

	const wallsGeometry = createWallBoxGeometry(
		THREE,
		mesure.wallWidt,
		mesure.wallDepth,
		mesure.wallHeight,
	);
	const wallsMaterial = new THREE.MeshStandardMaterial({
		color: '#353042',
	});
	const wallsMesh = new THREE.Mesh(wallsGeometry, wallsMaterial);
	//
	const roofGeometry = new THREE.CylinderGeometry(
		mesure.roofRadiusTop,
		mesure.roofRadiusBottom,
		mesure.roofHeight,
		4,
		8,
		// true,
	);
	const roofMaterial = new THREE.MeshStandardMaterial({
		color: '#7ea0e9',
	});
	const roofMesh = new THREE.Mesh(roofGeometry, roofMaterial);
	roofMesh.position.y = mesure.wallHeight + mesure.roofHeight / 2;
	roofMesh.rotation.y = Math.PI / 4;

	const doorGeometry = new THREE.PlaneGeometry(
		mesure.doorWidth,
		mesure.doorHeight,
	);
	const doorMaterial = new THREE.MeshStandardMaterial({
		color: '#5d4534',
	});
	const doorMesh = new THREE.Mesh(doorGeometry, doorMaterial);
	doorMesh.position.z = mesure.wallDepth / 2 + 0.02;
	doorMesh.position.y = mesure.doorHeight / 2;

	const bushGeometry = new THREE.TetrahedronGeometry(0.3, 2);
	const bushMaterial = new THREE.MeshStandardMaterial({
		color: '#a6ddd9',
	});

	const bushOneMesh = new THREE.Mesh(bushGeometry, bushMaterial);
	const bushTwoMesh = new THREE.Mesh(bushGeometry, bushMaterial);
	const bushThreeMesh = new THREE.Mesh(bushGeometry, bushMaterial);
	const bushFourMesh = new THREE.Mesh(bushGeometry, bushMaterial);

	bushOneMesh.position.z = mesure.wallDepth / 2 + 0.3;
	bushOneMesh.position.x = mesure.doorWidth / 2;
	bushOneMesh.position.y = 0.5;
	bushOneMesh.scale.y = 2.6;
	bushTwoMesh.position.z = mesure.wallDepth / 2 + 0.3;
	bushTwoMesh.position.x = -mesure.doorWidth / 2;
	bushTwoMesh.position.y = 0.5;
	bushTwoMesh.scale.y = 2.6;
	bushThreeMesh.position.z = mesure.wallDepth / 2 + 0.5;
	bushThreeMesh.position.x = mesure.doorWidth / 2 + 0.4;
	bushThreeMesh.position.y = 0.3;
	bushThreeMesh.scale.y = 1.9;
	bushFourMesh.position.z = mesure.wallDepth / 2 + 0.5;
	bushFourMesh.position.x = -mesure.doorWidth / 2 - 0.2;
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
		// EXPLAIN: added point light (above door)
		doorPointLight,
	);

	const toombstoneGeometry = new THREE.BoxGeometry(0.6, 0.9, 0.2);
	const toobstoneMaterial = new THREE.MeshStandardMaterial({
		color: '#fde6e3',
	});
	const toombstones = new THREE.Group();

	// EXPLAIN: cement this in your head: Math.sin and Math.cos
	// both accepts radians; both have possible max of 1 and min of -1
	// on 0 radians sinus produces 0, and cosinus produces 1;
	// as radians grows sinus produces
	// in the direction 0 -> 1 -> 0 -> -1
	// and as radians grows cosinus produces
	// in the direction 1 ->  0 -> -1 -> 0

	for (let i = 0; i < 50; i++) {
		// EXPLAIN: Math.PI * 2 is full circle in radians
		// we multiply by number bellow zero (Math.random() produces it)
		// which means we are choping the full circle or getting
		// values in radians that are 2 * Math.PI if random number is 1
		// and getting 2 * Math.PI divided by something, which means
		// we are getting random values in radians bellow 2 * Math.PI
		// which are values on the spectrum from 0 to 2 * Math.PI
		// So we are dividing full circle to get radians betwen 0 and 2 * Math.PI
		const angle = Math.random() * Math.PI * 2;
		// EXPLAIN: hewre we have Math.random() * 6
		// Again we are dividing here too since we are using Math.random()
		// as a multiplier; and again we are getting numbers from 0 to 1
		// and we must multiply by something to increase radius
		// which means we are getting values from 0 to 5.5
		// EXPLAIN: 3.5 is offset here, guaranteed lowest possible value
		// we can get so if Math.random() * 5.5 is 0, radius will be
		// 3.5 and biggest value is 3.5 + 5.5 == 9
		const radius = 3.5 + Math.random() * 5.5;
		// EXPLAIN: why whe choose 3.5 as minimum and 9 as maximum
		// floorPlane is 20 * 20 meaning biggest circle you can place there
		// is radius 10 and we can't go above 10 since we are 9
		// and in case of minimal of 3.5, our house is maximum 4 (we can write circle radius 2
		// around it); well radius 2 is lower than 3.5, meaning we are
		// making sure objects don't overlap with our house;
		// why 3.5 and not 2 ? because we want some free space betwen
		// house and where objects are going to be layed

		// EXPLAIN: we need to cement in our head that
		// number we multiply sinus or cosinus by is the number
		// that represents radius
		// EXPLAIN: we need to cementin our head that
		// Math.<cos/sin> accept radians
		// EXPLAIN: we know that when we combine cos and sin
		// in a way when we would have subsequent numbers as angle
		// values, we would place dots in a perfect circle; or we can
		// say that dots will draw perfect circle, and in same
		// case unlike angle, radius shouldn't change, because
		// if radius changes we don't have perfect circle anymore
		// we would have randomnes

		// EXPLAIN: Well here we have contolled randomnes for the radius
		// we have maximum radius and minimum radius, and all values
		// between that maximum and minimum

		// EXPLAIN: and for angle we have also "controled"
		// randomness where we get maximum 2 * PI and minimum of 0
		// and possible values between them so in a way it is controlled
		// randomnes

		const x = Math.cos(angle) * radius;
		const z = Math.sin(angle) * radius;

		const toomb = new THREE.Mesh(
			toombstoneGeometry,
			toobstoneMaterial,
		);

		toomb.position.set(x, 0.35, z);
		// EXPLAIN: subtracting 0.5 gives us also negative values
		// but negative values are between -0.5 and 0.5
		// so when we multiply those values by 0.2 or 0.4
		// we always get small radian values between 0 and 0.25 and -0.25 to 0
		// which are small angles, making toomb just a little bit angled
		// by defined axis
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
