app.registerCtrl('consultaConteudo', function($scope, $location, $http, $routeParams, toaster, $window) {

	$scope.valor = false;

	$scope.id_fase = $routeParams.fase;
	$scope.id_disciplina = $routeParams.disciplina;
	$scope.id_professor = $routeParams.professor;
	$scope.id_turma = $routeParams.turma;
	$scope.id_curso = $routeParams.curso;
	$scope.ano = '';
	$scope.disciplina = [];
	$scope.fases = [];
	$scope.curso = [];
	$scope.turma = [];
	$scope.conteudo = {};
	$scope.aulas = [];
	$scope.nomeBotao = 'Gravar';
	$scope.statusBotao = false;
	$scope.atualizar = false;

	var date = new Date();
	$scope.ano = date.getFullYear();

	$scope.incluiConteudo = function(){
		if($scope.valor == false){
			$scope.conteudo = {};
			$scope.nomeBotao = 'Gravar';
			$scope.statusBotao = true;
			$scope.valor = true;
		}
		else{
			if($scope.atualizar == true){
				$scope.valor = true;
				$scope.conteudo = {};
				$scope.nomeBotao = 'Gravar';
				$scope.statusBotao = true;
			}
			else{
				$scope.valor = false;;
			}
			
		}
	}

	$scope.getDisciplina = function(){
		$http.get('../api/index.php/disciplina/1/'+$scope.id_disciplina).    
		success(function(data, status, headers, config) {
			if(data.error == 0){
				$scope.disciplina = data.disciplina[0];
				console.log("DISCIPLINA", $scope.disciplina);
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

	$scope.cadastrarConteudoAulas = function(){
		if ($('#cadastrarConteudo-form').valid()) {

			$scope.conteudo.id_turma = $scope.id_turma;
			$scope.conteudo.id_disciplina = $scope.id_disciplina;
			$scope.conteudo.id_pessoa_professor = $scope.id_professor;
			$scope.conteudo.fase = $scope.id_fase;

			$scope.json = angular.toJson($scope.conteudo);

			$http.post('../api/index.php/cadastrarconteudoaulas/', $scope.json, 
				{withCredentials: true,
					headers: {'enctype': 'multipart/form-data' },
				}
				).success(function(data, status, headers, config) {
					if (data.error == '0'){
						console.log(data);
						if($scope.statusBotao == true){
							$scope.conteudo = {};
						}						
						toaster.success({title: "Conteúdo", body: data.mensagem});
						$scope.getAulas();
					}
					else
					{
						toaster.error({title: "Conteúdo", body:data.mensagem});
					//Mensagem.error(data.mensagem);   
				}
			}).error(function(data, status) { 

			});

		}
	}

	$scope.getAulas = function(){
		$http.get('../api/index.php/aulas/0/'+$scope.id_turma+'/'+$scope.id_fase+'/'+$scope.id_disciplina+'/'+$scope.id_professor).    
		success(function(data, status, headers, config) {
			if(data.error == 0){
				$scope.aulas = data.aulas;
				console.log("AULAS", $scope.aulas);
			}
		}).
		error(function(data, status, headers, config) {
        // log error
    });
	}

	$scope.editaConteudo = function(aula){
		$scope.nomeBotao = 'Atualizar';
		$scope.statusBotao = false;
		$scope.valor = true;
		$scope.atualizar = true;
		$scope.conteudo = aula;
	}

	$scope.limparCampos = function(){
		$scope.conteudo = {};
		$scope.valor = false;
		$scope.atualizar = false;
		$scope.statusBotao = false;

	}

	$scope.excluirConteudoAula = function(aula){
		$scope.json = angular.toJson(aula);
			$http.post('../api/index.php/excluirconteudoaula/', $scope.json, 
				{withCredentials: true,
					headers: {'enctype': 'multipart/form-data' },
				}
				).success(function(data, status, headers, config) {
					if (data.error == '0'){
						console.log(data);					
						toaster.success({title: "Aula", body: data.mensagem});
						$scope.getAulas();
					}
					else
					{
						toaster.error({title: "Aula", body:data.mensagem});
					//Mensagem.error(data.mensagem);   
				}
			}).error(function(data, status) { 

			});
	}

	$scope.getDisciplina();
	$scope.getDuracaoFase();
	$scope.getCurso();
	$scope.getTurma();
	$scope.getAulas();

});;
