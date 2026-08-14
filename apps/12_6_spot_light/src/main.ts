import * as THREE from 'three/webgpu';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// needed for rect area light to work in case of WebGPU
import { RectAreaLightTexturesLib } from 'three/addons/lights/RectAreaLightTexturesLib.js';

import GUI from 'lil-gui';
// import gsap from 'gsap';

import { getRequiredElement } from './util';

// const loadingManager = new THREE.LoadingManager();
// const textureLoader = new THREE.TextureLoader(loadingManager);

// ---------------------------------------------------------
const canvas = getRequiredElement<HTMLCanvasElement>('canvas#tride');

// Gui -----------------------------------------------------

const gui = new GUI({
	width: 350,
	title: 'Debugging',
	closeFolders: true,
});

// EXPLAIN: dividing all lights twaeaks into folders becase I
// have too much setting in my gui
const ambientTweaks = gui.addFolder('Ambient Light tweaks');
ambientTweaks.close();
const directionalTweaks = gui.addFolder('Directional Light tweaks');
directionalTweaks.close();
const hemisphereTweaks = gui.addFolder('Hemisphere Light tweaks');
hemisphereTweaks.close();
const pointTweaks = gui.addFolder('Point Light tweaks');
pointTweaks.close();
const rectAreaTweaks = gui.addFolder('Rect Area Light tweaks');
rectAreaTweaks.close();

const spotTweaks = gui.addFolder('Spot Light tweaks');
spotTweaks.open();

