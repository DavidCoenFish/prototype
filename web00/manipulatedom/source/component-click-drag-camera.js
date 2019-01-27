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
	getCameraOrigin
	getCameraZoom
	getCameraPos
	getCameraAt
	getCameraLeft
	getCameraUp
	getCameraZoom
	setValue
	setCameraZoom
 */
const factory = function(in_clickDragElement, in_dataServer){
	var m_oldX = undefined;
	var m_oldY = undefined;

	const update = function(in_yawDeltaOrUndefined, in_pitchDeltaOrUndefined, in_rollDeltaOrUndefined,
		in_posXDeltaOrUndefined, in_posYDeltaOrUndefined, in_posZDeltaOrUndefined, in_zoomDeltaOrUndefined){
		//console.log(in_yawDeltaOrUndefined, in_pitchDeltaOrUndefined, in_rollDeltaOrUndefined,
		//in_posXDeltaOrUndefined, in_posYDeltaOrUndefined, in_posZDeltaOrUndefined);
		
		const at = in_dataServer.getCameraAt();
		const up = in_dataServer.getCameraUp();
		const left = in_dataServer.getCameraLeft();
		if ((undefined !== in_yawDeltaOrUndefined) ||
			(undefined !== in_pitchDeltaOrUndefined) ||
			(undefined !== in_rollDeltaOrUndefined) ||
			(undefined !== in_zoomDeltaOrUndefined)){
		
			var scale = (at.normaliseSelf() + up.normaliseSelf() + left.normaliseSelf()) / 3.0;
/*
			if (undefined !== in_zoomDeltaOrUndefined){
				var localScale = (1.0 + (in_zoomDeltaOrUndefined * 0.1));
				localScale = Math.max(0.1, Math.min(10.0, localScale));
				scale *= localScale;
			}
*/
			var rotation = Core.Quaternion.factoryIdentity();
			if (undefined !== in_yawDeltaOrUndefined){
				const quat = Core.Quaternion.factoryAxisAngle(up, -in_yawDeltaOrUndefined);
				rotation = Core.Quaternion.multiplication(rotation, quat);
			}
			if (undefined !== in_pitchDeltaOrUndefined){
				const quat = Core.Quaternion.factoryAxisAngle(left, in_pitchDeltaOrUndefined);
				rotation = Core.Quaternion.multiplication(rotation, quat);
			}
			if (undefined !== in_rollDeltaOrUndefined){
				const quat = Core.Quaternion.factoryAxisAngle(at, -in_rollDeltaOrUndefined);
				rotation = Core.Quaternion.multiplication(rotation, quat);
			}

			{
				const matrix = Core.Matrix33.factoryQuaternion(rotation);
				const localAt = Core.Vector3.multiplyScalar(Core.Matrix33.transformVector3(matrix, at), scale);
				at.set(localAt.getX(), localAt.getY(), localAt.getZ());
				const localUp = Core.Vector3.multiplyScalar(Core.Matrix33.transformVector3(matrix, up), scale);
				up.set(localUp.getX(), localUp.getY(), localUp.getZ());
				const localLeft = Core.Vector3.multiplyScalar(Core.Matrix33.transformVector3(matrix, left), scale);
				left.set(localLeft.getX(), localLeft.getY(), localLeft.getZ());
			}
		}

		const pos = in_dataServer.getCameraPos();
		if (undefined !== in_posXDeltaOrUndefined){
			pos.setX(pos.getX() + (left.getX() * in_posXDeltaOrUndefined));
			pos.setY(pos.getY() + (left.getY() * in_posXDeltaOrUndefined));
			pos.setZ(pos.getZ() + (left.getZ() * in_posXDeltaOrUndefined));
		}
		
		if (undefined !== in_posYDeltaOrUndefined){
			pos.setX(pos.getX() + (up.getX() * in_posYDeltaOrUndefined));
			pos.setY(pos.getY() + (up.getY() * in_posYDeltaOrUndefined));
			pos.setZ(pos.getZ() + (up.getZ() * in_posYDeltaOrUndefined));
		}
		
		if (undefined !== in_posZDeltaOrUndefined){
			pos.setX(pos.getX() + (at.getX() * in_posZDeltaOrUndefined));
			pos.setY(pos.getY() + (at.getY() * in_posZDeltaOrUndefined));
			pos.setZ(pos.getZ() + (at.getZ() * in_posZDeltaOrUndefined));
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

		if (true === rmb){ //pan left-right or up-down
			var cameraDeltaX = deltaX / innerRadius;
			var cameraDeltaY = deltaY / innerRadius;
		}

		if (true === mmb){ //dolly
			var cameraZoom = deltaX / innerRadius;
			var cameraDeltaZ = deltaY / innerRadius;
		}

		update(yaw, pitch, roll, cameraDeltaX, cameraDeltaY, cameraDeltaZ, cameraZoom);

		return;
	}

	//public methods ==========================
	const result = Object.create({
		"destroy" : function(){
			in_clickDragElement.removeEventListener("mousemove", mouseMoveCallback);
			return;
		}
	});

	in_clickDragElement.addEventListener("mousemove", mouseMoveCallback);

	return result;
}

module.exports = {
	"factory" : factory
};
