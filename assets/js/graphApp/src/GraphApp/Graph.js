/*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
/*global GraphApp*/

/* namespace GraphApp */
"use strict";

/** Defines the graph worked by the application. */
GraphApp.Graph = function () {
    this.nodes = []; // Node collection
    this.edges = []; // Edges collection
    this.colors = new GraphApp.Graph.Colors();

    this.getEdges = function () {
		return this.edges;
    };
    this.getNodes = function () {
		return this.nodes;
    };
    this.addNode = function (node) {
		if (node instanceof GraphApp.Graph.Node) {
			this.nodes.push(node);
		}
	};
	this.createNode = function (x, y) {
		var newNode =  new GraphApp.Graph.Node(x, y);
		newNode.parent = this;
		this.nodes.push(newNode);
		this.parent.addShape(newNode.shape);
	};

};