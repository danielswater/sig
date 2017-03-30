/*
  Módulo: Mesquita
  Descrição: CRUD Categorias
  Método: GET
  URL: /forms/formCadastroTipoInformativo
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 14/03/2015
  Autor: Luciano Almeida
  Versão: 1.0
 */
smartSig.registerCtrl("formCadastroTipoInformativo", function($scope, $http, $routeParams, Mensagem, $timeout, Permissao){
    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    var idTipoInformativo = $routeParams.id;

    $scope.tipoinformativo = {};
    $scope.error = '';  
    $scope.tipoinformativo.ativo = 1;

    $scope.cadastrarTipoInformativo = function(objeto) {
      if ($('#cadastroTipoInformativo-form').valid()) {
        $scope.json = angular.toJson(objeto);

        $http.post('api/index.php/tipoinformativo/', $scope.json, 
                   {withCredentials: true,
                     headers: {'enctype': 'multipart/form-data' },
                   }
        ).success(function(data, status, headers, config) {
           if (data.error != -1) {
              //$scope.objeto = {}; 

              Mensagem.success(data.mensagem);

              $scope.tipoinformativo.id = data.id;
           } else {
              Mensagem.error(data.mensagem);
           }
        }).error(function(data, status) { 
          // log error
        });
      }
    }  

    $scope.getIdTipoInformativo = function(){
      $http.get('api/index.php/tipoinformativo/1/'+idTipoInformativo).
        success(function(data, status, headers, config) {
          $scope.tipoinformativo = data.tipoinformativo[0];

          console.log($scope.tipoinformativo);
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }  

    if (idTipoInformativo != undefined) {
      $timeout(function() {
        $scope.getIdTipoInformativo();
      }, 800);
    };

    $scope.novoCadastro = function(){
      $scope.tipoinformativo = {};
      $scope.tipoinformativo.ativo = 1;
    }

});