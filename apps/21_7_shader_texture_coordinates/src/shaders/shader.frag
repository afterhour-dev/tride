
varying vec2 vUvs;

uniform sampler2D diffuse;

uniform sampler2D overlay;

uniform vec4 tint;

void main(){
  
  // EXPLAIN: I'm going to double texture coordinates to
  // make them go past that threshold between 0 and 1
  // basiacally we are scaling u and v coordinate with 2
  // vec2 uvs=vUvs*2.;
  
  // EXPLAIN: to test repeat adressing mode we can multiply
  // non-uniformly
  // vec2 uvs=vUvs*vec2(2.,3.);
  
  // vec2 uvs=vUvs*4.;
  
  // EXPLAIN: as a homework for repeat wrapping we scaled
  // uv coords by negative 1
  vec2 uvs=vUvs*(-1.);
  
  // vec4 diffuseSample=texture2D(diffuse,vec2(vUvs.x,vUvs.y));
  
  // EXPLAIN: and we use new vec2 we make from uv coords
  vec4 diffuseSample=texture2D(diffuse,uvs);
  
  // EXPLAIN: what you will see is wierd streaking effect
  
  gl_FragColor=diffuseSample;
  
}
