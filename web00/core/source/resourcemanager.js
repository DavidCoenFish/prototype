/*
public
collect resources factories, and create unique instances or reuesable constant resource
 */
const ResourceManagerData = require("./resourcemanagerdata.js");

const factory = function(in_mapNameFactoryOrUndefined){
	const m_dataMap = {};
	if (undefined !== in_mapNameFactoryOrUndefined){
		for (var key in in_mapNameFactoryOrUndefined) {
			if (true !== in_mapNameFactoryOrUndefined.hasOwnProperty(key)){ continue; }
			m_dataMap[key] = ResourceManagerData.factory(in_mapNameFactoryOrUndefined[key]);
		}
	}

	//public methods ==========================
	const result = Object.create({
		"addFactory" : function(in_name, in_factory){
			m_dataMap[in_name] = ResourceManagerData.factory(in_factory);
			return;
		},

		//getDynamicReference/ unmanaged, can be edited, don't need to tell resource manager about release
		"getUniqueReference" : function(in_name){ //...
			if (false === in_name in m_dataMap){
				return undefined;
			}
			const param = Array.prototype.slice.call(arguments, 1);
			return m_dataMap[in_name].callFactoryUnmanaged(param);
		},
		//getStaticReference/ ref counted, need to release. do not edit, as useage of resource is shared
		"getCommonReference" : function(in_name){ //...
			if (false === in_name in m_dataMap){
				return undefined;
			}
			const param = Array.prototype.slice.call(arguments, 1);
			return m_dataMap[in_name].callFactoryRefCounted(param);
		},
		"releaseCommonReference" : function(in_name){
			if (false === in_name in m_dataMap){
				return;
			}
			m_dataMap[in_name].releaseRefCounted();
			return;
		}
	});

	return result;
}

module.exports = {
	"factory" : factory
};
