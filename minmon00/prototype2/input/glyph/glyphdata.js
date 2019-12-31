import referenceCountDecorate from './../core/referencecountdecorate.js';

export default function(
	in_glyphKey
	){

	//public methods ==========================
	const that = Object.create({
		"getGlyphKey" : function(){
			return in_glyphKey;
		},

	});

	referenceCountDecorate(that);

	return that;
}