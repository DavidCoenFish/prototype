/*
end goal is to get a world grid/ debug reference to show on screen
for that we want 
	a float texture of the world space camera normals as a dag node
	given grid scale, division count, pixel screen angle, color, and camera world normal texture, as a draw node

create the above three modules, this file hosts to render and input/ state.
*/

import canvasFactory from './../../dom/canvasfactory.js'
import webGLAPIFactory from './../../webgl/apifactory.js'
import displayListUnsortedFactory from "./../../dagnodecalculatefactory/displaylist/unsorted.js"
import displayListRenderTargetCanvasFactory from "./../../dagnodecalculatefactory/displaylist/rendertargetcanvas.js"
import cameraNormalTextureFactory from "./../../dagnodecalculatefactory/cameranormaltexture.js"
import displayListDrawGridFactory from "./../../dagnodecalculatefactory/displaylist/drawgrid.js"
import {linkIndex, link, factoryDagNodeValue} from "./../../core/dagnode.js"
import {degreesToRadians} from "./../../core/radians.js"

export default function () {
	const dagNodeWidth = factoryDagNodeValue(512);
	const dagNodeHeight = factoryDagNodeValue(256);
	const dagNodeFovhRadian = factoryDagNodeValue(degreesToRadians(120));
	const dagNodeFovvRadian = factoryDagNodeValue(degreesToRadians(60));

	const html5CanvasWebGLWrapper = canvasFactory(document, {
		"width" : `${dagNodeWidth.getValue()}px`,
		"height" : `${dagNodeHeight.getValue()}px`,
		"backgroundColor" : "#000",
		"margin" : "0",
		"padding" : "0",
		"display" : "block"
	});
	document.body.appendChild(html5CanvasWebGLWrapper.getElement());
	html5CanvasWebGLWrapper.onResize();
	var webGLApi = webGLAPIFactory(html5CanvasWebGLWrapper.getElement(), [
		"OES_texture_float"
		], false);

	const dagNodeCanvasRenderTarget = displayListRenderTargetCanvasFactory(webGLApi);
	const dagNodeDisplayList = displayListUnsortedFactory();
	linkIndex(dagNodeCanvasRenderTarget, dagNodeDisplayList, 0);

	const dagNodeCameraNormalTexture = cameraNormalTextureFactory(webGLApi);
	linkIndex(dagNodeWidth, dagNodeCameraNormalTexture, 0);
	linkIndex(dagNodeHeight, dagNodeCameraNormalTexture, 1);
	linkIndex(dagNodeFovhRadian, dagNodeCameraNormalTexture, 2);
	linkIndex(dagNodeFovvRadian, dagNodeCameraNormalTexture, 3);

	dagNodeCameraNormalTexture.getValue();

	//const displayListDrawGrid = displayListDrawGridFactory(webGLApi);
	//linkIndex(dagNodeCameraNormalTexture, displayListDrawGrid, 0);

	//link(displayListDrawGrid, dagNodeDisplayList);

	//dagNodeDisplayList.getValue();
}