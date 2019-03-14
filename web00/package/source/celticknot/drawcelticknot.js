const KnotTexture = require("./knot_tex8_32_32.js");
const KnotAlphaTexture = require("./knot_texa8_32_32.js");
const Core = require("core");
const WebGL = require("webgl");

const sSolidChance = 0.4;
const sHoldTime = 2.0;

const sVertexShader = `
attribute vec2 a_pos;
attribute vec2 a_uv;
attribute vec3 a_colorMask;
varying vec2 v_uv;
varying vec3 v_colorMask;
void main() {
	gl_Position = vec4(a_pos.x, a_pos.y, 0.0, 1.0);
	v_uv = a_uv;
	v_colorMask = a_colorMask;
}
`;
const sFragmentShader = `
precision mediump float;
varying vec2 v_uv;
varying vec3 v_colorMask;
uniform sampler2D u_sampler;
uniform sampler2D u_samplerAlpha;
void main() {
	vec4 texelValue = texture2D(u_sampler, v_uv);
	float value = dot(texelValue.xyz, v_colorMask);
	vec4 texelAlpha = texture2D(u_samplerAlpha, v_uv);
	float alpha = dot(texelAlpha.xyz, v_colorMask);
	gl_FragColor = vec4(value, value, value, alpha);
}
`;
const sVertexAttributeNameArray = [
	"a_position", 
	"a_uv", 
	"a_colorMask"
];
const sUniformNameMap = {
	"u_sampler" : WebGL.ShaderUniformData.sInt,
	"u_samplerAlpha" : WebGL.ShaderUniformData.sInt,
};

const shaderFactory = function(in_webGLState){
	return WebGL.ShaderWrapper.factory(
		in_webGLState, 
		sVertexShader, 
		sFragmentShader, 
		sVertexAttributeNameArray, 
		sUniformNameMap);
}

const addVertex = function(inout_posDataArray, inout_uvDataArray, inout_colorMaskDataArray, in_posX, in_posY, in_uvX, in_uvY, in_colorMaskX, in_colorMaskY, in_colorMaskZ){
	inout_posDataArray.push(in_posX);
	inout_posDataArray.push(in_posY);
	inout_uvDataArray.push(in_uvX);
	inout_uvDataArray.push(in_uvY);
	inout_colorMaskDataArray.push(in_colorMaskX);
	inout_colorMaskDataArray.push(in_colorMaskY);
	inout_colorMaskDataArray.push(in_colorMaskZ);
	return;
}

