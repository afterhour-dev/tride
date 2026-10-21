
varying vec2 vUvs;

void main(){
  
  vec3 color=vec3(0.);// black
  
  vec3 red=vec3(1.,0.,0.);
  vec3 blue=vec3(0.,0.,1.);
  vec3 white=vec3(1.,1.,1.);
  
  // EXPLAIN: next two line
  float value1=vUvs.x;
  float value2=smoothstep(0.,1.,vUvs.x);
  //
  
  float line=smoothstep(
    0.,
    .005,
    abs(vUvs.y-.5)
  );
  // EXPLAIN: next line
  // float linearLine=smoothstep(0.,.0075,abs(vUvs.y-mix(.5,1.,vUvs.x)));
  
  // EXPLAIN: next line
  float linearLine=smoothstep(
    0.,
    .0075,
    abs(vUvs.y-mix(.5,1.,value1))
  );
  
  // EXPLAIN: next line
  float smoothLine=smoothstep(
    0.,
    .0075,
    abs(vUvs.y-mix(0.,.5,value2)));
    
    if(vUvs.y>.5){
      
      color=mix(red,blue,vUvs.x);
    }else{
      
      color=mix(red,blue,smoothstep(0.,1.,vUvs.x));
    }
    
    color=mix(white,color,line);
    
    // EXPLAIN: next line
    color=mix(white,color,linearLine);
    
    color=mix(white,color,smoothLine);
    
    // EXPLAIN: just to see linear line only
    // color=vec3(linearLine);
    
    gl_FragColor=vec4(color,1.);
  }