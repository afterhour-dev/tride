
varying vec2 vUvs;

uniform sampler2D diffuse;

// EXPLAIN: using another texture
// we want to overlay on our previous texture
uniform sampler2D overlay;

uniform vec4 tint;

void main(){
  
  vec4 diffuseSample=texture2D(diffuse,vec2(vUvs.x,vUvs.y));
  // EXPLAIN: doing the same thing like for previous texture
  vec4 overlaySample=texture2D(overlay,vUvs);
  
  // EXPLAIN: we can then multiply our new texture with
  // previous one
  gl_FragColor=diffuseSample*overlaySample;
  
  // EXPLAIN: fixing the alpha problem by workshop
  // author; so in my case this caused a problem, where
  // transparent part showed white, so I'm using my solution
  // gl_FragColor=mix(diffuseSample,overlaySample,overlaySample.w);
  
  // gl_FragColor=diffuseSample*tint*overlaySample;
  // gl_FragColor=vec4(vec3(vUvs.x),1.);
  
}
