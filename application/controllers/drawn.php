<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Drawn extends CI_Controller {

	public function index(){
		$this->load->library("languageSession");
		LanguageSession::setLanguage($this);
		$this->load->helper('language');

		$this->load->helper('html');
		$this->load->view("drawn/index");
	}

	/** Carrega os paineis para edição dos elementos */
	public function load_attr_panel($panelType){
		$this->load->library("languageSession");
		LanguageSession::setLanguage($this);
		$this->load->helper('language');
		
		$allowedTypes = array("circle","spline");
		if(in_array($panelType, $allowedTypes)){
			$this->load->view("drawn/attr-panel/".$panelType.".php");	
		}
	}

}