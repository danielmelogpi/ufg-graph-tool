/*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
/*global Kinetic, GraphApp */
/** Defines the stage where the <canvas> element is constructed */

"use strict";
GraphApp.Stage = function (canvasHandler) {
	var stage = new Kinetic.Stage({
		container: canvasHandler,
		width: window.screen.availWidth,
		height: window.screen.availHeight,
		draggable: false
	});
	return stage;
};