
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
import sMoveData from "./movedata.js";

export default function(
		in_viewTarget,
		in_playerPos,
		in_playerHeight,
		in_cameraAt,
		in_div,
		in_startObjectID
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

	const doMove = function(in_code){
		if (false === (m_currentObjectID in sMoveData)){
			return;
		}

		var moveData = sMoveData[m_currentObjectID];
		if (false === (in_code in moveData.steplink)){
			return;
		}

		setCurrentObjectID(moveData.steplink[in_code]);

		return;
	}

	const sStepLinkArray = ["d", "e", "w", "a", "z", "x"];
	const keyDownCallback = function(in_event){
		//var code = (undefined !== in_event.code) ? in_event.code : in_event.key;
		var code = in_event.key;
		var cameraAngleDegrees = Math.atan2(in_cameraAt.getY(), in_cameraAt.getX()) * 180.0 / Math.PI;
		var cameraAtIndex = Math.round( (cameraAngleDegrees + 360.0 - 90.0) / 60 );
		var found = undefined;
		for (var index = 0; index < sStepLinkArray.length; ++index){
			if (code === sStepLinkArray[index]){
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
