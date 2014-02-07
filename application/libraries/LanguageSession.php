<?php
if ( ! defined('BASEPATH')) exit('No direct script access allowed'); 

class LanguageSession{

	/* Utilizada pelas controllers para ajustar o idioma a ser carregado para elas e para as views */
	public static function setLanguage( &$controller ){
		session_start();
		if(!isset($_SESSION['lang'])){
			$_SESSION['lang'] = 'pt';
		}

		switch ($_SESSION['lang']) {
			case 'es':
				$controller->lang->load('drawn_interface', 'es');
				break;
			case 'en':
				$controller->lang->load('drawn_interface', 'en');
				break;
			case 'fr':
				$controller->lang->load('drawn_interface', 'fr');
				break;
			default:
				$controller->lang->load('drawn_interface', 'pt');
				break;
		}
	}

}
?>