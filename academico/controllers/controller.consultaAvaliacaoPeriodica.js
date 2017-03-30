app.registerCtrl('consultaAvaliacaoPeriodica', function($scope, $location, $http, $routeParams, toaster, $window,$timeout) {

	$scope.tipo_avaliacao_periodica = [];
	$scope.turma_aluno = [];
	$scope.input = [];

	$scope.id_fase = $routeParams.fase;
	$scope.id_disciplina = $routeParams.disciplina;
	$scope.id_turma = $routeParams.turma;

	$scope.getOcorrencias = function(){
		$http.get('../api/index.php/tipoavaliacaoperiodica/').    
		success(function(data, status, headers, config) {
			if(data.error == 0){
				$scope.tipo_avaliacao_periodica = data.tipo_avaliacao_periodica;
			}
		}).
		error(function(data, status, headers, config) {
          // log error
      });
	}

	$scope.getTurmaAluno = function(){		
		$http.get('../api/index.php/turmaaluno/'+$scope.id_turma).    
		success(function(data, status, headers, config) {
			if(data.error == 0){
				$scope.turma_aluno = data.turma_aluno[0].alunos;
			}
		}).
		error(function(data, status, headers, config) {
        // log error
    });
	}

	$scope.salvaAvaliacaoPeriodica = function(aluno,ocorrencia, item){
		
		$timeout(function() {

			console.log(aluno,$scope.input[ocorrencia], item);
			
			var dados = {};

			dados.id_tipo_avaliacao_periodica = item;
			dados.id_turma = $scope.id_turma;
			dados.id_aluno = aluno;
			dados.id_disciplina = $scope.id_disciplina;
			dados.fase = $scope.id_fase;
			$scope.json = angular.toJson(dados);
			$http.post('../api/index.php/salvaavaliacaoperiodica/', $scope.json, 
				{withCredentials: true,
					headers: {'enctype': 'multipart/form-data' },
				}
				).success(function(data, status, headers, config) {
					if (data.error == '0'){
						$scope.input[ocorrencia]['id'] = data.id;
					}
					else					{
						console.log(data.error);
						//toaster.error({title: "Sala Virtual", body:data.mensagem});
					//Mensagem.error(data.mensagem);   
				}
			}).error(function(data, status) { 

			});
			console.log("Lista de ocorrencia",$scope.input[ocorrencia]);
		}, 50);
		
	}

	$scope.getAvaliacaoPeriodicaAluno = function(){
		$http.get('../api/index.php/listaavaliacaoperiodicaaluno/'+$scope.id_turma+"/"+$scope.id_disciplina+"/"+$scope.id_fase).    
		success(function(data, status, headers, config) {
			angular.forEach($scope.turma_aluno, function(value, key) {			  	
				$scope.input[key] = data.ocorrencias[value['id_pessoa']].ocorrencias;				  				
			});
		}).
		error(function(data, status, headers, config) {
        // log error
    });
	}



	$scope.getOcorrencias();
	$scope.getTurmaAluno();
	$scope.getAvaliacaoPeriodicaAluno();

});
//@ sourceURL=controller.consultaAvaliacaoPeriodica.js