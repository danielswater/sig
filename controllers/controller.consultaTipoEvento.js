/*
  Módulo: Mesquita
  Descrição: CRUD Tipo de Evento
  Método: GET
  URL: /consulta/consultaTipoEvento
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 26/11/2014
  Autor: Ricardo Bruno
  Versão: 1.0
  Data de Alteração: 26/11/2014
 */
smartSig.registerCtrl('consultaTipoEvento', function($scope, $http, $location, $filter, filterFilter, $timeout, Permissao, $routeParams) {
    
    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

   // var tipoevento = Array();

   $scope.tipoevento = [];

    $scope.searchNome = '';

    $http.get('api/index.php/ctipoevento/').    
      success(function(data, status, headers, config) {                                 
        if (data.error == 0) {
          $scope.tipoevento  = data.tipoevento;
        }; 
      }).
      error(function(data, status, headers, config) {
        // log error
    });

    $scope.editCadastro = function(id){
      $location.path('/forms/formCadastroTipoEvento/1/'+id)
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