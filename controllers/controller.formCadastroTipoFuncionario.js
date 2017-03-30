/*
  Módulo: Escola
  Descrição: CRUD Tipo de Funcionário
  Método: POST(cadastrarTipoFuncionario)/GET(getIdTipoFuncionario)
  URL: /escolaforms/formCadastroTipoFuncionario
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 11/03/2015
  Autor: Luciano Almeida
  Versão: 1.0
 */

smartSig.registerCtrl("formCadastroTipoFuncionario", function($scope, $http, $routeParams, Mensagem, $timeout, Permissao){
    $scope.permissoes = Permissao.validaPermissao();


    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    var idTipoFuncionario = $routeParams.id;

    $scope.tipoFuncionario = {};
    $scope.error = '';  
    $scope.tipoFuncionario.ativo=1;

    $scope.cadastrarTipoFuncionario = function(objeto) {
      if ($('#cadastroTipoFuncionario-form').valid()) {
        $scope.json = angular.toJson($scope.tipoFuncionario);

        $http.post('api/index.php/tipofuncionario/', $scope.json, 
          {withCredentials: true,
            headers: {'enctype': 'multipart/form-data' },
          }
        ).success(function(data, status, headers, config) {
           if (data.error != -1){
              //$scope.objeto = {};

              Mensagem.success(data.mensagem);   

              //$scope.tipoFuncionario.ativo=1;
              $scope.tipoFuncionario.id = data.id;
           }
           else {
              Mensagem.error(data.mensagem);   
           }
        }).error(function(data, status) {

        });
      }
    }

    $scope.getIdTipoFuncionario = function(){
      $http.get('api/index.php/tipofuncionario/1/'+idTipoFuncionario).    
        success(function(data, status, headers, config) {
          $scope.tipoFuncionario = data.tipofuncionario[0];
          console.log($scope.tipoFuncionario);
        }).
        error(function(data, status, headers, config) {
          // log error
        });
    }     

    if (idTipoFuncionario != undefined) {
      $timeout(function() {
        $scope.getIdTipoFuncionario(idTipoFuncionario);
      }, 800);
    };

    $scope.novoCadastro = function(){
      $scope.tipoFuncionario = {};
      $scope.tipoFuncionario.ativo = 1;
    }  

});