//	1 ---- 2
//	|	   |
//	|	   |
//	3 ---- 4
const addTile = function(inout_posDataArray, inout_uvDataArray, inout_colorMaskDataArray, in_indexWidth, in_indexHeight, in_tile, in_targetWidth, in_targetHeight, in_tileWidth, in_tileHeight){
	var pos1x, pos1y;
	var pos2x, pos2y;
	var pos3x, pos3y;
	var pos4x, pos4y;
	var uv1x, uv1y;
	var uv2x, uv2y;
	var uv3x, uv3y;
	var uv4x, uv4y;
	var rot = 0;
	var colorMaskX, colorMaskY, colorMaskZ;

	pos1x = (((in_indexWidth + 0) * in_tileWidth) / in_targetWidth) * 2.0 - 1.0;
	pos1y = (((in_indexHeight + 0) * in_tileHeight) / in_targetHeight) * 2.0 - 1.0;
	pos2x = (((in_indexWidth + 1) * in_tileWidth) / in_targetWidth) * 2.0 - 1.0;
	pos2y = (((in_indexHeight + 0) * in_tileHeight) / in_targetHeight) * 2.0 - 1.0;
	pos3x = (((in_indexWidth + 0) * in_tileWidth) / in_targetWidth) * 2.0 - 1.0;
	pos3y = (((in_indexHeight + 1) * in_tileHeight) / in_targetHeight) * 2.0 - 1.0;
	pos4x = (((in_indexWidth + 1) * in_tileWidth) / in_targetWidth) * 2.0 - 1.0;
	pos4y = (((in_indexHeight + 1) * in_tileHeight) / in_targetHeight) * 2.0 - 1.0;

	switch (in_tile){
		default:
		case 0:
			return false;
		case 1://0001 //m_tileOneCorner
			colorMaskX = 1; colorMaskY = 0; colorMaskZ = 0;
			break;
		case 2://0010 //m_tileOneCorner //rotateUv90
			colorMaskX = 1; colorMaskY = 0; colorMaskZ = 0;
			rot = 90;
			break;
		case 3://0011 //m_tileTwoCorner
			colorMaskX = 0; colorMaskY = 1; colorMaskZ = 0;
			break;
		case 4://0100 //m_tileOneCorner //rotateUv270
			colorMaskX = 1; colorMaskY = 0; colorMaskZ = 0;
			rot = 270;
			break;
		case 5://0101 //m_tileTwoCorner //rotateUv90
			colorMaskX = 0; colorMaskY = 1; colorMaskZ = 0;
			rot = 270;
			break;
		case 6://0110 //m_tileSolid
			colorMaskX = 0; colorMaskY = 0; colorMaskZ = 1;
			break;
		case 7://0111 //m_tileSolid
			colorMaskX = 0; colorMaskY = 0; colorMaskZ = 1;
			break;
		case 8: //1000 //m_tileOneCorner //rotate180
			colorMaskX = 1; colorMaskY = 0; colorMaskZ = 0;
			rot = 180;
			break;
		case 9://1001 //m_tileSolid
			colorMaskX = 0; colorMaskY = 0; colorMaskZ = 1;
			break;
		case 10://1010 //m_tileTwoCorner //rotate270
			colorMaskX = 0; colorMaskY = 1; colorMaskZ = 0;
			rot = 90;
			break;
		case 11://1011 //m_tileSolid
			colorMaskX = 0; colorMaskY = 0; colorMaskZ = 1;
			break;
		case 12://1100 //m_tileTwoCorner //rotate180
			colorMaskX = 0; colorMaskY = 1; colorMaskZ = 0;
			rot = 180;
			break;
		case 13://1101 //m_tileSolid
			colorMaskX = 0; colorMaskY = 0; colorMaskZ = 1;
			break;
		case 14://1110 //m_tileSolid
			colorMaskX = 0; colorMaskY = 0; colorMaskZ = 1;
			break;
		case 15://1111 //m_tileSolid
			colorMaskX = 0; colorMaskY = 0; colorMaskZ = 1;
			break;
	}

	switch (rot){
	default:
	case 0:
		uv1x = 0; uv1y = 0;
		uv2x = 1; uv2y = 0;
		uv3x = 0; uv3y = 1;
		uv4x = 1; uv4y = 1;
		break;
	case 90:
		uv1x = 1; uv1y = 0;
		uv2x = 1; uv2y = 1;
		uv3x = 0; uv3y = 0;
		uv4x = 0; uv4y = 1;
		break;
	case 180:
		uv1x = 1; uv1y = 1;
		uv2x = 0; uv2y = 1;
		uv3x = 1; uv3y = 0;
		uv4x = 0; uv4y = 0;
		break;
	case 270:
		uv1x = 0; uv1y = 1;
		uv2x = 0; uv2y = 0;
		uv3x = 1; uv3y = 1;
		uv4x = 1; uv4y = 0;
		break;
	}

	addVertex(inout_posDataArray, inout_uvDataArray, inout_colorMaskDataArray, pos1x, pos1y, uv1x, uv1y, colorMaskX, colorMaskY, colorMaskZ);
	addVertex(inout_posDataArray, inout_uvDataArray, inout_colorMaskDataArray, pos2x, pos2y, uv2x, uv2y, colorMaskX, colorMaskY, colorMaskZ);
	addVertex(inout_posDataArray, inout_uvDataArray, inout_colorMaskDataArray, pos3x, pos3y, uv3x, uv3y, colorMaskX, colorMaskY, colorMaskZ);

	addVertex(inout_posDataArray, inout_uvDataArray, inout_colorMaskDataArray, pos3x, pos3y, uv3x, uv3y, colorMaskX, colorMaskY, colorMaskZ);
	addVertex(inout_posDataArray, inout_uvDataArray, inout_colorMaskDataArray, pos2x, pos2y, uv2x, uv2y, colorMaskX, colorMaskY, colorMaskZ);
	addVertex(inout_posDataArray, inout_uvDataArray, inout_colorMaskDataArray, pos4x, pos4y, uv4x, uv4y, colorMaskX, colorMaskY, colorMaskZ);
	return true;
}

const updateModel = function(in_webGLState, in_model, in_screenWidth, in_screenHeight, in_tileWidth, in_tileHeight, m_cellData, in_timeDelta){
	const tileWidthCount = Math.ceil(in_screenWidth / in_tileWidth);
	const tileHeightCount = Math.ceil(in_screenHeight / in_tileHeight);

	var change = false;
	for (var index = 0; index < ((tileWidthCount + 1) * (tileHeightCount + 1)); ++index){
		if (index < inout_cellData.length){
			var state = inout_cellData[index];
			var holdTime = (true === state) ? sHoldTime * sSolidChance : sHoldTime;
			if (Math.random() < (2.0 * in_timeDelta)){
				state = (false === state);
				inout_cellData[index] = state;
				change = true;
			}
		} else {
			change = true;
			inout_cellData.push(Math.random() < sSolidChance);
		}
	}

	if (false === change){
		return;
	}

	const posDataArray = []; //Float32Array
	const uvDataArray = []; //Uint8Array
	const colourMaskDataArray = []; //Uint8Array
	const elementCount = makeModelData(posDataArray, uvDataArray, colourMaskDataArray, tileWidthCount, tileHeightCount);

	in_model.setElementCount(elementCount);
	in_model.getDataStream("a_position").updateData(in_webGLState, posDataArray);
	in_model.getDataStream("a_uv").updateData(in_webGLState, uvDataArray);
	in_model.getDataStream("a_colourMask").updateData(in_webGLState, colourMaskDataArray);

	return;
}

