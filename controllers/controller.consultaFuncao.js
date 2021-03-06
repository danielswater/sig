/*
  Módulo: Escola
  Descrição: CRUD Função
  Método: GET
  URL: /consulta/consultaFuncao
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 11/03/2015
  Autor: Luciano Almeida
  Versão: 1.0
 */
smartSig.registerCtrl('consultaFuncao', function($scope, $http, $location, $filter, filterFilter, $timeout, Permissao, $routeParams) {
    $scope.permissoes = Permissao.validaPermissao();
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    $scope.searchNome = '';
    $scope.funcoes = [];

    $http.get('api/index.php/funcao/1').
        success(function(data, status, headers, config) {

        if (data.error == 0) {
          $scope.funcoes = data.funcao;
        }
      }).
      error(function(data, status, headers, config) {
        // log error
    });

    $scope.editCadastro = function(id){
      $location.path('/escolaforms/formCadastroFuncao/1/'+id)
    }      
    
    $scope.filtro = function(){
      $scope.counter++;
      console.log($scope.counter);
    }
    
    $scope.$watch("searchNome", function(q){
      console.log(q);
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
          total: id_tipo_funcionario.length, // length of data
          getData: function($defer, params) {
              // use build-in angular filter
              var filteredData = params.filter() ?
                      $filter('filter')(id_tipofuncionario, params.filter()) :
                      id_tipo_funcionario;
              var orderedData = params.sorting() ?
                      $filter('orderBy')(filteredData, params.orderBy()) :
                      id_tipo_funcionario;

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
});