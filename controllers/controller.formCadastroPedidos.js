/*
Módulo: Cemitério
Descrição: CRUD Lote
Método: GET
URL: /forms/formCadastroLotes
Autenticação: Não
Resposta: JSON
Data de Criação: 20/11/2014
Autor: Fabio da Silva
Versão: 1.0
Data de Alteração: 17/03/2015
Autor: Fabio da Silva
Data de Alteração: 18/03/2015
Autor: Luciano Almeida
*/
smartSig.registerCtrl("formCadastroPedidos", function($scope, $http, $routeParams, Mensagem, $timeout, Permissao){
	$scope.permissoes = Permissao.validaPermissao();
	$scope.permissoes.then(function (data) {
			$scope.permissoes = data;
	}, function (status) {
			console.log('status',status);
	});

	$scope.pessoa = [];
	$scope.departamentos_funcionarios = [];
	$scope.entidades = [];
	$scope.pedido = {};
	$scope.pedido.id = $routeParams.id;
	$scope.pedido.id_situacao_pedido = 0;
	$scope.addPedido = {};
	$scope.addItem = {};
	$scope.centro_custo = [];
	$scope.unidade_medida = [];
	$scope.produtos_servicos = [];
	$scope.aprovador = [];
	$scope.responsavel = [];
	$scope.prod_serv = [];
	$scope.uni_med = [];

	$scope.getPedido = function(){
		if($scope.pedido.id){
			$http.get('api/index.php/pedido/'+$scope.pedido.id).
			success(function(data, status, headers, config) {
				$scope.pedido = data.pedido[0];
				$scope.addPedido = data.pedido[0];
				$scope.pedido.id_departamento_funcionario = data.pedido[0].id_departamento_funcionario;
				$scope.pedido.id_entidade = parseFloat(data.pedido[0].id_entidade);
				$scope.responsavel = {selected : {"id":$scope.addPedido.id_pessoa_responsavel,"nome":$scope.addPedido.pessoa_responsavel}};
				$scope.aprovador = {selected : {"id":$scope.addPedido.id_pessoa_aprovador,"nome":$scope.addPedido.pessoa_aprovador}};
			}).
			error(function(data, status, headers, config) {
				// log error
			}); 
		}
	}

	$scope.getPedidoItens = function(){
		if($scope.pedido.id){
			$http.get('api/index.php/pedidoitens/'+$scope.pedido.id).
			success(function(data, status, headers, config) {
				$scope.pedido.itens = data.pedido_itens;
			}).
			error(function(data, status, headers, config) {
				// log error
			}); 
		}
	}

	$scope.getCentroCusto = function(){
			$http.get('api/index.php/consultacentrocusto/1/').
			success(function(data, status, headers, config) {
				$scope.centro_custo = data.centro_custo;
			}).
			error(function(data, status, headers, config) {
				// log error
			}); 
	}

	$scope.getUnidadeMedida = function(){
			$http.get('api/index.php/unidademedida/0/').
			success(function(data, status, headers, config) {
				$scope.unidade_medida = data.unidademedida;
			}).
			error(function(data, status, headers, config) {
				// log error
			}); 
	}

	$scope.getProdutosServicos = function(){
			$http.get('api/index.php/produtosservicos/').
			success(function(data, status, headers, config) {
				$scope.produtos_servicos = data.produtos_servicos;
			}).
			error(function(data, status, headers, config) {
				// log error
			}); 
	}
		
	$scope.getPessoa = function(){		
		$http.get('api/index.php/carregapessoa/12')
		.success(function(data, status, headers, config) {
			$scope.pessoa = data.pessoa;			
		})
		.error(function(data, status, headers, config) {}); 
	}

	$scope.changeResponsavel = function(item) {
		$scope.addPedido.id_pessoa_responsavel = item.id;
		$( "em[for='responsavel']" ).css("display","none");
	}

	$scope.changeAprovador = function(item) {
		$scope.addPedido.id_pessoa_aprovador = item.id;
		$( "em[for='aprovador']" ).css("display","none");
	}

	$scope.changeUnidadeMedida = function(item) {
		if (item.id==-1) {
			$scope.modalNovaUnidade();
			$scope.uni_med.selected = '';
		}
		$scope.addItem.id_unidade_medida = item.id;
		$( "em[for='uni_med']" ).css("display","none");
	}

	$scope.changeItem = function(item) {
		$scope.addItem.id_produtos_servicos = item.id;
		$( "em[for='prod_serv']" ).css("display","none");
	}

	$scope.modalNovaUnidade = function(size){
			$('#myModalUnidade').modal('show');
	}

	$scope.$watch('addItem.data_entrega', function(){
		$scope.addItem.data_entrega1 = $scope.addItem.data_entrega;
		if($scope.addItem.data_entrega1 != undefined || $scope.addItem.data_entrega1 != null){
			$( "em[for='data_entrega']" ).css("display","none"); 
		}
	});

	$scope.cadastrarPedido = function(pedido){
		if ($('#cadastroPedidos-form').valid()) {
			if(pedido.id_pessoa_responsavel != pedido.id_pessoa_aprovador){
				if($scope.pedido.id){
					pedido.id = $scope.pedido.id;  
				}
				
				$scope.json = angular.toJson(pedido);
				$http.post('api/index.php/pedido/', $scope.json, 
									 {withCredentials: true,
										 headers: {'enctype': 'multipart/form-data' },
									 }
				 ).success(function(data, status, headers, config) {
					 if (data.error == '0'){
						$scope.pedido.id = data.id_pedido;
						Mensagem.success(data.mensagem);
					} else {
						Mensagem.error(data.mensagem);
					}
				}).error(function(data, status) {

				});
			} else {
				Mensagem.error("Responsavel e aprovador são iguais!");
			}
		}
	}

	$scope.cadastrarItem = function(item){
		if($scope.pedido.id){
			if ($('#cadastroItem-form').valid()) {
				item.id_pedido = $scope.pedido.id;
				$scope.json = angular.toJson(item);
				$http.post('api/index.php/pedidoitens/', $scope.json, 
									 {withCredentials: true,
										 headers: {'enctype': 'multipart/form-data' },
									 }
				 ).success(function(data, status, headers, config) {
					 if (data.error == '0'){
						Mensagem.success(data.mensagem);
						$scope.addItem = {};
						$scope.prod_serv.selected = '';
						$scope.uni_med.selected = '';
						$scope.getPedidoItens();
					} else {
						Mensagem.error(data.mensagem);
					}
				}).error(function(data, status) { 
					// log error
				});
			}
		}
	}

	$scope.adicionarUnidade = function(){
		if ($('#adicionarUnidade-form').valid()) {
			
			$scope.json = angular.toJson($scope.addUnidade);

			$http.post('api/index.php/unidademedida/', $scope.json, 
			 {withCredentials: true,
				 headers: {'enctype': 'multipart/form-data' },
			}).success(function(data, status, headers, config) {
				 if (data.error == '0'){
						Mensagem.success(data.mensagem);
						$scope.addUnidade = {};

						$scope.getUnidadeMedida();

						$('#myModalUnidade').modal('hide');
				 }else{
						Mensagem.error(data.mensagem);
				 }
			}).error(function(data, status) { 

			});        
		}
	}

	$scope.getListaDepartamento = function(){
			$http.get('api/index.php/deptofuncionarios/').
			success(function(data, status, headers, config) {
				$scope.departamentos_funcionarios = data.departamentos;
				delete $scope.departamentos_funcionarios[0];
				for (var i=0; i < $scope.departamentos_funcionarios.length; i++) {
					if ( $scope.departamentos_funcionarios[i] === undefined ) {
						$scope.departamentos_funcionarios.splice(i,1);
						i--;
					}
				}
				
			}).
			error(function(data, status, headers, config) {
			// log error
		}); 
	}

	$scope.getEntidade = function(){
			$http.get('api/index.php/entidade/').        
			success(function(data, status, headers, config) {
				$scope.entidades = data.entidade;
			}).
			error(function(data, status, headers, config) {
			// log error
		}); 
	}

	$scope.delItem = function(indiceEl,item){

		$scope.json = angular.toJson(item);

		$http.post('api/index.php/delpedidoitem/', $scope.json, 
			 {withCredentials: true,
				 headers: {'enctype': 'multipart/form-data' },
			 }).success(function(data, status, headers, config) {
				 if (data.error == '0'){
						$scope.pedido.itens.splice(indiceEl, 1);
						Mensagem.success(data.mensagem);
					} else {
						Mensagem.error(data.mensagem);
					}
			}).error(function(data, status) { 

			});
	}

	$scope.upPedidoSituacao = function(){
		$scope.pedido.id_situacao_nova = 2;
		$scope.json = angular.toJson($scope.pedido);

		$http.post('api/index.php/uppedidosituacao/', $scope.json, 
			{withCredentials: true,
				headers: {'enctype': 'multipart/form-data' },
			}).success(function(data, status, headers, config) {
				if (data.error == '0'){
					$scope.pedido.id_situacao_pedido = data.id_situacao_pedido;
					$scope.pedido.situacao_pedido = data.situacao_pedido;

					Mensagem.success(data.mensagem);
				} else {
					Mensagem.error(data.mensagem);
				}
			}).error(function(data, status) {
				// log error
			});
	}

	$scope.modalEnviar = function(){
		$.SmartMessageBox({
			title : "Enviar Pedido",
			content : "Deseja enviar o pedido para a lista de aprovação.",
			buttons : "[Sim][Não]",
			placeholder : ""
		}, function(ButtonPress, Value) {
			if (ButtonPress == "Sim") {
				$scope.upPedidoSituacao();
				return 0;
			}else{
				return 0;  
			}
		});
	}

	$scope.novoCadastro = function(){
		$scope.addPedido = {};
		$scope.aprovador.selected = '';
		$scope.responsavel.selected = '';
		$scope.pedido = {};
		$scope.pedido.id = '';
		$scope.pedido.id_situacao_pedido = 0;
		$scope.addItem = {};
		$scope.prod_serv.selected = '';
		$scope.uni_med.selected = '';
		$scope.pedido.itens = {}
	}
	
	$scope.getPedido();
	$scope.getPessoa();
	$scope.getListaDepartamento();
	$scope.getEntidade();
	$scope.getCentroCusto();
	$scope.getUnidadeMedida();
	$scope.getProdutosServicos();
	$scope.getPedidoItens();
});