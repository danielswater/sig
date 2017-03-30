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
Data de Alteração: 19/03/2015
Autor: Luciano Almeida
*/
smartSig.registerCtrl('consultaMovimentacao', function($scope, ngTableParams, $http, $location, $filter, filterFilter, $timeout, Permissao, $routeParams,$modal, Mensagem) {
	/*
	$scope.permissoes = Permissao.validaPermissao();
	$scope.permissoes.then(function (data) {
		$scope.permissoes = data;
	}, function (status) {
		
	});
	*/
	var data1 = new Date();
	mes = data1.getMonth();

	var data2 = new Date();
	ano = data2.getFullYear();

	$scope.bordero = [];
	$scope.saldo = 0;
	$scope.conta = [];

	$scope.trocaSaldo = function () {
		if($scope.search.id_conta_bancaria == undefined){
			$scope.saldo = $scope.conta_bancaria[0].saldo_total;
		} else {
			filtro = {};
			filtro = $filter('filter')($scope.conta_bancaria, {id:$scope.search.id_conta_bancaria});  
			$scope.saldo = filtro[0].saldo;
		}
	}

	$scope.updateBordero = function (id) {
		var indice = $scope.bordero.indexOf(id);
		if(indice < 0){
			$scope.bordero.push(id);
		} else {
			$scope.bordero.splice(indice, 1);
		}
	}

	$scope.changeData = function(){
		$scope.dateAsString = $scope.select_ano.ano+'-'+$scope.select_mes.numeral+'-01';

		angular.forEach($scope.meses, function(value, key) {
			if (value.numeral == $scope.select_mes.numeral) {        
				if (key == 0) {
					$scope.select_mesant = $scope.meses[11];    
					angular.forEach($scope.anos, function(value, key) {
						if (value.ano == $scope.select_ano.ano) {        
							$scope.select_anoant = $scope.anos[key-1].ano;          
						};      
					});
				} else {
					$scope.select_mesant = $scope.meses[key-1];    
				}
			};      
		});

		// $scope.select_mesant = $scope.meses[$scope.select_mes.mes];
		// $scope.select_anoant = $scope.select_ano.ano;

		// if ($scope.select_mes.numeral == 1) {      
		// 	$scope.select_mesant = $scope.meses[11];
		// 	$scope.select_anoant = $scope.select_ano.ano-1;
		// 	console.log('log',$scope.select_mesant+" - "+$scope.select_anoant)
		// } else {
		// $scope.select_mesant = $scope.meses[mes-1];
		// }
	};

	$scope.meses = [{mes:'Janeiro', numeral: '01'},
					{mes:'Fevereiro', numeral: '02'},
					{mes:'Março', numeral: '03'},
					{mes:'Abril', numeral: '04'},
					{mes:'Maio', numeral: '05'},
					{mes:'Junho', numeral: '06'},
					{mes:'Julho', numeral: '07'},
					{mes:'Agosto', numeral: '08'},
					{mes:'Setembro', numeral: '09'},
					{mes:'Outubro', numeral: '10'},
					{mes:'Novembro', numeral: '11'},
					{mes:'Dezembro', numeral: '12'}];

	$scope.anos = [{ano:'2014'},{ano:'2015'},{ano:'2016'},{ano:'2017'},{ano:'2018'},{ano:'2019'},{ano:'2020'}];

	for(var i = 0; i < $scope.anos.length; i++){
		if($scope.anos[i].ano == ano){
			$scope.select_ano = $scope.anos[i];
		}
	}

	$scope.select_anoant = $scope.select_ano.ano;
	$scope.select_mes = $scope.meses[mes];

	if ($scope.meses[mes] == 1) {
		$scope.select_mesant = $scope.meses[11];
		$scope.select_anoant = $scope.select_ano.ano-1;
	} else {
		$scope.select_mesant = $scope.meses[mes-1];
	};

	$scope.tabs = [
		{"active":true,  "id_tipo_lancamento": 1, "nome":'Recebimentos', 		"classe":'btnmd-success',	"texto":'Adicionar novo recebimento', 		"indice":1},
		{"active":false, "id_tipo_lancamento": 2, "nome":'Despesas Fixas', 		"classe":'btnmd-danger',	"texto":'Adicionar nova despesa fixa', 		"indice":2},
		{"active":false, "id_tipo_lancamento": 3, "nome":'Despesas Variáveis', 	"classe":'btnmd-danger',	"texto":'Adicionar nova despesa variável', 	"indice":3},
		{"active":false, "id_tipo_lancamento": 4, "nome":'Pessoas', 			"classe":'btnmd-danger',	"texto":'Adicionar nova despesa a pessoas', "indice":4},
		{"active":false, "id_tipo_lancamento": 5, "nome":'Impostos', 			"classe":'btnmd-danger',	"texto":'Adicionar novo imposto', 			"indice":5},
		{"active":false, "id_tipo_lancamento": 7, "nome":'Doações', 			"classe":'btnmd-success',	"texto":'Adicionar nova doação', 			"indice":7},
		{"active":false, "id_tipo_lancamento": 6, "nome":'Transferências', 		"classe":'btnmd-info',		"texto":'Adicionar nova transferência', 	"indice":6}
	];

	$scope.search = [];

	$scope.calcSub = function() {

		tot = 0;
		filtro = {};
		filtro = $filter('filter')($scope.resumo.resumoAll, {id_tipo_lancamento:$scope.tabssel.indice});			
		if(typeof filtro !== "undefined"){
			for(var i = 0; i < filtro.length; i++){ tot += parseFloat(filtro[i].valor_final); };
			$scope.sub = tot;
		}
	}

	$scope.changeTab = function(index) {
		$scope.tabssel = $scope.tabs[index];
		$scope.calcSub();
	};

	$scope.tabssel = $scope.tabs[0];
	$scope.tabs[0].nome="Recebimentos";

	
	$scope.lancarContas = function(item) {
		$location.path('/financeiro/formMovimentacao/'+item);
	}


	$scope.editarConta = function($index) {   
		obj = $scope.resumo.resumoAll[$index];
		$location.path('/financeiro/formMovimentacao/'+obj.id_tipo_lancamento+'/'+obj.id);
	}

	$scope.gerarBordero = function() {
		if($scope.bordero.length > 0){
			$scope.json = angular.toJson($scope.bordero);
			$http.post('api/index.php/bordero/', $scope.json, 
						{withCredentials: true,
							headers: {'enctype': 'multipart/form-data' },
						}
			).success(function(data, status, headers, config) {
				if (data.error == '0'){
					Mensagem.success(data.mensagem);
					var link = document.createElement("a");
					link.setAttribute("href", 'api/index.php/gerarbordero/'+data.id_bordero);
					// link.setAttribute("download", "bordero.xls");
					link.click();
				} else {
					Mensagem.error(data.mensagem);   
				}
			}).error(function(data, status) {
				// log error
			});
		} else {
			Mensagem.error("Não foi selecionado nenhuma despesa fixa!");   
		}
	}

	$scope.removeLinha = function($index){
		$scope.resumo.resumoAll[$index].ativo = 0;
		$scope.json = angular.toJson($scope.resumo.resumoAll[$index]);

		$http.post('api/index.php/movimentacao/'+$scope.resumo.resumoAll[$index].id, $scope.json, 
					{withCredentials: true,
						headers: {'enctype': 'multipart/form-data' },
					}
		).success(function(data, status, headers, config) {
			if (data.error == '0') {
				Mensagem.success(data.mensagem);   

				$scope.resumo.resumoAll.splice($index, 1);

			} else {
				Mensagem.error(data.mensagem);   
			}
		}).error(function(data, status) { 
			// log error
		});
	}

	$scope.id_tipo = 1;
	$scope.resumo = {};
	$scope.selectedDays = [];
	$scope.selectedDate = {};
	$scope.dateAsString = $scope.select_ano.ano+'-'+$scope.select_mes.numeral+'-01';


	$scope.principal = function(){

		$http.get('api/index.php/resumofinanceiro/'+$scope.dateAsString).
		success(function(data, status, headers, config) {
			if (data.error == -1) {
				Mensagem.warning(data.mensagem); 
			};

			console.log("RESUMO", data);

			$scope.resumo  = data;
			
			$scope.percentDebito 			= $scope.resumo.percentuais[0].perc_saidas_totais;
			$scope.percentCredito 			= $scope.resumo.percentuais[0].perc_recebimento;
			$scope.percentDespesaFixa 		= $scope.resumo.percentuais[0].perc_despesas_fixas;
			$scope.percentDespesaVariavel 	= $scope.resumo.percentuais[0].perc_despesas_variaveis;

			/*
			$scope.total = $scope.resumo.debitos+$scope.resumo.creditos+$scope.resumo.despesaFixa+$scope.resumo.despesaVariavel;
			$scope.percentDebito = ($scope.resumo.debitos/$scope.total)*100;           
			$scope.percentCredito = ($scope.resumo.creditos/$scope.total)*100;     
			$scope.percentDespesaFixa = ($scope.resumo.despesaFixa/$scope.total)*100;   
			$scope.percentDespesaVariavel = ($scope.resumo.despesaVariavel/$scope.total)*100;   
			*/			
			// $scope.percent = ($scope.resumo.debitosRealizados*100)/$scope.resumo.debitos;    
			// $scope.percent2 = ($scope.resumo.creditosRealizados*100)/$scope.resumo.creditos;    

			// if($scope.resumo.despesaFixa > $scope.resumo.despesaFixa_anterior){
			// $scope.percent3 = (($scope.resumo.despesaFixa+$scope.resumo.despesaFixa_anterior)*100)/$scope.resumo.despesaFixa;
			// }else{
			// $scope.percent3 = Math.abs((($scope.resumo.despesaFixa-$scope.resumo.despesaFixa_anterior)*100)/$scope.resumo.despesaFixa_anterior);
			// $scope.percent3 = 100 - $scope.percent3;
			// }

			// if($scope.resumo.despesaVariavel > $scope.resumo.despesaVariavel_anterior){
			// $scope.percent4 = (($scope.resumo.despesaVariavel+$scope.resumo.despesaVariavel_anterior)*100)/$scope.resumo.despesaVariavel;  
			// }else{
			// $scope.percent4 = Math.abs((($scope.resumo.despesaVariavel-$scope.resumo.despesaVariavel_anterior)*100)/$scope.resumo.despesaVariavel_anterior);
			// $scope.percent4 = 100 - $scope.percent4;
			// }

			// if($scope.resumo.creditos > $scope.resumo.creditos_anterior){
			// $scope.percent5 = (($scope.resumo.creditos-$scope.resumo.creditos_anterior)/ $scope.resumo.creditos)*100;
			// $scope.percent5 = 100 - $scope.percent5;
			// }else{
			// $scope.percent5 = Math.abs((($scope.resumo.creditos-$scope.resumo.creditos_anterior)*100)/$scope.resumo.creditos_anterior);
			// $scope.percent5 = 100 - $scope.percent4;
			// }

			$scope.calcSub();			
		}).
		error(function(data, status, headers, config) {});
	}

	$scope.$watch("dateAsString", function(){

		$scope.principal();
	});

	$scope.logInfos = function(event, date) {
		event.preventDefault() // prevent the select to happen
		//reproduce the standard behavior
		if(event.type == 'click') {      
			$scope.selectedDate = $scope.resumo.resumo[moment(date).format('DD')];
		}
	}

	$scope.changeCategoria = function(obj){
		$scope.search.id_categoria = obj.id;
	}

	$scope.changePessoa = function(obj){
		$scope.search.id_pessoa = obj.id;
	}

	$scope.changeCentroCusto = function(obj){
		$scope.search.id_centro_custo = obj.id;
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

	$scope.getItens = function(){
		$http.get('api/index.php/produtosfornecedores/').
		success(function(data, status, headers, config) {
			$scope.itens = data;
		}).
		error(function(data, status, headers, config) {
			// log error
		});
	}

	$scope.changeItem = function(item){
		$scope.fornecedores = item.fornecedores;
	}

	$scope.getSituacao = function(){
		$http.get('api/index.php/situacao/').    
		success(function(data, status, headers, config) {                           
			$scope.situacao = data.situacao;
		}).
		error(function(data, status, headers, config) {
			// log error
		}); 
	}

	$scope.alterarBaixa = function($index){
		$scope.json = angular.toJson($scope.resumo.resumoAll[$index]);

		$.SmartMessageBox(
		{
			title : "Alterar Situação",
			content : "Tem certeza que deseja alterar o status da situação?",
			buttons : '[Não][Sim]'
		}, function(ButtonPressed) {
			if (ButtonPressed == "Sim") {
				$http.post('api/index.php/updatesituacaomobimentacao/'+$scope.resumo.resumoAll[$index].id, $scope.json,
					{withCredentials: true,
						headers: {'enctype': 'multipart/form-data' },
							// transformRequest: angular.identity
						})
				.success(function(data, status, headers, config) {
					if (data.error == '0'){
						console.log('DATA', data);
						Mensagem.success(data.mensagem);
						$scope.principal();
					}
					else {
						Mensagem.error(data.mensagem);
					}
				})
				.error(function(data, status) {
					//log erro
				});
			}
		});

	}


	$scope.getCentroCusto = function(){
		$http.get('api/index.php/consultacentrocusto/1').    
		success(function(data, status, headers, config) {                           
			$scope.centro_custo = data.centro_custo;
		}).
		error(function(data, status, headers, config) {
			// log error
		});
	}

	$scope.getPessoaMovimento = function(objeto) {
		
		var params = {objeto: objeto, sensor: false};
		if (objeto.length < 0) {
			objeto = "a";
		};
		return $http.get('api/index.php/stringpessoa?associado=0&string='+objeto,
			{params: params}
			).then(function(response) {          
				$scope.pessoas = response.data['pessoa']
			});

	};

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
			$scope.conta_bancaria = data.contabancaria;
			$scope.saldo = data.contabancaria[0].saldo_total;
		})
		.error(function(data, status, headers, config) {}); 
	}
	$scope.getContaBancaria();

	$scope.getTransferencia = function(){
		$http.get('api/index.php/transferencia')
		.success(function(data, status, headers, config) {
			$scope.transferencias = data.retorno;
		})
		.error(function(data, status, headers, config) {});
	}
	$scope.getTransferencia();


    $scope.removeTransferencia = function(idx,item){    

      $tmp = {};	
      $tmp.id = item.id;
      $scope.json = angular.toJson($tmp);

      $http.post('api/index.php/deltransferencia/', $scope.json,{withCredentials: true,headers: {'enctype': 'multipart/form-data' },})      
      .success(function(data, status, headers, config) {
        $scope.transferencias.splice(idx, 1);
		Mensagem.success('Transferência excluída com sucesso!'); 
		$scope.principal();

      }).error(function(data, status, headers, config) { });
    }

	$scope.editarTransferencia = function(idx,item){

		$location.path('/financeiro/formMovimentacao/6/'+item.id);
	}	

	$scope.getCategoria();
	$scope.getItens();
	$scope.getSituacao();
	$scope.getCentroCusto();
	$scope.getContaBancaria();


    $scope.currentPage = 1;
    $scope.pageSize = 10;    

    $scope.sort = ($scope.tabssel.indice!=6) ? { active: 'descricao', descending: undefined } : { active: 'transferencia_descricao', descending: undefined };

    $scope.changeSorting = function(column) {
        var sort = $scope.sort;
        if (sort.active == column) {
            sort.descending = !sort.descending;    
        } else {
            sort.active = column;
            sort.descending = false;
        }
    };

    $scope.getIcon = function(column) {        
        var sort = $scope.sort;        
        if (sort.active == column) {
          return sort.descending
            ? 'glyphicon-chevron-up'
            : 'glyphicon-chevron-down';
        }        
        return 'glyphicon-star';
    }
});
//@ sourceURL=controller.consultaMovimentacao.js