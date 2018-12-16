const Core = require("core");
const WebGL = require("webgl");

const sVertexShader = `
attribute vec2 a_position;
attribute vec2 a_uv;
varying vec2 v_uv;
void main() {
	gl_Position = vec4(a_position, 0.0, 1.0);
	v_uv = a_uv;
}
`;
const sFragmentShader = `
precision mediump float;
uniform sampler2D u_sampler0;
varying vec2 v_uv;
void main() {
	gl_FragColor = texture2D(u_sampler0, v_uv);
}
`;

const sVertexAttributeNameArray = ["a_position", "a_uv"];
const sUniformNameArray = ["u_sampler0"];

const onPageLoad = function(){
	console.info("onPageLoad");

	const html5CanvasElement = (undefined !== document) ? document.getElementById('html5CanvasElement') : undefined;

	//a canvas width, height is 300,150 by default (coordinate space). lets change that to what size it is
	if (undefined !== html5CanvasElement){
		html5CanvasElement.width = html5CanvasElement.clientWidth;
		html5CanvasElement.height = html5CanvasElement.clientHeight;
	}

	const textureWidth = 256;
	const textureHeight= 256;
	const textureRGBData = new Uint8Array(256 * 256 * 3);
	var trace = 0;
	for(var indexY = 0; indexY < textureHeight; ++indexY) {
		for(var indexX = 0; indexX < textureWidth; ++indexX) {
			textureRGBData[trace] = indexX; ++trace;
			textureRGBData[trace] = indexY; ++trace;
			var dot = (((indexX / (textureWidth - 1)) * 0.7071067811) + ((indexY / (textureHeight - 1)) * 0.7071067811));
			var value = (dot / 1.4142135623) * 255;
			var value2 = Math.max(0, Math.min(255, Math.round(value) ) );
			textureRGBData[trace] = value2; ++trace;
		}
	}
	const webGLContextWrapperParam = WebGL.WebGLContextWrapper.makeParamObject(false, false, false, []);
	const webGLContextWrapper = WebGL.WebGLContextWrapper.factory(html5CanvasElement, webGLContextWrapperParam);
	const uniformServer = {
		"setUniform" : function(in_webGLContextWrapper, in_key, in_position){
			if (in_key === "u_sampler0"){
				//console.log("uniformServer:u_sampler0");
				WebGL.WebGLContextWrapperHelper.setUniformInteger(in_webGLContextWrapper, in_position, 0);
			}
		}
	};
	const shader = WebGL.ShaderWrapper.factory(webGLContextWrapper, sVertexShader, sFragmentShader, uniformServer, sVertexAttributeNameArray, sUniformNameArray);
	const texture = WebGL.TextureWrapper.factoryByteRGB(webGLContextWrapper, textureWidth, textureHeight, textureRGBData)
	const material = WebGL.MaterialWrapper.factoryDefault(shader, [texture]);
	const webGLState = WebGL.WebGLState.factory(webGLContextWrapper);

	const posDataStream = WebGL.ModelDataStream.factory(
			"BYTE",
			2,
			new Int8Array([
				-1, -1,
				-1, 1,
				1, -1,

				1, -1,
				-1, 1,
				1, 1
				]),
			"STATIC_DRAW",
			false
			);

	const uvDataStream = WebGL.ModelDataStream.factory(
			"BYTE",
			2,
			new Uint8Array([
				0, 0,
				0, 1,
				1, 0,

				1, 0,
				0, 1,
				1, 1
				]),
			"STATIC_DRAW",
			false
			);

	const model = WebGL.ModelWrapper.factory(
		webGLContextWrapper, 
		"TRIANGLES",
		6,
		{
			"a_position" : posDataStream,
			"a_uv" : uvDataStream
		}
		);

	const clearColour = Core.Colour4.factoryFloat32(0.1, 0.1, 0.1, 1.0);
	WebGL.WebGLContextWrapperHelper.clear(webGLContextWrapper, clearColour);

	material.apply(webGLContextWrapper, webGLState);
	model.draw(webGLContextWrapper, shader.getMapVertexAttribute());

	return;
}


window.addEventListener('load', onPageLoad, true);
