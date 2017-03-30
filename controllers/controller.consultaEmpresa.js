/*
  Módulo: Escola
  Descrição: CRUD Consulta Empresa no painel de empregos
  Método: GET
  URL: /consulta/consultaEmpresa
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 19/05/2015
  Autor: Fábio Roberto Haydn
  Versão: 1.0
*/

smartSig.registerCtrl('consultaEmpresa', function($scope, $http, $location, $filter, Permissao) {
    
    $scope.permissoes = Permissao.validaPermissao();

    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });


    $scope.empresas = [];
    $scope.searchNome = '';

    $http.get('api/index.php/empresa/')
      .success(function(data, status, headers, config) 
      { 
        if (data.error == 0) 
        {
          $scope.empresas = data.empresa;
        }
      })
      .error(function(data, status, headers, config) {  });


    $scope.editCadastro = function(id){
      $location.path('/empregos/formCadastroEmpresa/1/'+id)
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

//@ sourceURL=controller.consultaEmpresa.js