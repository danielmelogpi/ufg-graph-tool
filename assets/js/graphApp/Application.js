"use strict";
/** jslint */
/*global Kinetic, $ */

/** Define o namespace da aplicação e constroi o palco */
var GraphApplication = function(canvasHandler){
	this.stage = new GraphApplication.Stage(canvasHandler);
	this.graph = new GraphApplication.Graph();
	this.canvas = $("#"+canvasHandler);
};

/** Define o objeto do grafo */
GraphApplication.Graph = function(canvasHandler){
    this.nodes = [];
    this.edges = [];

    this.getEdges = function() {
		return this.edges;
    };
    this.getNodes = function() {
		return this.nodes;
    };
    this.addNode = function(node) {
		if(node instanceof GraphApplication.Graph.Node){
			this.nodes.push(node);
		}
	};
    
	return canvasHandler;
};

GraphApplication.Graph.Node = function (x, y){
	return x+y;
};

GraphApplication.Stage = function(canvasHandler){
	var stage = new Kinetic.Stage({
		container: canvasHandler,
		width: "0",
		height: "0",
		draggable: false
	});
	return stage;
};

$(document).ready(
	(function () {
		window.graphApp = new GraphApplication("graph-app");
	})
);