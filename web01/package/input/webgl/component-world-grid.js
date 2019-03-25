//const Core = require("core");
import { factory as ComponentMaterialMacroPosColourFactory } from "./component-material-macro-pos-colour.js";
import { factory as ModelDataStreamFactory } from "./modeldatastream.js";
import { factory as ModelWrapperFactory } from "./modelwrapper.js";
import { factoryUnsignedByte as Colour4FactoryUnsignedByte } from "./../core/colour4.js";
import { factoryFloat32 as CoreVector3FactoryFloat32, addition as CoreVector3Addition, multiplyScalar as CoreVector3MultiplyScalar } from "./../core/vector3.js";

const sColourAxis = Colour4FactoryUnsignedByte(0, 0, 0, 255);
const sColourGridDark = Colour4FactoryUnsignedByte(0, 0, 0, 128);
const sColourGridLight = Colour4FactoryUnsignedByte(0, 0, 0, 64);

const sUnitX = CoreVector3FactoryFloat32(1.0, 0.0, 0.0); 
const sUnitY = CoreVector3FactoryFloat32(0.0, 1.0, 0.0); 
const sUnitZ = CoreVector3FactoryFloat32(0.0, 0.0, 1.0); 
const sZero = CoreVector3FactoryFloat32();

const addPoint = function(inout_posDataArray, inout_colourDataArray, in_colour, in_point){
	inout_posDataArray.push(in_point.getX());
	inout_posDataArray.push(in_point.getY());
	inout_posDataArray.push(in_point.getZ());
	inout_colourDataArray.push(in_colour.getRed());
	inout_colourDataArray.push(in_colour.getGreen());
	inout_colourDataArray.push(in_colour.getBlue());
	inout_colourDataArray.push(in_colour.getAlpha());
	return;
}

const addLine = function(inout_posDataArray, inout_colourDataArray, in_colour, in_gridStep, in_gridCount, in_axis, in_origin){
	const start = -in_gridCount / 2;
	for (var index = 0; index < in_gridCount; ++index){
		var a = (start + index) * in_gridStep;
		var b = (start + index + 1) * in_gridStep;
		var pointA = CoreVector3Addition(in_origin, CoreVector3MultiplyScalar(in_axis, a));
		var pointB = CoreVector3Addition(in_origin, CoreVector3MultiplyScalar(in_axis, b));
		addPoint(inout_posDataArray, inout_colourDataArray, in_colour, pointA);
		addPoint(inout_posDataArray, inout_colourDataArray, in_colour, pointB);
	}
	return;
}


const populateGeometry = function(inout_posDataArray, inout_colourDataArray, in_gridStep, in_gridCount){
	//make axis
	addLine(inout_posDataArray, inout_colourDataArray, sColourAxis, in_gridStep, in_gridCount + 2, sUnitX, sZero);
	addLine(inout_posDataArray, inout_colourDataArray, sColourAxis, in_gridStep, in_gridCount + 2, sUnitY, sZero);
	addLine(inout_posDataArray, inout_colourDataArray, sColourAxis, in_gridStep, in_gridCount + 2, sUnitZ, sZero);

	//make grid
	const start = ((-in_gridCount) / 2) * in_gridStep;
	for (var index = 0; index <= in_gridCount; ++index){
		if (index === in_gridCount / 2){
			continue;
		}
		var colour = ((0 === index) || (in_gridCount === index)) ? sColourGridDark : sColourGridLight;
		var originX = CoreVector3FactoryFloat32(0.0, start + (index * in_gridStep), 0.0);
		addLine(inout_posDataArray, inout_colourDataArray, colour, in_gridStep, in_gridCount, sUnitX, originX);
		var originY = CoreVector3FactoryFloat32(start + (index * in_gridStep), 0.0, 0.0);
		addLine(inout_posDataArray, inout_colourDataArray, colour, in_gridStep, in_gridCount, sUnitY, originY);
	}

	return;
}

const factoryModelWorldGrid = function(in_gridStep, in_gridCount){
	return function(in_webGLState){
		const posDataArray = []
		const colourDataArray = []

		populateGeometry(posDataArray, colourDataArray, in_gridStep, in_gridCount);

		const posDataStream = ModelDataStreamFactory(in_webGLState, "FLOAT", 3, new Float32Array(posDataArray), "STATIC_DRAW", false);
		const colourDataStream = ModelDataStreamFactory(in_webGLState, "UNSIGNED_BYTE", 4, new Uint8Array(colourDataArray), "STATIC_DRAW", true);
		return ModelWrapperFactory(
			in_webGLState, 
			"LINES",
			Math.floor(posDataArray.length / 3),
			{
				"a_position" : posDataStream,
				"a_colour" : colourDataStream
			}
			);
	};
}

export const factory = function(in_resourceManager, in_webGLState, in_state, in_gridStep, in_gridCount){
	var m_model = undefined;
	var m_modelOldName = undefined;
	var m_materialComponent = ComponentMaterialMacroPosColourFactory(in_resourceManager, in_webGLState, in_state);
	var m_material = m_materialComponent.getMaterial();
	var m_shader = m_materialComponent.getShader();

	const release = function(){
		if (undefined === m_modelOldName){
			return;
		}
		in_resourceManager.releaseCommonReference(m_modelOldName);
		m_model = undefined;
		m_modelOldName = undefined;
		return;
	}

	const updateModel = function(localGridStep, localGridCount){
		const name = "componentModelWorldGrid" + localGridStep + "_" + localGridCount;
		if (false === in_resourceManager.hasFactory(name)){
			in_resourceManager.addFactory(name, factoryModelWorldGrid(localGridStep, localGridCount));
		}

		if (m_modelOldName === name){
			return;
		}
		release();
		m_modelOldName = name;
		m_model = in_resourceManager.getCommonReference(name, in_webGLState);

		return;
	}

	updateModel(in_gridStep, in_gridCount);

	//public methods ==========================
	const that = Object.create({
		"changeGrid" : function(in_innerGridStep, in_innerGridCount){
			updateModel(in_innerGridStep, in_innerGridCount);
		},
		"draw" : function(){
			in_webGLState.applyShader(m_shader, in_state);
			in_webGLState.applyMaterial(m_material);
			in_webGLState.drawModel(m_model);
		},
		"destroy" : function(){
			release();
		}
	})

	return that;
}
