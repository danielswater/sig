app.registerCtrl('consultaFaltas', function($scope, $location, $http, $routeParams, toaster, $window,$timeout) {

	$scope.ocorrencias = [];

	$scope.id_fase = $routeParams.fase;
	$scope.id_disciplina = $routeParams.disciplina;
	$scope.id_professor = $routeParams.professor;
	$scope.id_turma = $routeParams.turma;
	$scope.id_curso = $routeParams.curso;
	$scope.id_aula = $routeParams.aula;

	$scope.disciplina = [];
	$scope.fases = [];
	$scope.curso = [];
	$scope.turma = [];
	$scope.alunoFaltas = [];
	$scope.totalFaltas = [];
	$scope.totalPessoa = [];
	$scope.diario = {};
	$scope.input = [];

	$scope.getOcorrencias = function(){
		$http.get('../api/index.php/ocorrenciasaula/').    
		success(function(data, status, headers, config) {
			if(data.error == 0){
				$scope.ocorrencias = data.ocorrencia;
			}
		}).
		error(function(data, status, headers, config) {
          // log error
      });
	}

	$scope.getDisciplina = function(){
		$http.get('../api/index.php/disciplina/1/'+$scope.id_disciplina).    
		success(function(data, status, headers, config) {
			if(data.error == 0){
				$scope.disciplina = data.disciplina[0];
			}
		}).
		error(function(data, status, headers, config) {
        // log error
    }); 
	}

	$scope.getDuracaoFase = function(){		
		$http.get('../api/index.php/duracaofase/'+$scope.id_fase).    
		success(function(data, status, headers, config) {
			if(data.error == 0){
				$scope.fases = data.duracao_fase[0];
			}
		}).
		error(function(data, status, headers, config) {
        // log error
    });
	}

	$scope.getCurso = function(){
		$http.get('../api/index.php/curso/1/'+$scope.id_curso).    
		success(function(data, status, headers, config) {
			if(data.error == 0){
				$scope.curso = data.curso[0];
			}
		}).
		error(function(data, status, headers, config) {
        // log error
    });
	}

	$scope.getTurma = function(){
		$http.get('../api/index.php/turma/1/'+$scope.id_turma).    
		success(function(data, status, headers, config) {
			if(data.error == 0){
				$scope.turma = data.turma[0];
			}
		}).
		error(function(data, status, headers, config) {
        // log error
    });
	}

	$scope.getListaAulasTurma = function(){
		$http.get('../api/index.php/listaaulasturma/'+$scope.id_aula).    
		success(function(data, status, headers, config) {
			if(data.error == 0){
				$scope.alunoFaltas = data.aulas.turma_aluno[0].alunos;
				var totalAula = data.aulas.turma_aluno[0].alunos[0].quantidade_aula;
				totalAula = parseInt(totalAula);

				for(var i = 0; i < totalAula; i++){
					$scope.totalFaltas.push({
						value : i,
						qtd : i + 1,
						id_aulas: $scope.id_aula
					});
				}
			}
		}).
		error(function(data, status, headers, config) {
        // log error
    });
	}

	$scope.salvaFaltaAluno = function(index, aluno){
		$scope.diario[index].id_aluno = aluno;
		$scope.json = angular.toJson($scope.diario[index]);
			$http.post('../api/index.php/salvafaltaaluno/', $scope.json, 
				{withCredentials: true,
					headers: {'enctype': 'multipart/form-data' },
				}
				).success(function(data, status, headers, config) {
					if (data.error == '0'){
						$scope.diario[index].id_falta_aluno = data.id_falta_aluno;
						if(data.tipo == "info"){
							toaster.warning({title: "Faltas", body: data.mensagem})
						}
						else{
							toaster.success({title: "Faltas", body: data.mensagem})
						}
						
					}
					else					{
						console.log(data.error);
						//toaster.error({title: "Sala Virtual", body:data.mensagem});
					//Mensagem.error(data.mensagem);   
				}
			}).error(function(data, status) { 

			});
	}

	$scope.salvaOcorrencia = function(aluno,ocorrencia, item){
		
		$timeout(function() {

			console.log(aluno,$scope.input[ocorrencia], item)

			// $scope.input[ocorrencia]['id_aulas'] = $scope.id_aula;
			// $scope.input[ocorrencia]['id_ocorrencia_aula'] = item;
			// $scope.input[ocorrencia]['id_aluno'] = aluno;
			
			var dados = {};

			dados.id_ocorrencia_aula = item;
			dados.id_aula = $scope.id_aula;
			dados.id_aluno = aluno;

			
			$scope.json = angular.toJson(dados);
			$http.post('../api/index.php/salvaocorrenciaaluno/', $scope.json, 
				{withCredentials: true,
					headers: {'enctype': 'multipart/form-data' },
				}
				).success(function(data, status, headers, config) {
					if (data.error == '0'){
						$scope.input[ocorrencia]['id'] = data.id;
						if(data.tipo == "info"){
							toaster.warning({title: "Ocorrência", body:data.mensagem});
						}
						else{
							toaster.success({title: "Ocorrência", body:data.mensagem});
						}
						
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

	$scope.getSelectFaltas = function(index,aluno){
		$timeout(function(){
			$http.get('../api/index.php/selectfaltas/'+$scope.id_aula+'/'+aluno).    
			success(function(data, status, headers, config) {
				if(data.error == 0){
					$scope.diario[index] = $scope.totalFaltas[data.faltas[0].quantidade_faltas - 1];
				}
			}).
			error(function(data, status, headers, config) {
        // log error
    });
		}, 50);
	}


	$scope.getListaOcorrenciaAlunos = function(){
		$timeout(function(){
			$http.get('../api/index.php/listaocorrenciaalunos/'+$scope.id_aula).    
			success(function(data, status, headers, config) {
				angular.forEach($scope.alunoFaltas, function(value, key) {			  	
					$scope.input[key] = data.ocorrencias[value['id_pessoa']].ocorrencias;				  				
				});
			}).
			error(function(data, status, headers, config) {
        // log error
    });
		}, 50);
	}

	$scope.getOcorrencias();
	$scope.getDisciplina();
	$scope.getDuracaoFase();
	$scope.getCurso();
	$scope.getTurma();
	$scope.getListaAulasTurma();
	$scope.getListaOcorrenciaAlunos();

});