// Author: Ates Goral
// Title: XOR

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float xorBit(float a, float b, float bit) {
    float e = exp2(bit);
    float m = e * 2.0;
    return mod(a, m) >= e ^^ mod(b, m) >= e ? e : 0.0; 
}

float xor(float a, float b) {
	return xorBit(a, b, 0.0)
        + xorBit(a, b, 1.0)
        + xorBit(a, b, 2.0)
        + xorBit(a, b, 3.0)
        + xorBit(a, b, 4.0)
        + xorBit(a, b, 5.0)
        + xorBit(a, b, 6.0)
        + xorBit(a, b, 7.0)
        + xorBit(a, b, 8.0)
        + xorBit(a, b, 9.0)
        + xorBit(a, b, 10.0)
        + xorBit(a, b, 11.0)
        + xorBit(a, b, 12.0);
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    st -= vec2(.5, .5);
    st.x *= u_resolution.x/u_resolution.y;

    float zoom = 4.0 + sin(u_time) * 3.0;
    
    gl_FragColor = sin(xor(
        (gl_FragCoord.x + cos(u_time * 3.0) * 100.0) / zoom,
        (gl_FragCoord.y + sin(u_time * 2.0) * 100.0) / zoom)
    ) > 0.0
        ? vec4(1.0)
        : vec4(0.0);
}