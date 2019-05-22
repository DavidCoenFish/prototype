import ShaderWrapperFactory from "./../webgl/shaderwrapper.js";
import {sInt, sFloat, sMat4, sFloat4} from "./../webgl/shaderuniformdata.js";
import MaterialWrapperFactory from "./../webgl/materialwrapper.js";
import ModelWrapperFactory from './../webgl/modelwrapper.js';
import ModelDataStream from './../webgl/modeldatastream.js';
import {factoryFloat32 as Matrix44FactoryFloat32} from './../core/matrix44.js';
import {factory as TextureFactory} from "./../webgl/texturewrapper.js";
import {Base64ToUint8Array} from './../core/base64.js';

/*
 */

const sVertexShader = `
precision mediump float;

attribute float a_index;

uniform vec4 u_cameraPanZoomAspect;
uniform float u_timeAccumulation;

uniform mat4 u_data00; //vec4(pos x,y,z,r), vec4(c1,c2?,alpha, nb),...
uniform mat4 u_data01;
uniform mat4 u_data02;
uniform mat4 u_data03;
uniform mat4 u_data04;
uniform mat4 u_data05;
uniform mat4 u_data06;
uniform mat4 u_data07;
uniform mat4 u_data08;
uniform mat4 u_data09;
uniform mat4 u_data10;
uniform mat4 u_data11;

//varying vec2 v_test;
varying vec2 v_distort;

void main() {
	//step return 0 if x < edge, 1 if edge <= x
	float ratio0 = step(-0.5, a_index) * step(a_index, 0.5);
	float ratio1 = step(0.5, a_index) * step(a_index, 1.5);
	float ratio2 = step(1.5, a_index) * step(a_index, 2.5);
	float ratio3 = step(2.5, a_index) * step(a_index, 3.5);
	float ratio4 = step(3.5, a_index) * step(a_index, 4.5);
	float ratio5 = step(4.5, a_index) * step(a_index, 5.5);
	float ratio6 = step(5.5, a_index) * step(a_index, 6.5);
	float ratio7 = step(6.5, a_index) * step(a_index, 7.5);
	float ratio8 = step(7.5, a_index) * step(a_index, 8.5);
	float ratio9 = step(8.5, a_index) * step(a_index, 9.5);
	float ratio10 = step(9.5, a_index) * step(a_index, 10.5);
	float ratio11 = step(10.5, a_index) * step(a_index, 11.5);
	float ratio12 = step(11.5, a_index) * step(a_index, 12.5);
	float ratio13 = step(12.5, a_index) * step(a_index, 13.5);
	float ratio14 = step(13.5, a_index) * step(a_index, 14.5);
	float ratio15 = step(14.5, a_index) * step(a_index, 15.5);
	float ratio16 = step(15.5, a_index) * step(a_index, 16.5);
	float ratio17 = step(16.5, a_index) * step(a_index, 17.5);
	float ratio18 = step(17.5, a_index) * step(a_index, 18.5);
	float ratio19 = step(18.5, a_index) * step(a_index, 19.5);
	float ratio20 = step(19.5, a_index) * step(a_index, 20.5);
	float ratio21 = step(20.5, a_index) * step(a_index, 21.5);
	float ratio22 = step(21.5, a_index) * step(a_index, 22.5);
	float ratio23 = step(22.5, a_index) * step(a_index, 23.5);
	float ratio24 = step(23.5, a_index) * step(a_index, 24.5);
	float ratio25 = step(24.5, a_index) * step(a_index, 25.5);
	float ratio26 = step(25.5, a_index) * step(a_index, 26.5);
	float ratio27 = step(26.5, a_index) * step(a_index, 27.5);
	float ratio28 = step(27.5, a_index) * step(a_index, 28.5);
	float ratio29 = step(28.5, a_index) * step(a_index, 29.5);
	float ratio30 = step(29.5, a_index) * step(a_index, 30.5);
	float ratio31 = step(30.5, a_index) * step(a_index, 31.5);
	float ratio32 = step(31.5, a_index) * step(a_index, 32.5);
	float ratio33 = step(32.5, a_index) * step(a_index, 33.5);
	float ratio34 = step(33.5, a_index) * step(a_index, 34.5);
	float ratio35 = step(34.5, a_index) * step(a_index, 35.5);
	float ratio36 = step(35.5, a_index) * step(a_index, 36.5);
	float ratio37 = step(36.5, a_index) * step(a_index, 37.5);
	float ratio38 = step(37.5, a_index) * step(a_index, 38.5);
	float ratio39 = step(38.5, a_index) * step(a_index, 39.5);
	float ratio40 = step(39.5, a_index) * step(a_index, 40.5);
	float ratio41 = step(40.5, a_index) * step(a_index, 41.5);
	float ratio42 = step(41.5, a_index) * step(a_index, 42.5);
	float ratio43 = step(42.5, a_index) * step(a_index, 43.5);
	float ratio44 = step(43.5, a_index) * step(a_index, 44.5);
	float ratio45 = step(44.5, a_index) * step(a_index, 45.5);
	float ratio46 = step(45.5, a_index) * step(a_index, 46.5);
	float ratio47 = step(46.5, a_index) * step(a_index, 47.5);
	float ratio48 = step(47.5, a_index) * step(a_index, 48.5);
	float ratio49 = step(48.5, a_index) * step(a_index, 49.5);
	float ratio50 = step(49.5, a_index) * step(a_index, 50.5);
	float ratio51 = step(50.5, a_index) * step(a_index, 51.5);
	float ratio52 = step(51.5, a_index) * step(a_index, 52.5);
	float ratio53 = step(52.5, a_index) * step(a_index, 53.5);
	float ratio54 = step(53.5, a_index) * step(a_index, 54.5);
	float ratio55 = step(54.5, a_index) * step(a_index, 55.5);
	float ratio56 = step(55.5, a_index) * step(a_index, 56.5);
	float ratio57 = step(56.5, a_index) * step(a_index, 57.5);
	float ratio58 = step(57.5, a_index) * step(a_index, 58.5);
	float ratio59 = step(58.5, a_index) * step(a_index, 59.5);
	float ratio60 = step(59.5, a_index) * step(a_index, 60.5);
	float ratio61 = step(60.5, a_index) * step(a_index, 61.5);
	float ratio62 = step(61.5, a_index) * step(a_index, 62.5);
	float ratio63 = step(62.5, a_index) * step(a_index, 63.5);
	float ratio64 = step(63.5, a_index) * step(a_index, 64.5);
	float ratio65 = step(64.5, a_index) * step(a_index, 65.5);
	float ratio66 = step(65.5, a_index) * step(a_index, 66.5);
	float ratio67 = step(66.5, a_index) * step(a_index, 67.5);
	float ratio68 = step(67.5, a_index) * step(a_index, 68.5);
	float ratio69 = step(68.5, a_index) * step(a_index, 69.5);
	float ratio70 = step(69.5, a_index) * step(a_index, 70.5);
	float ratio71 = step(70.5, a_index) * step(a_index, 71.5);
	float ratio72 = step(71.5, a_index) * step(a_index, 72.5);
	float ratio73 = step(72.5, a_index) * step(a_index, 73.5);
	float ratio74 = step(73.5, a_index) * step(a_index, 74.5);
	float ratio75 = step(74.5, a_index) * step(a_index, 75.5);
	float ratio76 = step(75.5, a_index) * step(a_index, 76.5);
	float ratio77 = step(76.5, a_index) * step(a_index, 77.5);
	float ratio78 = step(77.5, a_index) * step(a_index, 78.5);
	float ratio79 = step(78.5, a_index) * step(a_index, 79.5);
	float ratio80 = step(79.5, a_index) * step(a_index, 80.5);
	float ratio81 = step(80.5, a_index) * step(a_index, 81.5);
	float ratio82 = step(81.5, a_index) * step(a_index, 82.5);
	float ratio83 = step(82.5, a_index) * step(a_index, 83.5);
	float ratio84 = step(83.5, a_index) * step(a_index, 84.5);
	float ratio85 = step(84.5, a_index) * step(a_index, 85.5);
	float ratio86 = step(85.5, a_index) * step(a_index, 86.5);
	float ratio87 = step(86.5, a_index) * step(a_index, 87.5);
	float ratio88 = step(87.5, a_index) * step(a_index, 88.5);
	float ratio89 = step(88.5, a_index) * step(a_index, 89.5);
	float ratio90 = step(89.5, a_index) * step(a_index, 90.5);
	float ratio91 = step(90.5, a_index) * step(a_index, 91.5);
	float ratio92 = step(91.5, a_index) * step(a_index, 92.5);
	float ratio93 = step(92.5, a_index) * step(a_index, 93.5);
	float ratio94 = step(93.5, a_index) * step(a_index, 94.5);
	float ratio95 = step(94.5, a_index) * step(a_index, 95.5);

	// / u_cameraPanZoomAspect.w
	vec2 origin = vec2(-(u_cameraPanZoomAspect.x * 2.0), -(u_cameraPanZoomAspect.y * 2.0));
	origin += (ratio0 * u_data00[0].xy);
	origin += (ratio1 * u_data00[0].zw);
	origin += (ratio2 * u_data00[1].xy);
	origin += (ratio3 * u_data00[1].zw);
	origin += (ratio4 * u_data00[2].xy);
	origin += (ratio5 * u_data00[2].zw);
	origin += (ratio6 * u_data00[3].xy);
	origin += (ratio7 * u_data00[3].zw);

	origin += (ratio8 * u_data01[0].xy);
	origin += (ratio9 * u_data01[0].zw);
	origin += (ratio10 * u_data01[1].xy);
	origin += (ratio11 * u_data01[1].zw);
	origin += (ratio12 * u_data01[2].xy);
	origin += (ratio13 * u_data01[2].zw);
	origin += (ratio14 * u_data01[3].xy);
	origin += (ratio15 * u_data01[3].zw);

	origin += (ratio16 * u_data02[0].xy);
	origin += (ratio17 * u_data02[0].zw);
	origin += (ratio18 * u_data02[1].xy);
	origin += (ratio19 * u_data02[1].zw);
	origin += (ratio20 * u_data02[2].xy);
	origin += (ratio21 * u_data02[2].zw);
	origin += (ratio22 * u_data02[3].xy);
	origin += (ratio23 * u_data02[3].zw);

	origin += (ratio24 * u_data03[0].xy);
	origin += (ratio25 * u_data03[0].zw);
	origin += (ratio26 * u_data03[1].xy);
	origin += (ratio27 * u_data03[1].zw);
	origin += (ratio28 * u_data03[2].xy);
	origin += (ratio29 * u_data03[2].zw);
	origin += (ratio30 * u_data03[3].xy);
	origin += (ratio31 * u_data03[3].zw);

	origin += (ratio32 * u_data04[0].xy);
	origin += (ratio33 * u_data04[0].zw);
	origin += (ratio34 * u_data04[1].xy);
	origin += (ratio35 * u_data04[1].zw);
	origin += (ratio36 * u_data04[2].xy);
	origin += (ratio37 * u_data04[2].zw);
	origin += (ratio38 * u_data04[3].xy);
	origin += (ratio39 * u_data04[3].zw);

	origin += (ratio40 * u_data05[0].xy);
	origin += (ratio41 * u_data05[0].zw);
	origin += (ratio42 * u_data05[1].xy);
	origin += (ratio43 * u_data05[1].zw);
	origin += (ratio44 * u_data05[2].xy);
	origin += (ratio45 * u_data05[2].zw);
	origin += (ratio46 * u_data05[3].xy);
	origin += (ratio47 * u_data05[3].zw);

	origin += (ratio48 * u_data06[0].xy);
	origin += (ratio49 * u_data06[0].zw);
	origin += (ratio50 * u_data06[1].xy);
	origin += (ratio51 * u_data06[1].zw);
	origin += (ratio52 * u_data06[2].xy);
	origin += (ratio53 * u_data06[2].zw);
	origin += (ratio54 * u_data06[3].xy);
	origin += (ratio55 * u_data06[3].zw);

	origin += (ratio56 * u_data07[0].xy);
	origin += (ratio57 * u_data07[0].zw);
	origin += (ratio58 * u_data07[1].xy);
	origin += (ratio59 * u_data07[1].zw);
	origin += (ratio60 * u_data07[2].xy);
	origin += (ratio61 * u_data07[2].zw);
	origin += (ratio62 * u_data07[3].xy);
	origin += (ratio63 * u_data07[3].zw);


	origin += (ratio64 * u_data08[0].xy);
	origin += (ratio65 * u_data08[0].zw);
	origin += (ratio66 * u_data08[1].xy);
	origin += (ratio67 * u_data08[1].zw);
	origin += (ratio68 * u_data08[2].xy);
	origin += (ratio69 * u_data08[2].zw);
	origin += (ratio70 * u_data08[3].xy);
	origin += (ratio71 * u_data08[3].zw);

	origin += (ratio72 * u_data09[0].xy);
	origin += (ratio73 * u_data09[0].zw);
	origin += (ratio74 * u_data09[1].xy);
	origin += (ratio75 * u_data09[1].zw);
	origin += (ratio76 * u_data09[2].xy);
	origin += (ratio77 * u_data09[2].zw);
	origin += (ratio78 * u_data09[3].xy);
	origin += (ratio79 * u_data09[3].zw);

	origin += (ratio80 * u_data10[0].xy);
	origin += (ratio81 * u_data10[0].zw);
	origin += (ratio82 * u_data10[1].xy);
	origin += (ratio83 * u_data10[1].zw);
	origin += (ratio84 * u_data10[2].xy);
	origin += (ratio85 * u_data10[2].zw);
	origin += (ratio86 * u_data10[3].xy);
	origin += (ratio87 * u_data10[3].zw);

	origin += (ratio88 * u_data11[0].xy);
	origin += (ratio89 * u_data11[0].zw);
	origin += (ratio90 * u_data11[1].xy);
	origin += (ratio91 * u_data11[1].zw);
	origin += (ratio92 * u_data11[2].xy);
	origin += (ratio93 * u_data11[2].zw);
	origin += (ratio94 * u_data11[3].xy);
	origin += (ratio95 * u_data11[3].zw);

	gl_Position = vec4(origin.x, origin.y + (50.0 / 512.0), origin.y, 1.0);

	gl_PointSize = 100.0;
	//v_test = vec2(a_index / 8.0, a_index);

	v_distort = vec2(sin(u_timeAccumulation + origin.x + origin.y), origin.x);
}
`;

