/*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
/*global Kinetic, GraphApp */

/** Defines some kind of hightlight that shows that 
* something is selected on the graph stage
* that is the visual node 
* @param <GraphApp.Node> | <GraphApp.Edge> anchor	The element that is marked
*/
GraphApp.SelectedMark = function (anchor) {
	"use strict";
	this.Iam = "GraphApp.SelectedMark";
	this.anchor = anchor;
	this.shape = undefined;
	this.ascendent = "asc";
	this.descendent = "desc";
	//this.shape = new Kinetic.Rect;

	/** triggers the shapes genesis */
	this.enableMark = function () {
		var config = this.calculateConfig();
		this.createMarkShape(config);
		return this;
	};

	this.updateMarkConfig = function () {
		var config = this.calculateConfig();
		this.shape.setX(config.x);
		this.shape.setY(config.y);
		this.shape.setWidth(config.width);
		this.shape.setHeight(config.height);
	}

	/** Calcutes x, y, width and height for the selection mark (a Kinetic.Rect) *
	* @return {} object with parameters for the mark
	*/
	this.calculateConfig = function () {
		var padding = 4;
		
		var config = {};

		if (this.anchor instanceof GraphApp.Node) {
			//calculate based on circle nature
			var shapeX = this.anchor.shape.getX();
			var shapeY = this.anchor.shape.getY();
			var shapeWidth = this.anchor.shape.getWidth();
			var shapeHeight = this.anchor.shape.getHeight();

			config.x = shapeX - (shapeWidth / 2) - padding;
			config.y = shapeY - (shapeHeight / 2) - padding;
			config.width = shapeWidth + padding * 2;
			config.height = shapeHeight + padding * 2;

			return config;
		}
		else if (this.anchor instanceof GraphApp.Edge) {
			//calculate based on line nature
			var coord1 = this.smallerXPointSpline();
			var coord2 = this.greaterXPointSpline();

			config.width = Math.abs(coord2.getX() - coord1.getX()) + padding * 2;
			config.height =  Math.abs(coord2.getY() - coord1.getY()) + padding * 2;

			if (this.getSplineDirection(coord1, coord2) == this.ascendent) {
				config.x = coord1.getX() - padding;
				config.y = coord1.getY() - config.height - padding;
			}
			else {
				config.x = coord1.getX() - padding;
				config.y = coord1.getY() - padding;
			}

			return config;

		}
		else {
			return false;
		}

	};

	this.toogle = function () {
		this.shape.toogle(); //this toogle is not a Kinetic native. 
	};

	// Esses dois métodos poderiam ser unificados
	/** Determina se a origem ou o destino a linha tem maior valor de X */
	this.greaterXPointSpline = function () {
		var origin = this.anchor.origin.shape;
		var target = this.anchor.target.shape;

		if (origin.getX() > target.getX()) {
			return this.anchor.origin.shape;
		}
		else {
			return this.anchor.target.shape;
		}
	};

	/** Determina se a origem ou o destino a linha tem menor valor de X */
	this.smallerXPointSpline = function () {

		var origin = this.anchor.origin.shape;
		var target = this.anchor.target.shape;

		if (origin.getX() < target.getX()) {
			return this.anchor.origin.shape;
		}
		else {
			return this.anchor.target.shape;
		}

	};

	/** Retorna a direção da linha (ascendente ou descendente), imaginando
	* o palco como um plano cartesiano e a linha como uma reta de uma função de 
	* primeiro grau 
	* @param <Kinetic.Circle> a shape com menor X (seja origem ou destino da linha)
	* @param <Kinetic.Circle> a shape com maior X (seja origem ou destino da linha)
	* @return String    asc para ascendente ou desc para descendente
	*/
	this.getSplineDirection = function (smaller, greater) {
		if (smaller.getY() < greater.getY()) {
			return this.descendent;
		}
		return this.ascendent;
	};

	/**
	Creates the form that is a mark selection
	*/
	// @TODO correct style properly
	this.createMarkShape = function (config) {
		this.shape = new Kinetic.Rect({
			x: config.x,
			y: config.y,
			width: config.width,
			height: config.height,
			//fill: colors.SELECTION_RECT_FILL,
			//stroke: colors.SELECTION_RECT_STROKE,
			strokeWidth: 1,
			visible: false,
			dashArray: [3, 5]
		});

		this.shape.holder = this;
		this.anchor.graph.app.stage.addSelectionMark(this.shape);
		this.shape.toogle = this.toogleToShape();
	};

	/** returns a function that toogles the visibility of the mark */
	this.toogleToShape = function () {
		return function () {
			if (this.getVisible()) {
				this.hide();
				console.debug("hide selection");
			}
			else {
				this.show();
				console.debug("show selection");
			}
			this.getStage().draw();
		};
	};



};