const dagNodePrototype = function(in_result){
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

export function factoryDagNodeValue (in_value){
	var m_value = in_value;
	const result = Object.create({
		"getValue" : function(){
			return m_value;
		},
		"setValue" : function(in_value){
			if (m_value !== in_value)
			{
				m_value = in_value;
				result.setDirtyOutput();
			}
			return;
		}
		//increment?
	})

	dagNodePrototype(result);

	return result;
}

export function factoryDagNodeCalculate (in_calculateCallback){
	var m_calculateCallback = in_calculateCallback; //( m_calculatedValue, inputIndexArray, inputArray )
	var m_dirty = true;
	var m_calculatedValue = undefined;
	var m_indexInputArray = [];
	var m_inputArray = []; //"unordered" input

	const result = Object.create({
		"getValue" : function(){
			if ( true === m_dirty )
			{
				//prep index input
				var inputIndexArray = [];
				var arrayLength = m_indexInputArray.length;
				for (var index = 0; index < arrayLength; ++index ) {
					var item = m_indexInputArray[index];
					if (undefined === item)
					{
						continue;
					}
					inputIndexArray[index] = item.getValue();
				}

				//prep input
				var inputArray = [];
				m_inputArray.forEach(item => {
					inputArray.push( item.getValue() );
				});

				// calculate value
				m_calculatedValue = m_calculateCallback( m_calculatedValue, inputIndexArray, inputArray );

				m_dirty = false;
			}
			return m_calculatedValue;
		},
		"setDirty" : function(){
			if ( false === m_dirty )
			{
				m_dirty = true;
				result.setDirtyOutput();
			}
			return;
		},
		"setInputIndex" : function(in_input, in_index)
		{
			m_indexInputArray[in_index] = in_input;
			result.setDirty();
		},
		"addInput" : function(in_input)
		{
			m_inputArray.push(in_input);
			result.setDirty();
		},
		"removeInput" : function(in_input)
		{
			m_inputArray = m_inputArray.filter(item => item !== in_input);
			result.setDirty();
		}
	});

	dagNodePrototype(result);

	return result;
}

export function linkIndex (in_source, in_destination, in_index){
	in_source.addOutput(in_destination);
	in_destination.setInputIndex(in_source, in_index);
	return;
}

export function link (in_source, in_destination){
	in_source.addOutput(in_destination);
	in_destination.addInput(in_source);
	return;
}

export function unlink (in_source, in_destination){
	in_source.removeOutput(in_destination);
	in_destination.removeInput(in_source);
	return;
}
