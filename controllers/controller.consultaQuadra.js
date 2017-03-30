/*
  Módulo: Cemitério
  Descrição: CRUD Quadra
  Método: GET
  URL: /consulta/consultaQuadra
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 05/11/2014
  Autor: Ricardo Bruno
  Versão: 1.0
  Data de Alteração: 05/11/2014
 */
smartSig.registerCtrl('consultaQuadra', function($scope, $http, $location, $filter, filterFilter, Mensagem, $timeout, Permissao, $routeParams) {
    
    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    //var quadra = Array();

    $scope.searchNome = '';
    $scope.quadra = [];

    $scope.carregarQuadra = function(){
        $http.get('api/index.php/quadra/')
        .success(function(data, status, headers, config){
             $scope.quadra  = data.quadra;
        })
        .error(function(data, status, headers, config){});
    }
    $scope.carregarQuadra();

    $scope.editCadastro = function(id){
      $location.path('/forms/formCadastroQuadra/1/'+id)
    }      
    
    $scope.filtro = function(){
      $scope.counter++;
      console.log($scope.counter);
    }
    
    $scope.$watch("searchNome", function(q){
      console.log(q);
        //$scope.filteredData = $filter("filter")($scope.data, query);
    });
    
    $scope.tabelaConsulta = function(){
      $scope.tableParams = new ngTableParams({
          page: 1,            // show first page
          count: 10,          // count per page
          filter: {
              descricao: ''       // initial filter
          },
          sorting: {
              descricao: 'asc'     // initial sorting
          }
      }, {
          total: quadra.length, // length of data
          getData: function($defer, params) {
              // use build-in angular filter
              var filteredData = params.filter() ?
                      $filter('filter')(quadra, params.filter()) :
                      quadra;
              var orderedData = params.sorting() ?
                      $filter('orderBy')(filteredData, params.orderBy()) :
                      quadra;

              params.total(orderedData.length); // set total for recalc pagination
              $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
          }
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

    $scope.delCadastro = function(idQuadra){

      $scope.tmp = {};
      $scope.tmp.id_quadra = idQuadra;
      $scope.json = angular.toJson($scope.tmp);

      $http.post('api/index.php/delcemiterioquadra', $scope.json, {withCredentials: true, headers: {'enctype': 'multipart/form-data' },})

      .success(function(data, status, headers, config){        
        
        if (data.error < 0){ Mensagem.error(data.retorno); }
        else{                Mensagem.success(data.retorno); }
        
        $scope.carregarQuadra();

      }).error(function(data, status, headers, config){});
    }
});