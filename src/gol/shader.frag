
precision mediump float;

#define timescale 1.0
#define brushSize 10.0

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

uniform sampler2D channel0;

#define T(x, y) texture2D(channel0, uv + vec2(x, y) * (vec2(1, 1) / resolution.xy)).r
#define N(x, y) float(T(x, y) > 0.0)

float snoise(in vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
    // GoL

    vec2 uv = gl_FragCoord.xy / resolution.xy;

    if (time < 0.1) {
        // float rand = sin((gl_FragCoord.xy / resolution.xy).x * 100.0);
        float rand = snoise(gl_FragCoord.xy / resolution.xy);
        gl_FragColor = vec4(rand > 0.8 ? 1.0 : 0.0);
        return;
    }
    
    if (distance(mouse, gl_FragCoord.xy) < brushSize) {
        gl_FragColor = vec4(1.0);
        return;
    }

    // neighbours
    float n =   N(-1, -1) + N(0, -1) + N(1, -1) +
                N(-1,  0) + 0.0      + N(1,  0) +
                N(-1,  1) + N(0,  1) + N(1,  1) ;

    float state = T(0, 0); // previous state

    // come to life
    state += (1.0 - float(state > 0.0)) * float(n == 3.0);

    state *= float(n == 2.0) + float(n == 3.0);

    // fade
    state -= float(state > 0.4) * 0.05;

    vec3 color = vec3(state, state, state);
    gl_FragColor = vec4(color, 1.0);
}
