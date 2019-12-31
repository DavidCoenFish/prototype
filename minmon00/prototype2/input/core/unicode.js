//reverse String.fromCodePoint(in_codePoint)
//	example puppy icon 128054 (\uD83D\uDC36)

export function stringToArrayCodePoint (in_string){
	var codePointArray = [];
	var length = in_string.length;
	for (var index = 0; index < length; ++index) {
		var charCode = in_string.charCodeAt(index);
		if ((charCode <= 0xD7FF) || (0xE000 <= charCode)){
			// Basic Multilingual Plane (BMP)
			codePointArray.push(charCode);
		} else {
			//assume surrogate pair
			if ((0xD800 <= charCode) && (charCode <= 0xDC00) && (index + 1 < length)){
				index += 1;
				var charCodeSecond = in_string.charCodeAt(index);
				var codePoint = ((charCode - 0xD800) << 10) + (charCodeSecond - 0xDC00) + 0x10000;
				codePointArray.push(codePoint);
			} else {
				//we have the second part of a surrogate pair floating around by it's self, ignore?
			}
		}
	}
	return codePointArray;
}