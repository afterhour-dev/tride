import * as THREE from 'three/webgpu';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import GUI from 'lil-gui';
// import gsap from 'gsap';

import { getRequiredElement } from './util';

const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManager);

// EXPLAIN: loading matcap texture
const matcapTexture = textureLoader.load(
	'/textures/matcaps/moje/8.png',
);
const otherMatcapTexture = textureLoader.load(
	'/textures/matcaps/moje/2.png',
);

// loadingManager.onProgress = (prog) => {
// 	console.log(prog);
// };
loadingManager.onLoad = () => {
	console.log('textures loaded');
};
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

// const debugObject = {
// 	//
// };
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
	// EXPLAIN: I changed colorSpace
	matcapTexture.colorSpace = THREE.SRGBColorSpace;

	// ------------------------------------------------------
	// 4 - Text -  loading, TextGeometry, material, mesh

	const fontLoader = new FontLoader();
	// console.log(fontLoader);
	// console.log(TextGeometry);
	const font = await fontLoader.loadAsync(
		'/fonts/bitter/Bitter_Regular.json',
		(progEv) => {
			console.log('font - ', progEv);
		},
	);

	// EXPLAIN: these are variables because of centering
	// we are using these in calculation
	const bevelSize = 0.02;
	const bevelThickness = 0.03;

	const textGeometry = new TextGeometry('Ћао из Три.џејеса!', {
		font,
		size: 0.5,
		depth: 0.2,
		// curveSegments: 12,
		// bevelSegments: 5,
		curveSegments: 5,
		bevelSegments: 4,
		//
		bevelEnabled: true,
		bevelThickness,
		bevelSize,
		// bevelThickness: 0.03,
		// bevelSize: 0.02,
		//
		bevelOffset: 0,
	});

	// EXPLAIN: instead of Basic we use Matcap
	// const textMaterial = new THREE.MeshBasicMaterial();
	// don't make a mistake and set texture as map, use matcap property
	const textMaterial = new THREE.MeshMatcapMaterial({
		matcap: matcapTexture,
	});
	// or on instance
	// textMaterial.matcap = matcapTexture;

	awsomeTweaks.add(textMaterial, 'wireframe');

	textGeometry.center();

	const text = new THREE.Mesh(textGeometry, textMaterial);

	scene.add(text);
	// --------------------------------------------------
	// 5 - Lights

	// -----------------------------------------------------
	// 6 - Geometries Materials Meshes

	// const boxGeometry = new THREE.BoxGeometry(1, 1, 1);

	// const material = new THREE.MeshBasicMaterial();

	console.time('krafne');
	// EXPLAIN: adding bunch of toruses
	// randomizing their position and rotation and scale a bit
	// EXPLAIN: this next block can be optimized in a way
	// that we create geometry just once and also the material
	const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);
	const donutMaterial = new THREE.MeshMatcapMaterial();

	for (let i = 0; i < 100; i++) {
		donutMaterial.matcap = otherMatcapTexture;
		const donut = new THREE.Mesh(donutGeometry, donutMaterial);
		// donut.position.x = Math.random() * 10 - 5;
		// EXPLAIN: in detail math behind this
		// randomizations we have here on poition,rotation,scale
		donut.position.x = (Math.random() - 0.5) * 10;
		donut.position.y = (Math.random() - 0.5) * 10;
		donut.position.z = (Math.random() - 0.5) * 10;
		donut.rotation.x = Math.random() * Math.PI;
		donut.rotation.y = Math.random() * Math.PI;
		const scale = Math.random();
		donut.scale.set(scale, scale, scale);
		scene.add(donut);
	}

	console.timeEnd('krafne');

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

	// const boxMesh = new THREE.Mesh(boxGeometry, material);

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
