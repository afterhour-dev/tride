# Project A - part three

First project built to practice some of the learned things from previous lessons.

This project is continuation of a_project-2

## Namera / Intent

Practicing three.js by using "primitives" as geometries and by using textures and using lights and shadow knowledge from previous lessons.

Major thing in this current project is that we are deling with textures, and enabling shadows

## Šta treba objasniti u detalje

- in case of ambient occlusion map; do we still need to provide uv2 attribute to support oaMap or not? I didn't do it because somwehere I found info that that approach is outdated
  -  and I did it like this:
    ```ts
    // instead of this
    /* doorGeometry.setAttribute(
   		'uv2',
   		new THREE.Float32BufferAttribute(
   			doorGeometry.attributes.uv.array,
   			2,
   		),
   	); */
    // I used this
     if (doorMaterial.aoMap) {
   		doorMaterial.aoMap.channel = 1;
   	}
    ```
     Do I even need mentioned?
     As I look to rendered texture I didn't see any changes at all. Maybe they are there but I don;t see it. As I crank up diaplacementScale, I cant see that any change is applied in corners which should ao bring? Or what is your opinion?
     Also I got this warning in console:

       ```
       installHook.js:1 THREE.AttributeNode: Vertex attribute "uv1" not found on geometry.
        overrideMethod	@	installHook.js:1
        init	@	main.ts:787
        await in init		
        (anonymous)	@	main.ts:863
       ```
       so I decidet to comment out mentioned if statement
- For roof texture I defined this:
  ```ts
  albedoRoofTexture.wrapS = THREE.RepeatWrapping;
	albedoRoofTexture.wrapT = THREE.RepeatWrapping;
	albedoRoofTexture.repeat.set(8, 1); // Adjust numbers to fit your scale
  ```
  Can you explain this, and would this also fix that displacmentScale and displacmentBias problem I explained in comments for the brick wall. I assume not because using displacment on roof also caused same problems