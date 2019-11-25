import {factoryFloat32 as Colour4FactoryFloat32} from './../core/colour4.js';

export default function(in_callback, in_timeDelta, in_sharedData){
	var webglState = in_sharedData.webglState;
	webglState.clear(Colour4FactoryFloat32(1.0,0.0,0.0,1.0));

	return in_callback;
}
