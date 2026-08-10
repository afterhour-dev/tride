import * as THREE from 'three/webgpu';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { HDRLoader } from 'three/examples/jsm/Addons.js';
import GUI from 'lil-gui';
// import gsap from 'gsap';

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
// const matcapTexture = textureLoader.load('/matcaps/8.png');
// const gradieantTexture = textureLoader.load('/gradients/5.jpg');
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
	sphereSegments: 64,
	planeSegments: 100,
	// torusRadialSegments: 64,
	// torusTubularSegments: 128,
	torusSegments: 128,

	normalScale: 0.5,
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
	const hdrLoader = new HDRLoader();
	const hdrTexture = await hdrLoader.loadAsync(
		'/envmap/2k.hdr',
		(progEv) => {
			// console.log(progEv);
		},
	);

	hdrTexture.mapping = THREE.EquirectangularReflectionMapping;

	scene.environment = hdrTexture;
	scene.background = hdrTexture;

	// ----------------------------------------------------
	// 3 -  texture stuff

	doorAlbedaTexture.colorSpace = THREE.SRGBColorSpace; // NO/Linear
	// matcapTexture.colorSpace = THREE.SRGBColorSpace;

	// --------------------------------------------------
	// 4 - Lights

	/* 
	const ambientLight = new THREE.AmbientLight(
		0xffffff,
		// '#b694d4',
		1,
	);
	scene.add(ambientLight);

	const pointLight = new THREE.PointLight(0xffffff, 30);
	pointLight.position.x = 2;
	pointLight.position.y = 3;
	pointLight.position.z = 4;
	scene.add(pointLight);
	*/

	// -----------------------------------------------------
	// 5 - Geometries Materials Meshes

	const boxGeometry = new THREE.BoxGeometry(1, 1, 1);

	// const sphereGemoetry = new THREE.SphereGeometry(0.5, 16, 16);
	let sphereGemoetry = new THREE.SphereGeometry(0.5, 64, 64);
	// const planeGeometry = new THREE.PlaneGeometry(1, 1 /* 2, 2 */);
	let planeGeometry = new THREE.PlaneGeometry(1, 1, 100, 100);
	// const torusGeometry = new THREE.TorusGeometry(0.3, 0.2, 16, 32);
	let torusGeometry = new THREE.TorusGeometry(0.3, 0.2, 64, 128);

	/* 
	const material = new THREE.MeshStandardMaterial();

	material.map = doorAlbedaTexture;
	material.aoMap = doorAmbientOcclusionTexture;
	material.aoMapIntensity = 1;
	// material.aoMapIntensity = 3;
	material.displacementMap = doorHeightTesture;
	material.displacementScale = 0.08;

	// material.metalness = 0.7;
	// material.roughness = 0.2;
	material.metalness = 1;
	material.roughness = 1;

	material.metalnessMap = doorMetallnessTexture;
	material.roughnessMap = doorRoughnessTexture;

	material.normalMap = doorNormalTexture;
	material.normalScale.set(0.5, 0.5);

	material.transparent = true;
	material.alphaMap = doorAlphaTexture; 
	*/

	const material = new THREE.MeshPhysicalMaterial();

	material.map = doorAlbedaTexture;
	material.aoMap = doorAmbientOcclusionTexture;
	material.aoMapIntensity = 1;
	// material.aoMapIntensity = 3;
	material.displacementMap = doorHeightTesture;
	material.displacementScale = 0.08;
	material.metalnessMap = doorMetallnessTexture;
	material.roughnessMap = doorRoughnessTexture;
	//
	// EXPLAIN: what values for metalness and roughness are good in
	// case of iridescence effect
	material.metalness = 0;
	material.roughness = 0.5;
	//
	material.normalMap = doorNormalTexture;
	material.normalScale.set(0.5, 0.5);
	material.transparent = true;
	material.alphaMap = doorAlphaTexture;

	// EXPLAIN: iridescence, iridescenceIOR, iredescenceThicknessRange
	material.iridescence = 1;
	material.iridescenceIOR = 1;
	material.iridescenceThicknessRange = [100, 800];

	awsomeTweaks.add(material, 'wireframe');
	awsomeTweaks
		.add(
			{
				message: '',
			},
			'message',
		)
		.name(
			'-----------------------------------------------------------------------------------------',
		)
		.disable();

	awsomeTweaks
		.add(material, 'displacementScale')
		.min(0)
		.max(1)
		.step(0.01)
		.disable();
	awsomeTweaks
		.add(
			{
				message: '',
			},
			'message',
		)
		.name(
			'-----------------------------------------------------------------------------------------',
		)
		.disable();

	awsomeTweaks.add(material, 'transparent').disable();

	awsomeTweaks
		.add(
			{
				message: '',
			},
			'message',
		)
		.name(
			'-----------------------------------------------------------------------------------------',
		)
		.disable();

	awsomeTweaks
		.add(debugObject, 'torusSegments')
		.min(32)
		.max(128)
		.step(16)
		.onFinishChange((segments: number) => {
			torusGeometry.dispose();
			torusMesh.geometry = new THREE.TorusGeometry(
				0.3,
				0.2,
				segments / 2,
				segments,
			);
			torusGeometry = torusMesh.geometry;
		})
		.name('torus segments')
		.disable();
	awsomeTweaks
		.add(debugObject, 'sphereSegments')
		.min(16)
		.max(64)
		.step(16)
		.onFinishChange((segments: number) => {
			sphereGemoetry.dispose();
			sphereMesh.geometry = new THREE.SphereGeometry(
				0.5,
				segments,
				segments,
			);
			sphereGemoetry = sphereMesh.geometry;
		})
		.name('sphere segments')
		.disable();

	awsomeTweaks
		.add(debugObject, 'planeSegments')
		.min(2)
		.max(100)
		.step(2)
		.onFinishChange((segments: number) => {
			planeGeometry.dispose();
			planeMeash.geometry = new THREE.PlaneGeometry(
				1,
				1,
				segments,
				segments,
			);
			planeGeometry = planeMeash.geometry;
		})
		.name('plane segments')
		.disable();
	awsomeTweaks
		.add(
			{
				message: '',
			},
			'message',
		)
		.name(
			'-----------------------------------------------------------------------------------------',
		)
		.disable();
	awsomeTweaks
		.add(debugObject, 'normalScale')
		.max(1)
		.min(0)
		.step(0.1)
		.onFinishChange((scaleVal: number) => {
			material.normalScale.set(scaleVal, scaleVal);
		})
		.disable();
	awsomeTweaks
		.add(
			{
				message: '',
			},
			'message',
		)
		.name(
			'-----------------------------------------------------------------------------------------',
		)
		.disable();
	awsomeTweaks
		.add(material, 'aoMapIntensity')
		.max(1)
		.min(0)
		.step(0.1)
		.disable();
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
	awsomeTweaks
		.add(material, 'metalness')
		.min(0)
		.max(1)
		.step(0.0001)
		.name('metalness');
	awsomeTweaks
		.add(material, 'roughness')
		.min(0)
		.max(1)
		.step(0.0001)
		.name('roughness');
	awsomeTweaks
		.add(
			{
				message: '',
			},
			'message',
		)
		.name(
			'MeshPhysicalMaterial iridescence effect realted tweaks (current lesson).\nIgnore ones above, they are mostly disabled except metalness\nand roughness',
		)
		.disable();
	// EXPLAIN: tweaking iridescence, iridescenceIOR, iredescenceThicknessRange
	awsomeTweaks
		.add(material, 'iridescence')
		.min(0)
		.max(1)
		.step(0.0001);
	awsomeTweaks
		.add(material, 'iridescenceIOR')
		.min(0)
		.max(2.333)
		.step(0.0001);
	awsomeTweaks
		.add(material.iridescenceThicknessRange, '0')
		.name('iridescenceThicknessRange[0]')
		.min(1)
		.max(1000)
		.step(1);
	awsomeTweaks
		.add(material.iridescenceThicknessRange, '1')
		.name('iridescenceThicknessRange[1]')
		.min(1)
		.max(1000)
		.step(1);

	// // // // // // // // // // // // // // // // // // // // // //

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
	// 6 - gui tweaks
	// awsomeTweaks.add(debugObject, 'placeholder', 4);

	// --------------------------------------------------------
	// 7 - Camera - Perspective Camera
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
	// 8 - Orbit Controls
	const orbitControls = new OrbitControls(camera, canvas);

	orbitControls.enableDamping = true;
	// orbitControls.enabled = false;
	// orbitControls.update()

	// ------------------------------------------------
	// 9 - axes helper
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

		// window.requestAnimationFrame(tick);
	}
}

await init();
