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
	
	<!--Local para a tela de desenho. O kinetic coloca a canvas aqui dentro-->
	<div id="graph-app"></div>
		

	<div id="draw-panel" class="well well-sm">
		<div class="panel-title">
			<!-- <div class="panel-icon"></div> -->
				<?=lang("drawn_title")?>
			</div>
		<div class="panel-content">
			<button type="button" class="btn btn-default" id="navigationControl"><?=lang("drawn_selection")?></button>
			<button type="button" class="btn btn-default" id="nodeControl"><?=lang("drawn_node")?></button>
			<button type="button" class="btn btn-default" id="edgeControl"><?=lang("drawn_edge")?></button>
			<button type="button" class="btn btn-default" id="removeControl"><?=lang("drawn_delete")?></button>
			<button type="button" class="btn btn-default zoom" id="zoom-plus" data-scale="0.5"><?=lang("drawn_zoom_plus")?></button>
			<button type="button" class="btn btn-default zoom" id="zoom-minus" data-scale="0.5"><?=lang("drawn_zoom_minus")?></button>
			

		</div>
	</div>
	
	<div class="bottom-bar">
		<!-- Console -->
		<div id="console-panel" class="well well-sm bottom-bar-subpanel">
			<div class="panel-title">
				<div class="panel-icon">##</div>
				Console
			</div>
			<div class="panel-content">
				<div class="row">
					<div class="col-md-1">i</div>
					<div class="col-md-11">this is the last message from the programmer</div>
				</div>
				<div class="row">
					<div class="col-md-1">i</div>
					<div class="col-md-11">this is a message from the programmer</div>
				</div>
				<div class="row">
					<div class="col-md-1">i</div>
					<div class="col-md-11">this is a message from the programmer</div>
				</div>
				<div class="row">
					<div class="col-md-1">i</div>
					<div class="col-md-11">this is a message from the programmer</div>
				</div>
				<div class="row">
					<div class="col-md-1">i</div>
					<div class="col-md-11">this is a message from the programmer</div>
				</div>
				<div class="row">
					<div class="col-md-1">i</div>
					<div class="col-md-11">this is the first a message from the programmer</div>
				</div>
			</div>
		</div>
		<!-- FIM Console -->
		<!-- Atributos -->
		<div id="attr-panel" class="well well-sm bottom-bar-subpanel"> 
			<div class="panel-title">
				<div class="panel-icon">##</div>
				Painel de atributos
			</div>
			<div class="panel-content">
			</div>
		</div>
		<!-- Fim Atributos -->
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
