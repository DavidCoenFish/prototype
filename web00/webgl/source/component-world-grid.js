const Core = require("core");
const ComponentMaterialMacroPosColourLine = require("./component-material-macro-pos-colour-line.js");
const ModelDataStream = require("./modeldatastream.js");
const ModelWrapper = require("./modelwrapper.js");


const sColourAxis = Core.Colour4.factoryUnsignedByte(0, 0, 0, 255);
const sColourGridDark = Core.Colour4.factoryUnsignedByte(0, 0, 0, 128);
const sColourGridLight = Core.Colour4.factoryUnsignedByte(0, 0, 0, 64);

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
		var pointA = Core.Vector3.addition(in_origin, Core.Vector3.multiplyScalar(in_axis, a));
		var pointB = Core.Vector3.addition(in_origin, Core.Vector3.multiplyScalar(in_axis, b));
		addPoint(inout_posDataArray, inout_colourDataArray, in_colour, pointA);
		addPoint(inout_posDataArray, inout_colourDataArray, in_colour, pointB);
	}
	return;
}


const populateGeometry = function(inout_posDataArray, inout_colourDataArray, in_gridStep, in_gridCount){
	//make axis
	addLine(inout_posDataArray, inout_colourDataArray, sColourAxis, in_gridStep, in_gridCount + 2, Core.Vector3.sUnitX, Core.Vector3.sZero);
	addLine(inout_posDataArray, inout_colourDataArray, sColourAxis, in_gridStep, in_gridCount + 2, Core.Vector3.sUnitY, Core.Vector3.sZero);
	addLine(inout_posDataArray, inout_colourDataArray, sColourAxis, in_gridStep, in_gridCount + 2, Core.Vector3.sUnitZ, Core.Vector3.sZero);

	//make grid
	const start = ((-in_gridCount) / 2) * in_gridStep;
	for (var index = 0; index <= in_gridCount; ++index){
		if (index === in_gridCount / 2){
			continue;
		}
		var colour = ((0 === index) || (in_gridCount === index)) ? sColourGridDark : sColourGridLight;
		var originX = Core.Vector3.factoryFloat32(0.0, start + (index * in_gridStep), 0.0);
		addLine(inout_posDataArray, inout_colourDataArray, colour, in_gridStep, in_gridCount, Core.Vector3.sUnitX, originX);
		var originY = Core.Vector3.factoryFloat32(start + (index * in_gridStep), 0.0, 0.0);
		addLine(inout_posDataArray, inout_colourDataArray, colour, in_gridStep, in_gridCount, Core.Vector3.sUnitY, originY);
	}

	return;
}

const factoryModelWorldGrid = function(in_gridStep, in_gridCount){
	return function(in_webGLContextWrapper){
		const posDataArray = []
		const colourDataArray = []

		populateGeometry(posDataArray, colourDataArray, in_gridStep, in_gridCount);

		const posDataStream = ModelDataStream.factory("FLOAT", 3, new Float32Array(posDataArray), "STATIC_DRAW", false);
		const colourDataStream = ModelDataStream.factory("UNSIGNED_BYTE", 4, new Uint8Array(colourDataArray), "STATIC_DRAW", true);
		return ModelWrapper.factory(
			in_webGLContextWrapper, 
			"LINES",
			Math.floor(posDataArray.length / 3),
			{
				"a_position" : posDataStream,
				"a_colour" : colourDataStream
			}
			);
	};
}

const factory = function(in_resourceManager, in_webGLState, in_state, in_gridStep, in_gridCount){
	var m_model = undefined;
	var m_modelOldName = undefined;
	var m_materialComponent = ComponentMaterialMacroPosColourLine.factory(in_resourceManager, in_webGLState, in_state);
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
	const result = Object.create({
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

	return result;
}

module.exports = {
	"factory" : factory
}