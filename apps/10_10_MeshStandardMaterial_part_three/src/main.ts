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
const matcapTexture = textureLoader.load(
	// '/matcaps/1.png'
	// '/matcaps/2.png',
	// '/matcaps/3.png',
	// '/matcaps/4.png',
	// '/matcaps/5.png',
	// '/matcaps/6.png',
	// '/matcaps/7.png',
	'/matcaps/8.png',
);
const gradieantTexture = textureLoader.load(
	// '/gradients/3.jpg'
	'/gradients/5.jpg',
);
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
	// placeholder: false,
	// EXPLAIN: for geometry tweaking in order to explore
	// displacementMap properly (to be precise, the lack of dubdivisions can cause problems)
	sphereSegments: 64,
	planeSegments: 100,
	// torusRadialSegments: 64,
	// torusTubularSegments: 128,
	torusSegments: 128,

	// EXPLAIN: for tweaking Vector2 of normal scale
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
	// EXPLAIN: switch this to see effect on texture
	// EXPLAIN: when I comment this out, I am using NoColorSpace and in that
	// case it looks lighter and wood texture looks fine; you
	// tell me what is better to pick
	doorAlbedaTexture.colorSpace = THREE.SRGBColorSpace; // NO/Linear
	// mot using this one in this lesson
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
	// EXPLAIN: increasing subdivisons for displacementMap (height texture)
	// because I don't want that vertices all over the place
	// const sphereGemoetry = new THREE.SphereGeometry(0.5, 16, 16);
	let sphereGemoetry = new THREE.SphereGeometry(0.5, 64, 64);
	// const planeGeometry = new THREE.PlaneGeometry(1, 1 /* 2, 2 */);
	let planeGeometry = new THREE.PlaneGeometry(1, 1, 100, 100);
	// const torusGeometry = new THREE.TorusGeometry(0.3, 0.2, 16, 32);
	let torusGeometry = new THREE.TorusGeometry(0.3, 0.2, 64, 128);

	/* 
	const material = new THREE.MeshBasicMaterial({
		// color: debugObject.color,
		// color: 0x4c9892,
		// wireframe: true,
		// map: doorAlbedaTexture,
	});
	material.map = doorAlbedaTexture;
	material.color = new THREE.Color('#59b4af');
	material.color = new THREE.Color(0x59b4af);
	material.color = new THREE.Color('cyan');
	material.color = new THREE.Color('rgb(89, 180, 175)');
	material.wireframe = false;
	material.transparent = true;
	material.opacity = 0.0;
	material.opacity = 0.1;
	material.alphaMap = doorAlphaTexture;
	material.side = THREE.FrontSide; // default
	material.side = THREE.BackSide;
	material.side = THREE.DoubleSide;
	material.side = THREE.FrontSide; // default
  */

	/* 
	const material = new THREE.MeshNormalMaterial();
	material.wireframe = false;
	material.flatShading = true;
 	*/

	/* 
	const material = new THREE.MeshMatcapMaterial({
		// matcap: matcapTexture
	});
	material.matcap = matcapTexture; 
	*/

	/* 
	const material = new THREE.MeshDepthMaterial();
 	*/

	/* 
	const material = new THREE.MeshLambertMaterial();
 	*/

	/*
	const material = new THREE.MeshPhongMaterial();
	material.specular = new THREE.Color('#a643c7');
	material.shininess = 100;
 	*/

	/* 
	const material = new THREE.MeshToonMaterial();
	gradieantTexture.minFilter = THREE.NearestFilter;
	gradieantTexture.magFilter = THREE.NearestFilter;
	gradieantTexture.generateMipmaps = false;
	material.gradientMap = gradieantTexture;
	*/

	// EXPLAIN: MeshStandardMaterial again
	const material = new THREE.MeshStandardMaterial();

	// EXPLAIN:  color map
	material.map = doorAlbedaTexture;
	// EXPLAIN: aoMap and aoMapIntesity, what range of values I can define
	material.aoMap = doorAmbientOcclusionTexture;
	material.aoMapIntensity = 1;
	// material.aoMapIntensity = 3;
	// EXPLAIN: displacementMap and disolacementScale (what are ranges for displacementScale )
	material.displacementMap = doorHeightTesture;
	material.displacementScale = 0.08;

	// EXPLAIN: not sure if we want to keep metalness and roughness
	// values at all but I saw someone did it but set them both to 1
	// material.metalness = 0.7;
	// material.roughness = 0.2;
	material.metalness = 1;
	material.roughness = 1;

	// EXPLAIN: metalnessMap and roughnessMap
	material.metalnessMap = doorMetallnessTexture;
	material.roughnessMap = doorRoughnessTexture;

	// EXPLAIN: normalMap and normalScale
	material.normalMap = doorNormalTexture;
	// EXPLAIN: range of values for Vector2 instance of normalScale
	material.normalScale.set(0.5, 0.5);

	// EXPLAIN: alphaMap and transparent
	material.transparent = true;
	material.alphaMap = doorAlphaTexture;

	// EXPLAIN: we are still exploring material through changing
	// it's properties in debugui, like in previous lesson
	/* awsomeTweaks
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
		.name('roughness'); */
	awsomeTweaks
		.add(material, 'displacementScale')
		.min(0)
		.max(1)
		.step(0.01);
	awsomeTweaks
		.add(
			{
				message: '',
			},
			'message',
		)
		.name(
			'set transparent to false\n and you will see white from alpha map texture\n and white should be transparent',
		)
		.disable();
	awsomeTweaks.add(material, 'transparent');
	awsomeTweaks
		.add(
			{
				message: '',
			},
			'message',
		)
		.name(
			'lowering number of segments will have\n negative imapct on displacement map',
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
		.name('torus segments');
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
		.name('sphere segments');
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
		.name('plane segments');
	awsomeTweaks
		.add(
			{
				message: '',
			},
			'message',
		)
		.name(
			'-----------------------------------------------------------------------------------------',
		);
	awsomeTweaks
		.add(debugObject, 'normalScale')
		.max(1)
		.min(0)
		.step(0.1)
		.onFinishChange((scaleVal: number) => {
			material.normalScale.set(scaleVal, scaleVal);
		});
	awsomeTweaks
		.add(
			{
				message: '',
			},
			'message',
		)
		.name(
			'-----------------------------------------------------------------------------------------',
		);
	awsomeTweaks
		.add(material, 'aoMapIntensity')
		.max(1)
		.min(0)
		.step(0.1);
	awsomeTweaks
		.add(
			{
				message: '',
			},
			'message',
		)
		.name(
			'-----------------------------------------------------------------------------------------',
		);
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
		);

	awsomeTweaks.open();

	//  // // //

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

	awsomeTweaks.add(axesHelper, 'visible').name('show axes');

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
