smartSig.registerCtrl('consultaDonatario', function($scope, $http, $location, $filter, filterFilter, Mensagem, $timeout, Permissao, $routeParams) {
    
    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    $scope.users = [];
    $scope.donatario = [];

    $scope.searchNome = '';

    $scope.getDonatario = function(){
        $http.get('api/index.php/carregapessoa/6').    
          success(function(data, status, headers, config) {                                      
            if (data.error == 0) {
              $scope.users  = data.pessoa;         
            }; 
          }).
          error(function(data, status, headers, config) {
            // log error
        });
    }

    $scope.editCadastro = function(id){
      $location.path('/forms/formCadastroDonatario/1/'+id)
    }

    $scope.excluirCadastro = function(id){
        $scope.donatario.id = id;
        $scope.json = angular.toJson($scope.donatario.id);

        $http.post('api/index.php/deldonatario/', $scope.json,
            {withCredentials: true,
                headers: {'enctype': 'multipart/form-data' },
            })
        .success(function(data, status, headers, config) {
            Mensagem.success(data.mensagem);
            $scope.getDonatario();
        })
        .error(function(data, status, headers, config) {
            Mensagem.error('Erro na exclusão de donatário');
        });
    }          
    
    $scope.updatePessoa = function(id) {
        $http.post('api/index.php/updatepessoa/' + id).
                success(function(data, status, headers, config) {
                    if (data.error == 0) {
                        Mensagem.success(data.mensagem);
                    }
                }).
                error(function(data, status, headers, config) {
                    Mensagem.error(data.mensagem);
                    // log error
                });
    }

    /*parametros para a paginação*/

    $scope.currentPage = 1;
    $scope.pageSize = 10;    

    $scope.getDonatario();

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