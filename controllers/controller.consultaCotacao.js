/*
Módulo: Mesquita
Descrição: CRUD Consulta Cotação
Método: GET
URL: /consulta/consultaCotacao
Autenticação: Não
Resposta: JSON
Data de Criação: 18/03/2015
Autor: Luciano Almeida
Versão: 1.0
*/
smartSig.registerCtrl('consultaCotacao', function($scope, ngTableParams, $http, $location, $filter, filterFilter, $timeout, Permissao, $routeParams, Mensagem, $modal) {
	$scope.permissoes = Permissao.validaPermissao();
	$scope.permissoes.then(function (data) {
		$scope.permissoes = data;
	}, function (status) {
		console.log('status',status);
	});

	$scope.css = 'glyphicon glyphicon-chevron-up link';
	$scope.fornecedores = [];
	$scope.itens_fornecedores = {};
	$scope.cotacaoSelected = [];
	$scope.valorUnitario = [];
	$scope.id_cotacao = {};
	$scope.justificativa = [];

	var objeto = Array();

	angular.forEach($scope.cotacoes, function(value, key) {
		$scope.cotacoes[key].classe = 'glyphicon glyphicon-chevron-up link';
	});

	// $scope.getListaCotacaoPendente = function(){
	//   $http.get('api/index.php/cotacaopendentelista').
	//   success(function(data, status, headers, config) {
	//    $scope.cotacoes = data;
	//    $scope.cotacaoSelected = [];
	//    console.log($scope.cotacoes);
	//   }).
	//   error(function(data, status, headers, config) {
	//       // log error
	//     });
	// }

	$scope.getListaCotacao = function(){
		$http.get('api/index.php/cotacaolista').    
		success(function(data, status, headers, config) {
			$scope.cotacoes = data;
			
		}).
		error(function(data, status, headers, config) {
			// log error
		});
	}

	$scope.abre = function(index){
		$scope.show = true;
		$scope.click = true;
		$scope.cotacaoSelected = $scope.cotacoes[index];
		console.log('$scope.cotacaoSelected',$scope.cotacaoSelected);
		$scope.getCotacaoCompraItensFornecedor($scope.cotacaoSelected.id);

		angular.forEach($scope.cotacoes, function(value, key) {
			if ($scope.cotacoes[key] != index) {
				$scope.cotacoes[key].toggle = false;
				$scope.cotacoes[key].classe = 'glyphicon glyphicon-chevron-up link';
			}
		});

		if ($scope.cotacoes[index].toggle == true) {
			$scope.cotacoes[index].toggle = false;
			$scope.cotacoes[index].classe = 'glyphicon glyphicon-chevron-up link';
		} else {
			$scope.cotacoes[index].toggle = true;
			$scope.cotacoes[index].classe = 'glyphicon glyphicon-chevron-down link';
		};
	}

	$scope.getCotacaoCompraItensFornecedor = function(id){		
		$http.get('api/index.php/cotacaocompraitensfornecedor/'+id)
		.success(function(data, status, headers, config) {
			if(data){
			};  
		})
		.error(function(data, status, headers, config) {});
	}

	$scope.aprovarCotacao = function(objeto){
		var error = 0;
		angular.forEach(objeto.items, function(value, key) {
			angular.forEach(value.fornecedores, function(value2, key2) {
				if (value2.valor_unitario == "" || value2.valor_unitario == null) {
					error = 1;
				};
			});
		});

		if (error == 1 ) {
			Mensagem.error("Para aprovar a contação, todos os itens devem possuir valor");
			return;
		} else {
			objeto['situacao'] = 1;
			$scope.json = angular.toJson(objeto);
			$http.post('api/index.php/aprovareprovacotacao/', $scope.json, 
						{withCredentials: true,
							headers: {'enctype': 'multipart/form-data' },
						}
			).success(function(data, status, headers, config) {
			if (data.error == '0'){
				Mensagem.success(data.mensagem);
				$scope.getListaCotacaoPendente();
			} else {
				Mensagem.error(data.mensagem);
			}
			}).error(function(data, status) { 
				// log error
			});
		}
	}

	$scope.abreModal = function(cotacao){
		$('#aprovacao').modal('show');
		$scope.id_cotacao = cotacao.id;
	}

	$scope.reprovarCotacao = function(justificativa){
		if ($('#cadastroJustificativa-form').valid()) {
		var objeto = {'id': $scope.id_cotacao, 'situacao': 3, 'justificativa':$scope.justificativa};
		$scope.json = angular.toJson(objeto);
		$http.post('api/index.php/aprovareprovacotacao/', $scope.json, 
				{withCredentials: true,
					headers: {'enctype': 'multipart/form-data' },
				}
		).success(function(data, status, headers, config) {
		if (data.error == '0'){
			Mensagem.success(data.mensagem);
			$('#aprovacao').modal('hide');
			$scope.getListaCotacaoPendente();
		} else {
			Mensagem.error(data.mensagem);
		}
		}).error(function(data, status) {
			// log error
		});
		}
	}

	$scope.cadastraCotacao = function(objeto, valor, idItem, idFornecedor, quantidade){

		objeto.valor_unitario 	 		= valor;				
		objeto.valor_total   	 		= quantidade * valor;
		objeto.id_cotacao_compra_itens 	= idItem;
		objeto.id_fornecedor 	 		= idFornecedor;
		objeto.id_cotacao_compra 		= $scope.cotacaoSelected.id;

		$scope.json = angular.toJson(objeto);
		$http.post('api/index.php/cadastracotacaolista/', $scope.json, 
					{withCredentials: true,
						headers: {'enctype': 'multipart/form-data' },
					}
		).success(function(data, status, headers, config) {
		if (data.error == '0'){
			Mensagem.success(data.mensagem);
		} else {
			Mensagem.error(data.mensagem);   
		}
		}).error(function(data, status) { 
			// log error
		});
	}

	// $scope.getListaCotacaoPendente();
	$scope.getListaCotacao();
});
//@ sourceURL=controller.consultaCotacao.js