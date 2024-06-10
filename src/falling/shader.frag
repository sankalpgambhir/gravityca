
precision mediump float;

#define timescale 1.0
#define brushSize 10.0

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

uniform sampler2D channel0;
uniform sampler2D channel1;

#define T(x, y) texture2D(channel1, uv + vec2(x, y) * (vec2(1, 1) / resolution.xy)).r
#define N(x, y) float(T(x, y) > 0.0)

#define Tc(x, y) texture2D(channel2, uv + vec2(x, y) * (vec2(1, 1) / resolution.xy)).r
#define Nc(x, y) float(T(x, y) > 0.0)

#define LEFT    1.0
#define RIGHT   2.0
#define DOWN    3.0

float snoise(in vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

vec4 fromState(in float state) {
    return vec4(vec3(state), 1.0);
}

void main() {
    // GoL

    vec2 uv = gl_FragCoord.xy / resolution.xy;
    
    if (distance(mouse, gl_FragCoord.xy) < brushSize) {
        gl_FragColor = vec4(1.0);
        return;
    }

    if (gl_FragCoord.y == resolution.y) {
        gl_FragColor = fromState(T(0, 0));
    }
    else {
        float state = T(0, 0); // previous state
        float prev = T(0, 0); // copy

        // float next = 0.0;
        // if the one below me is empty, I will move
        state -= state * float(T(0, -1) == 0.0);
        // else if bottom-left and left are empty, I will move bottom-left
        state -= state * float(T(1, -1) == 0.0) * float(T(1, 0) == 0.0);
        // else if bottom-right and right are empty, I will move bottom-right
        state -= state * float(T(-1, -1) == 0.0) * float(T(-1, 0) == 0.0);

        // is anyone moving here?
        // if I was empty and the one above me is filled, it will move
        state += (1.0 - prev) * float(T(0, -1) == 1.0);
        // if I was empty and right and top right are filled, top right will move
        state += (1.0 - prev) * (1.0 - state) * float(T(-1, 1) == 1.0) * float(T(-1, 0) == 1.0);
        // if I was empty and left and top left are filled, top left will move
        state += (1.0 - prev) * (1.0 - state) * float(T(1, 1) == 1.0) * float(T(1, 0) == 1.0);


        // can only move with collision priority check 
        // float canMove = float(move == LEFT) * float(Tc(-1, 0) != DOWN) * float(Tc(-2, 0) != RIGHT) +
        //                 float(move == RIGHT) * float(Tc(1, 0) != DOWN) +
        //                 float(move == DOWN) * 1.0;

        // canMove *= float(uv.y == 1.0); // stuck at bottom

        // float nextState = state * (1.0 - canMove); // Is this cell still free?

        // // can the one above me take my place?
        // nextState += (1.0 - nextState) * float(T(0, -1) == DOWN);
        // // can the one to the left take my place?
        // nextState += (1.0 - nextState) * float(T(-1, -1) == RIGHT);
        // // can the one to the right take my place?
        // nextState += (1.0 - nextState) * float(T(1, -1) == LEFT);

        gl_FragColor = fromState(state);

    }
}
