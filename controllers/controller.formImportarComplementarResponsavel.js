  /*
  Módulo: Mesquita
  Descrição: CRUD Gerar Parcela
  Método: GET
  URL: /financeiro/formCadastroGerarParcela
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 15/06/2015
  Autor: Fabio da Silva
  Versão: 1.0
 */
smartSig.registerCtrl("formImportarComplementarResponsavel", function($scope, $location, $http, $routeParams, Mensagem, $timeout, Permissao, $modal){

	$scope.permissoes = Permissao.validaPermissao();
	
	$scope.permissoes.then(function (data) {
		$scope.permissoes = data;
	}, function (status) {
		console.log('status',status);
	});

	var idParcela = $routeParams.id;
	var processado = 0;

	$scope.arquivos = {};
	$scope.importar = {};
	$scope.importacoes = {};
	
	$scope.processo = 0;

	$scope.error = '';  

	$scope.selecionaArquivo = function(item){
		
		$scope.importar.total = item.linhas;
		$scope.importar.arquivo = item.nome;

		console.log('item', $scope.importar);
	}

	$scope.getLerPasta = function(){
		$http.get('api/index.php/lerpasta/complementar_responsavel').    
		success(function(data, status, headers, config) {      
			$scope.arquivos = data.ler_pasta;  

			console.log('arquivos', $scope.arquivos);
		}).
		error(function(data, status, headers, config) {
          // log error
    	}); 
	}

	$scope.progressBar = function(valor) {
	  processado = processado + valor;
	  $scope.processo = Math.trunc((processado+2) / $scope.importar.total * 100);
	}

	$scope.importarResponsavel = function() {  
		var pct, num;
		num = 0;
		aImportacao = Array();
		$scope.importacoes = {};

		$scope.importar.pacote = 1; 

		pct = $scope.importar.pacote;
		//$scope.importar.total = 7;

		console.log('importar', $scope.importar);
		for(var a=2; a <= $scope.importar.total; a=a+pct){
			//$scope.importar.linhas = 20;
			$scope.importar.posicao = a;
			$scope.json = angular.toJson($scope.importar);

			$http.post('api/index.php/importarcomplementarresponsavel/', $scope.json, 
				{withCredentials: true,
					headers: {'enctype': 'multipart/form-data' },
				}
			).success(function(data, status, headers, config) {
				$scope.progressBar(pct);
				console.log('contar', data.importar_aluno.length);
				num++;
				console.log('num', num);

				if (data.error == '0'){   
					data.importar_aluno.forEach(function (value, key) {
						if(value.nome != ''){
							aImportacao.unshift(value);
						}
					});

					$scope.importacoes = aImportacao;
				}else{
					Mensagem.error(data.mensagem);   
				}
			}).error(function(data, status) {
				$scope.progressBar(pct);
			});
		}
	}   
	
	$scope.$watch('importacoes', function(){  
	  if($scope.importacoes.length > 0 && $scope.importar.total > 1){
		$('#myModalImportar').modal({backdrop: 'static'});
	  }
	});

	$scope.$watch('processo', function(){  
		if($scope.processo >= 100 && $scope.importar.total >= 1){
		 	$('#myModalImportar').modal('hide');
		}
	});


	$scope.getLerPasta();
});