const sFragmentShader = `
precision mediump float;
uniform sampler2D u_samplerColour;
uniform sampler2D u_samplerData;
//varying vec2 v_test;
varying vec2 v_distort; //wind ajust horizontal, object origin y

vec2 testLookup(vec2 in_lookup, vec2 in_distort, vec4 in_sampleDataLeft, vec4 in_sampleDataRight, float in_deltaLeft, float in_deltaRight){
	float leftDistort = ((in_sampleDataLeft.y * in_distort.x) * 2.5 / 100.0) + (in_sampleDataLeft.x * in_distort.y * 4.0 / 50.0) + in_deltaLeft;
	float rightDistort = ((in_sampleDataRight.y * in_distort.x) * 2.5 / 100.0) + (in_sampleDataRight.x * in_distort.y * 4.0 / 50.0) + in_deltaRight;

	if ((leftDistort < 0.0) && (0.0 < rightDistort)){
		if (0.0 < in_lookup.x){
			float offset = rightDistort - leftDistort;
			float ratio = -leftDistort / offset;
			return vec2(0.0, in_deltaLeft + (ratio * (in_deltaRight - in_deltaLeft)));
		}
		return in_lookup;
	}

	if ((rightDistort < 0.0) && (0.0 < leftDistort)){
		if (0.0 < in_lookup.x){
			float offset = leftDistort - rightDistort;
			float ratio = -rightDistort / offset;
			return vec2(0.0, in_deltaRight + (ratio * (in_deltaLeft - in_deltaRight)));
		}
		return in_lookup;
	}

	if (leftDistort == rightDistort){
		if (abs(leftDistort) < in_lookup.x){
			return vec2(abs(leftDistort), (in_deltaLeft + in_deltaRight) * 0.5);
		}
		return in_lookup;
	}

	return in_lookup;
}

float evalueDelta(vec4 sampleData, float in_delta){
	return in_delta + ((sampleData.y * in_distort.x) * 4.0 / 100.0) + (sampleData.x * in_distort.y * 28.0 / 100.0);
}

float seekBestSamplePoint(float oldX){
	vec4 sampleData = texture2D(u_samplerData, gl_PointCoord + vec2(oldX, 0.0));
	float result = evalueDelta(sampleData, oldX);
	//X(n+1) = Xn - F(Xn)/F'(Xn)

	float oldXDelta = oldX + (1.0 / 256.0);
	vec4 sampleDataDelta = texture2D(u_samplerData, gl_PointCoord + vec2(oldXDelta, 0.0));
	float resultDelta = evalueDelta(sampleData, oldXDelta);
	float rateOfChange = (resultDelta - result) / (oldXDelta - oldX);

	float newX = srcDelta - ((result / rateOfChange) * 0.75);
	return newX; 
}



void main() {
	float lookup = 0.0;
	lookup = seekBestSamplePoint(lookup);
	lookup = seekBestSamplePoint(lookup);
	lookup = seekBestSamplePoint(lookup);
	lookup = seekBestSamplePoint(lookup);

	vec2 samplePoint = gl_PointCoord + vec2(lookup, 0.0);
	vec4 sampleColour = texture2D(u_samplerColour, samplePoint);
	if (sampleColour.w <= 0.0){
		discard;
	}

	gl_FragColor = sampleColour;
}
`;

