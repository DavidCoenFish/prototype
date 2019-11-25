import DagNodePrototype from './dagnodeprototype.js';

export const factory = function(in_calculateCallback){
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

	DagNodePrototype(result);

	return result;
}