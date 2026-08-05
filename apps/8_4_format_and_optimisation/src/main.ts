import * as THREE from 'three/webgpu';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import GUI from 'lil-gui';
import gsap from 'gsap';

import { getRequiredElement } from './util';

const loadingManager = new THREE.LoadingManager();

const textureLoader = new THREE.TextureLoader(loadingManager);

/* const colorMap = textureLoader.load(
	'/textures/wooden_door/Door_Wood_001_basecolor.jpg',
); */

/* const colorMap = textureLoader.load(
	'/textures/checkerboard-1024x1024.png',
); */
// const colorMap = textureLoader.load('/textures/checkerboard-8x8.png');
const colorMap = textureLoader.load('/textures/minecraft.png');

const alphaMap = textureLoader.load(
	'/textures/wooden_door/Door_Wood_001_opacity.jpg',
);
const heightMap = textureLoader.load(
	'/textures/wooden_door/Door_Wood_001_height.png',
);
const normalMap = textureLoader.load(
	'/textures/wooden_door/Door_Wood_001_normal.jpg',
);
const ambientOcclusionMap = textureLoader.load(
	'/textures/wooden_door/Door_Wood_001_ambientOcclusion.jpg',
);
const metlnessMap = textureLoader.load(
	'/textures/wooden_door/Door_Wood_001_metallic.jpg',
);
const roughnessMap = textureLoader.load(
	'/textures/wooden_door/Door_Wood_001_roughness.jpg',
);

loadingManager.onStart = (url) => {
	console.log('loading started');
};
loadingManager.onLoad = () => {
	console.log('loading finished');
};
loadingManager.onProgress = (url) => {
	console.log('loading progressing');
};
loadingManager.onError = (err) => {
	console.error('Loading failed', err);
};

const canvas = getRequiredElement<HTMLCanvasElement>('canvas#tride');

const gui = new GUI({
	width: 250,
	title: 'Nice debug UI',
	closeFolders: true,
});

const cubeTweaks = gui.addFolder('Awsome cube');

// cubeTweaks.close();

window.addEventListener('keydown', (ev) => {
	if (ev.key === 'h') {
		gui.show(gui._hidden);
	}
});

const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
};

const debugObject = {
	color: '',
	spin: () => {},
	lookAtMesh: true,
	subdivisions: 2,
	speed: 2,
};

async function init() {
	const scene = new THREE.Scene();

	debugObject.color = '#527eaa';

	// 0 - texture stuff

	// colorMap.repeat.x = 2;
	// colorMap.repeat.y = 3;

	/* colorMap.wrapS = THREE.RepeatWrapping;
	colorMap.wrapT = THREE.RepeatWrapping; */

	/* colorMap.wrapS = THREE.MirroredRepeatWrapping;
	colorMap.wrapT = THREE.MirroredRepeatWrapping;*/

	// colorMap.offset.x = 0.5;
	// colorMap.offset.y = 0.5;

	// colorMap.rotation = Math.PI * 0.25; // 45 deg Math.PI / 4

	// colorMap.center.x = 0.5;
	// colorMap.center.y = 0.5;

	colorMap.minFilter = THREE.NearestFilter;

	colorMap.generateMipmaps = false;
	colorMap.magFilter = THREE.NearestFilter;

	// 1 - Geometries Materials Meshes

	let boxGeometry = new THREE.BoxGeometry(1, 1, 1);

	/* 
	const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
	const coneGeometry = new THREE.ConeGeometry(1, 1, 32);
	const torusGeometry = new THREE.TorusGeometry(1, 0.35, 32, 100); 
	*/

	const material = new THREE.MeshBasicMaterial({
		// color: debugObject.color,
		// color: 0x4c9892,
		//
		map: colorMap,
		//

		// wireframe: true,
	});

	const myMesh = new THREE.Mesh(boxGeometry, material);

	// myMesh.position.x = -1.5;
	// myMesh.position.z = 1.5;

	scene.add(myMesh);

	/* cubeTweaks
		.add(myMesh, 'geometry', {
			boxGeometry,
			sphereGeometry,
			coneGeometry,
			torusGeometry,
		})
		.name('GEOMETRY')
		.onChange((geo: THREE.BufferGeometry) => {
			// console.log(geo instanceof THREE.BufferGeometry);
			console.log(geo.attributes);
			console.log(geo.attributes.uv);
		}); */

	/* cubeTweaks
		.add({ '-': '' }, '-')
		.name(
			"Don't pay attention to these fields bellow,\n only above field is important,\n because we are learning about UV unwrapping\n Make sure to switch geometries above\n in order to see logs about uv coordinates",
		); */
	// ------------- Tweaks ----------------------------------

	cubeTweaks
		.add(myMesh.position, 'y')
		.min(-3)
		.max(3)
		.step(0.01)
		// .name('elevation')
		.name('myMesh.position.y');
	const myObject = {
		myStupidProp: 256,
	};
	cubeTweaks.add(myObject, 'myStupidProp');
	cubeTweaks.add(myMesh, 'visible').name('myMesh visible');
	cubeTweaks
		.add(myMesh.material, 'wireframe')
		.name('material wireframe');

	cubeTweaks
		.addColor(debugObject, 'color')
		.onChange((colorVal: THREE.Color) => {
			material.color.set(colorVal);
		});

	const mojaFunkcije = () => {
		gsap.to(myMesh.rotation, {
			duration: 1.5,

			y: myMesh.rotation.y + Math.PI * debugObject.speed,
		});
	};
	debugObject.spin = mojaFunkcije;
	cubeTweaks.add(debugObject, 'spin');
	cubeTweaks.add(debugObject, 'speed', { sporo: 2, brzo: 8 });
	debugObject.subdivisions = 2;
	// debugObject.subdivisions = subs;
	cubeTweaks
		.add(debugObject, 'subdivisions')
		.min(1)
		.max(20)
		.step(1)
		.onFinishChange((subdivs: number) => {
			boxGeometry.dispose();

			myMesh.geometry = new THREE.BoxGeometry(
				1,
				1,
				1,
				subdivs,
				subdivs,
				subdivs,
			);

			boxGeometry = myMesh.geometry;
		});

	// --------------------------------------------------------
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

	// camera.lookAt(myMesh.position);

	cubeTweaks.add(debugObject, 'lookAtMesh');
	if (debugObject.lookAtMesh) {
		camera.lookAt(myMesh.position);
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

		// camera.lookAt(myMesh.position);
		// camera.lookAt(new THREE.Vector3());

		if (debugObject.lookAtMesh) {
			camera.lookAt(myMesh.position);
		} else {
			camera.lookAt(new THREE.Vector3(0, 0, 0));
		}

		renderer.render(scene, camera);

		window.requestAnimationFrame(tick);
	}
}

await init();
