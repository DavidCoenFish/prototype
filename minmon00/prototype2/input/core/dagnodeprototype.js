/*
common properties for the dag node class
 */

export default function(in_result){
	var m_arrayOutput = []; //array of dagnodecalculate
	var publicMethods = {
		"setDirtyOutput" : function(){
			m_arrayOutput.forEach(item => item.setDirty());
			return;
		},
		"addOutput" : function(in_outputNode){
			m_arrayOutput.push(in_outputNode);
			return;
		},
		"removeOutput" : function(in_outputNode){
			m_arrayOutput = m_arrayOutput.filter(item => item !== in_outputNode);
			return;
		}
	};

	Object.assign(in_result, publicMethods);

	return;
}
