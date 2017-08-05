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

vec3 c1 = vec3(97.0, 90.0, 69.0);
vec3 c2 = vec3(255.0, 11.0, 120.0);
vec3 c3 = vec3(157.0, 4.0, 83.0);
vec3 c4 = vec3(160.0, 159.0, 116.0);

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    //st -= vec2(.5, .5);
    st.x *= u_resolution.x / u_resolution.y;

    float zoom = 3.0 + sin(u_time) * 0.2;
    
    float v = sin(xor(
        (st.x * 1000.0 + u_time * 250.0) / zoom,
        (st.y * 1000.0 + sin(u_time * 2.0) * 20.0) / zoom)
    );

    v = exp(log(v) + sin(u_time * 0.1));

    gl_FragColor = v > 0.0
        ? v > 0.25
            ? v > 0.5
                ? v > 0.75
                    ? vec4(c1 / 255.0, 1.0)
                    : vec4(c2 / 255.0, 1.0)
                : vec4(c3 / 255.0, 1.0)
            : vec4(c4 / 255.0, 1.0)
        : vec4(vec3(0.0), 1.0);
}            
