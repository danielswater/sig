<?php

	include dirname(__FILE__) . '/flourish_init.php';	
	include dirname(__FILE__) . '/sigId_DbWrapper.php';
	

	// Time, consult http://br2.php.net/manual/en/timezones.php for a list of supported timezones
	fTimestamp::setDefaultTimezone('America/Sao_Paulo');
	
	

	$sig_db = new sigId_DbWrapper(new fDatabase(DB_TYPE, ID_DB_NAME, ID_DB_USER, ID_DB_PASS, ID_DB_HOST));

	try {
	    $db = new fDatabase('mysql', ID_DB_NAME, ID_DB_USER, ID_DB_PASS, ID_DB_HOST);
	    $db->connect();
	 	fORMDatabase::attach($db);
	} catch (fAuthorizationException $e) {
	    $e->printMessage();
	}
//        $db->enableDebugging(TRUE);
