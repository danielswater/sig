app.registerCtrl('salaVirtual', function($scope, $location, $http, $routeParams) {

	$scope.salavirtual = [];
	$scope.filtraSala = [];
	$scope.filteredTodos = [];
	$scope.itemsPerPage = 5;
	$scope.currentPage = 1;

	$scope.getSalaVirtual = function(){
		$http.get('../api/index.php/salavirtual/').    
		success(function(data, status, headers, config) {
			if(data.error == 0){
				$scope.salavirtual = data.salavirtual;
				console.log("sala", $scope.salavirtual);
				$scope.figureOutTodosToDisplay();
			}
		}).
		error(function(data, status, headers, config) {
          // log error
      });
	}

	$scope.figureOutTodosToDisplay = function() {
		var begin = (($scope.currentPage - 1) * $scope.itemsPerPage);
		var end = begin + $scope.itemsPerPage;
		$scope.filteredTodos = $scope.salavirtual.slice(begin, end);
	};

	$scope.pageChanged = function() {
		$scope.figureOutTodosToDisplay();
	};

	$scope.getSalaVirtual();
});