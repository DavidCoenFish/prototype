

export const factory = function( in_dagNodeFadeValue ){
	var m_uiTemplateIntance = undefined;

	const result = Object.create({
		"setUiTemplateInstance" : function( in_uiTemplateIntance ){
			m_uiTemplateIntance = in_uiTemplateIntance;
		},		
		"getValue" : function(){
			return in_dagNodeFadeValue.getValue();
		},
		"update" : function(){
			if (undefined != m_uiTemplateIntance ){
				m_uiTemplateIntance.update();
			}
		},
		"destroy" : function(){
			if (undefined != m_uiTemplateIntance ){
				m_uiTemplateIntance.destroy();
				m_uiTemplateIntance = undefined;
			}
		}
	});

	return result;

}