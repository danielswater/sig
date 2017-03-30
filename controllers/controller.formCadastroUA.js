smartSig.registerCtrl('formCadastroUA', function($scope, ngTableParams, $http, $location, $filter, filterFilter, Mensagem, $routeParams, $timeout, Permissao) {

	$scope.permissoes = Permissao.validaPermissao();

	$scope.permissoes.then(function (data) {
		$scope.permissoes = data;
	}, function (status) {
	});

	var idJazigo = $routeParams.id;

	$scope.pessoa = {};
	$scope.pessoa.isento = 0;
	$scope.pessoa.situacao = 1;
	$scope.pessoa.mensagem = {};
	$scope.pessoa.cobranca;
	$scope.formapagamento;
	$scope.pessoa.id_jazigo;
	$scope.pessoa.id_manutencao;
	$scope.pessoa.id_venda;
	$scope.pessoa.valor_manutencao;
	$scope.gavetas = [];
	$scope.mostra_nome_responsavel='';
	$scope.addCausaMortis = {};

	$scope.falecidos = [];
	
	$scope.objeto = [];
	//Planos de Unidade de Armazenagem
	$scope.ua = {};
	$scope.ua.status = 1;

	$http.get('api/index.php/uaplanos/').
	success(function(data, status, headers, config) {
		$scope.planos = data;
	}).
	error(function(data, status, headers, config) {
		// log error
	});

	//Tipos de Unidade de Armazenagem
	$scope.unidade = {};
	$http.get('api/index.php/tiposunidadearmazenagem/').
	success(function(data, status, headers, config) {
		$scope.unidade.tipos = data;
	}).
	error(function(data, status, headers, config) {
		// log error
	});

	//Tipos de Concessão
	$scope.concessao = {};
	$http.get('api/index.php/tipoconcessao/').
	success(function(data, status, headers, config) {
		$scope.concessao.tipos = data;
	}).
	error(function(data, status, headers, config) {
		// log error
	});

	//Quadra
	$scope.quadra = {};
	$http.get('api/index.php/quadra/').
	success(function(data, status, headers, config) {
		$scope.quadra.quadras = data.quadra;
	}).
	error(function(data, status, headers, config) {
		// log error
	});

	//Periodicidade de Cobrança
	$scope.periodicidade = {};
	$http.get('api/index.php/periodicidadecobranca/').
	success(function(data, status, headers, config) {
		$scope.periodicidade.tipos = data;
	}).
	error(function(data, status, headers, config) {
		// log error
	});

	//Status das Gavetas
	$scope.gaveta = {};	
	$scope.gaveta.ativo = 1
	$http.get('api/index.php/statusgaveta/').
	success(function(data, status, headers, config) {
		$scope.ocupacao = data;
	}).
	error(function(data, status, headers, config) {
		// log error
	});

	//Select 2
	$scope.disabled = undefined;

	$scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd/MM/yyyy', 'shortDate'];
	$scope.format = $scope.formats[2];

	/*Validar datas*/
	$scope.$watch('ua.data_fim_armazenamento', function(){  
		$scope.ua.data_fim_armazenamento1 = $scope.ua.data_fim_armazenamento;     
		if($scope.ua.data_fim_armazenamento1 != undefined || $scope.ua.data_fim_armazenamento1 != null){              
			$( "em[for='data_fim_armazenamento']" ).css("display","none"); 
		}
	});
	$scope.$watch('pessoa.data_concessao', function(){  
		$scope.pessoa.data_concessao1 = $scope.pessoa.data_concessao;     
		if($scope.pessoa.data_concessao1 != undefined || $scope.pessoa.data_concessao1 != null){              
			$( "em[for='data_concessao']" ).css("display","none"); 
		}
	});
	$scope.$watch('pessoa.data_contrato', function(){  
		$scope.pessoa.data_contrato1 = $scope.pessoa.data_contrato;     
		if($scope.pessoa.data_contrato1 != undefined || $scope.pessoa.data_contrato1 != null){              
			$( "em[for='data_contrato']" ).css("display","none"); 
		}
	});  

	$scope.$watch('gaveta.data_vencimento_gaveta', function(){  
		$scope.gaveta.data_vencimento_gaveta1 = $scope.gaveta.data_vencimento_gaveta;     
		if($scope.gaveta.data_vencimento_gaveta1 != undefined || $scope.gaveta.data_vencimento_gaveta1 != null){              
			$( "em[for='data_vencimento_gaveta']" ).css("display","none"); 
		}
	});  
	/*fim Calendario*/

	$scope.changeSocio = function(obj){
		//$scope.xxx.yyy = obj.id;		
		$( "em[for='Select2']" ).css("display","none");
	}

	$scope.mensagemSuccess = function(contentMensagem) {
		Mensagem.success(contentMensagem);
	}

	$scope.mensagemError = function(contentMensagem) {
		Mensagem.error(contentMensagem);
	}
	
	//Lotes
	$scope.quadraLote = function(id_quadra){
		if(id_quadra != '' || $scope.ua.quadra != ''){
			if(id_quadra == ''){
				id_quadra = $scope.ua.quadra;
			}

			$scope.lote = {};
			$http.get('api/index.php/carregaquadralote/' + id_quadra).
			success(function(data, status, headers, config) {
				$scope.lote.lotes = data.lote;
			}).
			error(function(data, status, headers, config) {
				// log error
			});
		}else{
			$scope.lote.lotes = [];
		}
	}
	
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
		var params = {
			objeto: objeto,
			sensor: false
		};
		if (objeto.length < 0) {
			objeto = "a";
		};

		// FRH - Trazer proprietários e responsáveis
		/*
		$http.get('api/index.php/carregapessoa/17')
		.success(function(data, status, headers, config) {
			$scope.socios  = data.pessoa;
		})
		.error(function(data, status, headers, config) {});
		*/
		
		//associado=5 é proprietario
		return $http.get('api/index.php/stringpessoa?todos=0&responsavel_proprietario=1&string=' + objeto, {params: params})
		.then(function(response) {			
			$scope.socios = [];
			$scope.socios = response.data['pessoa'];
		});
	};

	$scope.salvaUnidadeArmazenagem = function() {

		if ($("#cadastroUA-form").valid()) {

			$scope.json = angular.toJson($scope.ua);
			$http.post('api/index.php/unidadearmazenagem/', $scope.json, {
				withCredentials: true,
				headers: {
					'enctype': 'multipart/form-data'
				},
			}).success(function(data, status, headers, config) {
				if (data.error == '0') {
					$scope.ua.id = data.ua
					$scope.pessoa.id_ua = data.ua;
					$scope.gaveta.id_ua = data.ua;
					$scope.pessoa.id_jazigo = data.ua;
					$scope.pessoa.cobranca = $scope.ua.periodicidade;
					//$scope.pessoa.id_venda = ua.id_venda
					//$scope.pessoa.cobranca = data.
					Mensagem.success(data.mensagem);

					$("#salvaGaveta").removeAttr('disabled');
					$("#salvaPessoa").removeAttr('disabled');
					$("#novoFalecido").removeAttr('disabled');
					
					//$("#salva_unidade_armazenagem").attr({disabled: 'true'});
				} else {
					Mensagem.error(data.mensagem);
				}
			}).error(function(data, status) {

			});
		}
	}

	$scope.salvaPessoas = function(objeto) {
		$scope.pessoa.id_pessoa = objeto.id;

		$http.get('api/index.php/getresponsaveljazigo/'+objeto.id)
		.success(function(data, status, headers, config) {
			$scope.mostra_nome_responsavel = data.proprietario_responsavel.split('%')[1];
		})
		.error(function(data, status, headers, config) {}); 
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

	$scope.getTipoPlanoUa = function(){

		$http.get('api/index.php/tipoplanoua/').    
		success(function(data, status, headers, config) {                           
			$scope.tipo_plano_ua = data.tipo_plano_ua;
		}).
		error(function(data, status, headers, config) {
          // log error
      }); 
	}     

	$scope.getTipoPlano = function(){
		if($scope.ua.plano == 2){
			$scope.pessoa.mensagem = "O valor deve ser igual a 1 salário mínimo anual";
		}
		if($scope.ua.plano == 1){
			$scope.pessoa.mensagem = "O valor deve ser igual a 2 salários mínimos anuais";
		}
		if($scope.ua.plano == null){
			$scope.pessoa.mensagem = "";
		}
	}

	$scope.salvaPessoa = function() {

		if ($("#form_unidade_armazenagem_pessoa").valid()) {
			
			$scope.pessoa.id_ua = $scope.ua.id;
			$scope.json = angular.toJson($scope.pessoa);

			$http.post('api/index.php/unidadearmazenagempessoas/', $scope.json, {
				withCredentials: true,
				headers: {
					'enctype': 'multipart/form-data'
				},
			}).success(function(data, status, headers, config) {
				if (data.error == '0') {
					Mensagem.success(data.mensagem);
					// $("#salvaGaveta").removeAttr('disabled');
					// $("#salvaPessoa").attr({
					// 	disabled: 'true'
					// });
			$scope.pessoa.show_buttom = true;
		} else {
			Mensagem.error(data.mensagem);
		}
	}).error(function(data, status) {

	});

}
}

$scope.getListaRecibo = function(){
	$http.get('api/index.php/recibo/').    
	success(function(data, status, headers, config) {                                 
		$scope.recibo  = data;

	}).
	error(function(data, status, headers, config) {
	      // log error
	  });        
}

$scope.getListaContrato = function(){
	$http.get('api/index.php/listarcontrato/').    
	success(function(data, status, headers, config) {                                 
		$scope.lista_contrato  = data;

	}).
	error(function(data, status, headers, config) {
		// log error
	});        
}

$scope.salvaGaveta = function() {
	
	$scope.json = angular.toJson($scope.gaveta);		

	if ($('#form_unidade_armazenagem_gavetas').valid()) {


		$http.post('api/index.php/unidadearmazenagemgavetas/', $scope.json, {
			withCredentials: true,
			headers: {
				'enctype': 'multipart/form-data'
			},
		}).success(function(data, status, headers, config) {					
			if (data.error == '0') {
				Mensagem.success(data.mensagem);

				$scope.gaveta = {};
				$scope.gaveta.ativo = 1
				$scope.gaveta.id_unidade_armazenagem = $scope.ua.id;

				$scope.getGavetas();
				$scope.getFalecidoGaveta();

			} else {
				Mensagem.error(data.mensagem);
			}
		}).error(function(data, status) {

		});

	}		
}

$scope.delGaveta = function(obj) {

	$http.post('api/index.php/delgavetas/' + obj, $scope.json, {
		withCredentials: true,
		headers: {
			'enctype': 'multipart/form-data'
		},
	}).success(function(data, status, headers, config) {
		if (data.error == '0') {
			Mensagem.success(data.mensagem);
			$scope.getGavetas();

		} else {
			Mensagem.error(data.mensagem);
		}
	}).error(function(data, status) {

	});
}



$scope.getIdJazigo = function() {

	$scope.pessoa.id_jazigo = idJazigo;

	$http.get('api/index.php/unidadearmazenagem/' + idJazigo).
	success(function(data, status, headers, config) {
		$scope.quadraLote(data.id_quadra);

		$scope.ua.id = data.id;
		$scope.ua.plano = data.id_plano_unidade_armazenagem;
		$scope.ua.unidade = data.id_tipo_unidade_armazenagem;
		$scope.ua.concessao = data.id_tipo_concessao;
		$scope.ua.quadra = data.id_quadra;
		$scope.ua.periodicidade = data.id_periodicidade_cobranca;
		$scope.ua.descricao = data.descricao;
		$scope.ua.tumulo = data.numero_tumulo;
		$scope.ua.data_fim_armazenamento = data.data_fim_armazenagem;
		$scope.ua.status = data.ativo;
		$scope.gaveta.id_unidade_armazenagem = data.id;

		$timeout(function(){
			$scope.ua.lote = parseFloat(data.id_lote);
		}, 500);
	}).
	error(function(data, status, headers, config) {
			// log error
		});
}

$scope.getUnidadeArmazenagemPessoa = function() {
	$http.get('api/index.php/unidadearmazenagempessoas/' + idJazigo).
	success(function(data, status, headers, config) {

		$("#salvaPessoa").removeAttr('disabled');
		if (data.pessoa_nome) {
			$scope.objeto = {
				selected: data.pessoa_nome
			};
		}
		$scope.pessoa.id_ua = data.id_unidade_armazenagem;
		$scope.pessoa.id = data.id;
		$scope.pessoa.data_concessao = data.data_concessao;
		$scope.pessoa.data_contrato = data.data_contrato;
		$scope.pessoa.valor = data.valor;
		if (data.isento != null) {
			$scope.pessoa.isento = data.isento;
		} else {
			$scope.pessoa.isento = 0;
		}
		$scope.pessoa.ativo = data.ativo;
		if (data.id_pessoa!=null) {
			$scope.pessoa.show_buttom = true;
		}
		$scope.pessoa.id_pessoa = data.id_pessoa;
		$scope.pessoa.valor_manutencao = data.valor_manutencao;
		$scope.pessoa.id_forma_pagamento = data.forma_pagamento;
		$scope.pessoa.id_tipo_plano_ua = data.id_tipo_plano_ua;

	}).
	error(function(data, status, headers, config) {
			// log error
		});
}

$scope.getGavetas = function() {

	if (idJazigo==undefined) {
		idJazigo = $scope.gaveta.id_unidade_armazenagem;
	}

	$http.get('api/index.php/unidadearmazenagemgavetas/' + idJazigo).
	success(function(data, status, headers, config) {
		$("#salvaGaveta").removeAttr('disabled');
		$("#novoFalecido").removeAttr('disabled');

		if (data[0].mensagem!="Nenhuma gaveta encontrada.") {
			$scope.gavetas = data;
		} else {
			$scope.gavetas = [];
		}		

	}).
	error(function(data, status, headers, config) {
			// log error
		});
}

$scope.getFalecidoGaveta = function(){
	$http.get('api/index.php/falecidogaveta/').    
	success(function(data, status, headers, config) {
		$scope.falecidos  = data;
		console.log('falecido', $scope.falecidos);
	}).
	error(function(data, status, headers, config) {
	});        
}

/*Calendario*/
$scope.open = function($event,opened) {
	$event.preventDefault();
	$event.stopPropagation();

	$scope[opened] = true;
}; 

$scope.editarGaveta = function(gaveta){		
	$scope.gaveta = gaveta;
}

$scope.excluirGaveta = function(){

	$scope.json = angular.toJson($scope.ua.id);

	$.SmartMessageBox({title : "Excluir Jazigo",content : "Tem certeza que deseja excluir?",buttons : '[Não][Sim]'}, 

		function(ButtonPressed) {

			if (ButtonPressed == "Sim") {

				$http.post('api/index.php/deljazigo/', $scope.json,{withCredentials: true,headers: {'enctype': 'multipart/form-data' },})
				.success(function(data, status, headers, config) {
					Mensagem.success(data.mensagem);
					$scope.novoCadastro();  						
				})
				.error(function(data, status) {
					Mensagem.error('Erro na exclusão do Registro');
				});
			}
		}
		)
}

	$scope.setarCausaMortisSelecionado = function(item, select) {
		if(item.length > 0){
			var nivel = item.length - 1;
			if(item[nivel].id==-1){
				$scope.modalNovoCausaMortis();          
				item.pop();
			}else{
				$scope.falecido.causa_mortis = item;
			}
		}
	}

	$scope.causamortis_uis=[];
	$scope.causamortis_uis.selecionados=[];

	$scope.refreshCausaMortis = function(falecido) {      
		$http.get('api/index.php/stringcausamortis').success(function(data, status, headers, config) {
			if(data[0].error != -1){
				$scope.causamortis = data;
				angular.forEach(data, function(value, key) {
					angular.forEach(falecido, function(value2, key2) {
						if(value.id == value2.id){                
							$scope.causamortis_uis.selecionados.push(data[key]);
						}
					});
				});
			}
		})
		.error(function(data, status, headers, config) {});      
	};

	$scope.modalNovoCausaMortis = function(size){
		$('#myModalCausaMortis').modal('show');
	}

$scope.salvaCausaMortis = function(){

	if ($('#formCausaMortis').valid()) {
		$scope.addCausaMortis.ativo = 1;
		$scope.json = angular.toJson($scope.addCausaMortis);

		$http.post('api/index.php/causamortis/', $scope.json, {withCredentials: true, headers: {'enctype': 'multipart/form-data' },})
		.success(function(data, status, headers, config) {
			if (data.error == '0'){  
				Mensagem.success(data.mensagem);

				$('#myModalCausaMortis').modal('hide');

				$scope.refreshCausaMortis();
				$scope.addCausaMortis = {};                

			} else {              
				Mensagem.error(data.mensagem);   
			}
		}).error(function(data, status) { });
	}
}

$scope.incluiFalecido = function(){
	$('#myModalFalecido').modal();
}

$('#myModalFalecido').on('hide.bs.modal', function(e){
	$scope.getFalecidoGaveta();
});

$scope.novoCadastro = function(){
	$scope.ua = {};
	$scope.ua.status = 1;

	$scope.objeto.selected = '';

	$scope.pessoa = {};
	$scope.pessoa.isento = 0;
	$scope.pessoa.situacao = 1;
	$scope.pessoa.mensagem = '';
	$scope.pessoa.cobranca;
	$scope.formapagamento;
	$scope.pessoa.id_jazigo;
	$scope.pessoa.id_manutencao;
	$scope.pessoa.id_venda;
	$scope.pessoa.valor_manutencao;

	$scope.gaveta = {};
	$scope.gaveta.situacao = "1";

	$scope.gavetas = {};
}

$scope.getFormaPagamento();
$scope.getTipoPlanoUa();

if (idJazigo != undefined) {
	$timeout(function() {			
		$scope.getIdJazigo();
		$scope.getUnidadeArmazenagemPessoa();			
		$scope.getGavetas();
	}, 800);
};

$scope.pessoa.mensagem = "";	

$scope.getListaRecibo();
$scope.getListaContrato();
$scope.getFalecidoGaveta();

});
//@ sourceURL=controller.formCadastroUA.js