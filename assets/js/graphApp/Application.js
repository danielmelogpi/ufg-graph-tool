"use strict";
/*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
/*global $, GraphApp, graphApp*/


$(document).ready(
	function () {
		window.graphApp = new GraphApp("graph-app");
		window.n1 = graphApp.graph.createNode(10, 30);
		window.n2 = graphApp.graph.createNode(112, 120);
		window.n3 = graphApp.graph.createNode(60, 51);
		window.n4 = graphApp.graph.createNode(40, 22);
		window.n5 = graphApp.graph.createNode(15, 2);
		window.n6 = graphApp.graph.createNode(131, 230);
		window.n7 = graphApp.graph.createNode(200, 240);
		
		window.n8 = graphApp.graph.createNode(10, 300);
		window.ed = graphApp.graph.createEdge(window.n1, window.n7);

		//window.control = new GraphApp.Control.NodeDraw();
		//window.graphApp.changeControlTo(window.control);

		window.control = new GraphApp.Control.EdgeDraw();
		window.graphApp.changeControlTo(window.control);

	}
);