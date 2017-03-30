smartSig.registerCtrl("formCadastroDonatario", function($scope, $http, $routeParams, Mensagem, $timeout, $rootScope, $location, $modal, Permissao){
	$scope.permissoes = Permissao.validaPermissao();

	$scope.permissoes.then(function (data) {
		$scope.permissoes = data;
	}, function (status) {
		console.log('status',status);
	});

	// [] array
	// {} objeto
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
	// /INICIALIZAÇÃO DE VARIÁVEIS DO AMBIENTE

	// SETA O ID DO CADASTRO DE PESSOA
	var idPessoa = $routeParams.id;
	// SETA O TIPO DE CADASTRO DA PESSOA
	$routeParams.tipo = '4';
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
			$scope.beneficiario.id_pessoa = data.pessoa[0].id;
			$scope.endereco = data.pessoa[0].endereco.endereco[0];

			if ($scope.endereco!=undefined) {
				$scope.endereco.id_pessoa = data.pessoa[0].id;
				$scope.getCep();
			} else {
				$scope.endereco = {};
				$scope.endereco.id_pessoa = data.pessoa[0].id;
			}

			if (data.pessoa[0].beneficiarios[0].error != -1) {
				$scope.beneficiarios = data.pessoa[0].beneficiarios;
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

			$scope.pessoa.data_nascimento += 'T12:00:00';			
			$scope.pessoa.antecedente_criminal = data.pessoa[0].antecedente_criminal;

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

				console.log("Ricardo",data);

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

	$scope.getLaudo = function(id){
		$http.get('api/index.php/laudo/'+id)
		.success(function(data, status, headers, config) {
			if(data.error != -1){
				$scope.pessoaLaudo = data.laudo;
				$scope.assistente = {selected : {"id":$scope.pessoaLaudo.id_pessoa_assistente,"nome":$scope.pessoaLaudo.pessoa_assistente}};
			}
		})
		.error(function(data, status, headers, config) {
			// log error
		});
	}	

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

	$scope.getPaises = function(){
		$http.get('api/index.php/pais').
		success(function(data, status, headers, config) {
			if(data.error != -1){
				$scope.paises = data.paises;
			}
		}).
		error(function(data, status, headers, config) {
			// log error
		});
	}

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

	$scope.getTipoBeneficiario = function(){
		$http.get('api/index.php/tipobeneficiario/').
		success(function(data, status, headers, config) {
			if(data.error != -1){
				$scope.tipos_beneficiario = data;
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

	$scope.getCidade = function(nome){
		angular.forEach($scope.estados, function(value, key) {
			if(nome == value.nome){
				$scope.cidades = $scope.estados[key].cidades;
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

	// /CARREGA DADOS




	// ONCHANGE NOS SELECT
	$scope.changeTipoTelefone = function(item) {
		$scope.addTelefone.id_tipo_telefone = item.id;
		$( "em[for='tipo_telefone']" ).css("display","none");
	}	

	$scope.verificarAssistenteSocial = function(item) {
		$scope.pessoaLaudo.id_pessoa_assistente = item.id;
		$( "em[for='assistente']" ).css("display","none");
	}
	// /ONCHANGE NOS SELECT

	// CADASTRANDO DADOS
	$scope.cadastrarPessoa = function() {
		if ($('#cadastroDonatario-form').valid()) {
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
					$scope.beneficiario.id_pessoa = data.id_pessoa;
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

	
	$scope.cadastrarLaudo = function(){
		if ($('#cadastroLaudo-form').valid()) {
			SalvarLaudo.disabled = true;
			$scope.pessoaLaudo.id_pessoa = idPessoa;
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
		$.SmartMessageBox(
			{
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

						Mensagem.success(data.mensagem);

						objeto.id_pessoa_beneficiario = data.id_pessoa_beneficiario;
						objeto.id = data.id;
						$scope.beneficiarios.push(objeto);
						$scope.beneficiario = {}
						$scope.objeto = {};
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
	// /CADASTRANDO DADOS




	// LIMPAR
	$scope.limparLaudo = function(){
		$scope.pessoaLaudo = {};
		$scope.pessoaLaudo.status = 0;
		$scope.assistente.selected = '';
	}

	$scope.limparPessoa = function(){
		$scope.id_tipo_pessoa_default = $scope.pessoa.id_tipo_pessoa;
		$scope.pessoa = {};
		$scope.pessoa.id_tipo_pessoa = $scope.id_tipo_pessoa_default;
	}
	// /LIMPAR




	// DELETA REGISTROS
	$scope.delBeneficiario = function(indexEl){
		$scope.json = angular.toJson($scope.beneficiarios[indexEl]);
		$http.post('api/index.php/delbeneficiario/', $scope.json,
			{withCredentials: true,
				headers: {'enctype': 'multipart/form-data' },
			})
		.success(function(data, status, headers, config) {
			$scope.beneficiarios.splice(indexEl, 1);
			Mensagem.success(data.mensagem);
		})
		.error(function(data, status, headers, config) {
			Mensagem.error('Erro na exclusão de dependente');
		});
	}

	$scope.excluirSocios = function(indexEl, item) {
		$scope.json = angular.toJson(item);
		$http.post('api/index.php/delsocio/', $scope.json,
			{withCredentials: true,
				headers: {'enctype': 'multipart/form-data' },
			})
		.success(function(data, status, headers, config) {
			$scope.sociosSel.splice(indexEl, 1);
			Mensagem.success(data.mensagem);
		})
		.error(function(data, status, headers, config) {
			// log error
		});
	}

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
		$location.path('/forms/formCadastroDonatario');
	}
	//$scope.novoCadastro = function(){
	//	$scope.pessoa.nome = '';
	//	$scope.cadastroAssociado.$setPristine();
	//}
	// /BUSCA PESSOA




	// UPLOADS
	$scope.armazenaFile = function(files) {
		$scope.files = files;
		//$('#documento_cpf').val(files[][]);
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

    $scope.voltarTela = function(id){
      $location.path('/consulta/consultaDonatario');
    }


	// CALENDARIO
	$scope.open = function($event,opened) {
		$event.preventDefault();
		$event.stopPropagation();

		$scope[opened] = true;
	};
	// /CALENDARIO




	// VALIDAR DATAS

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

	$scope.dateOptions = {
		formatYear: 'yy',
		startingDay: 1,
		language: 'pt-BR',
	};
	// /VALIDAR DATAS




	// INICIALIZA COMBOS
	$scope.getEstadoCivil();
	$scope.getTipoTelefone();
	$scope.getTipoBeneficiario();
	// /INICIALIZA COMBOS




	// SE HOUVER PESSOA, CARREGA PESSOA
	if (idPessoa != undefined) {
		$timeout(function() {
			$scope.getTelefone(idPessoa);
			$scope.getBeneficiario(idPessoa);
			$scope.getLaudo(idPessoa);
			$scope.getIdPessoa(idPessoa);
			$scope.alterar = 1;		
		}, 3200);
		
	};
});

//@ sourceURL=controller.formCadastroDonatario.js
