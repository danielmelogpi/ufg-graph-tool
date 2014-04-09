/*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
/*global GraphApp, Kinetic*/

/* namespace GraphApp */


/** 
@class GraphApp.Control.EdgeDraw
Defines a control for edge drawing
*/
GraphApp.Control.EdgeDraw = function () {
	"use strict";
	/* name of the control */
	this.Iam = "GraphApp.Control.EdgeDraw";
	this.nameControl = "EdgeDraw";
	this.app = undefined;
	this.operationNodes = [];
	this.followLine = undefined;
	this.lightEffect = undefined;
	this.lightEffectConf = {
		color: "#f00",
		resetBlur: 1,
		increaseBlurUnit: 1.2,
		blurLimit: 40
	};

	/* returns the name of the control */
	this.getName = function () {
		return this.name;
	};

	this.enable = function () {
		var control = this;
		this.app.graph.nodes.forEach(function (node) {
			node.shape.on("click.edgedraw", control.addToOperation);
			node.shape.setDraggable(false);
		});
	};

	this.addToOperation = function (evt) {
		var node = evt.targetNode;
		var control = node.holder.graph.app.activeControl;
		if (control.operationNodes.length === 0) {
			control.operationNodes.push(node.holder);
			control.followLine = new GraphApp.FollowLine(node.holder);
			control.followLine.startUpdate();
			control.initLightEffect();
		}
		else if (control.operationNodes.length === 1) {
			control.destroyLightEffect();
			control.operationNodes.push(node.holder);
			control.createEdge();
			control.operationNodes.length = 0;
			control.followLine.stopUpdate();
			control.followLine = undefined;
		}
		else { //in case of caos
			control.destroyLightEffect();
			control.operationNodes.length = 0;
			control.followLine.stopUpdate();
			control.followLine = undefined;
		}
	};

	this.initLightEffect = function () {
		var control = this;
		this.lightEffect = new Kinetic.Animation(function (/*frame*/) {
			
			var blur = control.operationNodes[0].shape.getShadowBlur();
			var conf = control.lightEffectConf;
			var newBlur = (blur !== undefined && blur < conf.blurLimit) ? blur + conf.increaseBlurUnit : conf.resetBlur;

			control.operationNodes[0].shape.setShadowColor(conf.color);
			control.operationNodes[0].shape.setShadowBlur(newBlur);
			control.operationNodes[0].graph.stage.draw();
			
		});

		this.lightEffect.start();
	};

	this.destroyLightEffect = function () {
		this.lightEffect.stop();
		this.operationNodes[0].shape.setShadowBlur(0);
	};

	this.createEdge = function () {
		console.assert(this.operationNodes.length === 2);
		this.app.graph.createEdge(this.operationNodes[0], this.operationNodes[1]);
	};


	this.disable = function () {
		var control = this;
		this.app.graph.nodes.forEach(function (node) {
			node.shape.off("click.edgedraw", control.addToOperation);
		});
	};
};
GraphApp.Control.EdgeDraw.prototype =  new GraphApp.Control();