const sVertexAttributeNameArray = [
	"a_index",
];
const sUniformNameMap = {
	"u_cameraPanZoomAspect" : sFloat4,
	"u_timeAccumulation" : sFloat,
	"u_samplerColour" : sInt,
	"u_samplerData" : sInt,
	"u_data00" : sMat4,
	"u_data01" : sMat4,
	"u_data02" : sMat4,
	"u_data03" : sMat4,
	"u_data04" : sMat4,
	"u_data05" : sMat4,
	"u_data06" : sMat4,
	"u_data07" : sMat4,
	"u_data08" : sMat4,
	"u_data09" : sMat4,
	"u_data10" : sMat4,
	"u_data11" : sMat4
};


export default function(in_webGLState, in_state, in_textureData, in_textureDataData){
	const m_texture = TextureFactory(
		in_webGLState,
		256, 
		256, 
		Base64ToUint8Array(in_textureData),
		false,
		"RGBA",
		"RGBA",
		"UNSIGNED_BYTE",
		"LINEAR",
		"LINEAR",
		"REPEAT",
		"REPEAT"
		);
	const m_textureData = TextureFactory(
		in_webGLState,
		256, 
		256, 
		Base64ToUint8Array(in_textureDataData),
		false,
		"RGBA",
		"RGBA",
		"UNSIGNED_BYTE",
		"LINEAR",
		"LINEAR",
		"REPEAT",
		"REPEAT"
		);

	var m_textureArray = [m_texture, m_textureData];
	const m_material = MaterialWrapperFactory(
		m_textureArray,
		undefined,
		undefined,
		true, //in_blendModeEnabledOrUndefined,
		"SRC_ALPHA", //in_sourceBlendEnumNameOrUndefined,
		"ONE_MINUS_SRC_ALPHA", //"ONE",  //in_destinationBlendEnumNameOrUndefined,
		true,
		"ALWAYS" //
	);
	const m_shader = ShaderWrapperFactory(in_webGLState, sVertexShader, sFragmentShader, sVertexAttributeNameArray, sUniformNameMap);
	const m_model = ModelWrapperFactory(
		in_webGLState, "POINTS", 96, {
			"a_index" : ModelDataStream(in_webGLState, "UNSIGNED_BYTE", 1, new Uint8Array([
				0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25,
				26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50,
				51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75,
				76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99
			]), "STATIC_DRAW", false)
		}, undefined);

	var m_data = [];
	for (var index = 0; index < 13; ++index){
		m_data.push(Matrix44FactoryFloat32());
	}

	const m_state = {
		"u_samplerColour" : 0,
		"u_samplerData" : 1,
		"u_cameraPanZoomAspect" : in_state.u_cameraPanZoomAspect,
		"u_data00" : m_data[0].getRaw(),
		"u_data01" : m_data[1].getRaw(),
		"u_data02" : m_data[2].getRaw(),
		"u_data03" : m_data[3].getRaw(),
		"u_data04" : m_data[4].getRaw(),
		"u_data05" : m_data[5].getRaw(),
		"u_data06" : m_data[6].getRaw(),
		"u_data07" : m_data[7].getRaw(),
		"u_data08" : m_data[8].getRaw(),
		"u_data09" : m_data[9].getRaw(),
		"u_data10" : m_data[10].getRaw(),
		"u_data11" : m_data[11].getRaw(),
	};

	//public methods ==========================
	const result = Object.create({
		"run" : function(){
			if (false === ("m_treeArray" in in_state)){
				return;
			}

			m_state.u_timeAccumulation = in_state.u_timeAccumulation;

			var treeArray = in_state.m_treeArray;
			var arrayCount = treeArray.length;

			in_webGLState.applyMaterial(m_material);

			var trace = 0;
			var drawCount = 0;
			while (trace < arrayCount){
				var innerTrace = 0;
				var dataIndex = 0;
				var dataSubIndex = 0;

				while ((innerTrace < 96) && (trace < arrayCount)){
					var dataRaw = m_data[dataIndex].getRaw();
					dataRaw[dataSubIndex + 0] = treeArray[trace].x;
					dataRaw[dataSubIndex + 1] = treeArray[trace].y;
					dataSubIndex += 2;
					if (16 <= dataSubIndex){
						dataSubIndex = 0;
						dataIndex += 1;
					}

					trace++;
					innerTrace++;
					drawCount = innerTrace;
				}

				in_webGLState.applyShader(m_shader, m_state);
				in_webGLState.drawModel(m_model, 0, drawCount);
			}

			return;
		},
		"destroy" : function(){
			m_shader.destroy();
			m_model.destroy();
			return;
		}
	});

	return result;

}
