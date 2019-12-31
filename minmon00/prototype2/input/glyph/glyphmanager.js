// in_html5CanvasElement.width;
// in_html5CanvasElement.height;
//\u2661

export default function(
	in_html5CanvasElement
	){
	var m_glyphData = {};

	//public methods ==========================
	const that = Object.create({
		"makeGlyphKey" : function(in_codePoint, in_fontSize, in_font){
			return `${in_codePoint}_${in_fontSize}_${in_font}`;
		},
		"getCreateGlyph" : function(in_glyphKey, in_codePoint, in_fontSize, in_font){
			if (in_glyphKey in m_glyphData){
				var data = m_glyphData[in_glyphKey];
				data.addReference();
				return data;
			}

			
		},
		"removeGlyph" : function(in_glyphKey){
			if (in_glyphKey in m_glyphData){
				var data = m_glyphData[in_glyphKey];
				if (false == data.removeReference()){
					delete m_glyphData[in_glyphKey];
				}
				return;
			}
		},
		"getCanvasElement" : function(){
			return in_html5CanvasElement;
		}
	});

	return that;
}
