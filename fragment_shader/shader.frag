// Author: Ates Goral
// Title: Sticky

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

float sphereDF(vec3 pt, vec3 center, float radius) {
    float d = distance(pt, center) - radius;
    return d;
}

float distanceField(vec3 pt) {
    float d1 = sphereDF(pt, vec3(vec2(0.010,0.020), -2.0), 1.000);
    float d2 = sphereDF(pt, vec3(vec2(sin(u_time),0.020), cos(u_time) - 1.), .3);
    return d1 * d2;
}

vec3 calculateNormal(vec3 pt) {
    vec2 eps = vec2(1.0, -1.0) * 0.0005;
    return normalize(eps.xyy * distanceField(pt + eps.xyy) +
                     eps.yyx * distanceField(pt + eps.yyx) +
                     eps.yxy * distanceField(pt + eps.yxy) +
                     eps.xxx * distanceField(pt + eps.xxx));    
}

vec3 c1 = vec3(255.000,229.053,192.747) / 255.0;
vec3 c2 = vec3(84.000,65.127,55.292) / 255.0;
vec3 c3 = vec3(192.000,31.212,62.599) / 255.0;

float Ka = 0.152;   // Ambient reflection coefficient
float Kd = 1.792;   // Diffuse reflection coefficient
float Ks = 0.8;   // Specular reflection coefficient
float shininessVal = 8.0; // Shininess

vec3 ambientColor = c3;
vec3 diffuseColor = c2;
vec3 specularColor = c1;

vec3 lightPos = vec3(-3.0, 3.0, 1.0); // Light position
vec3 rayOrigin = vec3(0, 0, 1);

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    st -= vec2(.5, .5);
    st.x *= u_resolution.x/u_resolution.y;
    
    vec3 rayDirection = normalize(vec3(st, 0.) - rayOrigin + noise(st + u_time * 5.0) / 50.0);
    
    float dist;
    float photonPosition = 1.;
    
    for (int i = 0; i < 250; i++) {
        dist = distanceField(rayOrigin + rayDirection * photonPosition)/* + noise(st * 0.3)*/;
        photonPosition += dist *.8;
        
        if (dist < 0.01) break;
    }
    
    if (dist < 0.01) {
        vec3 intersection = rayOrigin + rayDirection * photonPosition;
        vec3 intersectionNormal = calculateNormal(intersection);
        
        // From: http://multivis.net/lecture/phong.html

		vec3 normalInterp = intersectionNormal;  // Surface normal
		vec3 vertPos = intersection;       // Vertex position
        
        vec3 N = normalize(normalInterp);
        vec3 L = normalize(lightPos - vertPos);

        // Lambert's cosine law
        float lambertian = max(dot(N, L), 0.0);

        float specular = 0.0;

        if (lambertian > 0.0) {
            vec3 R = reflect(-L, N);      // Reflected light vector
            vec3 V = normalize(-vertPos); // Vector to viewer

            // Compute the specular term
            float specAngle = max(dot(R, V), 0.0);
            specular = pow(specAngle, shininessVal);
        }
        
        gl_FragColor = vec4(Ka * ambientColor +
        	Kd * lambertian * diffuseColor +
	        Ks * specular * specularColor, 1.0);        
 		// float red = intersectionNormal.x * .5 + .0;
 		// float green = intersectionNormal.y * .5 + .5;
 		// gl_FragColor = vec4(vec3(red, green, .5), 1.0);
        //vec3 rgb = mix(c3 / 255.0, mix(c1 / 255.0, c2 / 255.0, intersectionNormal.x), intersectionNormal.y);
 		//gl_FragColor = vec4(rgb, 1.0);       
    } else {
 		gl_FragColor = vec4(vec3(0) / 255.0, 1.0);       
    }
}