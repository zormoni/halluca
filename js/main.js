;(function(){
	//Object variables.
	//These three are used solely for displaying the co-ordinates of the mousepointer
	//on the screen
	var locat = document.getElementById('MouseLocation');
	var tool = document.getElementById('Tool');
	//These store if we are drawing or not and all the drawing objects on the screen
	var drawingMode = false;
	var drawingHistory = [];
	var undoHistory = [];
	var redoHistory = [];
	//The context and the canvas itself
	var c=document.getElementById("Canvas");
	var ctx=c.getContext("2d");
	
	//Initializing the drawing objects.  Now we have them ready whenever we
	//want to use them
	var tools = {
		"circle": new Circle(ctx),
		"rectangle": new Rectangle(ctx),
		"line": new Line(ctx),
		"characters": new Characters(ctx),
		"pencil": new Pencil(ctx),
		"mathsymbols": new MathSymbols(ctx)
	};

	//Inintializing the current drawing object to a line
	var currentDrawingObject = tools.line;

	//These next functions monitor the click events of the buttons and switch to
	//the correct drawing object when clicked.
	$("#line").click(function(event){
		event.preventDefault();
		currentDrawingObject = tools.line;
		tool.innerText = "Tool: Line";
	});

	$("#circle").click(function(event){
		event.preventDefault();
		currentDrawingObject = tools.circle;
		tool.innerText = "Tool: Circle";
	});

	$("#rectangle").click(function(event){
		event.preventDefault();
		currentDrawingObject = tools.rectangle;
		tool.innerText = "Tool: Rectangle";
	});

	$("#pencil").click(function(event){
		event.preventDefault();
		currentDrawingObject = tools.pencil;
		tool.innerText = "Tool: Pencil";
	});

	$("#characters").click(function(event){
		event.preventDefault();
		currentDrawingObject = tools.characters;
		tool.innerText = "Tool: Strings";
	});

	$("#mathsymbols").click(function(event){
		event.preventDefault();
		currentDrawingObject = tools.mathsymbols;
		tool.innerText = "Tool: Math (LaTeX)";
	});

	$("#undo").click(function(event){
		if( drawingHistory.length > 0){
			undoHistory.push( drawingHistory.pop() );
			redraw();
		}
	});

	$("#redo").click(function(event){
		if( undoHistory.length > 0){
			drawingHistory.push( undoHistory.pop() );
			redraw();
		}
	});

	//Clears the canvas and loops through all the drawing objects in the hisorty to
	//redraw them on the canvas.
	function redraw(){
		ctx.clearRect(0,0,c.width, c.height);
		drawingHistory.forEach(function(item, index, collection){
			switch(item.type){
				case "line": tools.line.redraw(item); break;
				case "rectangle": tools.rectangle.redraw(item); break;
				case "circle": tools.circle.redraw(item); break;
				case "pencil": tools.pencil.redraw(item); break;
				case "characters": tools.characters.redraw(item); break;
				case "mathsymbols": tools.mathsymbols.redraw(item); break;
				default:
					break;
			}
		});
	}


	//A heloer function to get the correct x and y coordinates from the client
	function windowToCanvas(canvas, x, y){
		var bbox = canvas.getBoundingClientRect();
		return { x: parseInt(x - bbox.left * (canvas.width / bbox.width), 10),
				y: parseInt(y - bbox.top  * (canvas.height / bbox.height), 10)
		};
	}

//MOUSE EVENTS --------------------------------------------------------
	/**
	 * Listening on mousedown event on #Canvas
	 */
	$("#Canvas").mousedown(function(e){
		ctx.clearRect(0,0,c.width, c.height);
		var loc = windowToCanvas(c, e.clientX, e.clientY);
		drawingMode = true;
		startX = e.clientX;
		startY = e.clientY;
		currentDrawingObject.before(loc.x, loc.y);
		if(currentDrawingObject.name() === "characters" ){
			currentDrawingObject.openDialog();
			drawingMode = false;
		}else if(currentDrawingObject.name() === "mathsymbols"){
			currentDrawingObject.openDialog();
			drawingMode = false;
		}
		redraw();
	});

	$("#Canvas").mousemove(function(e){
		var loc = windowToCanvas(c, e.clientX, e.clientY);
		updateLocation(loc.x, loc.y);
		endX = e.clientX;
		endY = e.clientY;
		if(drawingMode === true){
			redraw();
			currentDrawingObject.draw(e, loc.x, loc.y);
		}
	});

	$("#Canvas").mouseup(function(e){
		var loc = windowToCanvas(c, e.clientX, e.clientY);
		drawingMode = false;
		if(currentDrawingObject.name() !== "characters" && currentDrawingObject.name() !== "mathsymbols"){
			drawingHistory.push(currentDrawingObject.after(e, loc.x, loc.y) );
		}
	});

	$("#textbox").keypress(function(e){
		if( e.keyCode === 13){
			drawingHistory.push(currentDrawingObject.after($("#freetext").val()) );
			currentDrawingObject.closeDialog();
		}
	});

	$("#mathbox").keypress(function(e){
		if( e.keyCode === 13){
			drawingHistory.push(currentDrawingObject.after($("#mathformula").val()) );
			currentDrawingObject.closeDialog();
			console.log(drawingHistory);
		}
	});

	//These display the current mouse coordinates on the screen.
	function updateLocation(x,y){
		locat.innerText = 'Coords: (' + x.toFixed(0) + ', ' + y.toFixed(0) + ')';
	}
})();


