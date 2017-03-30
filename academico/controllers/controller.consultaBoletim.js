app.registerCtrl('consultaBoletim', function($http, $scope, $filter) {
	$scope.fases = [
        {
            "fase": "1",
            "descricao": "1º Fase",
        },
        {
            "fase": "2",
            "descricao": "2º Fase",
        },
        {
            "fase": "3",
            "descricao": "3º Fase",
        },
        {
            "fase": "4",
            "descricao": "4º Fase",
        }
    ];
		
	$scope.parcelasLiquidada = {};
	$scope.parcelasEmAberto = {};

	$scope.aluno = {};
	$scope.alunos = {};

	$scope.matriculaDisciplina = {};

	$scope.getMatriculaDisciplina = function(item){
    	$http.get('../api/index.php/matriculadisciplina/'+item.id_aluno).
    	success(function(data, status, headers, config) {
    		// var liquidada = $filter('filter')(data.parcela_aluno, {id_status_parcela: 4});
    		// var emAberto = $filter('filter')(data.parcela_aluno, {id_status_parcela: 3});

    		$scope.matriculaDisciplina = data.matricula_disciplina;

      	}).error(function(data, status, headers, config) {}); 
    }
    
	$scope.controlaTurmaAlunos = function(){
    	//Retira do objeto turma todos os alunos sem ir no banco
		alunos = Array();
    	$scope.turmas.forEach(function (element, index) {
    		element.alunos.forEach(function (value, key) {
				new_key = alunos.length;
				alunos[new_key] = value;
			});
		});

		$scope.alunos = alunos;
    }
 
    $scope.getFiltroAluno = function(item){
        $scope.aluno = item;
        $scope.getMatriculaDisciplina(item.id_pessoa);
    }

    $scope.download = function(url){
    	var link = document.createElement("a");
		link.setAttribute("href", '../'+url);
		link.setAttribute("download", "boleto.pdf");
		link.click();
    }
});