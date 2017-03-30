smartSig.registerCtrl("formCadastroFuncionarioEscola", function($scope, $http, $routeParams, Mensagem, $timeout, $rootScope, $location, $modal, $filter, Permissao){

	$scope.permissoes = Permissao.validaPermissao();

	$scope.permissoes.then(function (data) {
		$scope.permissoes = data;
	}, function (status) {
	});

	var idPessoa = $routeParams.id;

	$scope.pessoa = {};
	$scope.error = ''; 
	$scope.pessoa.ativo = 1; 
    $scope.pessoa.forma_pagamento = 1; 
    
    $scope.forma_pagamento = ($scope.pessoa.forma_pagamento==1) ? 'Mensal' : ' Hora';

	$scope.pessoa.nome_title = "Novo Cadastro";

	$scope.endereco = {};

    // objetos que são usado em combos dinâmicos
    $scope.religiao = {};
    $scope.religioes = [];
    $scope.orgaoemissor = {};
    $scope.orgaosemissores = [];
    $scope.tipoendereco = {};
    $scope.tiposenderecos = [];
    $scope.tipotelefone = {};
    $scope.tipostelefones = [];
    $scope.papeis = [];
    $scope.tipofuncionario = {};
    $scope.tipofuncionarios = [];
    $scope.funcao = {};
    $scope.funcoes = [];
    $scope.addFuncao = {};
    $scope.responsavel = {};
    $scope.telefone = {};
    $scope.filesDocumentoCpf = '';
    $scope.filesDocumentoRg = '';
    
    $scope.mascara = '';

    // objetos adicionais dos dados do funcionario
    $scope.enderecos = {};
    $scope.telefones = {};
    $scope.telefone_numero_class = "col-xs-12 col-sm-12 col-md-8 col-lg-8";
    $scope.telefone_ramal_class = "";
    $scope.pessoa_sem_login_class = "col col-xs-12 col-sm-12 col-md-4 col-lg-4";

    if ( idPessoa > 0 ){
    	$scope.pessoa_sem_login_class = "col col-xs-12 col-sm-12 col-md-3 col-lg-3";
    }


//Início - Métodos utilizados em várias abas **************************************************************************************
    //Início - carga de dados dos combo box

    $scope.tipo_pagto=' Mensal';

    $scope.mudarTipo = function(val){
        $scope.tipo_pagto = (val==0) ? ' Hora' : ' Mensal';
    }

    $scope.getEstadoCivil = function(){
    	$http.get('api/index.php/estadocivil/').
    	success(function(data, status, headers, config) {
    		$scope.estadocivil = data.estado_civil;
    	}).
    	error(function
    		(data, status, headers, config) {
        // log error
    }); 
    }

    $scope.getPais = function(){
    	$http.get('api/index.php/pais').
    	success(function(data, status, headers, config) {
    		$scope.pais = data;
    	}).
    	error(function(data, status, headers, config) {
          // log error
      });       
    }      

    $scope.getEstado = function(){
    	$http.get('api/index.php/estado/').    
    	success(function(data, status, headers, config) {
    		$scope.estado = data;
    	}).
    	error(function(data, status, headers, config) {
          // log error
      });
    }

    $scope.getCidade = function(nome){

    	angular.forEach($scope.estado, function(value, key) {
    		if(nome == value.uf){
    			$scope.cidades = $scope.estado[key].cidades;
    		}
    	});
    }

    //Busca lista de tipos de papeis
    $scope.getPapel = function(){
    	$http.get('api/index.php/papel/').
    	success(function(data, status, headers, config) {          
    		$scope.papeis = $filter('filter')(data, {'id_tipo_entidade': $scope.entidadeLogada});
    	}).
    	error(function(data, status, headers, config) {
          // log error
      });
    }

    //Busca lista de tipos de funcionario
    $scope.getTipoFuncionario = function(){
    	$http.get('api/index.php/tipofuncionario/0').
    	success(function(data, status, headers, config) {
    		$scope.tipofuncionarios = data['tipofuncionario'];
    	}).
    	error(function(data, status, headers, config) {
          // log error
      });
    }

    //Busca lista de funçãotipos de funcionario
    $scope.getTiposFuncionario = function(){
    	$http.get('api/index.php/tipofuncionario/1/').
    	success(function(data, status, headers, config) {

    		$scope.tiposfuncionario = data.tipofuncionario;

    	}).
    	error(function(data, status, headers, config) {
        // log error
    });
    };

    $scope.getFuncao = function(){
    	$http.get('api/index.php/funcao/0/').
    	success(function(data, status, headers, config) {
    		$scope.funcoes = data['funcao'];

    		console.log('Funcao', $scope.funcoes);
    	}).
    	error(function(data, status, headers, config) {
          // log error
      });
    }

    $scope.filtroFuncao = function(item){
    	return function(item) {
    		if($scope.pessoa.id_tipo_funcionario == item.id_tipo_funcionario || item.id == '-1'){
    			return item;
    		}
    	}
    }
    //Fim - carga de dados dos combo box

    // Funcionalidade para buscar listagem da pessoa que esta sendo digitada
    $scope.getPessoaExists = function(val) {
    	return $http.get('api/index.php/stringpessoa?todos=1&', {
    		params: {
    			string: val,
    			sensor: false
    		}
    	}).then(function(response){
    		return response.data.pessoa;
    	});
    };

    //busca um id no array de objetos passados e retorna o objeto
    $scope.findItem = function(id_find, array_list) {
      //procura o item na lista
      var found = $filter('filter')(array_list, {id: id_find}, true);
      var returnValue;
      //se encontrou retorna o objeto
      if (found.length) {
      	returnValue = found[0];
      } else {
      	returnValue = false;
      }
      return returnValue;
  }
//Fim - Métodos utilizados em várias abas **************************************************************************************



//Início - Aba 1 - Dados do aluno **************************************************************************************
    //Início - carga de dados dos combo box
    $scope.getReligiao = function(){
    	$http.get('api/index.php/religiao/0/').
    	success(function(data, status, headers, config) {
    		$scope.religioes = data.religiao;
    	}).
    	error(function(data, status, headers, config) {
          // log error
      });
    }

    $scope.getOrgaoEmissor = function(){
    	$http.get('api/index.php/orgaoemissor/0/').
    	success(function(data, status, headers, config) {
    		$scope.orgaosemissores = data['orgaoEmissor'];
    	}).
    	error(function(data, status, headers, config) {
          // log error
      });
    }
    //Fim - carga de dados dos combo box


    //Início - carga de dados dos combos de cadastro dinâmicos
    //Início - módulo de religião 
    $scope.verificarAcaoReligiao = function(item) {
    	if (item.id==-1) {
        $scope.modalNovoReligiao(); //chana apresentação do modal
        $scope.religiao.selected = ''; //seleciona nenhuma religião
    }
      $scope.pessoa.id_religiao = item.id; //seta o id da religião no campo de religiao da pessoa
      //$( "em[for='religiao']" ).css("display","none"); //não deixa apresentar o campo
  }

    $scope.modalNovoReligiao = function(size){ //apresenta modal de religiao
    	$('#myModalReligiao').modal('show');
    }

    $scope.adicionarReligiao = function(){ //objeto para salvar dados da religião
      if ($('#cadastroReligiao-form').valid()) {//valida formulário
        $scope.addReligiao.ativo = 1; //seta o campo ativo como true
        $scope.json = angular.toJson($scope.addReligiao); // transforma o objeto addReligiao para json
        $http.post('api/index.php/religiao/', $scope.json, //envia para a api os dados para cadastro da religião
        	{withCredentials: true,
        		headers: {'enctype': 'multipart/form-data' },
        	}
        ).success(function(data, status, headers, config) { //em caso de sucesso faça o seguinte
            if (data.error == '0'){ // retornou sem erro
              Mensagem.success(data.mensagem); // seta mensagem de sucesso
              $('#myModalReligiao').modal('hide'); // esconde a modal de cadastro
              $scope.getReligiao(); //busca a lista de religião novamente
              $scope.addReligiao = {}; // limpa o objeto addReligiao
            }else{ // retornado com erro
            	Mensagem.error(data.mensagem);
            }
        }).error(function(data, status) {
        });
    }
}
    //Fim - módulo de religião


    //Início - módulo de orgao emissor
    $scope.verificarAcaoOrgaoEmissor = function(item) {
    	if (item.id==-1) {
    		$scope.modalNovoOrgaoEmissor();
    		$scope.orgaoemissor.selected = '';
    	}
    	$scope.pessoa.id_orgao_rg_emissor = item.id; 
    }

    $scope.modalNovoOrgaoEmissor = function(size){
    	$('#myModalOrgaoEmissor').modal('show');
    }

    $scope.adicionarOrgaoEmissor = function(){
    	if ($('#cadastroOrgaoEmissor-form').valid()) {
    		$scope.addOrgaoEmissor.ativo = 1;
    		$scope.json = angular.toJson($scope.addOrgaoEmissor);
    		$http.post('api/index.php/orgaoemissor/', $scope.json,
    			{withCredentials: true,
    				headers: {'enctype': 'multipart/form-data' },
    			}
    			).success(function(data, status, headers, config) {
    				if (data.error == '0'){
    					Mensagem.success(data.mensagem);
    					$('#myModalOrgaoEmissor').modal('hide');
    					$scope.getOrgaoEmissor();
    					$scope.addOrgaoEmissor = {};
    				}else{
    					Mensagem.error(data.mensagem);
    				}
    			}).error(function(data, status) {
    			});
    		}
    	}
    //Fim - módulo de orgao emissor

    //Início - módulo de tipo de funcionario
    $scope.verificarAcaoTipoFuncionario = function(item) {
    	$scope.pessoa.id_tipo_funcionario = '';
    	if (item.id == -1) {
    		$scope.modalNovoTipoFuncionario();
    		$scope.tipofuncionario.selected = '';
    		$scope.funcao.selected = '';
    	}else{
    		$scope.pessoa.id_tipo_funcionario = item.id;
    	}
    	$scope.funcao.selected = '';
      //$scope.getFuncao(item.id);
      $( "em[for='tipofuncionario']" ).css("display","none");
  }

  $scope.modalNovoTipoFuncionario = function(size){
  	$('#myModalTipoFuncionario').modal('show');
  }

  $scope.adicionarTipoFuncionario = function(){
  	if ($('#cadastroTipoFuncionario-form').valid()) {
  		$scope.addTipoFuncionario.ativo = 1;
  		$scope.json = angular.toJson($scope.addTipoFuncionario);
  		$http.post('api/index.php/tipofuncionario/', $scope.json,
  			{withCredentials: true,
  				headers: {'enctype': 'multipart/form-data' },
  			}
  			).success(function(data, status, headers, config) {
  				if (data.error == '0'){
  					Mensagem.success(data.mensagem);
  					$('#myModalTipoFuncionario').modal('hide');
  					$scope.getTipoFuncionario();
  					$scope.addTipoFuncionario = {};
  				}else{
  					Mensagem.error(data.mensagem);
  				}
  			}).error(function(data, status) {
  			});
  		}
  	}
    //Fim - módulo de tipo de funcionario

    //Início - módulo de funcao
    $scope.verificarAcaoFuncao = function(item) {
    	if (item.id == -1) {
        //colocar no modal o id do tipo funcionario
        $scope.addFuncao.id_tipo_funcionario = $scope.pessoa.id_tipo_funcionario;
        $scope.modalNovoFuncao();
        $scope.funcao.selected = '';
    }
    $scope.pessoa.id_funcao = item.id; 
    $( "em[for='funcao']" ).css("display","none");
}

$scope.modalNovoFuncao = function(size){
	$('#myModalFuncao').modal('show');
}

$scope.adicionarFuncao = function(){
	if ($('#cadastroFuncao-form').valid()) {
		$scope.addFuncao.ativo = 1;
		$scope.json = angular.toJson($scope.addFuncao);
		$http.post('api/index.php/funcao/', $scope.json,
			{withCredentials: true,
				headers: {'enctype': 'multipart/form-data' },
			}
			).success(function(data, status, headers, config) {
				if (data.error == '0'){
					Mensagem.success(data.mensagem);
					$('#myModalFuncao').modal('hide');

					$scope.getFuncao();

					var item = $filter('filter')($scope.tipofuncionarios, function(item){
						if($scope.addFuncao.id_tipo_funcionario == item.id && item.id != '-1'){
							return item;
						}
					});

					console.log(item);

					$scope.tipofuncionario = {selected:{id: item[0].id, descricao: item[0].descricao}};
					$scope.pessoa.id_tipo_funcionario = item[0].id;

					$scope.addFuncao = {};
				}else{
					Mensagem.error(data.mensagem);
				}
			}).error(function(data, status) {
			});
		}
	}
    //Fim - módulo de funcao


    // FRH - Inicio RG LIXO LIXO LIXO LIXO
    /*
    id_orgao_emissor    $scope.pessoa.id_orgao_rg_emissor
    id_pessoa           idPessoa
    numero              $scope.pessoa.rg
    estado_emissor      $scope.pessoa.estado_rg_emissor
    arquivo             $scope.pessoa.rg_arquivo
    data_emissao        $scope.pessoa.data_rg_emissao
    ativo

    $scope.adicionarRG = function(){
      if ($('#cadastroEndereco-form').valid()) {
        $scope.addRG.ativo = 1;
        $scope.json = angular.toJson($scope.addRG);
        $http.post('api/index.php/postDocumentoPessoa/', $scope.json, {withCredentials: true, headers: {'enctype': 'multipart/form-data' },}
        ).success(function(data, status, headers, config) {
            if (data.error == '0'){
              Mensagem.success(data.mensagem);              
              $scope.addRG = {};
            }else{
              Mensagem.error(data.mensagem);
            }
        }).error(function(data, status) {
        });
      }
    }
    */
    // FRH - Fim RG

    //funcionalidade para cadastrar dados da pessoa
    $scope.cadastrarFuncionario = function(){
    	if ($('#cadastroFuncionario-form').valid()) {
    		SalvarFuncionario.disabled = true;
    		$scope.json = angular.toJson($scope.pessoa);
    		$http.post('api/index.php/funcionarioescola/', $scope.json, 
    			{withCredentials: true,
    				headers: {'enctype': 'multipart/form-data' },
    			}
    			).success(function(data, status, headers, config) {

    				if (data.error == '0')
    				{
    					$scope.pessoa.id = data.id;
    					if ($scope.files != null) {
    						$scope.uploadFile($scope.files, $scope.pessoa.id);
    					};
            //!!!!!!!!! - verificar funcionamento deste cadastro
            if ($scope.filesDocumentoCpf != '' && data.id_documento_cpf > 0) {
            	$scope.uploadFileDocumento($scope.filesDocumentoCpf, data.id_documento_cpf, 'cpf');
            };
            if ($scope.filesDocumentoRg != '' && data.id_documento_rg > 0) {
            	$scope.uploadFileDocumento($scope.filesDocumentoRg, data.id_documento_rg, 'rg');
            };
            $scope.pessoa_sem_login_class = "col col-xs-12 col-sm-12 col-md-3 col-lg-3";
            $scope.pessoa.nome_title = $scope.pessoa.nome;
            $scope.pessoa.login = data.login;
            Mensagem.success(data.mensagem);
        } 
        else {
        	Mensagem.error(data.mensagem);
        }
    }).error(function(data, status) { 
          //log erro
      });
} else{
	Mensagem.error('Por favor, preencha os campos obrigatórios');
}
SalvarFuncionario.disabled = false;
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
		}).success(function(data, status, headers, config) {
			console.log(data);
		}).error(function(data, status) { 
          //log_error
      });
	}
}; 

    //funcionalidade para limpar dados do aluno para novo cadastro de aluno
    $scope.novoCadastroFuncionario = function(){
    	$scope.pessoa = {};
    	$scope.pessoa.nome_title = "Novo Cadastro";
    	$scope.responsavel = {};
    	$scope.telefone = {};
    	$scope.endereco = {};
    	$scope.enderecos = [];
    	$scope.telefones = [];
    	$scope.religiao = {};
    	$scope.orgaoemissor = {};
    	$scope.tipofuncionario = {};
    	$scope.funcao = {};
    	$scope.pessoa.ativo = 1;
    	$scope.pessoa_sem_login_class = "col col-xs-12 col-sm-12 col-md-4 col-lg-4";
    	$location.path('/escolaforms/formCadastroFuncionarioEscola/');
    }


    //funcionalidade para buscar dados do aluno que foi passado o id
    $scope.getIdPessoa = function(idPessoa){

    	$http.get('api/index.php/funcionarioescola/0/'+idPessoa).
    	success(function(data, status, headers, config) {
    		console.log('funcionario = ', data.pessoa[0]);
    		$scope.pessoa = data.pessoa[0];
    		$scope.pessoa.nome_title = $scope.pessoa.nome;

    		$scope.endereco.id_pessoa = $scope.pessoa.id;
    		$scope.telefone.id_pessoa = $scope.pessoa.id;
    		if ( $scope.pessoa.id_tipo_funcionario != '' ){
                if($scope.pessoa.id_religiao == null){
                   $scope.religiao = {}; 
                }
                else{
                  $scope.religiao = {selected : {"id":$scope.pessoa.id_religiao,"descricao":$scope.pessoa.religiao}};  
              }    			
    		}
            else{
    			$scope.religiao = {};
    		}
    		if ( $scope.pessoa.id_tipo_funcionario != '' ){
    			$scope.orgaoemissor = {selected : {"id":$scope.pessoa.id_orgao_rg_emissor, "descricao":$scope.pessoa.orgao_rg_emissor}};
    		} else{
    			$scope.orgaoemissor = {};
    		}
    		if ( $scope.pessoa.id_tipo_funcionario != '' ){
    			$scope.tipofuncionario = {selected : {"id":$scope.pessoa.id_tipo_funcionario, "descricao":$scope.pessoa.tipo_funcionario}};
    		} else{
    			$scope.tipofuncionario = {};
    		}
    		if ( $scope.pessoa.id_funcao != '' ){
    			$scope.funcao = {selected : {"id":$scope.pessoa.id_funcao, "descricao":$scope.pessoa.funcao}};
    		} else {
    			$scope.funcao = {};
    		}
    		if ( $scope.pessoa.estado_nascimento == null ){
    			$scope.pessoa.estado_nascimento = '';
    		}
    		if ( $scope.pessoa.nacionalidade == null ){
    			$scope.pessoa.nacionalidade = '';
    		} else {
    			if ( $scope.pessoa.nacionalidade == 'Brasileira' ){
    				$scope.pessoa.nacionalidade = 'Brasil';
    			}
    		}

    		$scope.getTelefones(idPessoa);
    		$scope.getEnderecos(idPessoa);
    	}).
error(function(data, status, headers, config) {
          // log error
      }); 
}

    // Funcionalidade para buscar dados da pessoa que foi digitada
    $scope.passaPessoa = function(item, model, label){        
    	$scope.getIdPessoa(item.id);
    }

    $scope.armazenaFile = function(files) {
    	$scope.files = files;
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
    		}).success(function(data, status, headers, config) {
    		}).error(function(data, status) { 
    		});
    	}
    }; 

    //método para enviar arquivos
    $scope.armazenaFileDocumentoCpf = function(files) {
    	$scope.filesDocumentoCpf = files;
    }; 

    //método para enviar arquivos
    $scope.armazenaFileDocumentoRg = function(files) {
    	$scope.filesDocumentoRg = files;
    }; 

    //método para verificar se calendário foi alterado
    $scope.$watch('pessoa.data_nascimento', function(){ 
    	$scope.pessoa.data_nascimento1 = $scope.pessoa.data_nascimento;     
    	if($scope.pessoa.data_nascimento1 != undefined || $scope.pessoa.data_nascimento1 != null){    
    		$( "em[for='pessoa_dataNascimento']" ).css("display","none"); 
    	}
    });
    
    //método para verificar se calendário foi alterado
    $scope.$watch('pessoa.data_rg_emissao', function(){ 
    	$scope.pessoa.data_rg_emissao1 = $scope.pessoa.data_rg_emissao;     
    	if($scope.pessoa.data_rg_emissao1 != undefined || $scope.pessoa.data_rg_emissao1 != null){    
    		$( "em[for='data_rg_emissao']" ).css("display","none"); 
    	}
    });

    //método para verificar se calendário foi alterado
    $scope.$watch('pessoa.data_associacao', function(){ 
    	$scope.pessoa.data_associacao1 = $scope.pessoa.data_associacao;     
    	if($scope.pessoa.data_associacao1 != undefined || $scope.pessoa.data_associacao1 != null){    
    		$( "em[for='pessoa_dataAssociacao']" ).css("display","none"); 
    	}
    });

    //método para verificar se calendário foi alterado
    $scope.$watch('pessoa.data_desligamento', function(){ 
    	$scope.pessoa.data_desligamento1 = $scope.pessoa.data_desligamento;     
    	if($scope.pessoa.data_desligamento1 != undefined || $scope.pessoa.data_desligamento1 != null){    
    		$( "em[for='pessoa_dataDesligamento']" ).css("display","none"); 
    	}
    });


