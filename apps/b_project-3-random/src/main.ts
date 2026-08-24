// import * as THREE from 'three/webgpu';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import GUI from 'lil-gui';
// import gsap from 'gsap';

import { getRequiredElement } from './util';

// loading textures -----------------------------------------
// const loadingManager = new THREE.LoadingManager();
// const textureLoader = new THREE.TextureLoader(loadingManager);

// ---------------------------------------------------------
const canvas = getRequiredElement<HTMLCanvasElement>('canvas#tride');

// Gui -----------------------------------------------------
const gui = new GUI({
	width: 350,
	title: 'Tweaks',
	closeFolders: true,
});

const debugObject = {
	count: 100000,
	size: 0.01,
	radius: 5,
	branchesCount: 3,
	// EXPLAIN: adding spin
	spin: 1,
	// EXPLAIN: adding randomness
	randomness: 0.2,
	// EXPLAIN: to be used with pow() u prevodu stepenovanje
	randomnessPow: 3,
};

const galaxyTweaks = gui.addFolder('galaxy tweaks');
galaxyTweaks.close();

// --------------------------------------------------------
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
};
// --------------------------------------------------------

/* async  */ function init() {
	// Scene
	const scene = new THREE.Scene();

	// ------------------------------------------------------
	// 0.1 - Renderer (first part)
	// using WebGL for this lesson
	// const renderer = new THREE.WebGPURenderer({ canvas });
	const renderer = new THREE.WebGLRenderer({ canvas });
	// await renderer.init();

	// -----------------------------------------------------
	// 1 - Environment

	// ------------------------------------------------------
	// 2 - Shadows stuff globaly related

	// ------------------------------------------------------
	// 3 -  texture stuff
	// colorSpace and stuff

	// ------------------------------------------------------
	// 4 - Text - font loading, TextGeometry, material, mesh

	// --------------------------------------------------
	// 5 - Lights

	//
	//  5.1 - Shadow stuff related to directional light

	// -----------------------------------------------------
	// 6 - Geometries Materials Meshes Particles

	let geometry: THREE.BufferGeometry | null = null;
	let material: THREE.PointsMaterial | null = null;
	let particles: THREE.Points | null = null;

	const generateGalaxy = () => {
		// console.log('Galaxy generated');

		if (particles && particles.parent) {
			particles.parent.remove(particles);
			particles = null;
		}
		if (geometry) {
			geometry.dispose();
			geometry = null;
		}
		if (material) {
			material.dispose();
			material = null;
		}

		geometry = new THREE.BufferGeometry();
		const positions = new Float32Array(debugObject.count * 3);

		material = new THREE.PointsMaterial();
		material.size = debugObject.size;
		material.sizeAttenuation = true;

		material.depthWrite = false;
		material.blending = THREE.AdditiveBlending;

		for (let i = 0; i < debugObject.count * 3; i++) {
			const i3 = i * 3;

			const radius = Math.random() * debugObject.radius;

			// const branchAngle = i % debugObject.branchesCount;

			// const branchAngle =
			// 	(i % debugObject.branchesCount) / debugObject.branchesCount;

			const branchAngle =
				((i % debugObject.branchesCount) /
					debugObject.branchesCount) *
				Math.PI *
				2;

			// EXPLAIN: creating spin angle. How is done? Why we get spin
			// path of laying the particles
			const spinAngle = radius * debugObject.spin;
			// EXPALIN: we than add this spin to the old angle We are using
			// in sinus and cosinus functions. Explain

			// if (i < 50) {
			// 	console.log(i, branchAngle);
			// }

			// positions[i3] = Math.sin(branchAngle);
			// positions[i3 + 2] = Math.cos(branchAngle);

			// positions[i3] = Math.sin(branchAngle + spinAngle) * radius;
			// positions[i3 + 2] = Math.cos(branchAngle + spinAngle) * radius;

			// EXPLAIN: let's start  calculate some random values
			// const randomX =
			// 	(Math.random() - 0.5) * debugObject.randomness * radius;
			// const randomY =
			// 	(Math.random() - 0.5) * debugObject.randomness * radius;
			// const randomZ =
			// 	(Math.random() - 0.5) * debugObject.randomness * radius;

			// EXPLAIN: but let's add pow to randomness. Yo uexplain the effect
			// const randomX =
			// (Math.pow(Math.random(), debugObject.randomnessPow) - 0.5) *
			// debugObject.randomness *
			// radius;
			// const randomY =
			// (Math.pow(Math.random(), debugObject.randomnessPow) - 0.5) *
			// debugObject.randomness *
			// radius;
			// const randomZ =
			// (Math.pow(Math.random(), debugObject.randomnessPow) - 0.5) *
			// debugObject.randomness *
			// radius;
			//EXPLAIN: why we multiply by - 1 OR 1

			const randomX =
				Math.pow(Math.random(), debugObject.randomnessPow) *
				(Math.random() < 0.5 ? 1 : -1) *
				debugObject.randomness *
				radius;
			const randomY =
				Math.pow(Math.random(), debugObject.randomnessPow) *
				(Math.random() < 0.5 ? 1 : -1) *
				debugObject.randomness *
				radius;
			const randomZ =
				Math.pow(Math.random(), debugObject.randomnessPow) *
				(Math.random() < 0.5 ? 1 : -1) *
				debugObject.randomness *
				radius;

			// positions[i3] = Math.sin(branchAngle + spinAngle) * radius;
			// positions[i3 + 1] = 0;
			// positions[i3 + 2] = Math.cos(branchAngle + spinAngle) * radius;
			// EXPLAIN: adding random values to position
			positions[i3] =
				Math.sin(branchAngle + spinAngle) * radius + randomX;

			positions[i3 + 1] = randomY;

			positions[i3 + 2] =
				Math.cos(branchAngle + spinAngle) * radius + randomZ;
		}

		geometry.setAttribute(
			'position',
			new THREE.BufferAttribute(positions, 3),
		);

		particles = new THREE.Points(geometry, material);
		scene.add(particles);

		// console.log(particles.parent);
	};

	generateGalaxy();

	// --------------------------------------------------------
	// 7 - Camera - Perspective Camera
	const camera = new THREE.PerspectiveCamera(
		75,
		sizes.width / sizes.height,
		0.1,
		100,
	);

	// camera.position.z = 3;
	// camera.position.y = 1.5;
	// camera.position.x = 1;
	// camera.position.z = 1;
	// camera.position.y = 1;
	// camera.position.x = 2;
	camera.position.z = 3;
	camera.position.y = 2;
	camera.position.x = 2;

	// camera.lookAt(particles.position);

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

	// // // // // // // // //

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
	/* const shadowMapAlgoType = {
		BasicShadowMap: THREE.BasicShadowMap,
		PCFShadowMap: THREE.PCFShadowMap,
		PCFSoftShadowMap: THREE.PCFSoftShadowMap,
		VSMShadowMap: THREE.VSMShadowMap,
	};
	gui
		.add(renderer.shadowMap, 'enabled')
		.name('renderer.shadowMap.enabled')
		.disable();
	gui
		.add(renderer.shadowMap, 'type', shadowMapAlgoType)
		.name('renderer.shadowMap.type')
		.disable(); */

	// // // // // // // // // // ---------------------------------
	// gui - Folders ----------------
	// // // // // // // // // // ---------------------------------

	// // // // // // // // // // // // // // // // // // //

	galaxyTweaks.open();
	galaxyTweaks
		.add(debugObject, 'count')
		.step(100)
		.name('particle count')
		.min(100)
		.max(1000000)
		.onFinishChange(generateGalaxy);

	galaxyTweaks
		.add(debugObject, 'size')
		.min(0.001)
		.max(0.1)
		.step(0.001)
		.onFinishChange(generateGalaxy);
	galaxyTweaks
		.add(debugObject, 'radius')
		.min(0.01)
		.max(10)
		.step(0.01)
		.onFinishChange(generateGalaxy);
	galaxyTweaks
		.add(debugObject, 'branchesCount')
		.min(1)
		.max(20)
		.step(1)
		.onFinishChange(generateGalaxy);
	// EXPLAIN: tweaks for spin
	galaxyTweaks
		.add(debugObject, 'spin')
		.min(-0.5)
		.step(0.001)
		.max(5)
		.onFinishChange(generateGalaxy);
	// EXPLAIN: tweaks for randomness
	galaxyTweaks
		.add(debugObject, 'randomness')
		.min(0)
		.max(2)
		.step(0.001)
		.onFinishChange(generateGalaxy);
	// EXPLAIN: twqeaks for pow randomness
	galaxyTweaks
		.add(debugObject, 'randomnessPow')
		.min(1)
		.max(10)
		.step(0.001)
		.onFinishChange(generateGalaxy);

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

/* await */ init();
