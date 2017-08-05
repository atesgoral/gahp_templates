// Author: Ates Goral
// Title: Perlin Hall

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float random (in vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

// Value noise by Inigo Quilez - iq/2013
// https://www.shadertoy.com/view/lsf3WH
float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    vec2 u = f*f*(3.0-2.0*f);
    return mix( mix( random( i + vec2(0.0,0.0) ),
                     random( i + vec2(1.0,0.0) ), u.x),
                mix( random( i + vec2(0.0,1.0) ),
                     random( i + vec2(1.0,1.0) ), u.x), u.y);
}

vec3 c1 = vec3(255.0, 60.0, 0.0);

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    st -= vec2(0.5);
    st.x *= u_resolution.x / u_resolution.y;

    float a = atan(st.x / st.y);
    float r = sqrt(st.x * st.x + st.y * st.y);

    vec2 proj = vec2(a, r) + st * (sin(u_time) + 1.0) / 2.0;

    float n = noise(proj * 40.0);

    n = step(0.5 - (sin(u_time * 5.0) + 1.0) / 4.0, n);

    gl_FragColor = vec4(
		mix(c1 / 255.0, vec3(0), n),
        1.0
    );
}
