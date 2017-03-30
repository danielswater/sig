/*
Módulo: Escola
Descrição: CRUD Cadastra Curso
Método: POST(cadastrarCurso)/GET(getIdCurso)
URL: /escolaforms/formCadastroCurso
Autenticação: Não
Resposta: JSON
Data de Criação: 22/03/2015
Autor: Luciano Almeida
Versão: 1.0
 */
smartSig.registerCtrl("formCadastroCurso", function($scope, $http, $routeParams, Mensagem, $timeout, Permissao, $filter){
	$scope.permissoes = Permissao.validaPermissao();
	$scope.permissoes.then(function (data) {
		$scope.permissoes = data;
	}, function (status) {
		console.log('status',status);
	});

	var idCurso = $routeParams.id;

	$scope.error = '';
	$scope.curso = {};
	$scope.disciplinas = [];
	$scope.historico_parte = [];
	$scope.professor = {};

	$scope.prof = [];
	$scope.ciclo = [];
	$scope.tipo_curso = [];
	$scope.proximo_curso = [];
	$scope.proximo_periodo = [];
	$scope.pessoa_coordenador = [];
	$scope.tipo_disciplina_curso = [];

	$scope.condicoes = [];
	$scope.condicao = [];
	$scope.addCondicao = {};

	$scope.notas = [];
	$scope.nota = [];
	$scope.cursosNotas = {};
	$scope.addNota = {};

	$scope.cursosHorarios = {};
	$scope.horario = {};

	$scope.etapa = [];
	$scope.ficha = [];
	$scope.boletim = [];

	$scope.cadastrarHorario = function(objeto) {
		if ($('#cadastroHorario-form').valid()) {
			if(idCurso == undefined){
				Mensagem.error('É necessário cadastrar um curso!'); 
				return;
			}

			$scope.horario.id_curso = idCurso;
			if($scope.cursosHorarios == undefined){
				$scope.horario.ordem = 1;
			}else{
				$scope.horario.ordem = $scope.cursosHorarios.length + 1;
			}
			$scope.json = angular.toJson($scope.horario);

			$http.post('api/index.php/cursohorario/', $scope.json, 
				{withCredentials: true,
					headers: {'enctype': 'multipart/form-data' },
				}
			).success(function(data, status, headers, config) {
				if (data.error != -1){

					$scope.novoCadastroHorario();					

					$scope.getCursoHorario(idCurso);

					Mensagem.success(data.mensagem); 
				} else {
					Mensagem.error(data.mensagem); 
				}
			}).error(function(data, status) {
				// log error
			});
		}
	}

	$scope.cadastrarProfessor = function(objeto) {
		if ($('#cadastroProfessor-form').valid()) {
			$scope.professor.id_curso = idCurso;
			$scope.json = angular.toJson($scope.professor);

			console.log('cadastrarProfessor', $scope.professor);

			$http.post('api/index.php/cursoprofessor/', $scope.json, 
				{withCredentials: true,
					headers: {'enctype': 'multipart/form-data' },
				}
			).success(function(data, status, headers, config) {
				if (data.error != -1){
					$scope.professor = {};
					$scope.prof.selected = '';

					$scope.getCursoProfessor();

					Mensagem.success(data.mensagem); 
				} else {
					Mensagem.error(data.mensagem); 
				}
			}).error(function(data, status) {
				// log error
			});
		}
	}

	$scope.cadastrarCurso = function(objeto) {

		if ($('#cadastroCurso-form').valid()) {
			$scope.json = angular.toJson($scope.curso);

			$http.post('api/index.php/curso/', $scope.json, 
				{withCredentials: true,
					headers: {'enctype': 'multipart/form-data' },
				}
			).success(function(data, status, headers, config) {
				if (data.error != -1){
					$scope.objeto = {};
					Mensagem.success(data.mensagem); 
					$scope.curso.id = data.id;
					idCurso = data.id;
				} else {
					Mensagem.error(data.mensagem); 
				}
			}).error(function(data, status) {
				// log error
			});
		}
	}

    $scope.verificarAcaoProfessor = function(item) {
      $scope.professor.id_pessoa_professor = item.id;
      $( "em[for='id_pessoa_professor']" ).css("display","none");    
    }

	$scope.getDisciplina = function(){
      $http.get('api/index.php/disciplina/1/').
      success(function(data, status, headers, config) {
        $scope.disciplinas = data['disciplina'];
      }).
      error(function(data, status, headers, config) {
        // log error
      });
    }    

    $scope.getCursoProfessor = function(){
      $http.get('api/index.php/professorcurso/'+idCurso).
      success(function(data, status, headers, config) {
        $scope.cursosProfessores = data.curso_professor;
        console.log("professores", $scope.cursosProfessores);
      }).
      error(function(data, status, headers, config) {
        // log error
      });
    }
    

	$scope.getIdCurso = function(id){
		$http.get('api/index.php/curso/1/'+id).
		success(function(data, status, headers, config) {
			$scope.curso = data.curso[0];
			console.log('CURSO', data.curso[0]);
			$scope.ciclo = {selected : {"id":$scope.curso.id_ciclo,"descricao":$scope.curso.ciclo_descricao}};
			$scope.tipo_curso = {selected : {"id":$scope.curso.id_tipo_curso,"descricao":$scope.curso.tipo_curso_descricao}};
			$scope.proximo_curso = {selected : {"id":$scope.curso.id_proximo_curso,"nome":$scope.curso.proximo_curso_descricao}};
			$scope.proximo_periodo = {selected : {"id":$scope.curso.id_proximo_periodo,"descricao":$scope.curso.proximo_periodo_descricao}};
			$scope.pessoa_coordenador = {selected : {"id":$scope.curso.id_pessoa_coordenador,"nome":$scope.curso.pessoa_coordenador_descricao}};
			$scope.tipo_disciplina_curso = {selected : {"id":$scope.curso.id_tipo_disciplina_curso,"descricao":$scope.curso.tipo_disciplina_curso_descricao}};
		}).
		error(function(data, status, headers, config) {
			// log error
		});
	}

	$scope.verificarRegistro = function(item, array) {	
		verificar = $filter("filter")(array, function(obj){
			if((obj.id_condicao == item.id || obj.id_componente == item.id) && obj.id_curso == idCurso){
				return true;
			}else{
				return false;
			}
		});

		if(verificar == undefined){
			verificar = Array();
		}

		return verificar;
	}

	$scope.verificarAcaoCondicao = function(item) {
		verificar = $scope.verificarRegistro(item, $scope.cursoscondicoes);
		
		if(idCurso == undefined){
			Mensagem.error('É nescessário cadastrar um curso!'); 
			return;
		}

		if(verificar.length > 0){
			Mensagem.error('Esta Condição já foi incluida neste curso!'); 
			return;
		}

		$scope.addCondicao.id_condicao = item.id;
		$scope.addCondicao.id_curso = idCurso;
		if($scope.cursoscondicoes == undefined){
			$scope.addCondicao.ordem = 1;
		}else{
			$scope.addCondicao.ordem = $scope.cursoscondicoes.length + 1;
		}

		$scope.json = angular.toJson($scope.addCondicao);

		$http.post('api/index.php/cursocondicao/', $scope.json, 
			{withCredentials: true,
				headers: {'enctype': 'multipart/form-data' },
			}
			).success(function(data, status, headers, config) {
				if (data.error != -1){
					Mensagem.success(data.mensagem); 

					$scope.getCursoCondicao(idCurso);

					$scope.addCondicao = {};
					$scope.condicao.selected = "";

				} else {
					Mensagem.error(data.mensagem); 
				}
			}).error(function(data, status) {
			// log error
			});
	}

	$scope.verificarAcaoNota = function(item) {
		verificar = $scope.verificarRegistro(item, $scope.cursosNotas);
		
		if(idCurso == undefined){
			Mensagem.error('É nescessário cadastrar um curso!'); 
			return;
		}

		if(verificar.length > 0){
			Mensagem.error('Esta Nota já foi incluida neste curso!'); 
			return;
		}

		$scope.addNota.id_nota = item.id;
		$scope.addNota.id_curso = idCurso;
		if($scope.cursosNotas == undefined){
			$scope.addNota.ordem = 1;
		}else{
			$scope.addNota.ordem = $scope.cursosNotas.length + 1;
		}

		$scope.json = angular.toJson($scope.addNota);

		$http.post('api/index.php/cursonota/', $scope.json, 
			{withCredentials: true,
				headers: {'enctype': 'multipart/form-data' },
			}
			).success(function(data, status, headers, config) {
				if (data.error != -1){
					Mensagem.success(data.mensagem); 

					$scope.getCursoNota(idCurso);

					$scope.addNota = {};
					$scope.nota.selected = "";

				} else {
					Mensagem.error(data.mensagem); 
				}
			}).error(function(data, status) {
			// log error
			});
	}

	$scope.alterarOrdem = function(indice, indice_destino){
		
		objeto = {};
		objeto.id = $scope.cursoscondicoes[indice].id;
		objeto.id_destino = $scope.cursoscondicoes[indice_destino].id;

		$scope.json = angular.toJson(objeto);

		$http.post('api/index.php/cursocondicaoordenacao/', $scope.json, 
			{withCredentials: true,
				headers: {'enctype': 'multipart/form-data' },
			}).success(function(data, status, headers, config) {
				if (data.error != -1){
					Mensagem.success(data.mensagem); 

					$scope.getCursoCondicao(idCurso);

					$scope.objeto = {};
				} else {
					Mensagem.error(data.mensagem); 
				}
			}).error(function(data, status) {
				// log error
			});
	}

	$scope.alterarOrdemHorario = function(indice, indice_destino){
		
		objeto = {};
		objeto.id = $scope.cursosHorarios[indice].id;
		objeto.id_destino = $scope.cursosHorarios[indice_destino].id;

		$scope.json = angular.toJson(objeto);

		$http.post('api/index.php/cursohorarioordenacao/', $scope.json, 
			{withCredentials: true,
				headers: {'enctype': 'multipart/form-data' },
			}).success(function(data, status, headers, config) {
				if (data.error != -1){
					Mensagem.success(data.mensagem); 

					$scope.getCursoHorario(idCurso);

					$scope.objeto = {};
				} else {
					Mensagem.error(data.mensagem); 
				}
			}).error(function(data, status) {
				// log error
			});
	}

	$scope.alterarOrdemNota = function(indice, indice_destino){
		objeto = {};
		objeto.id = $scope.cursosNotas[indice].id;
		objeto.id_destino = $scope.cursosNotas[indice_destino].id;

		$scope.json = angular.toJson(objeto);

		$http.post('api/index.php/cursonotaordenacao/', $scope.json, 
			{withCredentials: true,
				headers: {'enctype': 'multipart/form-data' },
			}).success(function(data, status, headers, config) {
				if (data.error != -1){
					Mensagem.success(data.mensagem); 

					$scope.getCursoNota(idCurso);

					$scope.objeto = {};
				} else {
					Mensagem.error(data.mensagem); 
				}
			}).error(function(data, status) {
				// log error
			});
	}

	$scope.delCursoCondicao = function(item){
		$scope.json = angular.toJson(item);

		$http.post('api/index.php/delcursocondicao/', $scope.json, 
			{withCredentials: true,
				headers: {'enctype': 'multipart/form-data' },
			}).success(function(data, status, headers, config) {
				if (data.error != -1){
					Mensagem.success(data.mensagem); 

					$scope.getCursoCondicao(idCurso);

					$scope.objeto = {};
				} else {
					Mensagem.error(data.mensagem); 
				}
			}).error(function(data, status) {
				// log error
			});
	}

	$scope.delCursoNota = function(item){
		$scope.json = angular.toJson(item);

		$http.post('api/index.php/delcursonota/', $scope.json, 
			{withCredentials: true,
				headers: {'enctype': 'multipart/form-data' },
			}).success(function(data, status, headers, config) {
				if (data.error != -1){
					Mensagem.success(data.mensagem); 

					$scope.getCursoNota(idCurso);

					$scope.objeto = {};
				} else {
					Mensagem.error(data.mensagem); 
				}
			}).error(function(data, status) {
				// log error
			});
	}

	$scope.getCondicao = function(){
      $http.get('api/index.php/condicao/').    
        success(function(data, status, headers, config) {      
          $scope.condicoes = data.condicao;                   
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }

    $scope.getCursoCondicao = function(id){
      $http.get('api/index.php/cursocondicao/0/'+id).    
        success(function(data, status, headers, config) {      
          $scope.cursoscondicoes = data.curso_condicao;                   
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }

    $scope.getCursoNota = function(id){
      $http.get('api/index.php/cursonota/0/'+id).    
        success(function(data, status, headers, config) {      
          $scope.cursosNotas = data.curso_nota;                   
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }

    $scope.getCursoHorario = function(id){
      $http.get('api/index.php/cursohorario/0/'+id).    
        success(function(data, status, headers, config) {      
          $scope.cursosHorarios = data.curso_horario;                   
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }

    $scope.getNota = function(){
      $http.get('api/index.php/nota/').    
        success(function(data, status, headers, config) {      
          $scope.notas = data.nota;                   
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }

	// Ciclo
	$scope.getCiclo = function(){ // Carrega Combo
		$http.get('api/index.php/ciclo/0/').
		success(function(data, status, headers, config) {
			$scope.ciclos = data.retorno;
		}).
		error(function(data, status, headers, config) {
			// log error
		});
	};

	$scope.getHistoricoParte = function(){ // Carrega Combo
		$http.get('api/index.php/gethistoricoparte/').
		success(function(data, status, headers, config) {
			$scope.historico_parte = data.retorno;
		}).
		error(function(data, status, headers, config) {
			// log error
		});
	};	
	
	$scope.changeCiclo = function(item) {
		if (item.id==-1) {
			$scope.modalNovoCiclo();
		}
		$scope.curso.id_ciclo = item.id;
		$( "em[for='ciclo']" ).css("display","none");    
	}
	$scope.modalNovoCiclo = function(size){
		$('#myModalCiclo').modal('show');
	}
	$scope.addCicloSalvar = function(item) {
		if ($('#cadastroCiclo-form').valid()) {
			$scope.addCiclo.ativo = 1;
			$scope.json = angular.toJson($scope.addCiclo);

			$http.post('api/index.php/ciclo/', $scope.json, 
						{withCredentials: true,
							headers: {'enctype': 'multipart/form-data' },
						})
			.success(function(data, status, headers, config) {
				if (data.error == '0'){
					Mensagem.success(data.mensagem);
					$scope.getCiclo();
					$scope.getProximoCurso();
					$scope.curso.id_ciclo = item.id;
					$scope.addCiclo = {};
					$('#myModalCiclo').modal('hide');
				} else {
					Mensagem.error(data.mensagem);
				}
			}).error(function(data, status) {
				// log error
			});
		}
	}
	$scope.addCicloNovo = function(){
		$scope.addCiclo = {};
	}
	// /Ciclo

	// TipoCurso
	$scope.getTipoCurso = function(){ // Carrega Combo
		$http.get('api/index.php/tipocurso/0/').
		success(function(data, status, headers, config) {
			$scope.tipos_curso = data.tipocurso;
		}).
		error(function(data, status, headers, config) {
			// log error
		});
	};
	
	$scope.changeTipoCurso = function(item) {
		if (item.id==-1) {
			$scope.modalNovoTipoCurso();
		}
		$scope.curso.id_tipo_curso = item.id;
		$( "em[for='tipo_de_curso']" ).css("display","none");
	}
	$scope.modalNovoTipoCurso = function(size){
		$('#myModalTipoCurso').modal('show');
	}
	$scope.addTipoCursoSalvar = function(item) {
		if ($('#cadastroTipoCurso-form').valid()) {
			$scope.json = angular.toJson($scope.addTipoCurso);

			$http.post('api/index.php/tipocurso/', $scope.json, 
						{withCredentials: true,
							headers: {'enctype': 'multipart/form-data' },
						})
			.success(function(data, status, headers, config) {
				if (data.error == '0'){
					Mensagem.success(data.mensagem);
					$scope.getTipoCurso();
					$scope.curso.id_tipo_curso = item.id;
					$scope.addTipoCurso = {};
					$('#myModalTipoCurso').modal('hide');
				} else {
					Mensagem.error(data.mensagem);
				}
			}).error(function(data, status) {
				// log error
			});
		}
	}
	$scope.addTipoCursoNovo = function(){
		$scope.addTipoCurso = {};
	}
	// /TipoCurso

	// ProximoCurso
	$scope.getProximoCurso = function(){ // Carrega Combo
		$http.get('api/index.php/curso/1/').
		success(function(data, status, headers, config) {
			$scope.proximos_curso = data.curso;
		}).
		error(function(data, status, headers, config) {
			// log error
		});
	};
	
	$scope.changeProximoCurso = function(item) {
		$scope.curso.id_proximo_curso = item.id;
		$( "em[for='proximo_curso']" ).css("display","none");
	}
	// /ProximoCurso

	$scope.changePessoaCoordenador = function(item) {
		$scope.curso.id_pessoa_coordenador = item.id;
		$( "em[for='coordenador']" ).css("display","none");
	}

	// ProximoPeriodo
	$scope.getProximoPeriodo = function(){ // Carrega Combo
		$http.get('api/index.php/periodoaula/0').
		success(function(data, status, headers, config) {
			$scope.proximos_periodo = data.periodo_aula;
		}).
		error(function(data, status, headers, config) {
			// log error
		});
	};
	
	$scope.changeProximoPeriodo = function(item) {
		if (item.id==-1) {
			$scope.modalNovoProximoPeriodo();
		}
		$scope.curso.id_proximo_periodo = item.id;
		$( "em[for='proximo_feriado']" ).css("display","none");
	}
	$scope.modalNovoProximoPeriodo = function(size){
		$('#myModalProximoPeriodo').modal('show');
	}
	$scope.addProximoPeriodoSalvar = function(item) {
		if ($('#cadastroProximoPeriodo-form').valid()) {
			$scope.json = angular.toJson($scope.addProximoPeriodo);

			$http.post('api/index.php/periodoaula/', $scope.json, 
						{withCredentials: true,
							headers: {'enctype': 'multipart/form-data' },
						})
			.success(function(data, status, headers, config) {
				if (data.error == '0'){
					Mensagem.success(data.mensagem);
					$scope.getProximoPeriodo();
					$scope.curso.id_proximo_periodo = item.id;
					$scope.addProximoPeriodo = {};
					$('#myModalProximoPeriodo').modal('hide');
				} else {
					Mensagem.error(data.mensagem);
				}
			}).error(function(data, status) {
				// log error
			});
		}
	}
	$scope.addProximoPeriodoNovo = function(){
		$scope.addProximoPeriodo = {};
	}
	// /ProximoPeriodo

	// PessoaCoordenador
	$scope.getPessoaCoordenador = function(){ // Carrega Combo
		//$http.get('api/index.php/pessoa/').
		$http.get('api/index.php/funcionarioescola/0/').
		success(function(data, status, headers, config) {
			$scope.pessoas_coordenador = data.pessoa;
		}).
		error(function(data, status, headers, config) {
			// log error
		});
	};
	
	// /PessoaCoordenador
	
	$scope.getPessoaProfessor = function(){ // Carrega Combo
		//$http.get('api/index.php/pessoa/').
		$http.get('api/index.php/funcionarioescola/1/').
		success(function(data, status, headers, config) {
			$scope.pessoas_professor = data.pessoa;
		}).
		error(function(data, status, headers, config) {
			// log error
		});
	};
	

	// TipoDisciplinaCurso
	$scope.getTipoDisciplinaCurso = function(){ // Carrega Combo
		$http.get('api/index.php/tipodisciplinacurso/0/').
		success(function(data, status, headers, config) {
			$scope.tipos_disciplina_curso = data.tipodisciplinacurso;
		}).
		error(function(data, status, headers, config) {
			// log error
		});
	};
	
	$scope.changeTipoDisciplinaCurso = function(item) {
		if (item.id==-1) {
			$scope.modalNovoTipoDisciplinaCurso();
		}
		$scope.curso.id_tipo_disciplina_curso = item.id;
		$( "em[for='tipo_disciplina']" ).css("display","none");
	}
	$scope.modalNovoTipoDisciplinaCurso = function(size){
		$('#myModalTipoDisciplinaCurso').modal('show');
	}
	$scope.addTipoDisciplinaCursoSalvar = function(item) {
		if ($('#cadastroTipoDisciplinaCurso-form').valid()) {
			$scope.json = angular.toJson($scope.addTipoDisciplinaCurso);

			$http.post('api/index.php/tipodisciplinacurso/', $scope.json, 
						{withCredentials: true,
							headers: {'enctype': 'multipart/form-data' },
						})
			.success(function(data, status, headers, config) {
				if (data.error == '0'){
					Mensagem.success(data.mensagem);
					$scope.getTipoDisciplinaCurso();
					$scope.curso.id_disciplina_curso = item.id;
					$scope.addTipoDisciplinaCurso = {};
					$('#myModalTipoDisciplinaCurso').modal('hide');
				} else {
					Mensagem.error(data.mensagem);
				}
			}).error(function(data, status) {
				// log error
			});
		}
	}
	$scope.addTipoDisciplinaCursoNovo = function(){
		$scope.addTipoDisciplinaCurso = {};
	}
	// /TipoDisciplinaCurso

	$scope.novoCadastro = function(){
		$scope.curso = {};
		$scope.ciclo.selected = '';
		$scope.tipo_curso.selected = '';
		$scope.tipo_disciplina_curso.selected = '';
		$scope.proximo_curso.selected = '';
		$scope.proximo_periodo.selected = '';
		$scope.pessoa_coordenador.selected = '';
	}

	$scope.novoCadastroProfessor = function(){
		$scope.professor = {};
		$scope.prof.selected = '';
	}

	$scope.novoCadastroHorario = function() {
		$scope.horario = {};
		$scope.horario.conceito_nota = 1;
	}

	$scope.editCadastroProfessor = function(obj){
		$scope.professor = obj;
		$scope.prof = {selected : {"id":$scope.professor.id_pessoa_professor,"nome":$scope.professor.pessoa_professor}};
	}

	$scope.editCadastroHorario = function(obj){
		$scope.horario = obj;
	}

	$scope.delCursoProfessor = function(indice, item) {
		$scope.json = angular.toJson(item);

		$http.post('api/index.php/delprofessorcurso/', $scope.json, 
					{withCredentials: true,
						headers: {'enctype': 'multipart/form-data' },
					})
		.success(function(data, status, headers, config) {
			if(data.error == '0'){
				$scope.cursosProfessores.splice(indice, 1);
				Mensagem.success(data.mensagem);
			}else{
				Mensagem.error(data.mensagem);
			}
		}).error(function(data, status) {
			// log error
		});
	}

	$scope.delCursoHorario = function(item) {
		$scope.json = angular.toJson(item);

		$http.post('api/index.php/delcursohorario/', $scope.json, 
					{withCredentials: true,
						headers: {'enctype': 'multipart/form-data' },
					})
		.success(function(data, status, headers, config) {
			if(data.error == '0'){
				$scope.getCursoHorario(idCurso);
				Mensagem.success(data.mensagem);
			}else{
				Mensagem.error(data.mensagem);
			}
		}).error(function(data, status) {
			// log error
		});
	}

	//------------------------------------------------------------------------------------------------------------------------------------//
	//		FRH - Inicio Complemento de Curso
	//------------------------------------------------------------------------------------------------------------------------------------//

    $scope.complemento = {};
    $scope.complemento.ativo = 1; 
    $scope.selComplementos = [];
    $scope.showComplemento = false;  


	// ONCHANGE NOS SELECT
	$scope.verificarAcaoEtapa = function(item) {
		if (item.id==-1) {			
			$scope.etapa.selected = '';
		}
		$scope.complemento.id_etapa = item.id;
		$( "em[for='etapa']" ).css("display","none");
	}
	// ONCHANGE NOS SELECT
	$scope.verificarAcaoBoletim = function(item) {
		if (item.id==-1) {			
			$scope.boletim.selected = '';
		}
		$scope.complemento.id_boletim = item.id;
		$( "em[for='boletim']" ).css("display","none");
	}
	// ONCHANGE NOS SELECT
	$scope.verificarAcaoFicha = function(item) {
		if (item.id==-1) {			
			$scope.ficha.selected = '';
		}
		$scope.complemento.id_ficha = item.id;
		$( "em[for='ficha']" ).css("display","none");
	}

	$scope.novoComplemento = function() {
		$scope.complemento = {};
		$scope.complemento.ativo = 1; 
		
		$scope.etapa.selected = '';
		$scope.boletim.selected = '';
		$scope.ficha.selected = '';		
	}

    $scope.getEtapa = function(){
        $http.get('api/index.php/etapa/1/')
        .success(function(data, status, headers, config) {                           
          $scope.etapas = data.etapa;
          console.log('ETAPAS', $scope.etapas);
        })
        .error(function(data, status, headers, config) { }); 
    }
    $scope.getEtapa();

	// boletim/0 <- tipo=1 (da Tabela Boletim, somente Boletins -> Usado na getCursoComplemento L:38715)
	// boletim/2 <- tipo=0 (da Tabela Boletim, somente Fichas -> Usado na getCursoComplemento L:38715)

    $scope.getBoletim = function(){
        $http.get('api/index.php/boletim/0/0/')
        .success(function(data, status, headers, config) {                           
          $scope.boletins = data.boletim;
        })
        .error(function(data, status, headers, config) { }); 
    }
	$scope.getBoletim();

    $scope.getFicha = function(){
        $http.get('api/index.php/boletim/0/2/')
        .success(function(data, status, headers, config) {                           
          $scope.fichas = data.boletim;
        })
        .error(function(data, status, headers, config) { }); 
    }
    $scope.getFicha();


    $scope.getComplemento = function(id_curso){

       $http.get('api/index.php/complementocurso/'+id_curso)
       .success(function(data, status, headers, config) {
          if (data.error == '0'){

        	$scope.selComplementos = data.curso_complemento;
        	//$scope.showComplemento = ($scope.selComplementos.length>0 || (typeof $scope.selComplementos.id == 'undefined')) ? true : false;

        	if($scope.selComplementos[0].id_curso == idCurso){
        		$scope.showComplemento = true;
        	}

          }

       }).error(function(data, status, headers, config) { });
    }	

    $scope.editarComplemento = function(indexEl, item){
    	$scope.complemento = item;
	    $scope.complemento.indexEl = indexEl;      

		$scope.etapa   = {selected : {"id":item.id_etapa  ,"descricao":item.etapa_descricao	 }};
		$scope.boletim = {selected : {"id":item.id_boletim,"descricao":item.boletim_descricao}};
		$scope.ficha   = {selected : {"id":item.id_ficha  ,"descricao":item.ficha_descricao	 }};		
    }

    $scope.excluirComplemento = function(indexEl, item) {

		$scope.objCompExcluir = {};
		$scope.objCompExcluir.id = item.id;

		$scope.json = angular.toJson($scope.objCompExcluir);
		$http.post('api/index.php/delcomplementocurso/', $scope.json, {withCredentials: true, headers: {'enctype': 'multipart/form-data' },})
		.success(function(data, status, headers, config)
		{ 
			if(data.error != -1)
			{ 
				Mensagem.success('Complemento Excluído com sucesso!'); 
				$scope.selComplementos.splice(indexEl, 1);
			}
			else
			{ 
				Mensagem.error('Erro ao excluir o Complemento!'); 
			}
		})
		.error(function(data, status, headers, config) { });
	}

    $scope.cadastrarComplemento = function(objComplemento) {

	    if ($('#cadastroCurso-Complemento-form').valid()) {

			if(idCurso == undefined){ Mensagem.error('É necessário cadastrar um curso!'); return;}

			$scope.complemento.id_curso = $scope.curso.id;
			$scope.json = angular.toJson($scope.complemento);

			addLista = ($scope.complemento.id=="" || (typeof $scope.complemento.id == 'undefined')) ? true : false;

			$http.post('api/index.php/complementocurso/', $scope.json,{withCredentials: true, headers: {'enctype': 'multipart/form-data' },})   
			.success(function(data, status, headers, config) {

			  if(data.error != -1){
			    
			    Mensagem.success(data.mensagem);
			    $scope.complemento.id = data.id_cursocomplemento;

			    if($scope.complemento.ativo==1){$scope.complemento.statAtivo = "Ativo";}else{$scope.complemento.statAtivo = "Inativo";}
			    if(addLista){ $scope.selComplementos.push($scope.complemento); }				    

			    $scope.complemento = {};
			    $scope.complemento.ativo = 1; 
			    $scope.complemento.statAtivo = "Ativo"; 

			    $scope.etapa.selected = '';
			    $scope.ficha.selected = '';
			    $scope.boletim.selected = '';

			    $scope.getComplemento($scope.curso.id);

			  }else{ Mensagem.error(data.mensagem); }

			}).error(function(data, status, headers, config) { });
	    }
	}

	//------------------------------------------------------------------------------------------------------------------------------------//
	//		FRH - Fim Complemento de Curso
	//------------------------------------------------------------------------------------------------------------------------------------//
	
	$scope.getCiclo(); // carrega ciclo no campo select
	$scope.getTipoCurso(); // carrega tipocurso no campo select
	$scope.getProximoPeriodo(); // carrega ProximoPeriodo no campo select
	$scope.getPessoaCoordenador(); // carrega PessoaCoordenador no campo select
	$scope.getPessoaProfessor();
	$scope.getTipoDisciplinaCurso(); // carrega TipoDisciplinaCurso no campo select
	$scope.getDisciplina();
	$scope.getProximoCurso();	
	$scope.novoCadastroProfessor();
	$scope.novoCadastroHorario();
	$scope.getHistoricoParte();

	$scope.getCondicao();
	$scope.getNota();

	if (idCurso != undefined) {
		$timeout(function() {

			$scope.getComplemento(idCurso);
			$scope.showComplemento = ($scope.selComplementos.length>0) ? true : false; 

			$scope.getIdCurso(idCurso);
			$scope.getCursoCondicao(idCurso);
			$scope.getCursoNota(idCurso);
			$scope.getCursoHorario(idCurso);
			$scope.getCursoProfessor();
		}, 800);
	};	
});

//@ sourceURL=controller.formCadastroCurso.js