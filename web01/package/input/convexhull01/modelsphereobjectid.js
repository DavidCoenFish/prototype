
import { Base64ToUint8Array, Base64ToFloat32Array } from './../core/base64.js';
import ModelWrapperFactory from './../webgl/modelwrapper.js';
import ModelDataStream from './../webgl/modeldatastream.js';

export default function(in_webGLState){
	return ModelWrapperFactory(
		in_webGLState, "POINTS", 4, {
			"a_sphere" : ModelDataStream(in_webGLState, "FLOAT", 4, Base64ToFloat32Array("wPgAAMDP2Jo/9MSEP4AAAEDoAADAz9iaQA1Ghj+AAADA6AAAQM/YmkANRoY/gAAAQPgAAEDP2Jo/9MSEP4AAAA=="), "STATIC_DRAW", false),
			"a_colour" : ModelDataStream(in_webGLState, "UNSIGNED_BYTE", 4, Base64ToUint8Array("/3RbHf+aeSb/mnkm/3RbHQ=="), "STATIC_DRAW", true),
			"a_objectID" : ModelDataStream(in_webGLState, "UNSIGNED_BYTE", 2, Base64ToUint8Array("AAIAEgD0AQQ="), "STATIC_DRAW", true)

		}
	);
}
