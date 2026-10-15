
varying vec2 vUvs;

// EXPLAIN: to supply texture we need sampler
// sampler is built in type that allows su binding texture to the shader
// EXPLAIN: so I assume since we are applying color texture
// it is name diffuse by workshop author
// EXPLAIN: Do people name this as albedo or similar?
uniform sampler2D diffuse;
// EXPLAIN: and in main we can read from sampler

// EXPLAIN: since I want to tint an image I'll use
// this uniform color
uniform vec4 tint;

void main(){
  
  // EXPLAIN: texture2D function builrt into glsl
  // returns the texel or the color value of the texture,
  // for the given coordinate
  // so you supply sampler and the coordinate and it gives
  // you back the vec4
  // gl_FragColor=texture2D(diffuse,vUvs);
  // EXPLAIN: I see our plane being complete white since
  // since we haven't actually set our uniform diffuse properly
  // from threejs, when we do that we will see the texture
  // in our plane
  
  // EXPLAIN: to be super obvious that texture2D returns vec4
  // let's do it like this
  // vec4 diffuseSample=texture2D(diffuse,vUvs);
  
  // gl_FragColor=diffuseSample;
  
  // EXPLAIN: for any reson you have, you could
  // display color channels separately
  // for example just red channel
  // EXPLAIN: you will end up with grayscale image
  // gl_FragColor=vec4(vec3(diffuseSample.r),1.);
  
  // EXPLAIN: or let's not show our red on every channel, just
  // on first and lets zero out green and blue
  // now you'll end up with red image
  // gl_FragColor=vec4(vec3(diffuseSample.r,0.,0.),1.);
  
  // EXPLAIN: for homework see if you can flip the image vertically or
  // horizontally
  // EXPLAIN: I'll try it like this
  // vec4 diffuseSample=texture2D(diffuse,vec2(1.)-vUvs);
  // EXPLAIN: or try it like this for vertical
  // vec4 diffuseSample=texture2D(diffuse,vec2(vUvs.x,1.-vUvs.y));
  // EXPLAIN: or try it like this for horizontal
  // vec4 diffuseSample=texture2D(diffuse,vec2(1.-vUvs.x,vUvs.y));
  
  // EXPLAIN: but what I want to do is to tint an image
  // hich we wil lacomplish by multiplying texture with
  // our tint vec4
  
  vec4 diffuseSample=texture2D(diffuse,vec2(vUvs.x,vUvs.y));
  
  gl_FragColor=diffuseSample*tint;
  // EXPLAIN: can you explain me better in ourr example why
  // we get this tintend as red. I understand that tint
  // has r to be 1.0 which is red but we are doing hadamard
  // product here between vectors, and other channels will be multiplied
  // with corresponding components which are zeros
  // as we set on threejs side in tint uniform. Is that why it is red?
  
  // gl_FragColor=vec4(vec3(vUvs.y),1.);
  
}
