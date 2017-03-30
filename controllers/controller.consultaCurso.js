/*
Módulo: Escola
Descrição: CRUD Consulta curso
Método: GET
URL: /escolaconsulta/consultaCurso
Autenticação: Não
Resposta: JSON
Data de Criação: 22/03/2015
Autor: Luciano Almeida
Versão: 1.0
*/
smartSig.registerCtrl('consultaCurso', function($scope, $http, $location, $filter, Permissao) {
	$scope.permissoes = Permissao.validaPermissao();

	$scope.permissoes.then(function (data) {
		$scope.permissoes = data;
	}, function (status) {
		console.log('status',status);
	});

	$scope.curso = [];
	$scope.searchNome = '';

	$http.get('api/index.php/curso/1').
		success(function(data, status, headers, config) { 
			console.log('$scope.curso', $scope.curso);
			if (data.error == 0) {
				$scope.curso  = data.curso;
				console.log('$scope.curso',$scope.curso);
			};
		}).
		error(function(data, status, headers, config) {
			// log error
		});

	$scope.editCadastro = function(id){
		$location.path('/escolaforms/formCadastroCurso/1/'+id);
	}

	$scope.currentPage = 1;
	$scope.pageSize = 10;
	$scope.sort = {
		active: 'id_ciclo',
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