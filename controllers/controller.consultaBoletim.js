/*
  Módulo: Escola
  Descrição: CRUD Consulta tipo de bloqueio
  Método: GET
  URL: /consulta/consultaTipoBloqueio
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 25/02/2015
  Autor: Daniel Swater
  Versão: 1.0
 */

smartSig.registerCtrl('consultaBoletim', function($scope, $http, $location, $filter, Permissao) {
    
    $scope.permissoes = Permissao.validaPermissao();

    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

   $scope.boletins = [];

    $scope.searchNome = '';

    $http.get('api/index.php/boletim/').    
      success(function(data, status, headers, config) { 
        if (data.error == 0) {
          $scope.boletins  = data.boletim;
        };                               
      }).
      error(function(data, status, headers, config) {
        // log error
    });


    $scope.editCadastro = function(id){
      $location.path('/escolaforms/formCadastroBoletim/1/'+id)
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