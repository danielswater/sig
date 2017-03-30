
smartSig.registerCtrl('consultaCompra', function($scope, ngTableParams, $http, $location, $filter, filterFilter, $timeout, Permissao, $routeParams, Mensagem, $modal) {

  $scope.permissoes = Permissao.validaPermissao();

  $scope.permissoes.then(function (data) {
    $scope.permissoes = data;
  }, function (status) {
    console.log('status',status);
  });


  $scope.compra = [];

  $scope.getListaCompra = function(){
    $http.get('api/index.php/compraslistas').    
      success(function(data, status, headers, config) {                                 
         $scope.compra  = data;
         console.log('compra', $scope.compra);
      }).
      error(function(data, status, headers, config) {
        // log error
    });
  }

  $scope.getListaCompra();

});