import PosBucketFactory from './posbucket.js';

export default function(
	in_targetWidth, 
	in_targetHeight, 
	in_index
	){
	var m_bucketArray = [];

	//public methods ==========================
	const that = Object.create({
		"getFreePos" : function(in_requestWidth, in_requestHeight, in_sortedbuckets){
			var traceY = 0;
			if (0 < m_bucketArray.length){
				var bucket = m_bucketArray[m_bucketArray.length - 1];
				traceY = bucket.getY() + bucket.getHeight();
			}
			//can we fit the bucket
			if (in_targetHeight < (traceY + in_requestHeight)){
				return undefined;
			}
			//create a new bucket
			var newBucket = PosBucketFactory(traceY, in_requestHeight, in_targetWidth, in_index);
			var pos = newBucket.getFreePosForce(in_requestWidth, in_requestHeight);

			m_bucketArray.push(newBucket);
			in_sortedbuckets.push(newBucket);
			in_sortedbuckets.sort(function(lhs, rhs){
				return lhs.getHeight() - rhs.getHeight();
			});

			return pos;
		}
	});

	return that;
}
