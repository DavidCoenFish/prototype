import { factoryFloat32 as Vector2Factory } from './../core/vector2.js'
import { factoryFloat32 as QuaternionFactory, 
	factoryIdentity as QuaternionFactoryIdentity,
	factoryAxisAngle as QuaternionFactoryAxisAngle,
	multiplication as QuaternionMultiplication
	} from './../core/quaternion.js'

const getInside = function(in_radius, in_x0, in_y0, in_x1, in_y1){
	const offsetX = in_x0 - in_x1;
	const offsetY = in_y0 - in_y1;
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
	var cross = vectorNew.crossProduct();
	var angle = Math.acos(dot);
	angle *= Math.sign(cross.dotProduct(vectorPrev));
	return angle;
}

const calculateYawPitch = function(in_delta){
	return in_delta * Math.PI * 0.5;
}

/* */
export default function(in_targetElement, inout_state){
	var m_oldX = undefined;
	var m_oldY = undefined;

	const m_cameraPos = undefinedParamHelper("u_cameraPos", inout_state, 0.0, 0.0, 0.0);
	const m_cameraAt = undefinedParamHelper("u_cameraAt", inout_state, 1.0, 0.0, 0.0);
	const m_cameraLeft = undefinedParamHelper("u_cameraLeft", inout_state, 0.0, 1.0, 0.0);
	const m_cameraUp = undefinedParamHelper("u_cameraUp", inout_state, 0.0, 0.0, 1.0);

	const update = function(in_yawDeltaOrUndefined, in_pitchDeltaOrUndefined, in_rollDeltaOrUndefined,
		in_posXDeltaOrUndefined, in_posYDeltaOrUndefined, in_posZDeltaOrUndefined){

		if ((undefined !== in_yawDeltaOrUndefined) ||
			(undefined !== in_pitchDeltaOrUndefined) ||
			(undefined !== in_rollDeltaOrUndefined)){
		
			var rotation = QuaternionFactoryIdentity();
			if (undefined !== in_yawDeltaOrUndefined){
				const quat = QuaternionFactoryAxisAngle(m_cameraUp, -in_yawDeltaOrUndefined);
				rotation = QuaternionMultiplication(rotation, quat);
			}
			if (undefined !== in_pitchDeltaOrUndefined){
				const quat = QuaternionFactoryAxisAngle(m_cameraLeft, in_pitchDeltaOrUndefined);
				rotation = QuaternionMultiplication(rotation, quat);
			}
			if (undefined !== in_rollDeltaOrUndefined){
				const quat = QuaternionFactoryAxisAngle(m_cameraAt, -in_rollDeltaOrUndefined);
				rotation = QuaternionMultiplication(rotation, quat);
			}

			{
				const matrix = Core.Matrix33.factoryQuaternion(rotation);
				const localAt = Core.Matrix33.transformVector3(matrix, m_cameraAt);
				var localLeft = Core.Matrix33.transformVector3(matrix, m_cameraLeft);
				const localUp = Core.Vector3.crossProduct(localAt, localLeft);
				localLeft = Core.Vector3.crossProduct(localLeft, localUp);

				localAt.normaliseSelf();
				localUp.normaliseSelf();
				localLeft.normaliseSelf();

				m_cameraAt.set(localAt.getX(), localAt.getY(), localAt.getZ());
				m_cameraUp.set(localUp.getX(), localUp.getY(), localUp.getZ());
				m_cameraLeft.set(localLeft.getX(), localLeft.getY(), localLeft.getZ());
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
			var cameraDeltaZ = deltaY / innerRadius;
		}

		update(yaw, pitch, roll, cameraDeltaX, cameraDeltaY, cameraDeltaZ);

		return;
	}

	//public methods ==========================
	const result = Object.create({
		"destroy" : function(){
			in_targetElement.removeEventListener("mousemove", mouseMoveCallback);
			return;
		}
	});

	in_targetElement.addEventListener("mousemove", mouseMoveCallback);

	return result;
}
