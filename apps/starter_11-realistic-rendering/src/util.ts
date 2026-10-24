import type { Group } from 'three/webgpu';
export function getRequiredElement<T extends Element>(
	selector: string,
): T {
	const el = document.querySelector<T>(selector);
	if (!el) throw new Error(`Required element not found: ${selector}`);
	return el;
}

export function modelSetup(scene: Group) {
	scene.traverse((child) => {
		// @ts-expect-error isMesh is a property of Object3D, but TypeScript doesn't know that child is a Mesh
		if (child.isMesh && child.material.isMeshStandardMaterial) {
			// ts-expect-error material is a property of Mesh, but TypeScript doesn't know that child is a Mesh
			// console.log(child.material.side); // 2 = THREE.DoubleSide

			child.castShadow = true;

			child.receiveShadow = true;
		}
	});
}
