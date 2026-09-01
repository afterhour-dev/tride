import * as THREE from 'three/webgpu';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// EXPLAIN: I want to have helper for raycaster to have
// better visual picture what is happening if we are testing inside
// animation loop
import { RaycasterHelper } from '@gsimone/three-raycaster-helper';

import GUI from 'lil-gui';
// import gsap from 'gsap';

import { getRequiredElement } from './util';

// loading textures -----------------------------------------
const loadingManager = new THREE.LoadingManager();
// const textureLoader = new THREE.TextureLoader(loadingManager);

loadingManager.onProgress = (textureFilePath: string) => {
	console.log(textureFilePath);
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
	directLookAtCenter: () => {},
};

const sphereMesh1Tweaks = gui.addFolder('sphere Mesh 1');
const sphereMesh2Tweaks = gui.addFolder('sphere Mesh 2');
const sphereMesh3Tweaks = gui.addFolder('sphere Mesh 3');
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

	// scene.environment = environmentMapTexture;
	// scene.background = environmentMapTexture;
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

	// directionalLight.castShadow = true;

	//
	// directionalLight.shadow.mapSize.width = 1024;
	// directionalLight.shadow.mapSize.height = 1024;
	directionalLight.shadow.mapSize.setScalar(1024);

	// directionalLight.shadow.camera.near = 1;
	directionalLight.shadow.camera.far = 15;
	directionalLight.shadow.camera.top = 7;
	directionalLight.shadow.camera.right = 7;
	directionalLight.shadow.camera.bottom = -7;
	directionalLight.shadow.camera.left = -7;
	// directionalLight.shadow.radius = 10;
	// directionalLight.shadow.intensity = 1; // default
	// directionalLight.shadow.bias = 0.0002; // also default

	// -----------------------------------------------------------
	scene.add(directionalLight);

	// -----------------------------------------------------
	// 6 - Geometries Materials Meshes

	// EXPLAIN: since in this example we will change colors
	// for separate object and we need them to have diffrent color
	// we can't use same material, but we can use same default color
	const sphereColor = new THREE.Color('#e6cbe8');
	const sphereGreometry = new THREE.SphereGeometry(0.5, 16, 16);
	// const sphereMaterial = new THREE.MeshStandardMaterial();
	// sphereMaterial.roughness = 0.4;
	// sphereMaterial.metalness = 0.3;
	// sphereMaterial.color = new THREE.Color('#e6cbe8');

	// EXPLAIN: see, every mesh is using different material
	const sphereMesh1 = new THREE.Mesh(
		sphereGreometry,
		new THREE.MeshStandardMaterial({
			color: sphereColor,
			roughness: 0.4,
			metalness: 0.3,
		}),
	);
	const sphereMesh2 = new THREE.Mesh(
		sphereGreometry,
		new THREE.MeshStandardMaterial({
			color: sphereColor,
			roughness: 0.4,
			metalness: 0.3,
		}),
	);
	const sphereMesh3 = new THREE.Mesh(
		sphereGreometry,
		new THREE.MeshStandardMaterial({
			color: sphereColor,
			roughness: 0.4,
			metalness: 0.3,
		}),
	);

	sphereMesh1.position.x = -2;
	sphereMesh3.position.x = 2;

	// sphereMesh1.castShadow = true;
	// sphereMesh2.castShadow = true;
	// sphereMesh3.castShadow = true;

	// sphereMaterial.wireframe = true;

	const floorGeometry = new THREE.PlaneGeometry(10, 10);
	const floorMaterial = new THREE.MeshStandardMaterial();
	floorMaterial.roughness = 0.4;
	floorMaterial.metalness = 0.3;
	floorMaterial.color = new THREE.Color('#928192');
	const floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);

	floorMesh.rotation.x = -Math.PI / 2;
	floorMesh.position.y = -0.5;

	// floorMesh.receiveShadow = true;

	floorMesh.visible = false;

	//  ------------------------

	scene.add(sphereMesh1, sphereMesh2, sphereMesh3, floorMesh);

	// -----------------------------------------------------
	// 6 - Raycaster

	const raycaster = new THREE.Raycaster();

	/* const rayOrigin = new THREE.Vector3(-3, 0, 0);
	const rayDirection = new THREE.Vector3(10, 0, 0);
	console.log(rayDirection.length()); // 10
	rayDirection.normalize();
	console.log(rayDirection.length()); // 1
	raycaster.set(rayOrigin, rayDirection);

	const singleIntersect = raycaster.intersectObject(sphereMesh3);
	console.log(singleIntersect);

	// distance will be the same for each item
	// if you don't do this
	scene.updateMatrixWorld(true);

	const intersects = raycaster.intersectObjects([
		sphereMesh1,
		sphereMesh2,
		sphereMesh3,
	]);
	console.log(intersects);
 */
	// --------------------------------------------------------
	// 8 - Camera - Perspective Camera
	const camera = new THREE.PerspectiveCamera(
		75,
		sizes.width / sizes.height,
		0.1,
		100,
	);

	// camera.position.z = 1;
	// camera.position.y = 1;
	// camera.position.x = 2;

	camera.position.set(0, 0, 4);

	scene.add(camera);

	// -----------------------------------------------------
	// 9 - Orbit Controls
	const orbitControls = new OrbitControls(camera, canvas);

	orbitControls.enableDamping = true;
	// orbitControls.enabled = false;
	// orbitControls.update()

	// ------------------------------------------------
	// 10 - helpers

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

	// EXPLAIN: instantiating and adding raycasterHelper
	const raycasterHelper = new RaycasterHelper(raycaster);
	scene.add(raycasterHelper);

	// 11 - GUI ---------------------------------------------------------

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

	// // // // // // // // // // // // // // // // // // //

	sphereMesh1Tweaks.add(sphereMesh1, 'castShadow');
	sphereMesh1Tweaks
		.add(sphereMesh1.position, 'x')
		.step(0.001)
		.name('position.x')
		.min(-5)
		.max(5);
	sphereMesh1Tweaks
		.add(sphereMesh1.position, 'y')
		.step(0.001)
		.name('position.y')
		.min(0)
		.max(5);
	sphereMesh1Tweaks
		.add(sphereMesh1.position, 'z')
		.step(0.001)
		.name('position.z')
		.min(-5)
		.max(5);
	sphereMesh2Tweaks.add(sphereMesh2, 'castShadow');
	sphereMesh2Tweaks
		.add(sphereMesh2.position, 'x')
		.step(0.001)
		.name('position.x')
		.min(-5)
		.max(5);
	sphereMesh2Tweaks
		.add(sphereMesh2.position, 'y')
		.step(0.001)
		.name('position.y')
		.min(0)
		.max(5);
	sphereMesh2Tweaks
		.add(sphereMesh2.position, 'z')
		.step(0.001)
		.name('position.z')
		.min(-5)
		.max(5);
	sphereMesh3Tweaks.add(sphereMesh3, 'castShadow');
	sphereMesh3Tweaks
		.add(sphereMesh3.position, 'x')
		.step(0.001)
		.name('position.x')
		.min(-5)
		.max(5);
	sphereMesh3Tweaks
		.add(sphereMesh3.position, 'y')
		.step(0.001)
		.name('position.y')
		.min(0)
		.max(5);
	sphereMesh3Tweaks
		.add(sphereMesh3.position, 'z')
		.step(0.001)
		.name('position.z')
		.min(-5)
		.max(5);

	// // // // // // // // // // // // // // // // // // //

	// // // // // // // // // // // // // // // // // // //
	floorTweaks.add(floorMesh, 'receiveShadow');
	floorTweaks.add(floorMesh, 'visible');

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

		const elapsedTime = timer.getElapsed();

		// EXPLAIN: we are moving our spheres up and down wih
		// different frequency (speed)
		sphereMesh1.position.y = Math.sin(elapsedTime * 0.3) * 3;
		sphereMesh2.position.y = Math.sin(elapsedTime * 0.8) * 2.5;
		sphereMesh3.position.y = Math.sin(elapsedTime * 1.4) * 2;

		const rayOrigin = new THREE.Vector3(-3, 0, 0);
		const rayDirection = new THREE.Vector3(1, 0, 0);
		// EXPLAIN: we already have distance 1 from the scene center
		// but we are normalizing it anyway, in case if someone
		// or me change thi value and forgets
		rayDirection.normalize();

		raycaster.set(rayOrigin, rayDirection);
		// EXPLAIN: shooting the ray
		const objectsToTest = [sphereMesh1, sphereMesh2, sphereMesh3];

		const intersections = raycaster.intersectObjects(objectsToTest);
		// console.log(intersections);

		// EXPLAIN: but also let's set old color
		// and we need to do it before we are setting colors on hits
		for (const ob of objectsToTest) {
			ob.material.color.set('#e6cbe8');
		}
		// EXPLAIN: setting color to the material of the object
		// every time intersections happen
		for (const item of intersections) {
			// EXPLAIN: typescript is giving me problems here
			// can you tell me if it would be normal just to
			// remove if statment and ignore typescript error
			if (item.object instanceof THREE.Mesh) {
				// EXPLAIN: so we set colors when ray hits
				item.object.material.color.set('#344e70');
			}
		}

		// EXPLAIN: we use helper like this
		// @ts-expect-error for some reson doesn't accept the value
		raycasterHelper.hits = intersections;
		raycasterHelper.update();

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
