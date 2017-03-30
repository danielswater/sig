/*
Módulo: Mesquita
Descrição: CRUD Tipo de Evento
Método: GET
URL: /forms/formCadastroTipoEvento
Autenticação: Não
Resposta: JSON
Data de Criação: 26/11/2014
Autor: Ricardo Bruno
Versão: 1.0
Data de Alteração: 06/04/2015
Autor: Luciano Almeida
Descrição: Quando salvar ou alterar, manter os dados na tela, não destruir o objeto
*/
smartSig.registerCtrl("formCadastroTipoEvento", function($scope, $http, $routeParams, Mensagem, $timeout, Permissao){
	$scope.permissoes = Permissao.validaPermissao();
	$scope.permissoes.then(function (data) {
		$scope.permissoes = data;
	}, function (status) {
		console.log('status',status);
	});

	var idTipoEvento = $routeParams.id;

	$scope.tipoevento = {};
	$scope.error = '';  
	$scope.tipoevento.ativo=1;

	$scope.cadastrarTipoEvento = function(objeto) {
		if ($('#cadastroTipoEvento-form').valid()) {
			$scope.json = angular.toJson($scope.tipoevento);
			$http.post('api/index.php/tipoevento/', $scope.json, 
				{withCredentials: true,
					headers: {'enctype': 'multipart/form-data' },
				}
			).success(function(data, status, headers, config) {
				if (data.error == '0'){
					$scope.objeto = {}; 
					Mensagem.success(data.mensagem);
				} else {
					Mensagem.error(data.mensagem);
				}
			}).error(function(data, status) { 
				// log error
			});
		}
	}

	$scope.getIdTipoEvento = function(){
		$http.get('api/index.php/ctipoevento/'+idTipoEvento).
		success(function(data, status, headers, config) {
			$scope.tipoevento = data.tipoevento[0];
		}).
		error(function(data, status, headers, config) {
			// log error
		});
	}

	if (idTipoEvento != undefined) {
		console.log("teste");
		$scope.getIdTipoEvento();
	};

	$scope.novoCadastro = function(){
		$scope.tipoevento = {};
		$scope.tipoevento.ativo = 1;
	}
});