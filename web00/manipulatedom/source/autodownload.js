const autoDownload = function(in_document, in_urlEncodedData, in_fileName){
	var element = in_document.createElement('a');
	element.setAttribute('href', in_urlEncodedData);
	element.setAttribute('download', in_fileName);
	element.innerText = fileName;

	in_document.body.appendChild(element);

	element.click();
	in_document.body.removeChild(element);

	return;
}

module.exports = {
	"autoDownload" : autoDownload
}