
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
  
  // EXPLAIN: this is what we did in previous lesson
  /*
  vec2 center=vUvs-.5;
  
  vec2 cell=fract(center*resolution/70.);
  
  cell=abs(cell-.5);
  
  float distToCell=1.-2.*max(cell.x,cell.y);
  
  float cellLine=smoothstep(0.,.05,distToCell);
  // color=vec3(distToCell);
  // color=vec3(cellLine);
  
  color=mix(black,color,cellLine);
  */
  // -------------------------------------------
  
  vec2 center=vUvs-.5;
  // EXPLAIN: let's comment out everything here after
  // we defined center vec2
  
  // EXPLAIN: let's again display gradient with red and green
  // color = vec3(vUvs, 0.0);
  
  // EXPLAIN: let's now try to use center as red green part
  // color = vec3(center, 0.0);
  
  // EXPLAIN: let's wrap center in abs to se what we get
  color = vec3(abs(center), 0.0);
  
  /* vec2 cell=fract(center*resolution/70.);
  
  cell=abs(cell-.5);
  
  float distToCell=1.-2.*max(cell.x,cell.y);
  
  float cellLine=smoothstep(0.,.05,distToCell);
  
  color=mix(black,color,cellLine); */
  
  gl_FragColor=vec4(color,1.);
}