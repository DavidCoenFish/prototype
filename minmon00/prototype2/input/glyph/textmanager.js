
import GlyphManagerFactory from './glyphmanager.js';
import TextDataFactory from './textdata.js';
import { stringToArrayCodePoint } from './../core/unicode.js';

export default function(
	in_context2dApi
	){
	var m_glyphManager = GlyphManagerFactory(in_context2dApi);

	//public methods ==========================
	const that = Object.create({
		//return a text data
		"createString" : function(in_text, in_font){
			var codePointArray = stringToArrayCodePoint(in_text);
			var glyphDataArray = [];
			var arrayLength = codePointArray.length;
			for (var index = 0; index < arrayLength; index++) {
				var codePoint = codePointArray[index];
				var glyphKey = m_glyphManager.makeGlyphKey(codePoint, in_font);
				glyphDataArray.push(m_glyphManager.getCreateGlyph(glyphKey, codePoint, in_font));
			}
			var textData = TextDataFactory(glyphDataArray, m_glyphManager);
			return textData;
		},
		"clear" : function(){
			m_glyphManager.clear();
		}
	});

	return that;
}
