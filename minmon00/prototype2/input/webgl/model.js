/*
wrap the shader webgl program object, 

mode name
	POINTS: Draws a single dot.
	LINE_STRIP: Draws a straight line to the next vertex.
	LINE_LOOP: Draws a straight line to the next vertex, and connects the last vertex back to the first.
	LINES: Draws a line between a pair of vertices.
	TRIANGLE_STRIP
	TRIANGLE_FAN
	TRIANGLES: Draws a triangle for a group of three vertices

 */

export default function(
	in_webGLContextWrapper,
	in_modeName,
	in_elementCount,
	in_mapModelAttribute,
	in_elementIndexOrUndefined
	){
	const m_elementIndexOrUndefined = in_elementIndexOrUndefined;
	var m_elementIndexHandle = undefined;
	var m_elementByteSize = undefined;
	var m_elementType = undefined;

	//public methods ==========================
	const that = Object.create({
		"draw" : function(in_mapVertexAttribute, in_firstOrUndefined, in_countOrUndefined){
			setupDraw(in_mapVertexAttribute);
			internalDraw(in_firstOrUndefined, in_countOrUndefined);
			tearDownDraw(in_mapVertexAttribute);
			return;
		},
		"setElementCount" : function(in_newElementCount){
			in_elementCount = in_newElementCount;
			return;
		},
		"getDataStream" : function(in_name){
			if (in_name in in_mapModelAttribute){
				return in_mapModelAttribute[in_name];
			}
			return undefined;
		},
		"destroy" : function(){
			in_webGLState.removeResourceContextCallbacks(aquireWebGLResources, releaseWebGLResources);

			for (var key in in_mapModelAttribute){
				var dataStream = in_mapModelAttribute[key];
				dataStream.destroy();
			}

			return;
		},
	});

	//private methods ==========================
	const aquireWebGLResources = function(){

		if (m_elementIndexOrUndefined instanceof Uint8Array) {
			m_elementByteSize = 1;
			m_elementType = in_webGLContextWrapper.getEnum("UNSIGNED_BYTE");
		}
		else if (m_elementIndexOrUndefined instanceof Uint16Array) {
			m_elementByteSize = 2;
			m_elementType = in_webGLContextWrapper.getEnum("UNSIGNED_SHORT");
		}
		else if (m_elementIndexOrUndefined instanceof Uint32Array) {
			m_elementByteSize = 4;
			m_elementType = in_webGLContextWrapper.getEnum("UNSIGNED_INT");
		}

		if (undefined !== m_elementIndexOrUndefined) {
			m_elementIndexHandle = in_webGLState.createBuffer();
			in_webGLState.updateBuffer(
				m_elementIndexHandle,
				m_elementIndexOrUndefined,
				"ELEMENT_ARRAY_BUFFER",
				"STATIC_DRAW"
				);
		}

		return;
	}

	const releaseWebGLResources = function(){
		if (undefined !== m_elementIndexOrUndefined){
			in_webGLState.deleteBuffer(m_elementIndexHandle);
			m_elementIndexHandle = undefined;
		}
		m_elementByteSize = undefined;
		m_elementType = undefined;

		return;
	}

	const setupDraw = function(in_mapVertexAttribute){
		//console.log("setupDraw");
		for (var key in in_mapVertexAttribute){
			//console.log("mapVertexAttribute:" + key);
			var position = in_mapVertexAttribute[key];
			if (!(key in in_mapModelAttribute) || (-1 === position)){ 
				//in_webGLContextWrapper.callMethod("disableVertexAttribArray", in_position);
				continue;
			}

			var dataStream = in_mapModelAttribute[key];
			dataStream.setupDraw(position);
		};

		if (undefined !== m_elementIndexHandle){
			const bufferObjectType = in_webGLContextWrapper.getEnum("ELEMENT_ARRAY_BUFFER");
			in_webGLContextWrapper.callMethod("bindBuffer", bufferObjectType, m_elementIndexHandle);
		}
	}

	const internalDraw = function(in_firstOrUndefined, in_countOrUndefined){
		const first = (undefined == in_firstOrUndefined) ? 0 : in_firstOrUndefined; 
		const count = (undefined == in_countOrUndefined) ? in_elementCount : in_countOrUndefined; 
		const mode = in_webGLContextWrapper.getEnum(in_modeName);

		if (undefined === m_elementIndexHandle){
			in_webGLContextWrapper.callMethod("drawArrays", mode, first, count);
		} else {
			in_webGLContextWrapper.callMethod("drawElements", mode, count, m_elementType, first * m_elementByteSize);
		}
	}

	const tearDownDraw = function(in_mapVertexAttribute){
		//console.log("tearDownDraw");
		for (var key in in_mapVertexAttribute){
			//console.log("mapVertexAttribute:" + key);
			var position = in_mapVertexAttribute[key];
			if (!(key in in_mapModelAttribute) || (-1 === position))
				continue;
			var dataStream = in_mapModelAttribute[key];
			dataStream.tearDownDraw(position);
		};
	}

	in_webGLContextWrapper.addResourceContextCallbacks(aquireWebGLResources, releaseWebGLResources);

	return that;
}
