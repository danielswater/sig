
smartSig.registerCtrl("consultaRelatorioAlunosReuniao", function($scope, $location, $http, $routeParams, Mensagem, $timeout, Permissao, $modal, $filter){

	$scope.alunosReuniao = {};
	$scope.etapas = [];
	$scope.cursos = [];
	$scope.turmas = [];
	var id_etapa = '';
	var id_curso = '';
	var id_turma = '';
	var id_aluno = '';

	$scope.getEtapa = function(){
		$http.get('api/index.php/etapa/1').    
		success(function(data, status, headers, config) {    
			$scope.etapas  = data.etapa;
		}).
		error(function(data, status, headers, config) {
        // log error
    });
	}

	$scope.getCurso = function(item){
		$http.get('api/index.php/cursoetapa/'+item.id_etapa.id).    
		success(function(data, status, headers, config) {                                 
			$scope.cursos = data.curso;
			id_etapa = item.id_etapa.id;
			console.log('ID ETAPA', id_etapa);
		}).
		error(function(data, status, headers, config) {
        // log error
    });
	}

	$scope.getTurma = function(item){
		$http.get('api/index.php/carregaetapacurso/'+item.id_curso.id+'/'+id_etapa).    
		success(function(data, status, headers, config) {                                 
			$scope.turmas = data.turmas;
			id_curso = item.id_curso.id;
		}).
		error(function(data, status, headers, config) {
        // log error
    });
	}

	$scope.getTurmaId = function(item){
		id_turma = item.id_turma.id;
		console.log("turma id", id_turma);
	}

	$scope.getPessoaExists = function(val) {
		return $http.get('api/index.php/stringaluno?aluno=1&', {
			params: {
				string: val,
				sensor: false
			}
		}).then(function(response){
			return response.data.pessoa;
		});
	};

	$scope.getPessoa = function(item, model, label){
		console.log(model);
		id_aluno = model.id;
	}

	$scope.getMatriculaExists = function(val) {
		return $http.get('api/index.php/stringmatricula?aluno=1&', {
			params: {
				string: val,
				sensor: false
			}
		}).then(function(response){		
			return response.data.pessoa;
		});
	};

	/*
	$scope.gerarReuniao = function(){
		var link = document.createElement('a');
		link.setAttribute('href', 'api/index.php/reuniaoalunopdf/'+id_etapa+'/'+id_curso+'/'+id_turma+'/'+id_aluno);
		link.click();
	}
	*/

	$scope.gerarReuniao = function(){
    
    	if ($('#consultaAlunosReuniao-form').valid()){
    		uri='api/index.php/reuniaoalunopdf/'+id_etapa+'/'+id_curso+'/'+id_turma+'/'+id_aluno;    	
    		window.open(uri, '_blank');
    	}
  	}

	$scope.getEtapa();

});
//@ sourceURL=controller.consultaAlunosReuniao.js