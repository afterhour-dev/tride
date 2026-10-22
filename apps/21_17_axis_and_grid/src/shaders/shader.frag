
varying vec2 vUvs;

// EXPLAIN: we need this
uniform vec2 resolution;

vec3 red=vec3(1.,0.,0.);
vec3 green=vec3(0.,1.,0.);
vec3 blue=vec3(0.,0.,1.);
vec3 white=vec3(1.);
vec3 black=vec3(0.);
vec3 yellow=vec3(1.,1.,0.);

void main(){
  
  vec3 color=vec3(.75);
  
  vec2 center=vUvs-.5;
  
  vec2 cell=fract(center*resolution/70.);
  
  cell=abs(cell-.5);
  
  float distToCell=1.-2.*max(cell.x,cell.y);
  
  float cellLine=smoothstep(0.,.05,distToCell);
  // color=vec3(distToCell);
  // color=vec3(cellLine);
  
  // EXPLAIN: mking x and y axis
  float yAxis=smoothstep(0.,.002,abs(vUvs.x-.5));
  float xAxis=smoothstep(0.,.002,abs(vUvs.y-.5));
  
  // EXPLAIN: we will define lines here
  // I assume this is for centering the lines
  // EXPLAIN: when I increse the divisor, the line is ticker
  // why? and why are we using resolution here
  // make sure to use same resolution we used in center
  vec2 pos=center*resolution/70.;
  
  // EXPLAIN: isolating x and y values because we  are going to
  // change these in order to use differenrt functions on them
  // which is why we started this lesson in the first place
  float value1=pos.x;
  float value2=abs(pos.x);
  float value3=floor(pos.x);
  float value4=ceil(pos.x);
  float value5=round(pos.x);
  float value6=fract(pos.x);
  float value7=mod(pos.x,1.43);// if 1.0 it would be same as fract
  
  // EXPLAIN: this is y = x or diagonal line
  float functionalLine=smoothstep(
    0.,
    .075,
    abs(pos.y-value1)
  );
  
  // EXPLAIN: this is y = abs(x)
  float functionalLine2=smoothstep(
    0.,
    .075,
    abs(pos.y-value2)
  );
  
  // EXPLAIN: the rest of them
  float functionalLine3=smoothstep(
    0.,
    .075,
    abs(pos.y-value3)
  );
  float functionalLine4=smoothstep(
    0.,
    .075,
    abs(pos.y-value4)
  );
  float functionalLine5=smoothstep(
    0.,
    .075,
    abs(pos.y-value5)
  );
  
  float functionalLine6=smoothstep(
    0.,
    .075,
    abs(pos.y-value6)
  );
  float functionalLine7=smoothstep(
    0.,
    .075,
    abs(pos.y-value7)
  );
  
  color=mix(black,color,cellLine);
  
  // EXPLAIN: interpolate to draw x and y axis
  color=mix(blue,color,yAxis);
  color=mix(blue,color,xAxis);
  
  // EXPLAIN: drawing y = x
  color=mix(yellow,color,functionalLine);
  
  // EXPLAIN: drawing y = abs(x)
  color=mix(red,color,functionalLine2);
  
  // EXPLAIN: drawing the rest of them
  color=mix(green,color,functionalLine3);
  color=mix(green,color,functionalLine4);
  
  //  EXPLAIN: round , fract and mod are interesting
  color=mix(blue,color,functionalLine5);
  color=mix(white,color,functionalLine6);
  color=mix(black,color,functionalLine7);
  
  gl_FragColor=vec4(color,1.);
}