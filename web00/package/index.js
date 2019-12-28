//take each of the requested projects, and make a webpage and bundle

const Path = require("path");
const Helper = require("./source/helper.js");

console.log(new Date().toLocaleTimeString());

const projectArray = [];
const normal = false; //true;//
if (true === normal){
	const projectPath = Path.join(__dirname, "/project");
	Helper.gatherProjectArray(projectArray, projectPath);
} else {
	//projectArray.push(require("./project/context.json"));
	//projectArray.push(require("./project/clear.json"));
	//projectArray.push(require("./project/triangle.json"));
	projectArray.push(require("./project/texture.json"));
	//projectArray.push(require("./project/noise.json"));
	//projectArray.push(require("./project/rendertarget.json"));
	//projectArray.push(require("./project/cloth00.json"));
	//projectArray.push(require("./project/celticknot.json"));
}

// celticknot.json
// 
// context.json
// heightmap.json
// modelviewedge00.json
// noise.json
// octtreespheretest.json
// physicstest00.json
// physicstest01.json
// properties.json
// rendertarget.json
// spheretest00.json
// spheretest01.json
// texture.json
// triangle.json
// water00.json
// water01.json

Helper.runProjectArray(projectArray)
