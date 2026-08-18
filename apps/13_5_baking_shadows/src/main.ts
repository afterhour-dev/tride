import * as THREE from 'three/webgpu';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import GUI from 'lil-gui';
// import gsap from 'gsap';

import { getRequiredElement } from './util';

const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManager);

// EXPLAIN: loading baked shadow texture
const bakedShadowTexture = textureLoader.load(
	'/textures/bakedShadow.jpg',
);

// EXPLAIN: loading simpler baked shadow texture
const simplerBakedShadowTexture = textureLoader.load(
	'/textures/simpleShadow.jpg',
);

// ---------------------------------------------------------
const canvas = getRequiredElement<HTMLCanvasElement>('canvas#tride');

// Gui -----------------------------------------------------

const gui = new GUI({
	width: 350,
	title: 'Tweaks',
	closeFolders: true,
});

const ambientTweaks = gui.addFolder('Ambient Light');
ambientTweaks.close();
const standardMaterialTweaks = gui.addFolder('MeshStandardMaterial');
standardMaterialTweaks.close();
const sphereTweaks = gui.addFolder('sphere Mesh');
sphereTweaks.close();
const directionalTweaks = gui.addFolder('Directional Light');
directionalTweaks.close();
const directionalShadowTweaks = gui.addFolder(
	'Directional Light Shadow tweaks',
);
directionalShadowTweaks.close();
const spotTweaks = gui.addFolder('Spot Light');
const spotLightShadowTweaks = gui.addFolder(
	'Spot Light shadow tweaks',
);
spotTweaks.close();
spotLightShadowTweaks.close();

const pointTweaks = gui.addFolder('Point Light');
const pointLightShadowTweaks = gui.addFolder(
	'Point Light shadow tweaks',
);
pointTweaks.close();
pointLightShadowTweaks.close();

const debugObject = {
	directLookAtCenter: () => {},
};

window.addEventListener('keydown', (ev) => {
	if (ev.key === 'h') {
		gui.show(gui._hidden);
	}
});
// ------------------------------------------------------

