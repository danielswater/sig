  /*
  Módulo: Mesquita
  Descrição: CRUD Gerar Boleto
  Método: GET
  URL: /financeiro/formCadastroGerarBoleto
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 15/06/2015
  Autor: Fabio da Silva
  Versão: 1.0
 */
smartSig.registerCtrl("formCadastroGerarBoleto", function($scope, $location, $http, $routeParams, Mensagem, $timeout, Permissao, $modal, $filter){

	$scope.permissoes = Permissao.validaPermissao();
	
	$scope.permissoes.then(function (data) {
		$scope.permissoes = data;
	}, function (status) {
		console.log('status',status);
	});

	var idBoleto = $routeParams.id;
	var processado = 0;

	$scope.boleto = {};
	$scope.boletos = {};
	$scope.processo = 0;

	$scope.boleto.total = 0;

	$scope.responsaveis = [];
	$scope.responsavel = [];

	$scope.error = '';  

	$scope.tipos_carnes = {};
	
	$scope.getTipoCarne = function(){
	  $http.get('api/index.php/tipocarne/')
	  .success(function(data, status, headers, config) {
		$scope.tipos_carnes = data.tipo_carne;
	  })
	  .error(function(data, status, headers, config) { });
	}

	$scope.truncar = function(valor){
		return Math.trunc(valor);
	}
	

	$scope.getResponsavel = function(){
	  $http.get('api/index.php/parcelaresponsavel/')
	  .success(function(data, status, headers, config) {
		$scope.responsaveis = data.parcela_responsavel;
	  })
	  .error(function(data, status, headers, config) { });
	}

	$scope.progressBar = function(valor) {
	  processado = processado + valor;
	  $scope.processo = processado / $scope.boleto.total * 100;
	}

	$scope.novoBoleto = function() {  
	  $scope.boleto = {};
	  $scope.boleto.tipo = 1;
	}

	$scope.cadastrarBoleto = function() {  

		verifica_resposaveis = Array();
		$scope.boletos = {};
		$scope.processo = 0;
		processado = 0;

		if ($('#cadastroBoleto-form').valid()) {
			
  			var mes = parseInt($scope.boleto.mes_ano.substring(0,2));
			var ano = $scope.boleto.mes_ano.substring(3,7);

  			verifica_resposaveis = $filter('filter')($scope.responsaveis, function(item){ 
				if(item.ano == ano && item.mes == mes){
					return item;
				}
			});
			
			if(verifica_resposaveis.length == 0){
				Mensagem.error('Não a parcela gerada para o mês e ano selecionado!');
				return;	
			}
		  	
			if($scope.boleto.id_responsavel != '' && $scope.boleto.id_responsavel != undefined){
				$scope.boleto.total = 1;
				$scope.boleto.pacote = 1;
			}else{
				$scope.boleto.total = verifica_resposaveis.length;
				$scope.boleto.pacote = 10;// Numero de itens a ser executado no pacote
			}

			var pct = $scope.boleto.pacote;
			$scope.boleto.posicao = 0;

			console.log('total', $scope.boleto.total);
			console.log('pacote', pct);

			aBoleto = Array();
			b = 0;
			for(var a=0; a < $scope.boleto.total; a=a+pct){
				b++;
				console.log('passagem', a);

				$scope.boleto.posicao = a;
				  
				$scope.json = angular.toJson($scope.boleto);

				$('#myModalBoleto').modal({backdrop: 'static'}); // abre um boleto statico que impede o fechamento do modal

				$http.post('api/index.php/gerarboleto/', $scope.json, {
							 	withCredentials: true,
							 	headers: {'enctype': 'multipart/form-data' },
							 
				}).success(function(data, status, headers, config) {
					$scope.progressBar($scope.boleto.pacote);

					if (data.error == '0'){ 
						console.log('verdadeiro', a); 
						data.boleto.forEach(function (value, key) {
							aBoleto.unshift(value);
						});
						
						$scope.boletos = aBoleto;
					}else{
						console.log('falso', a);
						Mensagem.error(data.mensagem);
					}
				}).error(function(data, status) {
				  	$scope.progressBar($scope.boleto.pacote);
				});
			}
			console.log('final', b);
		}
	}   

	$scope.boletoDownload = function(id_responsavel) {

		if ($('#cadastroBoleto-form').valid()) {
			/*
			$scope.json = angular.toJson($scope.boletos);

			$http.post('api/index.php/visualizararquivoboleto/'+dt_mes_ano, $scope.json, {
						 	withCredentials: true,
						 	headers: {'enctype': 'multipart/form-data' },
						 
			}).success(function(data, status, headers, config) {
			}).error(function(data, status) {});*/

			var dt_mes_ano = $scope.boleto.mes_ano; 
			dt_mes_ano = dt_mes_ano.replace("/", "-");

			var link = document.createElement("a");
			link.setAttribute("href", 'api/index.php/visualizararquivoboleto/'+dt_mes_ano+'/'+id_responsavel);		
			link.setAttribute("target", "_blank");
			//link.setAttribute("download", "boletos.pdf");
			link.click();
			
		}
	}

	$scope.verificarAcaoResponsavel = function(item) {
	  $scope.boleto.id_responsavel = item.id_responsavel;
	  $( "em[for='id_responsavel']" ).css("display","none");    
	}
	/*
	$scope.$watch('boleto.mes_ano', function(){  
	  $scope.boleto.mes_ano1 = $scope.boleto.mes_ano;     
	  if($scope.boleto.mes_ano1 != undefined || $scope.boleto.mes_ano1 != null){              
		$( "em[for='mes_ano']" ).css("display","none"); 
	  }
	});
	*/
	/*
    $scope.$watch('boleto.mes_ano', function(){ 
      $scope.boleto.mes_ano1 = $scope.boleto.mes_ano;     
      if($scope.boleto.mes_ano1 != undefined || $scope.boleto.mes_ano != null){
        $( "em[for='bl_mes_ano']" ).css("display","none");
      }
    });
  */

	$scope.$watch('boleto.tipo', function(){  
	  if($scope.boleto.tipo == 1){
		$scope.boleto.id_responsavel = '';
		$scope.responsavel.selected = '';
		$( "em[for='id_responsavel']" ).css("display","none");    
	  }
	});

	$scope.$watch('processo', function(){  
		if($scope.processo >= 100 && $scope.boleto.total >= 1){
		 	$('#myModalBoleto').modal('hide');
		}
	});

	// $scope.$watch('boletos', function(){  
	//   if($scope.boletos.length > 0 && $scope.boleto.total > 1){
	// 	$('#myModalBoleto').modal({backdrop: 'static'});
	//   }
	// });

	$scope.getTipoCarne();
	$scope.getResponsavel();
	$scope.novoBoleto();
	
	if (idBoleto != undefined) {
	}; 
});
//@ sourceURL=controller.formCadastroGerarBoleto.js