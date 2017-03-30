
smartSig.registerCtrl("formCadastroHistorico", function($scope, $http, $routeParams, Mensagem, $timeout, Permissao, $filter){

    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
    });

    // Textos
	$scope.txt_parte_comum			= "Parte Comum";
	$scope.txt_parte_diversificada	= "Parte Diversificada";

	$scope.txt_parte 		= "Parte";
	$scope.txt_disciplina 	= "Disciplina";
	$scope.txt_nota 		= "Nota";
	$scope.txt_falta 		= "Falta";
	$scope.txt_ch 			= "C.H.";

	$scope.txt_parte_m 	 	= $scope.txt_parte.toUpperCase();
	$scope.txt_disciplina_m = $scope.txt_disciplina.toUpperCase();
	$scope.txt_nota_m 		= $scope.txt_nota.toUpperCase();
	$scope.txt_falta_m 	 	= $scope.txt_falta.toUpperCase();
	$scope.txt_ch_m 	 	= $scope.txt_ch.toUpperCase();
	
	// Elementos
	$scope.parte01 = {selected:1};
	$scope.parte02 = {selected:1};
	$scope.parte03 = {selected:1};
	$scope.parte04 = {selected:1};

	$scope.fase01 = {};
	$scope.fase02 = {};
	$scope.fase03 = {};
	$scope.fase04 = {};

	// Objeto de retorno	
	$scope.parte={};
	$scope.historico = {};
	$scope.historico.fase01 = {};
	$scope.historico.fase02 = {};
	$scope.historico.fase03 = {};
	$scope.historico.fase04 = {};

	$scope.historico.fase01.comum 		  = [];
	$scope.historico.fase01.diversificado = [];
	$scope.historico.fase02.comum 		  = [];
	$scope.historico.fase02.diversificado = [];
	$scope.historico.fase03.comum 		  = [];
	$scope.historico.fase03.diversificado = [];
	$scope.historico.fase04.comum 		  = [];
	$scope.historico.fase04.diversificado = [];

	$scope.historico.ano_letivo = '';
	$scope.historico.serie 		= '';
	$scope.historico.turma 		= '';
	$scope.historico.curso 		= '';
	$scope.historico.entidade 	= '';
	$scope.historico.aluno 		= '';

	$scope.aba=1;

	$scope.adicionar = function(fase,parte) {	

		parte = parseInt(parte);

		switch(fase){

			case 1: 					
					id_disciplina = $scope.fase01.disciplina.split("_")[0];
					disciplina 	  = $scope.fase01.disciplina.split("_")[1];
					reg = {'fase':1,'id_historico_parte':parte,'id_disciplina':id_disciplina,'disciplina':disciplina,'nota':$scope.fase01.nota,'falta':$scope.fase01.falta,'carga_horaria':$scope.fase01.carga_horaria};					
					if(parte==1){$scope.historico.fase01.comum.push(reg)}else{$scope.historico.fase01.diversificado.push(reg)};
			break;					
			case 2:
					id_disciplina = $scope.fase02.disciplina.split("_")[0];
					disciplina 	  = $scope.fase02.disciplina.split("_")[1];
					reg = {'fase':2,'id_historico_parte':parte,'id_disciplina':id_disciplina,'disciplina':disciplina,'nota':$scope.fase02.nota,'falta':$scope.fase02.falta,'carga_horaria':$scope.fase02.carga_horaria};					
					if(parte==1){$scope.historico.fase02.comum.push(reg)}else{$scope.historico.fase02.diversificado.push(reg)};
			break;
			case 3:
					id_disciplina = $scope.fase03.disciplina.split("_")[0];
					disciplina 	  = $scope.fase03.disciplina.split("_")[1];
					reg = {'fase':3,'id_historico_parte':parte,'id_disciplina':id_disciplina,'disciplina':disciplina,'nota':$scope.fase03.nota,'falta':$scope.fase03.falta,'carga_horaria':$scope.fase03.carga_horaria};					
					if(parte==1){$scope.historico.fase03.comum.push(reg)}else{$scope.historico.fase03.diversificado.push(reg)};
			break;
			case 4:
					id_disciplina = $scope.fase03.disciplina.split("_")[0];
					disciplina 	  = $scope.fase03.disciplina.split("_")[1];
					reg = {'fase':4,'id_historico_parte':parte,'id_disciplina':id_disciplina,'disciplina':disciplina,'nota':$scope.fase04.nota,'falta':$scope.fase04.falta,'carga_horaria':$scope.fase04.carga_horaria};					
					if(parte==1){$scope.historico.fase04.comum.push(reg)}else{$scope.historico.fase04.diversificado.push(reg)};
			break;
		}		
	}

	$scope.cadastrar = function(objeto) {
		
		$scope.json = angular.toJson($scope.historico);

		$http.post('api/index.php/historico/', $scope.json, {withCredentials: true,headers: {'enctype': 'multipart/form-data' },})
		.success(function(data, status, headers, config) {

			if (data.error != -1){
				
				Mensagem.success(data.mensagem); 
				$scope.historico.id = data.id;
			} 
			else { Mensagem.error(data.mensagem); }

		}).error(function(data, status) {});
	}

    $scope.carregar = function(){
      $http.get('api/index.php/historico/'+id)
      .success(function(data, status, headers, config) {
        $scope.historico = data.xxxxxx;
      })
      .error(function(data, status, headers, config) {});
    }
    
	/* =============================================================== */
    /* ====================== Carregar combos ======================== */ 
    /* =============================================================== */

	$scope.getListaComboCurso = function(){
		$http.get('api/index.php/listacombocursos/')
		.success(function(data, status, headers, config) {
			if(data.error == 0){
				$scope.cursos = data.cursos;				
			}
		})
		.error(function(data, status, headers, config) {});
	}
	$scope.getListaComboCurso();

	$scope.getStringEtapa = function(){
		$http.get('api/index.php/getstringetapa/')
		.success(function(data, status, headers, config) {
			if(data.error == 0){
				$scope.etapas = data.retorno;
			}
		})
		.error(function(data, status, headers, config) {});
	}
	$scope.getStringEtapa();

	$scope.getEstabelecimento = function(){
		$http.get('api/index.php/estabelecimento')
		.success(function(data, status, headers, config) {
			if(data.error == 0){
				$scope.estabelecimentos = data.estabelecimento;
			}
		})
		.error(function(data, status, headers, config) {});
	}
	$scope.getEstabelecimento();

	$scope.getHistoricoParte = function(){
		$http.get('api/index.php/gethistoricoparte')
		.success(function(data, status, headers, config) {
			if(data.error == 0){
				$scope.partes = data.retorno;
			}
		})
		.error(function(data, status, headers, config) {});
	}
	$scope.getHistoricoParte();

	$scope.getSerie = function(curso){

		curso = (typeof curso =='object') ? curso.id : curso;

		$scope.series = [];
		$http.get('api/index.php/serie/'+curso)
		.success(function(data, status, headers, config) {
			if(data.error == 0){
				var inicio = data.serie[0].primeira_serie;
				var fim = data.serie[0].ultima_serie;

				for(var i = inicio; i <= fim; i++){
					$scope.series.push({
						id : i,
						value: i + "º Série"
					});
				}
				//$scope.grid = [];
				$scope.cursoId = curso;
				//$scope.getGridDisciplina(curso, 0, 0, 0);				
			}
		})
		.error(function(data, status, headers, config) {});
 	}

	$scope.getTurma = function(serie, curso){

		curso = (typeof curso =='object') ? curso.id : curso;
		serie = (typeof serie =='object') ? serie.id : serie;

		if(serie == null){
			//$scope.grid = [];
			//$scope.getGridDisciplina(curso, 0, 0, 0);
		}
		else{
			$http.get('api/index.php/listacomboturmas/'+curso+'/'+serie)
			.success(function(data, status, headers, config) {			
				if(data.error == 0){				
					$scope.turmas = data.turmas;
					//$scope.grid = [];
					//$scope.getGridDisciplina(curso, serie, 0, 0);
				}
				else{
					//$scope.tabelaDisciplina = false;
					toaster.error({title: "Série", body:data.mensagem});
				}
			})
			.error(function(data, status, headers, config) {});
		}
	}

	$scope.getDisciplina = function(curso, serie, turma){

		curso = (typeof curso =='object') ? curso : curso;
		serie = (typeof serie =='object') ? serie : serie;
		turma = (typeof turma =='object') ? turma : turma;

		$http.get('api/index.php/listacombodisciplinas/'+curso)
		.success(function(data, status, headers, config) {
			if(data.error == 0){				
				$scope.disciplinas = data.disciplina;
				//$scope.grid = [];
				if(turma == null){
					//$scope.getGridDisciplina(curso, serie, 0, 0);
				}
				else{
					//$scope.getGridDisciplina(curso, serie, turma, 0);
				}
			}
		})
		.error(function(data, status, headers, config) {}); 
	}

	$scope.getPessoaExists = function(val) {
		return $http.get('api/index.php/stringpessoa?aluno=1&', {
			params: {
				string: val,
				sensor: false
			}
		}).then(function(response){
			return response.data.pessoa;
		});
	};

	$scope.passaPessoa = function(item, model, label){
		$scope.aluno_id = item.id;
	}


	/* =============================================================== */

	$scope.avaliar = function(item){

		str = $(item).val();
		str = str.replace(',','');
		mt  = str.split('');
		len = mt.length;
		nt = parseInt(mt[0]+mt[1]);

		switch(len)
		{
			case 1: break;
			case 2:	str = (nt>10) ? mt[0]+','+mt[1] 		: mt[0]+mt[1]				 ; break;
			case 3: str = (nt>10) ? mt[0]+','+mt[1]+mt[2] 	: mt[0]+mt[1]+','+mt[2]		 ; break;
			case 4: str = (nt>10) ? '' 						: mt[0]+mt[1]+','+mt[2]+mt[3]; break;
			default: str = ''; break;
		} 

		$(item).val(str);
	}
	
	$scope.carregarHistorico = function(id_aluno){
		$http.get('api/index.php/historico/'+id_aluno)
		.success(function(data, status, headers, config) {
			if(data.error == 0){
				$scope.historicos = data.retorno;
			}
		})
		.error(function(data, status, headers, config) {});
	}
});

//@ sourceURL=controller.formCadastroHistorico.js