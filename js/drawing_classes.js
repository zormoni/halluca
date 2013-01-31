//The base class used for all the drawing objects.  It gets the context as a 
//parameter and it implements the before function which is always the same in
//all the drawing objects.
var Shape = Base.extend({
	constructor: function(ctx) {
		this.context = ctx;
		this.points = [];
  },
	before: function(x,y){
		this.startX = x;
		this.startY = y;
	}
});

//------------------------LINE-----------------------------------------------
//Draws a single line between the starting and the ending points
var Line = Shape.extend({
	name: function(){
		return "line";
	},

	//The draw function draws the "temporary" object to the screen.  While the mouse
	//is moving and we're in drawing mode, we draw the object for the user to have
	//some reference on what he's drawing.
	draw: function(event, x,y) {
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
	after: function(event, x,y){
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
			color: "red",
			time: Date.now()
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
//------------------------RECTANGLE-----------------------------------------------
var Rectangle = Shape.extend({ // instance interface
	/*constructor: function(x, y, width, height, color) {
		this.base(x, y, color);
		this.width = width;
		this.height = height;
	},*/
	name: function(){
		return "rectangle";
	},

	draw: function(event, x,y) {
		this.context.strokeStyle = "grey";
		this.context.strokeRect(this.startX, this.startY, x-this.startX, parseInt((this.startY - y)*-1, 10) );
	
		//filling a rectangle
		//context.fillStyle = this.color;
		//context.fillRect(this.x, this.y, this.width, this.height);
		
		//drawing the outline
		//context.strokeStyle = "black";
		//context.strokeRect(this.x, this.y, this.width, this.height);
	},

	after: function(event, x,y){
		this.context.strokeStyle = "black";
		this.context.strokeRect(this.startX, this.startY, x-this.startX, parseInt((this.startY - y)*-1, 10) );

		return {
			type: "rectangle",
			points: [ this.startX, this.startY, x-this.startX, parseInt((this.startY - y)*-1, 10) ],
			width: 3,
			color: "black",
			time: Date.now()
		};
	},

	redraw: function(object){
		this.context.strokeStyle = object.color;
		this.context.strokeRect(object.points[0], object.points[1], object.points[2], object.points[3] );
	}
});
//------------------------CIRCLE-----------------------------------------------
//Draws and circle from the starting point with a radius of half of where the ending
//points are
var Circle = Shape.extend({ // instance interface
	name: function(){
		return "circle";
	},

	getCircumference: function(x,y) {
		return Math.sqrt(
				Math.pow(y - startY, 2)+
				Math.pow(x - startX, 2)
			);
	},

	//The draw function draws the "temporary" object to the screen.  While the mouse
	//is moving and we're in drawing mode, we draw the object for the user to have
	//some reference on what he's drawing.
	//@todo: Circle is strange at the beginning of the drawing
	draw: function(event, x,y) {
		//setting the radius by using Pythagoras and dx and dy for the a's and b's
		//then we divide by two to get half of the distance as radius
		var radius = this.getCircumference(x,y);
		//drawing a filled circle with outline:
		this.context.beginPath();
		this.context.arc( this.startX, this.startY, radius, 0, 2 * Math.PI, false);
		// param doc http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#dom-context-2d-arc
		this.context.lineWidth = 1;
		this.context.strokeStyle = "grey";
		this.context.stroke();
	},

	//This is the function that persists the drawed object on the canvas
	//It also returns a literal with the information about the object that
	//was drawn for history purposes
	after: function(event, x,y){
		var radius = this.getCircumference(x,y);
		//drawing a filled circle with outline:
		this.context.beginPath();
		this.context.arc( this.startX, this.startY, radius, 0, 2 * Math.PI, false);
		this.context.lineWidth = 2;
		this.context.strokeStyle = "blue";
		this.context.stroke();
		return { type: "circle",
				points: [this.startX, this.startY, radius],
				width: 2,
				color: "blue",
				time: Date.now()
				};
	},

	//Gets an object from the history and knows how to re-draw it self to the canvas
	redraw: function(object){
		this.context.beginPath();
		this.context.arc( object.points[0], object.points[1], object.points[2], 0, 2 * Math.PI, false);
		this.context.lineWidth = object.width;
		this.context.strokeStyle = object.color;
		this.context.stroke();
	}
});

//------------------------CHARACTERS-----------------------------------------------
var Characters = Shape.extend({
	name: function(){
		return "characters";
	},

	draw: function(x,y){

	},

	//@todo: Display dialog at cursor pointer and give it focus
	openDialog: function(){
		$("#textbox").css('visibility', 'visible');
	},

	closeDialog: function(){
		$("#freetext").val("");
		$("#textbox").css("visibility", "hidden");
	},

	after: function(text){
		this.context.font = '12pt Arial';
		this.context.fillStyle = 'black';
		this.context.fillText(text, this.startX, this.startY);
		this.context.strokeStyle = 'black';
		this.context.lineWidth = 1;
		this.context.strokeText(text, this.startX, this.startY);
		return { type: "characters",
			points: [this.startX, this.startY],
			text: text,
			color: "black",
			width: 1,
			time: Date.now()
		};
	},

	redraw: function(object){
		this.context.font = '12pt Arial';
		this.context.fillStyle = object.color;
		this.context.fillText(object.text, object.points[0], object.points[1]);
		this.context.strokeStyle = object.color;
		this.context.lineWidth = 1;
		this.context.strokeText(object.text, object.points[0], object.points[1]);
	}
});

//------------------------MATH SYMBOLS-----------------------------------------
var MathSymbols = Shape.extend({
	name: function(){
		return "mathsymbols";
	},

	openDialog: function(){
		$("#mathbox").css('visibility', 'visible');
	},

	closeDialog: function(){
		$("#mathformula").val("");
		$("#mathbox").css('visibility', 'hidden');
	},

	after: function(text){
		var imageObj = new Image();
		imageObj.src = "http://latex.codecogs.com/gif.latex?" + text;
		this.context.drawImage(imageObj, this.startX, this.startY);
		return {
			type: "mathsymbols",
			points: [this.startX, this.startY],
			formula: text,
			time: Date.now()
		};
	},

	redraw: function(object){
		var imageObj = new Image();
		imageObj.src = "http://latex.codecogs.com/gif.latex?" + object.formula;
		this.context.drawImage(imageObj, object.points[0], object.points[1]);
	}
});

//------------------------PENCIL-----------------------------------------------
var Pencil = Shape.extend({ // instance interface
	name: function(){
		return "pencil";
	},

	draw: function(event, x,y) {
		var self = this;
		this.context.beginPath();
		this.context.lineWidth = 1;
		this.context.strokeStyle = "rgb(220,220,220)";
		this.context.moveTo(this.startX, this.startY);
		this.points.forEach(function(item,index,collection){
			self.context.lineTo(item.x, item.y);
		});
		this.context.lineTo(x,y);
		this.points.push( {x:x, y:y} );
		this.context.stroke();
	},

	after: function(event, x,y){
		var self = this;
		this.context.beginPath();
		this.context.lineWidth = 1;
		this.context.strokeStyle = "orange";
		this.context.moveTo(this.startX, this.startY);
		this.points.forEach(function(item,index,collection){
			self.context.lineTo(item.x, item.y);
		});
		this.context.lineTo(x,y);
		this.points.push( {x:x, y:y} );
		this.context.stroke();
		var pointsClone = this.points.slice(0);
		this.points = [];
		return {
			type: "pencil",
			points: [this.startX, this.startY],
			path: pointsClone,
			color: "orange",
			width: 1,
			time: Date.now()
		};
	},

	redraw: function(object){
		var self = this;
		this.context.beginPath();
		this.context.lineWidth = object.width;
		this.context.strokeStyle = object.color;
		this.context.moveTo(object.points[0],object.points[1]);
		object.path.forEach(function(item, index, collection){
			self.context.lineTo(item.x, item.y);
		});
		this.context.stroke();
	}
});

