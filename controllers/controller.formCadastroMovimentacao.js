/*
Módulo: SBM
Descrição: Consulta Movimentação
Método: GET
URL: /financeiro/consultaMovimentacao
Autenticação: Não
Resposta: JSON
Data de Criação: 11/12/2014
Autor: Ricardo Bruno
Versão: 1.0
Data de Alteração: 09/04/2015
Autor: Luciano Almeida
Descrição: Nas abas onde tem "pago a:" mostrar apenas os Fornecedores
*/
smartSig.registerCtrl('formCadastroMovimentacao', function($scope, ngTableParams, $http, $location, $filter, filterFilter, $timeout, Permissao, $routeParams, Mensagem, $modal) {
	/*
	$scope.permissoes = Permissao.validaPermissao();
	$scope.permissoes.then(function (data) {
		$scope.permissoes = data;
	}, function (status) {
		
	});
	*/	

	$scope.n_contabancaria = {};
 	$scope.array_files = [0];
	$scope.categorias = [];
	$scope.categoria = [];
	$scope.formapagamento = [];
	$scope.pessoa = [];
	$scope.idTipoLancamento = 1;
	$scope.movimentacao={};
	$scope.movimentacao.repete=0;
	$scope.movimentacao.id_tipo_lancamento=0;
	$scope.recibo = [];
	$scope.modeloTemplate = {};
	$scope.files = {};
	$scope.filesComprovante = {};
	$scope.centro_custo = [];
	$scope.custo = [];
	$scope.transferencia={};	
	$scope.id_transferencia=0;
	

	/* Novo codigo **********************************/
	$scope.camp = [];
	$scope.camp['saida'] = {
				"categoria":
					{'show': true, 
					 'class': 'col col-xm-12 col-sm-4 col-md-4 col-lg-4', 
					 'label': 'Categoria'},
				"item": 
					{'show': false, 
					 'class': 'col col-xm-12 col-sm-3 col-md-3 col-lg-3', 
					 'label': 'Item'},
				"descricao": 
					{'show': true, 
					 'class': 'col col-xm-12 col-sm-8 col-md-8 col-lg-8', 
					 'label': 'Descrição'},

				"data_vencimento": 
					{'show': true, 
					 'class': 'col col-xm-12 col-sm-3 col-md-3 col-lg-3', 
					 'label': 'Data Vencimento'},
				"moeda": 
					{'show': true, 
					 'class': 'col col-xm-12 col-sm-2 col-md-2 col-lg-2', 
					 'label': 'Moeda'},
				"valor": 
					{'show': true, 
					 'class': 'col col-xm-12 col-sm-2 col-md-2 col-lg-2', 
					 'label': 'Valor'},
				"pessoa": 
					{'show': true, 
					 'class': 'col col-xm-12 col-sm-5 col-md-5 col-lg-5', 
					 'label': 'Pago a:'},

				"competencia": 
					{'show': true, 
					 'class': 'col col-xm-12 col-sm-3 col-md-3 col-lg-3', 
					 'label': 'Competência'},
				"numero_documento": 
					{'show': true, 
					 'class': 'col col-xm-12 col-sm-3 col-md-3 col-lg-3', 
					 'label': 'Número do Documento'},
				"modo": 
					{'show': true, 
					 'class': 'col col-xm-12 col-sm-3 col-md-3 col-lg-3', 
					 'label': 'Modo de Pagamento'},
				"situacao": 
					{'show': true, 
					 'class': 'col col-xm-12 col-sm-3 col-md-3 col-lg-3', 
					 'label': 'Situação'},

				"data_pagamento": 
					{'show': true, 
					 'class': 'col col-xm-12 col-sm-4 col-md-4 col-lg-4', 
					 'label': 'Data do Pagamento'},
				"conta": 
					{'show': true, 
					 'class': 'col col-xm-12 col-sm-4 col-md-4 col-lg-4', 
					 'label': 'Conta'},
				"centro_custo": 
					{'show': true, 
					 'class': 'col col-xm-12 col-sm-4 col-md-4 col-lg-4', 
					 'label': 'Centro de Custo'},

				"juros": 
					{'show': false, 
					 'class': 'col col-xm-12 col-sm-3 col-md-3 col-lg-3', 
					 'label': 'Juros'},
				"multa": 
					{'show': false, 
					 'class': 'col col-xm-12 col-sm-3 col-md-3 col-lg-3', 
					 'label': 'Multa'},
				"desconto": 
					{'show': false, 
					 'class': 'col col-xm-12 col-sm-3 col-md-3 col-lg-3', 
					 'label': 'Desconto'},
				"valor_final": 
					{'show': false, 
					 'class': 'col col-xm-12 col-sm-3 col-md-3 col-lg-3', 
					 'label': 'Valor Final'},

				"evento": 
					{'show': false, 
					 'class': '', 
					 'label': 'Evento'},
				"arquivo_digitaliado": 
					{'show': false, 
					 'class': '', 
					 'label': 'Arquivo digitalizado'},
				"comprovante": 
					{'show': false, 
					 'class': '', 
					 'label': 'Comprovante Pagamento / Depósito'},
				"mais_detalhes": 
					{'show': false, 
					 'class': 'col col-xm-12 col-sm-6 col-md-6 col-lg-6', 
					 'label': 'Mais detalhes'}
	};
	$scope.camp['entrada'] = {
				"categoria":
					{'show': true, 
					 'class': 'col col-xm-12 col-sm-4 col-md-4 col-lg-4', 
					 'label': 'Categoria'},
				"item": 
					{'show': false, 
					 'class': 'col col-xm-12 col-sm-3 col-md-3 col-lg-3', 
					 'label': 'Item'},
				"descricao": 
					{'show': true, 
					 'class': 'col col-xm-12 col-sm-8 col-md-8 col-lg-8', 
					 'label': 'Descrição'},

				"data_vencimento": 
					{'show': true, 
					 'class': 'col col-xm-12 col-sm-3 col-md-3 col-lg-3',
					 'label': 'Data de Vencimento'},
				"moeda": 
					{'show': true, 
					 'class': 'col col-xm-12 col-sm-2 col-md-2 col-lg-2', 
					 'label': 'Moeda'},
				"valor": 
					{'show': true, 
					 'class': 'col col-xm-12 col-sm-2 col-md-2 col-lg-2', 
					 'label': 'Valor'},
				"pessoa": 
					{'show': true, 
					 'class': 'col col-xm-12 col-sm-5 col-md-5 col-lg-5', 
					 'label': 'Recebido de:'},

				"competencia": 
					{'show': true, 
					 'class': 'col col-xm-12 col-sm-3 col-md-3 col-lg-3', 
					 'label': 'Competência'},
				"numero_documento": 
					{'show': true, 
					 'class': 'col col-xm-12 col-sm-3 col-md-3 col-lg-3', 
					 'label': 'Número do Documento'},
				"modo": 
					{'show': true, 
					 'class': 'col col-xm-12 col-sm-3 col-md-3 col-lg-3', 
					 'label': 'Modo de Recebimento'},
				"situacao": 
					{'show': true, 
					 'class': 'col col-xm-12 col-sm-3 col-md-3 col-lg-3', 
					 'label': 'Situação'},

				"data_pagamento": 
					{'show': true, 
					 'class': 'col col-xm-12 col-sm-4 col-md-4 col-lg-4', 
					 'label': 'Data do Pagamento'},
				"conta": 
					{'show': true, 
					 'class': 'col col-xm-12 col-sm-4 col-md-4 col-lg-4', 
					 'label': 'Conta'},
				"centro_custo": 
					{'show': true, 
					 'class': 'col col-xm-12 col-sm-4 col-md-4 col-lg-4', 
					 'label': 'Centro de Custo'},

				"juros": 
					{'show': true, 
					 'class': 'col col-xm-12 col-sm-3 col-md-3 col-lg-3', 
					 'label': 'Juros'},
				"multa": 
					{'show': true, 
					 'class': 'col col-xm-12 col-sm-3 col-md-3 col-lg-3', 
					 'label': 'Multa'},
				"desconto": 
					{'show': true, 
					 'class': 'col col-xm-12 col-sm-3 col-md-3 col-lg-3', 
					 'label': 'Desconto'},
				"valor_final": 
					{'show': true, 
					 'class': 'col col-xm-12 col-sm-3 col-md-3 col-lg-3', 
					 'label': 'Valor Final'},

				"evento": 
					{'show': false, 
					 'class': '', 
					 'label': 'Evento'},
				"arquivo_digitaliado": 
					{'show': false,
					 'class': '',  
					 'label': 'Arquivo digitalizado'},
				"comprovante": 
					{'show': false,
					 'class': '',  
					 'label': 'Comprovante Pagamento / Depósito'},
				"mais_detalhes": 
					{'show': false,
					 'class': 'col col-xm-12 col-sm-6 col-md-6 col-lg-6', 
					 'label': 'Mais detalhes'}
	};
	$scope.camp['doacao'] = {
				"categoria":
					{'show': true, 
					 'class': 'col col-xm-12 col-sm-4 col-md-4 col-lg-4', 
					 'label': 'Categoria'},
				"item": 
					{'show': false, 
					 'class': 'col col-xm-12 col-sm-3 col-md-3 col-lg-3', 
					 'label': 'Item'},
				"descricao": 
					{'show': true, 
					 'class': 'col col-xm-12 col-sm-8 col-md-8 col-lg-8', 
					 'label': 'Descrição'},

				"data_vencimento": 
					{'show': true, 
					 'class': 'col col-xm-12 col-sm-3 col-md-3 col-lg-3',
					 'label': 'Data da Doação'},
				"moeda": 
					{'show': true, 
					 'class': 'col col-xm-12 col-sm-2 col-md-2 col-lg-2', 
					 'label': 'Moeda'},
				"valor": 
					{'show': true, 
					 'class': 'col col-xm-12 col-sm-2 col-md-2 col-lg-2', 
					 'label': 'Valor'},
				"pessoa": 
					{'show': true, 
					 'class': 'col col-xm-12 col-sm-5 col-md-5 col-lg-5', 
					 'label': 'Recebido de:'},

				"competencia": 
					{'show': true, 
					 'class': 'col col-xm-12 col-sm-3 col-md-3 col-lg-3', 
					 'label': 'Competência'},
				"numero_documento": 
					{'show': true, 
					 'class': 'col col-xm-12 col-sm-3 col-md-3 col-lg-3', 
					 'label': 'Número do Documento'},
				"modo": 
					{'show': true, 
					 'class': 'col col-xm-12 col-sm-3 col-md-3 col-lg-3', 
					 'label': 'Modo de Recebimento'},
				"situacao": 
					{'show': true, 
					 'class': 'col col-xm-12 col-sm-3 col-md-3 col-lg-3', 
					 'label': 'Situação'},

				"data_pagamento": 
					{'show': true, 
					 'class': 'col col-xm-12 col-sm-4 col-md-4 col-lg-4', 
					 'label': 'Data do Pagamento'},
				"conta": 
					{'show': true, 
					 'class': 'col col-xm-12 col-sm-4 col-md-4 col-lg-4', 
					 'label': 'Conta'},
				"centro_custo": 
					{'show': true, 
					 'class': 'col col-xm-12 col-sm-4 col-md-4 col-lg-4', 
					 'label': 'Centro de Custo'},

				"juros": 
					{'show': false, 
					 'class': 'col col-xm-12 col-sm-3 col-md-3 col-lg-3', 
					 'label': 'Juros'},
				"multa": 
					{'show': false, 
					 'class': 'col col-xm-12 col-sm-3 col-md-3 col-lg-3', 
					 'label': 'Multa'},
				"desconto": 
					{'show': false, 
					 'class': 'col col-xm-12 col-sm-3 col-md-3 col-lg-3', 
					 'label': 'Desconto'},
				"valor_final": 
					{'show': false, 
					 'class': 'col col-xm-12 col-sm-3 col-md-3 col-lg-3', 
					 'label': 'Valor Final'},

				"evento": 
					{'show': false, 
					 'class': '', 
					 'label': 'Evento'},
				"arquivo_digitaliado": 
					{'show': false,
					 'class': '',  
					 'label': 'Arquivo digitalizado'},
				"comprovante": 
					{'show': false,
					 'class': '',  
					 'label': 'Comprovante Pagamento / Depósito'},
				"mais_detalhes": 
					{'show': false,
					 'class': 'col col-xm-12 col-sm-6 col-md-6 col-lg-6', 
					 'label': 'Mais detalhes'}
	};

	$scope.tabs = [
		{	
			"active":true, 
			"nome":'Recebimentos', 
			"classe":'btnmd-success',
			"texto":'Consultar recebimentos',
			"indice":1, 
			"form": "entrada", 
			"icon": 'fa fa-fw fa-credit-card'
		},{
			"active":false, 
			"nome":'Despesas Fixas', 
			"classe":'btnmd-danger',
			"texto":'Consultardespesas fixa', 
			"indice":2, 
			"form": "saida", 
			"icon": 'fa fa-fw fa-money'
		},{
			"active":false, 
			"nome":'Despesas Variáveis', 
			"classe":'btnmd-danger',
			"texto":'Consultar despesas variáveis', 
			"indice":3, 
			"form": "saida", 
			"icon": 'fa fa-fw fa-bar-chart-o'
		},{
			"active":false, 
			"nome":'Pessoas', 
			"classe":'btnmd-danger',
			"texto":'Consultar despesas a pessoas', 
			"indice":4, 
			"form": "saida", 
			"icon": 'fa fa-fw fa-user-plus'
		},{
			"active":false, 
			"nome":'Impostos', 
			"classe":'btnmd-danger',
			"texto":'Consultar impostos', 
			"indice":5, 
			"form": "saida", 
			"icon": 'fa fa-fw fa-pie-chart'
		},{
			"active":false, 
			"nome":'Doações', 
			"classe":'btnmd-success',
			"texto":'Consultar doações', 
			"indice":6, 
			"form": "doacao", 
			"icon": 'fa fa-fw fa-heart-o'
		},{
			"active":false, 
			"nome":'Transferências', 
			"classe":'btnmd-info',
			"texto":'Consultar transferências', 
			"indice":7, 
			"form": "transferencia", 
			"icon": 'fa fa-fw fa-exchange'
		}
	];

	$scope.getPessoaExists = function(val) {
		$scope.movimentacao.recebido = '';
		$( "em[for='recebidopago']" ).css("display","none");	

    	return $http.get('api/index.php/stringpessoa?todos=1&', {
    		params: {
    			string: val,
    			sensor: false
    		}
    	}).then(function(response){
    		var novaPessoa = [
    				{
    		    			id: -1,
    		    			tipo: 'Cadastro',
    		    			nome: 'Cadastrar responsavel pela conta'
    		    	}
    		    ];

	    	var pessoa = response.data.pessoa;

	    	if(typeof pessoa == 'undefined'){
				return novaPessoa;
	    	}else{
	    		return novaPessoa.concat(pessoa);
	    	}
    		
    	});
    };

    $scope.novoAddPessoa = function(){
    	$scope.addPessoa = {};
    	$scope.addPessoa.id_tipo_pessoa = 1;
    }

    $scope.passaPessoa = function(item, model, label){

    	if(item.id == -1){
    		$scope.pessoa.nome = '';
    		$scope.movimentacao.recebido = '';
    		
    		$scope.novoAddPessoa();

	    	$('#myModalPessoa').modal('show');
    	}else{
    		console.log('teste', item.id);
	    	$scope.movimentacao.recebido = item.id;
    	}
    	$( "em[for='recebidopago']" ).css("display","none");	
    }

    $scope.adicionarPessoa = function(){
    	if($('#cadastroPessoa-form').valid()){
			console.log($scope.addPessoa);

			$scope.addPessoa.tipocadastro = 7;

			$scope.json = angular.toJson($scope.addPessoa);

			$http.post('api/index.php/pessoa/', $scope.json,{withCredentials: true,headers: {'enctype': 'multipart/form-data' },})      
      		.success(function(data, status, headers, config) {
      			if(data.error == 0){
					Mensagem.success(data.mensagem);

					$('#myModalPessoa').modal('hide');
      			}
      		}).error(function(data, status, headers, config) {
      		});
		}
    }
    /* Fim - Novo codigo **********************************/

	$scope.tabssel = $scope.tabs[0];

	idTipoLancamento = $routeParams.tipo; //<--Não traz o tipo e sim o indice

	var idTipo= "";

	switch (idTipoLancamento){
		case "1":
			$scope.tabssel = $scope.tabs[0];
			$scope.tabssel.nome="Recebimentos";
			$scope.tabssel.active=true;
			$scope.texto=1;
		break;
		case "2":
			$scope.tabssel = $scope.tabs[1];
			$scope.tabssel.nome="Despesas Fixas";
			$scope.tabssel.active=true;
			$scope.texto=2;
		break;
		case "3":
			$scope.tabssel = $scope.tabs[2];
			$scope.tabs.nome="Despesas Flexíveis";
			$scope.tabssel.active=true;
			$scope.texto=2;
		break;
		case "4":
			$scope.tabssel = $scope.tabs[3];
			$scope.tabs.nome="Pessoas";
			$scope.tabssel.active=true;
			$scope.texto=2;
		break;
		case "5":
			$scope.tabssel = $scope.tabs[4];
			$scope.tabs.nome="Impostos";
			$scope.tabssel.active=true;
			$scope.texto=2;
		break;
		case "7":
			$scope.tabssel = $scope.tabs[6];
			$scope.tabs.nome="Transferências";
			$scope.tabssel.active=true;
			$scope.texto=3;
		break;
		case "6":
			$scope.tabssel = $scope.tabs[5];
			$scope.tabs.nome="Doações";
			$scope.tabssel.active=true;
			$scope.texto=1;
		break;		
	}


	$scope.changeTab = function(index) {
		$scope.tabssel = $scope.tabs[index];

		switch (index){
			case 0:
				idTipoLancamento = 1;
				$scope.texto=1;
			break;
			case 1:
				idTipoLancamento = 2;
				$scope.texto=2;
			break;
			case 2:
				idTipoLancamento = 3;
				$scope.texto=2;
			break;
			case 3:
				idTipoLancamento = 4;
				$scope.texto=2;
			break;
			case 4:
				idTipoLancamento = 5;
				$scope.texto=2;
			break;
			case 5:
				idTipoLancamento = 7;
				$scope.texto=1;
			break;
			case 6:
				idTipoLancamento = 6;
				$scope.texto=1;
				$scope.getTransferencia ();
			break;
		}

		$scope.idTipoLancamento = idTipoLancamento;
		$scope.getSituacao($scope.idTipoLancamento);
	};

	$scope.verificarAcao = function(item) {
		if (item.id==-1) {
			$scope.modalNovaCategoria();
			$scope.categoria.selected = '';
		}
		$scope.movimentacao.categoria = item.id;
		$( "em[for='categoria']" ).css("display","none");

		
		$scope.getItens(item.id);
	}

	$scope.setCurDate = function(){
		$scope.curDate = new Date();
	}

	$scope.getCategoria = function(){

		$http.get('api/index.php/categoria/' + idTipoLancamento ).
		success(function(data, status, headers, config) {
			$scope.categorias = data.categoria;
		}).
		error(function(data, status, headers, config) {
			// log error
		});
	}

	$scope.getMoeda = function(){
		$http.get('api/index.php/moeda/')
		.success(function(data, status, headers, config) {
			if (data.error == 0) {
				$scope.moedas = data.moeda;
			};
		})
		.error(function(data, status, headers, config) {});
	}
	$scope.getMoeda();

	$scope.getContaBancaria = function(){
		$http.get('api/index.php/contabancaria/')
		.success(function(data, status, headers, config) {                           
			$scope.contas = data.contabancaria;
		})
		.error(function(data, status, headers, config) {}); 
	}
	$scope.getContaBancaria();

	$scope.getPessoaMovimento = function(objeto) {

		var params = {objeto: objeto, sensor: false};
		if (objeto.length < 0) {
			objeto = "a";
		};
		return $http.get('api/index.php/stringrecebimento?string='+objeto,
			{params: params}
			).then(function(response) {
				$scope.pessoas = response.data['pessoa']
			});
	};
	   
	$scope.getPessoasFornecedor = function(objeto) {

		$http.get('api/index.php/stringpessoa?fornecedor=1&string='+objeto).
		success(function(data, status, headers, config) {
			$scope.pessoas_fornecedor = data.pessoa;
		}).
		error(function(data, status, headers, config) {
			// log error
		});

	};

    $scope.getFornecedor = function(){
        $http.get('api/index.php/carregapessoa/18').    
          success(function(data, status, headers, config) {                                      
            if (data.error == 0) {
              $scope.pessoas_fornecedor  = data.pessoa;         
            }; 
          }).
          error(function(data, status, headers, config) {
            // log error
        });
    }
	
	$scope.getFormaPagamento = function(){
		$http.get('api/index.php/formapagamento/').
		success(function(data, status, headers, config) {
			$scope.formapagamento = data.forma_pagamento;
		}).
		error(function(data, status, headers, config) {
			// log error
		});
	}

	/*
	$scope.getSituacao = function(){
		$http.get('api/index.php/situacao/').
		success(function(data, status, headers, config) {
			$scope.situacao = data.situacao;
		}).
		error(function(data, status, headers, config) {});
	}
	*/

	$scope.getSituacao = function(){
		$http.get('api/index.php/tipolancamentosituacao/'+$scope.idTipoLancamento)
		.success(function(data, status, headers, config) {
			$scope.situacao = data.situacao;
		})
		.error(function(data, status, headers, config) {});
	}


	$scope.getEvento = function(){
		$http.get('api/index.php/evento/').    
		success(function(data, status, headers, config) {

			//if (data.error == 0) {
				$scope.eventos  = data;
			//};
		}).
		error(function(data, status, headers, config) {
			// log error
		});
	}	

	$scope.getItens = function(id_categoria){

		$scope.item = {};
		$http.get('api/index.php/itenscategoria/'+id_categoria).    
		success(function(data, status, headers, config) {
			if (data.error == 0) {
				$scope.item  = data.item;

			};
		}).
		error(function(data, status, headers, config) {
			// log error
		});
	}	

	$scope.movimentacaoValor = function(){
		return $filter('number')($scope.movimentacao.valor);
	}  

	$scope.setValorFinal = function() {
		var setValorFinal = parseFloat($scope.movimentacao.valor || 0) + parseFloat($scope.movimentacao.juros || 0) +
		parseFloat($scope.movimentacao.multa || 0) - parseFloat($scope.movimentacao.desconto || 0);
		return $filter('currency')(setValorFinal);
	};

	$scope.changeRecebido = function(obj){
		$scope.movimentacao.recebido = obj.id;
		//$filter("filter")($scope.pessoas, {'id_pessoa': item.id});
		$( "em[for='recebidopago']" ).css("display","none");
	}


	$scope.modalNovaCategoria = function(size){
		$('#myModal').modal('show');
	}

	$scope.getCentroCusto = function(){
		$http.get('api/index.php/consultacentrocusto/1')
		.success(function(data, status, headers, config){
			$scope.centro_custo = data.centro_custo;
		})
		.error(function(data, status, headers, config) {});
	}

	$scope.getArquivo = function(id){
		$http.get('api/index.php/caixadocumento/'+id)
		.success(function(data, status, headers, config){
			$scope.arquivos = data;
		})
		.error(function(data, status, headers, config) {});
	}

	function convertDate(inputFormat) {
		function pad(s) { return (s < 10) ? '0' + s : s; }
		var d = new Date(inputFormat);
		return [d.getFullYear(), pad(d.getMonth()+1), pad(d.getDate())].join('-');
	}

	$scope.logado = {};

	$scope.getLogado = function(){
		$http.get('api/index.php/usuariologado/').
		success(function(data, status, headers, config) {
			$scope.logado = data.user['user'];			
		}).
		error(function(data, status, headers, config) {
			//log error
		});
	}
	$scope.getLogado();

    $scope.removeTransferencia = function(id){    

    	$tmp={};
   		$tmp.id=id;
	    $scope.json = angular.toJson($tmp);

      	$http.post('api/index.php/deltransferencia/', $scope.json,{withCredentials: true,headers: {'enctype': 'multipart/form-data' },})      
      	.success(function(data, status, headers, config) {}).error(function(data, status, headers, config) {});
    }

	$scope.cadastrarMovimentacao = function(objeto) {

		var mt = [];

		if ($('#cadastroMovimentacao-form').valid()) {

			if($scope.tabssel.indice==7){

					//objeto = id
					if(typeof objeto != 'undefined'){ $scope.removeTransferencia(id); }

					dt = convertDate($scope.transferencia.dia);
					$scope.transferencia.data_vencimento = dt;
					$scope.transferencia.data_pagamento = dt;
					$scope.transferencia.data_lancamento = convertDate(new Date());					
					$scope.transferencia.id_categoria='50';
					$scope.transferencia.id_forma_pagamento=7;
					$scope.transferencia.id_pessoa = $scope.logado.id;					
					$scope.transferencia.valor_final = $scope.transferencia.valor;
					$scope.transferencia.ativo = 1;					

					$scope.transferencia.id_situacao_P='2'; //Pago
					$scope.transferencia.id_tipo_lancamento_P='3'; //Desp. Variavel							

					$scope.transferencia.id_situacao_R='6'; //Recebido
					$scope.transferencia.id_tipo_lancamento_R='1'; //Recebimento


					$scope.json = angular.toJson($scope.transferencia);
					$http.post('api/index.php/transferencia/', $scope.json, {withCredentials: true,headers: {'enctype': 'multipart/form-data' },})
					.success(function(data, status, headers, config) { 
						if (data.error == '0'){ 
															
							msg = 'Transferência incluída com sucesso!'; 
							Mensagem.success(msg);

						} else { Mensagem.error(data.mensagem); } 
					}).error(function(data, status) {});

					$scope.transferencia = {};

			}else{				
				
				$scope.movimentacao.id_tipo_lancamento = $scope.idTipoLancamento;
				$scope.movimentacao.id_pessoa = objeto.recebido;
				$scope.movimentacao.id_categoria = $scope.categoria.selected.id;
				$scope.json = angular.toJson($scope.movimentacao);

				$http.post('api/index.php/movimentacao/', $scope.json, {withCredentials: true,headers: {'enctype': 'multipart/form-data' },})
				.success(function(data, status, headers, config) {

					if (data.error == '0'){

						if($scope.files != null){
							$scope.uploadFile($scope.files, data.id_movimentacao);
						}

						if($scope.filesComprovante != null){
							$scope.uploadFileComprovante($scope.filesComprovante, data.id_movimentacao);
						}

						Mensagem.success(data.mensagem);
						$scope.novoCadastro();

					} else { Mensagem.error(data.mensagem);	}

				}).error(function(data, status) {});
			}
		}
	}

	$scope.chkconta = function(){
	
		cd = $scope.transferencia.id_conta_bancaria_destino;
		co = $scope.transferencia.id_conta_bancaria;

		if(co==cd){ 
			Mensagem.error('A conta de origem deve ser diferente da conta de destino');

			$scope.transferencia.id_conta_bancaria='';
			$scope.transferencia.id_conta_bancaria_destino='';
		}
	}

	$scope.adicionarCategoria = function(){
		if ($('#cadastroCategoria-form').valid()) {
			$scope.addCategoria.id_tipo_lancamento = idTipoLancamento;
			$scope.addCategoria.ativo = 1;
			$scope.json = angular.toJson($scope.addCategoria);

			$http.post('api/index.php/categoria/', $scope.json, 
				{withCredentials: true,
					headers: {'enctype': 'multipart/form-data' },
				})
			.success(function(data, status, headers, config) {
				if (data.error == '0'){
					Mensagem.success(data.mensagem);
					$('#myModal').modal('hide');
					$scope.getCategoria();
					$scope.addCategoria = {};
				}else{
					Mensagem.error(data.mensagem);
				}
			}).error(function(data, status) {
				// log error
			});
		}
	}

	$scope.resumo = function(){
		var dateAsString = $filter('date')(new Date(), "yyyy-MM-dd");
		$http.get('api/index.php/resumofinanceiro/'+dateAsString).
		success(function(data, status, headers, config) {
			$scope.resumo  = data;
		}).
		error(function(data, status, headers, config) {
			// log error
		});
	}

	$scope.$watch("tabssel", function(){
		$scope.getCategoria();
	});

	//Funções do Datepicker
	$scope.open = function($event,opened) {
		$event.preventDefault();
		$event.stopPropagation();

		$scope[opened] = true;
	};

	$scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd/MM/yyyy', 'shortDate'];
	$scope.format = $scope.formats[2];

	$scope.getIdMovimentacao = function(){
		$http.get('api/index.php/movimentacao/'+idMovimentacao).    
		success(function(data, status, headers, config) {
			
			$scope.movimentacao = data.retorno[0];
			$scope.arquivos = $scope.movimentacao.arquivo;			
			$scope.categoria = {selected : {"id":$scope.movimentacao.id_categoria,"descricao":$scope.movimentacao.categoria}};			
			$scope.pessoa.nome = $scope.movimentacao.pessoa;
			$scope.movimentacao.recebido = $scope.movimentacao.id_pessoa;		
			
			var data_vencimento = $scope.movimentacao.data_vencimento;
			$scope.movimentacao.data_vencimento = data_vencimento.split("/").reverse().join("/");

			var data_pagamento = $scope.movimentacao.data_pagamento;
			$scope.movimentacao.data_pagamento = data_pagamento.split("/").reverse().join("/");

			var data_lancamento = $scope.movimentacao.data_lancamento;
			$scope.movimentacao.data_lancamento = data_lancamento.split("/").reverse().join("/").substring(3);

			$scope.getItens($scope.movimentacao.id_categoria);

			$scope.getTransferencia();
		
		}).
		error(function(data, status, headers, config) {
			// log error
		});
	}

	$scope.getListaRecibo = function(){
		$http.get('api/index.php/recibo/').    
		success(function(data, status, headers, config) {
			$scope.recibo  = data.retorno;

		}).
		error(function(data, status, headers, config) {
			// log error
		});
	}

	$scope.armazenaFile = function(files) {
		$scope.files = files;
	};

	$scope.armazenaFileComprovante = function(files) {
		$scope.filesComprovante = files;
	};

	//UPLOAD DE FOTO

	$scope.uploadFile = function(files,id) {

		if (files.name!='foto')
			return;

		var fd = new FormData();
		file = files.files[0];

		if(file){
			fd.append("file", file);

			$http.post('api/index.php/uploadfilefinanceiro/'+id, fd, {
				withCredentials: true,
				headers: {'Content-Type': undefined },
				transformRequest: angular.identity
			})
			.success(function(data, status, headers, config) {
				
			})
			.error(function(data, status) {
				// log error
			});
		}
	}

	$scope.uploadFileComprovante = function(files,id) {

		if (files.name!='pagamento_deposito')
			return;

		var fd = new FormData();
		file = files.files[0];

		if(file){
			fd.append("file", file);

			$http.post('api/index.php/uploadfilecomprovante/'+id, fd, {
				withCredentials: true,
				headers: {'Content-Type': undefined },
				transformRequest: angular.identity
			})
			.success(function(data, status, headers, config) {
				
			})
			.error(function(data, status) {
				// log error
			});
		}
	}		

	$scope.removeFile = function(id, id_caixa) {
		$http.get('api/index.php/removefiledocumentocaixa/'+id).    
		success(function(data, status, headers, config) {
			if (data.error == '0'){
				$scope.getArquivo(id_caixa);
				
				Mensagem.success(data.mensagem);
			} else {
				Mensagem.error(data.mensagem);
			}
		}).
		error(function(data, status, headers, config) {
			// log error
		});
	};

	$scope.previewFile = function(file){
		window.open('/sig/img/financeiro/'+file);
	};

	var idMovimentacao = $routeParams.id;
	$scope.getCategoria();
	$scope.getFormaPagamento();
	$scope.getContaBancaria();
	$scope.getSituacao();
	$scope.resumo();
	$scope.getListaRecibo();
	$scope.getCentroCusto();
	$scope.getMoeda();
	$scope.getFornecedor();
	$scope.getEvento();
	
	$scope.transferencia = {};

	if (idMovimentacao != undefined) {
		$timeout(function() {
			$scope.getIdMovimentacao();
		}, 500);
	};

	$scope.novoCadastro = function(){
		$scope.id_transferencia=0;
		$scope.transferencia = {};
		$scope.movimentacao = {};
		$scope.pessoa = '';
		$scope.categoria.selected = '';		
	}

	$scope.getTransferencia = function(){ 
		$http.get('api/index.php/transferencia/'+$routeParams.id)
		.success(function(data, status, headers, config) {
			if(data.error==0)
			{
				$scope.transferencia = data.retorno[0];

				$scope.id_transferencia = data.retorno[0].id;
				delete $scope.transferencia.id;
				$scope.transferencia.dia = $scope.transferencia.data_pagamento;
			}
		})
		.error(function(data, status, headers, config) {});
	}

	$scope.$watch('postOK', function(){  
		if($scope.postOK==3){
			$scope.postOK=0;
		 	$scope.transferencia={};
		 	$scope.id_transferencia = 0;
		}
	});

});
//@ sourceURL=controller.formCadastroMovimentacao.js
