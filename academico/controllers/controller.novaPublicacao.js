app.registerCtrl('novaPublicacao', function($scope, $http, $routeParams, toaster, $timeout, $window) {

	getIdSalaVirtual = $routeParams.id;

	$scope.itens = [];
	$scope.salavirtualPublicacao = {};	
	$scope.tabelaDisciplina = false;
	
	$scope.showItensPublicacao = false;
	$scope.showAtribuicao = false;
	
	$scope.atribuicao = {};
	$scope.atribuicao.chkidlist = [];

	
	$scope.cadastraSalaVirtual = function(){

		if ($('#novaPublicacao-form').valid()) {

			$scope.json = angular.toJson($scope.salavirtual);
			$http.post('../api/index.php/cadastrasalavirtual/', $scope.json, {withCredentials: true, headers: {'enctype': 'multipart/form-data' }, })
			.success(function(data, status, headers, config) {
					if (data.error == '0'){
						console.log("sala virtual",data.id_salavirtual);
						$scope.salavirtual.id = data.id_salavirtual;
						toaster.success({title: "Sala Virtual", body: data.mensagem});
						$("#salvarSalaVirtual").attr('disabled','disabled');
						$scope.showItensPublicacao = true;					
					}
					else{ toaster.error({title: "Sala Virtual", body:'Cadastrado com sucesso!'}); }					
			}).error(function(data, status) {});
		}
	}
	
	
	$scope.cadastraItemPublicacao = function(objeto){
		if ($('#itemPublicacao-form').valid()) {

			objeto.id_sala_virtual = $scope.salavirtual.id;

			if(objeto.id_tipo_itens_publicacao == 1){
				objeto.arquivo = null;
				objeto.codigo_objeto_video = null;
			}
			if($scope.salavirtualPublicacao.id_tipo_itens_publicacao == 2){
				objeto.texto_artigo = null;
				objeto.arquivo = null;
			}
			if(objeto.id_tipo_itens_publicacao == 3){
				objeto.texto_artigo = null;
				objeto.codigo_objeto_video = null;
			}

			$scope.json = angular.toJson(objeto);
			$http.post('../api/index.php/salavirtualitempublicacao/', $scope.json, {withCredentials: true, headers: {'enctype': 'multipart/form-data' },})
			.success(function(data, status, headers, config) {
					if (data.error == '0'){			
						
						$scope.showAtribuicao = true;
						toaster.success({title: "Publicação", body: 'Cadastrado com sucesso!'});

						if ($scope.files != null) {
							$scope.sendFile($scope.files, data.id_item);
						}
					}
			}).error(function(data, status) {});
		}
	}
	
	
	$scope.armazenaFile = function(files) {
		$scope.files = files;
	}
	
	
	$scope.sendFile = function(files,id) {
		var fd = new FormData();
		file = files.files[0];
		if(file){
			fd.append("file", file);
			$http.post('../api/index.php/uploaditempublicacao/'+id, fd, {withCredentials: true, headers: {'Content-Type': undefined },transformRequest: angular.identity})
			.success(function(data, status, headers, config){
				$scope.salavirtualPublicacao.arquivo = {};				
				$scope.files = null;				
			}).error(function(data, status) {});
		}
	}
	
	
	$scope.getTipoItensPublicacao = function(){
		$http.get('../api/index.php/listatipoitempublicacao/')
		.success(function(data, status, headers, config){
			if(data.error == 0){
				$scope.itens = data.item;
			}
		})
		.error(function(data, status, headers, config){});
	}
	
	
	$scope.getCategoriaSalaVirtual = function(){
		$http.get('../api/index.php/salavirtualcategoria/').    
		success(function(data, status, headers, config) {
			if(data.error == 0){				
				$scope.categorias = data.categoria;
			}
		})
		.error(function(data, status, headers, config){});
	}
	

	/* ========================================================================================================== */
	/* =============================================== ATRIBUIÇÃO =============================================== */
	/* ========================================================================================================== */
	
	$scope.cadastrarAtribuicao = function(){

		if ($('#itemAtribuicao-form').valid()) {
					
			chk  = $scope.atribuicao.chkidlist;
			$scope.atribuicao.sala_virtual_atribuicao_item = [];

			chk.forEach(function(val){

				id  = val.split('_');
				idd = id[0];
				idt = id[1];			

				$scope.atribuicao.sala_virtual_atribuicao_item.push({'id_turma':idt, 'id_disciplina':idd});
			});
						
			$scope.atribuicao.id_sala_virtual = $scope.salavirtual.id;
			$scope.json = angular.toJson($scope.atribuicao);

			$http.post('../api/index.php/cadastraratribuicao/', $scope.json, {withCredentials: true, headers: {'enctype': 'multipart/form-data' }, })			
			.success(function(data, status, headers, config) {
					if (data.error == '0'){
												
						toaster.success({title: "Atribuição", body:data.mensagem});						
					}
					else{ toaster.error({title: "Atribuição", body:data.mensagem}); }
			}).error(function(data, status) {});			
		}
	}

	$scope.getListaComboCurso = function(){
		$http.get('../api/index.php/listacombocursos/')
		.success(function(data, status, headers, config) {
			if(data.error == 0){
				$scope.cursos = data.cursos;				
			}
		})
		.error(function(data, status, headers, config) {});
	}

	$scope.getSerie = function(curso){

		curso = (typeof curso =='object') ? curso.id : curso;

		$scope.series = [];
		$http.get('../api/index.php/serie/'+curso)
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
				$scope.grid = [];
				$scope.cursoId = curso;
				$scope.getGridDisciplina(curso, 0, 0, 0);				
			}
		})
		.error(function(data, status, headers, config) {});
 	}

	$scope.getTurma = function(serie, curso){

		curso = (typeof curso =='object') ? curso.id : curso;
		serie = (typeof serie =='object') ? serie.id : serie;

		if(serie == null){
			$scope.grid = [];
			$scope.getGridDisciplina(curso, 0, 0, 0);
		}
		else{
			$http.get('../api/index.php/listacomboturmas/'+curso+'/'+serie)
			.success(function(data, status, headers, config) {			
				if(data.error == 0){				
					$scope.turmas = data.turmas;
					$scope.grid = [];
					$scope.getGridDisciplina(curso, serie, 0, 0);
				}
				else{
					$scope.tabelaDisciplina = false;
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

		$http.get('../api/index.php/listacombodisciplinas/'+curso)
		.success(function(data, status, headers, config) {
			if(data.error == 0){				
				$scope.disciplinas = data.disciplina;
				$scope.grid = [];
				if(turma == null){
					$scope.getGridDisciplina(curso, serie, 0, 0);
				}
				else{
					$scope.getGridDisciplina(curso, serie, turma, 0);
				}
			}
		})
		.error(function(data, status, headers, config) {}); 
	}

	$scope.getGridDisciplina = function(curso, serie, turma, disciplina){
		
		curso 		= (typeof curso 	=='object') ? curso.id 		: curso;
		serie 		= (typeof serie 	=='object') ? serie.id 		: serie;
		turma 		= (typeof turma 	=='object') ? turma.id 		: turma;
		disciplina	= (typeof disciplina=='object') ? disciplina.id : disciplina;

		$http.get('../api/index.php/griddisciplinas/'+curso+'/0/'+serie+'/'+turma+'/'+disciplina+'/0')
		.success(function(data, status, headers, config) {
			if(data.error == 0){
				$scope.grid = data.disciplina;
				$scope.tabelaDisciplina = true;
			}
		})
		.error(function(data, status, headers, config) {
			a++;
		});
	}
	
	/* ========================================================================================================== */
	/* =============================================== EDIÇÃO =================================================== */
	/* ========================================================================================================== */

	$scope.carregarSalaVirtual = function(idSalaVirtual){

		$http.get('../api/index.php/carregarsalavirtual/'+idSalaVirtual)
		.success(function(data, status, headers, config) {
			if(data.error == 0){

				ret = data.retorno[0];

				tmp = ret.data_publicacao.split('-');
				ret.data_publicacao = tmp[2]+'/'+tmp[1]+'/'+tmp[0];

				tmp = ret.data_entrega.split('-');
				ret.data_entrega = tmp[2]+'/'+tmp[1]+'/'+tmp[0];

				ret.publicado = (ret.publicado=='1') ? true : false;
            	$scope.salavirtual = ret;
			}
		})
		.error(function(data, status, headers, config) {});	
	}

	$scope.carregarSalaVirtualItem = function(idSalaVirtual){

		$http.get('../api/index.php/carregarsalavirtualitem/'+idSalaVirtual)
		.success(function(data, status, headers, config) {
			if(data.error == 0){

				ret = data.retorno[0];
				ret.publicar_titulo = (ret.publicar_titulo=='1') ? true : false;
				$scope.salavirtualPublicacao = ret;
			}
		})
		.error(function(data, status, headers, config) {});	
	}

	$scope.carregarAtribuicao = function(idSalaVirtual){

		$http.get('../api/index.php/carregaratribuicao/'+idSalaVirtual)
		.success(function(data, status, headers, config) {
			if(data.error == 0){

				drc = data.retorno[0].id_curso;
				drs = data.retorno[0].id_serie;
				drt = data.retorno[0].id_turma;
				drd = data.retorno[0].id_disciplina;

				$scope.atribuicao = data.retorno[0];
				$scope.atribuicao.curso = drc;
				$scope.atribuicao.serie = drs;
				$scope.atribuicao.turma = drt;
				$scope.atribuicao.disciplina = drd;	

      			$scope.getSerie(drc);
      			$timeout(function(){ $scope.getTurma(drs, drc); }, 800);
      			$timeout(function(){ $scope.getDisciplina(drc, drs, drt); }, 1600);

				$scope.atribuicao.chkidlist = [];
		    	angular.forEach($scope.atribuicao.sala_virtual_atribuicao_item, function(value, index){
					$scope.atribuicao.chkidlist.push(value['id_disciplina']+'_'+value['id_turma']);
				});
				
			}
		})
		.error(function(data, status, headers, config) {});	
	}

	/* ========================================================================================================== */


	$scope.getTipoItensPublicacao();
	$scope.getCategoriaSalaVirtual();
	$scope.getListaComboCurso();

	if (getIdSalaVirtual != undefined) {
      $timeout(function(){ 

		$scope.showItensPublicacao = true;
		$scope.showAtribuicao = true;
        $scope.carregarSalaVirtual(getIdSalaVirtual);
        $scope.carregarSalaVirtualItem(getIdSalaVirtual);
        $scope.carregarAtribuicao(getIdSalaVirtual);
      }, 800);
    };

});
//@ sourceURL=controller.novaPublicacao.js