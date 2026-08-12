import * as THREE from 'three/webgpu';
// import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// EXPLAIN: importing FontLoader, which of these two imports are more up to data
// import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
// EXPLAIN: importing TextGeometry
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import GUI from 'lil-gui';
// import gsap from 'gsap';

import { getRequiredElement } from './util';

// const loadingManager = new THREE.LoadingManager();

// const textureLoader = new THREE.TextureLoader(loadingManager);

//

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

	// 4 - Text -  loading, TextGeometry, material, mesh
	// EXPLAIN: FontLoader
	const fontLoader = new FontLoader();
	// console.log(fontLoader);
	// console.log(TextGeometry);
	const font = await fontLoader.loadAsync(
		'/fonts/bitter/Bitter_Regular.json',
		(progEv) => {
			console.log(progEv);
		},
	);

	// EXPLAIN: these are variables because of centering
	const bevelSize = 0.02;
	const bevelThickness = 0.03;

	const textGeometry = new TextGeometry('Ћао из Три.џејеса!', {
		font,
		// EXPLAIN: all used parameters and ones which we didn't use
		// for whom you think that can be also nice and useful to know
		// how they work
		size: 0.5,
		// EXPLAIN: height removel; it is renamed to depth
		depth: 0.2,
		// EXPLAIN: initial values for curveSegments was 12
		// and for bevelSegments was 5 and that was too much
		// curveSegments: 12,
		// bevelSegments: 5,
		// EXPLAIN: and after playing around with changing values
		// I decided to lower it to next values
		curveSegments: 5,
		bevelSegments: 4,
		//
		bevelEnabled: true,
		// EXPLAIN: these are variables because we need to use them in centerin
		bevelThickness,
		bevelSize,
		// bevelThickness: 0.03,
		// bevelSize: 0.02,
		//
		bevelOffset: 0,
	});

	// EXPLAIN: centering text
	// EXPLAIN: what is compute doing
	textGeometry.computeBoundingBox();
	// EXPLAIN: does boundingBox property only gets its value after computation above
	console.log(textGeometry.boundingBox);
	// EXPLAIN: now textGeometry.boundingSphere is null
	// EXPLAIN: wha kind of value os boundingBox, from what data is built?

	// EXPLAIN: next line
	const textMaterial = new THREE.MeshBasicMaterial();
	// textMaterial.wireframe = true;
	awsomeTweaks.add(textMaterial, 'wireframe');

	// EXPLAIN: translate usage, and values that we are using, and what we will produce
	// EXPLAIN: method translate is from which class?
	if (textGeometry.boundingBox && textGeometry.boundingBox.max) {
		// EXPLAIN: now text will look centered, but not exactly
		/* textGeometry.translate(
			-textGeometry.boundingBox.max.x * 0.5,
			-textGeometry.boundingBox.max.y * 0.5,
			-textGeometry.boundingBox.max.z * 0.5,
		); */
		// EXPLAIN: because bevelTickness and bevelSize
		// text is not centered, so we must use bevelSize and
		// bevelTickness
		textGeometry.translate(
			-(textGeometry.boundingBox.max.x - bevelSize) * 0.5,
			-(textGeometry.boundingBox.max.y - bevelSize) * 0.5,
			-(textGeometry.boundingBox.max.z - bevelThickness) * 0.5,
		);
	}

	// EXPLAIN: text mesh
	const text = new THREE.Mesh(textGeometry, textMaterial);

	scene.add(text);
	// --------------------------------------------------
	// 5 - Lights

	// -----------------------------------------------------
	// 6 - Geometries Materials Meshes

	const boxGeometry = new THREE.BoxGeometry(1, 1, 1);

	const material = new THREE.MeshBasicMaterial();

	awsomeTweaks
		.add(
			{
				message: '',
			},
			'message',
		)
		.name(
			'-----------------------------------------------------------------------------------------\n-----------------------------------------------------------------------------------------',
		)
		.disable();

	// // // // // // // // // // // // // // // // // // // // // //

	const boxMesh = new THREE.Mesh(boxGeometry, material);

	// boxMesh.position.x = 1.5 * 8;
	// boxMesh.position.z = 3;
	// boxMesh.position.z = 1.5;

	// scene.add(boxMesh);

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

	camera.position.z = 3;
	camera.position.y = 1.5;
	camera.position.x = 1;

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

	awsomeTweaks
		.add(
			{
				message: '',
			},
			'message',
		)
		.name(
			'-----------------------------------------------------------------------------------------\n-----------------------------------------------------------------------------------------',
		)
		.disable();
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

		// const elapsedTime = timer.getElapsed();

		orbitControls.update();

		// camera.lookAt(boxMesh.position);
		// camera.lookAt(new THREE.Vector3()); // default

		renderer.render(scene, camera);

		// window.requestAnimationFrame(tick);
	}
}

await init();
