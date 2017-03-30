
smartSig.registerCtrl("consultaRelatorioFamilia", function($scope, $http, $routeParams, Mensagem, $timeout, $filter, Permissao){
    

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

  $scope.getTurma = function(){

    $http.get('./api/index.php/matricula/0/0/'+$scope.relatorio.id_etapa+'/0/1')
    .success(function(data, status, headers, config) {
      if(data.error == 0){        
        $scope.turmas = data.matricula;
      }
    })
    .error(function(data, status, headers, config) {});
  }


  $scope.emitirRelatorio = function(idTurma){
    
    uri='api/index.php/relatoriofamilia/';
    uri+= (idTurma>0) ? idTurma : '0';

    window.open(uri, '_blank');
  }



});

//@ sourceURL=controller.consultaRelatorioFamilia.js