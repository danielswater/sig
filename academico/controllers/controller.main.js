app.controller('main', function($scope, $http, $location, $routeParams, $filter) {
	
	$scope.fases = [];

	$http.get('../api/index.php/fase/').
    success(function(data, status, headers, config) {
    	$scope.fases = data.retorno;
	}).error(function(data, status, headers, config) {});


	/*** INICIO - Metodo FiltroAluno ********************************/
	$scope.filtroAluno = {};
	$scope.filtroAluno.dados = {};

	$scope.filtroAluno.filtraTurma = function(turma){	
		console.log('filtraTurma',turma);
    	if(turma != null){
	    	$scope.filtroAluno.dados.turmaAlunos = turma.alunos;	    	
	    	$scope.filtroAluno.dados.showTurmaAlunos = true;	    	
	    	$scope.filtroAluno.dados.busca.id_turma = turma.id_turma;
    	}else{
    		$scope.filtroAluno.dados.turmaAlunos = {};
    		$scope.filtroAluno.dados.busca.id_turma = null;
    	}
    	$scope.filtroAluno.dados.busca.nome = '';
    	$scope.filtroAluno.dados.busca.codigo = '';
    }

	$scope.filtroAluno.getTurmaAluno = function(){
		$http.get('../api/index.php/turmaaluno')
    	.success(function(data, status, headers, config) {

        	$scope.filtroAluno.dados.turmaAlunos = data.turma_aluno;

        	$scope.filtroAluno.getTurma();

      	}).error(function(data, status, headers, config) {}); 
    }

    $scope.filtroAluno.getTurma = function(){
		$http.get('../api/index.php/listapessoaturma/')
		.success(function(data, status, headers, config) {
			if(data.error == 0){
	
				$scope.filtroAluno.dados.turmas = data.turma;
				tam1 = $scope.filtroAluno.dados.turmas.length;
				tam2 = $scope.filtroAluno.dados.turmaAlunos.length;
				
				for (var i=0; i<tam1; i++) {
					for (var j=0; j<tam2; j++) {
						if($scope.filtroAluno.dados.turmas[i].id_turma==$scope.filtroAluno.dados.turmaAlunos[j].id_turma){
							$scope.filtroAluno.dados.turmas[i].alunos = $scope.filtroAluno.dados.turmaAlunos[j].alunos;				    	
						}
					}
				}
			}

		}).error(function(data, status, headers, config) {}); 
	}

	$scope.filtroAluno.carregar = function(){
		$scope.filtroAluno.dados = {
			'turmas': {},
			'turmaAlunos': {},
			'showTurmaAlunos': false,
			'alunos': {},
			'busca': {},
		};

		$scope.filtroAluno.getTurmaAluno();
	}

	/*** FIM - Metodo FiltroAluno *********************************/

	/*** INICIO - Metodo FiltroAvancado ********************************/
	$scope.filtroAvancado = {};
	$scope.filtroAvancado.busca = {};

	$scope.filtroAvancado.getCurso = function(){
		$http.get('../api/index.php/listacombocursos/').    
		success(function(data, status, headers, config) {
			if(data.error == 0){
				$scope.filtroAvancado.cursos = data.cursos;
			}
		}).error(function(data, status, headers, config) {}); 
	}

	$scope.filtroAvancado.getSerie = function(id_curso){
		$scope.filtroAvancado.series = {};
		delete $scope.filtroAvancado.serie;
		$scope.filtroAvancado.turmas = {};
		delete $scope.filtroAvancado.busca.id_turma;
		$scope.filtroAvancado.disciplinas = {};
		delete $scope.filtroAvancado.busca.id_disciplina;
		$scope.filtroAvancado.professores = {};
		delete $scope.filtroAvancado.busca.id_professor;

		$http.get('../api/index.php/serie/'+id_curso).    
		success(function(data, status, headers, config) {			
			if(data.error == 0){
				var inicio = data.serie[0].primeira_serie;
				var fim = data.serie[0].ultima_serie;

				var aSerie = [];
				for(var i = inicio; i <= fim; i++){
					aSerie.push({
						id : i,
						value: i + "º Série"
					});
				}

				$scope.filtroAvancado.series = aSerie;
			}
		}).error(function(data, status, headers, config) {}); 
	}

	$scope.filtroAvancado.getTurma = function(id_serie, id_curso){
		$scope.filtroAvancado.turmas = {};
		delete $scope.filtroAvancado.busca.id_turma;
		$scope.filtroAvancado.disciplinas = {};
		delete $scope.filtroAvancado.busca.id_disciplina;
		$scope.filtroAvancado.professores = {};
		delete $scope.filtroAvancado.busca.id_professor;

		if(serie == null){
			$scope.grid = [];		
		}
		else{
			$http.get('../api/index.php/listacomboturmas/'+id_curso+'/'+id_serie).    
			success(function(data, status, headers, config) {			
				if(data.error == 0){				
					$scope.filtroAvancado.turmas = data.turmas;
				}
				else{
					$scope.tabelaDisciplina = false;
					toaster.error({title: "Série", body:data.mensagem});
				}
			}).error(function(data, status, headers, config) {});
		}
	}

	$scope.filtroAvancado.getDisciplina = function(id_curso, id_serie, id_turma){
		$scope.filtroAvancado.disciplinas = {};
		delete $scope.filtroAvancado.busca.id_disciplina;
		$scope.filtroAvancado.professores = {};
		delete $scope.filtroAvancado.busca.id_professor;

		$http.get('../api/index.php/listacombodisciplinas/'+id_curso).    
		success(function(data, status, headers, config) {
			if(data.error == 0){				
				$scope.filtroAvancado.disciplinas = data.disciplina;
			}
		}).error(function(data, status, headers, config) {}); 
	}

	$scope.filtroAvancado.getProfessor = function(id_curso, id_serie, id_turma, id_disciplina){
		$scope.filtroAvancado.professores = {};
		delete $scope.filtroAvancado.busca.id_professor;

		$http.get('../api/index.php/professor/'+id_curso+"/"+id_disciplina).
		success(function(data, status, headers, config) {
			if(data.error == 0){
				$scope.filtroAvancado.professores = data.professor;
			}
		}).error(function(data, status, headers, config) {});
	}

	$scope.filtroAvancado.carregar = function(){
		$scope.filtroAvancado.busca = {};
		$scope.filtroAvancado.cursos = {};
		$scope.filtroAvancado.series = {};
		$scope.filtroAvancado.turmas = {};
		$scope.filtroAvancado.disciplinas = {};
		$scope.filtroAvancado.professores = {};

		$scope.filtroAvancado.getCurso();
	}
	/*** FIM - Metodo FiltroAvancado *********************************/

	/*** INICIO - Metodo typeahead *********************************/
	$scope.typeahead = {};
	$scope.typeahead.exists = function(obj, val, propiedade) {
		var arrCamp = $filter('filter')(obj, function(item){
			var txt = eval("item." + propiedade);
			if(txt != null && txt != '' && txt != undefined){
				if(isNaN(txt)){
					txt = txt.toUpperCase();
				}
				if(val.toUpperCase() ==  txt.substring(0, val.length)){
					return item;
				}
			}
		});

		return arrCamp;
	};

	$scope.typeahead.onSelect = function(item, model, label){
    	
	}
	/*** FIM - Metodo typeahead *********************************/

});