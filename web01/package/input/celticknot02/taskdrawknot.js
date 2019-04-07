/* */
//import {roundNextPowerOfTwo} from './../core/coremath.js';
import {factoryByteRGBA as TextureWrapperFactoryByteRGBA } from './../webgl/texturewrapper.js';
import ModelWrapperFactory from './../webgl/modelwrapper.js';
import ModelDataStream from './../webgl/modeldatastream.js';
import MaterialWrapperFactory from './../webgl/materialwrapper.js';
import RenderTargetWrapperFactory from './../webgl/rendertargetwrapper.js';
import RenderTargetDataFactory from './../webgl/rendertargetdata.js';
import ShaderWrapperFactory from './../webgl/shaderwrapper.js';
import {sInt} from './../webgl/shaderuniformdata.js';



const sSolidChance = 0.3;
const sHoldTime = 50.0;

const sVertexShader = `
attribute vec2 a_position;
attribute vec2 a_uv;
attribute vec3 a_mask;
varying vec2 v_uv;
varying vec3 v_mask;
void main() {
	gl_Position = vec4(a_position.x, a_position.y, 0.0, 1.0);
	v_uv = a_uv;
	v_mask = a_mask;
}
`;
const sFragmentShader = `
precision mediump float;
varying vec2 v_uv;
varying vec3 v_mask;
uniform sampler2D u_samplerColour;
uniform sampler2D u_samplerAlpha;
void main() {
	vec4 texelValue = texture2D(u_samplerColour, v_uv);
	float value = dot(texelValue.xyz, v_mask);
	float cover = v_mask.x + v_mask.y + v_mask.z;
	float ratio = step(1.0, cover);
	value = (value * ratio) + (1.0 * (1.0 - ratio));
	vec4 texelAlpha = texture2D(u_samplerAlpha, v_uv);
	float alpha = dot(texelAlpha.xyz, v_mask);
	gl_FragColor = vec4(value, value, value, alpha);
}
`;
const sVertexAttributeNameArray = [
	"a_position", 
	"a_uv", 
	"a_mask"
];
const sUniformNameMap = {
	"u_samplerColour" : sInt,
	"u_samplerAlpha" : sInt
};

