/*
  Módulo: Escola
  Descrição: CRUD Feriado
  URL: /gestao/consultaFeriado
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 27/02/2015
  Autor: Hamzi Jalel
  Versão: 1.0
  Data de Alteração: 27/02/2015
 */
smartSig.registerCtrl('consultaFeriado', function($scope, $http, $location, $filter, filterFilter, $timeout, Permissao, $routeParams) {
    
    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    $scope.feriado = [];

    $scope.searchNome = '';

    $http.get('api/index.php/feriado/1').    
      success(function(data, status, headers, config) {                                 
         
         $scope.feriado  = data.feriado;
         
         console.log('DADOS:',$scope.feriado);

      }).
      error(function(data, status, headers, config) {
        // log error
    });

    $scope.editCadastro = function(id){
      //console.log('ID:',id);
      $location.path('/escolaforms/formCadastroFeriado/1/'+id)
    }      
    
    $scope.filtro = function(){
      $scope.counter++;
      console.log($scope.counter);
    }
    
    $scope.$watch("searchNome", function(q){
      console.log(q);
        //$scope.filteredData = $filter("filter")($scope.data, query);
    });
    
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