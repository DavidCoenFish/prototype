export default function(
	in_glyphDataArray,
	in_glyphManager
	){

	//public methods ==========================
	const that = Object.create({
		"getGlyphDataArray" : function(){
			return in_glyphDataArray;
		},
		"destroy" : function(){
			var arrayLength = in_glyphDataArray.length;
			for (var index = 0; index < arrayLength; index++) {
				var glyphKey = in_glyphDataArray[index].getGlyphKey();
				in_glyphManager.removeGlyph(glyphKey);
			}
			in_glyphDataArray = [];
		}
	});

	return that;
}