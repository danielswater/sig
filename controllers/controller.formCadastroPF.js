smartSig.registerCtrl("formCadastroPF", function($scope, $http, $routeParams, Mensagem, $timeout, $rootScope, $location, $modal, Permissao){
	$scope.permissoes = Permissao.validaPermissao();

	$scope.permissoes.then(function (data) {
		$scope.permissoes = data;
	}, function (status) {
		console.log('status',status);
	});

	//Inicialização de variáveis do ambiente
	$scope.initDate = new Date();
	$scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd/MM/yyyy', 'shortDate'];
	$scope.format = $scope.formats[2];
	$scope.endereco = {};
	$scope.pessoas = {};
	$scope.pessoa = {};
	$scope.estados = {};
	$scope.cidades = {};
	$scope.estadocivil = {};
	$scope.contrib = {};
	$scope.contribuicoes = [];
	$scope.addContrib = {};
	$scope.tipobeneficiario = {};
	$scope.beneficiarioPessoa = {};
	$scope.error = '';
	$scope.files = '';
	$scope.filesDocumento = '';
	$scope.filesDocumentoCpf = '';
	$scope.pessoa.id_tipo_pessoa = 1;
	$scope.pessoa.enviar_convite = 0;
	$scope.addContrib.isento = 0;
	$scope.addContrib.id_beneficiario = '';
	$scope.labelPF = 1;
	$scope.labelPJ = 1;
	$scope.updatePessoa = 0;
	$scope.beneficiarios = [];
	$scope.beneficiario = {};
	$scope.socio = {};
	$scope.sociosSel = [];
	$scope.departamento = [];
	$scope.tipofornecedor = [];
	$scope.tipofornecedores = [];
	$scope.categoria = [];
	$scope.categorias = [];
	$scope.pessoaLaudo = {};
	$scope.pessoaLaudo.status = 0;
	$scope.assistente = [];
	$scope.objeto = [];
	$scope.forma_tratamentos = [];
	$scope.pronome_tratamento = false;
	$scope.documento = true;
	$scope.tipoevento = [];
	$scope.tipoeventos = [];
	$scope.tipoeventos.selecionados = [];
	$scope.tipos_telefone = [];

	//Seta o id do cadastro de pessoa
	var idPessoa = $routeParams.id;
	//Seta o tipo de cadastro da pessoa
	var idCadastro = $routeParams.tipo;

	if (idCadastro==1) { // Cadastro de Associado PF e PJ
		$scope.associado = 1;
	} else if (idCadastro==2) { // Cadastro de Proprietário de Jazigo
		$scope.proprietario = 1;
	} else if (idCadastro==3) { // Cadastro de Funcionário
		$scope.funcionario = 1;
	} else if (idCadastro==4) { // Cadastro de Donatários
		$scope.donatario = 1;
	} else if (idCadastro==5) { // Cadastro de Convidados
		$scope.convidado = 1;
	} else if (idCadastro==6) { // Não Associado
		$scope.naoassociado = 1;
		$scope.documento = false;
	} else if (idCadastro==7) { // Fornecedor
		$scope.fornecedor = 1;
	}

	//Início - Buscar dados para preencher os combos
	//Busca categoria de não associado
	$scope.getCategoriaNaoAssociado = function(){
		$http.get('api/index.php/categorianaoassociado/2/').
		success(function(data, status, headers, config) {
			$scope.categorias = data.categoria;
		}).
		error(function(data, status, headers, config) {
			// log error
		});
	}

	//Busca lista de países
	$scope.getPaises = function(){
		$http.get('api/index.php/pais').
		success(function(data, status, headers, config) {
			$scope.paises = data.paises;
		}).
		error(function(data, status, headers, config) {
			// log error
		});
	}

	//Busca lista de estados civis
	$scope.getEstadoCivil = function(){
		$http.get('api/index.php/estadocivil/').
		success(function(data, status, headers, config) {
			$scope.estadocivil = data.estado_civil;
		}).
		error(function(data, status, headers, config) {
			// log error
		});
	}

	//Busca lista de tipos de beneficciários
	$scope.getTipoBeneficiario = function(){
		$http.get('api/index.php/tipobeneficiario/').
		success(function(data, status, headers, config) {
			$scope.tipobeneficiario = data;
		}).
		error(function(data, status, headers, config) {
			// log error
		});
	}

	//Busca lista de tipos de papeis
	$scope.getPapel = function(){
		$http.get('api/index.php/papel/').
		success(function(data, status, headers, config) {
			$scope.papeis = data;
		}).
		error(function(data, status, headers, config) {
			// log error
		});
	}

	//Busca lista de fonte de captação
	$scope.getFonteCaptacao = function(){
		$http.get('api/index.php/fontecaptacao/').
		success(function(data, status, headers, config) {
			$scope.fonte_captacao = data;
		}).
		error(function(data, status, headers, config) {
			// log error
		});
	}

	//Busca lista de campanhas
	$scope.getCampanha = function(){
		$http.get('api/index.php/campanha?flagPeriodo=1').
		success(function(data, status, headers, config) {
			$scope.campanha = data.campanha;
		}).
		error(function(data, status, headers, config) {
			// log error
		});
	}

	//Busca lista de departamentos
	$scope.getDepartamento = function(){
		$http.get('api/index.php/deptofuncionarios/1').
		success(function(data, status, headers, config) {
			$scope.departamento = data.departamentos;
		}).
		error(function(data, status, headers, config) {
			// log error
		});
	}

	//Busca lista de tipo de fornecedor
	$scope.getTipoFornecedor = function(){
		$http.get('api/index.php/tipofornecedor/0/').
		success(function(data, status, headers, config) {
			$scope.tipofornecedores = data.tipofornecedor;
		}).
		error(function(data, status, headers, config) {
			// log error
		});
	}

	//Busca lista de pessoas que indicaram
	$scope.getIndicador = function(){
		$http.get('api/index.php/pessoa/').
		success(function(data, status, headers, config) {
			$scope.pessoas = data.pessoa;
		}).
		error(function(data, status, headers, config) {
			// log error
		});
	}

	//Busca lista de formas de tratamento
	$scope.getFormaTratamento = function(){
		$http.get('api/index.php/formatratamento/0/').
		success(function(data, status, headers, config) {
			$scope.forma_tratamentos = data.forma_tratamento;
		}).
		error(function(data, status, headers, config) {
			// log error
		});
	}
	//Fim - Buscar dados para preencher os combos

	$scope.verificarAcaoFormaTratamento = function(item) {
		if (item.id==-1) {
			$scope.modalFormaTratamento();
			$scope.forma_tratamento.selected = '';
		}
		$scope.pessoa.id_forma_tratamento = item.id;
		$( "em[for='forma_tratamento']" ).css("display","none");
	}

	$scope.modalFormaTratamento = function(size){
		$('#myModalFormaTratamento').modal('show');
	}

	$scope.adicionarFormaTratamento = function() {
		if ($('#cadastroFormaTratamento-form').valid()) {
			$scope.addFormaTratamento.ativo = 1;
			$scope.json = angular.toJson($scope.addFormaTratamento);
			$http.post('api/index.php/formatratamento/', $scope.json,
				{withCredentials: true,
					headers: {'enctype': 'multipart/form-data' },
				})
			.success(function(data, status, headers, config) {
				if (data.error == '0'){
					Mensagem.success(data.mensagem);
					$('#myModalFormaTratamento').modal('hide');
					$scope.getFormaTratamento();
					$scope.addFormaTratamento = {};
				}else{
					Mensagem.error(data.mensagem);
				}
			}).error(function(data, status) {
				// log error
			});
		}
	}

	//Verifica se pessoa existe no sistema
	$scope.getPessoaExists = function(val) {
		return $http.get('api/index.php/stringpessoa?associado=1&', {
			params: {
				string: val,
				sensor: false
			}
		}).then(function(response){
			return response.data.pessoa;
		});
	};

	// Busca pessoa
	$scope.passaPessoa = function(item, model, label){
		$scope.getIdPessoa(item.id);
	}

	//Busca dados da pessoa passada
	$scope.getIdPessoa = function(idPessoa){
		$http.get('api/index.php/pessoa/'+idPessoa)
		.success(function(data, status, headers, config) {
			$scope.updatePessoa = 1;
			$scope.pessoa = data.pessoa[0];
			console.log('pessoa', $scope.pessoa);
			return;

			$scope.beneficiario.id_pessoa = data.pessoa[0].id;
			$scope.endereco = data.pessoa[0].endereco.endereco[0];
			$scope.contrib = data.pessoa[0].contribuicao[0];

			if($scope.contrib.isento == undefined){
				$scope.contrib.isento = 0;
			}

			$scope.contrib.id_pessoa = data.pessoa[0].id;
			$scope.socio.id_pessoa = data.pessoa[0].id;
			// $scope.pessoa.data_associacao = $scope.tratarData(data.pessoa[0].data_associacao);
			// $scope.pessoa.data_nascimento = $scope.tratarData(data.pessoa[0].data_nascimento);
			// $scope.pessoa.data_desligamento = $scope.tratarData(data.pessoa[0].data_desligamento);
			$scope.pessoa.data_associacao = data.pessoa[0].data_associacao;
			$scope.pessoa.data_nascimento = data.pessoa[0].data_nascimento;
			$scope.pessoa.data_desligamento = data.pessoa[0].data_desligamento;

			if ($scope.endereco!=undefined) {
				$scope.getCep();
				$scope.endereco.id_pessoa = data.pessoa[0].id;
			} else {
				$scope.endereco = {}
				$scope.endereco.id_pessoa = data.pessoa[0].id;
			}

			if (data.pessoa[0].beneficiarios[0].error != -1) {
				$scope.beneficiarios = data.pessoa[0].beneficiarios;
			}

			if (data.pessoa[0].sociosSel[0].error != -1) {
				$scope.sociosSel = data.pessoa[0].sociosSel;
			}

			if (data.pessoa[0].id_tipo_pessoa==1)  {
				$scope.labelPF = 1;
				$scope.labelPJ = 0;
				//cpf.disabled = true;
			} else if (data.pessoa[0].id_tipo_pessoa==2) {
				$scope.labelPF = 0;
				$scope.labelPJ = 1;
				//cnpj.disabled = true;
			}

			if (data.pessoa[0].rg.length>0) {
				$scope.pessoa.id_tipo_documento=1;
				$scope.pessoa.numero_documento = data.pessoa[0].rg;
			} else if (data.pessoa[0].rne.length>0) {
				$scope.pessoa.id_tipo_documento=3;
				$scope.pessoa.numero_documento = data.pessoa[0].rne;
			} else if (data.pessoa[0].identificacao_internacional.length>0) {
				$scope.pessoa.id_tipo_documento=7;
				$scope.pessoa.numero_documento = data.pessoa[0].identificacao_internacional;
			}

			if (data.pessoa[0].pessoa_indicador) {
				$scope.objeto = {selected : data.pessoa[0].pessoa_indicador};
			};

			$scope.categoria = {selected : {"id":$scope.pessoa.id_categoria_naoassociado,"descricao":$scope.pessoa.categoria_naoassociado}};
			$scope.pessoa.categoria = $scope.pessoa.id_categoria_naoassociado;
			$scope.tipofornecedor = {selected : {"id":$scope.pessoa.id_tipo_fornecedor,"descricao":$scope.pessoa.tipo_fornecedor}};
			$scope.pessoa.tipofornecedor = $scope.pessoa.id_tipo_fornecedor;

			if (data.pessoa[0].tipo_evento) {
				$scope.refreshTipoEvento(data.pessoa[0].tipo_evento);
			}

			// var teste = [];
			// teste.push($scope.tipoeventos.selecionados);
			// console.log(data.pessoa[0].tipo_evento);
			// console.log("Ricardo",teste[0]);
			// $scope.tipoeventos.selecionados = teste[0];
			//$scope.tipoeventos.selecionados = [{"id":"1","descricao":"Missa"},{"id":"2","descricao":"Almoço"},{"id":"3","descricao":"Jantar"},{"id":"4","descricao":"Reunião"}]
			//$scope.multipleDemo.selectedPeople = [$scope.people[5], $scope.people[4]];
		})
		.error(function(data, status, headers, config) {
			// log error
		});
	}

	$scope.verificarAcaoCategoria = function(item) {
		$scope.pronome_tratamento = item.pronome_tratamento;
		$scope.documento = item.documento;
		if (item.id==-1) {
			$scope.modalNovoCategoria();
			$scope.categoria.selected = '';
		}
		$scope.pessoa.id_categoria_naoassociado = item.id;
		$( "em[for='categoria']" ).css("display","none");
	}

	$scope.verificarAcaoFonteIndicacao = function(item) {
		$scope.pessoa.id_pessoa_indicadora = item.id;
		$( "em[for='indicador']" ).css("display","none");
	}

	$scope.dateOptions = {
		formatYear: 'yy',
		startingDay: 1,
		language: 'pt-BR',
	};

	$scope.limparLaudo = function(){
		$scope.pessoaLaudo = {};
		$scope.pessoaLaudo.status = 0;
		$scope.assistente.selected = '';
	}

	$scope.cadastrarLaudo = function(){
		if ($('#cadastroLaudo-form').valid()) {
			SalvarLaudo.disabled = true;
			$scope.pessoaLaudo.id_pessoa = idPessoa;
			console.log('cadastrarLaudo', $scope.pessoaLaudo);
			$scope.json = angular.toJson($scope.pessoaLaudo);
			$http.post('api/index.php/laudo/', $scope.json,
				{withCredentials: true,
					headers: {'enctype': 'multipart/form-data' },
					// transformRequest: angular.identity
				})
			.success(function(data, status, headers, config) {
				if (data.error == '0'){
					$scope.pessoaLaudo.id = data.id_pessoa_laudo;
					SalvarLaudo.disabled = false;
					Mensagem.success(data.mensagem);
				}else{
					Mensagem.error(data.mensagem);
				}
			})
			.error(function(data, status) {
				// log error
			});
		}
	}

	$scope.getLaudo = function(id){
		$http.get('api/index.php/laudo/'+id)
		.success(function(data, status, headers, config) {
			$scope.pessoaLaudo = data.laudo[0];
			$scope.assistente = {selected : {"id":$scope.pessoaLaudo.id_pessoa_assistente,"nome":$scope.pessoaLaudo.pessoa_assistente}};
		})
		.error(function(data, status, headers, config) {
			// log error
		});
		console.log('getLaudo', $scope.pessoaLaudo);
	}

	$scope.verificarAssistenteSocial = function(item) {
		$scope.pessoaLaudo.id_pessoa_assistente = item.id;
		$( "em[for='assistente']" ).css("display","none");
	}


	$scope.novoCadastro = function(){
		$location.path('/forms/formCadastroPF/'+idCadastro+'/');
	}

	$scope.limparPessoa = function(){
		$scope.id_tipo_pessoa_default = $scope.pessoa.id_tipo_pessoa;
		$scope.pessoa = {};
		$scope.pessoa.id_tipo_pessoa = $scope.id_tipo_pessoa_default;
	}

	$scope.limparContribuicao = function(){
		$scope.addContrib = {}
		$scope.addContrib.isento = 0;
	}


	$scope.tratarData = function(data){
		var new_data = '';
		if(data != null && data != undefined){
			new_data = data.split("/");
			new_data = new_data[2] +'/'+ new_data[1] +'/'+ new_data[0];
		}
		return new_data;
	}

	//Busca dados de contribuição do beneficiário
	$scope.getContribuicao = function(id){
		$http.get('api/index.php/beneficiariocontribuicao/'+id)
		.success(function(data, status, headers, config) {
			if(data[0].error != -1){
				$scope.contribuicoes = data;
				console.log('getContribuicao', $scope.contribuicoes);
			}
		})
		.error(function(data, status, headers, config) {
			// log error
		});
	}

	//Busca dados do beneficiário
	$scope.getBeneficiario = function(id){
		//var cep = $("#"+id).val();
		$http.get('api/index.php/beneficiario/'+id)
		.success(function(data, status, headers, config) {
			if(data[0].error != -1){
				$scope.beneficiarioPessoa = data;
			}
		})
		.error(function(data, status, headers, config) {
			// log error
		});
	}

	//Busca dados do cep
	$scope.getCep = function(id){
		//var cep = $("#"+id).val();
		$http.get('api/index.php/cep/'+$scope.endereco.cep)
		.success(function(data, status, headers, config) {
			if(data[0].error == -1){
				$scope.error = data[0].mensagem;
				Mensagem.error(data[0].mensagem);
			}
			var idPessoa = $scope.endereco.id_pessoa;
			$scope.endereco.cep = data[0].endereco.cep;
			$scope.endereco.logradouro = data[0].endereco.logradouro;
			$scope.endereco.bairro = data[0].endereco.bairro;
			$scope.endereco.estado = data[0].endereco.estado;
			$scope.endereco.cidade = data[0].endereco.cidade;
			$scope.endereco.idPais = data[0].endereco.idPais;
			$scope.endereco.id_pessoa = idPessoa;
			$scope.estados    = data[0].estados;
			angular.forEach(data[0].estados, function(value, key) {
				if($scope.endereco.estado == value.uf){
					$scope.cidades = data[0].estados[key].cidades;
				}
			});

			$scope.paises     = data[0].pais;
		})
		.error(function(data, status, headers, config) {
			// log error
		});
	}

	//Busca lista de cidades do cep escolhido
	$scope.getCidade = function(nome){
		angular.forEach($scope.estados, function(value, key) {
			if(nome == value.nome){
				$scope.cidades = $scope.estados[key].cidades;
			}
		});
	}

	// $scope.getEstado = function(){
	//     $http.get('api/index.php/estado/').
	//     success(function(data, status, headers, config) {
	//        $scope.estados = data;
	//     }).
	//     error(function(data, status, headers, config) {
	//        // log error
	//     });

	//     $http.get('api/index.php/pais').
	//     success(function(data, status, headers, config) {
	//        $scope.paises = data;
	//        $scope.endereco.idPais = 33;
	//     }).
	//     error(function(data, status, headers, config) {
	//        // log error
	//     });
	// }

	// $scope.getCidade = function(){
	//     $http.get('api/index.php/cidade/'+ $scope.endereco.estado).
	//     success(function(data, status, headers, config) {
	//         $scope.cidades = data;
	//     }).
	//     error(function(data, status, headers, config) {
	//       // log error
	//     });
	// }

	//Verifica se o cpf digitado já existe na base de dados
	$scope.getCpf = function(id){
		var cpf = $("#"+id).val();
		//cpf = cpf.replace('XXX.XXX.XXX-XX', "");
		if (cpf.length > 0) {
			$http.get('api/index.php/cpf/'+cpf)
			.success(function(data, status, headers, config) {
				if(data[0].error == -1){
					$scope.error = data[0].mensagem;

					Mensagem.error(data[0].mensagem);
					SalvarDadosPessoais.disabled=true;
				}else{
					SalvarDadosPessoais.disabled=false;
				}
			})
			.error(function(data, status, headers, config) {
			// log error
			});
		};
	}

	//Busca dados do documento digitado
	$scope.getDocumento = function(){
		if ($scope.pessoa.numero_documento) {
			$http.get('api/index.php/documentoAll/'+$scope.pessoa.numero_documento)
			.success(function(data, status, headers, config) {
				if(data[0].error == -1){
					$scope.error = data[0].mensagem;

					Mensagem.error(data[0].mensagem);
					SalvarDadosPessoais.disabled=true;
				}else{
					SalvarDadosPessoais.disabled=false;
				}
			})
			.error(function(data, status, headers, config) {
				// log error
			});
		};
	}

	//$scope.novoCadastro = function(){
	//  $scope.pessoa.nome = '';
	//  $scope.cadastroPF.$setPristine();
	//}

	//Funcionalidade para cadastrar os dados da pessoa
	$scope.cadastrarPessoa = function(tipocadastro) {
		if ($('#cadastroPF-form').valid()) {
			SalvarDadosPessoais.disabled = true;
			$scope.pessoa.tipocadastro = idCadastro;

			var tpPessoa = $scope.pessoa.id_tipo_pessoa;

			$scope.json = angular.toJson($scope.pessoa);
			$http.post('api/index.php/pessoa/', $scope.json,
				{withCredentials: true,
					headers: {'enctype': 'multipart/form-data' },
				// transformRequest: angular.identity
			}
			).success(function(data, status, headers, config) {
				if (data.error == '0'){
					console.log('cadastrar', data);
					$scope.pessoa.id_tipo_pessoa = tpPessoa;
					$scope.endereco.id_pessoa = data.id_pessoa;
					$scope.beneficiario.id_pessoa = data.id_pessoa;
					$scope.contrib.id_pessoa = data.id_pessoa;
					$scope.pessoa.id = data.id_pessoa;
					idPessoa = $scope.pessoa.id;

					if ($scope.files != '') {
						$scope.uploadFile($scope.files, data.id_pessoa);
					};

					if ($scope.filesDocumento != '' && data.id_documento) {
						$scope.uploadFileDocumento($scope.filesDocumento, data.id_documento, 'documento');
					};

					if ($scope.filesDocumentoCpf != '' && data.id_documento_cpf) {
						$scope.uploadFileDocumento($scope.filesDocumentoCpf, data.id_documento_cpf, 'cpf');
					};

					Mensagem.success(data.mensagem);
					$scope.getIdPessoa(idPessoa);
					SalvarDadosPessoais.disabled = false;
				} else {
					Mensagem.error(data.mensagem);
				}
			}).error(function(data, status) {
				//log de erro
			});
		}
	}

	$scope.cadastrarTelefonePessoa = function(objeto) {

	}

	$scope.getTiposTelefone = function() {
		$http.get('api/index.php/tipotelefone/').
		success(function(data, status, headers, config) {
			$scope.tipos_telefone = data.tipo_telefone;
			console.log('$scope.tipos_telefone',$scope.tipos_telefone);
		}).
		error(function(data, status, headers, config) {
			// log error
		});
	}
	$scope.getTiposTelefone();

	$scope.changeTipoTelefone = function(item) {
		if (item.id==-1) {
			$scope.tipo_telefone.selected = '';
		}
		$scope.curso.id_tipo_telefone = item.id;
		$( "em[for='tipo_telefone']" ).css("display","none");
	}

	//Funcionalidade para cadastrar endereço da pessoa
	$scope.cadastrarEnderecoPessoa = function(objeto,idTipoEndereco) {
		if ($scope.endereco.id_pessoa==undefined){
			Mensagem.error('Por favor, é necessário cadastrar os dados pessoais primeiro.');
			return;
		}

		if ($('#cadastroPF-Endereco-form').valid()) {
			SalvarEndereco.disabled = true;
			objeto.idTipoEndereco = idTipoEndereco;

			$scope.json = angular.toJson($scope.endereco);
			$http.post('api/index.php/endereco/', $scope.json,
				{withCredentials: true,
					headers: {'enctype': 'multipart/form-data' },
				// transformRequest: angular.identity
			})
			.success(function(data, status, headers, config) {
				if (data.error == '0'){
					Mensagem.success(data.mensagem);
					$scope.getIdPessoa(idPessoa);
					SalvarEndereco.disabled = false;
				} else {
					Mensagem.error(data.mensagem);
				}
			})
			.error(function(data, status) {
				//log erro
			});
		}
	}

	//Funcionalidade para cadastrar contribuição da pessoa
	$scope.cadastrarContribuicaoPessoa = function(objeto) {
		objeto.id_pessoa = $scope.contrib.id_pessoa;
		if ($scope.contrib.id_pessoa==undefined){
			Mensagem.error('Por favor, é necessário cadastrar os dados pessoais primeiro.');
			return;
		}
		if ($('#cadastroPF-Contribuicao-form').valid()) {
			//SalvarContribuicao.disabled = true;
			$scope.json = angular.toJson(objeto);
			$http.post('api/index.php/contribuicao/', $scope.json,
				{withCredentials: true,
					headers: {'enctype': 'multipart/form-data' },
					// transformRequest: angular.identity
				})
			.success(function(data, status, headers, config) {
				if (data.error == '0'){
					$scope.objeto = {};
					Mensagem.success(data.mensagem);
					$scope.getIdPessoa(idPessoa);
					$scope.getContribuicao(idPessoa);
					$scope.addContrib = {};
					$scope.addContrib.isento = objeto.isento;
					$scope.addContrib.id_beneficiario = '';
					SalvarContribuicao.disabled = false;
				} else {
					Mensagem.error(data.mensagem);
				}
			}).error(function(data, status) {
				//log erro
			});
		}
	}

	$scope.armazenaFile = function(files) {
		$scope.files = files;
	};

	$scope.armazenaFileDocumento = function(files) {
		$scope.filesDocumento = files;
	};

	$scope.armazenaFileDocumentoCpf = function(files) {
		$scope.filesDocumentoCpf = files;
	};

	$scope.uploadFile = function(files,id) {
		var fd = new FormData();
		file = files.files[0];

		if(file){
			fd.append("file", file);

			$http.post('api/index.php/uploadfile/'+id, fd, {
				withCredentials: true,
				headers: {'Content-Type': undefined },
				transformRequest: angular.identity
			})
			.success(function(data, status, headers, config) {
				console.log(data);
			})
			.error(function(data, status) {
				// log error
			});
		}
	}

	$scope.uploadFileDocumento = function(files,id,tipo) {
		var fd = new FormData();

		file = files.files[0];

		if(file){
			fd.append("file", file);
			$http.post('api/index.php/uploadfiledocumento/'+id+'/'+tipo, fd, {
				withCredentials: true,
				headers: {'Content-Type': undefined },
				transformRequest: angular.identity
			})
			.success(function(data, status, headers, config) {
				console.log(data);
			})
			.error(function(data, status) {
				// log error
			});
		}
	};

	$scope.delBeneficiario = function(indexEl){
		$scope.json = angular.toJson($scope.beneficiarios[indexEl]);
		$http.post('api/index.php/delbeneficiario/', $scope.json,
			{withCredentials: true,
				headers: {'enctype': 'multipart/form-data' },
				// transformRequest: angular.identity
			})
		.success(function(data, status, headers, config) {
			//$scope.beneficiarios.splice(indexEl, 1);
			//Mensagem.success(data.mensagem);
		})
		.error(function(data, status, headers, config) {
			Mensagem.error('Erro na exclusão de dependente');
		});
	}

	$scope.saveBeneficiarios = function(objeto){
		$scope.beneficiario.tipocadastro = idCadastro;

		if ($scope.pessoa.id==undefined){
			Mensagem.error('Por favor, é necessário cadastrar os dados pessoais primeiro.');
			return;
		} else {
			$scope.beneficiario.id_pessoa = $scope.pessoa.id;
		}

		if($scope.beneficiario.tipo == undefined || $scope.beneficiario.nome == undefined || $scope.beneficiario.sexo == undefined || $scope.beneficiario.data_nascimento == undefined){
			return;
		}

		$scope.json = angular.toJson(objeto);
		$.SmartMessageBox({
			title : "Salvar Dependente",
			content : "Tem certeza que deseja salvar?",
			buttons : '[Não][Sim]'
		}, function(ButtonPressed) {
			if (ButtonPressed == "Sim") {
				$http.post('api/index.php/beneficiario/', $scope.json,
					{withCredentials: true,
						headers: {'enctype': 'multipart/form-data' },
						// transformRequest: angular.identity
					})
				.success(function(data, status, headers, config) {
					if (data.error == '0'){
						switch(objeto.associacao) {
							case '1':
							objeto.associacaoNome = 'Dependente da Associação';
							break;
							case '2':
							objeto.associacaoNome = 'Apenas Familiar';
							break;
						}

						switch(objeto.tipo) {
							case '1':
							objeto.tipo_beneficiario_nome = 'Cônjuge';
							break;
							case '2':
							objeto.tipo_beneficiario_nome = 'Filho (a)';
							break;
							case '3':
							objeto.tipo_beneficiario_nome = 'Pai';
							break;
							case '4':
							objeto.tipo_beneficiario_nome = 'Mãe';
							break;
							case '5':
							objeto.tipo_beneficiario_nome = 'Irmão(ã)';
							break;
							case '6':
							objeto.tipo_beneficiario_nome = 'Avô(ó)';
							break;
							case '7':
							objeto.tipo_beneficiario_nome = 'Neto(a)';
							break;
							case '8':
							objeto.tipo_beneficiario_nome = 'Tio(a)';
							break;
							case '9':
							objeto.tipo_beneficiario_nome = 'Primo(a)';
							break;
							case '10':
							objeto.tipo_beneficiario_nome = 'Sobrinho(a)';
							break;
						}

						switch(objeto.sexo) {
							case 'M':
							objeto.sexo_nome = 'Masculino';
							break;
							case 'F':
							objeto.sexo_nome = 'Feminino';
							break;
						}

						$scope.objeto = {};
						Mensagem.success(data.mensagem);

						objeto.id_pessoa_beneficiario = data.id_pessoa_beneficiario;
						objeto.id = data.id;
						$scope.beneficiarios.push(objeto);
						$scope.beneficiario = {}

						$scope.getBeneficiario(idPessoa);
					} else {
						Mensagem.error(data.mensagem);
					}
				})
.error(function(data, status) {
					//log erro
				});
}
});
}

$scope.getCnpj = function(id){
	var cnpj = $("#"+id).val();
	cnpj = cnpj.replace(".", "");
	cnpj = cnpj.replace("/", "");
	cnpj = cnpj.replace("-", "");
	cnpj = cnpj.replace(".", "");

	$http.get('api/index.php/cnpj/'+cnpj)
	.success(function(data, status, headers, config) {
		if(data[0].error == -1){
			$scope.error = data[0].mensagem;

			Mensagem.error(data[0].mensagem);
			SalvarDadosPessoais.disabled=true;
		}else{
			SalvarDadosPessoais.disabled=false;
		}
	})
	.error(function(data, status, headers, config) {
			// log error
		});
}

	// Disable weekend selection
	$scope.toggleMin = function() {
		$scope.minDate = $scope.minDate ? null : new Date();
	};

	$scope.toggleMin();
	$scope.disabled = undefined;

	$scope.enable = function() {
		$scope.disabled = false;
	};

	$scope.disable = function() {
		$scope.disabled = true;
	};

	$scope.clear = function() {
		$scope.socio.selected = undefined;
	};

	$scope.refreshSocios = function(objeto) {
		var params = {objeto: objeto, sensor: false};
		if (objeto.length < 0) {
			objeto = "a";
		};
		return $http.get('api/index.php/stringpessoa?&string='+objeto, {params: params})
		.then(function(response) {
			$scope.socios = response.data['pessoa']
		});
	};

	$scope.salvarSocios = function(item) {
		item.id_pessoa = $scope.contrib.id_pessoa;
		$scope.json = angular.toJson(item);
		$http.post('api/index.php/socio/', $scope.json,
			{withCredentials: true,
				headers: {'enctype': 'multipart/form-data' },
				// transformRequest: angular.identity
			})
		.success(function(data, status, headers, config) {
			if ($scope.sociosSel.length > 0) {
				$scope.sociosSel.forEach(function(items) {
					var itemMatches = false;
					if (items.id != item.id) {
						$scope.sociosSel.push(item);
					};
				});
			} else {
				$scope.sociosSel.push(item);
			}
		})
		.error(function(data, status, headers, config) {
			// log error
		});
	}

	$scope.excluirSocios = function(indexEl, item) {
		$scope.json = angular.toJson(item);
		$http.post('api/index.php/delsocio/', $scope.json,
			{withCredentials: true,
				headers: {'enctype': 'multipart/form-data' },
				// transformRequest: angular.identity
			})
		.success(function(data, status, headers, config) {
			$scope.sociosSel.splice(indexEl, 1);
		})
		.error(function(data, status, headers, config) {
			// log error
		});
	}

	$scope.setarCodigoPessoaIndicador = function(item) {
		$scope.pessoa.id_pessoa_indicador = item.id;
	}

	$scope.setarTipoEventoSelecionado = function(item, select) {
		if(item.length > 0){
			var nivel = item.length - 1;
			if(item[nivel].id == -1){
				$('#myModalTipoEvento').modal('show');
				select.removeChoice(nivel);
			}else{
				$scope.pessoa.tipoeventoselecionado = item;
			}
		}
	}

	$scope.adicionarTipoEvento = function() {
		if ($('#cadastroTipoEvento-form').valid()) {
			$scope.addTipoEvento.ativo = 1;
			$scope.addTipoEvento.tipo = 'Eventos';
			$scope.json = angular.toJson($scope.addTipoEvento);
			$http.post('api/index.php/tipoevento/', $scope.json,
				{withCredentials: true,
					headers: {'enctype': 'multipart/form-data' },
				})
			.success(function(data, status, headers, config) {
				if (data.error == '0'){
					Mensagem.success(data.mensagem);
					$('#myModalTipoEvento').modal('hide');
					var novoTipo = {};
					novoTipo.id = data.id_tipoevento;
					novoTipo.descricao = $scope.addTipoEvento.descricao;
					novoTipo.tipo = $scope.addTipoEvento.tipo;
					$scope.tipoevento.push(novoTipo);
					$scope.addTipoEvento = {};
				} else {
					Mensagem.error(data.mensagem);
				}
			})
			.error(function(data, status) {
				//log erro
			});
		}
	}

	$scope.refreshTipoEvento = function(pessoa) {
		$scope.tipoeventos = [];
		$scope.tipoeventos.selecionados = [];
		//$scope.tipoeventos.selecionados.splice(nivel, 1);
		$http.get('api/index.php/stringtipoevento').success(function(data, status, headers, config) {
			if(data[0].error != -1){
				$scope.tipoevento = data;
				angular.forEach(data, function(value, key) {
					angular.forEach(pessoa, function(value2, key2) {
						if(value.id == value2.id){
							$scope.tipoeventos.selecionados.push(data[key]);
						}
					});
				});
			}
		})
		.error(function(data, status, headers, config) {
			// log error
		});
	};

	$scope.verificarAcao = function(item) {
		if (item.id==-1) {
			$scope.modalNovoTipoFornecedor();
			$scope.tipofornecedor.selected = '';
		}
		$scope.pessoa.id_tipo_fornecedor = item.id;
		$( "em[for='tipofornecedor']" ).css("display","none");
	}

	$scope.modalNovoTipoFornecedor = function(size){
		$('#myModalTipoFornecedor').modal('show');
	}

	$scope.adicionarTipoFornecedor = function(){
		if ($('#cadastroTipoFornecedor-form').valid()) {
			$scope.addTipoFornecedor.ativo = 1;
			$scope.json = angular.toJson($scope.addTipoFornecedor);
			$http.post('api/index.php/tipofornecedor/', $scope.json,
				{withCredentials: true,
					headers: {'enctype': 'multipart/form-data' },
				})
			.success(function(data, status, headers, config) {
				if (data.error == '0'){
					Mensagem.success(data.mensagem);

					$('#myModalTipoFornecedor').modal('hide');
					$scope.getTipoFornecedor();
					$scope.addTipoFornecedor = {};
				}else{
					Mensagem.error(data.mensagem);
				}
			}).error(function(data, status) {
				//log erro
			});
		}
	}

	$scope.modalNovoCategoria = function(size){
		$('#myModalCategoria').modal('show');
	}

	$scope.adicionarCategoria = function(){
		if ($('#cadastroCategoria-form').valid()) {
			$scope.addCategoria.ativo = 1;
			$scope.addCategoria.tipo = 1;
			$scope.json = angular.toJson($scope.addCategoria);
			$http.post('api/index.php/categorianaoassociado/', $scope.json,
				{withCredentials: true,
					headers: {'enctype': 'multipart/form-data' },
				})
			.success(function(data, status, headers, config) {
				if (data.error == '0'){
					Mensagem.success(data.mensagem);
					$('#myModalCategoria').modal('hide');
					$scope.getCategoriaNaoAssociado();
					$scope.addCategoria = {};
				} else {
					Mensagem.error(data.mensagem);
				}
			}).error(function(data, status) {
				//log erro
			});
		}
	}

	//Calendario
	$scope.open = function($event,opened) {
		$event.preventDefault();
		$event.stopPropagation();

		$scope[opened] = true;
	};

	//Início - Métodos de verificação de itens
	//Validar datas
	$scope.$watch('pessoa.data_associacao', function(){
		$scope.pessoa.data_associacao1 = $scope.pessoa.data_associacao;
		if($scope.pessoa.data_associacao1 != undefined || $scope.pessoa.data_associacao1 != null){
			$( "em[for='dataAssociacao']" ).css("display","none");
		}
	});

	$scope.$watch('pessoa.data_nascimento', function(){
		$scope.pessoa.data_nascimento1 = $scope.pessoa.data_nascimento;
		if($scope.pessoa.data_nascimento1 != undefined || $scope.pessoa.data_nascimento1 != null){
			$( "em[for='dataNascimento']" ).css("display","none");
		}
	});

	$scope.$watch('beneficiario.data_nascimento', function(){
		$scope.beneficiario.data_nascimento1 = $scope.beneficiario.data_nascimento;
		if($scope.beneficiario.data_nascimento1 != undefined || $scope.beneficiario.data_nascimento1 != null){
			$( "em[for='dataNascimentoBeneficiario']" ).css("display","none");
		}
	});

	$scope.$watch('pessoaLaudo.data_cadastro', function(){
		$scope.pessoaLaudo.data_cadastro1 = $scope.pessoaLaudo.data_cadastro;
		if($scope.pessoaLaudo.data_cadastro1 != undefined || $scope.pessoaLaudo.data_cadastro1 != null){
			$( "em[for='data_cadastro']" ).css("display","none");
		}
	});

	$scope.$watch('pessoa.id_tipo_pessoa', function(){
		$scope.pessoaLaudo.id_pessoa_assistente = '';
		$scope.assistente.selected = '';
	});

	//$scope.$watch('pessoa.tipo_fornecedor', function(){
	//  if($scope.pessoa.tipo_fornecedor != undefined || $scope.pessoa.tipo_fornecedor != null){
	//    $( "em[for='tipo_fornecedor']" ).css("display","none");
	//  }
	//});

	//Fim- Métodos de verificação de itens

	//Inicializa Combos
	$scope.getCategoriaNaoAssociado(); 	
	$scope.getEstadoCivil(); 			
	$scope.getTipoBeneficiario(); 		
	$scope.getPapel(); 					
	$scope.getFonteCaptacao(); 			
	$scope.getCampanha(); 				
	$scope.getTipoFornecedor(); 		
	$scope.getDepartamento(); 			
	$scope.getIndicador(); 				
	$scope.getFormaTratamento();

	//Se houver pessoa, carrega pessoa
	if (idPessoa != undefined) {
		$timeout(function() {
			$scope.getIdPessoa(idPessoa);
			$scope.getContribuicao(idPessoa);
			$scope.getBeneficiario(idPessoa);
		}, 800);
		$scope.getLaudo(idPessoa);
	};
});