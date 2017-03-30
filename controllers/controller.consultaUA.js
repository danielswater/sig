smartSig.registerCtrl('consultaUA', function($scope, $http, $location, $filter, filterFilter, $timeout, Permissao, $routeParams) {
	
	$scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

	$scope.quadras = {};
	
	/*
	$http.get('api/index.php/consultaunidadearmazenagem/').
	success(function(data, status, headers, config) {
		console.log(data);
		$scope.quadras = data;
		console.log('QUADRAS', $scope.quadras);
	}).
	error(function(data, status, headers, config) {
		// log error
	});
	*/

	$scope.setClass = function (status) {
		if (status == 1) {
			return 'icon-livre';	
		}
		else if(status == 2){
			return 'icon-ocupado';
		}
		else{
			return 'icon-bloqueado';
		}
		
	}

	$scope.editaUnidade = function(id){
		$location.path('/forms/formCadastroUA/1/'+id);
	}

	$scope.getDados = function(){

		console.log('ID QUADRA', $scope.dash.id_quadra);	    
	    $http.get('api/index.php/consultaunidadearmazenagem/'+$scope.dash.id_quadra)
	    .success(function(data, status, headers, config) {
	    	$scope.retorno = data.retorno[0];
	    	console.log('DADOS UNIDADE', $scope.retorno);
	    })
	    .error(function(data, status, headers, config) {});
	}

	$scope.getQuadras = function(){
	    
	    $http.get('api/index.php/quadra')
	    .success(function(data, status, headers, config) {
	        $scope.combo_quadras = data.quadra;  
	    })
	    .error(function(data, status, headers, config) {});
	}
	$scope.getQuadras();

});



smartSig.directive("popoverHtmlUnsafePopup", function () {
	return {
		restrict: "EA",
		replace: true,
		scope: { title: "@", content: "@", placement: "@", animation: "&", isOpen: "&" },
		templateUrl: "popover-html-unsafe-popup.html"
	};
})

.directive("popoverHtmlUnsafe", [ "$tooltip", function ($tooltip) {
	return $tooltip("popoverHtmlUnsafe", "popover", "click");
}]);