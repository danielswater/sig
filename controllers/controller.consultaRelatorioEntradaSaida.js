smartSig.registerCtrl("consultaRelatorioEntradaSaida", function($scope, $http, $routeParams, Mensagem, $timeout, Permissao){

  $scope.permissoes = Permissao.validaPermissao();
    
  $scope.permissoes.then(function (data) {
      $scope.permissoes = data;
  }, function (status) {
      console.log('status',status);
  });

  $scope.contaBancaria = {};
  $scope.entradaSaida = {};

  $scope.novoCadastro = function(){
    $scope.entradaSaida = {};
    $scope.entradaSaida.formato = 0;
    $scope.entradaSaida.id_conta_bancaria = '';
  }

  $scope.gerarRelatorio = function(){
    if ($('#consultaRelatorioEntradaSaida-form').valid()) {
      var dt = new Date($scope.entradaSaida.data_inicial);
      var data = dt.toLocaleDateString();
      var dataInicio = data.substr(0, 10).split('/').reverse().join('-');


      var dt = new Date($scope.entradaSaida.data_final);
      var data = dt.toLocaleDateString();
      var dataFinal = data.substr(0, 10).split('/').reverse().join('-');

      var link = document.createElement("a");
      link.setAttribute("href", 'api/index.php/relatorioentredasaida/'+dataInicio+'/'+dataFinal+'/'+$scope.entradaSaida.id_conta_bancaria+'/'+$scope.entradaSaida.formato);
      link.setAttribute("target", "_blank");
        
      console.log('gerarRelatorio', $scope.entradaSaida.formato);


      if($scope.entradaSaida.formato == 1){
        //link.setAttribute("download", "entrada_saida.pdf");
      }else{
        link.setAttribute("download", "entrada_saida.xls");
      }

      link.click();  
    }

    
  }

  $scope.getContaBancaria = function(id){
    $http.get('api/index.php/contabancaria/').    
      success(function(data, status, headers, config) {      
        $scope.contaBancaria = data.contabancaria;                   

        console.log('dados', data);
        console.log('conta', $scope.contaBancaria);
      }).
      error(function(data, status, headers, config) {
        // log error
      }); 
  }

  $scope.$watch('entradaSaida.data_inicial', function(){
    $scope.entradaSaida.data_inicial1 = $scope.entradaSaida.data_inicial;     
    if($scope.entradaSaida.data_inicial1 != undefined || $scope.entradaSaida.data_inicial1 != null){              
      $( "em[for='data_inicial']" ).css("display","none"); 
    }
  });

  $scope.$watch('entradaSaida.data_final', function(){  
    $scope.entradaSaida.data_final1 = $scope.entradaSaida.data_final;     
    if($scope.entradaSaida.data_final1 != undefined || $scope.entradaSaida.data_final1 != null){              
      $( "em[for='data_final']" ).css("display","none"); 
    }
  });

  $scope.novoCadastro();
  $scope.getContaBancaria();

});

//@ sourceURL=controller.consultaRelatorioEvento.js