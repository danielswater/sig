/*
  Módulo: Escola
  Descrição: CRUD Cor e Raça
  Método: GET
  URL: /forms/formCadastroCorRaca
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 13/03/2015
  Autor: HAMZI JALEL
  Versão: 1.0
  Data de Alteração: 13/03/2015
 */
smartSig.registerCtrl("formCadastroCorRaca", function($scope, $http, $routeParams, Mensagem, $timeout, Permissao){

    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    var idCorRaca = $routeParams.id;

    $scope.cor_raca = {};
    $scope.error = '';  
    $scope.cor_raca.ativo=1;
    
    $scope.cadastrarCorRaca = function(objeto) {      

      if ($('#cadastroCorRaca-form').valid()) {

        $scope.json = angular.toJson($scope.cor_raca);
                            
        $http.post('api/index.php/cor_raca/', $scope.json, 
                                       {withCredentials: true,
                                       headers: {'enctype': 'multipart/form-data' },
                                       }
        ).success(function(data, status, headers, config) {
           if (data.error == '0')
           {   

              Mensagem.success(data.mensagem);   
              $scope.cor_raca.id = data.id;              
           }
           else
           {
              Mensagem.error(data.mensagem);
           }
        }).error(function(data, status) { 
          
        });
      }

    }  

    $scope.getIdCorRaca = function(){
      $http.get('api/index.php/cor_raca/1/'+idCorRaca).    
        success(function(data, status, headers, config) {

          $scope.cor_raca = {};

          $scope.cor_raca = data.cor_raca[0];  
          
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }  

    if (idCorRaca != undefined) {
      $scope.getIdCorRaca();
    };



    $scope.novoCadastro = function(){
      $scope.cor_raca = {};
      $scope.cor_raca.ativo = 1;

    }
  
    

});