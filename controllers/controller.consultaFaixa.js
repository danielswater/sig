/*
  Módulo: Escola
  Descrição: CRUD Faixas
  Método: GET
  URL: /consulta/consultaFaixas
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 16/03/2015
  Autor: HAMZI JALEL
  Versão: 1.0
  Data de Alteração: 16/03/2015
 */
smartSig.registerCtrl('consultaFaixa', function($scope,  $http, $location, $filter, filterFilter, $timeout, Permissao, $routeParams) {
    
$scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    $scope.searchDescricao = '';
    $scope.faixas = [];

    $http.get('api/index.php/faixa/').    
      success(function(data, status, headers, config) {        
        if (data.error == 0) {

          console.log('DATA:',data);

          $scope.faixas = data.faixa;

        };                          
      }).
      error(function(data, status, headers, config) {
        // log error
    });

    $scope.editCadastro = function(id){

      $location.path('/escolaforms/formCadastroFaixa/1/'+id)
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