//Fim - Aba 1 - Dados do aluno **************************************************************************************



//Início - Aba 2 - Endereços **************************************************************************************
    //Início - carga de dados dos combo box
    $scope.getTipoEndereco = function(){
    	$http.get('api/index.php/tipoendereco/').
    	success(function(data, status, headers, config) {
    		$scope.tiposenderecos = data['tipoEndereco'];          
    	}).
    	error(function(data, status, headers, config) {
          // log error
      });
    }
    //Fim - carga de dados dos combo box


    //Início - carga de dados dos combos de cadastro dinâmicos
    //Início - módulo de tipo de endereço
    $scope.verificarAcaoTipoEndereco = function(item) {
    	if (item.id==-1) {
    		$scope.modalNovoTipoEndereco();
    		$scope.tipoendereco.selected = '';
    	}
    	$scope.endereco.id_tipo_endereco = item.id; 
    }

    $scope.modalNovoTipoEndereco = function(size){
    	$('#myModalTipoEndereco').modal('show');
    }

    $scope.adicionarTipoEndereco = function(){
    	if ($('#cadastroTipoEndereco-form').valid()) {
    		$scope.addTipoEndereco.ativo = 1;
    		$scope.json = angular.toJson($scope.addTipoEndereco);
    		$http.post('api/index.php/tipoendereco/', $scope.json,
    			{withCredentials: true,
    				headers: {'enctype': 'multipart/form-data' },
    			}
    			).success(function(data, status, headers, config) {
    				if (data.error == '0'){
    					Mensagem.success(data.mensagem);
    					$('#myModalTipoEndereco').modal('hide');
    					$scope.getTipoEndereco();
    					$scope.addTipoEndereco = {};
    				}else{
    					Mensagem.error(data.mensagem);
    				}
    			}).error(function(data, status) {
    			});
    		}
    	}
    //Fim - módulo de tipo de endereço
    //Fim - carga de dados dos combos de cadastro dinâmicos


    //Início cadastro e edição de dados adicionais
    //Início cadastro e edição de dados adicionais endereço
    $scope.editarEndereco = function($index) {   
    	angular.copy($scope.enderecos[$index], $scope.endereco);
      $scope.getCidade($scope.endereco.estado); //FRH
      $scope.tipoendereco.selected = {"descricao": $scope.endereco.tipo_endereco};
  }

  $scope.removeLinhaEndereco = function($index){
  	$scope.enderecos[$index].ativo = 0;
  	$scope.json = angular.toJson($scope.enderecos[$index]);
  	$http.post('api/index.php/enderecoaluno/', $scope.json, 
  		{withCredentials: true,
  			headers: {'enctype': 'multipart/form-data' },
  		}
  		).success(function(data, status, headers, config) {
  			if (data.error == '0') {  
  				Mensagem.success(data.mensagem);   
  				$scope.enderecos.splice($index, 1);
  			} 
  			else {
  				Mensagem.error(data.mensagem);   
  			}
  		}).error(function(data, status) { 
          //log
      });
  	}

  	$scope.novoEnderecoAluno = function(){
  		$scope.endereco.cep = "";
  		$scope.endereco.ativo = 1;
  		$scope.endereco.bairro = "";
  		$scope.endereco.principal = "";
  		$scope.endereco.cidade = "";
  		$scope.endereco.complemento = "";
  		$scope.endereco.data_cadastro = "";
  		$scope.endereco.estado = "";
  		$scope.endereco.id = "";
  		$scope.endereco.id_pais = "";
  		$scope.endereco.logradouro = "";
  		$scope.endereco.numero = "";
  		$scope.endereco.observacao = "";
  		$scope.tipoendereco = {};
  	}

  	$scope.cadastrarEnderecoPessoa = function() {
  		if ($scope.pessoa.id==undefined)
  		{
  			Mensagem.error('Por favor, é necessário cadastrar os dados do aluno primeiro.');
  		}
  		else {
  			if ($('#cadastroEndereco-form').valid()) {
  				SalvarEndereco.disabled = true;
  				$scope.endereco.id_pessoa = $scope.pessoa.id;
  				$scope.json = angular.toJson($scope.endereco);
  				$http.post('api/index.php/enderecoaluno/', $scope.json, 
  					{withCredentials: true,
  						headers: {'enctype': 'multipart/form-data' },
                                         // transformRequest: angular.identity
                                     }
                                     ).success(function(data, status, headers, config) {
                                     	if (data.error == '0')
                                     	{  
                                     		Mensagem.success(data.mensagem);
                                     		$scope.getEnderecos($scope.pessoa.id);
                                     		$scope.novoEnderecoAluno();
                                     	}
                                     	else
                                     	{
                                     		Mensagem.error(data.mensagem);
                                     	}
                                     }).error(function(data, status) { 
            //log erro
        });
                                 } else {
                                 	Mensagem.error('Por favor, preencha os campos obrigatórios');
                                 }
                                 SalvarEndereco.disabled = false;
                             }
                         }
    //Fim cadastro e edição de dados adicionais endereço
    //Fim cadastro e edição de dados adicionais


    // Busca dados do CEP informado no campo
    $scope.getCep = function(id){
    	if ( $scope.endereco.cep != '' ){
    		$http.get('api/index.php/cep/'+$scope.endereco.cep).
    		success(function(data, status, headers, config) {
    			if(data[0].error == -1){
    				$scope.error = data[0].mensagem;
    				Mensagem.error(data[0].mensagem);
    			}else{
    				var idPessoa = $scope.endereco.id_pessoa;
    				$scope.endereco.cep = data[0].endereco.cep;
    				$scope.endereco.logradouro = data[0].endereco.logradouro;
    				$scope.endereco.bairro = data[0].endereco.bairro;
    				var estadoAnterior = $scope.endereco.estado;
    				$scope.endereco.estado = data[0].endereco.estado;
    				$scope.endereco.id_pais = data[0].endereco.idPais;

    				if ( $scope.endereco.estado != estadoAnterior ){
    					angular.forEach(data[0].estados, function(value, key) {
    						if($scope.endereco.estado == value.uf){
    							$scope.cidades = data[0].estados[key].cidades;
    						}
    					});
    				}
    				$scope.endereco.cidade = data[0].endereco.cidade;
    			}
    		}).
    		error(function(data, status, headers, config) {
          // log error
      });
    	}
    }

    //Busca lista de endereços do aluno
    $scope.getEnderecos = function(id){
    	$http.get('api/index.php/endereco/'+id).
    	success(function(data, status, headers, config) {
    		$scope.enderecos = data['endereco'];
    	}).
    	error(function(data, status, headers, config) {
        // log error
    }); 
    }



