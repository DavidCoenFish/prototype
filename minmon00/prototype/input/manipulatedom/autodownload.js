export const autoDownload = function(in_document, in_urlEncodedData, in_fileName){
	var element = in_document.createElement('a');
	element.setAttribute('href', in_urlEncodedData);
	element.setAttribute('download', in_fileName);
	element.innerText = in_fileName;

	in_document.body.appendChild(element);

	element.click();
	in_document.body.removeChild(element);

	return;
}

export const autoSnapShot = function(in_document, in_html5CanvasElement, in_fileName){
	// const capturedImage = in_html5CanvasElement.toDataURL("image/png");
	// autoDownload(in_document, capturedImage, in_fileName);
	//const drawingMode = in_html5CanvasElement.isDrawingMode;
	//in_html5CanvasElement.isDrawingMode = false;

	// if(!window.localStorage){
	// 	alert("This function is not supported by your browser."); 
	// 	return;
	// }

	//var html="<img src='"+in_html5CanvasElement.toDataURL("image/png")+"' alt='canvas image'/>";
	// console.log(in_html5CanvasElement.toDataURL());
	// console.log(in_html5CanvasElement.toDataURL('png'));
	//var newTab=window.open();
	//newTab.document.write(html);

	var data = in_html5CanvasElement.toDataURL("image/png");

	var parts = data.split(";base64,");
	var base64 = parts[1];
	var byteArray = base64ToByteArray(base64);
	download(byteArray, in_fileName, "image/png");

	return;
}

function download(data, filename, type) {
	var file = new Blob(data, {type: type});
	if (window.navigator.msSaveOrOpenBlob) // IE10+
		window.navigator.msSaveOrOpenBlob(file, filename);
	else { // Others
		var a = document.createElement("a"),
				url = URL.createObjectURL(file);
		a.href = url;
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		setTimeout(function() {
			document.body.removeChild(a);
			window.URL.revokeObjectURL(url);  
		}, 0); 
	}
}

function base64ToByteArray(base64String) {
	try {
		var sliceSize = 1024;
		var byteCharacters = atob(base64String);
		var bytesLength = byteCharacters.length;
		var slicesCount = Math.ceil(bytesLength / sliceSize);
		var byteArrays = new Array(slicesCount);

		for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
			var begin = sliceIndex * sliceSize;
			var end = Math.min(begin + sliceSize, bytesLength);

			var bytes = new Array(end - begin);
			for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
				bytes[i] = byteCharacters[offset].charCodeAt(0);
			}
			byteArrays[sliceIndex] = new Uint8Array(bytes);
		}
		return byteArrays;
	} catch (e) {
		console.log("Couldn't convert to byte array: " + e);
		return undefined;
	}
}