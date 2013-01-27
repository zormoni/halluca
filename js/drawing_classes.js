//The base class used for all the drawing objects.  It gets the context as a 
//parameter and it implements the before function which is always the same in
//all the drawing objects.
var Shape = Base.extend({
  constructor: function(ctx) {
  	this.context = ctx;
  },
  	before: function(x,y){
  		this.startX = x;
  		this.startY = y;
  	}
});

//Draws a single line between the starting and the ending points
var Line = Shape.extend({ 
	//The draw function draws the "temporary" object to the screen.  While the mouse
	//is moving and we're in drawing mode, we draw the object for the user to have
	//some reference on what he's drawing.
	draw: function(x,y) {
		this.context.beginPath(); // starts the line drawing
		this.context.moveTo(this.startX,this.startY);	
		this.context.lineTo(x,y);
		this.context.lineWidth=1;
		this.context.strokeStyle = "grey";
		this.context.stroke();
	},

	//This is the function that persists the drawed object on the canvas
	//It also returns a literal with the information about the object that
	//was drawn for history purposes
	after: function(x,y){
		this.context.beginPath(); // starts the line drawing
		this.context.moveTo(this.startX,this.startY);	
		this.context.lineTo(x,y);
		this.context.lineWidth=3;
		this.context.strokeStyle = "red";
		this.context.stroke(); // Draws the actual outline of the line
		return {
			type: "line",
			points: [this.startX,this.startY,x,y],
			width: 3,
			color: "red"
		};
	},

	//Gets an object from the history and re-draws it self to the canvas
	redraw: function(object){
		this.context.beginPath(); // starts the line drawing
		this.context.moveTo(object.points[0], object.points[1]);	
		this.context.lineTo(object.points[2], object.points[3]);
		this.context.lineWidth=object.width;
		this.context.strokeStyle = object.color;
		this.context.stroke(); // Draws the actual outline of the line
	}
});

//Draws and circle from the starting point with a radius of half of where the ending
//points are
var Circle = Shape.extend({ // instance interface
	radius: 0,
  
	getCircumference: function() {
		return 2 * Circle.PI * this.radius;
	},

	//The draw function draws the "temporary" object to the screen.  While the mouse
	//is moving and we're in drawing mode, we draw the object for the user to have
	//some reference on what he's drawing.
	draw: function(x,y) {
		//setting the radius by using Pythagoras and dx and dy for the a's and b's
		//then we divide by two to get half of the distance as radius
		this.radius = parseInt(Math.sqrt( Math.pow(this.startX-x,2)/Math.pow(this.startY-y,2))/2);  
		console.log(this.radius);
		//drawing a filled circle with outline:
		this.context.beginPath();
		this.context.arc( this.startX, this.startY, this.radius, 0, 2 * Math.PI, false);
		// param doc http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#dom-context-2d-arc
		this.context.fillStyle = this.color;
		this.context.fill();
		this.context.lineWidth = 1;
		this.context.strokeStyle = "grey";
		this.context.stroke();
	},

	//This is the function that persists the drawed object on the canvas
	//It also returns a literal with the information about the object that
	//was drawn for history purposes
	after: function(x,y){
		
		return { type: "circle" };
	},

	//Gets an object from the history and knows how to re-draw it self to the canvas
	redraw: function(object){
		console.log("Im an unimplemented redraw-circle()");
	}
});


var Rectangle = Shape.extend({ // instance interface
	/*constructor: function(x, y, width, height, color) {
		this.base(x, y, color);
		this.width = width;
		this.height = height;
	},*/

	draw: function(context) {
		//filling a rectangle
		context.fillStyle = this.color;
		context.fillRect(this.x, this.y, this.width, this.height);
		
		//drawing the outline
		context.strokeStyle = "black";
		context.strokeRect(this.x, this.y, this.width, this.height);
	}
});


var Line = Shape.extend({ // instance interface
	/*constructor: function(x, y, width, height,  color) {
		this.base(x, y, color);
		this.width = width;
		this.height = height;
	},*/
  
  	

	draw: function(x,y) {
		this.context.beginPath(); // starts the line drawing
		this.context.moveTo(this.startX,this.startY);	
		this.context.lineTo(x,y);
		this.context.lineWidth=1;
		this.context.strokeStyle = "grey";
		this.context.stroke();
	},

	after: function(x,y){
		this.context.beginPath(); // starts the line drawing
		this.context.moveTo(this.startX,this.startY);	
		this.context.lineTo(x,y);
		this.context.lineWidth=3;
		this.context.strokeStyle = "red";
		this.context.stroke(); // Draws the actual outline of the line
		return {
			type: "line",
			points: [this.startX,this.startY,x,y],
			width: 3,
			color: "red"
		};
	},

	//Redraws a line object from the history array
	redraw: function(object){
		this.context.beginPath(); // starts the line drawing
		this.context.moveTo(object.points[0], object.points[1]);	
		this.context.lineTo(object.points[2], object.points[3]);
		this.context.lineWidth=object.width;
		this.context.strokeStyle = object.color;
		this.context.stroke(); // Draws the actual outline of the line
	}
});


var Characters = Shape.extend({ // instance interface
	/*constructor: function(x, y, color) {
		this.base(x, y, color);
	},*/
  
	draw: function(context) {	
		context.font = '30pt Helvetica';
		context.fillStyle = this.color;
		context.fillText('Hello World!', this.x, this.y);
		context.strokeStyle = 'black';
		context.lineWidth = 1;
		context.strokeText('Hello World!', this.x, this.y);
	}
});


var Pencil = Shape.extend({ // instance interface
	/*constructor: function(coordinates, color) {
		this.base(coordinates[0][0], coordinates[0][1], color);
		this.coordinates = coordinates;
	},*/
  
	draw: function(context) {
		context.beginPath(); // starts the line drawing
		//Loop through the coordinates and draw
		for (var i = 0; i < this.coordinates.length; i++) {
		  // Do something with element i.
			context.moveTo(this.coordinates[i][0],this.coordinates[i][1]);	
			if (i !== this.coordinates.length-1) {
				context.lineTo(this.coordinates[i+1][0],this.coordinates[i+1][1]);				
			};
		}
		context.lineWidth=3;
		context.strokeStyle = this.color;
		context.stroke(); // Draws the actual outline of the line
	}
});

