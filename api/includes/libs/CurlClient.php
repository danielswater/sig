<?php

class CurlClient {
		protected $_baseUrl;
		protected $_serviceUrl;
		protected $_headers = array();
		protected $_useCookies;

		public function __construct( $baseUrl, $serviceUrl , $useCookies = false) {
			$this->_baseUrl = $baseUrl;
			$this->_serviceUrl = $serviceUrl;
			$this->_headers[] = 'Content-type: application/json';
			$this->_useCookies = $useCookies;
		}

		public function setUrl( $serviceUrl ) {
			$this->_serviceUrl = $serviceUrl;
		}

		public function addHeader($header) {
			$this->_headers[] = $header;
		}

		public function defaultHeaders() {
			$this->_headers = array('Content-type: application/json');
		}

		public function get() {
			$options = array(
				CURLOPT_RETURNTRANSFER => true,
				CURLOPT_HTTPHEADER => $this->_headers
			);
			if($this->_useCookies === true){
				$options[CURLOPT_COOKIEJAR] = sys_get_temp_dir().'cookies.txt';
				$options[CURLOPT_COOKIEFILE] = sys_get_temp_dir().'cookies.txt';
			}

			return $this->doCall($options);
		}

		public function post($arraydata) {
			$options = array(
				CURLOPT_RETURNTRANSFER => true,
				CURLOPT_HTTPHEADER => $this->_headers ,
				CURLOPT_POSTFIELDS => json_encode($arraydata)
			);
			if($this->_useCookies === true){
				$options[CURLOPT_COOKIEJAR] = sys_get_temp_dir().'cookies.txt';
				$options[CURLOPT_COOKIEFILE] = sys_get_temp_dir().'cookies.txt';
			}


			return $this->doCall($options);
		}

		public function put($arraydata) {
			$options = array(
				CURLOPT_RETURNTRANSFER => true,
				CURLOPT_HTTPHEADER => $this->_headers ,
				CURLOPT_POSTFIELDS => json_encode($arraydata),
				CURLOPT_CUSTOMREQUEST => 'PUT'
			);
			if($this->_useCookies === true){
				$options[CURLOPT_COOKIEJAR] = sys_get_temp_dir().'cookies.txt';
				$options[CURLOPT_COOKIEFILE] = sys_get_temp_dir().'cookies.txt';
			}


			return $this->doCall($options);
		}

		public function delete() {
			$options = array(
				CURLOPT_RETURNTRANSFER => true,
				CURLOPT_HTTPHEADER => $this->_headers ,
				CURLOPT_CUSTOMREQUEST => 'DELETE'
			);
			if($this->_useCookies === true){
				$options[CURLOPT_COOKIEJAR] = sys_get_temp_dir().'cookies.txt';
				$options[CURLOPT_COOKIEFILE] = sys_get_temp_dir().'cookies.txt';
			}


			return $this->doCall($options);
		}

		public function doCall($curloptions) {
//			var_dump($curloptions);
			$ch = curl_init($this->_baseUrl . $this->_serviceUrl);
			curl_setopt_array( $ch, $curloptions );
			$response = curl_exec($ch);
			if(curl_errno($ch))
			{
				echo 'curl error:' . curl_error($ch) . " when calling $this->_baseUrl$this->_serviceUrl\n";
			}
			curl_close($ch);
			if(!$response) {
				return false;
			} else {
				return $response;
			}
		}

}