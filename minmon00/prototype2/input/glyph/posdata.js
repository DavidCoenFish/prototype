export default function(
	in_x, 
	in_y, 
	in_requestWidth, 
	in_requestHeight, 
	in_index, 
	in_bucket
	){
	//public methods ==========================
	const that = Object.create({
		"x" : in_x,
		"y" : in_y,
		"width" : in_requestWidth,
		"height" : in_requestHeight,
		"index" : in_index,
		"destroy" : function(){
			if (undefined !== in_bucket){
				in_bucket.removePos(that);
				in_bucket = undefined;
			}
		}
	});

	return that;
}
