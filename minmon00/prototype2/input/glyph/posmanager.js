
// in_html5CanvasElement.width;
// in_html5CanvasElement.height;
//\u2661

import PosPageFactory from './pospage.js';

export default function(
	in_width,
	in_height,
	in_channelCount
	){
	// page [ bucket{ height, y, pos array[{width, x}]} ]
	// buckets can only contain items of equal or less height
	var m_pages = [];
	for (var index = 0; index < in_channelCount; index++) {
		m_pages.push(PosPageFactory(in_width, in_height, index));
	}

	var m_sortedbuckets = [];

	const getFreePosImpl = function(in_width, in_height, in_wasteTollerance){
		//is there a bucket that already satifies our waste tollerance
		var count = m_sortedbuckets.length;
		for (var index = 0; index < count; index++) {
			var bucket = m_sortedbuckets[index];
			var bucketHeight = bucket.getHeight();
			if (bucketHeight < in_height){
				continue;
			}
			if ((bucketHeight * in_wasteTollerance <= in_height) && (in_height <= bucketHeight)){
				var pos = bucket.getFreePos(in_width, in_height);
				if (undefined !== pos){
					return pos;
				}
				continue;
			}
			break;
		}
		return undefined;
	}
	const getFreePosPage = function(in_width, in_height){
		//visit the pages
		for (var index = 0; index < in_channelCount; index++) {
			var page = m_pages[index];
			var pos = page.getFreePos(in_width, in_height, m_sortedbuckets);
			if (undefined !== pos){
				return pos;
			}
		}
		return undefined;
	}

	//public methods ==========================
	const that = Object.create({
		"getFreePos" : function(in_width, in_height){
			var pos = getFreePosImpl(in_width, in_height, 0.9);
			if (undefined !== pos){
				return pos;
			}
			pos = getFreePosImpl(in_width, in_height, 0.5);
			if (undefined !== pos){
				return pos;
			}
			pos = getFreePosPage(in_width, in_height);
			return pos;
		}
	});

	return that;
}
