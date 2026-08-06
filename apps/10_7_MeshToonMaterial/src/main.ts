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

	//   texture stuff
	doorAlbedaTexture.colorSpace = THREE.SRGBColorSpace;
	matcapTexture.colorSpace = THREE.SRGBColorSpace;

	// 0 - Lights

	// EXPLAIN: also needs light
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

	// -------------------------------------------

	// 1 - Geometries Materials Meshes

	const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
	const sphereGemoetry = new THREE.SphereGeometry(0.5, 16, 16);
	const planeGeometry = new THREE.PlaneGeometry(1, 1 /* 2, 2 */);
	const torusGeometry = new THREE.TorusGeometry(0.3, 0.2, 16, 32);

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

	/* const material = new THREE.MeshMatcapMaterial({
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

	/* const material = new THREE.MeshPhongMaterial();
	material.specular = new THREE.Color('#a643c7');
	material.shininess = 100;
 	*/

	// EXPLAIN: MeshToonMaterial
	const material = new THREE.MeshToonMaterial();
	// EXPALIN: wouldn't work if we didn't do this
	gradieantTexture.minFilter = THREE.NearestFilter;
	gradieantTexture.magFilter = THREE.NearestFilter;
	// EXPLAIN: and we deactivate mipmapping
	gradieantTexture.generateMipmaps = false;

	material.gradientMap = gradieantTexture;

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
