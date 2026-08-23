import * as THREE from 'three';
// import * as THREE from 'three/webgpu';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import GUI from 'lil-gui';
// import gsap from 'gsap';

import { getRequiredElement } from './util';

// loading textures -----------------------------------------
const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManager);

// EXPLAIN: loading textures I'm going to use as map or alphaMap
// EXPLAIN: all of these textures I tried are black and white without
// transparent parts by design
const particleTexture = textureLoader.load(
	'/textures/particles/circle_04.png',
);
// ---------------------------------------------------------
const canvas = getRequiredElement<HTMLCanvasElement>('canvas#tride');

// Gui -----------------------------------------------------
const gui = new GUI({
	width: 350,
	title: 'Tweaks',
	closeFolders: true,
});
const debugObject = {};

const pointsTweaks = gui.addFolder('particles (Points instance)');
pointsTweaks.close();

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

	// const particlesGreometry = new THREE.SphereGeometry(1, 32, 32);

	const particlesGreometry = new THREE.BufferGeometry();

	// const count = 500;
	// const count = 5000;
	const count = 20000;
	// we tried bigger counts and we didn't have any issues
	// const count = 50000;
	// const count = 500000;

	const positions = new Float32Array(count * 3);
	// EXPLAIN: for adding different colors
	const colors = new Float32Array(count * 3);

	for (let i = 0; i < count * 3; i++) {
		positions[i] = (Math.random() - 0.5) * 10;

		// EXPLAIN: next line
		colors[i] = Math.random();
	}

	particlesGreometry.setAttribute(
		'position',
		new THREE.BufferAttribute(positions, 3),
	);
	// EXPLAIN: setting color buffer attribute
	particlesGreometry.setAttribute(
		'color',
		new THREE.BufferAttribute(colors, 3),
	);

	const particlesMaterial = new THREE.PointsMaterial();

	// EXPLAIN: next properties
	// EXPLAIN: since we added different colors with attribute
	// on geometry we can use this or not, if it stays
	// it will interpolate with vertex colors we randomized
	// I commented it out
	// particlesMaterial.color = new THREE.Color('#8c499a');

	// EXPLAIN: don't forget next line for different colors
	particlesMaterial.vertexColors = true;

	particlesMaterial.size = 0.1;
	particlesMaterial.sizeAttenuation = true;

	// EXPLAIN: setting texture as map
	// EXPLAIN: because we wan't transparency on black and
	// white texture, we won't use map
	// particlesMaterial.map = particleTexture;

	// EXPLAIN: we will use alphaMap and transparent set to true
	particlesMaterial.transparent = true;
	particlesMaterial.alphaMap = particleTexture;

	// EXPLAIN: alphaTest
	// particlesMaterial.alphaTest = 0.001;

	// EXPLAIN: depthTest
	// particlesMaterial.depthTest = false;

	// EXPLAIN: depthWrite
	particlesMaterial.depthWrite = false;

	// EXPLAIN: blending
	particlesMaterial.blending = THREE.AdditiveBlending;

	const particles = new THREE.Points(
		particlesGreometry,
		particlesMaterial,
	);

	scene.add(particles);

	// EXPLAIN: adding cube to the scene to se thar deactivating depth
	// test isn't ideal and to examone depthWrite and blending
	// const cube = new THREE.Mesh(
	// new THREE.BoxGeometry(1, 1, 1),
	// new THREE.MeshBasicMaterial(),
	// );
	// scene.add(cube);

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
	const shadowMapAlgoType = {
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
		.disable();

	// // // // // // // // // // ---------------------------------
	// gui - Folders ----------------
	// // // // // // // // // // ---------------------------------

	// // // // // // // // // // // // // // // // // // //
	pointsTweaks
		.add(particles.position, 'x')
		.step(0.001)
		.name('position.x')
		.min(-5)
		.max(5);
	pointsTweaks
		.add(particles.position, 'y')
		.step(0.001)
		.name('position.y')
		.min(0)
		.max(5);
	pointsTweaks
		.add(particles.position, 'z')
		.step(0.001)
		.name('position.z')
		.min(-5)
		.max(5);
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

/* await  */ init();
