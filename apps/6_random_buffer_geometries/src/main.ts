import * as THREE from 'three/webgpu';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

import { getRequiredElement } from './util';

const canvas = getRequiredElement<HTMLCanvasElement>('canvas#tride');

const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
};

async function init() {
	const scene = new THREE.Scene();

	// 1 - Geometries Materials Meshes

	// EXPLAIN: we want to create a lot of random vertices

	const bufferGeometry = new THREE.BufferGeometry();

	// EXPLAIN: try adding a lot more for interesting effect
	// const verticesCount = 50;
	const verticesCount = 5000;

	// EXPLAIN: I assume since one triangle is 3 vertex but needs to be
	// 9 coordinates values so ve do 3 times 3 (Explain this better if I'm correct)
	const verticesPositionArray = new Float32Array(
		verticesCount * 3 * 3,
	);

	// EXPLAIN:
	for (let i = 0; i < verticesCount * 3 * 3; i++) {
		// EXPLAIN: I guess since random function returns numbers
		// from 0 to 1, we subtract 0.5 to ensure that we also
		// can have negative numbers
		// and multiply by 4 to increase the size a bit
		verticesPositionArray[i] = (Math.random() - 0.5) * 4;
	}

	bufferGeometry.setAttribute(
		'position',
		// EXPLAIN: why this doesn't work. Maybe I made a mistake
		// maybe the number should be the number of vertices forming face
		// new THREE.BufferAttribute(verticesPositionArray, verticesCount),
		// like this
		new THREE.BufferAttribute(verticesPositionArray, 3),
	);

	const material = new THREE.MeshBasicMaterial({
		color: 0x4c9892,
		// color: 'purple',
		wireframe: true,
	});

	const mesh = new THREE.Mesh(bufferGeometry, material);

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
	camera.position.y = 0.5;
	camera.position.x = 1;

	scene.add(camera);

	// 4 - Orbit Controls
	const orbitControls = new OrbitControls(camera, canvas);

	orbitControls.enableDamping = true;
	// orbitControls.enabled = false;
	// orbitControls.update()

	// ------------------------------------------------
	// 5 - Renderer
	const renderer = new THREE.WebGPURenderer({ canvas });
	await renderer.init();

	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

	// 6 - axes helper
	const axesHelper = new THREE.AxesHelper(5);
	axesHelper.setColors('red', 'green', 'blue');
	scene.add(axesHelper);

	// ----------------------------------------------------
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

	window.requestAnimationFrame(tick);
	// ----------------------------------------------------

	function tick(timestamp: number) {
		timer.update(timestamp);

		// const elapsedTime = timer.getElapsed();

		orbitControls.update();

		// camera.lookAt(new THREE.Vector3());

		renderer.render(scene, camera);

		window.requestAnimationFrame(tick);
	}
}

await init();
