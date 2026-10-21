
varying vec2 vUvs;

// EXPLAIN: as homework we try implementing clamp with min and max
float klamp(float t,float minimum,float maximum){
  
  // EXPLAIN: just switch and use minimum as argument in max
  // and maximum as argument in min
  return max(minimum,min(t,maximum));
}

void main(){
  
  vec3 color=vec3(0.);// black
  
  vec3 red=vec3(1.,0.,0.);
  vec3 blue=vec3(0.,0.,1.);
  vec3 white=vec3(1.);
  vec3 black=vec3(0.);
  
  float value1=vUvs.x;
  // EXPLAIN: instead of smoothstep, let's use min
  // float value2=smoothstep(0.,1.,vUvs.x);
  // EXPLAIN: you can explain what effect will min have
  // float value2=min(vUvs.x,.25);
  // EXPLAIN: let's try max, and
  // you can explain what effect will this have
  // float value2=max(vUvs.x,.75);
  // EXPLAIN: let's try clamp; you can
  // explain what effect will this have
  // float value2=clamp(vUvs.x,.25,.75);
  
  // EXPLAIN: trying out function I built for homework
  float value2=klamp(vUvs.x,.25,.75);
  
  float line=smoothstep(
    0.,
    .005,
    abs(vUvs.y-.5)
  );
  
  float linearLine=smoothstep(
    0.,
    .0075,
    abs(vUvs.y-mix(.5,1.,value1))
  );
  
  float smoothLine=smoothstep(
    0.,
    .0075,
    
    abs(
      vUvs.y-mix(0.,.5,value2)
    )
    
  );
  
  if(vUvs.y>.5){
    // EXPLAIN: we also use value1 here
    // because we want colors to change also
    color=mix(red,blue,value1);
    
  }else{
    // EXPLAIN: we also use value2 here
    // because we want color to change also
    color=mix(red,blue,value2);
  }
  
  color=mix(black,color,line);
  
  color=mix(black,color,linearLine);
  
  color=mix(black,color,smoothLine);
  
  gl_FragColor=vec4(color,1.);
  
}

