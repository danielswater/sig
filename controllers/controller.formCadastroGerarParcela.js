  /*
  Módulo: Mesquita
  Descrição: CRUD Gerar Parcela
  Método: GET
  URL: /financeiro/formCadastroGerarParcela
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 15/06/2015
  Autor: Fabio da Silva
  Versão: 1.0
 */
smartSig.registerCtrl("formCadastroGerarParcela", function($scope, $location, $http, $routeParams, Mensagem, $timeout, Permissao, $modal, $filter){

	$scope.permissoes = Permissao.validaPermissao();
	
	$scope.permissoes.then(function (data) {
		$scope.permissoes = data;
	}, function (status) {
		console.log('status',status);
	});

	var idParcela = $routeParams.id;
	var processado = 0;

	$scope.parcela = {};
	$scope.parcelas = {};
	$scope.processo = 0;

	$scope.alunos = [];
	$scope.aluno = [];
	$scope.detalheParcela = [];

	$scope.parcelaAlunos = {};
	$scope.parcelaAluno = {};

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

	$scope.getAluno = function(id_tipo_carne, ano_mes){
	  $http.get('api/index.php/matricula/')
	  .success(function(data, status, headers, config) {
		$scope.alunos = data.matricula;
	  })
	  .error(function(data, status, headers, config) { });
	}

	$scope.getParcelaAluno = function(id_tipo_carne, ano_mes){
	  $http.get('api/index.php/parcelaaluno/')
	  .success(function(data, status, headers, config) {
		$scope.parcelaAlunos = data.parcela_aluno;
	  })
	  .error(function(data, status, headers, config) { });
	}

	$scope.VisualizarParcela = function() {  
	  if ($('#cadastroParcela-form').valid()) {
	  	$scope.getParcelaAluno();
	  }
	}

	$scope.progressBar = function(valor) {
	  processado = processado + valor;
	  $scope.processo = processado / $scope.parcela.total * 100;
	}

	$scope.novoParcela = function() {  
	  $scope.parcela = {};
	  $scope.parcela.tipo = 1;
	}

	$scope.cadastrarParcela = function() {  

	  $scope.parcelas = {};
	  $scope.processo = 0;
	  processado = 0;	  
	
	  if (typeof $scope.alunos === 'undefined' || $scope.alunos.length == 0) {
	  	//if ($scope.alunos.length > 0) {		  
		  Mensagem.error('Não foi encontrado aluno matriculado');   
		  return;
		//}
	  }

	  if ($('#cadastroParcela-form').valid()) {
	  	$scope.parcela.total = $scope.alunos.length;
		$scope.parcela.pacote = 30; // Numero de itens a ser executado no pacote
		if(typeof $scope.parcela.id_aluno != 'undefined'){
			if($scope.parcela.id_aluno != ''){
			  $scope.parcela.total = 1;
			  $scope.parcela.pacote = 1;
			}
		}
		var pct = $scope.parcela.pacote;
		$scope.parcela.posicao = 0;

		aParcela = Array();
		
		for(var a=0; a < $scope.parcela.total; a=a+pct){
		  
		  $scope.parcela.posicao = a;		  
		  $scope.json = angular.toJson($scope.parcela);

		  $http.post('api/index.php/gerarparcela/', $scope.json, 
										 {withCredentials: true,
										 headers: {'enctype': 'multipart/form-data' },
										 }
		  ).success(function(data, status, headers, config) {
			 if (data.error == '0')
			 {   
				$scope.progressBar(data.processado);

				data.parcela.forEach(function (value, key) {
				  aParcela.unshift(value);
				});
				
				$scope.parcelas = aParcela;
			 }
			 else
			 {
				Mensagem.error(data.mensagem);   
				$scope.progressBar($scope.parcela.pacote);
			 }
		  }).error(function(data, status) {
		  	$scope.progressBar($scope.parcela.pacote);
		  });
		}
	  }
	}  

	$scope.verificarAcaoAluno = function(item) {
	  $scope.parcela.id_aluno = item.id_aluno;
	  $( "em[for='id_aluno']" ).css("display","none");    
	}


	$scope.$watch('parcela.tipo', function(){  
	  if($scope.parcela.tipo == 1){
		$scope.parcela.id_aluno = '';
		$scope.aluno.selected = '';
		$( "em[for='id_aluno']" ).css("display","none");    
	  }
	});

	$scope.$watch('parcelas', function(){  
	  if($scope.parcelas.length > 0 && $scope.parcela.total > 1){
		$('#myModalParcela').modal({backdrop: 'static'});
	  }
	});

	$scope.$watch('processo', function(){  
		if($scope.processo == 100 && $scope.parcela.total >= 1){
			var parcelasErrer = $filter('filter')($scope.parcelas, {status:false});
			
		 	$('#myModalParcela').modal('hide');

		 	if(parcelasErrer.length > 0){
		 		$scope.parcelas = parcelasErrer;
		 		$('#myModalParcelaError').modal('show');

		 		$('#myModalParcelaError').on('hide.bs.modal', function(e){
		 			$('body').find('.modal-backdrop').each(function(){
		 				if($(this).hasClass('fade') && $(this).hasClass('in')){
		 					$(this).removeClass('fade');
		 					$(this).removeClass('in');
		 					$('#myModalParcela').modal('hide');
		 				}
		 			});
		 		});

		 	}
		 	
		 	$scope.getParcelaAluno();
		}
	});

	$scope.editCadastro = function(indice, item){
		/*$http.get('api/index.php/detalhesparcela/'+item.id)
		.success(function(data, status, headers, config) {
			$scope.detalheParcela = data.retorno[0];
		})
		.error(function(data, status, headers, config) { });
		*/

		$scope.detalheParcela = {};
		$scope.detalheParcela = item;
		$scope.detalheParcela.indice = indice;
		$scope.detalheParcela.id_status_parcela_atual = item.id_status_parcela;

		console.log('item', item);

		$('#editaParcela').modal('show');
	}
	
	$scope.mascara = function(){
		$timeout(function(){
			$scope.calculaValorLiquido();
		}, 1);
	}

	$scope.calculaValorLiquido = function(){
		$scope.detalheParcela.valor_liquido = $scope.detalheParcela.valor_bruto - $scope.detalheParcela.valor_desconto;
	}

	$scope.atualizaParcela = function(item){
		$scope.json = angular.toJson(item);
		$http.post('api/index.php/updateparcela/', $scope.json, 
			{withCredentials: true,
				headers: {'enctype': 'multipart/form-data' },
			}).success(function(data, status, headers, config) {
				if (data.error == 0){
					Mensagem.success(data.mensagem);
					
					$scope.parcelaAlunos[item.indice] = item;
					console.log('arrAluno', $scope.parcelaAlunos[item.indice]);

					$('#editaParcela').modal('hide');
				}
				else {
					Mensagem.error(data.mensagem);
				}
			}).error(function(data, status) {
				// log error
			});
	}

	$scope.getTipoCarne();
	$scope.getAluno();
	$scope.novoParcela();
	
	if (idParcela != undefined) {
	}; 


	$scope.currentPage = 1;
    $scope.pageSize = 10;    

    $scope.sort = {        
     active: 'nome',
     descending: undefined
   } 

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
  //@ sourceURL=controller.formCadastroGerarParcela.js