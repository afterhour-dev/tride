
varying vec2 vUvs;

vec3 red=vec3(1.,0.,0.);
vec3 blue=vec3(0.,0.,1.);
vec3 white=vec3(1.);
vec3 black=vec3(0.);
vec3 yellow=vec3(1.,1.,0.);

void main(){
  
  // EXPLAIN: for start making it gray
  vec3 color=vec3(.75);
  
  // EXPLAIN:we want to output uv coordinates
  // to see them
  // color=vec3(vUvs,0.);
  
  // EXPLAIN: let's multiply coordinates with 10.0
  // so since we will have large value for the coordinates
  // most of them will be clamped to 1.0, but only at the beggining
  // pay attention to small values between 0.0 and 0.1, you will see that
  // on the screen but for 0.1 and above eveything will be clamped
  // to 1.0; maybe you can explain this better, and tell me what effect
  // will this produce; I can describe what I see but it is
  // confusing; We will have small bottom row of red blending to yellow,
  // and small left column of green blending to yellow; why red and green and in that
  // direction? I assume because we use uv.x for red, and we use uv.y
  // for green, since we put them in that order in vector
  // and blue is 0.0 so thereisn't any blue
  // also green column and red row are overlapping, and making
  // small gradient cell (diagonal gradient) in bottom left corner
  // and the rest surface (entire suraface minus mentioned
  // row and column) will be yellow
  // color=vec3(vUvs,0.)*10.;
  
  // EXPLAIN: let's use fract
  // it is hard to imagine what this is doing
  // I assume it will gives a repeating set of values, for example
  // taking fractals from 5 to 6 will have same fractals like from 7 to 8
  // this is why we are going to hav cells
  // so each of these cells will have 0,0 in bottom left and 1,1 in top right
  // so I assume we have by x and y all repeating values in range from 0.0 to 1.0
  // color=fract(vec3(vUvs,0.)*10.);
  
  // EXPLAIN: puting cell in single variable
  vec2 cell=fract(vUvs*10.);
  // EXPLAIN: uisng cell
  // color=vec3(cell,0.);
  
  // EXPLAIN: so we want gradient per cell basis but we want to
  // displayit as tickness of the cell if I can call it like that
  // maybe you have better term, so even gradient on all sides
  // blending with a color in the central part of the cell
  // so we calculate distance or that tickness like:
  //  `d = 0.5 - max(d1,d2)`,
  // where d1 and d2 are vertical and horizontal distance from cell
  //  center to the selected line,
  // maybe you can explain this better
  
  // EXPLAIN: calculating distance
  // EXPLAIN: I assume abs work component-wise
  cell=abs(cell-.5);
  // EXPLAIN: we also inverted values by subtracting from 1.0
  // and I assume multiplying with 2 decides the mentioned tickness
  // maybe you can explain this better
  float distToCell=2.*max(cell.x,cell.y);
  distToCell=1.-distToCell;
  // EXPLAIN: dumping the distance into color to se if this is working
  color=vec3(distToCell);
  
  gl_FragColor=vec4(color,1.);
}