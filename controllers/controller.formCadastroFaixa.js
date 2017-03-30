/*
  Módulo: Escola
  Descrição: CRUD Faixa
  Método: GET
  URL: /forms/formCadastroFaixa
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 16/03/2015
  Autor: HAMZI JALEL
  Versão: 1.0
  Data de Alteração: 16/03/2015
 */
smartSig.registerCtrl("formCadastroFaixa", function($scope, $http, $routeParams, Mensagem, $timeout, Permissao){

    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    var idFaixa = $routeParams.id;

    $scope.faixa = {};
    $scope.error = '';  
    $scope.faixa.ativo=1;
    
    $scope.cadastrarFaixa = function(objeto) {      

      if ($('#cadastroFaixa-form').valid()) {

        $scope.json = angular.toJson($scope.faixa);
                            
        $http.post('api/index.php/faixa/', $scope.json, 
                                       {withCredentials: true,
                                       headers: {'enctype': 'multipart/form-data' },
                                       }
        ).success(function(data, status, headers, config) {
           if (data.error == '0')
           {   
              Mensagem.success(data.mensagem);   
              $scope.faixa.id = data.id;              
           }
           else
           {
              Mensagem.error(data.mensagem);   
           }
        }).error(function(data, status) { 
          
        });
      }

    }  

    $scope.getIdFaixa = function(){
      $http.get('api/index.php/faixa/1/'+idFaixa).    
        success(function(data, status, headers, config) {

          $scope.faixa = {};

          $scope.faixa = data.faixa[0];  
          
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }  

    if (idFaixa != undefined) {
      $scope.getIdFaixa();
    };

    $scope.novoCadastro = function(){

      $scope.faixa = {};
      $scope.faixa.ativo = 1;

    }

});