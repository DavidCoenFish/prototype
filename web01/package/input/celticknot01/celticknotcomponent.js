import {factoryFloat32 as Colour4FactoryFloat32} from './../core/colour4.js';

export default function(in_resourceManager, in_webGLState, in_width, in_height, in_stepWidth, in_stepHeight){
	const backgroundColour = Colour4FactoryFloat32(1.0,1.0,1.0,1.0);

	//public methods ==========================
	const that = Object.create({
		"draw" : function(in_timeDelta){
			in_webGLState.clear(backgroundColour);
			return;
		},
	});

	return that;
}