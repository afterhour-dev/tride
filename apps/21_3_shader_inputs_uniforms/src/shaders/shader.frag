
varying vec2 vUvs;

// EXPLAIN: we got error when we try to do something like this
// we need to assign those from threejs
// uniform vec3 color_1=vec3(1.,0.,0.);
// uniform vec3 color_2=vec3(0.,0.,1.);

// EXPLAIN: when we set uniform from threejs, we can use them
// here. This would throw if we didn't set them in threejs
uniform vec3 color_1;
uniform vec3 color_2;

void main(){
  
  // EXPLAIN: remeber from previous lesson is that
  // black to white is in essence the gradient form 0.0 to 1.0
  // we can use that to mix two colors instead
  
  /* gl_FragColor=mix(
    vec4(1.,0.,0.,1.),
    vec4(0.,0.,1.,1.),
    // EXPLAIN: we use here just a fraction to demonstrate
    // you will get some color in with more blue than red
    // this is not a gradient, you need uv for that
    .25
  ); */
  
  // EXPLAIN: so this is going to be gradient because
  // we are using uv coordinates
  // so you can notic complete red on the left and compete blue on the right and
  // in the middle it goes something like purpleish transitioning
  // right to the blue, and left to the red
  // but what is visible that middle is darker than the edges
  /* gl_FragColor=mix(
    vec4(1.,0.,0.,1.),
    vec4(0.,0.,1.,1.),
    vUvs.x
  ); */
  
  // EXPLAIN: as homework, why is middle much darker than the edges
  // because intiitevly, if you were to make a gradient yourself
  // the middle would be much brighter. why is the middle of the
  // gradient seemingly darker color than the edges?
  // Well. I really don't know where to start but looking at
  // `t` value which is vUvs.x, this value goes from 0.0 to 1.0
  // and middle being 0.5, but what we want is middle
  // that would be higher than 0.5 but perserving
  // 0.0 ant the beggining and 1.0 at the end. Am I right?
  // I am just going to write this here, maybe you can explain
  // it better
  /* vec3 col=mix(
    vec3(1.,0.,0.),
    vec3(0.,0.,1.),
    vUvs.x
  );
  // If I'm correct when interpolated value for red is
  // 0.5 this would be pow(0.5, 0.45) which is 0.73
  col=pow(col,vec3(1./2.2));
  gl_FragColor=vec4(col,1.); */
  
  // EXPLAIN: here we introduced usage of uniform variable
  // since we don't want to hardcode our contants every time
  
  vec3 col=mix(color_1,color_2,vUvs.x);
  
  gl_FragColor=vec4(col,1.);
  
  // gl_FragColor=vec4(vUvs,0.,1.);
  
}