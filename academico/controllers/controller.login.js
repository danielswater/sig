
var login = angular.module('login',['ngAnimate']);

login.controller('controller.login', ['$scope','$http','$timeout', function($scope,$http,$timeout, $rootScope) {

	$scope.login = [];

	$scope.esqueceu = {};

	$scope.novasenha = false;
	$scope.esqueceuSenha = false;
	$scope.errorMessage = '';

	$scope.validaLogin = function(){

		if ($('#login-form').valid()) {

			if ($scope.novasenha == true) {  			
				if ($scope.senha != $scope.senharepeat) {
					$('.alertaLogin').html('Senhas não conferem');                      
					$('#login .alert').slideDown();     
					console.log('repete');                 
					return;
				};
			};

			$http.get('../api/index.php/autentica_usuario?&login='+$scope.login.usuario+'&pwd='+$scope.login.senha+'&trocarsenha='+$scope.trocarsenha).    
			success(function(data, status, headers, config) {
            //user.auth_token

            if(data['error']=='-1'){
            	$scope.errorMessage = data.errorMsg;
            	$scope.showMessage = true;
            	$timeout(function(){
            		$timeout(function(){
            			$scope.showMessage = false;
            		}, 3000);
            	},2000);
            }          

            if(data['error']=='-2'){
            	$scope.errorMessage = data.errorMsg;
            	$scope.showMessage = true;
            	$scope.novasenha = true;
            	$timeout(function(){
            		$timeout(function(){
            			$scope.showMessage = false;
            		},3000);
            	},2000);
            	$scope.trocarsenha = 1;
            	return;
            }

            if(data['error']=='-3'){
            	$scope.errorMessage = data.errorMsg;
            	$scope.showMessage = true;
            	$scope.novasenha = true;
            	$timeout(function(){
            		$timeout(function(){
            			$scope.showMessage = false;
            		},3000);
            	},2000);
            	$scope.trocarsenha = 1;
            	return;
            }

            if(data['error']=='0'){
            	window.location.href = 'dashboard.html';
            }

        }).
error(function(data, status, headers, config) {

          // log error
      });
}
}

$scope.esqueceuSenhaShowHide = function(str){
	$scope.esqueceuSenha = str;
}

/*  $scope.enviarEmail = function(){
    console.log('enviarEmail', $scope.esqueceu);
    if ($('#login-form').valid()) {
      
        $scope.json = angular.toJson($scope.esqueceu);
                            
        $http.post('api/index.php/esqueceusenha/', $scope.json, 
                                       {withCredentials: true,
                                       headers: {'enctype': 'multipart/form-data' },
                                       }
        ).success(function(data, status, headers, config) {
           if (data.error == '0'){  
              $scope.esqueceuSenhaShowHide(false);
           }else{
              $('.alertaLogin').html(data.mensagem);                      
              $('#esqueceu .alert').slideDown();                      
              $scope.esqueceuSenhaShowHide(true);
           }
        }).error(function(data, status) { 
          
        });
      }
  }*/
}]);