/*
  Módulo: Mesquita
  Descrição: CRUD bloqueio de matrícula
  Método: GET
  URL: /consulta/consultaBloqueioMatricula
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 12/06/2015
  Autor: Fábio Roberto Haydn
  Versão: 1.0  
*/

smartSig.registerCtrl('consultaBloqueioMatricula', function($scope, $http, $location, $filter, filterFilter, $timeout, Permissao, $routeParams) {
    
    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    $scope.bloqueios = [];
    $scope.searchNome = '';

    $http.get('api/index.php/bloqueiomatricula/1')
    .success(function(data, status, headers, config) {                                 
         $scope.bloqueios  = data.bloqueiomatricula;
    })
    .error(function(data, status, headers, config){ });

    $scope.editCadastro = function(id){
      $location.path('/escolaforms/formCadastroBloqueioMatricula/1/'+id);
    }
    
    $scope.filtro = function(){
      $scope.counter++;
      console.log($scope.counter);
    }
   
    $scope.tabelaConsulta = function(){
      $scope.tableParams = new ngTableParams({
          page: 1,
          count: 10,
          filter:  { descricao: ''    },
          sorting: { descricao: 'asc' }
      },{ total: bloqueiomatricula.length,

          getData: function($defer, params) 
          {              
              var filteredData = params.filter() ? $filter('filter')(bloqueiomatricula, params.filter())  : bloqueiomatricula;
              var orderedData = params.sorting() ? $filter('orderBy')(filteredData, params.orderBy())     : bloqueiomatricula;

              params.total(orderedData.length); 
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

//@ sourceURL=controller.consultaBloqueioMatricula.js