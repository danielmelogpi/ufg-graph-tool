/*jslint browser: true, devel: true, closure: false, debug: true, nomen: false, white: false */
/*global GraphApp */
/** Represents the window, mainly to set events about the keyboard */


/*
*@param jQuery set  window      the return of the jQuery method $(window)
*/
GraphApp.Window = function (window) {
	"use strict";
	this.app = null;
	this.window = window;

};

GraphApp.Window.prototype.handleKeyUp = function (app) {
	"use strict";

	return function (event) {
		//46 = delete key
		if (event.keyCode == 46) {
			var handler = new GraphApp.Handler.DelKey(event, app);
			handler.run();
		}
	};
};

GraphApp.Window.prototype.setupEvents = function () {
	"use strict";
	this.window.on("keyup", this.events.keyup(this.app));
};

GraphApp.Window.prototype.setApp = function (app) {
	"use strict";
	this.app = app;
};

GraphApp.Window.prototype.events = {
	"keyup": GraphApp.Window.prototype.handleKeyUp
};