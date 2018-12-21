/*
private
 */

const factory = function(in_factoryMethod){
	const m_factoryMethod = in_factoryMethod;
	var m_referenceCount = 0;
	var m_commonResource = undefined;
	if (undefined !== in_mapNameFactoryOrUndefined){
		for (var key in in_mapNameFactoryOrUndefined) {
			if (true !== in_mapNameFactoryOrUndefined.hasOwnProperty(key)){ continue; }
			m_dataMap[key] = ResourceManagerData.factory(in_mapNameFactoryOrUndefined[key]);
		}
	}

	//public methods ==========================
	const result = Object.create({
		"callFactoryUnmanaged" : function(in_paramArray){
			return m_factoryMethod.apply(in_paramArray);
		},
		"callFactoryRefCounted" : function(in_paramArray){
			if (undefined === m_commonResource){
				m_commonResource = m_factoryMethod.apply(in_paramArray);
				m_referenceCount = 1;
			} else {
				m_referenceCount += 1;
			}
			return m_commonResource;
		},
		"releaseRefCounted" : function(){
			m_referenceCount -= 1;

			if (m_referenceCount < 0){
				m_commonResource.destroy();
				m_commonResource = undefined;
			}

			return;
		},
	});

	return result;
}

module.exports = {
	"factory" : factory
};
