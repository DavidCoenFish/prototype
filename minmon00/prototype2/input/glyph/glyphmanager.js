// in_html5CanvasElement.width;
// in_html5CanvasElement.height;
//\u2661

import GlyphDataFactory from './glyphdata.js';
import PosManagerFactory from './posmanager.js';
import PosDataFactory from './posdata.js';

const s_style = [ "#F00", "#0F0", "#00F" ];
const s_styleMask = [ "#0FF", "#F0F", "#FF0" ];
const s_gutterThickness = 0;

export default function(
	in_context2dApi
	){
	var m_glyphData;
	var m_posManager;
	var m_changeID = 0;

	const clearImpl = function(){
		m_glyphData = {};
		in_context2dApi.drawRect(0, 0, in_context2dApi.getCanvasWidth(), in_context2dApi.getCanvasHeight());
		m_posManager = PosManagerFactory(in_context2dApi.getCanvasWidth(), in_context2dApi.getCanvasHeight(), 3);
		m_changeID += 1;
	}

	clearImpl();

	const drawText = function(in_pos, in_measure, in_text, in_font){
		//TODO: debug remove
		return;
		//TODO: end debug

		m_changeID += 1;

		var style = s_style[in_pos.index];
		var styleMask = s_styleMask[in_pos.index];

		//draw the (top, left) gutter
		if (DEVELOPMENT) {
			in_context2dApi.drawRect(in_pos.x, in_pos.y, in_pos.width, in_pos.height, {
				"fillStyle" : style,
				"globalCompositeOperation" : "lighten"
			});
			in_context2dApi.drawRect(in_pos.x + s_gutterThickness, in_pos.y + s_gutterThickness, in_pos.width - s_gutterThickness, in_pos.height - s_gutterThickness, {
				"fillStyle" : styleMask,
				"globalCompositeOperation" : "darken"
			});
		}

		//draw the text
		var textX = in_pos.x + s_gutterThickness + in_measure.actualBoundingBoxLeft;
		var textY = in_pos.y + s_gutterThickness + in_measure.actualBoundingBoxAscent;
		in_context2dApi.drawText(in_text, textX, textY, {
			"fillStyle" : style,
			"globalCompositeOperation" : "lighten",
			"font" : in_font
		});
	}

	const undrawGlyph = function(in_pos){
		//m_changeID += 1; //we don't need to treat texture as changed on undraw, as that part of the texture should no longer be used

		var styleMask = s_styleMask[in_pos.index];
		in_context2dApi.drawRect(in_pos.x, in_pos.y, in_pos.width, in_pos.height, {
			"fillStyle" : styleMask,
			"globalCompositeOperation" : "darken"
		});
	}

	//public methods ==========================
	const that = Object.create({
		"makeGlyphKey" : function(in_codePoint, in_font){
			return `${in_codePoint}_${in_font}`;
		},
		"getCreateGlyph" : function(in_glyphKey, in_codePoint, in_font){
			if (in_glyphKey in m_glyphData){
				var data = m_glyphData[in_glyphKey];
				data.addReference();
				return data;
			}
			var text = String.fromCodePoint(in_codePoint);
			var measure = in_context2dApi.measureText(text, {"font" : in_font});

			//console.log(measure);
			//{width: 27, actualBoundingBoxLeft: -2, actualBoundingBoxRight: 25, actualBoundingBoxAscent: 19, actualBoundingBoxDescent: 5}
			//20px sans-serif a
			var width = measure.actualBoundingBoxLeft + measure.actualBoundingBoxRight + s_gutterThickness;
			var height = measure.actualBoundingBoxAscent + measure.actualBoundingBoxDescent + s_gutterThickness;

			var posData = m_posManager.getFreePos(width, height);
			if (undefined !== posData){
				drawText(posData, measure, text, in_font);
			} else {
				if (DEVELOPMENT){ console.warn("getCreateGlyph could not find free space for glyph");}
				posData = PosDataFactory(0,0,0,0,0);
			}

			var glyphData = GlyphDataFactory(in_glyphKey, posData, measure.actualBoundingBoxLeft, measure.actualBoundingBoxAscent, measure.width);
			m_glyphData[in_glyphKey] = glyphData;
			return glyphData;
		},
		"removeGlyph" : function(in_glyphKey){
			if (in_glyphKey in m_glyphData){
				var data = m_glyphData[in_glyphKey];
				if (false == data.removeReference()){
					undrawGlyph(data.getPos());
					data.destroy();
					delete m_glyphData[in_glyphKey];
				}
				return;
			}
		},
		"getCanvasElement" : function(){
			return in_html5CanvasElement;
		},
		"getTextureChangeID" : function(){
			return m_changeID;
		},
		"clear" : function(){
			clearImpl();
		}
	});

	return that;
}
