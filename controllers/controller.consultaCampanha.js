/*
  Módulo: Mesquita
  Descrição: CRUD Campanha
  Método: GET
  URL: /consulta/consultaCampanha
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 18/11/2014
  Autor: Ricardo Bruno
  Versão: 1.0
  Data de Alteração: 18/11/2014
 */
smartSig.registerCtrl('consultaCampanha', function($scope, $http, $location, $filter, filterFilter, $timeout, Permissao, $routeParams) {
    
    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    var campanha = Array();

    $scope.searchNome = '';

    $scope.campanha = [];

    $http.get('api/index.php/campanha?flagPeriodo=0').    
      success(function(data, status, headers, config) {          
        if (data.error == 0) {
          $scope.campanha  = data.campanha;
          console.log("Ricardo",data.campanha);
        };                                 
      }).
      error(function(data, status, headers, config) {
        // log error
    });

    $scope.editCadastro = function(id){
      $location.path('/forms/formCadastroCampanha/1/'+id)
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
          total: campanha.length, // length of data
          getData: function($defer, params) {
              // use build-in angular filter
              var filteredData = params.filter() ?
                      $filter('filter')(campanha, params.filter()) :
                      campanha;
              var orderedData = params.sorting() ?
                      $filter('orderBy')(filteredData, params.orderBy()) :
                      campanha;

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