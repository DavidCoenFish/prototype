const Core = require("core");
const ComponentEditFloat = require("./component-editfloat.js");
const ComponentEditVec3 = require("./component-editvec3.js");

const factory = function(
	in_document,
	in_callbackGetDistance, 
	in_callbackSetDistance,
	in_callbackGetYaw, 
	in_callbackSetYaw,
	in_callbackGetPitch, 
	in_callbackSetPitch,
	in_callbackGetRoll, 
	in_callbackSetRoll,
	in_callbackGetPosX, 
	in_callbackSetPosX,
	in_callbackGetPosY, 
	in_callbackSetPosY,
	in_callbackGetPosZ, 
	in_callbackSetPosZ,
	in_posMinimumOrUdefined,
	in_posMaximumOrUdefined,
	in_posStepOrUdefined,
	in_minDistanceOrUndefined, 
	in_maxDistanceOrUndefined, 
	in_stepDistanceOrUndefined
	){

	var m_div = in_document.createElement("DIV");

	var m_distance = ComponentEditFloat.factory(
		in_document, 
		"distance",
		in_callbackGetDistance, 
		in_callbackSetDistance,
		in_minDistanceOrUndefined, 
		in_maxDistanceOrUndefined, 
		in_stepDistanceOrUndefined);
	m_div.appendChild(m_distance.getElement());

	var m_yaw = ComponentEditFloat.factory(
		in_document, 
		"yaw",
		in_callbackGetYaw, 
		in_callbackSetYaw,
		-360.0, 
		360.0, 
		1.0);
	m_div.appendChild(m_yaw.getElement());

	var m_pitch = ComponentEditFloat.factory(
		in_document, 
		"pitch",
		in_callbackGetPitch, 
		in_callbackSetPitch,
		-360.0, 
		360.0, 
		1.0);
	m_div.appendChild(m_pitch.getElement());

	var m_roll = ComponentEditFloat.factory(
		in_document, 
		"roll",
		in_callbackGetRoll, 
		in_callbackSetRoll,
		-360.0, 
		360.0, 
		1.0);
	m_div.appendChild(m_roll.getElement());

	var m_posX = ComponentEditFloat.factory(
		in_document, 
		"posX",
		in_callbackGetPosX, 
		in_callbackSetPosX,
		in_posMinimumOrUdefined,
		in_posMaximumOrUdefined,
		in_posStepOrUdefined
		);
	m_div.appendChild(m_posX.getElement());

	var m_posY = ComponentEditFloat.factory(
		in_document, 
		"posY",
		in_callbackGetPosY, 
		in_callbackSetPosY,
		in_posMinimumOrUdefined,
		in_posMaximumOrUdefined,
		in_posStepOrUdefined
		);
	m_div.appendChild(m_posY.getElement());

	var m_posZ = ComponentEditFloat.factory(
		in_document, 
		"posZ",
		in_callbackGetPosZ, 
		in_callbackSetPosZ,
		in_posMinimumOrUdefined,
		in_posMaximumOrUdefined,
		in_posStepOrUdefined
		);
	m_div.appendChild(m_posZ.getElement());



	//public methods ==========================
	const result = Object.create({
		"getElement" : function(){
			return m_div;
		},
		"orbit" : function(in_tick){
			in_callbackSetYaw(in_callbackGetYaw() + in_tick);
		}
	});

	return result;
}

const factoryDistancePosAtLeftUp = function(
	in_document,
	in_distanceDefault,
	in_distanceMinOrUndefined,
	in_distanceMaxOrUndefined,
	in_distanceStepOrUndefined,
	in_pos,
	in_at,
	in_left,
	in_up,
	in_posMinOrUndefined,
	in_posMaxOrUndefined,
	in_posStepOrUndefined
	)
{
	var m_distance = in_distanceDefault;
	var m_yaw = 0.0;
	var m_pitch = 0.0;
	var m_roll = 0.0;
	var m_origin = Core.Vector3.factoryFloat32(in_pos.getX(), in_pos.getY(), in_pos.getZ());
	const update = function(){
		var quat = Core.Quaternion.factoryYawPitchRoll(
			Core.Radians.fromDegrees(m_yaw), 
			Core.Radians.fromDegrees(m_pitch), 
			Core.Radians.fromDegrees(m_roll)
			);
		var matrix = Core.Matrix33.factoryQuaternion(quat);
		var at = matrix.getAt();
		in_at.set(at.getX(), at.getY(), at.getZ());
		var left = matrix.getLeft();
		in_left.set(left.getX(), left.getY(), left.getZ());
		var up = matrix.getUp();
		in_up.set(up.getX(), up.getY(), up.getZ());
		in_pos.set(
			m_origin.getX() + at.getX() * (-m_distance), 
			m_origin.getY() + at.getY() * (-m_distance), 
			m_origin.getZ() + at.getZ() * (-m_distance)
			);
		return;
	}
	const camera = factory(
		in_document,
		function(){ return m_distance; },
		function(in_value){ m_distance = in_value; update(); return; },
		function(){ return m_yaw; },
		function(in_value){ m_yaw = in_value; update(); return; },
		function(){ return m_pitch; },
		function(in_value){ m_pitch = in_value; update(); return; },
		function(){ return m_roll; },
		function(in_value){ m_roll = in_value; update(); return; },
		function(){ return m_origin.getX(); },
		function(in_value){ m_origin.setX(in_value); update(); return; },
		function(){ return m_origin.getY(); },
		function(in_value){ m_origin.setY(in_value); update(); return; },
		function(){ return m_origin.getZ(); },
		function(in_value){ m_origin.setZ(in_value); update(); return; },
		in_posMinOrUndefined,
		in_posMaxOrUndefined,
		in_posStepOrUndefined,
		in_distanceMinOrUndefined,
		in_distanceMaxOrUndefined,
		in_distanceStepOrUndefined
	);

	update();

	return camera;
}

module.exports = {
	"factory" : factory,
	"factoryDistancePosAtLeftUp" : factoryDistancePosAtLeftUp
};
