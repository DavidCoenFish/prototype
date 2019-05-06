import {factory as factoryText} from "./../../manipulatedom/text.js";
import {factoryAppend as factoryDiv} from "./../../manipulatedom/div.js";

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

export default function(in_webGLState, in_div, in_gameResourceManager, in_gameState){
	var m_textDiv = factoryDiv(document, in_div, {
		"position": "fixed",
		"top":"50%",
		"left":"50%",
		"transform":"translate(-50%,-50%)",
		"padding":"1em",
		"backgroundColor" : "#FFFFFF"
	});
	var text = in_gameResourceManager.getLocalisedString("loading...");
	m_textDiv.appendChild(factoryText(document, text));
	var m_appended = true;

	const that = Object.create({
		"destroy" : function(){
		},
		"update" : function(in_timeDelta){
		},
	});

	return that;
}
