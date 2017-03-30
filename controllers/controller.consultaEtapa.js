/*
  Módulo: Escola
  Descrição: CRUD Consulta etapa
  Método: GET
  URL: /consulta/consultaEtapa
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 25/02/2015
  Autor: Daniel Swater
  Data de Alteração: 13/03/2015
  Autor: Luciano Almeida
  Versão: 1.0
 */
smartSig.registerCtrl('consultaEtapa', function($scope, $http, $location, $filter, Permissao) {
    $scope.permissoes = Permissao.validaPermissao();

    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    $scope.etapa = [];
    $scope.etapa.data_inicio = [];
    $scope.etapa.data_fim = [];
    $scope.searchNome = '';

    $http.get('api/index.php/etapa/1').
      success(function(data, status, headers, config) {
        if (data.error == 0) {
          $scope.etapa  = data.etapa;
          console.log($scope.etapa);
        };
      }).error(function(data, status, headers, config) {
        // log error
    });

    $scope.editCadastro = function(id){
      $location.path('/escolaforms/formCadastroEtapa/1/'+id)
    }
    
    $scope.currentPage = 1;
    $scope.pageSize = 10;

    $scope.sort = {
        active: 'nome',
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