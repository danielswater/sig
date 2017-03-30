smartSig.registerCtrl("consultaRelatorioDespesa", function($scope, $http, $routeParams, Mensagem, $timeout, Permissao){

  $scope.permissoes = Permissao.validaPermissao();
    
  $scope.permissoes.then(function (data) {
      $scope.permissoes = data;
  }, function (status) {
      console.log('status',status);
  });

  $scope.contaBancaria = {};
  $scope.despesa = {};

  $scope.novoCadastro = function(){
    $scope.despesa = {};
    $scope.despesa.formato = 0;
    $scope.despesa.id_conta_bancaria = '';
  }
 
  function convertDate(inputFormat) {
    function pad(s) { return (s < 10) ? '0' + s : s; }
    var d = new Date(inputFormat);
    return [d.getFullYear(), pad(d.getMonth()+1), pad(d.getDate())].join('-');
  }    

  $scope.gerarRelatorio = function(){

    dtini = convertDate($scope.despesa.data_inicial);
    dtfim = convertDate($scope.despesa.data_final);

    uri='api/index.php/relatoriodespesa/'+$scope.despesa.id_conta_bancaria+'/'+dtini+'/'+dtfim;
    window.open(uri, '_blank');
  }


  $scope.getContaBancaria = function(id){
    $http.get('api/index.php/contabancaria/')
    .success(function(data, status, headers, config) {      
        $scope.contaBancaria = data.contabancaria;
    })
    .error(function(data, status, headers, config) {}); 
  }
  $scope.getContaBancaria();

  $scope.$watch('despesa.data_inicial', function(){
    $scope.despesa.data_inicial1 = $scope.despesa.data_inicial;     
    if($scope.despesa.data_inicial1 != undefined || $scope.despesa.data_inicial1 != null){              
      $( "em[for='data_inicial']" ).css("display","none"); 
    }
  });

  $scope.$watch('despesa.data_final', function(){  
    $scope.despesa.data_final1 = $scope.despesa.data_final;     
    if($scope.despesa.data_final1 != undefined || $scope.despesa.data_final1 != null){              
      $( "em[for='data_final']" ).css("display","none"); 
    }
  });

  $scope.novoCadastro();
  $scope.getContaBancaria();

});

//@ sourceURL=controller.consultaRelatorioDespesas.js