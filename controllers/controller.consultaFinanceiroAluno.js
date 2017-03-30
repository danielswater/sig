smartSig.registerCtrl('consultaFinanceiroAluno', function($scope,  $http, $location, $filter, filterFilter, Mensagem, $timeout, Permissao, $routeParams) {
    
    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    //var user = Array();
    $scope.alunoFinanceiros = [];

    $scope.searchNome = '';

    $http.get('api/index.php/alunofinanceiro/').    
      success(function(data, status, headers, config) { 
       // console.log(data);
        if (data.error == 0) {
          $scope.alunoFinanceiros  = data.aluno_financeiro; 
        };                                        
      }).
      error(function(data, status, headers, config) {
        // log error
    });       

    $scope.editCadastro = function(id){
       $location.path('/secretaria/formCadastroFinanceiroAluno/1/'+id)
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

    // Método para calcular a idade do aluno - recebe o campo de idade como parâmetro
    $scope.calculateAge = function calculateAge(birthday) { // birthday is a date
      //verifica se o campo existe e se o valor passado não é string, pois deve ser objeto
      if (birthday && !angular.isString(birthday)){
        var ageDifMs = Date.now() - birthday.getTime();
        var ageDate = new Date(ageDifMs); // miliseconds from epoch
        var returnValue = Math.abs(ageDate.getUTCFullYear() - 1970);
        return returnValue;
      }
    }

});