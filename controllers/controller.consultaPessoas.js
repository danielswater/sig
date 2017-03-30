smartSig.registerCtrl('consultaPessoas', function($scope,  $http, $location, $filter, filterFilter, Mensagem, $timeout, Permissao, $routeParams) {
    
    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    //var user = Array();
    $scope.user = [];

    $scope.searchNome = '';

    $http.get('api/index.php/consultapessoas/').    
      success(function(data, status, headers, config) { 
       // console.log(data);
        if (data.error == 0) {
          $scope.user  = data.pessoas; 
        };                                        
      }).
      error(function(data, status, headers, config) {
        // log error
    });            
    
    $scope.updatePessoas = function(id, camp, label) {
        obj = {};
        obj.id = id;
        obj.camp = camp;
        obj.label = label;

        $scope.json = angular.toJson(obj);

        $http.post('api/index.php/updatepessoas', $scope.json,
                   {withCredentials: true,
                    headers: {'enctype': 'multipart/form-data' },
                   }
            ).success(function(data, status, headers, config) {
                if (data.error == 0) {
                    Mensagem.success(data.mensagem);
                }
            }).
            error(function(data, status, headers, config) {
                Mensagem.error(data.mensagem);
                // log error
            });
    }

    $scope.currentPage = 1;
    $scope.pageSize = 100;    

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