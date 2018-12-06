//take each of the requested projects, and make a webpage and bundle

const Path = require("path");
const Helper = require("./source/helper.js");

const projectArray = [];
const normal = false; //true;
if (true === normal){
	const projectPath = Path.join(__dirname, "/project");
	Helper.gatherProjectArray(projectArray, projectPath);
} else {
	projectArray.push(require("./project/context.json"));
}

Helper.runProjectArray(projectArray);
