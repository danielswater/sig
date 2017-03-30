/*
  Módulo: Escola
  Descrição: CRUD Consulta Duração Fase
  Método: GET
  URL: /consulta/consultaMotorista
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 29/05/2015
  Autor: Fábio Roberto Haydn    
  Versão: 1.0
*/

smartSig.registerCtrl('consultaConversoes', function($scope, $http, $location, $filter, Permissao) {
    $scope.permissoes = Permissao.validaPermissao();

    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    $scope.motoristas = [];
    $scope.searchNome = '';

    $http.get('api/index.php/conversoes')
      .success(function(data, status, headers, config) {
        if (data.error == 0) {
          $scope.conversoes = data.retorno;
        };
      })
      .error(function(data, status, headers, config) { });

    $scope.editCadastro = function(id){
      $location.path('/forms/formCadastroConversoes/1/'+id)
    }
    
    $scope.excluir = function(idx,item){    

      $scope.tmp = {};      
      $scope.tmp.id = item.id;

      $scope.json = angular.toJson($scope.tmp);
      $http.post('api/index.php/delconversoes/', $scope.json, {withCredentials: true, headers: {'enctype': 'multipart/form-data' },})

      .success(function(data, status, headers, config) {
        $scope.conversoes.splice(idx, 1);

      }).error(function(data, status, headers, config) { });
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

//@ sourceURL=controller.consultaConversoes.js