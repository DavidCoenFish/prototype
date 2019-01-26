const Core = require("core");

const getInside = function(in_radius, in_x0, in_y0, in_x1, in_y1){
	const offsetX = in_x0 - in_x1;
	const offsetY = in_y0 - in_y1;
	const dot = (offsetX * offsetX) + (offsetY * offsetY);
	const inside = dot < (in_radius * in_radius);
	return inside;
}

const claculateBoomLength = function(in_zoom){
	return (1.0 / in_zoom);
}

const calculateRoll = function(in_x0, in_y0, in_x1, in_y1, in_originX, in_originY){
	const vectorNew = Core.Vector2.factoryFloat32(in_x0 - in_originX, in_y0 - in_originY);
	vectorNew.normaliseSelf();
	const vectorPrev = Core.Vector2.factoryFloat32(in_x1 - in_originX, in_y1 - in_originY);
	vectorPrev.normaliseSelf();
	const dot = vectorNew.dotProduct(vectorPrev);
	var cross = vectorNew.crossProduct();
	var angle = Math.acos(dot);
	angle *= Math.sign(cross.dotProduct(vectorPrev));
	return angle;
}

const calculateYawPitch = function(in_delta){
	return in_delta * Math.PI * 0.5;
}

/*
in_dataServer
	getValue
		cameraOrigin
		cameraZoom
		cameraPos
		cameraAt
		cameraLeft
		cameraUp
		cameraZoom
	setValue
		cameraZoom
 */
