var login = angular.module('login',[]);

login.controller('controller.login', ['$scope','$http','$location', function($scope,$http,$location) {

  var url = $location.absUrl();

  $scope.login = [];

  $scope.esqueceu = {};

  $scope.novasenha = false;
  $scope.esqueceuSenha = false;

  $scope.modulos = [
	{nome:"Módulo de Gestão", value:"0"},
	{nome:"Sys SBM", value:"1"},
	{nome:"Sys Cem",value:"2"},
	{nome:"Sys Esc",value:"3"},
  {nome:"Dashboard",value:"4"},
  ];

  $scope.login.modulo = '';

  $scope.selecionado = 0

  if(url.toLowerCase().indexOf('sbm') > -1) {
       $scope.selecionado = 1;
       $scope.login.modulo = 1;
  }
  if(url.toLowerCase().indexOf('cem') > -1) {
       $scope.selecionado = 2;
       $scope.login.modulo = 2;
  }
  if(url.toLowerCase().indexOf('esc') > -1) {
       $scope.selecionado = 3;
       $scope.login.modulo = 3;
  }
  if(url.toLowerCase().indexOf('das') > -1) {
       $scope.selecionado = 4;
       $scope.login.modulo = 4;
  }

  console.log($scope.selecionado)
  

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

  		$http.get('api/index.php/autentica?&login='+$scope.login.usuario+'&pwd='+$scope.login.senha+'&modulo='+$scope.login.modulo+'&trocarsenha='+$scope.trocarsenha).    
        success(function(data, status, headers, config) {

        	  if(data['error']=='-1'){
              $('.alertaLogin').html(data['errorMsg']);                      
              $('#login .alert').slideDown();                      
              return;
            }          

            if(data['error']=='-2'){
              $('.alertaLogin').html(data['errorMsg']);                      
              $('#login .alert').slideDown();                      
              $scope.novasenha = true;
              $scope.trocarsenha = 1;
              return;
            }

            if(data['error']=='-3'){
              $('.alertaLogin').html(data['errorMsg']);                      
              $('#login .alert').slideDown();                      
              $scope.novasenha = true;
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

  $scope.enviarEmail = function(){
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
  }
}]);
//@ sourceURL=controller.login.js