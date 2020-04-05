/*
https://www.shadertoy.com/view/MdXBzB 


// Distance to quadratic bezier with 2 roots by Tom'2017
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License

// 3rd root is in all cases unnecessary (there is no blue area),
// because it is local maximum (note: circle always contains two other roots).
// This was actually suggested to me by Ken Silverman in 2010, while playing with distance
// functions to Bezier curves, but we didn't come up with any actual proof.
// It seems to be also true for 3d, which is pretty much the same code/formula,
// you can just replace input "vec2" with "vec3".

// As iq suggested here https://www.shadertoy.com/view/4dsfRS,
// we can just draw diagram showing which root is the closest
// (this doesn't really prove anything, but gives us a little bit of intuition)
#define ROOT_DIAGRAM 0
 // 0 to just show color based on sign

// Area/dots color coding:
// 1st root (t_1) = orange
// 2nd root (t_2) = green
// 3rd root (t_3) = blue
// if there is only one root: purple

// Sketch of the proof:
// Let's denote f(t) = d + (c + b*t)*t, as a quadratic bezier curve relative to the query point "p",
// where b = A-2*B-C, c = 2*(B-A), d = A-p.
// We want to find the global minimum of |f(t)|^2.
// |f(t)|^2 has local extrema when d |f(t)|^2 / dt = 2*f(t).f'(t) = 0 <=> f(t).f'(t) = 0
// (see http://ricedit.com/roots_of_quadratic.png).
// We can derive that f(t).f'(t) = g(t) = 2b^2*t^3 + 3bc*t^2 + (2bd+c^2)*t + cd
// Therefore g(t) = 0 is a cubic polynomial with 3 possible real roots at t in {t_1, t_2, t_3}.
// Just by looking at http://mathworld.wolfram.com/CubicFormula.html,
// we can see that roots can be found as follows:
//  v = acos( x )/3 for some "x"
//  assuming "x" can be anywhere within -1..1 range, v is between 0..pi/3 range
//  t_1 = s*cos(v) - o, for some positive "s"
//  t_2 = s*cos(v + 2pi/3) - o
//  t_3 = s*cos(v + 4pi/3) - o
// Now it is trivial (left as an excercise;)) to show that for all v in 0..pi/3:
//  cos(v + 2pi/3) <= cos(v + 4pi/3) <= cos(v)
// Therefore t_2 <= t_3 <= t_1.
// We know that |f(t)|^2 has all local extrema at t_2, t_3 and t_1.
// Therefore we have only two cases:
//   1. We have local minima at t_1 and t_2 and local maximum at t_3
//   2. We have local maxima at t_1 and t_2 and local minimum at t_3
// By Fermat theorem, we know that extremum is a local maximum if second derivative is negative
// (https://en.wikipedia.org/wiki/Derivative_test#Second_derivative_test_.28single_variable.29).
// We can derive that g'(t) =  6b^2*t^2 + 6bc*t + 2bd+c^2
// Assuming b!=0 (otherwise f(t) is a straight line, which is not interesting),
// we know that 6b^2 > 0 and the parabola is opening up (going to +infinity at the boundaries),
// therefore t_2 <= t_3 <= t_1 implies that g'(t_3) < max(g'(t_1), g'(t_2)).
// This excludes case 2, where local maxima are at t_1 and t_2, 
// because g'(t_1) < 0 and g'(t_2) < 0 implies g'(t_3) < 0 and t_3 would have 
// to be local maximum as well, which is contradictory to this case.
// The only case left is case 1, and local maximum obviously cannot be global minimum.
// Q.E.D. ;)

// Convenient implementation of cubic polynomial solver
// https://www.shadertoy.com/view/ltXSDB by Adam Simmons, T21 and others
// Additionally: returns number of roots
vec4 solveCubic(float a, float b, float c)
{
    float p = b - a*a / 3.0, p3 = p*p*p;
    float q = a * (2.0*a*a - 9.0*b) / 27.0 + c;
    float d = q*q + 4.0*p3 / 27.0;
    float offset = -a / 3.0;
    if(d >= 0.) {
        float z = sqrt(d);
        vec2 x = (vec2(z, -z) - q) / 2.0;
        vec2 uv = sign(x)*pow(abs(x), vec2(1.0/3.0));
        return vec4(vec3(offset + uv.x + uv.y), 1.0);
    }
    float v = acos(-sqrt(-27.0 / p3) * q / 2.0) / 3.0;
    float m = cos(v), n = sin(v)*1.732050808;
    return vec4(vec3(m + m, -n - m, n - m) * sqrt(-p / 3.0) + offset, 3.0);
}

// Find the signed distance from a point to a bezier curve without clamping
vec2 sdBezier(vec2 A, vec2 B, vec2 C, vec2 p, out vec4 rf)
{   
    // This is to prevent 3 colinear points, but there should be better solution to it.
    B = mix(B + vec2(1e-4), B, abs(sign(B * 2.0 - A - C)));
    
    // Calculate roots.
    vec2 a = B - A, b = A - B * 2.0 + C, c = a * 2.0, d = A - p;
    vec3 k = vec3(3.*dot(a,b),2.*dot(a,a)+dot(d,b),dot(d,a)) / dot(b,b);      
    vec4 t = solveCubic(k.x, k.y, k.z);

    vec2 dp1 = d + (c + b*t.x)*t.x;
    float d1 = dot(dp1, dp1);
    vec2 dp2 = d + (c + b*t.y)*t.y;
    float d2 = dot(dp2, dp2);
    // note: 3rd root is unnecessary
    
  #if ROOT_DIAGRAM == 1
    // return which root is closest, it's just for testing, otherwise can be removed
    vec2 dp3 = d + (c + b*t.z)*t.z;
    float d3 = dot(dp3, dp3);
    vec3 rd = sqrt(vec3(d1,d2,d3)); rd -= min(min(rd.x,rd.y),rd.z);
    rf = vec4(rd, t.w);
  #endif

    // Find closest distance and t
    vec4 r = (d1 < d2) ? vec4(d1, t.x, dp1) : vec4(d2, t.y, dp2);

    // Sign is just cross product with gradient
    vec2 g = 2.*b*r.y + c;
    float s =  sign(g.x*r.w - g.y*r.z);

    return vec2(s*sqrt(r.x), r.y);
}

float sdSegment(vec2 a,vec2 b,vec2 p)
{
	b -= a; p -= a;
    return length(b*clamp(dot(p,b)/dot(b,b),0.,1.) - p);
}

float getRoots(vec2 A, vec2 B, vec2 C, vec2 p, out vec3 r[3])
{   
    // This is to prevent 3 colinear points, but there should be better solution to it.
    B = mix(B + vec2(1e-4), B, abs(sign(B * 2.0 - A - C)));
    
    // Calculate roots.
    vec2 a = B - A, b = A - B * 2.0 + C, c = a * 2.0, d = A - p;
    vec3 k = vec3(3.*dot(a,b),2.*dot(a,a)+dot(d,b),dot(d,a)) / dot(b,b);      
    vec4 t = solveCubic(k.x, k.y, k.z);
    
    r[0] = vec3(A + (c + b*t.x)*t.x, t.x);
    r[1] = vec3(A + (c + b*t.y)*t.y, t.y);
    r[2] = vec3(A + (c + b*t.z)*t.z, t.z);
    return t.w;
}

// Define root colors:
const vec3 rcol0 = vec3(1.,.6,.1);
const vec3 rcol1 = vec3(.1,.8,.1);
const vec3 rcol2 = vec3(.1,.6,1.);
const vec3 rcol3 = vec3(.8,.2,.8); // special color if there is only 1 root

void plotRoot(vec3 rt, vec2 m, vec2 p, float ss, vec3 rcol, inout vec4 col)
{
    vec2 rd = rt.xy - m;
	float w  = length((p - vec2(rt.z,dot(rd,rd)))/vec2(8.,32.));
    float alpha = smoothstep(.009,.006,w)*(1.-col.w);
    col += vec4(mix(rcol,vec3(0),smoothstep(.006-ss*.2,.006,w)),1)*alpha;
}

// Plot |f(t)|^2
vec4 plotDistance(vec2 A, vec2 B, vec2 C, vec2 m, float rn, vec3 rt[3], vec2 fragCoord, float ss)
{
    vec2 a = B - A, b = A - B * 2.0 + C, c = a * 2.0, d = A - m;
    vec2 p = fragCoord/iResolution.x;
    p = vec2(p.x*8. - .6, p.y*32. - 2.);
    if (p.x > 2. || p.y > 6.) return vec4(0);
    vec2 r = d + (c + b*p.x)*p.x;
    vec4 col = vec4(0);
    float w, alpha;
    if (rn < 1.5) {
        plotRoot(rt[0],m,p,ss,rcol3,col);
    } else {
        plotRoot(rt[0],m,p,ss,rcol0,col);
        plotRoot(rt[1],m,p,ss,rcol1,col);
        plotRoot(rt[2],m,p,ss,rcol2,col);
    }
    w = p.y-dot(r,r);
    w = smoothstep(fwidth(w)*1.5,0.,abs(w))*(1.-col.w);
    col += vec4(1)*w*.9;
    return col;
}

float cross2(vec2 a,vec2 b) { return a.x*b.y - a.y*b.x; }

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 p = (2.0*fragCoord.xy-iResolution.xy)/iResolution.y;
    vec2 m = mix((2.0*iMouse.xy-iResolution.xy)/iResolution.y,
        vec2(cos(iTime * 1.2) * 0.8, 0.0), step(iMouse.z, 0.0));
    
    // Define the control points of our curve
    vec2 A = vec2(0.0, -0.6), C = vec2(0.0, +0.6), B = vec2(-0.8, +0.6);

    // Get the signed distance to bezier curve
    vec4 rf;
    vec2 r = sdBezier(A, B, C, p, rf);
    
    // Anti-alias factor
    float ss = 1.5/iResolution.y;

    float s = smoothstep(-ss,ss,r.x)*2. - 1.; // smooth sign
    s *= sign(cross2(B-C,A-C)); // flip sign to always be positive on "inside"

  #if ROOT_DIAGRAM == 0
    // show sign
    fragColor = vec4(.5) - .5*s*vec4(0.1,0.4,0.8,1.0);
    fragColor *= fragColor; // to linear-space (for correct blending)
  #else
    // Show root field
    rf.xyz = clamp((1.-rf.xyz*.5/ss),0.,1.);
    vec3 rcol = mix((rcol0*rf.x + rcol1*rf.y + rcol2*rf.z)/(rf.x + rf.y + rf.z + 1e-6),
                    rcol3, 1.-(rf.w-1.)*.5);
    fragColor = vec4(rcol*rcol*.6,1);
  #endif

    // Display distance isolines
    fragColor *= 1. + smoothstep(.02+ss*28.,.02,abs(fract(22.*r.x+.5)-.5))*.5;

    // Make negative sign slightly lighter
    fragColor = mix(fragColor, vec4(1), (-s+1.)*.05);
    
    vec3 rt[3];
    float rn = getRoots(A, B, C, m, rt);
    
    // Plot polynomial:
    vec4 rp = plotDistance(A,B,C,m,rn,rt,fragCoord,ss);
    fragColor = mix(fragColor, vec4(rp.xyz,1), rp.w);
    
    // Show AA curve.
    fragColor = mix(vec4(1), fragColor, smoothstep(0.01,0.01+ss,abs(r.x)) );
    
    // Render root points to mouse cursor:
    float pd = min(min(sdSegment(m,rt[0].xy,p), sdSegment(m,rt[1].xy,p)), sdSegment(m,rt[2].xy,p));
    fragColor = mix(fragColor, vec4(1), (1.-smoothstep(.002,0.002+ss,abs(pd)))*.6 );
    
    float dm = distance(p, m);
    float d0 = distance(p, rt[0].xy);
    vec4 crt = (d0 < dm) ? vec4(rcol3,d0) : vec4(1.,.1,.1,dm);
    if (rn > 2.5)
    {
        float d1 = distance(p, rt[1].xy);
        float d2 = distance(p, rt[2].xy);
        if (d0 < dm) crt = vec4(rcol0,d0);
        if (d1 < crt.w) crt = vec4(rcol1,d1);
        if (d2 < crt.w) crt = vec4(rcol2,d2);
        
        // Show that 3rd root is local maximum by drawing circle crossing it:
        fragColor = mix(fragColor, vec4(1),
                        smoothstep(ss*1.5,0.,abs(distance(p,m)-distance(m,rt[2].xy)))*.8);
    }
    fragColor = mix(vec4(1.0 - smoothstep(0.03-ss, 0.03, crt.w))*vec4(crt.xyz,1),
                    fragColor, smoothstep(0.03, 0.04, crt.w));
    
    // Render the control points
    pd = min(distance(p, A),(min(distance(p, B),distance(p, C))));
    fragColor = mix(vec4(1.0 - smoothstep(0.03-ss, 0.03, pd)), 
                    fragColor, smoothstep(0.03, 0.04, pd));
    
    // Back to gamma-space
    fragColor = sqrt(fragColor);
}
 
 
 */
