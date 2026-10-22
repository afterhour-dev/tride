
varying vec2 vUvs;

// EXPLAIN: we need this
uniform vec2 resolution;

vec3 red=vec3(1.,0.,0.);
vec3 blue=vec3(0.,0.,1.);
vec3 white=vec3(1.);
vec3 black=vec3(0.);
vec3 yellow=vec3(1.,1.,0.);

void main(){
  
  vec3 color=vec3(.75);
  
  // EXPLAIN: grid code from previous lesson
  /* vec2 cell=fract(vUvs*10.);
  
  cell=abs(cell-.5);
  
  float distToCell= 1.0 - 2.*max(cell.x,cell.y);
  
  color=vec3(distToCell);
  */
  
  // EXPLAIN: for centering
  vec2 center=vUvs-.5;
  
  // EXPLAIN: to make cells consistent instead of this
  // vec2 cell=fract(vUvs*10.);
  // we do this, we are multipling by resolution vector
  // divided by 100.0
  // vec2 cell=fract(vUvs*resolution/100.);
  
  // EXPLAIN: we multiply cente rby resolution
  vec2 cell=fract(center*resolution/100.);
  
  cell=abs(cell-.5);
  
  float distToCell=1.-2.*max(cell.x,cell.y);
  
  // EXPLAIN: we are using smoothstep trick we learned in some
  // previous lesson
  float cellLine=smoothstep(0.,.05,distToCell);
  // color=vec3(distToCell);
  // color=vec3(cellLine);
  
  // EXPLAIN: because we want gray cells, not the white ones
  color=mix(black,color,cellLine);
  
  gl_FragColor=vec4(color,1.);
}