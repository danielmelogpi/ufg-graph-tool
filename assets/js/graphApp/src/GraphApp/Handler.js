/*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
/*global  GraphApp */

/**
* Defines a parent to classes especialized with dealing with the events actions
*/
GraphApp.Handler = function (event, target) {
	"use strict";
	/** Keeps the event beeing worked */
	this.event = event;
	this.target = target;
	this.details = {};

	this.hasShift = function () {
		return this.event.shiftKey;
	};

	this.hasCtrl = function () {
		return this.event.ctrlKey;
	};

	this.hasAlt = function () {
		return this.event.altKey;
	};

};