smartSig.registerCtrl('consultaFuneraria', function($scope, $http, $location, $filter, filterFilter, $timeout, Permissao, $routeParams) {
    
    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    //var funeraria = Array();

    $scope.searchNome = '';
    $scope.funeraria = [];

    $http.get('api/index.php/funeraria/').    
      success(function(data, status, headers, config) {                                 
         $scope.funeraria  = data.funeraria;

         //$scope.tabelaConsulta();
      }).
      error(function(data, status, headers, config) {
        // log error
    });

    $scope.editCadastro = function(id){
      $location.path('/forms/formCadastroFuneraria/1/'+id)
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
              nome: ''       // initial filter
          },
          sorting: {
              nome: 'asc'     // initial sorting
          }
      }, {
          total: funeraria.length, // length of data
          getData: function($defer, params) {
              // use build-in angular filter
              var filteredData = params.filter() ?
                      $filter('filter')(funeraria, params.filter()) :
                      funeraria;
              var orderedData = params.sorting() ?
                      $filter('orderBy')(filteredData, params.orderBy()) :
                      funeraria;

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