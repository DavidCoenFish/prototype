
import { Base64ToUint8Array, Base64ToFloat32Array } from './../core/base64.js';
import ModelWrapperFactory from './../webgl/modelwrapper.js';
import ModelDataStream from './../webgl/modeldatastream.js';

export default function(in_webGLState){
	return ModelWrapperFactory(
		in_webGLState, "POINTS", 4, {
			"a_sphere" : ModelDataStream(in_webGLState, "FLOAT", 4, Base64ToFloat32Array("wLgAAMCYa6RAOnckP4Pwe0CoAADAmGukQDBLxD+D8HvAqAAAQJhrpEAwS8Q/g/B7QLgAAECYa6RAOnckP4Pwew=="), "STATIC_DRAW", false),
			"a_cylinder" : ModelDataStream(in_webGLState, "FLOAT", 4, Base64ToFloat32Array("AAAAAAAAAAA/gAAAP4AAAAAAAAAAAAAAP4AAAD+AAAAAAAAAAAAAAD+AAAA/gAAAAAAAAAAAAAA/gAAAP4AAAA=="), "STATIC_DRAW", false),
			"a_colour" : ModelDataStream(in_webGLState, "UNSIGNED_BYTE", 4, Base64ToUint8Array("TTkigE05IoBNOSKATTkigA=="), "STATIC_DRAW", true),
			"a_objectID" : ModelDataStream(in_webGLState, "UNSIGNED_BYTE", 2, Base64ToUint8Array("ACYAMgDYAOQ="), "STATIC_DRAW", true)

		}
	);
}
