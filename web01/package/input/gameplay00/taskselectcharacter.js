import {factory as factoryText} from "./../manipulatedom/text.js";
import {factoryAppend as factoryDiv} from "./../manipulatedom/div.js";
import {factoryAppend as buttonFactory}  from './../manipulatedom/button.js';
import {factoryFloat32 as Colour4FactoryFloat32} from "./../core/colour4.js";

/*

want left hand of screen to be character portait/ selection pedistal
and right half of screen to be ui/ text/ options (gender, point spend)

fae
goblin (100 evil)
hob	(100 social)?
gnome (100 good)
dwarf, half dwarf,
elf, half elf
human-nymph, human
ork, half ork
 */

export default function(in_webGLState, in_div, in_gameResourceManager, in_gameState, in_callbackSetActiveGameTask, in_callbackRequestLoading){
	var m_button = buttonFactory(document, in_div, "game", function(){
		in_callbackSetActiveGameTask("Game");
	},
	{
		"position": "absolute",
		"left": "10px",
		"top": "10px",
		"width": "32px", 
		"height": "32px"
	}
	);

	var m_countdown = 3.0;


	const that = Object.create({
		"destroy" : function(){
			in_div.removeChild(m_button);
		},
		"update" : function(in_timeDelta){
			if (undefined !== m_countdown){
				m_countdown -= in_timeDelta;
				if (m_countdown <= 0.0){
					m_countdown = undefined;
				} else {
					in_callbackRequestLoading();
				}
			}

			in_webGLState.clear(Colour4FactoryFloat32(1.0,0.0,0.0,1.0));
		},
	});

	return that;
}
