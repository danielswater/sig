smartSig.registerCtrl('consultaFuncionarioEscola', function($scope,  $http, $location, $filter, filterFilter, Mensagem, $timeout, Permissao, $routeParams) {

    /* FRH - Filtrar pela entidade logada */
    $scope.getLogado = function(){
      $http.get('api/index.php/usuariologado/')
      .success(function(data, status, headers, config){
        $scope.logado = data.user['user'];      
      })
      .error(function(data, status, headers, config){  });
    }
    $scope.getLogado();
    
    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    //var user = Array();
    $scope.user = [];
    $scope.searchNome = '';

    $http.get('api/index.php/consultapessoa/12')
      .success(function(data, status, headers, config) {        
        if (data.error == 0) {            
          filtro_01 = $filter('filter')(data.pessoa, {'id_entidade': 3}); // FRH - Somente funcionários da escola: Unidade Vila carrão
          filtro_02 = $filter('filter')(data.pessoa, {'id_entidade': 4}); // FRH - Somente funcionários da escola: Unidade Cambuci
          $scope.user = filtro_01.concat(filtro_02);
        };
      })
      .error(function(data, status, headers, config) {
        // log error
    });       

    $scope.editCadastro = function(id){
       $location.path('/escolaforms/formCadastroFuncionarioEscola/1/'+id)
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
//@ sourceURL=controller.consultaFuncionarioEscola.js