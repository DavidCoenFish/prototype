/*
private
 */

export default function(in_factoryMethod){
	const m_factoryMethod = in_factoryMethod;
	var m_referenceCount = 0;
	var m_commonResource = undefined;

	//public methods ==========================
	const result = Object.create({
		"callFactoryUnmanaged" : function(in_paramArray){
			return m_factoryMethod.apply(null, in_paramArray);
		},
		"callFactoryRefCounted" : function(in_paramArray){
			if (undefined === m_commonResource){
				m_referenceCount = 0;
				m_commonResource = m_factoryMethod.apply(null, in_paramArray);
			}
			m_referenceCount += 1;
			return m_commonResource;
		},
		"releaseRefCounted" : function(){
			m_referenceCount -= 1;

			if (m_referenceCount <= 0){
				if (undefined !== m_commonResource){
					m_commonResource.destroy();
					m_commonResource = undefined;
				}
				m_referenceCount = 0;
			}

			return;
		},
	});

	return result;
}
