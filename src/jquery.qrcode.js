(function( $ ){
	$.fn.qrcode = function(options) {
		// if options is string, 
		if( typeof options === 'string' ){
			options	= { text: options };
		}

		// set default values
		// typeNumber < 1 for automatic calculation
		options	= $.extend( {}, {
			render		: "canvas",
			width		: 256,
			height		: 256,
			typeNumber	: -1,
			correctLevel	: QRErrorCorrectLevel.H,
                        background      : "#ffffff",
                        foreground      : "#000000"
		}, options);

		var createCanvas	= function(){
			// create the qrcode itself
			var qrcode	= new QRCode(options.typeNumber, options.correctLevel);
			qrcode.addData(options.text);
			qrcode.make();

			// create canvas element
			var canvas	= document.createElement('canvas');
			canvas.width	= options.width;
			canvas.height	= options.height;
			var ctx		= canvas.getContext('2d');

			// compute tileW/tileH based on options.width/options.height
			var tileW	= options.width  / qrcode.getModuleCount();
			var tileH	= options.height / qrcode.getModuleCount();

			// draw in the canvas
			for( var row = 0; row < qrcode.getModuleCount(); row++ ){
				for( var col = 0; col < qrcode.getModuleCount(); col++ ){
					ctx.fillStyle = qrcode.isDark(row, col) ? options.foreground : options.background;
					var w = (Math.ceil((col+1)*tileW) - Math.floor(col*tileW));
					var h = (Math.ceil((row+1)*tileW) - Math.floor(row*tileW));
					ctx.fillRect(Math.round(col*tileW),Math.round(row*tileH), w, h);  
				}	
			}
			// return just built canvas
			return canvas;
		}

		// from Jon-Carlos Rivera (https://github.com/imbcmdth)
		var createTable	= function(){
			// create the qrcode itself
			var qrcode	= new QRCode(options.typeNumber, options.correctLevel);
			qrcode.addData(options.text);
			qrcode.make();
			
			// create table element
			var $table	= $('<table></table>')
				.css("width", options.width+"px")
				.css("height", options.height+"px")
				.css("border", "0px")
				.css("border-collapse", "collapse")
				.css('background-color', options.background);
		  
			// compute tileS percentage
			var tileW	= options.width / qrcode.getModuleCount();
			var tileH	= options.height / qrcode.getModuleCount();

			// draw in the table
			for(var row = 0; row < qrcode.getModuleCount(); row++ ){
				var $row = $('<tr></tr>').css('height', tileH+"px").appendTo($table);
				
				for(var col = 0; col < qrcode.getModuleCount(); col++ ){
					$('<td></td>')
						.css('width', tileW+"px")
						.css('background-color', qrcode.isDark(row, col) ? options.foreground : options.background)
						.appendTo($row);
				}	
			}
			// return just built canvas
			return $table;
		}
		
		var createStr=	function (settings){
		var qrcode = new QRCode(options.typeNumber, options.correctLevel);
		qrcode.addData(options.text);
		qrcode.make();
		if (!qrcode) {
            return null;
        }
		var t="",BLANK='　',DARK='▉';
		var moduleCount = qrcode.moduleCount;
		var appendText = options.appendText || ""
		, appendLen = appendText.length
		, appendCount= Math.ceil(Math.sqrt(appendLen))
		, appendIndex = 0;
		
		if(moduleCount&1!=appendCount&1){
			appendCount ++;
		}
		var appendCountStart = Math.round((moduleCount-appendCount)/2);
		var appendCountEnd = appendCountStart + appendCount -1;
		appendText=appendText.padStart(Math.round((appendCount*appendCount-appendLen)/2)+appendLen,BLANK);
		
		for (var row = 0; row < moduleCount; row += 1) {
			for (var col = 0; col < moduleCount; col += 1) {
				if(appendCount&&row>=appendCountStart&&row<=appendCountEnd
					&&col>=appendCountStart&&col<=appendCountEnd){
					if(appendIndex<appendText.length)
						t+=appendText.charAt(appendIndex++);
					else
						t+=BLANK;
				}else if (qrcode.isDark(row, col)) {
					t+=DARK;
				}else{
					t+=BLANK;
				}
			}
			t+="\n"
		}
		return t;
	}
  
		return this.each(function(){
			if(options.render == "console") {
				console.log(createStr());
				return;
			}
			var element	= options.render == "canvas" ? createCanvas() : createTable();
			$(element).appendTo(this);
		});
	};
})( jQuery );