/*
  Módulo: Mesquita
  Descrição: CRUD Fornecedores
  Método: GET
  URL: /gestao/consultaItens
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 18/01/2015
  Autor: Fabio da Silva
  Versão: 1.0
  Data de Alteração: 18/01/2015
 */
smartSig.registerCtrl('consultaPedidos', function($scope, $http, $location, $filter, filterFilter, $timeout, Permissao, $routeParams) {
    
    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

   $scope.pedidos = [];

    $scope.searchNome = '';

    $http.get('api/index.php/pedido/').    
      success(function(data, status, headers, config) {                                 
         $scope.pedidos = data.pedido;

         console.log('pedidos', $scope.pedidos);
      }).
      error(function(data, status, headers, config) {
        // log error
    });

    $scope.editCadastro = function(id){
      $location.path('/compras/formCadastroPedidos/1/'+id)
    }      
    
    $scope.filtro = function(){
      $scope.counter++;
      console.log($scope.counter);
    }
    
    $scope.$watch("searchNome", function(q){
      console.log(q);
        //$scope.filteredData = $filter("filter")($scope.data, query);
    });
    
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