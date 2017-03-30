<?php
    $root = realpath(dirname(__FILE__)). '/libs/Slim/';
	include($root . 'Slim.php');
	\Slim\Slim::registerAutoloader();