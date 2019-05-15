import ComponentWebGLSceneSimpleFactory from './../manipulatedom/component-webgl-scene-simple.js';
import {factoryAppendBody as componentCanvasFactory } from './../manipulatedom/component-canvas.js';
import {factoryAppend as buttonFactory}  from './../manipulatedom/button.js';
import {factoryAppend as selectFactory} from "./../manipulatedom/select.js";
import {factoryFloat32 as Vector2factoryFloat32} from "./../core/vector2.js";
import ComponentEditVector2Factory from "./../manipulatedom/component-editvec2";
import {factory as ComponentEditFloatFactory} from "./../manipulatedom/component-editfloat.js";
import Task from './task.js';

/*
the data of the font is going to end up living in a shader, 
so doens't need to be packed into a matix (with last 4th segment being linear)

the aim with this package is to make a font editor, displaying one character for reference, and one as editable
each glyph gets 4 continuious (start/ end shared) quadratic bezier curves 
 */
export default function () {

	const m_canvaseElementWrapper = componentCanvasFactory(document, {
		"width" : "512px",
		"height" : "512px",
		"backgroundColor" : "#000000",
		"margin" : "0",
		"padding" : "0",
		"display" : "block"
	});
	const m_canvasElement = m_canvaseElementWrapper.getElement();
	document.body.appendChild(m_canvasElement);
	var m_task = Task;

	var m_previousTimeStamp = undefined;
	var m_keepGoing = true;
	var m_fontDataIndex = 1;
	var m_fontDataIndexReference = 0;

	var m_fontData = [
		[//0
			0.375, 0.5, 0.375, 0.75, 0.5, 0.75,
			0.625, 0.75, 0.625, 0.5,
			0.625, 0.25, 0.5, 0.25,
			0.375, 0.25, 0.375, 0.5,
		],
		[//1
			0.43700000643730164, 0.675000011920929, 0.47999998927116394, 0.699999988079071, 0.5, 0.75, 
			0.5, 0.5, 0.5, 0.25, 
			0.5, 0.25, 0.4000000059604645, 0.25, 
			0.5, 0.25, 0.6000000238418579, 0.25,
		],
		[//2
			0.40, 0.67, 0.5, 0.79, 0.58, 0.71, 
			0.65, 0.62, 0.52, 0.52, 
			0.41, 0.46, 0.375, 0.25, 
			0.5, 0.25, 0.625, 0.25, 
		],
		[//3
			0.4000000059604645, 0.6700000166893005, 0.5, 0.7900000214576721, 0.5799999833106995, 0.7099999785423279, 
			0.6499999761581421, 0.6200000047683716, 0.5199999809265137, 0.5199999809265137, 
			0.6499999761581421, 0.3799999952316284, 0.5799999833106995, 0.28999999165534973, 
			0.5, 0.20999999344348907, 0.4000000059604645, 0.28999999165534973,
		],
		[//4
			0.5299999713897705, 0.25, 0.5299999713897705, 0.5, 0.5299999713897705, 0.75, 
			0.375, 0.625, 0.375, 0.5, 
			0.5, 0.5, 0.625, 0.5, 
			0.625, 0.5, 0.625, 0.5, 
		],
		[//5
			0.5600000023841858, 0.75, 0.5199999809265137, 0.75, 0.4699999988079071, 0.75, 
			0.44999998807907104, 0.6600000262260437, 0.4300000071525574, 0.5199999809265137, 
			0.5799999833106995, 0.5799999833106995, 0.6000000238418579, 0.4099999964237213, 
			0.6100000143051147, 0.20000000298023224, 0.41999998688697815, 0.25999999046325684, 
		],
		[//6
			0.550000011920929, 0.75, 0.44999998807907104, 0.5899999737739563, 0.4099999964237213, 0.46000000834465027, 
			0.375, 0.25, 0.5, 0.25, 
			0.5899999737739563, 0.25, 0.6000000238418579, 0.375, 
			0.5899999737739563, 0.5899999737739563, 0.4300000071525574, 0.5149999856948853, 
		],
		[//7
			0.41, 0.75, 0.5, 0.74, 0.59, 0.75, 
			0.5, 0.5, 0.5, 0.25, 
			0.5, 0.25, 0.5, 0.25, 
			0.5, 0.25, 0.5, 0.25,
		],
		[//8
			0.5, 0.5199999809265137, 0.3199999928474426, 0.7300000190734863, 0.5, 0.75, 
			0.6800000071525574, 0.7300000190734863, 0.5, 0.5199999809265137, 
			0.3100000023841858, 0.25999999046325684, 0.5, 0.25, 
			0.6899999976158142, 0.25999999046325684, 0.5, 0.5299999713897705, 
		],
		[//9
			0.44999998807907104, 0.25, 0.550000011920929, 0.4100000262260437, 0.5900000333786011, 0.5399999618530273, 
			0.625, 0.75, 0.5, 0.75, 
			0.4100000262260437, 0.75, 0.3999999761581421, 0.625, 
			0.4100000262260437, 0.4100000262260437, 0.5699999928474426, 0.48500001430511475, 
		]
	];

	const getFontData = function(index, v0, v1, v2, v3, v4, v5, v6, v7, v8){
		var src = m_fontData[index];
		v0.setX(src[0]);
		v0.setY(src[1]);
		v1.setX(src[2]);
		v1.setY(src[3]);
		v2.setX(src[4]);
		v2.setY(src[5]);
		v3.setX(src[6]);
		v3.setY(src[7]);
		v4.setX(src[8]);
		v4.setY(src[9]);
		v5.setX(src[10]);
		v5.setY(src[11]);
		v6.setX(src[12]);
		v6.setY(src[13]);
		v7.setX(src[14]);
		v7.setY(src[15]);
		v8.setX(src[16]);
		v8.setY(src[17]);
		return;
	}

	const setFontData = function(index, v0, v1, v2, v3, v4, v5, v6, v7, v8){
		var dest = m_fontData[index];
		dest[0] = v0.getX();
		dest[1] = v0.getY();
		dest[2] = v1.getX();
		dest[3] = v1.getY();
		dest[4] = v2.getX();
		dest[5] = v2.getY();
		dest[6] = v3.getX();
		dest[7] = v3.getY();
		dest[8] = v4.getX();
		dest[9] = v4.getY();
		dest[10] = v5.getX();
		dest[11] = v5.getY();
		dest[13] = v6.getX();
		dest[14] = v6.getY();
		dest[15] = v7.getX();
		dest[16] = v7.getY();
		dest[17] = v8.getX();
		dest[18] = v8.getY();
		return;
	}

	const logToConsolePointData = function(v0, v1, v2, v3, v4, v5, v6, v7, v8){
		var message = `
			${v0.getX()}, ${v0.getY()}, ${v1.getX()}, ${v1.getY()}, ${v2.getX()}, ${v2.getY()}, 
			${v3.getX()}, ${v3.getY()}, ${v4.getX()}, ${v4.getY()}, 
			${v5.getX()}, ${v5.getY()}, ${v6.getX()}, ${v6.getY()}, 
			${v7.getX()}, ${v7.getY()}, ${v8.getX()}, ${v8.getY()}, 
		`;
		console.log(message);
	}

	const hFlip = function(v0, v1, v2, v3, v4, v5, v6, v7, v8){
		v0.setX(1.0 - v0.getX());
		v1.setX(1.0 - v1.getX());
		v2.setX(1.0 - v2.getX());
		v3.setX(1.0 - v3.getX());
		v4.setX(1.0 - v4.getX());
		v5.setX(1.0 - v5.getX());
		v6.setX(1.0 - v6.getX());
		v7.setX(1.0 - v7.getX());
		v8.setX(1.0 - v8.getX());
	}

	const vFlip = function(v0, v1, v2, v3, v4, v5, v6, v7, v8){
		v0.setY(1.0 - v0.getY());
		v1.setY(1.0 - v1.getY());
		v2.setY(1.0 - v2.getY());
		v3.setY(1.0 - v3.getY());
		v4.setY(1.0 - v4.getY());
		v5.setY(1.0 - v5.getY());
		v6.setY(1.0 - v6.getY());
		v7.setY(1.0 - v7.getY());
		v8.setY(1.0 - v8.getY());
	}

	//task can do the shader packing, we are just marshalling data
	var m_p0 = Vector2factoryFloat32();
	var m_p1 = Vector2factoryFloat32();
	var m_p2 = Vector2factoryFloat32();
	var m_p3 = Vector2factoryFloat32();
	var m_p4 = Vector2factoryFloat32();
	var m_p5 = Vector2factoryFloat32();
	var m_p6 = Vector2factoryFloat32();
	var m_p7 = Vector2factoryFloat32();
	var m_p8 = Vector2factoryFloat32();
	var m_r0 = Vector2factoryFloat32();
	var m_r1 = Vector2factoryFloat32();
	var m_r2 = Vector2factoryFloat32();
	var m_r3 = Vector2factoryFloat32();
	var m_r4 = Vector2factoryFloat32();
	var m_r5 = Vector2factoryFloat32();
	var m_r6 = Vector2factoryFloat32();
	var m_r7 = Vector2factoryFloat32();
	var m_r8 = Vector2factoryFloat32();
	var m_dataState = {
		"u_d" : 0.01,
		"u_p0" : m_p0.getRaw(),
		"u_p1" : m_p1.getRaw(),
		"u_p2" : m_p2.getRaw(),

		"u_p3" : m_p3.getRaw(),
		"u_p4" : m_p4.getRaw(),

		"u_p5" : m_p5.getRaw(),
		"u_p6" : m_p6.getRaw(),

		"u_p7" : m_p7.getRaw(),
		"u_p8" : m_p8.getRaw(),

		"u_r0" : m_r0.getRaw(),
		"u_r1" : m_r1.getRaw(),
		"u_r2" : m_r2.getRaw(),

		"u_r3" : m_r3.getRaw(),
		"u_r4" : m_r4.getRaw(),

		"u_r5" : m_r5.getRaw(),
		"u_r6" : m_r6.getRaw(),

		"u_r7" : m_r7.getRaw(),
		"u_r8" : m_r8.getRaw(),

	};
	const callback = function(in_timestamp){
		if (undefined === m_task){
			if (undefined !== m_scene){
				m_scene.destroy();
				m_scene = undefined;
			}
			m_webGLState = undefined;
			return false;
		}
		//m_fps.update(in_timestamp);
		var timeDelta = 0.0;
		if (undefined !== m_previousTimeStamp){
			timeDelta = (in_timestamp - m_previousTimeStamp) / 1000.0;
		}
		m_previousTimeStamp = in_timestamp;
		m_task = m_task(m_task, m_webGLState, m_dataState, timeDelta, m_keepGoing);
		return true;
	}

	var m_scene = ComponentWebGLSceneSimpleFactory(
		callback, 
		m_canvasElement, 
		false, 
		false, 
		false, 
		[], 
		true );
	var m_webGLState = m_scene.getWebGLState();

	buttonFactory(document, document.body, "stop", function(){
		console.log("stop");
		m_keepGoing = false;
	}, {
		"position": "absolute",
		"left": "10px",
		"top": "10px",
		"width": "32px", 
		"height": "32px"
	});

	const refreshEdit = function(){
		for (var index = 0; index < m_componentEditArray.length; ++index){
			m_componentEditArray[index].refresh();
		}
	}

	selectFactory(document, document.body, ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"], function(in_index, in_value){
		console.log("change:" + in_index + " " + in_value);
		getFontData(in_index, m_p0, m_p1, m_p2, m_p3, m_p4, m_p5, m_p6, m_p7, m_p8);
		refreshEdit();
	});

	selectFactory(document, document.body, ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"], function(in_index, in_value){
		console.log("change:" + in_index + " " + in_value);
		getFontData(in_index, m_r0, m_r1, m_r2, m_r3, m_r4, m_r5, m_r6, m_r7, m_r8);
	});

	buttonFactory(document, document.body, "log", function(){
		logToConsolePointData(m_p0, m_p1, m_p2, m_p3, m_p4, m_p5, m_p6, m_p7, m_p8);
		return;
	});
	buttonFactory(document, document.body, "flip h", function(){
		hFlip(m_p0, m_p1, m_p2, m_p3, m_p4, m_p5, m_p6, m_p7, m_p8);
		refreshEdit();
		return;
	});
	buttonFactory(document, document.body, "flip v", function(){
		vFlip(m_p0, m_p1, m_p2, m_p3, m_p4, m_p5, m_p6, m_p7, m_p8);
		refreshEdit();
		return;
	});

	buttonFactory(document, document.body, "get index", function(){
		getFontData(m_fontDataIndex, m_p0, m_p1, m_p2, m_p3, m_p4, m_p5, m_p6, m_p7, m_p8);
		return;
	});
	buttonFactory(document, document.body, "set index", function(){
		setFontData(m_fontDataIndex, m_p0, m_p1, m_p2, m_p3, m_p4, m_p5, m_p6, m_p7, m_p8);
		return;
	});

	var m_componentEditD = ComponentEditFloatFactory(
		document,
		"d", 
		function(){return m_dataState.u_d;}, 
		function(in_d){m_dataState.u_d = in_d; return;}, 
		0.0,
		1.0,
		0.0005);
	document.body.appendChild(m_componentEditD.getElement());

	var m_componentEditArray = [];
	for (var index = 0; index < 9; ++index){
		var tempArray = [m_p0, m_p1, m_p2, m_p3, m_p4, m_p5, m_p6, m_p7, m_p8];
		var componentEditP = ComponentEditVector2Factory(document, "p" + index, tempArray[index], -1.0, 2.0, 0.01);
		document.body.appendChild(componentEditP.getElement());
		m_componentEditArray.push(componentEditP);
	}

	return;
}