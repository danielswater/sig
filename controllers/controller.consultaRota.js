/*
  Módulo: Escola
  Descrição: CRUD Consulta Duração Fase
  Método: GET
  URL: /consulta/consultaRota
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 29/05/2015
  Autor: Fábio Roberto Haydn    
  Versão: 1.0
*/

smartSig.registerCtrl('consultaRota', function($scope, $http, $location, $filter, Permissao){
    $scope.permissoes = Permissao.validaPermissao();

    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    $scope.rotas = [];

    $http.get('api/index.php/rota/')
      .success(function(data, status, headers, config) {
        if (data.error == 0) {
          $scope.rotas = data.rota;
        };
      })
      .error(function(data, status, headers, config) { });

    $scope.editCadastro = function(id){
      $location.path('/escolaforms/formCadastroRota/1/'+id)
    }
    
    $scope.currentPage = 1;
    $scope.pageSize = 10;

    $scope.sort = {
        active: 'descricao',
        descending: undefined
    }

    $scope.changeSorting = function(column) {
        var sort = $scope.sort;
        if (sort.active == column) {
            sort.descending = !sort.descending;
        } else {
            sort.active = column;
            sort.descending = false;
        }
    };

    $scope.getIcon = function(column) {
        var sort = $scope.sort;
        if (sort.active == column) {
          return sort.descending
            ? 'glyphicon-chevron-up'
            : 'glyphicon-chevron-down';
        }
        return 'glyphicon-star';
    }
});

//@ sourceURL=controller.consultaRota.js