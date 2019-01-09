const Core = require("core");
const WebGL = require("webgl");

const sVertexShader = `
attribute vec3 a_position;

varying vec2 v_majorAxis;
varying vec2 v_minorAxis;

uniform vec4 u_viewportWidthHeightWidthhalfHeighthalf;
uniform float u_sphereRadius;
uniform vec3 u_cameraAt;
uniform vec3 u_cameraLeft;
uniform vec3 u_cameraUp;
uniform vec3 u_cameraPos;
uniform vec3 u_cameraFovhFovvFar;

void main() {
	vec3 cameraToAtom = a_position - u_cameraPos;

	float cameraSpaceX = dot(cameraToAtom, u_cameraAt);
	float cameraSpaceY = dot(cameraToAtom, u_cameraLeft);
	float cameraSpaceZ = dot(cameraToAtom, u_cameraUp);
	float cameraSpaceXYLengthSquared = ((cameraSpaceX * cameraSpaceX) + (cameraSpaceY* cameraSpaceY));
	float cameraSpaceLength = sqrt(cameraSpaceXYLengthSquared + (cameraSpaceZ * cameraSpaceZ));
	float cameraSpaceXYLength = sqrt(cameraSpaceXYLengthSquared);

	float polarR = degrees(acos(clamp(cameraSpaceZ / cameraSpaceLength, -1.0, 1.0)));

	//replace atan with normalised vector, save (atan,sin,cos)
	float cameraSpaceXNorm = 1.0; //Xnorm not zero for correct second of two cases, either atom directly infront (and polarR == 0) or atom directly behind camera (polarR == 180)
	float cameraSpaceYNorm = 0.0;
	if (cameraSpaceXYLength != 0.0){
		cameraSpaceXNorm = cameraSpaceX / cameraSpaceXYLength;
		cameraSpaceYNorm = cameraSpaceY / cameraSpaceXYLength;
	}

	float fovHHalf = u_cameraFovhFovvFar.x * 0.5;
	float width = u_viewportWidthHeightWidthhalfHeighthalf.x;
	float height = u_viewportWidthHeightWidthhalfHeighthalf.y;
	float widthHalf = u_viewportWidthHeightWidthhalfHeighthalf.z;
	float heightHalf = u_viewportWidthHeightWidthhalfHeighthalf.w;
	float screenR = polarR / fovHHalf; //screen space, -1 ... 1

	float screenX = screenR * cameraSpaceXNorm;
	float apsectCorrection = (width / height);
	float screenY = screenR * cameraSpaceYNorm * apsectCorrection;

	float screenZRaw = (cameraSpaceLength + u_sphereRadius) / u_cameraFovhFovvFar.z;
	float screenZ = (screenZRaw * 2.0) - 1.0;

	float atomAngle = degrees(asin(clamp(u_sphereRadius / cameraSpaceLength, -1.0, 1.0)));
	float minorAxis = atomAngle / fovHHalf;

	float atomAngleMajor = degrees(atan(u_sphereRadius, cameraSpaceXYLength));
	float majorAxisTemp = sin(radians(atomAngleMajor)) * polarR / fovHHalf;
	float majorAxis = max(minorAxis, majorAxisTemp);

	float pointSize = 1024.0; //arbitary max radius in pixels
	if (u_sphereRadius < cameraSpaceLength){
		pointSize = min(1024.0, majorAxis * width);
	}

	gl_Position = vec4(screenX, screenY, screenZ, 1.0);
	gl_PointSize = pointSize; //point size is diameter

	v_majorAxis = vec2(cameraSpaceYNorm, cameraSpaceXNorm);
	float mul = majorAxis / minorAxis;
	v_minorAxis = vec2(cameraSpaceXNorm * mul, -cameraSpaceYNorm * mul);
}
`;

const sFragmentShader = `
precision mediump float;
varying vec2 v_majorAxis;
varying vec2 v_minorAxis;
void main() {
	vec2 pointCoord = (gl_PointCoord - vec2(0.5, 0.5)) * 2.0;
	float dist = dot(pointCoord, pointCoord);
	if (1.0 < dist){
		discard;
	}
	vec2 ellipseCoords = vec2(dot(v_majorAxis, pointCoord), dot(v_minorAxis, pointCoord));
	float ellipseDist = dot(ellipseCoords, ellipseCoords);
	if (1.0 < ellipseDist){
		discard;
	}

	gl_FragColor = vec4(gl_PointCoord.x, gl_PointCoord.y, 0.0, 1.0);
}
`;

const sVertexAttributeNameArray = ["a_position"];
const sUniformNameArray = ["u_viewportWidthHeightWidthhalfHeighthalf", "u_sphereRadius", "u_cameraAt", "u_cameraUp", "u_cameraLeft", "u_cameraPos", "u_cameraFovhFovvFar"];

const factory = function(in_webGLContextWrapper, in_uniformServer){
	return WebGL.ShaderWrapper.factory(
		in_webGLContextWrapper, 
		sVertexShader, 
		sFragmentShader, 
		in_uniformServer, 
		sVertexAttributeNameArray, 
		sUniformNameArray);
}

module.exports = {
	"factory" : factory,
};