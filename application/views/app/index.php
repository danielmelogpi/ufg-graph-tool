<?=doctype('html5')?>
<!--[if lt IE 7]>		<html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>		 <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>		 <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> 
<html class="no-js"> <!--<![endif]-->
	<head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
		<title><?=lang("window_title")?></title>
		<!-- http://grafolegal.zz.mu/ -->
		<meta name="description" content="">
		<meta name="viewport" content="width=device-width">
		<link href="//netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css" rel="stylesheet">

		<?
		echo link_tag("assets/css/main.css"). "\n";
		echo link_tag("assets/css/bootstrap.css"). "\n";
		echo link_tag("assets/css/colpick.css"). "\n";
		echo script_tag("assets/js/vendor/modernizr-2.6.2-respond-1.1.0.min.js"). "\n";
		?>

		<style>
			body {
				padding-top: 50px;
				padding-bottom: 20px;
			}
		</style>
		

	</head> 
	<body>	
	<!--[if lt IE 7]>
	<p class="chromeframe">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> or <a href="http://www.google.com/chromeframe/?redirect=true">activate Google Chrome Frame</a> to improve your experience.</p>
	<![endif]-->
	<div class="navbar navbar-inverse navbar-fixed-top">
		<div class="container">
		<div class="navbar-header">
			<button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
			<span class="icon-bar"></span>
			<span class="icon-bar"></span>
			<span class="icon-bar"></span>
			</button>
			<a class="navbar-brand" href="#"><?=lang("page_title")?></a>
		</div>
		<div class="navbar-collapse collapse">
			<ul class="nav navbar-nav">
				<li class="dropdown">
				<a href="#" class="dropdown-toggle" data-toggle="dropdown"><?=lang("menu_file_title")?><b class="caret"></b></a>
				<ul class="dropdown-menu">
				<li><a href="#"><?=lang("menu_file_save")?></a></li>
				<li><a href="#"><?=lang("menu_file_export")?></a></li>
				<li><a href="#"><?=lang("menu_file_duplicate")?></a></li>
				<li><a href="#"><?=lang("menu_file_send_email")?></a></li>
				</ul>
			</li>
			<li class="dropdown">
				<a href="#" class="dropdown-toggle" data-toggle="dropdown">Painéis visíveis <b class="caret"></b></a>
				<ul class="dropdown-menu">
				<li class="dropdown-header">Direita</li>
				<li><a href="#">Paleta de desenho</a></li>
				<li><a href="#">Propriedades da forma</a></li>
				<li class="divider"></li>
				<li class="dropdown-header">Rodapé</li>
				<li><a href="#">Console</a></li>
				<li><a href="#">Controles de algoritmo</a></li>
				</ul>
			</li>
			<li class="dropdown">
				<a href="#" class="dropdown-toggle" data-toggle="dropdown">Algoritmos <b class="caret"></b></a>
				<ul class="dropdown-menu">
				<li class="dropdown-header">Interativos</li>
				<li><a href="#">Opção 1</a></li>
				<li><a href="#">Opção 2</a></li>
				<li class="divider"></li>
				<li class="dropdown-header">Passo-à-passo</li>
				<li><a href="#">Opção 3</a></li>
				<li><a href="#">Opção 4</a></li>
				</ul>
			</li>
			<li class="dropdown">
				<a href="#" class="dropdown-toggle" data-toggle="dropdown">Ajuda <b class="caret"></b></a>
				<ul class="dropdown-menu">
				<li class="dropdown-header">Tutorial</li>
				<li><a href="#">Desenvolvendo plugins</a></li>
				<li><a href="#">Manual completo</a></li>
				<li class="divider"></li>
				<li><a href="#">Sobre o projeto</a></li>
				</ul>
			</li>
			</ul>
			
			<ul class="nav navbar-nav navbar-right">
				<li class="dropdown">
				<a href="#" class="dropdown-toggle" data-toggle="dropdown">Prairie Dog<b class="caret"></b></a>
				<ul class="dropdown-menu">
					<li role="presentation" class="dropdown-header"><?=lang("menu_user_title")?></li>
					<li><a href="#"><?=lang("menu_user_my_projects")?></a></li>
					<li><a href="#"><?=lang("menu_user_config")?></a></li>
					<li><a href="#"><?=lang("menu_user_notes")?></a></li>
					
					<li role="presentation" class="divider"></li>
					
					<li role="presentation" class="dropdown-header"><?=lang("language")?></li>
					<li><a href="/language/change_language/pt"><?=lang("menu_user_portuguese")?></a></li>
					<li><a href="/language/change_language/en"><?=lang("menu_user_english")?></a></li>
					<li><a href="/language/change_language/fr"><?=lang("menu_user_french")?></a></li>
					<li><a href="/language/change_language/es"><?=lang("menu_user_spanish")?></a></li>
				</ul>
				</li>
			</ul>
		</div><!--/.navbar-collapse -->
		</div>
	</div>
	
	
	<div class="row">
		<div class="col-md-9">
			<div id="graph-app"><!--Local para a tela de desenho.--></div>	
		</div>
		<div class="col-md-3">
			<div id="draw-panel" class="panel panel-default">
				<div class="panel-heading">
					<!-- <div class="panel-icon"></div> -->
						<h5><?=lang("drawn_title")?></h5>
				</div>
				<div class="panel-body">
					<div class="btn-group">
						<button type="button" 
							title="<?=lang("drawn_selection")?>"
							class="btn btn-sm btn-default btn-info" id="navigationControl">
							<i class="fa fa-hand-o-up"></i>
						</button><button type="button" 
							title="<?=lang("drawn_node")?>"
							class="btn btn-sm btn-default" id="nodeControl">
							<i class="fa fa-circle"></i>
						</button><button type="button" 
							title="<?=lang("drawn_edge")?>"
							class="btn btn-sm btn-default" id="edgeControl">
							<i class="fa fa-minus"></i>
						</button>
					</div>
					<div class="btn-group">
						<button type="button" 
							title="<?=lang("drawn_delete")?>"
							class="btn btn-sm btn-default" id="removeControl">
							<i class="fa fa-times-circle-o"></i>
						</button><button type="button" 
							title="<?=lang("drawn_zoom_plus")?>"
							class="btn btn-sm btn-default zoom" id="zoom-plus" data-scale="0.5">
							<i class="fa fa-search-plus"></i>
						</button><button type="button" 
							title="<?=lang("drawn_zoom_minus")?>"
							class="btn btn-sm btn-default zoom" id="zoom-minus" data-scale="0.5">
							<i class="fa fa-search-minus"></i>
						</button>
					</div>
				</div>
			</div><!-- FIM DO DRAW PANEL -->
			<div class="panel panel-default">
				<div class="panel-heading">
					<ul class="nav nav-pills nav-justified">
						<li id="toogle-console" data-show="panel-console" class="active">
							<a href="#"><i class="fa fa-comment-o"></i></a>
						</li>
						<li id="toogle-attributes" data-show="panel-attributes">
							<a href="#"><i class="fa fa-gears"></i></a>
						</li>
					</ul>	
				</div>
				<div class="panel-body">
					<div id="panel-attributes" style="display: none">
						<ul class="list-group">
						    <li class="list-group-item">
								<div class="input-group input-group-sm">
									<span class="input-group-addon">Cor</span>
									<input type="text" class="form-control" placeholder="Username">
								</div>
								<div class="input-group input-group-sm">
									<span class="input-group-addon">Valor de tal coisa</span>
									<input type="range" class="form-control" name="points" min="1" max="10" step="2">
								</div>
								<div class="input-group input-group-sm">
									<span class="input-group-addon ">Valor de tal coisa</span>
									<select name="" id="" class="form-control">
										<option value="">aas dsds d</option>
										<option value=""> dasd asd</option>
										<option value=""> asd asd</option>
										<option value=""> dsad a</option>
									</select>
								</div>
						    </li>
						</ul>
					</div>
					<div id="panel-console" style="display: auto">
						<ul class="list-group">
						    <li class="list-group-item">Cras justo odio</li>
							<li class="list-group-item">Dapibus ac facilisis in</li>
							<li class="list-group-item">Morbi leo risus</li>
							<li class="list-group-item">Porta ac consectetur ac</li>
							<li class="list-group-item">Vestibulum at eros</li>
						</ul>
					</div>
				</div>
			</div>
		</div><!-- FIM DA COLUNA LATERAL -->
	</div>
	
	<?
	echo script_tag("assets/js/vendor/modernizr-2.6.2-respond-1.1.0.min.js"). "\n";
	echo script_tag("assets/js/jquery.min.js");
	echo script_tag("assets/js/vendor/bootstrap.min.js");
	echo script_tag("assets/js/kinetic-v4.7.4.js");
	
	echo script_tag("assets/js/graphApp/build/GraphApp.js");
	echo script_tag("assets/js/graphApp/Application.js");
	
	?>
	</body>
</html>
