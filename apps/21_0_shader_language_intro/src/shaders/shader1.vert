// EXPLAIN: these .frag and .vert files aren't loaded
// because I just want to exploe how to write GLSL

// EXPLAIN:  return type goes before function name, for example void if it isn't returning anything; no return type

// EXPLAIN: if no parameters we can write `void` or not; nobody does
void main(void){
  
  // gl_FragColor=vec4(1.,0.,0.,1.);
  // EXPLAIN: calling the function we defined
  
  // EXPLAIN: can we call this function here
  gl_FragColor=getColor();
}

// EXPLAIN: we can define our own functions
// EXPLAIN: vec4 is return type
vec4 getColor(){
  // EXPLAIN: return statement
  return vec4(1.,0.,1.,1.);
}

// EXPLAIN: pass by refrence ability
// EXPLAIN: declering parameters as in or out
void getColorUsingOut(in vec4 color,out vec4 final){
  final=color*vec4(.5);
}

// EXPLAIN: see how we used `final` variable

void main(){
  vec4 final;
  // EXPLAIN: so this call will assign to final
  getColorUsingOut(vec4(1.),final);
  
  // EXPLAIN: and we ca nuse final because it has assigned value now
  gl_FragColor=final;
  
  // EXPLAIN: can you explain this better. Why we denoted with in and out here
  
  // EXPLAIN: Can we have multiple in and out values
}