const setState = function(in_prevStateOrUndefined, in_timeDelta){
	if (undefined === in_prevStateOrUndefined){
		return (Math.random() < sSolidChance);
	}

	var holdTime = (true === in_prevStateOrUndefined) ? (in_timeDelta / sHoldTime) : (in_timeDelta / sHoldTime) * sSolidChance;
	if (Math.random() < holdTime){
		return (false === in_prevStateOrUndefined);
	}

	return in_prevStateOrUndefined;
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
const addTile = function(inout_posDataArray, inout_uvDataArray, inout_colorMaskDataArray, in_dx, in_dy, in_indexWidth, in_indexHeight, in_tile, in_targetWidth, in_targetHeight, in_tileWidth, in_tileHeight){
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

	pos1x = (((in_indexWidth + 0) * in_tileWidth + in_dx) / in_targetWidth) * 2.0 - 1.0;
	pos1y = (((in_indexHeight + 0) * in_tileHeight + in_dy) / in_targetHeight) * 2.0 - 1.0;
	pos2x = (((in_indexWidth + 1) * in_tileWidth + in_dx) / in_targetWidth) * 2.0 - 1.0;
	pos2y = (((in_indexHeight + 0) * in_tileHeight + in_dy) / in_targetHeight) * 2.0 - 1.0;
	pos3x = (((in_indexWidth + 0) * in_tileWidth + in_dx) / in_targetWidth) * 2.0 - 1.0;
	pos3y = (((in_indexHeight + 1) * in_tileHeight + in_dy) / in_targetHeight) * 2.0 - 1.0;
	pos4x = (((in_indexWidth + 1) * in_tileWidth + in_dx) / in_targetWidth) * 2.0 - 1.0;
	pos4y = (((in_indexHeight + 1) * in_tileHeight + in_dy) / in_targetHeight) * 2.0 - 1.0;

	switch (in_tile){
		default:
		case 0:
			colorMaskX = 0; colorMaskY = 0; colorMaskZ = 0;
			break;
			//return false;
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


export default function (in_resourceManager, in_webGLState, in_tileWidth, in_tileHeight) {

	var m_fullFieldArray = [];
	var m_subFieldArray = [];
	const funcUpdateGrid = function(in_fullWidth, in_fullHeight, in_dontTouchWidth, in_dontTouchHeight, in_timeDelta){
		// populate the sub grid
		const widthHalf = Math.ceil((in_fullWidth / 2) / in_tileWidth);
		const heightHalf = Math.ceil((in_fullHeight / 2) / in_tileHeight);
		const dontWidthHalf = Math.ceil((in_dontTouchWidth / 2) / in_tileWidth);
		const dontHeightHalf = Math.ceil((in_dontTouchHeight / 2) / in_tileHeight);
		for (var indexHeight = 0; indexHeight <= heightHalf; ++indexHeight){
			if (undefined === m_subFieldArray[indexHeight]){
				m_subFieldArray[indexHeight] = [];
			}
			var rowArray = m_subFieldArray[indexHeight];
			for (var indexWidth = 0; indexWidth <= widthHalf; ++indexWidth){
				var dontTouch = (((heightHalf - dontHeightHalf) < indexHeight) && ((widthHalf - dontWidthHalf) < indexWidth))
				dontTouch |= (widthHalf === indexWidth);
				dontTouch |= (heightHalf === indexHeight);
				if (true == dontTouch){
					rowArray[indexWidth] = false;
				} else {
					rowArray[indexWidth] = setState(rowArray[indexWidth], in_timeDelta);
				}
			}
		}

		//now populate the full field array (symetrical)
		const width = Math.ceil((in_fullWidth / 2) / in_tileWidth) * 2;
		const height = Math.ceil((in_fullHeight / 2) / in_tileHeight) * 2;
		for (var indexHeight = 0; indexHeight <= height; ++indexHeight){
			if (undefined === m_fullFieldArray[indexHeight]){
				m_fullFieldArray[indexHeight] = [];
			}
			var rowArray = m_fullFieldArray[indexHeight];
			for (var indexWidth = 0; indexWidth <= width; ++indexWidth){
				var subIndexWidth = (indexWidth <= widthHalf) ? indexWidth : widthHalf - (indexWidth - widthHalf);
				var subIndexHeight = (indexHeight <= heightHalf) ? indexHeight : heightHalf - (indexHeight - heightHalf);
				//invert 
				var subIndexWidth2 = widthHalf - subIndexWidth;
				var subIndexHeight2 = heightHalf - subIndexHeight;
				rowArray[indexWidth] = m_subFieldArray[subIndexHeight2][subIndexWidth2];
			}
		}
	}
	funcUpdateGrid(in_webGLState.getCanvasWidth(), in_webGLState.getCanvasHeight(), 0, 0, 0);

	const releaseModel = function(){
		if (undefined !== m_model){
			m_model.destroy();
			m_model = undefined;
		}
		return;
	}

	var m_model;
	var m_modelElementCount;
	const generateModel = function(in_fullWidth, in_fullHeight){
		const width = Math.ceil((in_fullWidth / 2) / in_tileWidth) * 2;
		const height = Math.ceil((in_fullHeight / 2) / in_tileHeight) * 2;
		var elementCount = width * height * 6;
		if (m_modelElementCount === elementCount){
			return;
		}
		var dummyPos = [];
		var dummyUv = [];
		var dummyMask = [];
		for (var index = 0; index < elementCount; ++index){
			dummyPos.push(0);
			dummyPos.push(0);
			dummyUv.push(0);
			dummyUv.push(0);
			dummyMask.push(0);
			dummyMask.push(0);
			dummyMask.push(0);
		}
		releaseModel();
		m_model = ModelWrapperFactory(in_webGLState, "TRIANGLES", elementCount, {
			"a_position" : ModelDataStream(in_webGLState, "FLOAT", 2, new Float32Array(dummyPos), "STATIC_DRAW", false),
			"a_uv" : ModelDataStream(in_webGLState, "BYTE", 2, new Int8Array(dummyUv), "STATIC_DRAW", false),
			"a_mask" : ModelDataStream(in_webGLState, "BYTE", 3, new Int8Array(dummyMask), "STATIC_DRAW", false)
		});
	}
	generateModel(in_webGLState.getCanvasWidth(), in_webGLState.getCanvasHeight());

	const updateModel = function(in_fullWidth, in_fullHeight){
		const width = Math.ceil((in_fullWidth / 2) / in_tileWidth) * 2;
		const height = Math.ceil((in_fullHeight / 2) / in_tileHeight) * 2;
		const dx = (in_fullWidth - (width * in_tileWidth)) / 2.0;
		const dy = (in_fullHeight - (height * in_tileHeight)) / 2.0;

		const posDataArray = [];
		const uvDataArray = [];
		const colorMaskDataArray = [];
		for (var indexHeight = 0; indexHeight < height; ++indexHeight){
			for (var indexWidth = 0; indexWidth < width; ++indexWidth){
				var tile = 0;

				//	1 ---- 2
				//	|	   |
				//	|	   |
				//	3 ---- 4
				// cell data is from bottom left
				tile += m_fullFieldArray[indexHeight][indexWidth] ? 4 : 0;
				tile += m_fullFieldArray[indexHeight][indexWidth + 1] ? 8 : 0;
				tile += m_fullFieldArray[indexHeight + 1][indexWidth] ? 1 : 0;
				tile += m_fullFieldArray[indexHeight + 1][indexWidth + 1] ? 2 : 0;
				addTile(posDataArray, uvDataArray, colorMaskDataArray, dx, dy, indexWidth, indexHeight, tile, in_fullWidth, in_fullHeight, in_tileWidth, in_tileHeight);
			}
		}

		m_model.getDataStream("a_position").updateData(new Float32Array(posDataArray));
		m_model.getDataStream("a_uv").updateData(new Int8Array(uvDataArray));
		m_model.getDataStream("a_mask").updateData(new Int8Array(colorMaskDataArray));

		return;
	}
	updateModel(in_webGLState.getCanvasWidth(), in_webGLState.getCanvasHeight());

	const m_shader = ShaderWrapperFactory(
		in_webGLState, 
		sVertexShader, 
		sFragmentShader, 
		sVertexAttributeNameArray, 
		sUniformNameMap);
	const m_textureColour = in_resourceManager.getCommonReference("knotColour", in_webGLState);
	const m_textureAlpha = in_resourceManager.getCommonReference("knotAlpha", in_webGLState);
	const m_material = MaterialWrapperFactory([
		m_textureColour,
		m_textureAlpha
	]);
	m_material.setColorMaskAlpha(true);

	var m_textureWidth = undefined; //roundNearestPowerOfTwo(in_width);
	var m_textureHeight = undefined; //roundNearestPowerOfTwo(in_height);
	var m_texture = undefined;
	var m_renderTargetWrapper = undefined;
	const updateTexture = function(in_textureWidth, in_textureHeight){
		if ((m_textureWidth === in_textureWidth) && (m_textureHeight === in_textureHeight)){
			return;
		}
		m_textureWidth = in_textureWidth;
		m_textureHeight = in_textureHeight;
		if (m_texture !== undefined ){
			m_texture.destroy();
		}
		m_texture = TextureWrapperFactoryByteRGBA(in_webGLState, m_textureWidth, m_textureHeight);

		if (m_renderTargetWrapper !== undefined ){
			m_renderTargetWrapper.destroy();
		}
		m_renderTargetWrapper = RenderTargetWrapperFactory(
			in_webGLState, 
			m_textureWidth, 
			m_textureHeight, 
			[RenderTargetDataFactory(m_texture, "FRAMEBUFFER", "COLOR_ATTACHMENT0", "TEXTURE_2D")]
			);
		return;
	}
	updateTexture(in_webGLState.getCanvasWidth(), in_webGLState.getCanvasHeight());

	const m_shaderUniforms = {
		"u_samplerColour" : 0,
		"u_samplerAlpha" : 1
	};
	const that = Object.create({
		"run" : function(in_state){
			const width = in_webGLState.getCanvasWidth();
			const height = in_webGLState.getCanvasHeight();
			funcUpdateGrid(width, height, in_state["dontWidth"], in_state["dontHeight"], in_state["timeDelta"]);
			generateModel(width, height);
			updateModel(width, height);
			updateTexture(width, height);

			in_webGLState.applyRenderTarget(m_renderTargetWrapper);
			//in_webGLState.applyRenderTarget();

			in_webGLState.applyShader(m_shader, m_shaderUniforms);
			in_webGLState.applyMaterial(m_material);
			in_webGLState.drawModel(m_model);

			in_state["texture"] = m_texture;
			return in_state;
		},
		"destroy" : function(){
			releaseModel();
			return;
		}
	});

	return that;
}