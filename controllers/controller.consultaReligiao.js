/*
  Módulo: Escola
  Descrição: CRUD Religião
  Método: GET
  URL: /consulta/consultaReligiao
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 19/02/2015
  Autor: Ricardo Nakadomari
  Versão: 1.0
  Data de Alteração: 19/02/2015
 */

smartSig.registerCtrl('consultaReligiao', function($scope, $http, $location, $filter, Permissao) {
    
    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

   $scope.religiao = [];

    $scope.searchNome = '';

    $http.get('api/index.php/religiao/1').    
      success(function(data, status, headers, config) { 

        if (data.error == 0) {
          $scope.religiao  = data.religiao;
        };                               
      }).
      error(function(data, status, headers, config) {
        // log error
    });


    $scope.editCadastro = function(id){
      $location.path('/escolaforms/formCadastroReligiao/1/'+id)
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