const factory = function(in_clickDragElement, in_dataServer){
	var m_oldX = undefined;
	var m_oldY = undefined;

	const update = function(in_yawDeltaOrUndefined, in_pitchDeltaOrUndefined, in_rollDeltaOrUndefined,
		in_posXDeltaOrUndefined, in_posYDeltaOrUndefined, in_posZDeltaOrUndefined){
		//console.log(in_yawDeltaOrUndefined, in_pitchDeltaOrUndefined, in_rollDeltaOrUndefined,
		//in_posXDeltaOrUndefined, in_posYDeltaOrUndefined, in_posZDeltaOrUndefined);
		
		var doRot = false;
		var rotation = Core.Quaternion.factoryIdentity();
		if (undefined !== in_yawDeltaOrUndefined){
			doRot = true;
			const quat = Core.Quaternion.factoryAxisAngle(in_dataServer.getValue("cameraUp"), in_yawDeltaOrUndefined);
			rotation = Core.Quaternion.multiplication(rotation, quat);
		}
		if (undefined !== in_pitchDeltaOrUndefined){
			doRot = true;
			const quat = Core.Quaternion.factoryAxisAngle(in_dataServer.getValue("cameraLeft"), -in_pitchDeltaOrUndefined);
			rotation = Core.Quaternion.multiplication(rotation, quat);
		}
		if (undefined !== in_rollDeltaOrUndefined){
			doRot = true;
			const quat = Core.Quaternion.factoryAxisAngle(in_dataServer.getValue("cameraAt"), in_rollDeltaOrUndefined);
			rotation = Core.Quaternion.multiplication(rotation, quat);
		}

		if (true === doRot){
			const matrix = Core.Matrix33.factoryQuaternion(rotation);
			const localAt = Core.Matrix33.transformVector3(matrix, in_dataServer.getValue("cameraAt"));
			in_dataServer.getValue("cameraAt").set(localAt.getX(), localAt.getY(), localAt.getZ());
			const localUp = Core.Matrix33.transformVector3(matrix, in_dataServer.getValue("cameraUp"));
			in_dataServer.getValue("cameraUp").set(localUp.getX(), localUp.getY(), localUp.getZ());
			const localLeft = Core.Matrix33.transformVector3(matrix, in_dataServer.getValue("cameraLeft"));
			in_dataServer.getValue("cameraLeft").set(localLeft.getX(), localLeft.getY(), localLeft.getZ());
		}

		const origin = in_dataServer.getValue("cameraOrigin");
		if (undefined !== in_posXDeltaOrUndefined){
			var left = in_dataServer.getValue("cameraLeft");
			origin.setX(origin.getX() + (left.getX() * in_posXDeltaOrUndefined));
			origin.setY(origin.getY() + (left.getY() * in_posXDeltaOrUndefined));
			origin.setZ(origin.getZ() + (left.getZ() * in_posXDeltaOrUndefined));
		}
		
		if (undefined !== in_posYDeltaOrUndefined){
			var up = in_dataServer.getValue("cameraUp");
			origin.setX(origin.getX() + (up.getX() * in_posYDeltaOrUndefined));
			origin.setY(origin.getY() + (up.getY() * in_posYDeltaOrUndefined));
			origin.setZ(origin.getZ() + (up.getZ() * in_posYDeltaOrUndefined));
		}
		
		if (undefined !== in_posZDeltaOrUndefined){
			var at = in_dataServer.getValue("cameraAt");
			origin.setX(origin.getX() + (at.getX() * in_posZDeltaOrUndefined));
			origin.setY(origin.getY() + (at.getY() * in_posZDeltaOrUndefined));
			origin.setZ(origin.getZ() + (at.getZ() * in_posZDeltaOrUndefined));
		}

		{
			var at = in_dataServer.getValue("cameraAt");
			const pos = in_dataServer.getValue("cameraPos");
			const boomLength = claculateBoomLength(in_dataServer.getValue("cameraZoom"));

			pos.setX(origin.getX() - (at.getX() * boomLength));
			pos.setY(origin.getY() - (at.getY() * boomLength));
			pos.setZ(origin.getZ() - (at.getZ() * boomLength));
		}
	}

	update();

	const mouseMoveCallback = function(in_event){
		const rect = in_clickDragElement.getBoundingClientRect();
		const x = in_event.clientX - rect.left;
		const y = in_event.clientY - rect.top;

		const deltaX = (undefined !== m_oldX) ? x - m_oldX : 0.0;
		const deltaY = (undefined !== m_oldY) ? y - m_oldY : 0.0;
		m_oldX = x;
		m_oldY = y;

		if ((0.0 === deltaX) && (0.0 === deltaY)){
			return;
		}

		const lmb = (0 !== (in_event.buttons & 1));
		const rmb = (0 !== (in_event.buttons & 2));
		const mmb = (0 !== (in_event.buttons & 4));
		if ((false === lmb) && (false === rmb) && (false === mmb)){
			return;
		}

		const innerRadius = Math.min(rect.width, rect.height) * 0.45;

		if (true === lmb){ //if in circle, do yaw and pitch, else roll
			const inside = getInside(innerRadius, rect.width * 0.5, rect.height * 0.5, x, y);
			if (inside){
				var yaw = calculateYawPitch(deltaX / innerRadius);
				var pitch = calculateYawPitch(deltaY / innerRadius);
			} else {
				var roll = calculateRoll(x, y, x - deltaX, y - deltaY, rect.width * 0.5, rect.height * 0.5);
			}
		}

		const boomLength = claculateBoomLength(in_dataServer.getValue("cameraZoom"));
		const moveScale = boomLength / innerRadius;

		if (true === rmb){ //pan left-right or up-down
			var cameraDeltaX = deltaX * moveScale;
			var cameraDeltaY = deltaY * moveScale;
		}

		if (true === mmb){ //dolly
			var cameraDeltaZ = deltaY * moveScale;
		}

		update(yaw, pitch, roll, cameraDeltaX, cameraDeltaY, cameraDeltaZ);

		//console.log("x: " + x + " y: " + y + " buttons:" + in_event.buttons);

		return;
	}

	const wheelCallback = function(in_event){
		//console.log(in_event.deltaY);
		var zoom = in_dataServer.getValue("cameraZoom");
		if (in_event.deltaY < 0.0){
			zoom *= 0.75;
		} else if (0.0 < in_event.deltaY){
			zoom *= 1.3333333333333;
		}
		in_dataServer.setValue("cameraZoom", zoom);
		//console.log(zoom);
		update();
	}

	//public methods ==========================
	const result = Object.create({
		"destroy" : function(){
			in_clickDragElement.removeEventListener("mousemove", mouseMoveCallback);
			return;
		}
	});

	in_clickDragElement.addEventListener("mousemove", mouseMoveCallback);
	in_clickDragElement.addEventListener("wheel", wheelCallback);

	return result;
}

module.exports = {
	"factory" : factory
};
