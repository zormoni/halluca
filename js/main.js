;(function(){
	//Object variables.
	//These three are used solely for displaying the co-ordinates of the mousepointer
	//on the screen
	var locat = document.getElementById('VTMouseLocation');
	var mdown = document.getElementById('VTMouseDown');
	var mup = document.getElementById('VTMouseUp');
	//These store if we are drawing or not and all the drawing objects on the screen
	var drawingMode = false;
	var drawingHistory = [];
	//The context and the canvas itself
	var c=document.getElementById("VTCanvas");
	var ctx=c.getContext("2d");
	
	//Initializing the drawing objects.  Now we have them ready whenever we
	//want to use them
	var tools = {
		"circle": new Circle(ctx),
		"rectangle": new Rectangle(ctx),
		"line": new Line(ctx),
		"characters": new Characters(ctx),
		"pencil": new Pencil(ctx)
	};

	//Inintializing the current drawing object to a line
	var currentDrawingObject = tools.line;

	//These next functions monitor the click events of the buttons and switch to
	//the correct drawing object when clicked.
	$("#line").click(function(event){
		event.preventDefault();
		currentDrawingObject = tools.line;
	});

	$("#circle").click(function(event){
		event.preventDefault();
		currentDrawingObject = tools.circle;
	});

	//Clears the canvas and loops through all the drawing objects in the hisorty to 
	//redraw them on the canvas.
	function redraw(){
		ctx.clearRect(0,0,c.width, c.height);
		drawingHistory.forEach(function(item, index, collection){
			switch(item.type){
				case "line": tools.line.redraw(item); break;
				case "circle": tools.circle.redraw(item); break;
			}
			
		});
	};


	//A heloer function to get the correct x and y coordinates from the client
	function windowToCanvas(canvas, x, y){
		var bbox = canvas.getBoundingClientRect();
		return { x: parseInt(x - bbox.left * (canvas.width / bbox.width)),
				 y: parseInt(y - bbox.top  * (canvas.height / bbox.height))
		};
	};

//MOUSE EVENTS --------------------------------------------------------	
	/**
	 * Listening on mousedown event on #VTCanvas
	 */
	$("#VTCanvas").mousedown(function(e){
		ctx.clearRect(0,0,c.width, c.height);
		var loc = windowToCanvas(c, e.clientX, e.clientY);
		drawingMode = true;
		startX = e.clientX;
		startY = e.clientY;
		updateStart(loc.x, loc.y);
		currentDrawingObject.before(loc.x, loc.y);
		redraw();
	});

	$("#VTCanvas").mousemove(function(e){
		var loc = windowToCanvas(c, e.clientX, e.clientY);
		updateLocation(loc.x, loc.y);
		endX = e.clientX;
		endY = e.clientY;
		if(drawingMode === true){
			redraw();
			currentDrawingObject.draw(loc.x, loc.y);
		}
	});

	$("#VTCanvas").mouseup(function(e){
		var loc = windowToCanvas(c, e.clientX, e.clientY);
		updateFinish(loc.x, loc.y);
		drawingMode = false;
		drawingHistory.push(currentDrawingObject.after(loc.x, loc.y) );
		console.log(drawingHistory);

	});

	//These display the current mouse coordinates on the screen.
	function updateLocation(x,y){
		locat.innerText = 'Mouse is here: (' + x.toFixed(0) + ', ' + y.toFixed(0) + ')';
	};

	function updateStart(x,y){
		mdown.innerText = 'Action started here: (' + x.toFixed(0) + ', ' + y.toFixed(0) + ')';
	};

	function updateFinish(x,y){
		mup.innerText = 'Action ended here: (' + x.toFixed(0) + ', ' + y.toFixed(0) + ')';
	};

	//A function to undo the current action
	function undo(){

	};

	//A function to redo the last action
	function redo(){

	};
})();


