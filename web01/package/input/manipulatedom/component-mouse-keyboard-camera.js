import { factoryFloat32 as Vector2Factory, crossProduct as Vector2CrossProduct } from './../core/vector2.js'
import { factoryFloat32 as Vector3Factory, crossProduct as Vector3CrossProduct } from './../core/vector3.js'
import { factoryQuaternion as Matrix33FactoryQuaternion, transformVector3 as Matrix33TransformVector3 } from './../core/matrix33.js'
import { 
	factoryIdentity as QuaternionFactoryIdentity,
	factoryAxisAngle as QuaternionFactoryAxisAngle,
	multiplication as QuaternionMultiplication
	} from './../core/quaternion.js'

const getInside = function(in_radius, in_width, in_height, in_x1, in_y1){
	const offsetX = (in_width * 0.5) - in_x1;
	const aspect = in_width / in_height;
	const offsetY = (in_width * 0.5) - (in_y1 * aspect);
	const dot = (offsetX * offsetX) + (offsetY * offsetY);
	const inside = dot < (in_radius * in_radius);
	return inside;
}

const calculateRoll = function(in_x0, in_y0, in_x1, in_y1, in_originX, in_originY){
	const vectorNew = Vector2Factory(in_x0 - in_originX, in_y0 - in_originY);
	vectorNew.normaliseSelf();
	const vectorPrev = Vector2Factory(in_x1 - in_originX, in_y1 - in_originY);
	vectorPrev.normaliseSelf();
	const dot = Math.max(-1.0, Math.min(1.0, vectorNew.dotProduct(vectorPrev)));
	var cross = Vector2CrossProduct(vectorNew);
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
		result = Vector3Factory(stateValue[0], stateValue[1], stateValue[2]);
	} else {
		result = Vector3Factory(in_defaultX, in_defaultY, in_defaultZ);
	}

	inout_state[in_name] = result.getRaw();

	return result;
}

/*
 */
export default function(in_targetElement, inout_state){
	in_targetElement.tabIndex = 0;
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
		
			var rotation = QuaternionFactoryIdentity();
			if (undefined !== in_yawDeltaOrUndefined){
				const quat = QuaternionFactoryAxisAngle(m_cameraUp, in_yawDeltaOrUndefined);
				rotation = QuaternionMultiplication(rotation, quat);
			}
			if (undefined !== in_pitchDeltaOrUndefined){
				const quat = QuaternionFactoryAxisAngle(m_cameraLeft, -in_pitchDeltaOrUndefined);
				rotation = QuaternionMultiplication(rotation, quat);
			}
			if (undefined !== in_rollDeltaOrUndefined){
				const quat = QuaternionFactoryAxisAngle(m_cameraAt, -in_rollDeltaOrUndefined);
				rotation = QuaternionMultiplication(rotation, quat);
			}

			{
				const matrix = Matrix33FactoryQuaternion(rotation);
				const localAt = Matrix33TransformVector3(matrix, m_cameraAt);
				var localLeft = Matrix33TransformVector3(matrix, m_cameraLeft);
				const localUp = Vector3CrossProduct(localAt, localLeft);
				localLeft = Vector3CrossProduct(localUp, localAt);

				localAt.normaliseSelf();
				localUp.normaliseSelf();
				localLeft.normaliseSelf();

				m_cameraAt.set(localAt.getX(), localAt.getY(), localAt.getZ());
				m_cameraUp.set(localUp.getX(), localUp.getY(), localUp.getZ());
				m_cameraLeft.set(localLeft.getX(), localLeft.getY(), localLeft.getZ());

				//console.log(`update:${in_yawDeltaOrUndefined} ${in_pitchDeltaOrUndefined} ${in_rollDeltaOrUndefined}`);
				//console.log(`m_cameraPos:${m_cameraPos.getX()} ${m_cameraPos.getY()} ${m_cameraPos.getZ()}`);
				//console.log(`m_cameraAt:${m_cameraAt.getX()} ${m_cameraAt.getY()} ${m_cameraAt.getZ()}`);
				//console.log(`dot:${m_cameraAt.dotProduct(m_cameraUp)} ${m_cameraAt.dotProduct(m_cameraLeft)}`);
				//console.log(`dot:${m_cameraUp.dotProduct(m_cameraAt)} ${m_cameraAt.dotProduct(m_cameraLeft)}`);
				//console.log(`dot:${m_cameraLeft.dotProduct(m_cameraAt)} ${m_cameraAt.dotProduct(m_cameraUp)}`);
				//console.log(`length:${m_cameraAt.length()} ${m_cameraUp.length()} ${m_cameraLeft.length()}`);
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

		if (true === lmb){ //if in circle, do yaw and pitch, else roll
			const innerRadius = rect.width * 0.45;
			const inside = getInside(innerRadius, rect.width, rect.height, x, y);
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
		var code = (undefined !== in_event.code) ? in_event.code : in_event.key;
		if (undefined !== code){
			m_keyMap[code] = 1;
		}
		//console.log("keyDown code:" + code + " code:" + in_event.code + " key:" + in_event.key + " char:" + in_event.char + " charCode:" + in_event.charCode);
		return;
	}
	const keyUpCallback = function(in_event){
		var code = (undefined !== in_event.code) ? in_event.code : in_event.key;
		if (undefined !== code){
			m_keyMap[code] = 0;
		}
		//console.log("keyUp code:" + code + " code:" + in_event.code + " key:" + in_event.key + " char:" + in_event.char + " charCode:" + in_event.charCode);
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
			// in_targetElement.removeEventListener("keydown", keyDownCallback);
			// in_targetElement.removeEventListener("keyup", keyUpCallback);
			in_targetElement.ownerDocument.removeEventListener("keydown", keyDownCallback);
			in_targetElement.ownerDocument.removeEventListener("keyup", keyUpCallback);
			return;
		},
		"update" : function(in_timeDelta){
			const deltaTimeSinceLastUpdate = in_timeDelta;
			if (true === anyKeyDown(["a", "KeyA", "ArrowLeft"])){
				var cameraDeltaX = deltaTimeSinceLastUpdate;
			}
			if (true === anyKeyDown(["d", "KeyD", "ArrowRight"])){
				var cameraDeltaX = -deltaTimeSinceLastUpdate;
			}
			if (true === anyKeyDown(["w", "KeyW", "ArrowUp"])){
				var cameraDeltaZ = deltaTimeSinceLastUpdate;
			}
			if (true === anyKeyDown(["s", "KeyS", "ArrowDown"])){
				var cameraDeltaZ = -deltaTimeSinceLastUpdate;
			}

			if (true === anyKeyDown(["e", "KeyE", "PageUp"])){
				var cameraDeltaY = deltaTimeSinceLastUpdate;
			}
			if (true === anyKeyDown(["q", "KeyQ", "PageDown"])){
				var cameraDeltaY = -deltaTimeSinceLastUpdate;
			}
			var yaw = undefined;
			var pitch = undefined;
			var roll = undefined;

			update(yaw, pitch, roll, cameraDeltaX, cameraDeltaY, cameraDeltaZ);
		}
	});

	in_targetElement.addEventListener("mousemove", mouseMoveCallback);
	//in_targetElement.addEventListener("keydown", keyDownCallback);
	//in_targetElement.addEventListener("keyup", keyUpCallback);
	in_targetElement.ownerDocument.addEventListener("keydown", keyDownCallback); 
	in_targetElement.ownerDocument.addEventListener("keyup", keyUpCallback); 

	if ("focus" in in_targetElement.ownerDocument){
		in_targetElement.ownerDocument.focus();
	}

	return that;
}
