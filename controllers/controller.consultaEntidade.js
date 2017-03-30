smartSig.registerCtrl('consultaEntidade', function($scope, $http, $location, $filter, filterFilter, $timeout, Permissao, $routeParams) {
    
    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    $scope.entidade = [];
    $scope.entidade.idTipoEntidade = [];

    $scope.searchNome = '';

    $scope.editCadastro = function(id){
      $location.path('/forms/formCadastroEntidade/1/'+id)
    }      
    
    $scope.currentPage = 1;
    $scope.pageSize = 10;    

    $scope.sort = {        
        active: 'nome',
        descending: undefined
    }

    $scope.getUserLogado = function(){
      $http.get('api/index.php/usuariologado/').    
        success(function(data, status, headers, config) {
          $scope.entidade.idTipoEntidade = data['user']['user'].idTipoEntidade
          $scope.getEntidade($scope.entidade.idTipoEntidade);
          //console.log('logado',$scope.entidade.idTipoEntidade);
          //$scope.getEntidadePessoa($scope.entidade.idTipoEntidade);
        }).
        error(function(data, status, headers, config) {
          // log error
        });
    }

    /*
    $scope.getEntidade = function(entidade){
        $http.get('api/index.php/entidade/'+entidade).
      success(function(data, status, headers, config) {
        if (data.error == 0) {
            $scope.entidade  = data.entidade;
        };                                         
      }).
      error(function(data, status, headers, config) { });
    }
    */

    $scope.getEntidade = function(entidade){
        $http.get('api/index.php/entbytipo/'+entidade)
        .success(function(data, status, headers, config){

            if (data.error == 0) {
                $scope.entidade  = data.entidade;
            };
        })
        .error(function(data, status, headers, config) { });
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

    $scope.getUserLogado();
    //$scope.getEntidade($scope.entidade.idTipoEntidade);
    
});

//@ sourceURL=controller.consultaEntidade.js