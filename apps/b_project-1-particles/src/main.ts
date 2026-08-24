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

// EXPLAIN: we are using debug object this time
const debugObject = {
	count: 100000,
	size: 0.01,
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
	// EXPLAIN: using WebGL for this lesson
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

	// EXPLAIN: function for generating galaxy

	// EXPLAIN: we have here outside of the function because
	// we need to destroy them in gui when creating new ones
	let geometry: THREE.BufferGeometry | null = null;
	let material: THREE.PointsMaterial | null = null;
	let particles: THREE.Points | null = null;

	const generateGalaxy = () => {
		// console.log('Galaxy generated');

		// EXPLAIN destroying old stuff
		if (particles && particles.parent) {
			// EXPLAIN: particles parent should be our Scene instance
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
		// EXPLAIN: we are using third way we explored in lesson
		// 14.2_map-alpha-map-colors-blending
		material.depthWrite = false;
		material.blending = THREE.AdditiveBlending;

		for (let i = 0; i < debugObject.count * 3; i++) {
			const i3 = i * 3;

			// EXPLAIN: Math.random() - 0.5 is centering in the center
			// of the scene
			positions[i3] = (Math.random() - 0.5) * 3;
			positions[i3 + 1] = (Math.random() - 0.5) * 3;
			positions[i3 + 2] = (Math.random() - 0.5) * 3;
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
	/* .onFinishChange((count: number) => {
			// EXPLAIN: remeber, since this is geometry thing, you
			// must dispose old geometry

			console.log({ count });
			console.log('You must destroy particles');
		}); */

	galaxyTweaks
		.add(debugObject, 'size')
		.min(0.001)
		.max(0.1)
		.step(0.001)
		.onFinishChange(generateGalaxy);
	/* .onChange((size: number) => {
			console.log({ size });
		}); */

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
