app.registerCtrl('financeiroAlunoFicha', function($http, $scope, $filter) {
	
	$scope.parcelasLiquidada = {};
	$scope.parcelasEmAberto = {};

	$scope.turmas = {};
	$scope.aluno = {};
	$scope.turmaAlunos = {};
	$scope.alunos = {};

	$scope.busca = {};
	$scope.busca.turma = null;
	$scope.showTurmaAlunos = false;

	$scope.getFiltroAluno = function(item){
        $scope.aluno = item;
        $scope.getParcelaAluno(item.id_pessoa);
    }

	$scope.getPessoaExists = function(val, propiedade) {
		var obj = $scope.alunos;
		if($scope.busca.turma != null){
			obj = $scope.turmaAlunos;
		}

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

	$scope.getParcelaAluno = function(id_aluno){
    	$http.get('../api/index.php/parcelaaluno/'+id_aluno).
    	success(function(data, status, headers, config) {
    		var liquidada = $filter('filter')(data.parcela_aluno, {id_status_parcela: 4});
    		var emAberto = $filter('filter')(data.parcela_aluno, {id_status_parcela: 3});

    		$scope.parcelasLiquidada = liquidada;
			$scope.parcelasEmAberto = emAberto;

      	}).error(function(data, status, headers, config) {}); 
    }

    
    $scope.getTurmaAluno = function(){
    	$http.get('../api/index.php/turmaaluno')
    	.success(function(data, status, headers, config) {

        	$scope.turmaAlunos = data.turma_aluno;
        	$scope.getTurma();

      	}).error(function(data, status, headers, config) {}); 
    }
    //$scope.getTurmaAluno();
    
	$scope.getTurma = function(){
		$http.get('../api/index.php/listapessoaturma/')
		.success(function(data, status, headers, config) {
			if(data.error == 0){
	
				$scope.turmas = data.turma;
				tam1 = $scope.turmas.length;
				tam2 = $scope.turmaAlunos.length;
				
				for (var i=0; i<tam1; i++) {
					for (var j=0; j<tam2; j++) {
						if($scope.turmas[i].id_turma==$scope.turmaAlunos[j].id_turma){
							$scope.turmas[i].alunos = $scope.turmaAlunos[j].alunos;				    	
						}
					}
				}
			}
		})
		.error(function(data, status, headers, config) {}); 
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
    
    $scope.filtraTurma = function(turma){	
    	if(turma != null){
	    	$scope.turmaAlunos = turma.alunos;	    	
	    	$scope.showTurmaAlunos = true;	    	
    	}else{
    		$scope.turmaAlunos = {};
    		$scope.aluno = {};
    	}

    	$scope.busca.nome = '';
    	$scope.busca.codigo = '';
    }

    $scope.download = function(url){
    	var link = document.createElement("a");
		link.setAttribute("href", '../'+url);
		link.setAttribute("download", "boleto.pdf");
		link.click();
    }	
   
    
});
//@ sourceURL=controller.financeiroAlunoFicha.js