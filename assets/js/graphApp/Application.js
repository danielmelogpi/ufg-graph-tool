"use strict";
/*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
/*global $, GraphApp */


$(document).ready(
	(function () {
		window.graphApp = new GraphApp("graph-app");
		console.log(window.graphApp);
	})
);