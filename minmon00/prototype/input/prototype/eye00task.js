import {factoryFloat32 as Colour4FactoryFloat32} from './../core/colour4.js';

export default function(in_callback, in_webGLState, in_dataState, in_timeDelta, in_keepGoing){
	return function(in_callback, in_webGLState, in_dataState, in_timeDelta, in_keepGoing){
		if (false === in_keepGoing){
			return undefined;
		}

		in_webGLState.clear(Colour4FactoryFloat32(1.0,0.0,0.0,1.0));

		return in_callback;
	};
}
