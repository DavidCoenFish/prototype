import ModelFactory from "./model.js"
import ModelAttributeFactory from "./modelattribute.js"

export default function(
	in_webGLContextWrapper
	){

	var m_fullScreenQuad = undefined;

	//public methods ==========================
	const that = Object.create({
		"createModel" : function(
			in_modeName,
			in_elementCount,
			in_mapModelAttribute,
			in_elementIndexOrUndefined
		){
			return ModelFactory(
				in_webGLContextWrapper,
				in_modeName,
				in_elementCount,
				in_mapModelAttribute,
				in_elementIndexOrUndefined
				);
		},

		"createModelAttribute" : function(
			in_typeName, //string
			in_elementsPerVertex, //int
			in_arrayData,
			in_usageName, //string //STATIC_DRAW, 
			in_normalise //bool
		){
			return ModelAttributeFactory(
				in_webGLContextWrapper,
				in_typeName, //string
				in_elementsPerVertex, //int
				in_arrayData,
				in_usageName, //string //STATIC_DRAW, 
				in_normalise //bool
				);
		},

		"getFullScreenQuad" : function(){
			if (undefined === m_fullScreenQuad){
				m_fullScreenQuad = that.createModel( "TRIANGLES", 6, {
					"a_position" : that.createModelAttribute("BYTE", 2, new Int8Array([ 
						-1,-1, -1,1, 1,-1, 
						1,-1, -1,1, 1,1]), 
						"STATIC_DRAW", false)
					});
			}
			return m_fullScreenQuad;
		},
		"destroy" : function(){
			if (undefined !== m_fullScreenQuad){
				m_fullScreenQuad.destroy();
				m_fullScreenQuad = undefined;
			}
		}
	});

	return that;
}
