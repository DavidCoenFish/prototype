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
	const capturedImage = in_html5CanvasElement.toDataURL("image/png");
	autoDownload(in_document, capturedImage, in_fileName);
}
