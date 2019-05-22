
/*
our job is to capture input as to move player
we update viewTarget and playerPos

keyboard
q, w, e, r, t, 
 a, s, d, f, g, 
  z, x, c, v, b, 

use w,e, a,d, z, x?
move data has interp type ["step", "linear"
 */
//import sMoveData from "./movedata.js";

export default function(
		in_viewTarget,
		in_playerPos,
		in_playerHeight,
		in_cameraAt,
		in_div,
		in_startObjectID,
		in_moveData
	){
	var m_currentObjectID = undefined;
	const setCurrentObjectID = function(in_objectID){
		if (false === (in_objectID in sMoveData)){
			return;
		}
		m_currentObjectID = in_objectID;

		var moveData = sMoveData[m_currentObjectID];
		in_playerPos.setX(moveData.pos[0]);
		in_playerPos.setY(moveData.pos[1]);
		in_playerPos.setZ(moveData.pos[2] + in_playerHeight);
		in_viewTarget.setX(moveData.pos[0]);
		in_viewTarget.setY(moveData.pos[1]);
		in_viewTarget.setZ(moveData.pos[2] + (in_playerHeight * 1.5));

		return;
	}
	setCurrentObjectID(in_startObjectID);

	var m_animationArray = [];
	const requestMoveAnimation = function(in_destinationObjectID){
		if (false === (m_currentObjectID in sMoveData)){
			return;
		}
		var source = sMoveData[m_currentObjectID];

		if (false === (in_destinationObjectID in sMoveData)){
			return;
		}
		var dest = sMoveData[in_destinationObjectID];

		m_animationArray.push({
			"accumulator" : 0.0,
			"startPos" : source.pos,
			"destPos" : dest.pos,
			"startObjectID" : m_currentObjectID
		});
		m_currentObjectID = in_destinationObjectID;
		return;
	}

	const doMove = function(in_code){
		if (false === (m_currentObjectID in sMoveData)){
			return;
		}

		var moveData = sMoveData[m_currentObjectID];
		if (false === (in_code in moveData.steplink)){
			return;
		}

		//setCurrentObjectID(moveData.steplink[in_code]);
		requestMoveAnimation(moveData.steplink[in_code]);

		return;
	}

	const sStepLinkArray = ["d", "e", "w", "a", "z", "x"];
	const sInputKeyArray = ["d", "e", "w", "q", "a", "s"];
	const keyDownCallback = function(in_event){
		//var code = (undefined !== in_event.code) ? in_event.code : in_event.key;
		var code = in_event.key;
		var cameraAngleDegrees = Math.atan2(in_cameraAt.getY(), in_cameraAt.getX()) * 180.0 / Math.PI;
		var cameraAtIndex = Math.round( (cameraAngleDegrees + 360.0 - 90.0) / 60 );
		var found = undefined;
		for (var index = 0; index < sStepLinkArray.length; ++index){
			if (code === sInputKeyArray[index]){
				found = index;
				break;
			}
		}
		if (undefined === found){
			return;
		}
		var index = (found + cameraAtIndex) % 6;

		doMove(sStepLinkArray[index]);
		return;
	}
	const keyUpCallback = function(in_event){
		//var code = (undefined !== in_event.code) ? in_event.code : in_event.key;
		return;
	}

	//public methods ==========================
	const result = Object.create({
		"update" : function(in_timeDelta){
			// "accumulator" : 0.0,
			// "startPos" : source.pos,
			// "destPos" : dest.pos,
			// "startObjectID" : m_currentObjectID
			if (0 < m_animationArray.length){
				var animData = m_animationArray[0];
				animData.accumulator += (in_timeDelta * 2.0);
				var ratio = Math.min(1.0, animData.accumulator);

				var x = animData.startPos[0] + (ratio * (animData.destPos[0] - animData.startPos[0]));
				var y = animData.startPos[1] + (ratio * (animData.destPos[1] - animData.startPos[1]));
				var z = animData.startPos[2] + (ratio * (animData.destPos[2] - animData.startPos[2]));

				in_viewTarget.setX(x);
				in_viewTarget.setY(y);
				in_viewTarget.setZ(z + (in_playerHeight * 1.5));

				var offsetX = animData.destPos[0] - animData.startPos[0];
				var offsetY = animData.destPos[1] - animData.startPos[1];
				var offsetZ = animData.destPos[2] - animData.startPos[2];
				var d1 = Math.sqrt((offsetX * offsetX) + (offsetY * offsetY));
				var totalDistance = d1 + Math.abs(offsetZ);
				var currentProgress = totalDistance * ratio;

				if (currentProgress < (d1 * 0.5)){
					var stepRatio = (currentProgress / (d1 * 0.5)) * 0.5;
					x = animData.startPos[0] + (stepRatio * (animData.destPos[0] - animData.startPos[0]));
					y = animData.startPos[1] + (stepRatio * (animData.destPos[1] - animData.startPos[1]));
					z = animData.startPos[2];
				} else if (currentProgress < ((d1 * 0.5) + Math.abs(offsetZ))){
					var stepRatio = (currentProgress - (d1 * 0.5)) / Math.abs(offsetZ);
					x = (animData.startPos[0] + animData.destPos[0]) * 0.5;
					y = (animData.startPos[1] + animData.destPos[1]) * 0.5;
					z = animData.startPos[2] + (stepRatio * (animData.destPos[2] - animData.startPos[2]));
				} else {
					var start = currentProgress - ((d1 * 0.5) + (Math.abs(offsetZ)));
					var stepRatio = ((start / (d1 * 0.5)) * 0.5) + 0.5;
					x = animData.startPos[0] + (stepRatio * (animData.destPos[0] - animData.startPos[0]));
					y = animData.startPos[1] + (stepRatio * (animData.destPos[1] - animData.startPos[1]));
					z = animData.destPos[2];
				}

				in_playerPos.setX(x);
				in_playerPos.setY(y);
				in_playerPos.setZ(z + in_playerHeight);

				if (1.0 <= animData.accumulator){
					m_animationArray.shift();
				}
			}
		},
		"destroy" : function(){
			in_div.ownerDocument.removeEventListener("keydown", keyDownCallback);
			in_div.ownerDocument.removeEventListener("keyup", keyUpCallback);

			return;
		}
	});

	in_div.ownerDocument.addEventListener("keydown", keyDownCallback); 
	in_div.ownerDocument.addEventListener("keyup", keyUpCallback); 

	if ("focus" in in_div.ownerDocument){
		in_div.ownerDocument.focus();
	}

	return result;

}
