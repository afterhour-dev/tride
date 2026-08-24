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
	// EXPLAIN: adding radius and branchesCount
	radius: 5,
	branchesCount: 3,
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

			// EXPLAIN: we are using radius here
			// this also menas values from 0 to debuhObject.radius
			const radius = Math.random() * debugObject.radius;

			// EXPLAIN: explain how we use modulo here to acomplihe what exactly?

			// EXPLAIN:  we want just same amount of angles
			// as specified by debugObject.branchesCount; but what are
			// we dividing is full circle if we want our
			// debugObject.branchesCount number
			// of angles to span equaly over circle of
			// 180deg or 2 * Math.PI

			// EXPLAIN: we are using iterator as an angle, but we don't want
			// just sequential angle values where we would only have
			// sequences of
			// (0,1,2,3...debugObject.branchesCount),(0,1,2,3...debugObject.branchesCount)...
			// which we get with i % debugObject.branchesCount
			// but if you test how it looks you would get
			// placement of particles across branchesCount amount of
			// angles but tey wouldn't devide 360 angle
			// const branchAngle = i % debugObject.branchesCount;

			// EXPLAIN: by doing this next division we get numbers
			// bellow 1 since i % debugObject.branchesCount can
			// get us only  0,1,2,3...debugObject.branchesCount
			// anb by deviing it with debugObject.branchesCount
			// you get 0 / branchesCount, 1 / branchesCountCount ...
			// const branchAngle =
			// 	(i % debugObject.branchesCount) / debugObject.branchesCount;

			// EXPLAIN: but what can we do with these numbers bellow 1
			// if we multiply them by 2 * Math.Pi angles will be
			// evenly placed acroos 360 deg circle
			// EXPLAIN: I need way better and in steps explanation what we did
			// in this lesson
			const branchAngle =
				((i % debugObject.branchesCount) /
					debugObject.branchesCount) *
				Math.PI *
				2;

			// if (i < 50) {
			// 	console.log(i, branchAngle);
			// }

			positions[i3] = Math.sin(branchAngle) * radius;
			positions[i3 + 1] = 0;
			positions[i3 + 2] = Math.cos(branchAngle) * radius;
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
	camera.position.y = 3;

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
	// EXPLAIN: using gui
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
	// EXPLAIN: next gui tweaks
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
