/* 
rename to component-move
we deal with moving something around the playfield
*/

export default function(in_moveData, in_startObjectId, in_moveSpeed, in_drawHeight, in_viewHeight){
	var m_currentObjectID = undefined;
	var m_drawPos = Vector3FactoryFloat();
	var m_viewPos = Vector3FactoryFloat();
	const setCurrentObjectID = function(in_objectID){
		if (false === (in_objectID in in_moveData)){
			return;
		}
		m_currentObjectID = in_objectID;

		var moveData = in_moveData[m_currentObjectID];
		m_drawPos.setX(moveData.pos[0]);
		m_drawPos.setY(moveData.pos[1]);
		m_drawPos.setZ(moveData.pos[2] + in_drawHeight);
		m_viewPos.setX(moveData.pos[0]);
		m_viewPos.setY(moveData.pos[1]);
		m_viewPos.setZ(moveData.pos[2] + in_viewHeight);

		return;
	}
	setCurrentObjectID(in_startObjectID);

	var m_animationArray = [];
	const requestMoveAnimation = function(in_destinationObjectID){
		if (false === (m_currentObjectID in in_moveData)){
			return;
		}
		var source = in_moveData[m_currentObjectID];

		if (false === (in_destinationObjectID in in_moveData)){
			return;
		}
		var dest = in_moveData[in_destinationObjectID];

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
		if (false === (m_currentObjectID in in_moveData)){
			return;
		}

		var moveData = in_moveData[m_currentObjectID];
		if (false === (in_code in moveData.steplink)){
			return;
		}

		requestMoveAnimation(moveData.steplink[in_code]);

		return;
	}


	//public methods ==========================
	const that = Object.create({
		"update" : function(in_timeDelta){
		},
		"requestMove" : function(in_key){
			return;
		},
		"requestDamage" : function(){
		},
		"getDrawPos" : function(){
		},
		"getViewPos" : function(){
		},
		"destroy" : function(){
			return;
		}
	})

	return that;
}
