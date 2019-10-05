/*
host the animation frame request and timestamp, generate a time delta
*/

export default function(
	in_callbackUpdateOrUndefined // = function(in_timestamp, in_timeDelta), return bool continue
){
	var m_previousTimeStamp = undefined;

	const animationFrameCallback = function(in_timestamp){
		var timeDelta = 0.0;
		if (undefined !== m_previousTimeStamp){
			timeDelta = (in_timestamp - m_previousTimeStamp) / 1000.0;
		}
		m_previousTimeStamp = in_timestamp;

		if (false === in_callbackUpdateOrUndefined(in_timestamp, timeDelta)){
			return;
		}

		m_requestId = requestAnimationFrame(animationFrameCallback);
		return;
	}

	var m_requestId = undefined;
	if (undefined !== in_callbackUpdateOrUndefined)
	{
		m_requestId = requestAnimationFrame(animationFrameCallback);
	}

	const that = Object.create({
		"destroy" : function(){
			if (undefined !== m_requestId )
			{
				cancelAnimationFrame(m_requestId);
			}
			m_requestId = undefined;
		}
	});

	return that;
}
