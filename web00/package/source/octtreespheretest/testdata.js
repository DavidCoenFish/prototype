const Core = require("core");
const WebGL = require("webgl");
/*
do the sphere check before de-refferencing the uv (miss sphere more common case?)
do uv as stream, with sphere radius of zero as null terminator
and uv vec2(0,0) as no node reference?
allow [node/ child stream] to run over end of texture width (increment y)

//presume each pixel is 4 floats
data = [
0:	uv step x, step y, pad0, pad1, 
1:	sphere x, y, z, radius, //root sphere
2:	[node/ child stream]
	
	[node/ child stream]
r+0:	sphere0 x, y, z, radius, 
r+1:	uv0.x, uv0.y, pad0, pad1, // uv of the start of a new [node/ child stream]
r+2:	sphere1 x, y, z, radius, 
r+3:	uv1.x, uv1.y, pad0, pad1,
		...
r+n:	null sphere x, y, z, 0.0, //null terminate child stream with zero radius

		zero uv indicates no [node/ child stream] reference, 
r+?:	uvN.x == 0.0, uvN.y == 0.0, pad0, pad1,

	eventually we may need 1 (or 2) datapoints with each node? pad0: sum child volume, pad1: visual density?


*/

const nodeFactory = function(
	in_pos,
	in_radius,
	in_childArrayOrUndefined
	){
	const m_pos = in_pos; 
	const m_radius = in_radius;
	const m_childArrayOrUndefined = in_childArrayOrUndefined; 

	//public methods ==========================
	const result = Object.create({
		"visit" : function(in_visitor){
			return in_visitor(in_visitor, m_pos, m_radius, m_childArrayOrUndefined, result);
		},
		"getSpherePos" : function(){
			return m_pos;
		},
		"getSphereRadius" : function(){
			return m_radius;
		},
		"getChildArrayOrUndefined" : function(){
			return m_childArrayOrUndefined;
		},
	});

	return result;
}

const makeDebugOctTreeChildren = function(in_recusionCountdown, in_parentPos, in_parentRadius){
	if (in_recusionCountdown <= 0){
		return undefined;
	}
	const childRecusionCount = in_recusionCountdown - 1;
	var childArray = [];
	const childRadius = 0.378024844800586 * in_parentRadius;
	const childOffset = in_parentRadius - childRadius;
	for (var index = 0; index < 6; ++index){
		var xOffset = Math.sin(Core.Radians.fromDegrees(60.0 * index)) * childOffset;
		var yOffset = Math.cos(Core.Radians.fromDegrees(60.0 * index)) * childOffset;
		var childPos = Core.Vector3.factoryFloat32(in_parentPos.getX() + xOffset, in_parentPos.getY() + yOffset, in_parentPos.getZ());
		var childChildren = makeDebugOctTreeChildren(childRecusionCount, childPos, childRadius);
		childArray.push(nodeFactory(childPos, childRadius, childChildren));
	}
	//up
	var upPos = Core.Vector3.factoryFloat32(in_parentPos.getX(), in_parentPos.getY(), in_parentPos.getZ() + childOffset);
	var upChildren = makeDebugOctTreeChildren(childRecusionCount, upPos, childRadius);
	childArray.push(nodeFactory(upPos, childRadius, upChildren));

	//down
	var downPos = Core.Vector3.factoryFloat32(in_parentPos.getX(), in_parentPos.getY(), in_parentPos.getZ() - childOffset);
	var downChildren = makeDebugOctTreeChildren(childRecusionCount, downPos, childRadius);
	childArray.push(nodeFactory(downPos, childRadius, downChildren));

	return childArray;
}

const makeDebugOctTree = function(in_depth){
	const pos = Core.Vector3.factoryFloat32(0.0, 0.0, 0.0);
	const radius = 1.0;
	var children = makeDebugOctTreeChildren(in_depth, pos, radius);
	return nodeFactory(pos, radius, children);
}

const visitorNodeCount = function(in_visitor, in_pos, in_radius, in_childArrayOrUndefined){
	var count = 1;
	if (undefined !== in_childArrayOrUndefined){
		for (var index = 0; index < in_childArrayOrUndefined.length; index++) { 
			count += in_childArrayOrUndefined[index].visit(in_visitor);
		}
	}
	return count;
}

