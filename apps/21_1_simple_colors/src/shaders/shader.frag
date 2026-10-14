// EXPLAIN: so responasability of fragment shader
// in lamen terms is to dump out the color. Right?

void main(){
  
  // so these are rgba
  // and it is red
  // gl_FragColor=vec4(1.,0.,0.,1.);
  
  // EXPLAIN: or ve can also write it like this
  // rgb plus alpha as secondd param
  // gl_FragColor=vec4(vec3(1.,0.,0.),1.);
  
  // EXPLAIN: I want to try converting values here
  // just to see how things work
  
  vec3 myColor=vec3(255.,128.,0.);
  
  // EXPLAIN: I assume this would make component-wise
  // division
  myColor/=255.;
  // EXPLAIN: let's say colors were in a range between 0.0 to 255.0
  // well by doing mentioned, we will change the components
  // to be in range 0.0 to 1.0
  
  gl_FragColor=vec4(myColor,1.);
  
}