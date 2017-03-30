smartSig.registerCtrl('consultaPadrinhos', function($scope, $http, $location, $filter, filterFilter, Mensagem, $timeout, Permissao, $routeParams) {
	$scope.permissoes = Permissao.validaPermissao();
	$scope.permissoes.then(function (data) {
		$scope.permissoes = data;
	}, function (status) {
		console.log('status',status);
	});

	//var user = Array();
	$scope.user = [];
	$scope.searchNome = '';
	$http.get('api/index.php/consultapessoa/15').    
		success(function(data, status, headers, config) {                                 
			$scope.user  = data.pessoa;
		}).
		error(function(data, status, headers, config) {
		// log error
		});

	$scope.editCadastro = function(id){
		$location.path('/escolaforms/formCadastroPadrinhos/1/'+id)
	}      
	
	$scope.filtro = function(){
		$scope.counter++;
		console.log($scope.counter);
	}
	
	$scope.$watch("searchNome", function(q){
		console.log(q);
		//$scope.filteredData = $filter("filter")($scope.data, query);
	});
	
	$scope.tabelaConsulta = function(){
		$scope.tableParams = new ngTableParams({
			page: 1,            // show first page
			count: 10,          // count per page
			filter: {
				nome: ''       // initial filter
			},
			sorting: {
				nome: 'asc'     // initial sorting
			}
		}, {
			total: user.length, // length of data
			getData: function($defer, params) {
				// use build-in angular filter
				var filteredData = params.filter() ?
						$filter('filter')(user, params.filter()) :
						user;
				var orderedData = params.sorting() ?
						$filter('orderBy')(filteredData, params.orderBy()) :
						user;

				params.total(orderedData.length); // set total for recalc pagination
				$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
			}
		});
	}

	$scope.updatePessoa = function(id) {
		$http.post('api/index.php/updatepessoa/' + id).
			success(function(data, status, headers, config) {
				if (data.error == 0) {
					Mensagem.success(data.mensagem);
				}
			}).
			error(function(data, status, headers, config) {
				Mensagem.error(data.mensagem);
				// log error
			});
	}

	$scope.currentPage = 1;
	$scope.pageSize = 10;    
	$scope.sort = {        
		active: 'nome',
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