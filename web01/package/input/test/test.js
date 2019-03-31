import foo from './foo.js';
import {factoryFloat32 as Colour4FactoryFloat32} from './../core/colour4.js';
export default function () {
  const value = Colour4FactoryFloat32(0.475, 0.5, 0.5, 1.0);
  console.log(foo);
  console.error(value.getRed());
}

/*
import foo from './foo.js';
const Core = require("core");
export default function () {
  const value = Core.Colour4.factoryFloat32(0.475, 0.5, 0.5, 1.0);
  console.log(foo);
  console.error(value.getRed());
}
*/