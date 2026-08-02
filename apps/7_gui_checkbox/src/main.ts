import * as THREE from 'three/webgpu';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import GUI from 'lil-gui';

import { getRequiredElement } from './util';

const canvas = getRequiredElement<HTMLCanvasElement>('canvas#tride');

const gui = new GUI();

const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
};

// EXPLAIN: why is using this object beneficial?
const debugObject = {
	lookAtMesh: false,
};

async function init() {
	const scene = new THREE.Scene();

	// 1 - Geometries Materials Meshes

	const boxGeometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2);
	const material = new THREE.MeshBasicMaterial({
		color: 0x4c9892,
		// color: '#ac78b6',
		// color: 'purple',

		wireframe: true,
	});

	const boxMesh = new THREE.Mesh(boxGeometry, material);

	boxMesh.position.x = -1.5;
	boxMesh.position.z = 0.5;

	scene.add(boxMesh);

	// EXPLAIN: checkbox
	gui.add(boxMesh, 'visible').name('boxMesh visible');
	// EXPLAIN: you can also access material from boxMesh
	// gui.add(material, 'wireframe').name('material wireframe');
	// EXPLAIN: next line
	gui.add(boxMesh.material, 'wireframe').name('material wireframe');

	// --------------------------------------------------------

	// 3 - Perspective Camera
	const camera = new THREE.PerspectiveCamera(
		75,
		sizes.width / sizes.height,
		0.1,
		100,
	);

	camera.position.z = 3;
	camera.position.y = 1.5;
	camera.position.x = 1;

	// camera.lookAt(boxMesh.position);
	// EXPLAIN: I used this bit differently
	// I'm sure there is maybe better solution with usage of select type
	// but we are not doing select type right now
	// Here this is just a boolean but since I have animations
	// I must use boolean value inside animation too
	gui.add(debugObject, 'lookAtMesh');
	if (debugObject.lookAtMesh) {
		camera.lookAt(boxMesh.position);
	}
	// EXPLAIN: no need for this since this is default
	/* 
	else{
		camera.lookAt(new THREE.Vector3(0,0,0))
	} */

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
	axesHelper.visible = false;

	// EXPLAIN: show this example also
	gui.add(axesHelper, 'visible').name('axesHelper visible');

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

		// camera.lookAt(boxMesh.position);
		// camera.lookAt(new THREE.Vector3());
		// EXPLAIN: we used this here since we need to update animation
		// like I said this would be meaybe better if we used select type
		// but we are not using select type in this lesson
		// EXPLAIN: tell me is it bad for performance to use if
		// statement here
		if (debugObject.lookAtMesh) {
			camera.lookAt(boxMesh.position);
		} else {
			camera.lookAt(new THREE.Vector3(0, 0, 0));
		}

		renderer.render(scene, camera);

		window.requestAnimationFrame(tick);
	}
}

await init();
