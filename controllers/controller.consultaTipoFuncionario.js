/*
  Módulo: Escola
  Descrição: CRUD Consulta tipo de funcionário
  Método: GET
  URL: /escolaconsulta/consultaTipoFuncionario
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 11/03/2015
  Autor: Luciano Almeida
  Versão: 1.0
 */

smartSig.registerCtrl('consultaTipoFuncionario', function($scope, $http, $location, $filter, Permissao) {
    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    $scope.tipoFuncionario = [];
    $scope.searchNome = '';

    $http.get('api/index.php/tipofuncionario/1').
        success(function(data, status, headers, config) { 

        if (data.error == 0) {
          $scope.tipoFuncionario  = data.tipofuncionario;
        };   
        
    }).error(function(data, status, headers, config) {
        // log error
    });

    $scope.editCadastro = function(id){
      $location.path('/escolaforms/formCadastroTipoFuncionario/1/'+id);
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