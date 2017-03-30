smartSig.registerCtrl('consultaCondicao', function($scope, $http, $location, $filter, filterFilter, $timeout, Permissao, $routeParams) {
    
    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

   $scope.condicoes = [];

    $scope.searchNome = '';

    $http.get('api/index.php/condicao/').    
      success(function(data, status, headers, config) {
        if (data.error == 0) {
          $scope.condicoes  = data.condicao;  
        };                                           
      }).
      error(function(data, status, headers, config) {
        // log error
    });

    $scope.editCadastro = function(id){
      $location.path('/secretaria/formCadastroCondicao/1/'+id)
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