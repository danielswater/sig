/*
Módulo: Escola
Descrição: CRUD Consulta tipo de curso
Método: GET
URL: /escolaconsulta/consultaTipoCurso
Autenticação: Não
Resposta: JSON
Data de Criação: 21/03/2015
Autor: Luciano Almeida
Versão: 1.0
*/
smartSig.registerCtrl('consultaTipoCurso', function($scope, $http, $location, $filter, Permissao) {
	$scope.permissoes = Permissao.validaPermissao();

	$scope.permissoes.then(function (data) {
		$scope.permissoes = data;
	}, function (status) {
		console.log('status',status);
	});

	$scope.tipoCurso = [];
	$scope.searchNome = '';

	$http.get('api/index.php/tipocurso/1').
		success(function(data, status, headers, config) { 
			console.log('$scope.tipoCurso', $scope.tipoCurso);
			if (data.error == 0) {
				$scope.tipoCurso  = data.tipocurso;
			};
			console.log('data', data);
			console.log('$scope.tipoCurso', $scope.tipoCurso);
		}).
		error(function(data, status, headers, config) {
			// log error
		});

	$scope.editCadastro = function(id){
		$location.path('/escolaforms/formCadastroTipoCurso/1/'+id);
	}

	$scope.currentPage = 1;
	$scope.pageSize = 10;
	$scope.sort = {
		active: 'descricao',
		descending: undefined
	} 

	$scope.changeSorting = function(column) {
		var sort = $scope.sort;
		if (sort.active == column) {
			sort.descending = !sort.descending;
		} else {
			sort.active = column;
			sort.descending = false;
		}
	};

	$scope.getIcon = function(column) {
		var sort = $scope.sort;
		if (sort.active == column) {
			return sort.descending
			? 'glyphicon-chevron-up'
			: 'glyphicon-chevron-down';
		}
		return 'glyphicon-star';
	}
});