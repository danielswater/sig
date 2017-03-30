/*
  Módulo: Mesquita
  Descrição: CRUD Fabricante
  Método: GET
  URL: /gestao/consultaBens
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 07/01/2014
  Autor: Ricardo Bruno
  Versão: 1.0
  Data de Alteração: 07/01/2014
  */
  smartSig.registerCtrl('consultaDoacao', function($scope, $http, $location, $filter, filterFilter, $timeout, Permissao, $routeParams, Mensagem) {

  	$scope.permissoes = Permissao.validaPermissao();

  	$scope.permissoes.then(function (data) {
  		$scope.permissoes = data;
  	}, function (status) {
  		console.log('status',status);
  	});

  	$scope.doacao = [];

  	$scope.searchNome = '';

  	$scope.getDoacao = function(){
  		$http.get('api/index.php/doacao').    
  		success(function(data, status, headers, config) {                                 
  			$scope.doacao  = data.doacao;
  			console.log('doacao', data.doacao);
  		}).
  		error(function(data, status, headers, config) {
        // log error
    });
  	}

  	$scope.editCadastro = function(id){
  		$location.path('/forms/formCadastroDoacao/1/'+id)
  	}      

  	$scope.filtro = function(){
  		$scope.counter++;
  		console.log($scope.counter);
  	}

  	$scope.$watch("searchNome", function(q){
  		console.log(q);
        //$scope.filteredData = $filter("filter")($scope.data, query);
    });

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

  	$scope.excluirCadastro = function(id){
  		$scope.doacao.id = id;
  		$scope.json = angular.toJson($scope.doacao.id);
  				$.SmartMessageBox(
			{
				title : "Excluir Doação",
				content : "Tem certeza que deseja excluir?",
				buttons : '[Não][Sim]'
			}, function(ButtonPressed) {
				if (ButtonPressed == "Sim") {
					$http.post('api/index.php/deldoacao/', $scope.json,
						{withCredentials: true,
							headers: {'enctype': 'multipart/form-data' },
							// transformRequest: angular.identity
						})
					.success(function(data, status, headers, config) {
						Mensagem.success(data.mensagem);
  						$scope.getDoacao();
				})
				.error(function(data, status) {
					Mensagem.error('Erro na exclusão de doação');
				});
			}
		});
  	} 

  	$scope.getIcon = function(column) {
  		var sort = $scope.sort;        
  		if (sort.active == column) {
  			return sort.descending
  			? 'glyphicon-chevron-up'
  			: 'glyphicon-chevron-down';
  		}        
  		return 'glyphicon-star';
  	}
  	$scope.getDoacao();
  });