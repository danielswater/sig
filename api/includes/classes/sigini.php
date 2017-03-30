<?php
require dirname(__FILE__) . '../../libs/Slim/Slim.php';
require dirname(__FILE__) . '../../libs/sig_init.php';
require dirname(__FILE__) . '../../libs/sig_models.php';

function arrayToIn($array)
{
    $str = "'" . implode("', '", $array) . "'";
    return $str;
}

$hash = "n4Mu6WLI38";

//Load Slim
\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim(array(
        'mode' => 'development',
        'debug' => true
    ));
//CORS
$app->response()->header("Access-Control-Allow-Origin", "*");

$app->get('/logout', function () use ($app, $sig_db) {
    $req = $app->request();
    $url = $req->params('url');

    sigId::destroyUserInfo();
    fSession::destroy();
    fSession::close();
    fURL::redirect($url);
});

$app->get('/logout/:token', function ($token) use ($app, $sig_db) {

    sigId::setUserAuthToken($token);

    sigId::destroyUserInfo();
    fSession::destroy();
    fSession::close();
});


$app->get("/auth_token/:token", function ($token) use ($app, $sig_db) {
    $users = array();
    sigId::setUserAuthToken($token);
    $user = json_decode(sigId::getUserToken(), true);
    if ($user) {
        $users[] = $user;
    }
    $app->response()->header("Content-Type", "application/json");
    echo json_encode($users);
});



$app->run();
