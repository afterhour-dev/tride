import * as THREE from 'three/webgpu';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import GUI from 'lil-gui';
import gsap from 'gsap';

import { getRequiredElement } from './util';

const canvas = getRequiredElement<HTMLCanvasElement>('canvas#tride');

const gui = new GUI();

// EXPLAIN: replacing usage of gui in all my examples
// with this folder
const cubeTweaks = gui.addFolder('Awsome cube');

// EXPLAIN: close by default
cubeTweaks.close();

// EXPLAIN: we can also nest folders

const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
};

const debugObject = {
	color: '',
	spin: () => {},
	lookAtMesh: false,
	subdivisions: 2,
	speed: 2,
};

async function init() {
	const scene = new THREE.Scene();

	debugObject.color = '#527eaa';

	// 1 - Geometries Materials Meshes

	let boxGeometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2);
	const material = new THREE.MeshBasicMaterial({
		// color: 0x4c9892,
		// color: '#ac78b6',
		// color: 'purple',
		color: debugObject.color,

		wireframe: true,
	});

	const boxMesh = new THREE.Mesh(boxGeometry, material);

	boxMesh.position.x = -1.5;
	boxMesh.position.z = 0.5;

	scene.add(boxMesh);
	// EXPLAIN: here
	cubeTweaks
		.add(boxMesh.position, 'y')
		.min(-3)
		.max(3)
		.step(0.01)
		// .name('elevation')
		.name('boxMesh.position.y');

	const myObject = {
		myStupidProp: 256,
	};

	// EXPLAIN: here
	cubeTweaks.add(myObject, 'myStupidProp');

	// EXPLAIN: here
	cubeTweaks.add(boxMesh, 'visible').name('boxMesh visible');

	// EXPLAIN: here
	cubeTweaks
		.add(boxMesh.material, 'wireframe')
		.name('material wireframe');

	// EXPLAIN: here
	cubeTweaks
		.addColor(debugObject, 'color')
		.onChange((colorVal: THREE.Color) => {
			material.color.set(colorVal);
		});

	const mojaFunkcije = () => {
		gsap.to(boxMesh.rotation, {
			duration: 1.5,

			y: boxMesh.rotation.y + Math.PI * debugObject.speed,
		});
	};
	debugObject.spin = mojaFunkcije;

	// EXPLAIN: here
	cubeTweaks.add(debugObject, 'spin');

	// EXPLAIN: here
	cubeTweaks.add(debugObject, 'speed', { sporo: 2, brzo: 8 });

	debugObject.subdivisions = 2;

	// EXPLAIN: here
	cubeTweaks
		.add(debugObject, 'subdivisions')
		.min(1)
		.max(20)
		.step(1)
		.onFinishChange((subdivs: number) => {
			boxGeometry.dispose();

			boxMesh.geometry = new THREE.BoxGeometry(
				1,
				1,
				1,
				subdivs,
				subdivs,
				subdivs,
			);

			boxGeometry = boxMesh.geometry;
		});

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

	// EXPLAIN: here
	cubeTweaks.add(debugObject, 'lookAtMesh');
	if (debugObject.lookAtMesh) {
		camera.lookAt(boxMesh.position);
	}

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

	// EXPLAIN: here
	cubeTweaks.add(axesHelper, 'visible').name('axesHelper visible');

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
