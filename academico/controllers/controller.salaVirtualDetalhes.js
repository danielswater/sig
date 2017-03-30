app.registerCtrl('salaVirtualDetalhes', function($scope, $location, $http, $routeParams) {

	console.log('detalhes', $routeParams.id);

	$scope.salavirtualdetalhes = [];

	$scope.getSalaVirtualDetalhes = function(){
		$http.get('../api/index.php/salavirtualdetalhes/'+$routeParams.id).    
		success(function(data, status, headers, config) {
			if(data.error != -1){
				console.log(data);
				$scope.salavirtualdetalhes = data.detalhes;				
			}
		}).
		error(function(data, status, headers, config) {
          // log error
      });
	}
	$scope.getSalaVirtualDetalhes();

});