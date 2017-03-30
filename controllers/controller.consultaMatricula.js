smartSig.registerCtrl('consultaMatricula', function($scope, $http, $location, $filter, filterFilter, Mensagem, $timeout, Permissao, $routeParams) {
    
    /*
    $scope.permissoes = Permissao.validaPermissao();    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });
    */

   $scope.matriculas = [];

   $scope.searchNome = '';

    $http.get('api/index.php/matricula')
      .success(function(data, status, headers, config) {        
        if (data.error == 0) {            
            $scope.matriculas = data.matricula;
        }
      })
      .error(function(data, status, headers, config) {});

    $scope.editCadastro = function(id){
      $location.path('/secretaria/formCadastroMatricula/1/'+id);
    }      
    
    $scope.currentPage = 1;
    $scope.pageSize = 10;    

    $scope.sort = {        
        active: 'nome',
        descending: undefined
    }; 

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
          return sort.descending ? 'glyphicon-chevron-up' : 'glyphicon-chevron-down';
        }        
        return 'glyphicon-star';
    }
});
//@ sourceURL=controller.consultaMatricula.js