const visitorMaxChildCount = function(in_visitor, in_pos, in_radius, in_childArrayOrUndefined){
	var count = 0;
	if (undefined !== in_childArrayOrUndefined){
		count = in_childArrayOrUndefined.length;
		for (var index = 0; index < in_childArrayOrUndefined.length; index++) { 
			count = Math.max(count, in_childArrayOrUndefined[index].visit(in_visitor));
		}
	}
	return count;
}

const visitorPredictPixelCount = function(in_visitor, in_pos, in_radius, in_childArrayOrUndefined){
	var dataLength = 0;
	if (undefined !== in_childArrayOrUndefined){
		dataLength += ((in_childArrayOrUndefined.length * 2) + 1);
		for (var index = 0; index < in_childArrayOrUndefined.length; index++) { 
			dataLength += in_childArrayOrUndefined[index].visit(in_visitor);
		}
	}
	return dataLength;
}

function nextPowerOfTwo (n) {
  if (n === 0) return 1
  n--
  n |= n >> 1
  n |= n >> 2
  n |= n >> 4
  n |= n >> 8
  n |= n >> 16
  return n+1
}

const calculateTextureDim = function(in_nodeCount, in_maxChildCount, in_predictedPixelCount){
	if (in_nodeCount <= 1){
		return Core.Vector2.factoryInt32(2, 2);
	}
	var temp = Math.ceil(Math.sqrt(in_predictedPixelCount));
	temp = nextPowerOfTwo(temp);
	return Core.Vector2.factoryInt32(temp, temp);
}

const gFloatsPerPixel = 4;

const getUvFromTrace = function(in_trace, in_textureDim){
	const m_widthOfArray = in_textureDim.getX() * gFloatsPerPixel
	const m_halfUVStepX = 0.5 / in_textureDim.getX();
	const m_halfUVStepY = 0.5 / in_textureDim.getY();
	const mod = Math.floor((in_trace) / m_widthOfArray);
	const remainder = Math.floor((in_trace - (mod * m_widthOfArray)) / gFloatsPerPixel);
	const u = (remainder / in_textureDim.getX()) + m_halfUVStepX;
	const v = (mod / in_textureDim.getY()) + m_halfUVStepY;
	return Core.Vector2.factoryFloat32(u, v);
}


