import * as THREE from 'three/webgpu';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import GUI from 'lil-gui';
import gsap from 'gsap';

import { getRequiredElement } from './util';

const loadingManager = new THREE.LoadingManager();

const textureLoader = new THREE.TextureLoader(loadingManager);

const doorAlbedaTexture = textureLoader.load(
	'/textures/wooden_door/Door_Wood_001_basecolor.jpg',
);
const doorAlphaTexture = textureLoader.load(
	'/textures/wooden_door/Door_Wood_001_opacity.jpg',
);
const doorAmbientOcclusionTexture = textureLoader.load(
	'/textures/wooden_door/Door_Wood_001_ambientOcclusion.jpg',
);
const doorHeightTesture = textureLoader.load(
	'/textures/wooden_door/Door_Wood_001_height.png',
);
const doorNormalTexture = textureLoader.load(
	'/textures/wooden_door/Door_Wood_001_normal.jpg',
);
const doorMetallnessTexture = textureLoader.load(
	'/textures/wooden_door/Door_Wood_001_metallic.jpg',
);
const doorRoughnessTexture = textureLoader.load(
	'/textures/wooden_door/Door_Wood_001_roughness.jpg',
);
//
const matcapTexture = textureLoader.load('/matcaps/1.png');
const gradieantTexture = textureLoader.load('/gradients/3.jpg');
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
	placeholder: false,
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
	const scene = new THREE.Scene();

	doorAlbedaTexture.colorSpace = THREE.SRGBColorSpace;
	matcapTexture.colorSpace = THREE.SRGBColorSpace;

	// -------------------------------------------

	// 1 - Geometries Materials Meshes

	const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
	const sphereGemoetry = new THREE.SphereGeometry(0.5, 16, 16);
	const planeGeometry = new THREE.PlaneGeometry(1, 1 /* 2, 2 */);
	const torusGeometry = new THREE.TorusGeometry(0.3, 0.2, 16, 32);

	const material = new THREE.MeshBasicMaterial({
		// color: debugObject.color,
		// color: 0x4c9892,
		// wireframe: true,
		// EXPLAIN: we can set properties when instatiating, like this map property
		// map: doorAlbedaTexture,
	});
	// EXPLAIN: we can also set properties on the instance
	// and we will use this approach for the rest of the lesson
	// material.map = doorAlbedaTexture;

	// EXPLAIN: color property and how unlike when instatiating
	// you are not allowed the color string or hexadecimal
	// it must be THREE.Color instance where you pass
	// different formats of color strings or hehadecimal
	/* 	material.color = new THREE.Color('#59b4af');
	material.color = new THREE.Color(0x59b4af);
	material.color = new THREE.Color('cyan');
	material.color = new THREE.Color('rgb(89, 180, 175)'); */
	// EXPLAIN: combining color and map will tint the texture with the color

	// EXPLAIN: wireframe property
	// people don't tend to use this in production because
	// line ticknes is always one pixeel; mostly used as helper to
	// see all subdivisions
	material.wireframe = false;

	// EXPLAIN: opacity and transparent
	// Well not realluy intuitive to me
	// material.transparent = true; // EXPLAIN: By itself will not
	// 															make material transparent
	// EXPLAIN: if want opacity setting you must use opacity propery
	// EXPLAIN: now it is completly transparent
	// material.opacity = 0.0;

	// EXPLAIN: now it barely opaque
	// material.opacity = 0.1;

	// EXPLAIN: alphaMap (leave irt to be transparet=true and observe)
	// material.alphaMap = doorAlphaTexture;

	// EXPLAIN: side property (which side is visible)
	material.side = THREE.FrontSide; // default
	material.side = THREE.BackSide; // you will se bonly back side of the plane
	material.side = THREE.DoubleSide; // you will see both sides of the plane
	// EXPLAIN: I think using DoubleSide is bad for performances, explain why
	material.side = THREE.FrontSide; // default

	// EXPLAIN: make sure when you export from blender to not
	// expor it with double side

	// EXPLAIN: how some properties like opacity and wireframe can be used with
	// different materials, and that is why in next lessons for other material types we won't cover those
	//  ------------------------------------------------------

	const boxMesh = new THREE.Mesh(boxGeometry, material);

	boxMesh.position.x = 1.5 * 8;
	boxMesh.position.z = 3;
	// boxMesh.position.z = 1.5;

	const sphereMesh = new THREE.Mesh(sphereGemoetry, material);

	sphereMesh.position.x = -1.5;

	const planeMeash = new THREE.Mesh(planeGeometry, material);

	const torusMesh = new THREE.Mesh(torusGeometry, material);
	torusMesh.position.x = 1.5;

	scene.add(torusMesh, sphereMesh, boxMesh, planeMeash);

	// ------------- Tweaks ----------------------------------

	// awsomeTweaks.add(debugObject, 'placeholder', 4);

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

	awsomeTweaks.add(axesHelper, 'visible').name('show axes');

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

		const elapsedTime = timer.getElapsed();

		orbitControls.update();

		// camera.lookAt(boxMesh.position);
		// camera.lookAt(new THREE.Vector3()); // default

		planeMeash.rotation.y = elapsedTime * 0.1;
		sphereMesh.rotation.y = elapsedTime * 0.1;
		torusMesh.rotation.y = elapsedTime * 0.1;

		planeMeash.rotation.x = -0.15 * elapsedTime;
		sphereMesh.rotation.x = -0.15 * elapsedTime;
		torusMesh.rotation.x = -0.15 * elapsedTime;

		renderer.render(scene, camera);

		window.requestAnimationFrame(tick);
	}
}

await init();
