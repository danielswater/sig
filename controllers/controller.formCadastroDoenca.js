/*
  Módulo: Escola
  Descrição: CRUD Doença
  Método: POST(cadastraDoenca)/GET(getIdDoenca)
  URL: /forms/formCadastroDoenca
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 07/03/2015
  Autor: Ricardo Nakadomari
  Versão: 1.0
  Data de Alteração: 07/03/2015
 */
smartSig.registerCtrl("formCadastroDoenca", function($scope, $http, $routeParams, Mensagem, $timeout, Permissao){
    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    var idDoenca = $routeParams.id;

    $scope.doenca = {};
    $scope.error = '';  
    $scope.doenca.ativo=1;
    $scope.doenca.interfere_rendimento=0;

    $scope.cadastrarDoenca = function(objeto) {      
      if ($('#cadastroDoenca-form').valid()) {
        $scope.json = angular.toJson($scope.doenca);
                            
        $http.post('api/index.php/doenca/', $scope.json, 
                                       {withCredentials: true,
                                       headers: {'enctype': 'multipart/form-data' },
                                       }
        ).success(function(data, status, headers, config) {
           if (data.error == '0') {
              $scope.objeto = {}; 

              Mensagem.success(data.mensagem);
              //console.log(data);
              //$scope.doenca.ativo=1;
              $scope.doenca.id = data.id_doenca;
           }
           else {
              Mensagem.error(data.mensagem);   
           }
        }).error(function(data, status) {

        });
      }
    }

    $scope.novoCadastro = function(){
      $scope.doenca = {};
      $scope.doenca.ativo = 1;
      $scope.doenca.interfere_rendimento=0;
    }

    $scope.getIdDoenca = function(){
      $http.get('api/index.php/doenca/1/'+idDoenca).
        success(function(data, status, headers, config) {
          $scope.doenca = data.doenca[0];
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }     

    if (idDoenca != undefined) {
      $timeout(function() {
        $scope.getIdDoenca(idDoenca);
      }, 800);
    };
});