const makeModelData = function(in_posDataArray, in_uvDataArray, in_colourMaskDataArray, in_tileWidthCount, in_tileHeightCount){
	var elementCount = 0;
	for (var indexHeight = 0; indexHeight < in_tileHeightCount; ++indexHeight){
		for (var indexWidth = 0; indexWidth < in_tileWidthCount; ++indexWidth){
			var tile = 0;

			//	1 ---- 2
			//	|	   |
			//	|	   |
			//	3 ---- 4
			// cell data is from bottom left
			tile += (inout_cellData[(indexWidth + 0) + (indexHeight * (tileWidthCount + 1))]) ? 4 : 0;
			tile += (inout_cellData[(indexWidth + 1) + (indexHeight * (tileWidthCount + 1))]) ? 8 : 0;
			tile += (inout_cellData[(indexWidth + 0) + ((indexHeight + 1) * (tileWidthCount + 1))]) ? 1 : 0;
			tile += (inout_cellData[(indexWidth + 1) + ((indexHeight + 1) * (tileWidthCount + 1))]) ? 2 : 0;
			if (true === addTile(in_posDataArray, in_uvDataArray, in_colourMaskDataArray, indexWidth, indexHeight, tile, in_screenWidth, in_screenHeight, in_tileWidth, in_tileHeight)){
				elementCount += 6;
			}
		}
	}
	return elementCount;
}

const makeModel = function(in_webGLState, in_screenWidth, in_screenHeight, in_tileWidth, in_tileHeight, inout_cellData){
	const tileWidthCount = Math.ceil(in_screenWidth / in_tileWidth);
	const tileHeightCount = Math.ceil(in_screenHeight / in_tileHeight);

	for (var index = 0; index < ((tileWidthCount + 1) * (tileHeightCount + 1)); ++index){
		//inout_cellData.push(Math.random() < 0.33);
		inout_cellData.push(Math.random() < sSolidChance);
	}

	const posDataArray = []; //Float32Array
	const uvDataArray = []; //Uint8Array
	const colourMaskDataArray = []; //Uint8Array
	const elementCount = makeModelData(posDataArray, uvDataArray, colourMaskDataArray, tileWidthCount, tileHeightCount);

	const m_posDataStream = WebGL.ModelDataStream.factory("FLOAT", 2, new Float32Array(posDataArray), "STATIC_DRAW", false);
	const m_uvDataStream = WebGL.ModelDataStream.factory("BYTE", 2, new Uint8Array(uvDataArray), "STATIC_DRAW", false);
	const m_colourMaskDataStream = WebGL.ModelDataStream.factory("BYTE", 3, new Uint8Array(colourMaskDataArray), "STATIC_DRAW", false);

	return WebGL.ModelWrapper.factory(
		in_webGLState, 
		"TRIANGLES",
		elementCount,
		{
			"a_position" : m_posDataStream,
			"a_uv" : m_uvDataStream,
			"a_colourMask" : m_colourMaskDataStream
		}
	);
}

const factory = function(in_resourceManager, in_webGLState, in_screenWidth, in_screenHeight, in_tileWidth, in_tileHeight){
	const m_texture = KnotTexture.factoryTexture(in_webGLState);
	const m_textureAlpha = KnotAlphaTexture.factoryTexture(in_webGLState);
	const m_shader = shaderFactory(in_webGLState);
	const m_material = WebGL.MaterialWrapper.factory([m_texture, m_textureAlpha]);
	m_material.setColorMaskAlpha(true);

	const m_cellData = [];
	const m_model = makeModel(in_webGLState, in_screenWidth, in_screenHeight, in_tileWidth, in_tileHeight, m_cellData);

	const m_state = {
		"u_sampler" : 0,
		"u_samplerAlpha" : 1
	};

	const m_clearColour = Core.Colour4.factoryFloat32(0.0, 0.0, 0.0, 1.0);
	const that = Object.create({
		"update" : function(in_timeDelta){
			updateModel(in_webGLState, m_model, in_screenWidth, in_screenHeight, in_tileWidth, in_tileHeight, m_cellData, in_timeDelta);
			return;
		},
		"draw" : function(in_renderTarget){
			in_webGLState.applyRenderTarget(in_renderTarget);

			in_webGLState.clear(m_clearColour);

			in_webGLState.applyShader(m_shader, m_state);
			in_webGLState.applyMaterial(m_material);
			in_webGLState.drawModel(m_model);
		}
	});

	return that;
}

module.exports = {
	"factory" : factory
};