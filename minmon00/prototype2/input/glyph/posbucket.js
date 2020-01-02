import PosDataFactory from './posdata.js';

export default function(
	in_y, 
	in_height, 
	in_targetWidth,
	in_index
	){
	var m_posArray = [];

	const getTraceX = function(in_requestWidth){
		var traceX = 0;
		var count = m_posArray.length;
		for (var index = 0; index < count; index++) {
			var pos = m_posArray[index];
			if ((traceX + in_requestWidth) <= pos.x){
				break;
			}
			traceX = pos.x + pos.width;
		}
		return traceX;
	}

	const addPos = function(in_pos){
		m_posArray.push(in_pos);
		m_posArray.sort(function(lhs, rhs){
			return lhs.x - rhs.x;
		});
	}

	//public methods ==========================
	const that = Object.create({
		"getFreePos" : function(in_requestWidth, in_requestHeight){
			var traceX = getTraceX(in_requestWidth);
			var pos;
			if ((traceX + in_requestWidth) <= in_targetWidth){
				var pos = PosDataFactory(traceX, in_y, in_requestWidth, in_requestHeight, in_index, that);
				addPos(pos);
			}
			return pos;
		},
		"getFreePosForce" : function(in_requestWidth, in_requestHeight){
			var traceX = getTraceX(in_requestWidth);
			var pos = PosDataFactory(traceX, in_y, in_requestWidth, in_requestHeight, in_index, that);
			addPos(pos);
			return pos;
		},
		"removePos" : function(in_pos){
			var index = m_posArray.indexOf(in_pos);
			if (-1 === index){
				if (DEVELOPMENT){ console.error("removePos:pos not found");}
				return;
			}
			m_posArray.splice(index, 1);
			return;
		},
		"getY" : function(){
			return in_y;
		},
		"getHeight" : function(){
			return in_height;
		}
	});

	return that;
}