const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
};

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

	// EXPLAIN: we need to deactivate all shadows we have
	// renderer.shadowMap.enabled = true;
	renderer.shadowMap.enabled = false;

	renderer.shadowMap.type = THREE.PCFSoftShadowMap; // other ones we used in gui

	// ------------------------------------------------------
	// 3 -  texture stuff
	// colorSpace and stuff

	// ------------------------------------------------------
	// 4 - Text - font loading, TextGeometry, material, mesh

	// --------------------------------------------------
	// 5 - Lights

	const ambientLight = new THREE.AmbientLight();

	ambientLight.color = new THREE.Color(0xffffff);
	ambientLight.intensity = 0.3;
	// ambientLight.intensity = 1;

	// ambientLight.visible = false;

	scene.add(ambientLight);

	// // // // // // // // -------------------------------

	// const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.3);
	const directionalLight = new THREE.DirectionalLight(0xffffff);
	directionalLight.intensity = 0.2 * Math.PI;

	directionalLight.position.set(2, 2, -1);

	directionalLight.castShadow = true;

	// directionalLight.visible = false;

	// ----------------------------------------------------------
	//  5.1 - Shadow stuff related to directional light

	// console.log(directionalLight.shadow);
	// console.log(directionalLight.shadow.camera);

	directionalLight.shadow.mapSize.width = 1024;
	directionalLight.shadow.mapSize.height = 1024;
	directionalLight.shadow.camera.near = 1;
	directionalLight.shadow.camera.far = 6;
	directionalLight.shadow.camera.top = 2;
	directionalLight.shadow.camera.right = 2;
	directionalLight.shadow.camera.bottom = -2;
	directionalLight.shadow.camera.left = -2;

	directionalLight.shadow.radius = 10;

	directionalLight.shadow.intensity = 1; // default
	// directionalLight.shadow.bias = 0.0002;

	// -----------------------------------------------------------
	scene.add(directionalLight);

	// // // // // // // // -------------------------------
	const spotLight = new THREE.SpotLight();

	spotLight.color = new THREE.Color(0xffffff);

	spotLight.intensity = 0.2 * Math.PI;
	spotLight.distance = 10;

	spotLight.decay = 0;
	spotLight.angle = Math.PI * 0.3;

	spotLight.castShadow = true;

	spotLight.position.set(0, 2, 2);

	// spotLight.visible = false;

	// ----------------------------------------------------------

	//  5.2 - Shadow stuff related to spot light

	spotLight.shadow.mapSize.width = 1024;
	spotLight.shadow.mapSize.height = 1024;

	// spotLight.shadow.camera.fov = 30;

	spotLight.shadow.camera.near = 1;
	// spotLight.shadow.camera.far = 6;

	scene.add(spotLight.target);
	// ----------------------------------------------------------
	scene.add(spotLight);

	// // // // // // // // --------------------------------

	const pointLight = new THREE.PointLight();
	pointLight.color = new THREE.Color(0xffffff);

	pointLight.intensity = 0.4 * Math.PI;

	pointLight.distance = 10;

	pointLight.decay = 0.5;

	pointLight.castShadow = true;

	pointLight.position.set(-1, 1, 0);

	// ----------------------------------------------------------
	// 5.3 - Shadow stuff related to point light
	pointLight.shadow.mapSize.width = 1024;
	pointLight.shadow.mapSize.height = 1024;

	pointLight.shadow.camera.near = 0.1;
	// pointLight.shadow.camera.far = 5;

	// ----------------------------------------------------------

	scene.add(pointLight);

	// // // // // // // // -------------------------------

	// -----------------------------------------------------
	// 6 - Geometries Materials Meshes

	const sphereGreometry = new THREE.SphereGeometry(0.5, 32, 32);
	const floorGeometry = new THREE.PlaneGeometry(5, 5);

	const material = new THREE.MeshStandardMaterial();

	// EXPLAIN: we created floor material where we are going
	// to stick our shadow texture
	const floorMaterial = new THREE.MeshBasicMaterial();
	floorMaterial.map = bakedShadowTexture;

	// material.wireframe = true;

	// material.roughness = 0.4;
	material.roughness = 0.7;

	const sphereMesh = new THREE.Mesh(sphereGreometry, material);
	// EXPLAIN: and here instead of material we will use floorMaterial
	// const floorMesh = new THREE.Mesh(floorGeometry, material);
	const floorMesh = new THREE.Mesh(
		floorGeometry,
		// EXPLAIN: for the alternative approach we are going back
		// to our standard material because we don't want that static
		// baked shadow on the floor
		// floorMaterial
		material,
	);

	// EXPLAIN: creating the mesh that will play a role of shadow
	const sphereShadowMesh = new THREE.Mesh(
		new THREE.PlaneGeometry(1.5, 1.5),
		new THREE.MeshBasicMaterial({
			color: 0x000000,
			transparent: true,
			// EXPLAIN: we use simple shadow texture as alpha map
			// because as we talked in the textures lesson , only
			// way to apply this texture we need transparent to be allowed
			// and we can apply texture that hase transparent part (black) and the
			// opaque part (white)
			alphaMap: simplerBakedShadowTexture,
		}),
	);

	floorMesh.rotation.x = -Math.PI / 2;
	floorMesh.position.y = -0.5;

	// EXPLAIN: to prevent z-fighting, we place new plane slightly
	// above the floor, not exacly on the floor
	sphereShadowMesh.position.y = floorMesh.position.y + 0.01;
	sphereShadowMesh.rotation.x = -Math.PI / 2;
	//  ------------------------

	floorMesh.receiveShadow = true;

	// sphereMesh.receiveShadow = true;
	sphereMesh.castShadow = true;

	// spotLight.target = sphereMesh;

	scene.add(sphereMesh, floorMesh, sphereShadowMesh);

	// ------------- Tweaks ----------------------------------
	// 7 - gui tweaks

	const shadowMapAlgoType = {
		BasicShadowMap: THREE.BasicShadowMap,
		PCFShadowMap: THREE.PCFShadowMap,
		PCFSoftShadowMap: THREE.PCFSoftShadowMap,
		VSMShadowMap: THREE.VSMShadowMap,
	};
	gui
		.add(renderer.shadowMap, 'type', shadowMapAlgoType)
		.name('renderer.shadowMap.type');
	// // // // // // // // // // // // // //

	standardMaterialTweaks
		.add(material, 'roughness')
		.min(0)
		.max(1)
		.step(0.001);
	standardMaterialTweaks
		.add(material, 'metalness')
		.min(0)
		.max(1)
		.step(0.001);
	standardMaterialTweaks.add(material, 'wireframe').onChange(() => {
		material.needsUpdate = true;
	});

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

	directionalTweaks
		.add(directionalLight, 'intensity')
		.min(0)
		.max(1)
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

	directionalTweaks
		.add({ a: '' }, 'a')
		.disable()
		.name(
			"this `directLookAtCenter` isn't doing what I thought it would. Which\n would be pointing to the center of the scene.\nBut it doesen't do an rotations",
		);

	debugObject.directLookAtCenter = () => {
		directionalLight.lookAt(new THREE.Vector3());
	};
	directionalTweaks.add(debugObject, 'directLookAtCenter');

	directionalTweaks
		.add(directionalLight, 'visible')
		.name('show directional light');

	// // // // // // // // // // // // // // // // // // //

	sphereTweaks
		.add(sphereMesh.position, 'x')
		.step(0.001)
		.name('position.x')
		.min(-5)
		.max(5);
	sphereTweaks
		.add(sphereMesh.position, 'y')
		.step(0.001)
		.name('position.y')
		.min(0)
		.max(5);
	sphereTweaks
		.add(sphereMesh.position, 'z')
		.step(0.001)
		.name('position.z')
		.min(-5)
		.max(5);
	// // // // // // // // // // // // // // // // // // //
	// shadow things tweaks

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

	// // // // // // // // // // // // // // // // // // //
	spotTweaks.addColor(spotLight, 'color');
	spotTweaks.add(spotLight, 'intensity').min(0).max(4).step(0.001);
	spotTweaks.add(spotLight, 'distance').min(0).max(20).step(0.001);
	spotTweaks
		.add(spotLight, 'angle')
		.min(-2 * Math.PI)
		.max(2 * Math.PI)
		.step(0.001);
	// spotTweaks.add(spotLight, 'penumbra').min(0).max(1).step(0.001);
	spotTweaks.add(spotLight, 'decay').min(0).max(2).step(0.001);

	spotTweaks
		.add(spotLight.position, 'x')
		.step(0.001)
		.name('position.x')
		.min(-10)
		.max(10)
		.step(0.001);
	spotTweaks
		.add(spotLight.position, 'y')
		.step(0.001)
		.name('position.y')
		.min(-10)
		.max(10)
		.step(0.001);
	spotTweaks
		.add(spotLight.position, 'z')
		.step(0.001)
		.name('position.z')
		.min(-10)
		.max(10)
		.step(0.001);

	spotTweaks
		.add({ a: '' }, 'a')
		.disable()
		.name(
			"Target moving wouldn't work if we didn't add target Object3D to\n the scene",
		);

	spotTweaks
		.add(spotLight.target.position, 'x')
		.min(-3)
		.max(3)
		.name('spotLight.target.position.x');
	spotTweaks
		.add(spotLight.target.position, 'y')
		.min(-3)
		.max(3)
		.name('spotLight.target.position.y');
	spotTweaks
		.add(spotLight.target.position, 'z')
		.min(-3)
		.max(3)
		.name('spotLight.target.position.z');

	spotTweaks.add(spotLight, 'visible').name('spotLight visible');

	// point light tweaks ----------------
	pointTweaks
		.add(pointLight, 'intensity')
		.name('point light intensity')
		.min(0)
		.max(20)
		.step(0.001);
	pointTweaks.addColor(pointLight, 'color').name('point light color');
	pointTweaks
		.add(pointLight.position, 'x')
		.step(0.001)
		.name('point light x')
		.min(-3)
		.max(3);
	pointTweaks
		.add(pointLight.position, 'y')
		.step(0.001)
		.name('point light y')
		.min(-3)
		.max(3);
	pointTweaks
		.add(pointLight.position, 'z')
		.step(0.001)
		.name('point light z')
		.min(-3)
		.max(3);
	pointTweaks
		.add(pointLight, 'distance')
		.min(0)
		.max(20)
		.step(0.01)
		.name('point light distance');
	pointTweaks
		.add(pointLight, 'decay')
		.min(-1)
		.max(20)
		.step(0.01)
		.name('point light decey');

	pointLightShadowTweaks
		.add({ a: '' }, 'a')
		.disable()
		.name(
			'keep width and height for mapSize the same --------------------------------',
		);
	const pointShadowMapSizes = {
		128: 128,
		256: 256,
		512: 512,
		1024: 1024,
		2048: 2048,
	};
	pointLightShadowTweaks
		.add(pointLight.shadow.mapSize, 'width', pointShadowMapSizes)
		.name('pointLight.shadow.mapSize.width');

	pointLightShadowTweaks
		.add(pointLight.shadow.mapSize, 'height', pointShadowMapSizes)
		.name('pointLight.shadow.mapSize.height');

	// --------------------------------------------------------
	// 8 - Camera - Perspective Camera
	const camera = new THREE.PerspectiveCamera(
		75,
		sizes.width / sizes.height,
		0.1,
		100,
	);

	// camera.position.z = 3;
	// camera.position.y = 1.5;
	// camera.position.x = 1;
	camera.position.z = 1;
	camera.position.y = 1;
	camera.position.x = 2;

	// camera.lookAt(boxMesh.position);

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

	const arrowHelper = new THREE.ArrowHelper(
		directionalLight.position.clone().normalize(), // direction
		new THREE.Vector3(0, 0, 0), // origin
		1, // length
		0xffffff, // color
	);

	arrowHelper.visible = false;

	directionalTweaks
		.add({ a: '' }, 'a')
		.disable()
		.name(
			"The arrow direction is computed **once** at creation and never\nupdated. If you move the directional light, the arrow stays where it\nwas. For a dynamic arrow, you'd need to recreate or manually update\nit each frame.",
		);

	directionalTweaks
		.add(arrowHelper, 'visible')
		.name('what direction is light comming from');

	scene.add(arrowHelper);

	// // // // // // // // //
	const directionalLightShadowCameraHelper = new THREE.CameraHelper(
		directionalLight.shadow.camera,
	);

	directionalLightShadowCameraHelper.visible = false;

	scene.add(directionalLightShadowCameraHelper);

	directionalShadowTweaks
		.add(directionalLightShadowCameraHelper, 'visible')
		.name('Directional Light Shadow Camera Helper');

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

	const spotLightHelper = new THREE.SpotLightHelper(spotLight);

	spotLightHelper.visible = false;

	spotTweaks
		.add(spotLightHelper, 'visible')
		.name('visualize spot light');

	scene.add(spotLightHelper);

	const spotlightShadowCameraHelper = new THREE.CameraHelper(
		spotLight.shadow.camera,
	);
	spotlightShadowCameraHelper.visible = false;

	scene.add(spotlightShadowCameraHelper);

	spotLightShadowTweaks
		.add({ a: '' }, 'a')
		.disable()
		.name(
			'keep width and height for mapSize the same --------------------------------',
		);
	spotLightShadowTweaks
		.add(spotLight.shadow.mapSize, 'width', shadowMapSizes)
		.name('spotLight.shadow.mapSize.width');

	spotLightShadowTweaks
		.add(spotLight.shadow.mapSize, 'height', shadowMapSizes)
		.name('spotLight.shadow.mapSize.height');

	spotLightShadowTweaks
		.add(spotLight.shadow.camera, 'fov')
		.min(0)
		.max(100)
		.step(0.001)
		.onChange(() => {
			spotLight.shadow.camera.updateProjectionMatrix();
			spotlightShadowCameraHelper.update();
		})
		.disable()
		.name('spotLight.shadow.camera.fov');

	spotLightShadowTweaks
		.add(spotLight.shadow.camera, 'near')
		.min(0)
		.max(10)
		.step(0.001)
		.onChange(() => {
			spotLight.shadow.camera.updateProjectionMatrix();
			spotlightShadowCameraHelper.update();
		})
		.name('spotLight.shadow.camera.near');
	spotLightShadowTweaks
		.add(spotLight.shadow.camera, 'far')
		.min(0)
		.max(50)
		.step(0.001)
		.onChange(() => {
			spotLight.shadow.camera.updateProjectionMatrix();
			spotlightShadowCameraHelper.update();
		})

		.disable()
		.name('spotLight.shadow.camera.far');

	spotLightShadowTweaks
		.add(spotLight.shadow, 'focus')
		.min(0)
		.max(2)
		.step(0.001)
		.onChange(() => {
			spotlightShadowCameraHelper.update();
		})
		.name('spotLight.shadow.focus');

	//
	spotLightShadowTweaks
		.add(spotlightShadowCameraHelper, 'visible')
		.name('show spotlight shadow camera helper');

	// // // // // // // // //
	spotLightShadowTweaks
		.add({ a: '' }, 'a')
		.disable()
		.name(
			'--------------------------------------------------------------------------------------------\n--------------------------------------------------------------------------------------------',
		);

	// // // // // // // // //

	const pointLightHelper = new THREE.PointLightHelper(pointLight);

	pointLightHelper.visible = false;

	scene.add(pointLightHelper);

	pointTweaks
		.add(pointLightHelper, 'visible')
		.name('point light helper visible');

	// // // // // // // // //

	const pointLightShadowCameraHelper = new THREE.CameraHelper(
		pointLight.shadow.camera,
	);

	pointLightShadowCameraHelper.visible = false;

	scene.add(pointLightShadowCameraHelper);

	pointLightShadowTweaks
		.add(pointLight.shadow.camera, 'near')
		.min(0)
		.max(10)
		.step(0.001)
		.onChange(() => {
			pointLight.shadow.camera.updateProjectionMatrix();
			pointLightShadowCameraHelper.update();
		})
		.name('pointLight.shadow.camera.near');
	pointLightShadowTweaks
		.add(pointLight.shadow.camera, 'far')
		.min(-10)
		.max(50)
		.step(0.001)
		.onChange(() => {
			pointLight.shadow.camera.updateProjectionMatrix();
			pointLightShadowCameraHelper.update();
		})
		.disable()
		.name('pointLight.shadow.camera.far');

	pointLightShadowTweaks
		.add(pointLightShadowCameraHelper, 'visible')
		.name('point light shadow camera helper visible');

	pointLightShadowTweaks
		.add({ a: '' }, 'a')
		.disable()
		.name(
			'--------------------------------------------------------------------------------------------\n--------------------------------------------------------------------------------------------',
		);

	// // // // // // // // //

	const axesHelper = new THREE.AxesHelper(5);
	axesHelper.setColors('red', 'green', 'blue');
	scene.add(axesHelper);
	axesHelper.visible = false;

	gui.add(axesHelper, 'visible').name('show axes');

	// ----------------------------------------------------
	// 0.2 - Renderer (second part)
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
	renderer.setSize(sizes.width, sizes.height);
	renderer.setClearColor(0x000000, 1);
	renderer.render(scene, camera);

	// --------------------------------------------------------------
	window.addEventListener('resize', () => {
		sizes.width = window.innerWidth;
		sizes.height = window.innerHeight;

		camera.aspect = sizes.width / sizes.height;

		camera.updateProjectionMatrix();

		renderer.setSize(sizes.width, sizes.height);

		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
	});
	// --------------------------------------------------------------

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

	// --------------------------------------------------------------
	const timer = new THREE.Timer();

	renderer.setAnimationLoop(tick);
	// ----------------------------------------------------

	function tick(timestamp: number) {
		timer.update(timestamp);

		const elapsedTime = timer.getElapsed();

		orbitControls.update();

		spotLightHelper.update();

		// EXPLAIN: moving sphereMesh
		sphereMesh.position.x = Math.sin(elapsedTime) * 1.5; // 1.5 to have bigger radius
		sphereMesh.position.z = Math.cos(elapsedTime) * 1.5;
		// EXPLAIN: absolute because we want only positive values
		// we don't want our ball going through the floor
		sphereMesh.position.y = Math.abs(Math.sin(elapsedTime * 3)); // 3 is acceleration

		// EXPLAIN: making shadow plane mesh to move bt z and x same as sphereMesh
		sphereShadowMesh.position.x = sphereMesh.position.x;
		sphereShadowMesh.position.z = sphereMesh.position.z;
		// EXPLAIN: alpha should change according to y
		sphereShadowMesh.material.opacity =
			// EXPLAIN: we have other way around initialy when using just
			// sphereMesh.position.y, opaque is up which is wrong
			// opaque should be when sphere is lower, so we need to
			// suntract from 1
			// and since shadow is a bit to strong we multiply by 0.9
			(1 - sphereMesh.position.y) * 0.9;

		// camera.lookAt(sphereMesh.position);
		// camera.lookAt(new THREE.Vector3()); // default

		// sphereMesh.rotation.y = elapsedTime * 0.1;
		// sphereMesh.rotation.x = 0.15 * elapsedTime;

		renderer.render(scene, camera);
	}
}

await init();
