/*
  Módulo: Mesquita
  Descrição: Itens
  Método: GET
  URL: /gestao/formCadastroItens
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 16/01/2015
  Autor: Fabio da Silva
  Versão: 1.0
  Data de Alteração: 18/03/2015
  Autor: Luciano Almeida
 */
smartSig.registerCtrl("formCadastroItens", function($scope, $http, $routeParams, Mensagem, $timeout, Permissao, $modal){
	$scope.permissoes = Permissao.validaPermissao();
	$scope.permissoes.then(function (data) {
		$scope.permissoes = data;
	}, function (status) {
		//console.log('status',status);
	});

	$scope.item = {};
	$scope.item.id = $routeParams.id;
	$scope.fornecedor = {};
	$scope.addItem = {};
	$scope.addDepartamento = {};
	$scope.addItem.tipo_info = 'P';
	$scope.addItem.ativo = 1;
	$scope.unidadeMedidaObrigatorio = 1;
	$scope.deptos = {};
	$scope.fornecedores = {};
	$scope.addFornecedor = {};
	// $scope.familias = [];
	// $scope.familia = [];
	// $scope.familia_itens = {};
	// $scope.familia_id = {};
	$scope.uni_med = [];
	$scope.unidades_medida = [];
	$scope.unidade_medida_id = {};
	$scope.familia_descricao = {};
	$scope.unidade_medida_descricao = {};
	$scope.fornecedores_id = {};
	$scope.fornecedores_descricao = {};
	$scope.itens_departamentos = [];
	$scope.departamento = [];
	$scope.lista_depto = []; 
	$scope.listas_depto = [];
	$scope.listas_depto.selecionados = [];   
	$scope.unidademedida = {};
	$scope.descricaofamilia = [];
	$scope.unidade_medida = {};

	$scope.departamento = []; 
	$scope.departamentos = [];
	$scope.departamentos.selecionados = [];   
	$scope.categorias = [];
	$scope.categoria = [];


	/*
		Valor padrão para a coluna de "ITEM".
		Ao clicar em TIPO:
			Produto o valor será 6
			Serviço o valor será 10
		Isso foi feito para que não fique um buraco quando esconder a Unidade de Medida da tela.
		Autor: Luciano Almeida
		Data: 18/03/2015
	*/
	$scope.colunaItem = 'col-6';
	
	// var familia = Array();
	/*$scope.getFamilia = function(){
		$http.get('api/index.php/familia/').
			success(function(data, status, headers, config) {
			console.log(data);
			$scope.familias = data;
		}).
		error(function(data, status, headers, config) {
			// log error
		});
	}*/

	/*$scope.changeFamilia = function(familia){
		if(familia.id == -1){
			$scope.modalFamilia();
			//$scope.addItem.familia_id = '';
		}
		else{
			$scope.addItem.familia_id = familia.id;
		}
	}*/


	$scope.setarDepartamentosSelecionados = function(item, select) {
		if(item.length > 0){
			var nivel = item.length - 1;
			$scope.addItem.departamentoselecionado = item;
		}
	}


	$scope.refreshDepartamentos = function(pessoa) {
		$scope.departamentos = [];
		$scope.departamentos.selecionados = [];
		//$scope.tipoeventos.selecionados.splice(nivel, 1);
		$http.get('api/index.php/deptofuncionarios').
		success(function(data, status, headers, config) {
			//if(data[0].error != -1){
				$scope.departamento = data;
				angular.forEach(data, function(value, key) {
					angular.forEach(pessoa, function(value2, key2) {
						if(value.id == value2.id){
							$scope.departamentos.selecionados.push(data[key]);
						}
					});
				});
			//}
		}).
		error(function(data, status, headers, config) {
			// log error
		});
	};  


    $scope.refreshTipoEvento = function(pessoa) { 
      $scope.tipoeventos = [];
      $scope.tipoeventos.selecionados = [];
      //$scope.tipoeventos.selecionados.splice(nivel, 1);
      $http.get('api/index.php/stringtipoevento').    
      success(function(data, status, headers, config) {                 
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
      }).
      error(function(data, status, headers, config) {
        // log error
      });
    };  


	$scope.changeDepartamento = function(item){
		$scope.departamento.id_departamento = item.id;
		$( "em[for='departamento']" ).css("display","none");
		//$scope.familia_id;
		//$scope.familia_descricao;
	}


	$scope.getDepartamento = function(){
		$http.get('api/index.php/deptofuncionarios/1').
		success(function(data, status, headers, config) {
			$scope.departamentos = data.departamentos;
			//console.log('$scope.departamentos', $scope.departamentos);
		}).
		error(function(data, status, headers, config) {
		  // log error
		});
	}


	
	$scope.getUnidadeMedida = function(){
		$http.get('api/index.php/unidademedida/0/').
		success(function(data, status, headers, config) {
			$scope.unidades_medida = data.unidademedida;
			//console.log('$scope.unidades_medida',$scope.unidades_medida);
		}).
		error(function(data, status, headers, config) {
			// log error
		});
	}
	


	$scope.getItem = function(){
		console.log('erro');
		if($scope.item.id){
			$http.get('api/index.php/produtosservicos/'+$scope.item.id).
			success(function(data, status, headers, config) {
				$scope.addItem = data.produtos_servicos[0];
				$scope.getFornecedor($scope.item.id);
				$scope.unidade_medida = {selected : {"id":$scope.addItem.id_unidade_medida,"descricao":$scope.addItem.descricao}};
				$scope.categoria = {selected : {"id":$scope.addItem.id_categoria,"descricao":$scope.addItem.categoria}};
				//console.log('$scope.addItem', $scope.addItem);
			}).
			error(function(data, status, headers, config) {
				// log error
			});
		} 
	}
	


	$scope.getFornecedor = function(id){
		$http.get('api/index.php/fornecedor/'+id).
		success(function(data, status, headers, config) {
			console.log('data fornecedor = ', data);
			$scope.fornecedores = data.produtos_servicos_fornecedor;
			console.log('$scope.fornecedores', $scope.fornecedores);
		}).
		error(function(data, status, headers, config) {
			// log error
		});
	}


	$scope.getPessoa = function(){
		$http.get('api/index.php/consultapessoa/8').
		success(function(data, status, headers, config) {
			$scope.pessoa = data.pessoa;
			console.log('$scope.pessoa', $scope.pessoa);
		}).
		error(function(data, status, headers, config) {
			// log error
		}); 
	}

	$scope.getCategoria = function(){

		$http.get('api/index.php/categoria/').
		success(function(data, status, headers, config) {
			$scope.categorias = data.categoria;
		}).
		error(function(data, status, headers, config) {
			// log error
		});
	}	


	$scope.cadastrarItem = function(){
		if ($('#cadastroItem-form').valid()) {
			if($scope.item.id){
				$scope.addItem.id = $scope.item.id;
			}
			$scope.json = angular.toJson($scope.addItem);

			$http.post('api/index.php/produtosservicos/', $scope.json, 
						{withCredentials: true,
							headers: {'enctype': 'multipart/form-data' },
						}
			).success(function(data, status, headers, config) {
				if (data.error == '0'){
					Mensagem.success(data.mensagem);
					$scope.item.id = data.id_produtos_servicos;
					$scope.getFornecedor($scope.item.id);
				} else {
					Mensagem.error(data.mensagem);
				}
			}).error(function(data, status) {
				// log error
			});
		}
	}

	$scope.verificarAcaoCategoria = function(item) {
		$scope.addItem.categoria = item.id;
		$( "em[for='categoria']" ).css("display","none");
	}	


	$scope.changeUnidadeMedida = function(item){
		if(item.id==-1){
			$scope.modalUnidadeMedida();
			$scope.unidade_medida.selected = '';
		}
		$scope.addItem.id_unidade_medida = item.id;
		$( "em[for='id_unidade_medida']" ).css("display","none");
	}


	$scope.modalUnidadeMedida = function(){
		$('#myModalUnidadeMedida').modal('show');
	}


	$scope.modalFamilia = function(){
		$('#familiaItens').modal('show');
	}


	$scope.adicionarUnidade = function(){
		if ($('#cadastroUnidadeMedida-form').valid()) {
			$scope.unidademedida.ativo = 1;
			$scope.json = angular.toJson($scope.unidademedida);

			$http.post('api/index.php/unidademedida/', $scope.json, 
						{withCredentials: true,
							headers: {'enctype': 'multipart/form-data' },
						}
			).success(function(data, status, headers, config) {
				if (data.error == '0') {
					$('#myModalUnidadeMedida').modal('hide');
					$scope.getUnidadeMedida();
					$scope.unidademedida.descricao = '';
					$scope.objeto = {}; 

					Mensagem.success(data.mensagem);

					$scope.unidademedida = {};
					$scope.unidademedida.ativo=1;
				} else {
					Mensagem.error(data.mensagem);
				}
			}).error(function(data, status) {
				// log error
			});
		}
	}


	$scope.adicionarFamilia = function(){
		if ($('#cadastroFamilia-form').valid()) {
			familia = {'descricao':$scope.descricaofamilia, 'ativo':'1'};
			$scope.json = angular.toJson(familia);
			$http.post('api/index.php/cadastrarfamilia/', $scope.json, 
				{withCredentials: true,
					headers: {'enctype': 'multipart/form-data' },
				}
			).success(function(data, status, headers, config) {
				if (data.error == '0'){
					$('#familiaItens').modal('hide');
					//$scope.getFamilia();
					$scope.descricaofamilia = data.id;
					//$scope.objeto = {}; 

					Mensagem.success(data.mensagem);

					$scope.familia = {};
					//$scope.familia.ativo=1;
				} else {
					Mensagem.error(data.mensagem);   
				}
			}).error(function(data, status) { 
				// log error
			});
		}
	}


	$scope.cadastrarFornecedor = function(obj){
		$scope.addFornecedor.id_produtos_servicos = $scope.item.id;
		$scope.addFornecedor.id_pessoa = obj.id;
		$scope.addFornecedor.id_item =  $scope.item.id
		$scope.json = angular.toJson($scope.addFornecedor);

		$http.post('api/index.php/fornecedor/', $scope.json, 
					{withCredentials: true,
						headers: {'enctype': 'multipart/form-data' },
					}
		).success(function(data, status, headers, config) {
			if (data.error == '0'){
				Mensagem.success(data.mensagem);
				$scope.getFornecedor($scope.item.id);
			} else {
				Mensagem.error(data.mensagem);
			}
		}).error(function(data, status) {
			// log error
		});
	}


	$scope.delItem = function(indiceEl, item){
		$scope.json = angular.toJson(item[indiceEl]);
		$http.post('api/index.php/delprodutosservicosfornecedor/', $scope.json, 
					{withCredentials: true,
						headers: {'enctype': 'multipart/form-data' },
					}
		).success(function(data, status, headers, config) {
			if (data.error == '0'){
				Mensagem.success(data.mensagem);
				$scope.fornecedores.splice(indiceEl,1);
			} else {
				Mensagem.error(data.mensagem);
			}
		}).error(function(data, status) {
			// log error
		});
	}


	$scope.novoCadastro = function(){
		$scope.addItem = {};
		$scope.addItem.ativo = 1;
		$scope.addItem.tipo_info = 1;
		$scope.item.id = $routeParams.id;
		$scope.fornecedores = {};
		// $scope.familia.selected = '';
		$scope.uni_med.selected = '';
		$scope.listas_depto.selecionados = [];
	}


	$scope.unidadeMedida = function(action){
		$scope.unidadeMedidaObrigatorio = action;
	}




	//$scope.getPessoa();
	//$scope.getFamilia();
	$scope.getPessoa();
	$scope.getDepartamento();
	$scope.getUnidadeMedida();
	$scope.getItem();
	$scope.getCategoria();

});