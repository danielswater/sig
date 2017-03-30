/*
  Módulo: Escola
  Descrição: CRUD Texto grupo de ocorrência
  URL: /gestao/consultaTextoGrupoOcorrencia
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 26/02/2015
  Autor: Hamzi Jalel
  Versão: 1.0
  Data de Alteração: 13/03/2015
  Autor: Luciano Almeida
 */
smartSig.registerCtrl('consultaTextoGrupoOcorrencia', function($scope, $http, $location, $filter, filterFilter, $timeout, Permissao, $routeParams) {
    $scope.permissoes = Permissao.validaPermissao();
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    $scope.searchNome = '';
    $scope.textogrupoocorrencias = [];

    $http.get('api/index.php/textogrupoocorrencia/1').    
      success(function(data, status, headers, config) {
        if (data.error == 0) {
          $scope.textogrupoocorrencias  = data.textogrupoocorrencia;
        }
      }).
      error(function(data, status, headers, config) {
        // log error
    });

    $scope.editCadastro = function(id){
      $location.path('/escolaforms/formCadastroTextoGrupoOcorrencia/1/'+id)
    }      
    
    $scope.filtro = function(){
      $scope.counter++;
      console.log($scope.counter);
    }
    
    $scope.$watch("searchNome", function(q){
      console.log(q);
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