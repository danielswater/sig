/*
  Módulo: Mesquita
  Descrição: CRUD Tipo de Fornecedor
  Método: GET
  URL: /consulta/consultaTipoFornecedor
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 21/12/2014
  Autor: Ricardo Bruno
  Versão: 1.0
  Data de Alteração: 21/12/2014
 */
smartSig.registerCtrl('consultaTipoFornecedor', function($scope, $http, $location, $filter, filterFilter, $timeout, Permissao, $routeParams) {
    
    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    //var tipofornecedor = Array();
    $scope.fornecedor = [];

    $scope.searchNome = '';

    $http.get('api/index.php/tipofornecedor/1').    
      success(function(data, status, headers, config) {                                 
         $scope.fornecedor  = data.tipofornecedor;

         //$scope.tabelaConsulta();
      }).
      error(function(data, status, headers, config) {
        // log error
    });

    $scope.editCadastro = function(id){
      $location.path('/forms/formCadastroTipoFornecedor/1/'+id)
    }      
    
    $scope.filtro = function(){
      $scope.counter++;
      console.log($scope.counter);
    }
    
    $scope.$watch("searchNome", function(q){
      console.log(q);
        //$scope.filteredData = $filter("filter")($scope.data, query);
    });
    
    $scope.tabelaConsulta = function(){
      $scope.tableParams = new ngTableParams({
          page: 1,            // show first page
          count: 10,          // count per page
          filter: {
              descricao: ''       // initial filter
          },
          sorting: {
              descricao: 'asc'     // initial sorting
          }
      }, {
          total: tipofornecedor.length, // length of data
          getData: function($defer, params) {
              // use build-in angular filter
              var filteredData = params.filter() ?
                      $filter('filter')(tipofornecedor, params.filter()) :
                      tipofornecedor;
              var orderedData = params.sorting() ?
                      $filter('orderBy')(filteredData, params.orderBy()) :
                      tipofornecedor;

              params.total(orderedData.length); // set total for recalc pagination
              $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
          }
      });
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