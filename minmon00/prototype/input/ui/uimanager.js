/*
	want a system, where we can tell it a template name, and give it a data server, and it renders a ui
	tell templates to update? or have events broadcast...

	need to create the manager
	need to register the ui templates
	need to invoke a template
	//need to dismiss a template // internal to the created template instance if broadcast driven,
	// or does dataTemplate get ownership of ui, in which case it can update or destroy ui template instance

	dataserver 
		setUiTemplateInstance()
		getValue(in_key)

	uiTemplateInstance( dataserver )
		update()
		destroy()

still holding dear to the notion of heirearchical ownership and update lockstep
should the dataserver or the uimanager own the created ui template instance
was tempted to, but having the dataserver own the uitemplate instance gives easier point of control for tick/detroy

*/

export const factory = function(){
	const m_mapTemplate = {};
	const result = Object.create({
		"registerTemplate" : function(in_name, in_template){
			m_mapTemplate[in_name] = in_template;
		},
		"invokeTemplate" : function(in_name, in_document, in_parentElement, in_dataServer){
			if (in_name in m_mapTemplate){
				var result = m_mapTemplate[in_name](in_document, in_parentElement, in_dataServer);
				in_dataServer.setUiTemplateInstance(result);
			}
		}
	});

	return result;
}

