import * as THREE from 'three/webgpu';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import GUI from 'lil-gui';
import gsap from 'gsap';

import { getRequiredElement } from './util';

// EXPLAIN: We learned about this in previous lesson
const loadingManager = new THREE.LoadingManager();

// EXPLAIN: We learned about this in previous lesson
const textureLoader = new THREE.TextureLoader(loadingManager);

// EXPLAIN we are adding all these textures
const colorMap = textureLoader.load(
	'/textures/wooden_door/Door_Wood_001_basecolor.jpg',
	/* () => {
		console.log('color map loading finished');
	},
	() => {
		console.log('color map loading progressing');
	},
	() => {
		console.error('color map loading error');
	}, */
);
const alphaMap = textureLoader.load(
	// EXPLAIN: this is alpha texture but it is named
	// as opacity texture, I think it is the same thing. What is
	// the naming convention? I think it is alpha texture because it is black and white
	'/textures/wooden_door/Door_Wood_001_opacity.jpg',
);
const heightMap = textureLoader.load(
	// EXPLAIN: this format is png, different than others
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

// EXPLAIN: We learned about this in previous lesson
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
	width: 350,
	title: 'Nice debug UI',
	closeFolders: true,
});

const cubeTweaks = gui.addFolder('Awsome cube');

cubeTweaks.close();

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

	// 1 - Geometries Materials Meshes

	// EXPLAIN: I increased default number of subdivisions
	// because as we speak in previous lessons some require more
	// vertices (height one for example). I don't think our current
	// texture requires more because we have pretty flat wooden
	// surface? What do you think
	const subs = 6;
	let boxGeometry = new THREE.BoxGeometry(1, 1, 1, subs, subs, subs);
	const material = new THREE.MeshBasicMaterial({
		// color: debugObject.color,
		// EXPLAIN: not using color because we are using textures
		// but we could, since I tried and color actually
		// was applied, I could see color map changing it's default color?
		// EXPLAIN: Is albeda (color) texture transparent to some extent?
		// color: 0x4c9892,
		//
		// EXPLAIN: we are adding all these textures
		map: colorMap,
		//

		// wireframe: true,
	});

	const boxMesh = new THREE.Mesh(boxGeometry, material);

	// boxMesh.position.x = -1.5;
	// boxMesh.position.z = 1.5;

	scene.add(boxMesh);

	// ------------- Tweaks ----------------------------------

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
	cubeTweaks.add(myObject, 'myStupidProp');
	cubeTweaks.add(boxMesh, 'visible').name('boxMesh visible');
	cubeTweaks
		.add(boxMesh.material, 'wireframe')
		.name('material wireframe');

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
	cubeTweaks.add(debugObject, 'spin');
	cubeTweaks.add(debugObject, 'speed', { sporo: 2, brzo: 8 });
	// debugObject.subdivisions = 2;
	debugObject.subdivisions = subs;
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
