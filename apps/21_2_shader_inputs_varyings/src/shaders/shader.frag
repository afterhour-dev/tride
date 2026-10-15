// EXPLAIN: we need to do the same thing in fragment shader
// in terms of declaring varying, so just copy and past
// devlaratio nhere from vertex shader
varying vec2 vUvs;

void main(){
  
  // EXPLAIN: using x component from vUvs varying
  // gl_FragColor=vec4(vUvs.x,vUvs.x,vUvs.x,1.);
  // EXPLAIN: but it is better to do it with vec3
  // more concise
  // EXPLAIN: so we have gradient going from black to white
  // from left to right
  // gl_FragColor=vec4(vec3(vUvs.x),1.);
  
  // EXPLAIN: let's draw both x and y components
  // of uv coordinates
  // gl_FragColor=vec4(vec3(vUvs.x),1.);
  
  // EXPLAIN: As a homework how would we flip the gradient so it goes
  // from right to left; Wll without much thinking
  // I resorted to subtracting x component from 1.0
  // and it worked. I have no good reasoning for doing this
  // I just assumed that x is also value between 0.0 and 1.0
  // so that subtraction would give me another value from
  // 0.0 to 1.0. But  you should explain this better.
  // gl_FragColor=vec4(vec3(1.-vUvs.x),1.);
  
  // EXPLAIN: trying both x and y components of uv
  
  // EXPLAIN: well we will have diagonal gradient, green to red
  // but there is also something interesting;
  // it is interesting how in bottom left
  // you have complete black
  // meaning values there are all 0.0 :  vec3(0.0,0.0,0.0)
  // EXPLAIN: and color on the top left corner wil lbe complete
  // green meaning output there is vec3(0.0,1.0,0.0), or in
  // other word uv coordinates were: x -> 0.0 and y -> 1.0
  // and similar thing is happening in bottom right where
  // we have have vec3(1.0,0.0,0.0), a fully red, meaning
  // uv corrdinates are 1.0 and 0.0
  // and top right is yellow vec3(1.0,1.0,0.0), and uv corrdinates
  // are 1.0 and 1.0
  // gl_FragColor=vec4(vec3(vUvs.x,vUvs.y,0.),1.);
  // EXPLAIN: this i demonstrating something interesting
  // what this demonstrating is, rember there is only 4
  // vertices in our quad (our plane mesh); two triangles are
  // covering entirety of the plane, but uv coordinates are being
  // interpolated through the varying variables
  
  // EXPLAIN: since vUvs is vec2 we can write it like this too
  // which will produce same effect like previous example above
  // EXPLAIN: I guess this passing of smaller vector into bigger
  // works like spreading parameters, or maybe you
  // have better explanation
  // gl_FragColor=vec4(vUvs,0.,1.);
  
  // EXPLAIN: again for the homeworks, how would I change
  // direactions so we have different colors in different cornes
  // I'll try again subtracting from 1.0, but this time
  // both uv coordinates
  // gl_FragColor=vec4(1.-vUvs.x,1.-vUvs.y,0.,1.);
  
  // EXPLAIN: another homeworks. I want to make top left
  // red, and bottom right blue
  gl_FragColor=vec4(1.-vUvs.x,0.,1.-vUvs.y,1.);
  
}