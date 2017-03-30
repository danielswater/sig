app.registerCtrl('consultaAvaliacoes', function($scope, $http, $routeParams, $filter,  toaster) {
	
	$scope.pgSelected = {
		'id_curso' : $routeParams.curso,
		'id_professor' : $routeParams.professor,
		'id_turma' : $routeParams.turma,
		'id_disciplina' : $routeParams.disciplina,
		'fase' : $routeParams.fase
	};

	$scope.id_curso = $routeParams.curso;
	$scope.id_fase = $routeParams.fase;
	$scope.id_disciplina = $routeParams.disciplina;
	$scope.id_turma = $routeParams.turma;
	$scope.id_fase = $routeParams.fase;

	console.log("curso", $scope.id_curso);
	console.log("turma", $scope.id_turma);
	console.log("fase", $scope.id_fase);
	
	//$scope.avaliacoesContinuas = [{"item":"Av Contínua 1"},{"item":"Av Contínua 2"},{"item":"Av Contínua 3"},{"item":"Av Contínua 4"}];
	$scope.cursos = {};
	$scope.avaliacoesContinuas = {};
	$scope.avaliacoesTrimestrais = [{"item":"Av Trimestral 1"},{"item":"Av Trimestral 2"},{"item":"Av Trimestral 3"},{"item":"Av Trimestral 4"}];
	$scope.bonus = [{"item":"Bonus 1"},{"item":"Bonus 2"}];
	$scope.recuperacao = [{"item":"Recuperação 1"},{"item":"Recuperação 2"}];
	/*
	$scope.modalAvaliacaoDescritiva = function(){		
		$("#modal_avaliacao_descritiva").modal('show');
	}

	$scope.modalDetalheAvaliacaoDescritiva = function(){
		$("#modal_detalhe_avaliacao_descritiva").modal('show');
	}
	*/

	$scope.modalDetalheAvaliacaoImpressao = function(){
		$("#modal_detalhe_avaliacao_impressao").modal('show');
	}

	$scope.modalConfigAvaliacaoContinua = function(){
		$("#modal_config_avaliacao").modal('show');
	}

	$scope.modalNotasAlunos = function(){
		$("#modal_notas_alunos").modal('show');
	}

	$scope.getNotaAvaliacao = function(id_curso, id_turma, fase){
		var notas = [];
		$http.get('../api/index.php/notaavaliacao/'+id_curso+'/'+id_turma+'/'+fase).
		success(function(data, status, headers, config) {
			if(data.error == 0){
				notas = data.nota_avaliacao;
			}
		}).error(function(data, status, headers, config) {
            // log error
        }); 
		return notas;
	}

	$scope.getDisciplina = function(id_disciplina){
		$http.get('../api/index.php/disciplina/1/'+id_disciplina).
		success(function(data, status, headers, config) {
			if(data.error == 0){
				$scope.pgSelected.disciplina = data.disciplina[0];

				console.log("getDisciplina", $scope.pgSelected.disciplina);
			}
		}).error(function(data, status, headers, config) {
	        // log error
	    }); 
	}

	$scope.getNotaDetalhe = function(id_curso){
		$http.get('../api/index.php/notadetalhe/'+id_curso).
		success(function(data, status, headers, config) {
			if(data.error == 0){
				$scope.avaliacoesContinuas = data.nota_detalhe;

				console.log('avaliacoesContinuas', $scope.avaliacoesContinuas);
			}
		}).error(function(data, status, headers, config) {
	        // log error
	    }); 
	}

	$scope.valida = function(valor){
		var rValor;
		if(isNaN(valor)){
			rValor = '';
		}else{
			rValor = valor;
		}

		return rValor;
	}

	$scope.getCursoTurmaAlunoComponente = function(id_curso, id_turma, fase){
		var valor, num, idArredondamento;
		$http.get('../api/index.php/cursoturmaalunocomponente/'+id_curso+'/'+id_turma+'/'+fase).
		success(function(data, status, headers, config) {
			console.log("data", data);
			if(data.error == 0){
				valor = 0;
				$scope.cursos = data.curso_turma_aluno_componente;
				arrItem = {};
				angular.forEach($scope.cursos[0].turmas[0].alunos, function(vAluno, index) {
					num = 0;
					arrComponente = $filter('filter')(vAluno.componentes, {recuperacao:0});
					angular.forEach(arrComponente, function(vComponente, key) {
						if(vComponente.nota != null && vComponente.nota != ''){
							console.log('vComponente', vComponente);
							idArredondamento = vComponente.id_arredondamento;
							valor = valor + parseFloat(vComponente.nota);
							num++;
						}
					});
					//arrItem[index] = $scope.valida(vAluno);
					arrItem[index] = vAluno;
					arrItem[index].calculo_parcial = $scope.valida(valor/num);
					nota_parcial = $scope.calcularArredondamento(idArredondamento ,(valor/num));
					arrItem[index].nota_parcial = $scope.valida(nota_parcial);

					arrRecuperacao = $filter('filter')(vAluno.componentes, {recuperacao:1});
					valor_final = (valor/num);
					console.log('arrRecuperacao', arrRecuperacao);
					if(arrRecuperacao.length > 0){
						if(arrRecuperacao[0].nota != null){
							valor_final = ((valor/num) + parseFloat(arrRecuperacao[0].nota))/2;
						}
					}

					arrItem[index].calculo_final = $scope.valida(valor_final);

					nota_final = $scope.calcularArredondamento(idArredondamento ,valor_final);
					arrItem[index].nota_final = $scope.valida(nota_final);

				});

$scope.alunos = arrItem;

console.log('alunos', $scope.alunos);
}
}).error(function(data, status, headers, config) {
            // log error
        }); 
}

$scope.cadastrarAvaliacaoDescritiva = function(idAluno){

	if(!$scope.avaliacaodescritiva.avaliacao){ toaster.error('Insira uma avaliação antes de continuar!'); }
	else{
		$scope.json = angular.toJson($scope.avaliacaodescritiva);
		$http.post('../api/index.php/cadastraravaliacaodescritiva/', $scope.json, {withCredentials: true, headers: {'enctype': 'multipart/form-data' }, })
		.success(function(data, status, headers, config) {

			msg = {title: "Avaliação Descritiva", body: data.mensagem};

			if (data.error == '0'){ 
				toaster.success(msg); 
				$("#modal_avaliacao_descritiva").modal('hide');
			}
			else{ toaster.error(msg); }
		})
		.error(function(data, status) {});
	}
}

$scope.carregarAvaliacaoDescritiva = function(tela,idAluno){
	$http.get('../api/index.php/carregaravaliacaodescritiva/'+idAluno)
	.success(function(data, status, headers, config){
		if(data.error == 0){

			dt = data.retorno;

			tmp = {};
			tmp.id_turma = parseInt(dt[0].id_turma);
			tmp.id_curso = parseInt(dt[0].id_curso);
			tmp.id_aluno = parseInt(idAluno);
			tmp.foto 	 = dt[0].foto;
			tmp.aluno 	 = dt[0].aluno;
			tmp.turma 	 = dt[0].turma;
			tmp.curso 	 = dt[0].curso;
			tmp.serie 	 = dt[0].serie;
			tmp.fase 	 = [];

			dt.forEach(function(val){ 
				tmp.fase.push({'fase':val.fase,'avaliacao':val.avaliacao}); 
			});

			$scope.avaliacaodescritiva = tmp;
		}
	})
	.error(function(data, status, headers, config){});

	switch(tela){
		case 1:
		$("#modal_avaliacao_descritiva").modal('show');
		break;
		case 2:
		$("#modal_detalhe_avaliacao_descritiva").modal('show');
		break;
	}
}


	 //*** Arredondamento ***********************************************************
	 $scope.arredondamento_tratar = function(valor){
	 	v = {};
	 	v.interio = Math.trunc(valor);
	 	v.decimais = valor - v.interio;
	 	v.decimais = parseFloat(v.decimais.toFixed(2));
	 	return v;
	 }

	 $scope.arredondamento_normal_casa_decimos = function(valor){
	 	num = $scope.arredondamento_tratar(valor);
	 	valor = Math.round(num.decimais * 10)/10 + num.interio;

	 	return valor.toFixed(2);
	 }

	 $scope.arredondamento_maior_casa_decimos = function(valor){
	 	num = $scope.arredondamento_tratar(valor);
	 	valor = Math.ceil(num.decimais * 10)/10 + num.interio;

	 	return valor.toFixed(2);
	 }

	 $scope.arredondamento_normal_intervalos_0_50 = function(valor){
	 	num = $scope.arredondamento_tratar(valor);

	 	if(num.decimais < parseFloat(0.25) && num.decimais >= parseFloat(0.00)) {
	 		valor = num.interio;
	 	}else if(num.decimais < parseFloat(0.75) && num.decimais >= parseFloat(0.25)) {
	 		valor = num.interio + parseFloat(0.50);
	 		valor = valor;
	 	}else if(num.decimais >= parseFloat(0.75)) {
	 		valor = num.interio + parseFloat(1);
	 		valor = valor;
	 	}

	 	return valor.toFixed(2);
	 }

	 $scope.arredondamento_maior_intervalos_0_50 = function(valor){
	 	num = $scope.arredondamento_tratar(valor);

	 	if(num.decimais < parseFloat(0.50) && num.decimais >= parseFloat(0.00)) {
	 		valor = num.interio + parseFloat(0.50);
	 	}else{
	 		valor = num.interio + parseFloat(1.00);
	 	}

	 	return valor.toFixed(2);
	 }

	 $scope.arredondamento_menor_intervalos_0_50 = function(valor){
	 	num = $scope.arredondamento_tratar(valor);

	 	if(num.decimais < parseFloat(0.50) && num.decimais >= parseFloat(0.00)) {
	 		valor = num.interio;
	 	}else{
	 		valor = num.interio + parseFloat(0.50);
	 	}

	 	return valor.toFixed(2);
	 }

	 $scope.arredondamento_trunca = function(valor){
	 	num = $scope.arredondamento_tratar(valor);
	 	valor = Math.trunc(num.decimais * 10)/10 + num.interio;

	 	return valor.toFixed(2);
	 }

	 $scope.arredondamento_normal_inteiro = function(valor){
	 	valor = Math.round(valor);

	 	return valor.toFixed(2);
	 }


	 $scope.arredondamento_intervalos_0_25 = function(valor){
	 	num = $scope.arredondamento_tratar(valor);

	 	if(num.decimais <= parseFloat(0.25) && num.decimais >= parseFloat(0.00)) {
	 		valor = num.interio.toFixed(2);
	 	}else if(num.decimais <= parseFloat(0.75) && num.decimais > parseFloat(0.25)) {
	 		valor = num.interio + parseFloat(0.50);
	 		valor = valor.toFixed(2);
	 	}else if(num.decimais > parseFloat(0.75)) {
	 		valor = num.interio + parseFloat(1);
	 		valor = valor.toFixed(2);
	 	}

	 	return valor;
	 }

	 $scope.calcularArredondamento = function(id, valor){
	 	switch(id) {
	 		case '1':
	 		valor = $scope.arredondamento_normal_casa_decimos(valor);
	 		break;
	 		case '2':
	 		valor = $scope.arredondamento_normal_intervalos_0_50(valor);
	 		break;
	 		case '3':
	 		valor = $scope.arredondamento_trunca(valor);
	 		break;
	 		case '4':
	 		valor = $scope.arredondamento_maior_intervalos_0_50(valor);
	 		break;
	 		case '5':
	 		valor = $scope.arredondamento_menor_intervalos_0_50(valor);
	 		break;
	 		case '6':
	 		valor = $scope.arredondamento_normal_inteiro(valor);
	 		break;
	 		case '7':
	 		valor = $scope.arredondamento_maior_casa_decimos(valor);
	 		break;
	 		case '8':
	 		valor = $scope.arredondamento_intervalos_0_25(valor);
	 		break;
	 	}

	 	console.log('calcularArredondamento id', id);
	 	console.log('calcularArredondamento valor', valor);

	 	return valor;
	 }
    //*** Fim - arredondamento ***********************************************************

    $scope.redirectPage = function(fase, disciplina, turma){
		$location.path("consultaAvaliacaoPeriodica/"+fase+'/'+disciplina+'/'+turma);
	}


    $scope.getDisciplina($routeParams.disciplina);
    $scope.getNotaDetalhe($scope.pgSelected.id_curso);
    $scope.getCursoTurmaAlunoComponente($scope.pgSelected.id_curso, $scope.pgSelected.id_turma, $scope.pgSelected.fase);

    
});
//@ sourceURL=controller.consultaAvaliacoes.js