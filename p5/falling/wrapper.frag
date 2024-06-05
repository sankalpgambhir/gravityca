
precision mediump float;

uniform vec2 resolution;

uniform sampler2D channel0;

#define T(v) texture2D(channel0, v.xy / resolution.xy)

void main() {
    // render the buffer
    gl_FragColor = T(gl_FragCoord);
}
