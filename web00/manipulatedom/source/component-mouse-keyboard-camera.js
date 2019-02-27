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
	var cross = Core.Vector2.crossProduct(vectorNew);
	var angle = Math.acos(dot);
	angle *= Math.sign(cross.dotProduct(vectorPrev));
	//console.log(JSON.stringify([in_x0, in_y0, in_x1, in_y1]));
	//console.log("dot:" + dot + " angle:" + angle);
	return angle;
}

const calculateYawPitch = function(in_delta){
	return in_delta * Math.PI * 0.5;
}

const undefinedParamHelper = function(in_name, inout_state, in_defaultX, in_defaultY, in_defaultZ){
	var result = undefined;
	if (in_name in inout_state){
		var stateValue = inout_state[in_name];
		result = Core.Vector3.factoryFloat32(stateValue[0], stateValue[1], stateValue[2]);
	}
	result = Core.Vector3.factoryFloat32(in_defaultX, in_defaultY, in_defaultZ);

	inout_state[in_name] = result.getRaw();

	return result;
}

/*
 */
const factory = function(in_targetElement, inout_state){
	in_targetElement.tabIndex = 0;
	var m_lmbDown = undefined;
	const m_keyMap = {}
	var m_oldX = undefined;
	var m_oldY = undefined;

	const m_cameraPos = undefinedParamHelper("u_cameraPos", inout_state, 0.0, 0.0, 0.0);
	const m_cameraAt = undefinedParamHelper("u_cameraAt", inout_state, 1.0, 0.0, 0.0);
	const m_cameraLeft = undefinedParamHelper("u_cameraLeft", inout_state, 0.0, 1.0, 0.0);
	const m_cameraUp = undefinedParamHelper("u_cameraUp", inout_state, 0.0, 0.0, 1.0);
	
	const update = function(in_yawDeltaOrUndefined, in_pitchDeltaOrUndefined, in_rollDeltaOrUndefined,
		in_posXDeltaOrUndefined, in_posYDeltaOrUndefined, in_posZDeltaOrUndefined){

		//console.log(`update:${in_yawDeltaOrUndefined} ${in_pitchDeltaOrUndefined} ${in_rollDeltaOrUndefined}
		//${in_posXDeltaOrUndefined} ${in_posYDeltaOrUndefined} ${in_posZDeltaOrUndefined}`);

		if ((undefined !== in_yawDeltaOrUndefined) ||
			(undefined !== in_pitchDeltaOrUndefined) ||
			(undefined !== in_rollDeltaOrUndefined)){
		
			var rotation = Core.Quaternion.factoryIdentity();
			if (undefined !== in_yawDeltaOrUndefined){
				const quat = Core.Quaternion.factoryAxisAngle(m_cameraUp, -in_yawDeltaOrUndefined);
				rotation = Core.Quaternion.multiplication(rotation, quat);
			}
			if (undefined !== in_pitchDeltaOrUndefined){
				const quat = Core.Quaternion.factoryAxisAngle(m_cameraLeft, in_pitchDeltaOrUndefined);
				rotation = Core.Quaternion.multiplication(rotation, quat);
			}
			if (undefined !== in_rollDeltaOrUndefined){
				const quat = Core.Quaternion.factoryAxisAngle(m_cameraAt, -in_rollDeltaOrUndefined);
				rotation = Core.Quaternion.multiplication(rotation, quat);
			}

			{
				const matrix = Core.Matrix33.factoryQuaternion(rotation);
				const localAt = Core.Matrix33.transformVector3(matrix, m_cameraAt);
				var localLeft = Core.Matrix33.transformVector3(matrix, m_cameraLeft);
				const localUp = Core.Vector3.crossProduct(localAt, localLeft);
				localLeft = Core.Vector3.crossProduct(localUp, localAt);

				localAt.normaliseSelf();
				localUp.normaliseSelf();
				localLeft.normaliseSelf();

				m_cameraAt.set(localAt.getX(), localAt.getY(), localAt.getZ());
				m_cameraUp.set(localUp.getX(), localUp.getY(), localUp.getZ());
				m_cameraLeft.set(localLeft.getX(), localLeft.getY(), localLeft.getZ());

				//console.log(`update:${in_yawDeltaOrUndefined} ${in_pitchDeltaOrUndefined} ${in_rollDeltaOrUndefined}`);
				//console.log(`m_cameraAt:${m_cameraAt.getX()} ${m_cameraAt.getY()} ${m_cameraAt.getZ()}`);
			}
		}

		if (undefined !== in_posXDeltaOrUndefined){
			m_cameraPos.setX(m_cameraPos.getX() + (m_cameraLeft.getX() * in_posXDeltaOrUndefined));
			m_cameraPos.setY(m_cameraPos.getY() + (m_cameraLeft.getY() * in_posXDeltaOrUndefined));
			m_cameraPos.setZ(m_cameraPos.getZ() + (m_cameraLeft.getZ() * in_posXDeltaOrUndefined));
		}
		
		if (undefined !== in_posYDeltaOrUndefined){
			m_cameraPos.setX(m_cameraPos.getX() + (m_cameraUp.getX() * in_posYDeltaOrUndefined));
			m_cameraPos.setY(m_cameraPos.getY() + (m_cameraUp.getY() * in_posYDeltaOrUndefined));
			m_cameraPos.setZ(m_cameraPos.getZ() + (m_cameraUp.getZ() * in_posYDeltaOrUndefined));
		}
		
		if (undefined !== in_posZDeltaOrUndefined){
			m_cameraPos.setX(m_cameraPos.getX() + (m_cameraAt.getX() * in_posZDeltaOrUndefined));
			m_cameraPos.setY(m_cameraPos.getY() + (m_cameraAt.getY() * in_posZDeltaOrUndefined));
			m_cameraPos.setZ(m_cameraPos.getZ() + (m_cameraAt.getZ() * in_posZDeltaOrUndefined));
		}
	}

	update();

	const mouseMoveCallback = function(in_event){
		const rect = in_targetElement.getBoundingClientRect();
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
	const that = Object.create({
		"destroy" : function(){
			in_targetElement.removeEventListener("mousemove", mouseMoveCallback);
			in_targetElement.removeEventListener("keydown", keyDownCallback);
			in_targetElement.removeEventListener("keyup", keyUpCallback);
			return;
		},
		"tick" : function(in_timeDelta){
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

			update(yaw, pitch, roll, cameraDeltaX, cameraDeltaY, cameraDeltaZ);
		}
	});

	in_targetElement.addEventListener("mousemove", mouseMoveCallback);
	in_targetElement.addEventListener("keydown", keyDownCallback);
	in_targetElement.addEventListener("keyup", keyUpCallback);

	return that;
}

module.exports = {
	"factory" : factory
};
