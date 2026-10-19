
varying vec2 vUvs;

uniform sampler2D diffuse;
uniform sampler2D overlay;

uniform vec4 tint;

void main(){
  
  // EXPLAIN: dividing uv coordinates with 4.0
  // now when we devided component by number larger than 1
  // we will have zooming effect
  // and what you will se that everything is kinda blurry
  vec2 uvs=vUvs/30.;
  
  vec4 diffuseSample=texture2D(diffuse,uvs);
  
  gl_FragColor=diffuseSample;
  
}
