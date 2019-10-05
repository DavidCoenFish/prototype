import {factoryFloat32 as Colour4FactoryFloat32} from './../core/colour4.js';
import {factory as uiManagerFactory} from './../ui/uimanager.js';
import {factory as fadeUiTemplateFactory} from './../ui/fadeuitemplate.js';
import {factory as fadeDataServerFactory} from './../ui/fadedataserver.js';
import {factory as dagNodeValueFactory} from './../core/dagnodevalue.js';

export default function(in_callback, in_webGLState, in_dataState, in_timeDelta, in_keepGoing){
	var m_uiManager = uiManagerFactory();
	m_uiManager.registerTemplate( "fade", fadeUiTemplateFactory );
	var m_fadeDagNode = dagNodeValueFactory(0.5);
	var m_fadeDataServer = fadeDataServerFactory(m_fadeDagNode);
	m_uiManager.invokeTemplate("fade", in_dataState.document, in_dataState.m_parentDiv, m_fadeDataServer);
	var m_accumulate = 0.0;

	return function(in_callback, in_webGLState, in_dataState, in_timeDelta, in_keepGoing){
		if (false === in_keepGoing){
			m_fadeDataServer.destroy();
			return undefined;
		}

		in_webGLState.clear(Colour4FactoryFloat32(1.0,0.0,0.0,1.0));
		m_accumulate += in_timeDelta;
		m_fadeDagNode.setValue(Math.sin(m_accumulate));
		m_fadeDataServer.update();

		return in_callback;
	};
}
