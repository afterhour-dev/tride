
varying vec2 vUvs;

void main(){
  
  vec3 color=vec3(0.);// black
  
  vec3 red=vec3(1.,0.,0.);
  vec3 blue=vec3(0.,0.,1.);
  vec3 white=vec3(1.,1.,1.);
  
  // EXPLAIN: step 1 --> division line
  // I assume we are gertting values from -0.5 to 0.5
  // but to limit them to go from 0.5 to 0.0 and 0.0 to 0.5
  // we can use abs()
  // float line=abs(vUvs.y-.5);
  // color=vec3(line);
  
  // EXPLAIN: using smoothstep with small threshold to
  // float line=smoothstep(0.,.005,abs(vUvs.y-.5));
  // color=vec3(line);
  
  // EXPLAIN: we lost our dicvision line with this
  // meaning let's define our line bellow this if else
  if(vUvs.y>.5){
    // EXPLAIN: upper part will be lerp
    // color=mix(red,blue,vUvs.x);
    
    // EXPLAIN: drawing the line representing lerp
    color=mix(red,blue,vUvs.x);
  }else{
    // EXPLAIN: lower part will be smothsetep
    color=mix(red,blue,smoothstep(0.,1.,vUvs.x));
  }
  
  float line=smoothstep(0.,.005,abs(vUvs.y-.5));
  color=mix(white,color,line);
  
  gl_FragColor=vec4(color,1.);
}