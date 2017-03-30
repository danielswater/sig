/*
  Módulo: Mesquita
  Descrição: CRUD Conta Bancaria
  Método: GET
  URL: /consulta/consultaContaBancaria
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 20/12/2014
  Autor: Ricardo Bruno
  Versão: 1.0
  Data de Alteração: 20/12/2014
 */
smartSig.registerCtrl('consultaContaBancaria', function($scope, $http, $location, $filter, filterFilter, $timeout, Permissao, $routeParams) {
    
    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    //var contabancaria = Array();
    $scope.contabancaria = [];
    $scope.searchNome = '';

    $http.get('api/index.php/contabancaria').    
      success(function(data, status, headers, config) {                                          
        if (data.error == 0) {
          $scope.contabancaria  = data.contabancaria;
        };  
      }).
      error(function(data, status, headers, config) {
        // log error
    });

    $scope.editCadastro = function(id){
      $location.path('/forms/formCadastroContaBancaria/1/'+id)
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