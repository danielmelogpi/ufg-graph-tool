/*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
/*global  GraphApp */

/**
* Deals with selecting and unselecting elements
* @param <Object> event    the dragging event
* @param <GraphApp.Node> | <GraphApp.Edge>  target     who was clicked
* @return void
*/

GraphApp.FormPanel.NodeStyle = function (elements) {
	this.elements = undefined;



};

GraphApp.FormPanel.EdgeStyle.prototype = new GraphApp.FormPanel();