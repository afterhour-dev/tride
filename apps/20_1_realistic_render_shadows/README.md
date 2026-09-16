# Realistic render - Shadows

Continuation of previous lesson where we define some settings to have more relistic render; but now we are adding realism to it by dealing with shadows related things.

## Namera / Intent

Exploring settings we can use to achive realistic render by dealing with shadows settings.

## Šta treba objasniti u detalje

- environment maps can't cast shadows; We need to add light that roughly matches the lighting of the environment map and use it to cast shadows; So we need to look at where is source of light of our environment map and roughly place source of light there

- First thing is that we add directional light, position it, and set intensity; and add position and intensity to gui so you can tweak it and usr right values after tweaking

- We then activate the shadows

- What we didn't deal when we were learning lights and later shadows is setting position of target of the directional light which we are going to do now.

- paty attention to this: Threejs us using matrices to define object transforms; When we change properties like position,rotation,scale, those will be compiled into a matrix; This process is done right before the object is rendered and only if it's in the scene; This concerns directionalLight.target; since when we just change the position of target nothing happens; So there are two solutions but I discovered few more things; Solution:
  - Add `directionalLight.target` to the `scene` (We won't do this; and why I wouldn't do this?)
  - Update the matrix manually using the `directionalLight.target.updateWorldMatrix(..)` (From what I see there are two boolean arguments for parents and children? What this means actually? I updated parents, and not children so my arguments were (true, fals); did I do it right and what this children parent stuff actially means)
  - So what I also discover is that if I update directional light helper in gui, this also updates target? So updating only helper works; but I didn't just use that because If I remove helper for example I can't update it like that (if I render some dynamic scene where light mowes (fast timelaps on the planet earth for example) and if I keep updating helper after animation, wel lI can't update it if I removed it since in production who needs helper anyway? Am I right)
  - I discovered also another two functions on `directionalLight.target`:
    - `updateMatrixWorld` (I called this one instead and it worked); so for what is tis used and why two similarly named function with swiching words "matrix" and "World"
    - `updateMatrix` (I didn't use this one but you can tell me for what is used?)
  
  - In tick function I didn't need to call upadating of any matrix and updating of any helpers; why is that?

- when deciding what meshes from our model should receive shadows what should be a strategy when you create scenes; In our case all meshes that have MeshStandardMaterial will both cast and receive shadows, but I'm interested to know when we are doing travesrsing is there specific things in complex model that should only cast and not receive shadows for better look?

- usinf smaller resolution for the shadowMap would result in a blurry shadow; we wull lower it to 512 x 512, this shouldn't look bad if there are enough details on the scene and it'll improve performance (Do you have something against it here? Should I use 1024 x 1024 or bigger? Would that be huge hit for performance)

- Any suggestions from you to make this look even better, in terms of tweaked values. What do you think?

## Šta samo ukratko pomenuti

- This shouldn't be the end in terms of shadows. I set everything up but maybe more time spend on tweaking the values in gui will produce better result in terms of light position or different kind of intensities etc. So meaybe in some next lesson I might tweak these to look better
