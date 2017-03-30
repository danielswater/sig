<?php
	if ($_SERVER['HTTP_HOST']=='localhost' || $_SERVER['HTTP_HOST']=='127.0.0.1') {
		define('DEPLOY_CONFIG', 'DEV');
	} else if(strpos($_SERVER['HTTP_HOST'], "10.10.17.49")!==FALSE){
		define('DEPLOY_CONFIG', 'HOMOLOG');
	} else if(strpos($_SERVER['HTTP_HOST'], "10.10.17.51")!==FALSE){
		define('DEPLOY_CONFIG', 'HOMOLOG2');			
	} else if(strpos($_SERVER['HTTP_HOST'], "sig.mesquitabrasil.com.br")!==FALSE){
		define('DEPLOY_CONFIG', 'PROD');
	}
	else define('DEPLOY_CONFIG', 'DEV');

	// var_dump(DEPLOY_CONFIG);

	//definindo urls
	/*if (DEPLOY_CONFIG == 'DEV') {
		//find virtual user name from url (localhost/~username/stuff)
		$vhosturi 	= $_SERVER['PHP_SELF'];
		$vhoststart = strpos($vhosturi, '~');
		$vhostend 	= strpos($vhosturi, '/', $vhoststart);
		$vhostname 	= substr($vhosturi, $vhoststart+1, $vhostend-$vhoststart-1);
		
		define('ID_CACHE_SERVER'	, '127.0.0.1');
		define('ID_COOKIE_DOMAIN'	, '');		
		define('DB_TYPE', 'mysql');
		define('ID_DB_NAME'				, 'sbm_sig');
		define('ID_DB_USER'				, 'root');
		define('ID_DB_PASS'				, '');
		define('ID_DB_HOST'				, '127.0.0.1');
		define('realPath', 'var/www/sig/api/');	
		define('rota', '127.0.0.1/site/sig/');	

		/*define('ID_CACHE_SERVER'	, '10.10.17.51');
		define('ID_COOKIE_DOMAIN'	, '');		
		define('DB_TYPE', 'mysql');
		define('ID_DB_NAME'				, 'sbm');
		define('ID_DB_USER'				, 'root');
		define('ID_DB_PASS'				, 'Marabraz@123');
		define('ID_DB_HOST'				, '10.10.17.51');
		define('realPath', 'var/www/sig/api/');	
		define('rota', '10.10.17.51/sig/');	
	}*/

	if (DEPLOY_CONFIG == 'DEV') {
		//find virtual user name from url (localhost/~username/stuff)
		$vhosturi 	= $_SERVER['PHP_SELF'];
		$vhoststart = strpos($vhosturi, '~');
		$vhostend 	= strpos($vhosturi, '/', $vhoststart);
		$vhostname 	= substr($vhosturi, $vhoststart+1, $vhostend-$vhoststart-1);
		
		define('ID_CACHE_SERVER'	, 'localhost');
		define('ID_COOKIE_DOMAIN'	, '');		
		define('DB_TYPE', 'mysql');
		define('ID_DB_NAME'				, 'sbm_sig');
		define('ID_DB_USER'				, 'root');
		define('ID_DB_PASS'				, '');
		define('ID_DB_HOST'				, 'localhost');
		define('realPath', 'var/www/sig/api/');	
		define('rota', '10.10.17.51/sig/');	
	}

	if (DEPLOY_CONFIG == 'HOMOLOG') {
		//find virtual user name from url (localhost/~username/stuff)
		$vhosturi 	= $_SERVER['PHP_SELF'];
		$vhoststart = strpos($vhosturi, '~');
		$vhostend 	= strpos($vhosturi, '/', $vhoststart);
		$vhostname 	= substr($vhosturi, $vhoststart+1, $vhostend-$vhoststart-1);
		
		define('ID_CACHE_SERVER'	, 'localhost');
		define('ID_COOKIE_DOMAIN'	, '');		
		define('DB_TYPE', 'mysql');
		define('ID_DB_NAME'				, 'gestaosbm');
		define('ID_DB_USER'				, '82004833');
		define('ID_DB_PASS'				, '');
		define('ID_DB_HOST'				, '10.10.17.89');
		define('realPath', 'var/www/sig/api/');	
		define('rota', '10.10.17.49/sig/');	
	}	

	if (DEPLOY_CONFIG == 'HOMOLOG2') {
		//find virtual user name from url (localhost/~username/stuff)
		$vhosturi 	= $_SERVER['PHP_SELF'];
		$vhoststart = strpos($vhosturi, '~');
		$vhostend 	= strpos($vhosturi, '/', $vhoststart);
		$vhostname 	= substr($vhosturi, $vhoststart+1, $vhostend-$vhoststart-1);
		
		define('ID_CACHE_SERVER'	, '10.10.17.51');
		define('ID_COOKIE_DOMAIN'	, '');		
		define('DB_TYPE', 'mysql');
		define('ID_DB_NAME'				, 'sbm');
		define('ID_DB_USER'				, 'root');
		define('ID_DB_PASS'				, 'Marabraz@123');
		define('ID_DB_HOST'				, '10.10.17.51');
		define('realPath', 'var/www/sig/api/');	
		define('rota', '10.10.17.51/sig/');	
	}	

	if (DEPLOY_CONFIG == 'PROD') {
		//find virtual user name from url (localhost/~username/stuff)
		$vhosturi 	= $_SERVER['PHP_SELF'];
		$vhoststart = strpos($vhosturi, '~');
		$vhostend 	= strpos($vhosturi, '/', $vhoststart);
		$vhostname 	= substr($vhosturi, $vhoststart+1, $vhostend-$vhoststart-1);
		
		define('ID_CACHE_SERVER'	, 'sig.mesquitabrasil.com.br');
		define('ID_COOKIE_DOMAIN'	, '');		
		define('DB_TYPE', 'mysql');
		define('ID_DB_NAME'				, 'sbm_sig');
		define('ID_DB_USER'				, 'us_apl');
		define('ID_DB_PASS'				, '1!sB&3ro!ymara');
		define('ID_DB_HOST'				, 'sbm-sig.cirsnpd0seq3.us-east-1.rds.amazonaws.com');
		define('realPath', 'var/www/sig/api/');	
		define('rota', 'sig.mesquitabrasil.com.br/sig/');	
	}	

  include 'libs/sig_init.php';
  include 'libs/sig_models.php';    
  include 'libs/sigId.php';
  include 'slim_init.php';

  include 'classes/SIG.php';
  include 'libs/CurlClient.php';

  require_once 'libs/html2pdf/html2pdf.class.php';
  include "includes/libs/boletophp-master/include/funcoes_cef.php"; 
  
  error_reporting(E_ALL ^ E_NOTICE);
  require_once 'includes/libs/excel_reader/excel_reader2.php';