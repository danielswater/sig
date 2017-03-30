app.registerCtrl('comunicadoGeral', function($scope, $http, $location, $routeParams) {
		
	$scope.carregarComunicado = function(){
		
		$http.get('../api/index.php/carregarcomunicado')
		.success(function(data, status, headers, config) {
			if(data.error == 0){
				$scope.comunicado = data.retorno;
			}
		})
		.error(function(data, status, headers, config) {});		
	}
	$scope.carregarComunicado();

	$scope.editar = function(id){
		$location.path('/novoComunicado/'+id);		
	}
});
//@ sourceURL=controller.comunicadoGeral.js