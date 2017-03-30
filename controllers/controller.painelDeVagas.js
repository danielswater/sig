/*
  Módulo: Escola
  Descrição: Lista vagas em aberto
  Método: GET
  URL: /painelvagas
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 21/05/2015
  Autor: Daniel Swater
  Versão: 1.0
 */

smartSig.registerCtrl('painelDeVagas', function($scope, $http, $location, $filter, Permissao) {
    
    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

   $scope.painelvagas = [];

    $http.get('api/index.php/painelvagas/').    
      success(function(data, status, headers, config) { 

        if (data.error == 0) {
          $scope.painelvagas = data.painelvagas;
          console.log('painel vagas',$scope.painelvagas);
        };                               
      }).
      error(function(data, status, headers, config) {
        // log error
    });

});