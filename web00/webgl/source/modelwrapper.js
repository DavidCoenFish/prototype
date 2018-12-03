/*
wrap the shader webgl program object, 
 */
const Core = require("core");

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

			for (var key in in_mapVertexAttribute){
				var position = in_mapVertexAttribute[key];
				if (!(key in m_mapDataStream))
					continue;

				var dataStream = m_mapDataStream[key];
				dataStream.preDraw(in_webGLContextWrapper, position);
				//webGL.BindBuffer(dataStream.m_bufferHandle, DSC.Framework.Context.WebGL.ARRAY_BUFFER);
				//webGL.EnableVertexAttribArray(position, dataStream.m_elementsPerVertex, dataStream.m_type, dataStream.m_normalise);
			};

			if (undefined !== m_elementIndexHandle){
				const elementArrayBufferEnum = in_webGLContextWrapper.
				in_webGLContextWrapper.callMethod("BindBuffer", );
				webGL.BindBuffer(in_model.m_elementIndexHandle, DSC.Framework.Context.WebGL.ELEMENT_ARRAY_BUFFER);
			}

			return;
		},
		"destroy" : function(in_webGLContextWrapper){
			in_webGLContextWrapper.removeResourceContextCallbacks(restoredCallback, lostCallback);
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
			m_elementIndexHandle = in_webGLContextMethod("createBuffer");
			const bufferObjectType = in_webGLContextWrapper.getEnum("ELEMENT_ARRAY_BUFFER");
			in_webGLContextMethod("bindBuffer", bufferObjectType, m_elementIndexHandle);
			const usage = in_webGLContextWrapper.getEnum("STATIC_DRAW");
			in_webGLContextMethod("bufferData", bufferObjectType, m_elementIndexOrUndefined, usage);
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
			in_webGLContextMethod("deleteBuffer", m_elementIndexHandle);
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

	in_webGLContextWrapper.addResourceContextCallbacks(aquireWebGLResources, releaseWebGLResources);

	return result;
}


module.exports = {
	"factory" : factory
};
