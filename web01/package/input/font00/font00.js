import ComponentWebGLSceneSimpleFactory from './../manipulatedom/component-webgl-scene-simple.js';
import {factoryAppendBody as componentCanvasFactory } from './../manipulatedom/component-canvas.js';
import {factoryAppend as buttonFactory}  from './../manipulatedom/button.js';
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

	var m_componentEditD = ComponentEditFloatFactory(
		document,
		"d", 
		function(){return m_dataState.u_d;}, 
		function(in_d){m_dataState.u_d = in_d; return;}, 
		0.0,
		1.0,
		0.001);
	document.body.appendChild(m_componentEditD.getElement());

	for (var index = 0; index < 9; ++index){
		var tempArray = [m_p0, m_p1, m_p2, m_p3, m_p4, m_p5, m_p6, m_p7, m_p8];
		var m_componentEditP = ComponentEditVector2Factory(document, "p" + index, tempArray[index], -1.0, 2.0, 0.01);
		document.body.appendChild(m_componentEditP.getElement());
	}

	return;
}