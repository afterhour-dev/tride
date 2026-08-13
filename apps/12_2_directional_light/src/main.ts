import * as THREE from 'three/webgpu';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
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

	scene.add(ambientLight);

	// EXPLAIN: DirectionalLight
	// EXPLAIN: range of the intensity
	const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.3);

	// EXPLAIN: Since default is 0,1,0, I wanted that light emits
	// from the right side; so we lowered y and increased x
	// (lower ambien light intensity in gui to see the effect of directional light)
	directionalLight.position.set(1, 0.25, 0);

	scene.add(directionalLight);

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
	// EXPLAIN: added directional light properties to the
	// tweaks
	awsomeTweaks
		.add(directionalLight, 'intensity')
		.min(0)
		.max(1)
		.step(0.001)
		.name('directional light intensity');

	awsomeTweaks
		.addColor(directionalLight, 'color')
		.name('directional light color');

	// EXPLAIN: adding directional light position to the gui so I can also find out
	// what is the defaoult
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

	// EXPLAIN: usage of this axesHelper t odetermine from what direction is light comming from
	const axesHelper = new THREE.AxesHelper(5);
	axesHelper.setColors('red', 'green', 'blue');
	scene.add(axesHelper);
	axesHelper.visible = false;

	awsomeTweaks.add(axesHelper, 'visible').name('show axes');

	// EXPLAIN: we can visualize the light source with a directional light helper
	const directionalLightHelper = new THREE.DirectionalLightHelper(
		directionalLight,
		5,
	);

	directionalLightHelper.visible = false;

	awsomeTweaks
		.add(directionalLightHelper, 'visible')
		.name('visualize directional light');

	scene.add(directionalLightHelper);

	// EXPLAIN: to see direction of the light
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
