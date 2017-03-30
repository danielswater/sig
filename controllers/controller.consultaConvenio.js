/*
  Módulo: Escola
  Descrição: CRUD Convênio
  Método: GET
  URL: /consulta/consultaConvenio
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 07/03/2015
  Autor: Ricardo Nakadomari
  Versão: 1.0
  Data de Alteração: 07/03/2015
 */

smartSig.registerCtrl('consultaConvenio', function($scope, $http, $location, $filter, Permissao) {
    
    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

   $scope.convenio = [];

    $scope.searchDescricao = '';

    $http.get('api/index.php/convenio/1').    
      success(function(data, status, headers, config) { 

        if (data.error == 0) {
          $scope.convenio  = data.convenio;
        };                               
      }).
      error(function(data, status, headers, config) {
        // log error
    });


    $scope.editCadastro = function(id){
      $location.path('/escolaforms/formCadastroConvenio/1/'+id)
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