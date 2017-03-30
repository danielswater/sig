app.registerCtrl('consultaConteudoPresenca', function($scope, $location, $http, $routeParams, toaster, $window) {

	$scope.id_fase = $routeParams.id;
	$scope.grid = [];
	$scope.serieId = '';
	$scope.tabelaDisciplina = false;
	$scope.cursoId = '';

	$scope.getGridDisciplina = function(curso, ano, serie, turma, disciplina, professor){
		$http.get('../api/index.php/griddisciplinas/'+curso+'/'+ano+'/'+serie+'/'+turma+'/'+disciplina+'/'+professor).    
		success(function(data, status, headers, config) {
			if(data.error == 0){				
				$scope.grid = data.disciplina;
				console.log("GRID",$scope.grid)
				$scope.tabelaDisciplina = true;
			}
		}).error(function(data, status, headers, config) {}); 		
	}

	$scope.redirectPage = function(fase, disciplina, professor, turma){
		fase = $scope.id_fase;
		$location.path("consultaConteudo/"+fase+'/'+disciplina+'/'+professor+'/'+turma+'/'+$scope.cursoId);
	}
	
	$scope.$parent.$watch('filtroAvancado.busca.id_curso', function(){  
		var aBusca = $scope.$parent.filtroAvancado.busca;
		if(typeof aBusca.id_curso != 'undefined'){
			$scope.getGridDisciplina(aBusca.id_curso, 0, 0, 0, 0, 0);	
		}else{
			$scope.grid = [];
			$scope.serieId = '';
			$scope.cursoId = '';
			$scope.tabelaDisciplina = false;
		}
	});
});