// convert "foo_bar" => "fooBar", "_foo_bar" => "FooBar", "____" => "", "___a_" => "A"
const toCamelCase = function(in_string){
	var result = "";
	for (var index = 0; index < in_string.length; ++index){
		var char = in_string[index];
		if (index + 1 < in_string.length){
			var nextChar = in_string[index + 1];
			if (("_" === char) && ("_" !== nextChar)){
				nextChar = nextChar.toUpperCase();
				result += nextChar;
				index += 1;
				continue;
			}
		}
		if ("_" !== char){
			result += char;
		}
	}
	return result;
}

// convert "fooBar" => "foo_bar", "FooBar" => "_foo_bar"
const fromCamelCase = function(in_string){
	var result = "";
	for (var index = 0; index < in_string.length; ++index){
		var char = in_string[index];
		var lowerChar = char.toLowerCase();
		if (char !== lowerChar){
			result += "_" + lowerChar;
		} else {
			result += char;
		}
	}
	return result;
}

const uppercaseFirstLetter = function(in_string){
	var result = "";
	for (var index = 0; index < in_string.length; ++index){
		var char = in_string[index];
		if (0 === index){
			char = char.toUpperCase();
		}
		result += char;
	}
	return result;
}

module.exports = {
	"toCamelCase" : toCamelCase,
	"fromCamelCase" : fromCamelCase,
	"uppercaseFirstLetter" : uppercaseFirstLetter
};
