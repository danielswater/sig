/*
  Módulo: Escola
  Descrição: CRUD Tipo de ocorrência
  URL: /gestao/consultaTipoOcorrencia
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 16/02/2015
  Autor: Hamzi Jalel
  Versão: 1.0
  Data de Alteração: 16/02/2015
 */
smartSig.registerCtrl('consultaTipoOcorrencia', function($scope, $http, $location, $filter, filterFilter, $timeout, Permissao, $routeParams) {
    
    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    $scope.consultaTipoOcorrenciancia = [];

    $scope.searchNome = '';

    $http.get('api/index.php/tipoocorrencia/1').    
      success(function(data, status, headers, config) {                                 
         $scope.tipoocorrencia  = data.tipoocorrencia;
      }).
      error(function(data, status, headers, config) {
        // log error
    });


    $scope.editCadastro = function(id){

      //console.log('hamzi:',id); 
      $location.path('/escolaforms/formCadastroTipoOcorrencia/1/'+id)

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