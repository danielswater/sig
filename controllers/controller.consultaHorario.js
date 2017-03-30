/*
  Módulo: Escola
  Descrição: CRUD Consulta Origens
  Método: GET
  URL: /consulta/consultaOrigem
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 04/05/2015
  Autor: Fábio Roberto Haydn
  Versão: 1.0
*/

smartSig.registerCtrl('consultaHorario', function($scope, $http, $location, $filter, Permissao) {
    
    $scope.permissoes = Permissao.validaPermissao();

    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });
    
    $scope.horario = [];
    $scope.searchNome = '';

    $http.get('api/index.php/horario/')
      .success(function(data, status, headers, config) 
      { 
        if (data.error == 0) 
        {
          $scope.horario = data.horario;
        }
      })
      .error(function(data, status, headers, config) { /* log error */ });


    $scope.editCadastro = function(id){
      $location.path('/escolaforms/formCadastroHorario/1/'+id)
    }      
    
    $scope.currentPage = 1;
    $scope.pageSize = 10;    

    $scope.sort = {
        active: 'descricao',
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

    $scope.getIcon = function(column){
        var sort = $scope.sort;        
        if (sort.active == column){
          return sort.descending
            ? 'glyphicon-chevron-up'
            : 'glyphicon-chevron-down';
        }        
        return 'glyphicon-star';
    }
});