const debugObject = {
	rectLookAtBox: () => {},
	rectLookAtCenter: () => {},
	rectLookAtSphere: () => {},
	rectLookAtTorus: () => {},
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
	// 0 - Scene
	const scene = new THREE.Scene();

	// ------------------------------------------------------
	// 1.1 - Renderer (first part)
	const renderer = new THREE.WebGPURenderer({ canvas });
	await renderer.init();

	// needed for react area light to work in case of WebGPU
	THREE.RectAreaLightNode.setLTC(RectAreaLightTexturesLib.init());

	// ------------------------------------------------------
	// 2 - Environment map

	// ------------------------------------------------------
	// 3 -  texture stuff
	// colorSpace and stuff

	// ------------------------------------------------------
	// 4 - Text - font loading, TextGeometry, material, mesh

	// --------------------------------------------------
	// 5 - Lights

	// const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
	// const ambientLight = new THREE.AmbientLight('#a51c81', 8);
	const ambientLight = new THREE.AmbientLight();
	ambientLight.color = new THREE.Color(0xffffff);
	ambientLight.intensity = 0.5;

	ambientLight.visible = false;

	scene.add(ambientLight);

	const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.3);

	directionalLight.position.set(1, 0.25, 0);

	directionalLight.visible = false;

	scene.add(directionalLight);

	const hemisphereLight = new THREE.HemisphereLight();
	hemisphereLight.color = new THREE.Color(0xff0000);
	hemisphereLight.groundColor = new THREE.Color(0x0000ff);
	hemisphereLight.intensity = 0.3;

	hemisphereLight.visible = false;

	scene.add(hemisphereLight);

	const pointLight = new THREE.PointLight(0xff9000, 0.5);

	pointLight.distance = 10;
	pointLight.decay = 2;

	pointLight.position.set(1, -0.5, 1);

	pointLight.visible = false;

	scene.add(pointLight);

	const rectAreaLight = new THREE.RectAreaLight();
	rectAreaLight.color = new THREE.Color(0x4e00ff);
	rectAreaLight.intensity = 2;
	rectAreaLight.width = 1;
	rectAreaLight.height = 1;

	rectAreaLight.position.set(-1.5, 0, 1.5);
	// rectAreaLight.lookAt(new THREE.Vector3());
	rectAreaLight.visible = false;

	scene.add(rectAreaLight);

	// EXPLAIN: Spot Light and its arguments and properties
	const spotLight = new THREE.SpotLight();

	scene.add(spotLight);

	// -----------------------------------------------------
	// 6 - Geometries Materials Meshes

	const boxGeometry = new THREE.BoxGeometry(0.75, 0.75, 0.75);
	const torusGeometry = new THREE.TorusGeometry(0.3, 0.2, 32, 64);
	const sphereGreometry = new THREE.SphereGeometry(0.5, 32, 32);
	const floorGeometry = new THREE.PlaneGeometry(5, 5);

	const material = new THREE.MeshStandardMaterial();

	material.roughness = 0.4;

	const boxMesh = new THREE.Mesh(boxGeometry, material);
	const torusMesh = new THREE.Mesh(torusGeometry, material);
	const sphereMesh = new THREE.Mesh(sphereGreometry, material);
	const floorMesh = new THREE.Mesh(floorGeometry, material);

	// boxMesh.position.x = 1.5;
	// boxMesh.position.z = 3;
	// boxMesh.position.z = 1.5;
	torusMesh.position.x = 1.5;
	sphereMesh.position.x = -1.5;
	floorMesh.rotation.x = -Math.PI / 2;
	floorMesh.position.y = -0.65;

	scene.add(boxMesh, torusMesh, sphereMesh, floorMesh);

	// ------------- Tweaks ----------------------------------
	// 7 - gui tweaks
	// ambientTweaks.add(material, 'wireframe');

	ambientTweaks
		.add(ambientLight, 'intensity')
		.min(0)
		.max(1)
		.step(0.001)
		.name('ambient light intensity');

	ambientTweaks
		.addColor(ambientLight, 'color')
		.name('ambient light color');

	ambientTweaks
		.add(ambientLight, 'visible')
		.name('show ambient light');

	// // // // // // // // // // // // // // // // // // //

	directionalTweaks
		.add(directionalLight, 'intensity')
		.min(0)
		.max(1)
		.step(0.001)
		.name('directional light intensity');

	directionalTweaks
		.addColor(directionalLight, 'color')
		.name('directional light color');

	directionalTweaks
		.add(directionalLight.position, 'x')
		.step(0.5)
		.name('directional light x')
		.min(-100)
		.max(100);
	directionalTweaks
		.add(directionalLight.position, 'y')
		.step(0.5)
		.name('directional light y')
		.min(-100)
		.max(100);
	directionalTweaks
		.add(directionalLight.position, 'z')
		.step(0.5)
		.name('directional light z')
		.min(-100)
		.max(100);

	directionalTweaks
		.add(directionalLight, 'visible')
		.name('show directional light');

	// // // // // // // // // // // // // // // // // // //

	hemisphereTweaks
		.add(hemisphereLight, 'intensity')
		.name('hemispere light intesnity')
		.min(0)
		.max(1)
		.step(0.001);
	hemisphereTweaks
		.addColor(hemisphereLight, 'color')
		.name('hem sky color');
	hemisphereTweaks
		.addColor(hemisphereLight, 'groundColor')
		.name('hem ground color');
	hemisphereTweaks
		.add(hemisphereLight, 'visible')
		.name('show hemisphere light');

	// // // // // // // // // // // // // // // // // // //

	pointTweaks
		.add(pointLight, 'intensity')
		.name('point light intensity')
		.min(0)
		.max(1)
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
	ambientTweaks
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
	pointTweaks.add(pointLight, 'visible').name('point light visible');

	// // // // // // // // // // // // // // // // // // //

	rectAreaTweaks
		.add(rectAreaLight, 'intensity')
		.name('rectArea light intensity')
		.min(0)
		.max(10)
		.step(0.001);
	rectAreaTweaks
		.addColor(rectAreaLight, 'color')
		.name('rectArea light color');

	rectAreaTweaks
		.add(rectAreaLight, 'width')
		.min(0)
		.max(10)
		.name('rectArea light width');
	rectAreaTweaks
		.add(rectAreaLight, 'height')
		.min(0)
		.max(10)
		.name('rectArea light height');

	rectAreaTweaks
		.add(rectAreaLight.position, 'x')
		.step(0.001)
		.name('rectArea light x')
		.min(-3)
		.max(3);
	rectAreaTweaks
		.add(rectAreaLight.position, 'y')
		.step(0.001)
		.name('rectArea light y')
		.min(-3)
		.max(3);
	rectAreaTweaks
		.add(rectAreaLight.position, 'z')
		.step(0.001)
		.name('rectArea light z')
		.min(-3)
		.max(3);
	rectAreaTweaks
		.add(rectAreaLight.rotation, 'y')
		.min(0)
		.max(2 * Math.PI)
		.name('rotate y');

	debugObject.rectLookAtBox = () => {
		rectAreaLight.lookAt(boxMesh.position);
	};
	debugObject.rectLookAtCenter = () => {
		rectAreaLight.lookAt(new THREE.Vector3());
	};
	debugObject.rectLookAtSphere = () => {
		rectAreaLight.lookAt(sphereMesh.position);
	};
	debugObject.rectLookAtTorus = () => {
		rectAreaLight.lookAt(torusMesh.position);
	};
	rectAreaTweaks.add(debugObject, 'rectLookAtBox');
	rectAreaTweaks.add(debugObject, 'rectLookAtCenter');
	rectAreaTweaks.add(debugObject, 'rectLookAtSphere');
	rectAreaTweaks.add(debugObject, 'rectLookAtTorus');

	rectAreaTweaks
		.add(rectAreaLight, 'visible')
		.name('rect area light visible');

	// EXPLAIN: adding spot light to the tweaks
	spotTweaks.addColor(spotLight, 'color');

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

	const axesHelper = new THREE.AxesHelper(5);
	axesHelper.setColors('red', 'green', 'blue');
	scene.add(axesHelper);
	axesHelper.visible = false;

	const directionalLightHelper = new THREE.DirectionalLightHelper(
		directionalLight,
		5,
	);

	directionalLightHelper.visible = false;

	// gui
	// 	.add({ a: '' }, 'a')
	// 	.name(
	// 		'----------------------------------------------------------------------------------------------\n----------------------------------------------------------------------------------------------',
	// 	);

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
		.add(arrowHelper, 'visible')
		.name('what direction is light comming from');

	scene.add(arrowHelper);

	// ambientTweaks
	// 	.add({ a: '' }, 'a')
	// 	.name(
	// 		'----------------------------------------------------------------------------------------------\n----------------------------------------------------------------------------------------------',
	// 	)
	// 	.disable();

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

		// camera.lookAt(boxMesh.position);
		// camera.lookAt(new THREE.Vector3()); // default

		// rectAreaLight.lookAt(sphereMesh.position);

		boxMesh.rotation.y = elapsedTime * 0.1;
		sphereMesh.rotation.y = elapsedTime * 0.1;
		torusMesh.rotation.y = elapsedTime * 0.1;

		boxMesh.rotation.x = 0.15 * elapsedTime;
		sphereMesh.rotation.x = 0.15 * elapsedTime;
		torusMesh.rotation.x = 0.15 * elapsedTime;

		renderer.render(scene, camera);
	}
}

await init();
