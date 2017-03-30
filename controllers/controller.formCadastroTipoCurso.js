/*
Módulo: Escola
Descrição: CRUD Tipo de Funcionário
Método: POST(cadastrarTipoCurso)/GET(getIdTipoCurso)
URL: /escolaforms/formCadastroTipoCurso
Autenticação: Não
Resposta: JSON
Data de Criação: 21/03/2015
Autor: Luciano Almeida
Versão: 1.0
 */
smartSig.registerCtrl("formCadastroTipoCurso", function($scope, $http, $routeParams, Mensagem, $timeout, Permissao){
	$scope.permissoes = Permissao.validaPermissao();
	$scope.permissoes.then(function (data) {
		$scope.permissoes = data;
	}, function (status) {
		console.log('status',status);
	});

	var idTipoCurso = $routeParams.id;

	$scope.error = '';
	$scope.tipoCurso = {};
	$scope.tipoCurso.ativo=1;

	$scope.cadastrarTipoCurso = function(objeto) {
		if ($('#cadastroTipoCurso-form').valid()) {
			$scope.json = angular.toJson($scope.tipoCurso);

			$http.post('api/index.php/tipocurso/', $scope.json, 
				{withCredentials: true,
					headers: {'enctype': 'multipart/form-data' },
				}
			).success(function(data, status, headers, config) {
				if (data.error != -1){
					$scope.objeto = {};

					Mensagem.success(data.mensagem); 

					$scope.tipoCurso.ativo=1;
					$scope.tipoCurso.id = data.id;
				} else {
					Mensagem.error(data.mensagem); 
				}
			}).error(function(data, status) {
				// log error
			});
		}
	}

	$scope.getIdTipoCurso = function(){
	$http.get('api/index.php/tipocurso/1/'+idTipoCurso).
		success(function(data, status, headers, config) {
		$scope.tipoCurso = data.tipocurso[0];
		console.log($scope.tipoCurso);
		}).
		error(function(data, status, headers, config) {
		// log error
		});
	} 

	if (idTipoCurso != undefined) {
	$timeout(function() {
		$scope.getIdTipoCurso(idTipoCurso);
	}, 800);
	};

	$scope.novoCadastro = function(){
	$scope.tipoCurso = {};
	$scope.tipoCurso.ativo = 1;
	}

});