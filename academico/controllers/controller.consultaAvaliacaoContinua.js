app.registerCtrl('consultaAvaliacaoContinua', function($scope, $http, toaster, $filter, $routeParams) {
    
    $scope.pgSelected = {
        'id_curso' : $routeParams.curso,
        'id_professor' : $routeParams.professor,
        'id_turma' : $routeParams.turma,
        'id_disciplina' : $routeParams.disciplina,
        'id_componente' : $routeParams.componente,
        'fase' : $routeParams.fase
    };

	$scope.turmaAluno = {};
	$scope.alunos = {};
	$scope.cursoNotas = {};
	$scope.campo = [];
    $scope.valorFinal = [];

    $scope.getDisciplina = function(id_disciplina){
        $http.get('../api/index.php/disciplina/1/'+id_disciplina).
        success(function(data, status, headers, config) {
            if(data.error == 0){
                $scope.pgSelected.disciplina = data.disciplina[0];
            }
        }).error(function(data, status, headers, config) {
            // log error
        }); 
    }

	$scope.contar = function(item, linha){
        var valor = 0;
        var numItem = 0;

        angular.forEach(item, function(element, index) {
            if(element != ''){
                if($scope.cursoNotas[index].valor_maximo >= element){
                    valor = valor + parseFloat(element);
                    numItem++;    
                }else{
                    toaster.error('Observação: Valor maximo da nota é ' +$scope.cursoNotas[index].valor_maximo);
                    $scope.campo[linha][index] = '';
                }
            }
        });

        if(valor == 0 && numItem == 0){
            $scope.valorFinal[linha] = 0.00;
        }else{
            var vlFinal = valor / numItem;
            $scope.valorFinal[linha] = vlFinal.toFixed(2);
        }
	}

	$scope.getTurmaAluno = function(id_turma){
    	$http.get('../api/index.php/turmaaluno/'+id_turma).
    	success(function(data, status, headers, config) {

    		$scope.turmaAluno = data.turma_aluno;
            console.log('turma', $scope.turmaAluno);

            if(data.turma_aluno !== undefined){
                $scope.alunos = data.turma_aluno[0].alunos;
            }

      	}).error(function(data, status, headers, config) {
	        // log error
	    }); 
    }

	$scope.getCursoNota = function(id_componente){
    	$http.get('../api/index.php/componentedetalhe/'+id_componente).
    	success(function(data, status, headers, config) {
            if(data.error == 0){
    		  $scope.cursoNotas = data.componente_detalhe;

              if($scope.cursoNotas.length > 0){
                $scope.getNotaAvaliacao($scope.pgSelected.id_componente, $scope.pgSelected.id_curso, $scope.pgSelected.id_turma, $scope.pgSelected.fase);  
              }
            }
      	}).error(function(data, status, headers, config) {
	        // log error
	    }); 
    }
    
    $scope.filtraNota = function(data, id_componente_formula, id_componente, id_pessoa){
        nota = $filter('filter')(data, function(item){
            if(item.id_componente_formula == id_componente_formula && item.id_componente == id_componente && item.id_aluno == id_pessoa){
                return item;
            }
        });

        return nota;
    }

    $scope.getNotaAvaliacao = function(id_componente_formula, id_curso, id_turma, fase){
        var nota;
        $http.get('../api/index.php/notaavaliacao/'+id_curso+'/'+id_turma+'/'+fase).
        success(function(data, status, headers, config) {
            if(data.error == 0){;
                angular.forEach($scope.alunos, function(aluno, key) {
                    $scope.campo[key] = Array();
                    $scope.valorFinal[key] = '';
                    angular.forEach($scope.cursoNotas, function(curso, index) {
                        $scope.campo[key][index] = '';
                        nota = $scope.filtraNota(data.nota_avaliacao, id_componente_formula, curso.id_componente, aluno.id_pessoa);
                        if(nota.length > 0){
                            $scope.campo[key][index] = nota[0].nota;    
                        }
                    });
                    calcNota = $scope.filtraNota(data.nota_avaliacao, id_componente_formula, null, aluno.id_pessoa);
                    if(calcNota.length > 0){
                        $scope.valorFinal[key] = calcNota[0].nota;    
                    }
                });
            }
        }).error(function(data, status, headers, config) {
            // log error
        }); 
    }
    
    $scope.montarObj = function(fase, id_curso, id_turma, id_disciplina){
        var id_aluno, id_componente_formula;
        var obj = {};
        var aNota = [];
        var verifica = '';

        angular.forEach($scope.alunos, function(vlAluno, key) {
            id_aluno = vlAluno['id_pessoa'];
            // id_turma = vlAluno['id_turma'];

            angular.forEach($scope.cursoNotas, function(vlCurso, index) {
                // id_curso = vlCurso['id_curso'];
                // fase = vlCurso['fase'];
                id_componente_formula = vlCurso['id_componente_formula'];

                obj = [{
                        id_aluno: id_aluno,
                        id_curso: id_curso,
                        id_turma: id_turma,
                        id_disciplina: id_disciplina,
                        id_componente_formula: id_componente_formula,
                        id_componente: vlCurso['id_componente'],
                        fase: fase,
                        nota: $scope.campo[key][index]
                }];

                aNota.push(obj[0]);
            });
            
            obj = [{
                    id_aluno: id_aluno,
                    id_curso: id_curso,
                    id_turma: id_turma,
                    id_disciplina: id_disciplina,
                    id_componente_formula: id_componente_formula,
                    id_componente: null,
                    fase: fase,
                    nota: parseFloat($scope.valorFinal[key])
            }];

            aNota.push(obj[0]);
        });
        
        return aNota;
    }
    
    $scope.cadastrarNota = function(){
        var obj = $scope.montarObj($scope.pgSelected.fase, $scope.pgSelected.id_curso, $scope.pgSelected.id_turma, $scope.pgSelected.id_disciplina);
        
        console.log('nota', obj);

        $scope.json = angular.toJson(obj);
        $http.post('../api/index.php/notaavaliacao/', $scope.json,
                      {withCredentials: true,
                        headers: {'enctype': 'multipart/form-data' },
                      }
        ).success(function(data, status, headers, config) {
            if (data.error == '0'){
              toaster.success(data.mensagem);
            }else{
              toaster.error(data.mensagem);
            }
        }).error(function(data, status) {
        });
    }

    $scope.getDisciplina($scope.pgSelected.id_disciplina);
    $scope.getTurmaAluno($scope.pgSelected.id_turma);
    $scope.getCursoNota($scope.pgSelected.id_componente);
});
//@ sourceURL=controller.consultaAvaliacaoContinua.js