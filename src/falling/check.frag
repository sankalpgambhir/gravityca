
precision mediump float;

#define timescale 1.0
#define brushSize 10.0

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

uniform sampler2D channel0;

#define T(x, y) texture2D(channel0, uv + vec2(x, y) * (vec2(1, 1) / resolution.xy)).r
#define N(x, y) float(T(x, y) > 0.0)

#define LEFT    1.0
#define RIGHT   2.0
#define DOWN    3.0

void main() {
    // GoL

    vec2 uv = gl_FragCoord.xy / resolution.xy;

    float move = 0.0;

    move += (1.0 - float(move > 0.0)) * N( 0, +1) * DOWN;
    move += (1.0 - float(move > 0.0)) * N(+1, -1) * RIGHT;
    move += (1.0 - float(move > 0.0)) * N(-1, -1) * LEFT;

    vec3 color = vec3(move, move, move);
    gl_FragColor = vec4(color, 1.0);
}
