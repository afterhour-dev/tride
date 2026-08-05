import * as THREE from 'three/webgpu';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import GUI from 'lil-gui';
import gsap from 'gsap';

import { getRequiredElement } from './util';

const loadingManager = new THREE.LoadingManager();

const textureLoader = new THREE.TextureLoader(loadingManager);

// EXPLAIN: We will load door textures, some matcaps, some gradients
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

	// 0 - texture stuff -------------------------
	// EXPLAIN: textures used as map and matcap are supposed to be
	// encoded in sRGB; we need to set their colorSpace to
	// THREE.SRGBColorSpace; and explain me is this approach up to date
	// EXPLAIN: change values of THREE.SRGBColorSpace and
	// THREE.NoColorSpace (this is th default for colorSpace)
	// to test it how it looks than get back to THREE.SRGBColorSpace
	// because it looks better
	doorAlbedaTexture.colorSpace = THREE.SRGBColorSpace;
	// doorAlbedaTexture.colorSpace = THREE.NoColorSpace; // EXPLAIN: like I said this is defaut, and I'm using it here only for the sake of example (commenting in and out)
	matcapTexture.colorSpace = THREE.SRGBColorSpace;
	// EXPLAIN: we can try these abouve by setting it on
	// map property of the material
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
		// EXPLAIN: map
		map: doorAlbedaTexture,
	});

	// EXLAIN: we have three geometries and we use them to make three
	// meshes with same material and material is what is important in
	// this lesson

	const boxMesh = new THREE.Mesh(boxGeometry, material);

	boxMesh.position.x = 1.5 * 8;
	boxMesh.position.z = 3;
	// boxMesh.position.z = 1.5;

	const sphereMesh = new THREE.Mesh(sphereGemoetry, material);

	sphereMesh.position.x = -1.5;

	const planeMeash = new THREE.Mesh(planeGeometry, material);

	const torusMesh = new THREE.Mesh(torusGeometry, material);
	torusMesh.position.x = 1.5;

	// EXPLAIN: you can add multiple meshes to the scene at once
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

		// EXPLAIN: we want to rotate the meshes as we examine the
		// look of the material
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