const flatPack = function(in_rootNode, in_textureDim){
	const m_widthOfArray = in_textureDim.getX() * gFloatsPerPixel
	const m_count = m_widthOfArray * in_textureDim.getY();
	const m_dataArrayRaw = new Array(m_count);

	for (var index = 0; index < m_count; ++index){
		m_dataArrayRaw[index] = 0.0;
		//var uv = getUvFromTrace(index, in_textureDim);
		//console.log("index:" + index + " getUvFromTrace:" + uv.getX() + " " + uv.getY());
	}

	const pushValue = function(in_trace, in_value){
		m_dataArrayRaw[in_trace] = in_value;
		return (in_trace + 1);
	}

	var m_pendingReferenceArray = []; //{"trace":<number>,"node":<node>}
	const dealPendingReferenceArray = function(in_uv, in_node){
		var oldPendingreferenceArray = m_pendingReferenceArray;
		m_pendingReferenceArray = [];

		for (var index = 0; index < oldPendingreferenceArray.length; ++index){
			const data = oldPendingreferenceArray[index];
			if (in_node === data.node){
				var uvTrace = data.trace;
				uvTrace = pushValue(uvTrace, in_uv.getX());
				uvTrace = pushValue(uvTrace, in_uv.getY());
			} else {
				m_pendingReferenceArray.push(data);
			}
		}
		return;
	}

	const appendPending = function(in_trace, in_node){
		m_pendingReferenceArray.push({
			"node" : in_node,
			"trace" : in_trace
		});
		return;
	}

	var m_trace = 0;
	const visitorFlatPack = function(in_visitor, in_pos, in_radius, in_childArrayOrUndefined, in_node){
		if (0 === m_trace){
			m_trace = pushValue(m_trace, 1.0 / in_textureDim.getX());
			m_trace = pushValue(m_trace, 1.0 / in_textureDim.getY());
			m_trace = pushValue(m_trace, 0.0); //pad0
			m_trace = pushValue(m_trace, 0.0); //pad1

			m_trace = pushValue(m_trace, in_pos.getX());
			m_trace = pushValue(m_trace, in_pos.getY());
			m_trace = pushValue(m_trace, in_pos.getZ());
			m_trace = pushValue(m_trace, in_radius);
		}

		const currentUV = getUvFromTrace(m_trace, in_textureDim);
		dealPendingReferenceArray(currentUV, in_node);

		if (undefined !== in_childArrayOrUndefined) {
			for (var index = 0; index < in_childArrayOrUndefined.length; ++index){
				var child = in_childArrayOrUndefined[index];
				var pos = child.getSpherePos();
				var radius = child.getSphereRadius();

				m_trace = pushValue(m_trace, pos.getX());
				m_trace = pushValue(m_trace, pos.getY());
				m_trace = pushValue(m_trace, pos.getZ());
				m_trace = pushValue(m_trace, radius);

				var childArrayOrUndefined = child.getChildArrayOrUndefined();
				if (undefined !== childArrayOrUndefined){
					appendPending(m_trace, child);
				}
				//empty uv data
				m_trace = pushValue(m_trace, 0.0);
				m_trace = pushValue(m_trace, 0.0);
				m_trace = pushValue(m_trace, 0.0); //pad0
				m_trace = pushValue(m_trace, 0.0); //pad1
			}
		}

		//null terminate [node/ child stream]
		m_trace = pushValue(m_trace, 0.0);
		m_trace = pushValue(m_trace, 0.0);
		m_trace = pushValue(m_trace, 0.0); 
		m_trace = pushValue(m_trace, 0.0); //zero radius null terminate

		if (undefined !== in_childArrayOrUndefined) {
			for (var index = 0; index < in_childArrayOrUndefined.length; ++index){
				var child = in_childArrayOrUndefined[index];
				//we only travers to the child if it has children...
				var childArrayOrUndefined = child.getChildArrayOrUndefined();
				if (undefined !== childArrayOrUndefined){
					child.visit(in_visitor);
				}
			}
		}
	}

	in_rootNode.visit(visitorFlatPack);

	return new Float32Array(m_dataArrayRaw);
}

const factory = function(in_webGLContextWrapper){
	const rootNode = makeDebugOctTree(4);
	const nodeCount = rootNode.visit(visitorNodeCount);
	console.log("nodeCount:" + nodeCount);

	const maxChildCount = rootNode.visit(visitorMaxChildCount);
	console.log("maxChildCount:" + maxChildCount);

	const predictedPixelCount = (2 + rootNode.visit(visitorPredictPixelCount));
	console.log("predictedPixelCount:" + predictedPixelCount);

	const textureDim = calculateTextureDim(nodeCount, maxChildCount, predictedPixelCount);
	console.log("textureDim:" + textureDim.getX() + " " + textureDim.getY());

	const dataArray = flatPack(rootNode, textureDim);
	console.log("dataArray count:" + dataArray.length);

	// var message = "";
	// var trace = 0;
	// for (var y = 0; y < textureDim.getY(); ++y){
	// 	for (var x = 0; x < textureDim.getX(); ++x){
	// 		message +=  "[" + x + "," + y + "]:" + dataArray[trace + 0] + " " + dataArray[trace + 1] + " " + dataArray[trace + 2] + " " + dataArray[trace + 3] + "\n";
	// 		const currentUV = getUvFromTrace(trace, textureDim);
	// 		message += " uv:" + currentUV.getX() + " " + currentUV.getY() + "\n";
	// 		trace += 4;
	// 	}
	// }
	// console.log(message);

	return WebGL.TextureWrapper.factory(
		in_webGLContextWrapper, 
		textureDim.getX(), 
		textureDim.getY(),
		dataArray,
		false,
		"RGBA",
		"RGBA",
		"FLOAT",
		"NEAREST",
		"NEAREST",
		"CLAMP_TO_EDGE",
		"CLAMP_TO_EDGE"
	);
}

module.exports = {
	"factory" : factory,
};