
app.registerCtrl('aluno', function($scope, $http, $location, $routeParams) {
	console.log('deu');
	$scope.aluno = [];
	$scope.comunicados = [];
	$scope.faltas = {};

	$scope.getAluno = function(){
		
		$http.get('../api/index.php/getlistadadosaluno')
		.success(function(data, status, headers, config) {
			if(data.error == 0){
				$scope.aluno = data.retorno[0];
				id_turma = data.retorno[0].id_turma;
				$scope.getComunicadoTurma(id_turma);
			}
		})
		.error(function(data, status, headers, config) {});		
	}

	$scope.getComunicadoTurma = function(id_turma){
		$http.get('../api/index.php/listacomunicadoturmaaluno/'+id_turma)
		.success(function(data, status, headers, config) {
			if(data.error == 0){
				$scope.comunicados = data.retorno;
				console.log("COMUNICADOS", $scope.comunicados);
			}
		})
		.error(function(data, status, headers, config) {});	
	}

	$scope.getFaltaAluno = function(){
		var maxSerie;
		$http.get('../api/index.php/getfaltaaluno')
		.success(function(data, status, headers, config) {
			if(data.error == 0){
				$scope.faltas = data.retorno;
				for(var i = 0; i < $scope.faltas.length; i++){
					maxSerie = $scope.faltas[i].fase;
					if($scope.faltas[i].fase >= maxSerie);
					maxSerie = $scope.faltas[i].fase;
				}
				$scope.maxSeries = parseInt(maxSerie);
				
			}
		})
		.error(function(data, status, headers, config) {});	
	}

	$scope.getNumber = function(num) {
        return new Array(num);   
    }

	$scope.getAluno();
	//$scope.getComunicadoTurma();
	$scope.getFaltaAluno();

});