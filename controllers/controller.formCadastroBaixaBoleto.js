  /*
  Módulo: Mesquita
  Descrição: CRUD Gerar Boleto
  Método: GET
  URL: /financeiro/formCadastroGerarBoleto
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 15/06/2015
  Autor: Fabio da Silva
  Versão: 1.0
 */
smartSig.registerCtrl("formCadastroBaixaBoleto", function($scope, $location, $http, $routeParams, Mensagem, $timeout, Permissao, $modal, $filter){

	$scope.permissoes = Permissao.validaPermissao();
	
	$scope.permissoes.then(function (data) {
		$scope.permissoes = data;
	}, function (status) {
		console.log('status',status);
	});

	var idBoleto = $routeParams.id;
	var processado = 0;

	$scope.boleto = {};
	$scope.boletos = {};

	$scope.boleto.total = 0;

	$scope.error = '';  

	$scope.progressBar = function(valor) {
	  processado = processado + valor;
	  $scope.processo = processado / $scope.boleto.total * 100;
	}

	$scope.cadastrarBaixaBoleto = function() {
		console.log('upload', $scope.__userFiles);
		if(typeof $scope.__userFiles === 'undefined'){
			Mensagem.error('Selecione um arquivo!');
			return;	
		}  

		$http.get('api/index.php/baixaboleto/').    
	      success(function(data, status, headers, config) { 
	        if (data.error == 0) {
	          $scope.enviarBaixaBoleto(data.baixa_boleto);
	          $scope.__userFiles = undefined;
	        };                               
	      }).
	      error(function(data, status, headers, config) {
	        // log error
	    });
	}   

	$scope.enviarBaixaBoleto = function(boletos){
		$scope.boleto.total = boletos.length;
		var pct = 2;

		aBoleto = Array();

		if($scope.boleto.total  == 0){
			Mensagem.error('Não a boletos para dar baixa no arquivo selecionado!');
			return;	
		}

		for(var a=0; a < $scope.boleto.total; a=a+pct){
			//$scope.boleto.posicao = a;
			$scope.baixaBoleto = {};
			for(var b=0; b < pct; b++){
				$scope.baixaBoleto[b] = boletos[a+b];
			}

			$scope.json = angular.toJson($scope.baixaBoleto);

			$('#myModalBoleto').modal({backdrop: 'static'}); // abre um boleto statico que impede o fechamento do modal

			$http.post('api/index.php/baixaboleto/', $scope.json, {
						 	withCredentials: true,
						 	headers: {'enctype': 'multipart/form-data' },
						 
			}).success(function(data, status, headers, config) {
				$scope.progressBar(pct);
				console.log('error', data);
				if (data.error == 0)
				{   
					data.baixa_boleto.forEach(function (value, key) {
						aBoleto.unshift(value);
					});
					
					$scope.boletos = aBoleto;
				}
				else
				{
					Mensagem.error(data.mensagem);
				}
			}).error(function(data, status) {
				$scope.progressBar(pct);				  	
			});
		}
	}

	$scope.$watch('processo', function(){  
		if($scope.processo >= 100 && $scope.boleto.total >= 1){
		 	$('#myModalBoleto').modal('hide');
		}
	});
});