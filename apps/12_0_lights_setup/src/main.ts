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

	// EXPLAIN: we have ambient and point light here in the starter
	// app, but we are going to remove it at first when we start
	// dealing with light in next group of lessons
	const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
	// const ambientLight = new THREE.AmbientLight('#a51c81', 8);
	scene.add(ambientLight);

	const pointLight = new THREE.PointLight(0xffffff, 50);
	// const pointLight = new THREE.PointLight('#b694d4', 9);

	// EXPLAIN: placed point light in the same side of the scene
	// as our camera so we can see the effect of this
	// light emination on to objects
	pointLight.position.x = 2;
	pointLight.position.y = 3;
	pointLight.position.z = 4;

	scene.add(pointLight);
	// -----------------------------------------------------
	// 6 - Geometries Materials Meshes

	const boxGeometry = new THREE.BoxGeometry(0.75, 0.75, 0.75);
	const torusGeometry = new THREE.TorusGeometry(0.3, 0.2, 32, 64);
	const sphereGreometry = new THREE.SphereGeometry(0.5, 32, 32);
	const floorGeometry = new THREE.PlaneGeometry(5, 5);

	// EXPLAIN: we need material that uses light; would be invisible
	// if no light present
	const material = new THREE.MeshStandardMaterial();

	// EXPLAIN: why we used this roughness to start exploring lights
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
	// 10 - axes helper
	const axesHelper = new THREE.AxesHelper(5);
	axesHelper.setColors('red', 'green', 'blue');
	scene.add(axesHelper);
	axesHelper.visible = false;

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

	// window.requestAnimationFrame(tick);
	renderer.setAnimationLoop(tick);
	// ----------------------------------------------------

	function tick(timestamp: number) {
		timer.update(timestamp);

		const elapsedTime = timer.getElapsed();

		orbitControls.update();

		// camera.lookAt(boxMesh.position);
		// camera.lookAt(new THREE.Vector3()); // default

		// EXPLAIN: we want to rotate the meshes as we examine the
		// light effect over the material
		boxMesh.rotation.y = elapsedTime * 0.1;
		sphereMesh.rotation.y = elapsedTime * 0.1;
		torusMesh.rotation.y = elapsedTime * 0.1;

		boxMesh.rotation.x = 0.15 * elapsedTime;
		sphereMesh.rotation.x = 0.15 * elapsedTime;
		torusMesh.rotation.x = 0.15 * elapsedTime;

		renderer.render(scene, camera);

		// window.requestAnimationFrame(tick);
	}
}

await init();
