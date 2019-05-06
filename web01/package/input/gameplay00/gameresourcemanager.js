import ResourceManagerFactory from "./../core/resourcemanager.js";

export default function(){
	var m_resourceManager = ResourceManagerFactory();
	const that = Object.create({
		"destroy" : function(){
		},
		"getResourceManager" : function(){
			return m_resourceManager;
		},
		"requestLevel" : function(in_levelName){
		},
		"isLevelLoaded" : function(in_levelName){
			return false;
		},
		"getLocalisedString" : function(in_key){
			return in_key;
		},
	});

	return that;
}
