/*
  Módulo: Mesquita
  Descrição: CRUD Categorias de Não Associados
  Método: GET
  URL: /consulta/consultaCategoriaNaoAssociado
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 20/01/2015
  Autor: Ricardo Bruno
  Versão: 1.0
  Data de Alteração: 20/01/2015
 */
smartSig.registerCtrl('consultaCategoriaNaoAssociado', function($scope, $http, $location, $filter, filterFilter, $timeout, Permissao,$routeParams) {
    
    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

   // var categoria = Array();

   $scope.categoria = [];

    $scope.searchNome = '';

    $http.get('api/index.php/categorianaoassociado/1').    
      success(function(data, status, headers, config) { 

        if (data.error == 0) {
          $scope.categoria  = data.categoria;
        };                               
      }).
      error(function(data, status, headers, config) {
        // log error
    });

    $scope.editCadastro = function(id){
      $location.path('/forms/formCadastroCategoriaNaoAssociado/1/'+id)
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