//Fim - Aba 2 - Endereços **************************************************************************************



//Início - Aba 3 - Telefones **************************************************************************************
    //Início - carga de dados dos combo box
    $scope.getTipoTelefone = function(){
    	$http.get('api/index.php/tipotelefone/').
    	success(function(data, status, headers, config) {
    		$scope.tipostelefones = data.tipo_telefone;          
    	}).
    	error(function(data, status, headers, config) {
          // log error
      });
    }
    //Fim - carga de dados dos combo box


    //Início - carga de dados dos combos de cadastro dinâmicos
    //Início - módulo de tipo de telefone
    $scope.verificarAcaoTipoTelefone = function(item) {

    	if (item.id == -1) {
    		$scope.modalNovoTipoTelefone();
    		$scope.tipotelefone.selected = '';
    	}
    	$scope.telefone.id_tipo_telefone = item.id; 
    	if($scope.telefone.id_tipo_telefone==3){ 
    		$scope.mascara=16; 
    	}else{ 
    		$scope.mascara=15; 
    	}
    }

    $scope.modalNovoTipoTelefone = function(size){
    	$('#myModalTipoTelefone').modal('show');
    }

    $scope.adicionarTipoTelefone = function(){
    	if ($('#cadastroTipoTelefone-form').valid()) {
    		$scope.addTipoTelefone.ativo = 1;
    		$scope.json = angular.toJson($scope.addTipoTelefone);
    		$http.post('api/index.php/tipotelefone/', $scope.json,
    			{withCredentials: true,
    				headers: {'enctype': 'multipart/form-data' },
    			}
    			).success(function(data, status, headers, config) {
    				if (data.error == '0'){
    					Mensagem.success(data.mensagem);
    					$('#myModalTipoTelefone').modal('hide');
    					$scope.getTipoTelefone();
    					$scope.addTipoTelefone = {};
    				}else{
    					Mensagem.error(data.mensagem);
    				}
    			}).error(function(data, status) {
    			});
    		}
    	}
    //Fim - módulo de tipo de telefone
    //Fim - carga de dados dos combos de cadastro dinâmicos


    //Início cadastro e edição de dados adicionais
    //Início cadastro e edição de dados adicionais de telefone
    $scope.editarTelefone = function($index) {   
    	angular.copy($scope.telefones[$index], $scope.telefone);
    	$scope.tipotelefone.selected = {"id": $scope.telefone.id_tipo_telefone,"descricao": $scope.telefone.tipo_telefone};
    }

    $scope.removeLinhaTelefone = function($index){
    	$scope.telefones[$index].ativo = 0;
    	$scope.json = angular.toJson($scope.telefones[$index]);
    	$http.post('api/index.php/telefone/', $scope.json,
    		{withCredentials: true,
    			headers: {'enctype': 'multipart/form-data' },
    		}
    		).success(function(data, status, headers, config) {
    			if (data.error == '0') {
    				Mensagem.success(data.mensagem);
    				$scope.telefones.splice($index, 1);
    			}
    			else {
    				Mensagem.error(data.mensagem);
    			}
    		}).error(function(data, status) {
          //log
      });
    	}

    	$scope.novoTelefoneAluno = function(){
    		$scope.telefone.ativo = 1;
    		$scope.telefone.id = "";
    		$scope.telefone.mensagem = "";
    		$scope.telefone.numero_telefone = "";
    		$scope.telefone.observacao = "";
    		$scope.telefone.principal = "";
    		$scope.telefone.ramal = "";
    		$scope.tipotelefone = {};
    	}

    	$scope.cadastrarTelefonePessoa = function(objeto) {
    		if ($scope.pessoa.id==undefined)
    		{
    			Mensagem.error('Por favor, é necessário cadastrar os dados do aluno primeiro.');
    		}
    		else {
    			if ($('#cadastroTelefone-form').valid()) {
    				SalvarTelefone.disabled = true;
    				$scope.telefone.id_pessoa = $scope.pessoa.id;
    				$scope.telefone.ativo = 1;
    				$scope.json = angular.toJson($scope.telefone);
    				$http.post('api/index.php/telefone/', $scope.json, 
    					{withCredentials: true,
    						headers: {'enctype': 'multipart/form-data' },
    					}
    					).success(function(data, status, headers, config) {
    						if (data.error == '0')
    						{
                /*
                Inserir e atualizar dados diretamente no array de objetos telefone
                dadoTipoTelefone = $filter('filter')($scope.tipotelefone, {'id' :  $scope.telefone.id_tipo_telefone});
                $scope.telefone.tipo_telefone = dadoTipoTelefone.selected.descricao;
                var dataTemp = $scope.findItem($scope.telefone.id, $scope.telefones);
                if ( dataTemp ) {
                  angular.copy($scope.telefone, dataTemp);
                } else {
                 $scope.telefones.push($scope.telefone);
                }
                */
                $scope.getTelefones($scope.pessoa.id);
                $scope.novoTelefoneAluno();
                Mensagem.success(data.mensagem);
            }
            else
            {
            	Mensagem.error(data.mensagem);
            }
        }).error(function(data, status) { 
            //log erro
        });
    } else {
    	Mensagem.error('Por favor, preencha os campos obrigatórios');
    }
    SalvarTelefone.disabled = false;
}
}   
    //Fim cadastro adicional de telefone
    //Fim cadastro e edição de dados adicionais


    //Busca lista de telefones do aluno
    $scope.getTelefones = function(id){
    	$http.get('api/index.php/telefone/'+id).
    	success(function(data, status, headers, config) {
    		var carregaDados = true;
    		if ( angular.isArray(data) ){
    			if (data.length == 1){
    				if ( data[0].error == '-1' ) {
    					carregaDados = false;
    				}
    			}
    		}
    		if ( carregaDados ){
    			$scope.telefones = data;  
    		}
    	}).
    	error(function(data, status, headers, config) {
        // log error
    }); 
    }

    //alterar a forma de apresentar os dados do telefone
    $scope.$watch( 'telefone.id_tipo_telefone', function(){
      //if ( $scope.tipotelefone.selected.id )
      if ( $scope.tipotelefone.selected ){
      	if ( $scope.tipotelefone.selected.id == 2 ){
      		$scope.telefone_numero_class = "col-xs-12 col-sm-12 col-md-6 col-lg-6";
      		$scope.telefone_ramal_class = "col-xs-3 col-sm-3 col-md-2 col-lg-2";
      	} else {
      		$scope.telefone_numero_class = "col-xs-12 col-sm-12 col-md-8 col-lg-8";
      	}
      }
  });
//Fim - Aba 3 - Telefones **************************************************************************************



//Início - Aba 4 - Disciplinas **************************************************************************************



//Fim - Aba 4 - Disciplinas **************************************************************************************

$scope.getUserLogado = function(){
	$http.get('api/index.php/usuariologado/')
	.success(function(data, status, headers, config) {

		$scope.entidadeLogada = data['user']['user'].idTipoEntidade;

          //Inicializa dados dos combos
          $scope.getPais();
          $scope.getEstado();
          $scope.getEstadoCivil();
          $scope.getReligiao();
          $scope.getTipoEndereco();
          $scope.getTipoTelefone();
          $scope.getPapel();
          $scope.getTipoFuncionario();
          $scope.getOrgaoEmissor();
          $scope.getFuncao();
          $scope.getTiposFuncionario();
      })
	.error(function(data, status, headers, config) { });
}

$scope.getUserLogado();


if (idPessoa != undefined) {
	$timeout(function() {
		$scope.getIdPessoa(idPessoa);
	}, 800);
};
});

//@ sourceURL=controller.formCadastroFuncionarioEscola.js