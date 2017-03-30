/*
  Módulo: Mesquita
  Descrição: CRUD Grupo Bens
  Método: GET
  URL: /gestao/consultaGrupoBens
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 07/01/2014
  Autor: Ricardo Bruno
  Versão: 1.0
  Data de Alteração: 07/01/2014
  */
  smartSig.registerCtrl('consultaMoeda', function($scope, $http, $location, $filter, filterFilter, $timeout, Permissao, $routeParams) {

    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    $scope.moeda = [];

    $scope.searchNome = '';

    $http.get('api/index.php/moeda/').    
    success(function(data, status, headers, config) {
      if (data.error == 0) {
        $scope.moeda  = data.moeda;
        console.log($scope.moeda);
      };                       
    }).
    error(function(data, status, headers, config) {
        // log error
    });

    $scope.editCadastro = function(id){
      $location.path('/financeiro/formCadastroMoeda/1/'+id)
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