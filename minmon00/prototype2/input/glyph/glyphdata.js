import referenceCountDecorate from './../core/referencecountdecorate.js';

export default function(
	in_glyphKey,
	in_pos,
	in_actualBoundingBoxLeft, 
	in_actualBoundingBoxAscent,
	in_cursorAdvance
	){

	//public methods ==========================
	const that = Object.create({
		"getGlyphKey" : function(){
			return in_glyphKey;
		},
		"getPos" : function(){
			return in_pos;
		},
		"destroy" : function(){
			in_pos.destroy();
		},
		"actualBoundingBoxLeft" : in_actualBoundingBoxLeft,
		"actualBoundingBoxAscent" : in_actualBoundingBoxAscent,
		"cursorAdvance" : in_cursorAdvance
	});

	referenceCountDecorate(that);

	that.addReference();

	return that;
}