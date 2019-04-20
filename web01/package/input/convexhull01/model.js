
import { Base64ToUint8Array, Base64ToFloat32Array } from './../core/base64.js';
import ModelWrapperFactory from './../webgl/modelwrapper.js';
import ModelDataStream from './../webgl/modeldatastream.js';

export default function(in_webGLState){
	return ModelWrapperFactory(
		in_webGLState, "POINTS", 1, {
			"a_sphere" : ModelDataStream(in_webGLState, "FLOAT", 4, Base64ToFloat32Array("voAAAAAAAAC/AAAAP0OF8g=="), "STATIC_DRAW", false),
			"a_objectID" : ModelDataStream(in_webGLState, "BYTE", 2, Base64ToUint8Array("AAE="), "STATIC_DRAW", true),
			"a_colour0" : ModelDataStream(in_webGLState, "BYTE", 4, Base64ToUint8Array("DAwMgA=="), "STATIC_DRAW", true),
			"a_colour1" : ModelDataStream(in_webGLState, "BYTE", 4, Base64ToUint8Array("/wAAAA=="), "STATIC_DRAW", true),
			"a_plane0" : ModelDataStream(in_webGLState, "FLOAT", 4, Base64ToFloat32Array("AAAAAAAAAAA/gAAAPwAAAA=="), "STATIC_DRAW", false),
			"a_plane1" : ModelDataStream(in_webGLState, "FLOAT", 4, Base64ToFloat32Array("AAAAAAAAAAC/gAAAPwAAAA=="), "STATIC_DRAW", false),
			"a_plane2" : ModelDataStream(in_webGLState, "FLOAT", 4, Base64ToFloat32Array("P4AAAAAAAAAAAAAAPwAAAA=="), "STATIC_DRAW", false),
			"a_plane3" : ModelDataStream(in_webGLState, "FLOAT", 4, Base64ToFloat32Array("v4AAAAAAAAAAAAAAPwAAAA=="), "STATIC_DRAW", false),
			"a_plane4" : ModelDataStream(in_webGLState, "FLOAT", 4, Base64ToFloat32Array("PwAAAD9ds9cAAAAAPwAAAA=="), "STATIC_DRAW", false),
			"a_plane5" : ModelDataStream(in_webGLState, "FLOAT", 4, Base64ToFloat32Array("PwAAAL9ds9cAAAAAPwAAAA=="), "STATIC_DRAW", false),
			"a_plane6" : ModelDataStream(in_webGLState, "FLOAT", 4, Base64ToFloat32Array("vwAAAD9ds9cAAAAAPwAAAA=="), "STATIC_DRAW", false),
			"a_plane7" : ModelDataStream(in_webGLState, "FLOAT", 4, Base64ToFloat32Array("vwAAAL9ds9cAAAAAPwAAAA=="), "STATIC_DRAW", false)
		}
	);
}
