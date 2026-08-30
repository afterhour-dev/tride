# Imported models - DRACO

In this app we are learning about [draco](https://github.com/Google/draco)

## Namera / Intent

This app is made for learning of how to utalize [draco](https://google.github.io/draco/) compression

## Šta treba objasniti u detalje

- The Draco version can be much lighter than the default vesrsion
- Comprssion is applied to the buffer data (typically geometry)
- Draco is not exclusive tp glTF but they got popular at the same time and implementation went faster with glTF exporters
- Google develops the algorithm under the open-source Apache License

- The decoder is also available in Web Assembly, and it can run in a worker to improve performances significantly; Threejs already provided the code in the: `/node_modules/three/examples/jsm/libs/draco/draco_decoder.wasm`; So we are going to use this in our app, we sill copy entire folder `/node_modules/three/examples/jsm/libs/draco/` to the `/public` folder; in there we have web assembly file; and in code we set the decoder path to our draco loader in public folder

- we can still laod not compressed glTF file with GLTFLoader and the Draco decoder is only loaded when needed

- Smaller size is appealing and seems that you should choose draco every time; but not exactly. So when should I use draco?
  - Draco compression is not win-win situation
  - The geometries are lighter but the user has to load the DRACOLoade class and the decoder
  - It also takes time and resources for your computer to decode a compressed life
  - You'll have to adapt accordingly to the project

- In a tersm of file size where would you suggest that we use DRACO

## Šta samo ukratko pomenuti

