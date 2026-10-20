
varying vec2 vUvs;

void main(){
  
  vec3 color=vec3(0.);
  
  vec3 red=vec3(1.,0.,0.);
  vec3 blue=vec3(0.,0.,1.);
  vec3 white=vec3(1.,1.,1.);
  
  // color=vec3(vUvs.x);
  
  // EXPLAIN: using step; and gradient will change from from
  // smooth t oshow step from black to white
  // color=vec3(step(.5,vUvs.x));
  
  // EXPLAIN: now the black portion takes 25% and 75% is wihite
  // color=vec3(step(.25,vUvs.x));
  
  // EXPLAIN: using lerp or mix
  // color=mix(red,blue,vUvs.x);
  
  // color = vec3(vUvs.x)
  // EXPLAIN: using smoothstep
  // here you will get not so exiciting gradient, that looks
  // pretty close to the old one; but it is different, if you look
  // closely, you can see lingering,
  // and middle dissapeard; a subtle change, not a big change
  // color=vec3(smoothstep(0.,1.,vUvs.x));
  
  // EXPLAIN: smoother mix when passing a smoothstep to a mix
  // you have red and blue but also lingering
  color=mix(red,blue,smoothstep(0.,1.,vUvs.x));
  
  gl_FragColor=vec4(color,1.);
}