// EXPLAIN: I'm not importing css like this
// I can do it with vite but I can also to link it myself
// in html, and I choose to do that
// import './style.css';
import * as THREE from 'three/webgpu';
// import gsap from 'gsap';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

import { getRequiredElement } from './util';

const canvas = getRequiredElement<HTMLCanvasElement>('canvas#tride');

const sizes = {
	// EXPLAIN: instead of hardcoded values
	// width: 800,
	// height: 600,
	// we use these
	width: window.innerWidth,
	height: window.innerHeight,
};

async function init() {
	const scene = new THREE.Scene();

	const boxGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
	const material = new THREE.MeshBasicMaterial({
		color: 0x4c9892,
		// color: 'purple',
		// wireframe: true,
	});

	const mesh = new THREE.Mesh(boxGeometry, material);

	mesh.position.x = -0.5;
	mesh.position.z = 0.5;

	scene.add(mesh);

	// --------------------------------------------------------

	// 3 - Perspective Camera
	const camera = new THREE.PerspectiveCamera(
		75,
		sizes.width / sizes.height,
		0.1,
		100,
	);

	camera.position.z = 3;
	// camera.position.y = 0.5;
	camera.position.x = 1;

	scene.add(camera);

	// 4 - Orbit Controls
	const orbitControls = new OrbitControls(camera, canvas);

	orbitControls.enableDamping = true;
	// orbitControls.update()
	// orbitControls.enabled = false;

	// ------------------------------------------------
	// 5 - Renderer
	const renderer = new THREE.WebGPURenderer({ canvas });
	await renderer.init();

	// EXPLAIN: handling pixel ratio
	// if the device pixel ratio is above 2 we will limit it to
	// because of gpu performance
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
	// EXPLAIN: don't forget to handle pixel ratio
	// in resize handler (should I do this and why?)

	// EXPLAIN: stair effect and how to fix it. What I mean
	// by that I have little stairs when I look at mesh
	// Is this the ability of higher pixel ratio devices
	// and since we don't want to use pixel ratio above two
	// maybe I have this stair effect
	// Also this might be normal since my device have pixel
	// ratio of 1. So should I ignore these little stairs on edges

	// EXPLAIN: on dual monitor setup (laptop plus external monitor)
	// can we have different pixel ratios for built in screen and for
	// external screen?

	// 6 - axes helper
	const axesHelper = new THREE.AxesHelper(5);
	axesHelper.setColors('red', 'green', 'blue');
	scene.add(axesHelper);

	// ----------------------------------------------------
	renderer.setSize(sizes.width, sizes.height);
	renderer.setClearColor(0x000000, 1);
	renderer.render(scene, camera);

	// EXPLAIN: Handling resizing
	window.addEventListener('resize', () => {
		sizes.width = window.innerWidth;
		sizes.height = window.innerHeight;

		// EXPLAIN: we need to update camera
		camera.aspect = sizes.width / sizes.height;
		// EXPLAIN: why we need to update projection matrix of camera
		// and what is projection matrix anyway
		camera.updateProjectionMatrix();
		// EXPLAIN: why we need set sizes for the renderer
		renderer.setSize(sizes.width, sizes.height);

		// EXPLAIN: next line
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
	});
	// EXPLAIN: This is javascript/typescript related question
	// My intuition was to call event listener, bellow places
	// where we instantiate renderer and camera, but we could have
	// do it also before that. Why is this possible. Why is this
	// aspect of javascript/typescript problematic for me to comprehend?

	// EXPLAIN: Handling full screen
	// double click to enter full screen
	// and double click or esc to exit it
	// it cover Safari with webkit thing, and if Safari
	// covers this today tell me
	window.addEventListener('dblclick', () => {
		const fullScreenElement =
			// EXPLAIN: is this approach is still valid?
			// and did I make any mistakes here?

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

	// ----------------------------------------------------
	const timer = new THREE.Timer();

	window.requestAnimationFrame(tick);
	// ----------------------------------------------------

	function tick(timestamp: number) {
		timer.update(timestamp);

		// const elapsedTime = timer.getElapsed();

		orbitControls.update();

		// camera.lookAt(mesh.position);
		// camera.lookAt(new THREE.Vector3());

		renderer.render(scene, camera);

		window.requestAnimationFrame(tick);
	}
}

await init();
