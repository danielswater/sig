
smartSig.registerCtrl("consultaRelatorioMatricula", function($scope, $http, $routeParams, Mensagem, $timeout, $filter, Permissao){
    

    $scope.permissoes = Permissao.validaPermissao();

    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });


  $scope.getEtapa = function(){
    $http.get('api/index.php/etapa/1')
    .success(function(data, status, headers, config) {
      $scope.etapas  = data.etapa;
    })
    .error(function(data, status, headers, config) {})
  }
  $scope.getEtapa();


  $scope.emitirRelatorio = function(idEtapa){
    
    window.open('api/index.php/relatoriomatricula/'+idEtapa, '_blank');
  }



});

//@ sourceURL=controller.consultaRelatorioMatricula.js