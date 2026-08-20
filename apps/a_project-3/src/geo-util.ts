import type { Three } from './main';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

// EXPLAIN: this function
export function createWallBoxGeometry(
	THREE: Three,
	width: number,
	depth: number,
	height: number,
	wSegs = 8,
	hSegs = 8,
) {
	const geometries = [];

	// Front wall (+Z)
	const front = new THREE.PlaneGeometry(width, height, wSegs, hSegs);
	front.translate(0, height / 2, depth / 2);
	geometries.push(front);

	// Back wall (-Z), flip to face inward (rotate 180°)
	const back = new THREE.PlaneGeometry(width, height, wSegs, hSegs);
	back.rotateY(Math.PI);
	back.translate(0, height / 2, -depth / 2);
	geometries.push(back);

	// Right wall (+X)
	const right = new THREE.PlaneGeometry(depth, height, wSegs, hSegs);
	right.rotateY(Math.PI / 2);
	right.translate(width / 2, height / 2, 0);
	geometries.push(right);

	// Left wall (-X)
	const left = new THREE.PlaneGeometry(depth, height, wSegs, hSegs);
	left.rotateY(-Math.PI / 2);
	left.translate(-width / 2, height / 2, 0);
	geometries.push(left);

	// Merge into a single BufferGeometry (single draw call).
	// useGroups=true keeps material groups per wall in case you want
	// different materials/UV tiling per wall later; drop it for one material.
	const merged = mergeGeometries(geometries, true);

	// PlaneGeometry already ships with normals, UVs and tangisland-safe
	// topology, so nothing else needs recomputing. If you generate tangents
	// for normal mapping, do it after merging:
	merged.computeTangents();

	return merged;
}
