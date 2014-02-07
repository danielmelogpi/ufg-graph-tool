<div class="panel-title">
	<div class="panel-icon">##</div>
	<?=lang("attr_panel_circle_title")?>
	</div>
	<div class="panel-content">
		<div class="row ">
			<div class="col-md-6"><?=lang("attr_panel_circle_radius")?></div>
			<div class="col-md-6"><input type="range" name="points" min="8" max="40" step="0.1" id="radius"></div>
		</div>
		<div class="row ">
			<div class="col-md-6"><?=lang("attr_panel_circle_color")?></div>
			<div class="col-md-6">
				<input type="text" id="fillColor" class="colpick-active form-control">
			</div>
		</div>
		<div class="row">
			<div class="col-md-6"><?=lang("attr_panel_circle_border")?></div>
			<div class="col-md-6">
				<input type="text" id="strokeColor" value="" class="colpick-active form-control">
			</div>
		</div>
	</div>
</div>
