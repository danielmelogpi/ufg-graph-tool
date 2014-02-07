var elementOnFocus = {isNull: true}; //determina o elemento atualmente em foco

function showAttr(show){
	if(show){
		elementToDisplay();	
		$("#attr-panel").fadeIn();
	}
	else{
		$("#attr-panel").fadeOut();
		elementOnFocus.isNull == true;
	}
	
	
}

/** Ajusta elementOnFocus, adiciona eventos ao formulário e requer o painel do servidor */
function elementToDisplay(){

	var selectedElements = stage.find("Circle, Spline").filter(function(element){  return element.selected });
	if(selectedElements.length == 1){

		if(selectedElements[0].className=="Circle"){
			var attrPanelUrl = "/drawn/load_attr_panel/circle";
			var updateFunction = circleFormUpdate;
			var fillFormFunction = circleFormFill;
		}
		else if(selectedElements[0].className=="Spline"){
			var attrPanelUrl = "/drawn/load_attr_panel/spline";
			var updateFunction = splineFormUpdate;
			var fillFormFunction = splineFormFill;
		}
		
		if(typeof elementOnFocus != "undefined"){
			var lastElementOnFocus = elementOnFocus;	
		}
		

		elementOnFocus = {
			isNull: false,
			"element" : selectedElements[0],
			"updateFunction": updateFunction,
			"fillFormFunction": fillFormFunction
		};

		if(typeof lastElementOnFocus != "undefined"){
			try{
				if(lastElementOnFocus.element.getClassName() == elementOnFocus.element.getClassName()){
					elementOnFocus.fillFormFunction();
					return;
				}
			}
			catch(e){ /* Do nothing */}
		} 
		$.ajax({
			url: attrPanelUrl,
			method: "POST",
			success: function(content){
				$("#attr-panel").html(content);
			
				$("#attr-panel .panel-content input[type=text]").keyup(function(){elementOnFocus.updateFunction()});
				$("#attr-panel .panel-content select").change(function(){elementOnFocus.updateFunction()});
				$("#attr-panel .panel-content input[type=range]").change(function(){elementOnFocus.updateFunction()});
				$("#attr-panel .panel-content input[type=range]").click(function(){elementOnFocus.updateFunction()});
				$("#attr-panel .panel-content input[type=checkbox]").click(function(){elementOnFocus.updateFunction()});
				$("#attr-panel .panel-content input[type=radio]").click(function(){elementOnFocus.updateFunction()});

				elementOnFocus.fillFormFunction();
				try{
					$("#fillColor").colorPicker().destroy();
					$("#strokeColor").colorPicker().destroy();
				}
				catch(e){ /* Do nothing */}

				addColorPicker("#fillColor");
				addColorPicker("#strokeColor");

			}
		});
		
	}
	else{
		elementOnFocus = {isNull: true};
	}

}

function circleFormFill(){
	$("#radius").val(elementOnFocus.element.actualLook.radius);
	$("#fillColor").val(elementOnFocus.element.actualLook.fill);
	$("#strokeColor").val(elementOnFocus.element.actualLook.stroke);	
	//$("#fillColor").colpickSetColor(elementOnFocus.element.actualLook.fill);
	//$("#strokeColor").colpickSetColor(elementOnFocus.element.actualLook.stroke);
}
function splineFormFill(){
	$("#strokeColor").val(elementOnFocus.element.actualLook.stroke);
	$("#strokeWidth").val(elementOnFocus.element.actualLook.strokeWidth);
}

function circleFormUpdate(){
	
	elementOnFocus.element.setRadius($("#radius").val());
	elementOnFocus.element.actualLook.radius = $("#radius").val();

	elementOnFocus.element.setFill($("#fillColor").val());
	elementOnFocus.element.actualLook.fill = $("#fillColor").val();

	elementOnFocus.element.setStroke($("#strokeColor").val());
	elementOnFocus.element.actualLook.stroke = $("#strokeColor").val();
	updatedSelectionConfig = updatedSelectionRectAttrs(elementOnFocus.element);

	elementOnFocus.element.selectionRect.setX(updatedSelectionConfig.x);
	elementOnFocus.element.selectionRect.setY(updatedSelectionConfig.y);
	elementOnFocus.element.selectionRect.setWidth(updatedSelectionConfig.width);
	elementOnFocus.element.selectionRect.setHeight(updatedSelectionConfig.height);
	refreshStage();
}
function splineFormUpdate(){
	elementOnFocus.element.setStroke( $("#strokeColor").val() );
	elementOnFocus.element.actualLook.stroke = $("#strokeColor").val();
	elementOnFocus.element.setStrokeWidth( $("#strokeWidth").val() );
	elementOnFocus.element.actualLook.strokeWidth = $("#strokeWidth").val();

	refreshStage();
}

/** Adiciona colorPicker a elementos recem carregados (em um mundo ideal) */
function addColorPicker(idSelector){
	$(idSelector).colpick({
		layout:'hex',
		colorScheme:'dark',
		submit:"Okay",
		color: "f00",
		onChange:function(hsb,hex,rgb,fromSetColor) {
			if(!fromSetColor) $(idSelector).val("#"+hex);
			elementOnFocus.updateFunction();
		},
		onSubmit:function(hsb,hex,rgb,el) {
			$(el).colpickHide();
		}
	});
}
