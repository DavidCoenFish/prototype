export const sPOINTS = "POINTS";
export const sLINES = "LINES";
export const sTRIANGLES = "TRIANGLES";

export const sBYTE = "BYTE";
export const sSHORT = "SHORT";
export const sUNSIGNED_BYTE = "UNSIGNED_BYTE";
export const sUNSIGNED_SHORT = "UNSIGNED_SHORT";
export const sFLOAT = "FLOAT";
export const sHALF_FLOAT = "HALF_FLOAT";

/*
mode name
	POINTS: Draws a single dot.
	LINE_STRIP: Draws a straight line to the next vertex.
	LINE_LOOP: Draws a straight line to the next vertex, and connects the last vertex back to the first.
	LINES: Draws a line between a pair of vertices.
	TRIANGLE_STRIP
	TRIANGLE_FAN
	TRIANGLES: Draws a triangle for a group of three vertices

attribute typeName
BYTE: Int8Array : signed 8-bit integer, with values in [-128, 127]
SHORT: Int16Array : signed 16-bit integer, with values in [-32768, 32767]
UNSIGNED_BYTE: Uint8Array : unsigned 8-bit integer, with values in [0, 255]
UNSIGNED_SHORT: Uint16Array : unsigned 16-bit integer, with values in [0, 65535]
FLOAT: Float32Array
HALF_FLOAT

 */
