smartSig.registerCtrl("formCadastroFornecedor", function($scope, $http, $routeParams, Mensagem, $timeout, $rootScope, $location, $modal, Permissao){
	$scope.permissoes = Permissao.validaPermissao();

	$scope.permissoes.then(function (data) {
		$scope.permissoes = data;
	}, function (status) {
		console.log('status',status);
	});

	// INICIALIZAÇÃO DE VARIÁVEIS DO AMBIENTE
	$scope.initDate = new Date();
	$scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd/MM/yyyy', 'shortDate'];
	$scope.format = $scope.formats[2];
	$scope.endereco = {};
	$scope.pessoas = [];
	$scope.pessoa = {};
	$scope.paises = {};
	$scope.estados = {};
	$scope.cidades = {};
	$scope.estados_civil = {};
	$scope.contrib = {};
	$scope.contribuicoes = [];
	$scope.addContrib = {};
	$scope.tipos_beneficiario = {};
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
	$scope.socios = [];
	$scope.sociosSel = [];
	$scope.departamentos = [];
	$scope.tipofornecedor = [];
	$scope.tipos_fornecedor = [];
	$scope.categoria = [];
	$scope.categorias = [];
	$scope.pessoaLaudo = {};
	$scope.addTelefone = {};
	$scope.pessoaLaudo.status = 0;
	$scope.assistente = [];
	$scope.objeto = [];
	$scope.formas_tratamento = [];
	$scope.pronome_tratamento = false;
	$scope.documento = true;
	$scope.tipos_evento = [];
	$scope.tiposeventos = [];
	$scope.tiposeventos.selecionados = [];
	$scope.tipos_telefone = [];
	$scope.tipo_telefone = {};
	$scope.telefones = [];
	$scope.fontes_captacao = [];
	$scope.papeis = [];
	$scope.campanhas = [];
	$scope.beneficiario.id_pessoa = '';
	$scope.contrib = [];
	$scope.contrib.id_pessoa = '';
	$scope.socio = [];
	$scope.socio.id_pessoa = '';
	$scope.endereco.id_pessoa = '';

	$scope.tipotelefone = [];

	// /INICIALIZAÇÃO DE VARIÁVEIS DO AMBIENTE



	// SETA O ID DO CADASTRO DE PESSOA
	var idPessoa = $routeParams.id;
	// SETA O TIPO DE CADASTRO DA PESSOA
	$routeParams.tipo = '7';
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




	// DATE FUNCTIONS
	$scope.tratarData = function(data){
		var new_data = '';
		if(data != null && data != undefined){
			new_data = data.split("-");
			new_data = new_data[2] +'/'+ new_data[1] +'/'+ new_data[0];
		}
		return new_data;
	}

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
	// /DATE FUNCTIONS




	// BUSCA DADOS DA PESSOA PASSADA
	$scope.getIdPessoa = function(idPessoa){
		$http.get('api/index.php/pessoa/'+idPessoa)
		.success(function(data, status, headers, config) {
			$scope.updatePessoa = 1;
			$scope.pessoa = data.pessoa[0];
			$scope.endereco = data.pessoa[0].endereco.endereco[0];

			if ($scope.endereco!=undefined) {
				$scope.endereco.id_pessoa = data.pessoa[0].id;
				$scope.getCep();
			} else {
				$scope.endereco = {};
				$scope.endereco.id_pessoa = data.pessoa[0].id;
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

			$scope.tipofornecedor = {selected : {"id":$scope.pessoa.id_tipo_fornecedor,"descricao":$scope.pessoa.tipo_fornecedor}};
			$scope.pessoa.tipofornecedor = $scope.pessoa.id_tipo_fornecedor;

		})
		.error(function(data, status, headers, config) {
			// log error
		});
	}
	// /BUSCA DADOS DA PESSOA PASSADA



	// CARREGA DADOS
	$scope.getCep = function(){
		$http.get('api/index.php/cep/'+$scope.endereco.cep)
		.success(function(data, status, headers, config) {
			if(data[0].error == -1){
				//$scope.error = data[0].mensagem;
				//Mensagem.error(data[0].mensagem);
			}
			var idPessoa = $scope.endereco.id_pessoa;
			$scope.endereco.cep = data[0].endereco.cep;
			$scope.endereco.logradouro = data[0].endereco.logradouro;
			$scope.endereco.bairro = data[0].endereco.bairro;
			$scope.endereco.estado = data[0].endereco.estado;
			$scope.endereco.cidade = data[0].endereco.cidade;
			$scope.endereco.idPais = data[0].endereco.idPais;
			$scope.endereco.id_pessoa = idPessoa;
			$scope.estados = data[0].estados;
			angular.forEach(data[0].estados, function(value, key) {
				if($scope.endereco.estado == value.uf){
					$scope.cidades = data[0].estados[key].cidades;
				}
			});

			$scope.paises = data[0].pais;
		})
		.error(function(data, status, headers, config) {
			// log error
		});
	}

	$scope.getTelefone = function(idPessoa) {
		$http.get('api/index.php/telefone/'+idPessoa).
		success(function(data, status, headers, config) {
			if(data.error != -1){
				$scope.telefones = data;
			}
		}).
		error(function(data, status, headers, config) {
			// log error
		});
	}

	$scope.getTipoTelefone = function() {
		$http.get('api/index.php/tipotelefone/').
		success(function(data, status, headers, config) {
			if(data.error != -1){
				$scope.tipos_telefone = data.tipo_telefone;
			}
		}).
		error(function(data, status, headers, config) {
			// log error
		});
	}

	$scope.getCpf = function(id){
		var cpf = $("#"+id).val();
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

	$scope.getPaises = function(){
		$http.get('api/index.php/pais').
		success(function(data, status, headers, config) {
			if(data.error != -1){
				$scope.paises = data;
			}
		}).
		error(function(data, status, headers, config) {
			// log error
		});
	}

	$scope.getPaises();
	

	$scope.getEstado = function(){
		$http.get('api/index.php/estado/')
		.success(function(data, status, headers, config) {                           
			//$scope.cidades = data;
			$scope.estados = data;
		})
		.error(function(data, status, headers, config) { });
	}

	$scope.getEstado();

	$scope.getEstadoCivil = function(){
		$http.get('api/index.php/estadocivil/').
		success(function(data, status, headers, config) {
			if(data.error != -1){
				$scope.estados_civil = data.estado_civil;
			}
		}).
		error(function(data, status, headers, config) {
			// log error
		});
	}

	$scope.getTipoFornecedor = function(){
		$http.get('api/index.php/tipofornecedor/0/').
		success(function(data, status, headers, config) {
			if(data.error != -1){
				$scope.tipos_fornecedor = data.tipofornecedor;
			}
		}).
		error(function(data, status, headers, config) {
			// log error
		});
	}

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

	$scope.getCidade = function(uf){
		$http.get('api/index.php/cidade/'+uf)
		.success(function(data, status, headers, config) {                           
			$scope.cidades = data;
		})
		.error(function(data, status, headers, config) { });
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

	$scope.changeTipoTelefone = function(item) {
		$scope.addTelefone.id_tipo_telefone = item.id;
		$( "em[for='tipotelefone']" ).css("display","none");
	}

	$scope.verificarAcao = function(item) {
		if (item.id==-1) {
			$scope.modalNovoTipoFornecedor();
			$scope.tipofornecedor.selected = '';
		}
		$scope.pessoa.id_tipo_fornecedor = item.id;
		$( "em[for='tipofornecedor']" ).css("display","none");
	}
	// /ONCHANGE NOS SELECT




	// MODALS
	$scope.modalNovoTipoFornecedor = function(size){
		$('#myModalTipoFornecedor').modal('show');
	}
	// /MODALS




	// CADASTRANDO DADOS
	$scope.cadastrarPessoa = function() {
		if ($('#cadastroFornecedor-form').valid()) {
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
					$scope.pessoa.id_tipo_pessoa = tpPessoa;
					$scope.endereco.id_pessoa = data.id_pessoa;
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

	$scope.cadastrarTelefonePessoa = function(objeto, pessoa) {
		if ($('#cadastroTelefone-form').valid()) {
			$scope.addTelefone.id_pessoa = $scope.pessoa.id;
			$scope.json = angular.toJson($scope.addTelefone);
			$http.post('api/index.php/telefone/', $scope.json,
				{withCredentials: true,
					headers: {'enctype': 'multipart/form-data' },
				})
			.success(function(data, status, headers, config) {
				if (data.error == '0'){
					Mensagem.success(data.mensagem);
					$scope.getTelefone($scope.pessoa.id);
					$scope.addTelefone = {};
					$scope.addTelefone.id_tipo_telefone = '';
					$scope.tipotelefone.selected='';
				}else{
					Mensagem.error(data.mensagem);
				}
			}).error(function(data, status) {
				// log error
			});
		}
	}

	$scope.cadastrarEnderecoPessoa = function(objeto,idTipoEndereco) {
		if ($scope.endereco.id_pessoa==undefined){
			Mensagem.error('Por favor, é necessário cadastrar os dados pessoais primeiro.');
			return;
		}

		if ($('#cadastroAssociado-Endereco-form').valid()) {
			SalvarEndereco.disabled = true;
			objeto.idTipoEndereco = idTipoEndereco;
			$scope.endereco.ativo = 1;
			$scope.json = angular.toJson($scope.endereco);
			$http.post('api/index.php/endereco/', $scope.json,
				{withCredentials: true,
					headers: {'enctype': 'multipart/form-data'
				}
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
	// /CADASTRANDO DADOS




	// LIMPAR	
	$scope.limparPessoa = function(){
		$scope.id_tipo_pessoa_default = $scope.pessoa.id_tipo_pessoa;
		$scope.pessoa = {};
		$scope.pessoa.id_tipo_pessoa = $scope.id_tipo_pessoa_default;
	}
	// /LIMPAR




	// DELETA REGISTROS
	$scope.excluirTelefone = function(indexEl, item) {
		$scope.json = angular.toJson(item);
		$http.post('api/index.php/deltelefone/', $scope.json,
			{withCredentials: true,
				headers: {'enctype': 'multipart/form-data' },
			})
		.success(function(data, status, headers, config) {
			$scope.telefones.splice(indexEl, 1);
			Mensagem.success(data.mensagem);
		})
		.error(function(data, status, headers, config) {
			// log error
		});
	}
	// /DELETA REGISTROS




	// BUSCA PESSOA
	$scope.passaPessoa = function(item, model, label){
		$scope.getIdPessoa(item.id);
	}

	$scope.novoCadastro = function(){
		$location.path('/forms/formCadastroFornecedor/1');
	}
	// /BUSCA PESSOA




	// UPLOADS
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

	$scope.updateTelefoneAtivo = function(id) {
		$http.post('api/index.php/updatetelefoneativo/' + id).
		success(function(data, status, headers, config) {
			if (data.error == 0) {
				Mensagem.success(data.mensagem);
			}
		}).
		error(function(data, status, headers, config) {
			Mensagem.error(data.mensagem);
			// log error
		});
	}

	$scope.updateTelefonePrincipal = function(id) {
		$http.post('api/index.php/updatetelefoneprincipal/' + id).
		success(function(data, status, headers, config) {
			if (data.error == 0) {
				Mensagem.success(data.mensagem);
			}
		}).
		error(function(data, status, headers, config) {
			Mensagem.error(data.mensagem);
			// log error
		});
	}
	// /UPLOADS




	// CALENDARIO
	$scope.open = function($event,opened) {
		$event.preventDefault();
		$event.stopPropagation();

		$scope[opened] = true;
	};
	// /CALENDARIO




	// VALIDAR DATAS
	$scope.dateOptions = {
		formatYear: 'yy',
		startingDay: 1,
		language: 'pt-BR',
	};
	// /VALIDAR DATAS




	// INICIALIZA COMBOS
	$scope.getTipoFornecedor();
	$scope.getTipoTelefone();
	// /INICIALIZA COMBOS




	// SE HOUVER PESSOA, CARREGA PESSOA
	if (idPessoa != undefined) {
		$timeout(function() {
			$scope.getIdPessoa(idPessoa);
			$scope.getTelefone(idPessoa);
		}, 800);
	};

});