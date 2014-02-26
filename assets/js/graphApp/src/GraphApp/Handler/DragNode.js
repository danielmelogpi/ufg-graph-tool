/*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
/*global  GraphApp */

/**
* Deals with dragging a node. 
* @param <GraphApp.Node> target     who was dragged
* @param <Object> event    the dragging event
* @return void
*/
GraphApp.Handler.DragNode = function (event, target) {
	"use strict";
	this.event = event;
	this.target = target;
	this.details = {};

	if (!(target instanceof GraphApp.Node)) {
		this.details.success = false;
		this.details.message = "O tipo de objeto alvo não é o aceito por este handler.";
		console.error(this.details);
	}

	/** @TODO   provavelmente isso aqui pode ser otimizado para o firefox . 
	Sem isso fica mais fluido o movimento de drag
	*/
	if (this.target.graph.app.activeControl instanceof GraphApp.Control.Navigation) {
		this.target.nodesFromHere.forEach(function (edge) {
			edge.updatePoints();
			edge.selectionMark.updateMarkConfig();
		});
		this.target.nodesToHere.forEach(function (edge) {
			edge.updatePoints();
			edge.selectionMark.updateMarkConfig();
		});
		this.target.selectionMark.updateMarkConfig();
		this.target.graph.stage.draw();
	}

	this.details.success = true;


}; //end of object
GraphApp.Handler.DragNode.prototype = new GraphApp.Handler(undefined);
