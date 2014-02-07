<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class App extends CI_Controller {

	public function index(){
		$this->load->library("languageSession");
		LanguageSession::setLanguage($this);
		$this->load->helper('language');

		$this->load->helper('html');
		$this->load->view("app/index");
	}

}