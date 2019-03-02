const swap = function(in_object, in_keyA, in_keyB){
	var temp = in_object[in_keyA];
	in_object[in_keyA] = in_object[in_keyB];
	in_object[in_keyB] = temp;
	return;
}

module.exports = {
	"swap" : swap
}
