
export default function(
	in_webGLApi
	){

	var m_fullScreenQuad = undefined;

	//public methods ==========================
	const that = Object.create({
		"getFullScreenQuad" : function(){
			if (undefined === m_fullScreenQuad){
				m_fullScreenQuad = in_webGLApi.createModel( "TRIANGLES", 6, {
					"a_position" : in_webGLApi.createModelAttribute("BYTE", 2, new Int8Array([ 
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
