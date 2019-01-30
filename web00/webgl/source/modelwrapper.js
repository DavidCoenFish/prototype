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
const Core = require("core");
const WebGLContextWrapperHelper = require("./webglcontextwrapperhelper.js");

const factory = function(
		in_webGLContextWrapper,
		in_modeName,
		in_elementCount,
		in_mapDataStream,
		in_elementIndexOrUndefined
		){
	const m_modeName = in_modeName;
	const m_elementCount = in_elementCount;
	const m_mapDataStream = in_mapDataStream;

	const m_elementIndexOrUndefined = in_elementIndexOrUndefined;
	var m_elementIndexHandle = undefined;
	var m_elementByteSize = undefined;
	var m_elementType = undefined;

	//public methods ==========================
	const result = Object.create({
		"draw" : function(in_webGLContextWrapper, in_mapVertexAttribute, in_firstOrUndefined, in_countOrUndefined){
			setupDraw(in_webGLContextWrapper, in_mapVertexAttribute);
			internalDraw(in_webGLContextWrapper, in_firstOrUndefined, in_countOrUndefined);
			tearDownDraw(in_webGLContextWrapper, in_mapVertexAttribute);

			return;
		},
		"destroy" : function(){
			in_webGLContextWrapper.removeResourceContextCallbacks(aquireWebGLResources, releaseWebGLResources);
		},
	});

	//private methods ==========================
	const aquireWebGLResources = function(in_webGLContextWrapper){

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
			m_elementIndexHandle = WebGLContextWrapperHelper.createBuffer(
				in_webGLContextWrapper, 
				m_elementIndexOrUndefined,
				"ELEMENT_ARRAY_BUFFER",
				"STATIC_DRAW"
				);
		}

		//free the data in the data streams
		for (var key in m_mapDataStream){
			var dataStream = m_mapDataStream[key];
			dataStream.aquireWebGLResources(in_webGLContextWrapper);
		}

		return;
	}

	const releaseWebGLResources = function(in_webGLContextWrapper){
		if (undefined !== m_elementIndexOrUndefined){
			WebGLContextWrapperHelper.deleteBuffer(in_webGLContextWrapper, m_elementIndexHandle);
			m_elementIndexHandle = undefined;
		}
		m_elementByteSize = undefined;
		m_elementType = undefined;

		//free the data in the data streams
		for (var key in m_mapDataStream){
			var dataStream = m_mapDataStream[key];
			dataStream.releaseWebGLResources(in_webGLContextWrapper);
		}

		return;
	}

	const setupDraw = function(in_webGLContextWrapper, in_mapVertexAttribute){
		//console.log("setupDraw");
		for (var key in in_mapVertexAttribute){
			//console.log("mapVertexAttribute:" + key);
			var position = in_mapVertexAttribute[key];
			if (!(key in m_mapDataStream) || (-1 === position)){ 
				continue;
			}

			var dataStream = m_mapDataStream[key];
			dataStream.setupDraw(in_webGLContextWrapper, position);
		};

		if (undefined !== m_elementIndexHandle){
			const bufferObjectType = in_webGLContextWrapper.getEnum("ELEMENT_ARRAY_BUFFER");
			in_webGLContextWrapper.callMethod("bindBuffer", bufferObjectType, m_elementIndexHandle);
		}
	}

	const internalDraw = function(in_webGLContextWrapper, in_firstOrUndefined, in_countOrUndefined){
		const first = (undefined == in_firstOrUndefined) ? 0 : in_firstOrUndefined; 
		const count = (undefined == in_countOrUndefined) ? m_elementCount : in_countOrUndefined; 
		const mode = in_webGLContextWrapper.getEnum(m_modeName);

		if (undefined === m_elementIndexHandle){
			in_webGLContextWrapper.callMethod("drawArrays", mode, first, count);
		} else {
			in_webGLContextWrapper.callMethod("drawElements", mode, count, m_elementType, first * m_elementByteSize);
		}
	}

	const tearDownDraw = function(in_webGLContextWrapper, in_mapVertexAttribute){
		//console.log("tearDownDraw");
		for (var key in in_mapVertexAttribute){
			//console.log("mapVertexAttribute:" + key);
			var position = in_mapVertexAttribute[key];
			if (!(key in m_mapDataStream) || (-1 === position))
				continue;
			var dataStream = m_mapDataStream[key];
			dataStream.tearDownDraw(in_webGLContextWrapper, position);
		};
	}

	in_webGLContextWrapper.addResourceContextCallbacks(aquireWebGLResources, releaseWebGLResources);

	return result;
}


module.exports = {
	"factory" : factory
};
