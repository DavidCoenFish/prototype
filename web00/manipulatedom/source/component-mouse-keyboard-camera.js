const Core = require("core");

const getInside = function(in_radius, in_x0, in_y0, in_x1, in_y1){
	const offsetX = in_x0 - in_x1;
	const offsetY = in_y0 - in_y1;
	const dot = (offsetX * offsetX) + (offsetY * offsetY);
	const inside = dot < (in_radius * in_radius);
	return inside;
}

const calculateRoll = function(in_x0, in_y0, in_x1, in_y1, in_originX, in_originY){
	const vectorNew = Core.Vector2.factoryFloat32(in_x0 - in_originX, in_y0 - in_originY);
	vectorNew.normaliseSelf();
	const vectorPrev = Core.Vector2.factoryFloat32(in_x1 - in_originX, in_y1 - in_originY);
	vectorPrev.normaliseSelf();
	const dot = Math.max(-1.0, Math.min(1.0, vectorNew.dotProduct(vectorPrev)));
	var cross = vectorNew.crossProduct();
	var angle = Math.acos(dot);
	angle *= Math.sign(cross.dotProduct(vectorPrev));
	//console.log(JSON.stringify([in_x0, in_y0, in_x1, in_y1]));
	//console.log("dot:" + dot + " angle:" + angle);
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
	var m_lmbDown = undefined;
	const m_keyMap = {}

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

		const lmb = (0 !== (in_event.buttons & 1));
		m_lmbDown = lmb;

		if (true === lmb){ //if in circle, do yaw and pitch, else roll
			const innerRadius = Math.min(rect.width, rect.height) * 0.45;

			const inside = getInside(innerRadius, rect.width * 0.5, rect.height * 0.5, x, y);
			if (inside){
				var yaw = calculateYawPitch(deltaX / innerRadius);
				var pitch = calculateYawPitch(deltaY / innerRadius);
			} else {
				var roll = calculateRoll(x, y, x - deltaX, y - deltaY, rect.width * 0.5, rect.height * 0.5);
			}

			update(yaw, pitch, roll);
		}

		return;
	}

	const keyDownCallback = function(in_event){
		m_keyMap[in_event.code] = 1;
		//console.log("keyDown:" + in_event.code);
		return;
	}
	const keyUpCallback = function(in_event){
		m_keyMap[in_event.code] = 0;
		//console.log("keyUp:" + in_event.code);
		return;
	}
	const anyKeyDown = function(in_keys){
		for (var index = 0; index < in_keys.length; ++index){
			var key = in_keys[index];
			if ((key in m_keyMap) && (1 === m_keyMap[key])){
				return true;
			}
		}
		return false;
	}

	//public methods ==========================
	const result = Object.create({
		"destroy" : function(){
			in_clickDragElement.removeEventListener("mousemove", mouseMoveCallback);
			in_clickDragElement.removeEventListener("keydown", keyDownCallback);
			in_clickDragElement.removeEventListener("keyup", keyUpCallback);
			return;
		},
		"tick" : function(in_timeDelta){
			if (true === m_lmbDown){
				const deltaTimeSinceLastUpdate = in_timeDelta / 10.0;
				if (true === anyKeyDown(["KeyA", "ArrowLeft"])){
					var cameraDeltaX = deltaTimeSinceLastUpdate;
				}
				if (true === anyKeyDown(["KeyD", "ArrowRight"])){
					var cameraDeltaX = -deltaTimeSinceLastUpdate;
				}
				if (true === anyKeyDown(["KeyW", "ArrowUp"])){
					var cameraDeltaZ = deltaTimeSinceLastUpdate;
				}
				if (true === anyKeyDown(["KeyS", "ArrowDown"])){
					var cameraDeltaZ = -deltaTimeSinceLastUpdate;
				}

				if (true === anyKeyDown(["KeyE", "PageUp"])){
					var cameraDeltaY = deltaTimeSinceLastUpdate;
				}
				if (true === anyKeyDown(["KeyQ", "PageDown"])){
					var cameraDeltaY = -deltaTimeSinceLastUpdate;
				}
				var yaw = undefined;
				var pitch = undefined;
				var roll = undefined;
				var cameraZoom = undefined;

				update(yaw, pitch, roll, cameraDeltaX, cameraDeltaY, cameraDeltaZ, cameraZoom);
			}
		}
	});

	in_clickDragElement.addEventListener("mousemove", mouseMoveCallback);
	in_clickDragElement.addEventListener("keydown", keyDownCallback);
	in_clickDragElement.addEventListener("keyup", keyUpCallback);

	return result;
}

module.exports = {
	"factory" : factory
};
