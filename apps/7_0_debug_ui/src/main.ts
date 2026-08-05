import * as THREE from 'three/webgpu';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
// EXPLAIN: tell something about this package, provide links
import GUI from 'lil-gui';
import gsap from 'gsap';

import { getRequiredElement } from './util';

const canvas = getRequiredElement<HTMLCanvasElement>('canvas#tride');

const gui = new GUI();

const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
};

// EXPLAIN: used for the color problem we mentioned
const debugObject = {
	color: '',
	// EXPLAIN: function/button
	spin: () => {},
	// EXPLAIN: se what I did with it and explain
	lookAtMesh: false,
	// EXPLAIN: next line
	subdivisions: 2,
};

async function init() {
	const scene = new THREE.Scene();

	// EXPLAIN:
	debugObject.color = '#527eaa';

	// 1 - Geometries Materials Meshes

	// EXPLAIN: why we use let here
	let boxGeometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2);
	const material = new THREE.MeshBasicMaterial({
		// color: 0x4c9892,
		// color: '#ac78b6',
		// color: 'purple',
		// EXPLAIN: next lines
		color: debugObject.color,

		wireframe: true,
	});

	const boxMesh = new THREE.Mesh(boxGeometry, material);

	boxMesh.position.x = -1.5;
	boxMesh.position.z = 0.5;

	scene.add(boxMesh);

	// EXPLAIN: range -> explain all parameters
	// gui.add(boxMesh.position, 'y', -3, 3, 0.01);

	// EXPLAIN: chaining function calls is more declarative
	gui
		.add(boxMesh.position, 'y')
		.min(-3)
		.max(3)
		.step(0.01)
		// .name('elevation')
		.name('boxMesh.position.y');

	// EXPLAIN: you can't update the variable, but you can object
	// let myVariable = 256;
	// gui.add(myVariable, "???")
	const myObject = {
		myStupidProp: 256,
	};
	gui.add(myObject, 'myStupidProp');

	// EXPLAIN: checkbox
	gui.add(boxMesh, 'visible').name('boxMesh visible');
	// EXPLAIN: you can also access material from boxMesh
	// gui.add(material, 'wireframe').name('material wireframe');
	gui.add(boxMesh.material, 'wireframe').name('material wireframe');

	// EXPLAIN: colors (explain especiallty that color property is THREE.Color instance)
	gui
		// EXPLAIN: instead of this
		// .addColor(material, 'color')
		// do it on the object
		.addColor(debugObject, 'color')
		// EXPLAIN: one way that w eobtain color heh to use it in code
		// to be exact right one we chosen
		.onChange((colorVal: THREE.Color) => {
			// EXPLAIN: we copy this from the console and, set it
			// to material in code to have exact same color
			// console.log(colorVal.getHexString());
			// EXPLAIN: we don't need to manully copy from console
			// anymore
			// boxMesh.material.color.set(colorVal);
			// EXPLAIN: or without argument
			material.color.set(colorVal);
		});

	// EXPLAIN: next function/button
	const mojaFunkcije = () => {
		// console.log('moja funkcija');
		// console.log(boxMesh.rotation.y);
		gsap.to(boxMesh.rotation, {
			duration: 1.5,
			// EXPLAIN: it's like boxMesh.rotation.y += Math.PI * 2, but with animation
			y: boxMesh.rotation.y + Math.PI * 2,
		});
	};
	debugObject.spin = mojaFunkcije;
	gui.add(debugObject, 'spin');

	// EXPLAIN: tweaking the geometry
	// it is bad to use onChange, we use onFinishChange instead
	debugObject.subdivisions = 2;
	gui
		.add(debugObject, 'subdivisions')
		.min(1)
		.max(20)
		.step(1)
		.onFinishChange((subdivs: number) => {
			// EXPLAIN: Should we dispose old geometry?
			// Yes, we should
			// should we dispose it here or after
			// creating new geometry? It doesn't matter, but we should do it before creating new geometry
			boxGeometry.dispose();

			boxMesh.geometry = new THREE.BoxGeometry(
				1,
				1,
				1,
				subdivs,
				subdivs,
				subdivs,
			);

			// EXPLAIN: should we also reassign new geometry to
			// old variable? Yes, we should
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
	// EXPLAIN: I used this bit differently
	// just a boolean but since I have animations
	// I must use boolean value there too
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
		// EXPLAIN: we used this here
		// Aand tell me is this bad for performance?
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
