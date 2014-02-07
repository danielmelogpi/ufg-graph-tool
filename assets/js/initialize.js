$( window ).resize(function() {
	(function(){ //quando a tela é redimensionada, a tela de desenho é reajustada
		stage.setWidth($(window).width());
		stage.setHeight($(window).height());
	})();
});

$( window ).keyup(function(evt){
	if(evt.keyCode == 46){
		deleteAllSelected();
	}
});

$(document).ready(function(){

	//adiciona um método de log a tudo o que existe no DOM
	Kinetic.Shape.prototype.log = function(){console.log(this)};

	stage = defaultStage();

	layer = new Kinetic.Layer();

	colors = new Color();



	circle1 = defaultCircle(440,115);
	circle2 = defaultCircle(286,306);
	circle3 = defaultCircle(538,192);
	circle4 = defaultCircle(220,294);
	circle5 = defaultCircle(330,350);
	circle6 = defaultCircle(282,248);
	circle7 = defaultCircle(254,355);
	circle8 = defaultCircle(547,295);
	circle9 = defaultCircle(343,280);

	layer.add(circle1);
	layer.add(circle2);
	layer.add(circle3);
	layer.add(circle4);
	layer.add(circle5);
	layer.add(circle6);
	layer.add(circle7);
	layer.add(circle8);
	layer.add(circle9);

	layer.add(circle1.selectionRect);
	layer.add(circle2.selectionRect);
	layer.add(circle3.selectionRect);
	layer.add(circle4.selectionRect);
	layer.add(circle5.selectionRect);
	layer.add(circle6.selectionRect);
	layer.add(circle7.selectionRect);
	layer.add(circle8.selectionRect);
	layer.add(circle9.selectionRect);

	var line1 = defaultLine(circle4, circle2);
	var line2 = defaultLine(circle5, circle2);
	var line3 = defaultLine(circle6, circle2);
	var line4 = defaultLine(circle7, circle2);
	var line5 = defaultLine(circle9, circle2);
	var line6 = defaultLine(circle9, circle1);
	var line7 = defaultLine(circle9, circle3);
	var line8 = defaultLine(circle9, circle8);

	layer.add(line1);
	layer.add(line2);
	layer.add(line3);
	layer.add(line4);
	layer.add(line5);
	layer.add(line6);
	layer.add(line7);
	layer.add(line8);

	
	layer.add(line1.selectionRect);
	layer.add(line2.selectionRect);
	layer.add(line3.selectionRect);
	layer.add(line4.selectionRect);
	layer.add(line5.selectionRect);
	layer.add(line6.selectionRect);
	layer.add(line7.selectionRect);
	layer.add(line8.selectionRect);



    // add the layer to the stage
    stage.add(layer);

	adjustStageDimensions();

	stage.on("click", function(){
		logMe(getMousePos());
	});
	
	stageUrl();
	refreshStage();
	hightlightButton("#navigationControl")
	//(function(){ stage.on("click", enableSelection) })();
});

