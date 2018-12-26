const Core = require("core");
const WebGL = require("webgl");

/*
inpoint (zero/zero) data is [uv step x, uv step y]
sphere has a position and radius //3 pos, 1 radius, 1 solid volume
8 children // 8 weights?, 16uv

put data into blocks of 8x2? or 16x1
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
		}
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

const makeDebugOctTree = function(){
	const pos = Core.Vector3.factoryFloat32(0.0, 0.0, 0.0);
	const radius = 1.0;
	var children = makeDebugOctTreeChildren(1, pos, radius);
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

const calculateTextureDim = function(in_nodeCount){
	if (in_nodeCount <=4 ){
		return Core.Vector2.factoryInt32(16, 4);
	}
	else if (in_nodeCount <=8 ){
		return Core.Vector2.factoryInt32(16, 8);
	}
	else if (in_nodeCount <=16 ){
		return Core.Vector2.factoryInt32(16, 16);
	}
	var dataPoints = in_nodeCount * 16;
	var temp = Math.ceil(Math.sqrt(dataPoints));
	temp = nextPowerOfTwo(temp);
	return Core.Vector2.factoryInt32(temp, temp);
}

const flatPack = function(in_rootNode, in_textureDim){
	const m_nodeSizeInArray = 3 + 3 + (8 * 3);
	const m_widthOfArray = in_textureDim.getX() * 3;
	const m_count = m_widthOfArray * in_textureDim.getY();
	const m_dataArrayRaw = new Array(m_count);
	const m_halfUVStepX = 0.5 / in_textureDim.getX();
	const m_halfUVStepY = 0.5 / in_textureDim.getY();

	for (var index = 0; index < m_count; ++index){
		m_dataArrayRaw[index] = 0.0;
	}

	const pushValue = function(in_trace, in_value){
		m_dataArrayRaw[in_trace] = in_value;
		return (in_trace + 1);
	}

	const roundTraceForWidth = function(in_trace){
		const nextMod = Math.floor((in_trace + m_nodeSizeInArray) / m_widthOfArray);
		if (Math.floor(in_trace / m_widthOfArray) != nextMod){
			return nextMod * m_widthOfArray;
		}
		return in_trace;
	}

	const getUvFromTrace = function(in_trace){
		const mod = Math.floor((in_trace) / m_widthOfArray);
		const remainder = (in_trace - (mod * m_widthOfArray)) / 3;
		const u = (remainder / in_textureDim.getX()) + m_halfUVStepX;
		const v = (mod / in_textureDim.getY()) + m_halfUVStepY;
		return Core.Vector2.factoryFloat32(u, v);
	}

	var m_trace = 0;
	m_trace = pushValue(m_trace, 1.0 / in_textureDim.getX());
	m_trace = pushValue(m_trace, 1.0 / in_textureDim.getY());
	m_trace = pushValue(m_trace, 0.0);

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

	const visitorFlatPack = function(in_visitor, in_pos, in_radius, in_childArrayOrUndefined, in_node){
		//do we have enough space for a new line
		m_trace = roundTraceForWidth(m_trace);
		const uv = getUvFromTrace(m_trace);
		dealPendingReferenceArray(uv, in_node);

		m_trace = pushValue(m_trace, in_pos.getX());
		m_trace = pushValue(m_trace, in_pos.getY());
		m_trace = pushValue(m_trace, in_pos.getZ());

		m_trace = pushValue(m_trace, in_radius);
		m_trace = pushValue(m_trace, 0.0);
		m_trace = pushValue(m_trace, 0.0);
		for (var index = 0; index < 8; ++index){
			if ((undefined === in_childArrayOrUndefined) ||
				(undefined === in_childArrayOrUndefined[index])){
				m_trace = pushValue(m_trace, 0.0);
				m_trace = pushValue(m_trace, 0.0);
				m_trace = pushValue(m_trace, 0.0);
			} else {
				var child = in_childArrayOrUndefined[index];
				m_trace = pushValue(m_trace, 1.0);
				appendPending(m_trace, child);
				m_trace = pushValue(m_trace, 0.0);
				m_trace = pushValue(m_trace, 0.0);
			}
		}

		if (undefined !== in_childArrayOrUndefined){
			for (var index = 0; index < in_childArrayOrUndefined.length; index++) { 
				in_childArrayOrUndefined[index].visit(in_visitor);
			}
		}
	}

	in_rootNode.visit(visitorFlatPack);

	return new Float32Array(m_dataArrayRaw);
}


const factory = function(in_webGLContextWrapper){
	const rootNode = makeDebugOctTree();
	const nodeCount = rootNode.visit(visitorNodeCount);
	console.log("nodeCount:" + nodeCount);

	const textureDim = calculateTextureDim(nodeCount);
	console.log("textureDim:" + textureDim.getX() + " " + textureDim.getY());

	const dataArray = flatPack(rootNode, textureDim);
	var message = "";
	for (var index = 0; index < textureDim.getX() * textureDim.getY() * 3; index += 3){
		console.log(" " + dataArray[index + 0] + " " + dataArray[index + 1] + " " + dataArray[index + 2]);
	}
	//const dataArray = undefined; //new Float32Array(dataArrayRaw);
	return WebGL.TextureWrapper.factory(
		in_webGLContextWrapper, 
		textureDim.getX(), 
		textureDim.getY(),
		dataArray,
		false,
		"RGB",
		"RGB",
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