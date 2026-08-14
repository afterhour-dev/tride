import * as THREE from 'three/webgpu';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// EXPLAIN: needed for rect area light to work
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

const awsomeTweaks = gui.addFolder('Awsome tweaking');

const debugObject = {
	//
};
// awsomeTweaks.close();

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

	// EXPLAIN: for react area light to work
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

	// EXPLAIN: RectAreaLight and it's parameters and props
	const rectAreaLight = new THREE.RectAreaLight();
	rectAreaLight.color = new THREE.Color(0x4e00ff);
	rectAreaLight.intensity = 2;
	rectAreaLight.width = 1;
	rectAreaLight.height = 1;

	scene.add(rectAreaLight);
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
	// awsomeTweaks.add(material, 'wireframe');

	awsomeTweaks
		.add(ambientLight, 'intensity')
		.min(0)
		.max(1)
		.step(0.001)
		.name('ambient light intensity');

	awsomeTweaks
		.addColor(ambientLight, 'color')
		.name('ambient light color');

	awsomeTweaks
		.add(ambientLight, 'visible')
		.name('show ambient light');

	awsomeTweaks
		.add({ a: '' }, 'a')
		.name(
			'----------------------------------------------------------------------------------------------\n----------------------------------------------------------------------------------------------',
		)
		.disable();

	awsomeTweaks
		.add(directionalLight, 'intensity')
		.min(0)
		.max(1)
		.step(0.001)
		.name('directional light intensity');

	awsomeTweaks
		.addColor(directionalLight, 'color')
		.name('directional light color');

	awsomeTweaks
		.add(directionalLight.position, 'x')
		.step(0.5)
		.name('directional light x')
		.min(-100)
		.max(100);
	awsomeTweaks
		.add(directionalLight.position, 'y')
		.step(0.5)
		.name('directional light y')
		.min(-100)
		.max(100);
	awsomeTweaks
		.add(directionalLight.position, 'z')
		.step(0.5)
		.name('directional light z')
		.min(-100)
		.max(100);

	awsomeTweaks
		.add(directionalLight, 'visible')
		.name('show directional light');

	awsomeTweaks
		.add({ a: '' }, 'a')
		.name(
			'----------------------------------------------------------------------------------------------\n----------------------------------------------------------------------------------------------',
		);

	awsomeTweaks
		.add(hemisphereLight, 'intensity')
		.name('hemispere light intesnity')
		.min(0)
		.max(1)
		.step(0.001);
	awsomeTweaks
		.addColor(hemisphereLight, 'color')
		.name('hem sky color');
	awsomeTweaks
		.addColor(hemisphereLight, 'groundColor')
		.name('hem ground color');
	awsomeTweaks
		.add(hemisphereLight, 'visible')
		.name('show hemisphere light');

	awsomeTweaks
		.add({ a: '' }, 'a')
		.name(
			'----------------------------------------------------------------------------------------------\n----------------------------------------------------------------------------------------------',
		);

	awsomeTweaks
		.add(pointLight, 'intensity')
		.name('point light intensity')
		.min(0)
		.max(1)
		.step(0.001);
	awsomeTweaks
		.addColor(pointLight, 'color')
		.name('point light color');
	awsomeTweaks
		.add(pointLight.position, 'x')
		.step(0.001)
		.name('point light x')
		.min(-3)
		.max(3);
	awsomeTweaks
		.add(pointLight.position, 'y')
		.step(0.001)
		.name('point light y')
		.min(-3)
		.max(3);
	awsomeTweaks
		.add(pointLight.position, 'z')
		.step(0.001)
		.name('point light z')
		.min(-3)
		.max(3);
	awsomeTweaks
		.add(pointLight, 'distance')
		.min(0)
		.max(20)
		.step(0.01)
		.name('point light distance');
	awsomeTweaks
		.add(pointLight, 'decay')
		.min(-1)
		.max(20)
		.step(0.01)
		.name('point light decey');
	awsomeTweaks.add(pointLight, 'visible').name('point light visible');

	awsomeTweaks
		.add({ a: '' }, 'a')
		.name(
			'----------------------------------------------------------------------------------------------\n----------------------------------------------------------------------------------------------',
		);

	awsomeTweaks
		.add(rectAreaLight, 'intensity')
		.name('rectAl light intensity')
		.min(0)
		.max(10)
		.step(0.001);
	awsomeTweaks
		.addColor(rectAreaLight, 'color')
		.name('rectAl light color');
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
	// 10 - helpes

	const axesHelper = new THREE.AxesHelper(5);
	axesHelper.setColors('red', 'green', 'blue');
	scene.add(axesHelper);
	axesHelper.visible = false;

	const directionalLightHelper = new THREE.DirectionalLightHelper(
		directionalLight,
		5,
	);

	directionalLightHelper.visible = false;

	awsomeTweaks
		.add({ a: '' }, 'a')
		.name(
			'----------------------------------------------------------------------------------------------\n----------------------------------------------------------------------------------------------',
		);

	awsomeTweaks
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

	awsomeTweaks
		.add(arrowHelper, 'visible')
		.name('what direction is light comming from');

	scene.add(arrowHelper);

	awsomeTweaks
		.add({ a: '' }, 'a')
		.name(
			'----------------------------------------------------------------------------------------------\n----------------------------------------------------------------------------------------------',
		)
		.disable();
	awsomeTweaks.add(axesHelper, 'visible').name('show axes');

	awsomeTweaks.open();

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
