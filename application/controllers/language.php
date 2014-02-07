<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Language extends CI_Controller {
	public function change_language($lang){
		session_start();
		$_SESSION['lang'] = $lang;
		$this->load->helper('url');
		redirect($this->input->server("HTTP_REFERER"));
	}
}