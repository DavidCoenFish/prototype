export default function(in_targetObject){
	var m_referenceCount = 0;
	Object.assign(in_targetObject, {
		"addReference" : function(){
			m_referenceCount += 1;
			return;
		},
		//return true if there are still more than 0 references
		"removeReference" : function(){
			m_referenceCount -= 1;
			return (0 < m_referenceCount);
		}
	});
}
