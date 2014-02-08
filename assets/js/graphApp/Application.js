"use strict";
/*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
/*global $, GraphApp, graphApp*/


$(document).ready(
	function () {
		window.graphApp = new GraphApp("graph-app");
		window.n1 = graphApp.graph.createNode(10, 30);
		window.n2 = graphApp.graph.createNode(100, 20);
		window.n1 = graphApp.graph.createNode(10, 300);
		window.ed = graphApp.graph.createEdge(n1, n2);
	}
);