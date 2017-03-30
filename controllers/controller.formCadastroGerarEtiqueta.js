  /*
  Módulo: Mesquita
  Descrição: CRUD Gerar Etiqueta
  Método: GET
  URL: /financeiro/formCadastroGerarEtiqueta
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 17/06/2015
  Autor: Fabio da Silva
  Versão: 1.0
 */
smartSig.registerCtrl("formCadastroGerarEtiqueta", function($scope, $location, $http, $routeParams, Mensagem, $timeout, Permissao, $modal){

	$scope.permissoes = Permissao.validaPermissao();
	
	$scope.permissoes.then(function (data) {
		$scope.permissoes = data;
	}, function (status) {
		console.log('status',status);
	});

	var idEtiqueta = $routeParams.id;

	$scope.etiqueta = {};

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

	$scope.getResponsavel = function(){
	  $http.get('api/index.php/parcelaresponsavel/')
	  .success(function(data, status, headers, config) {
		$scope.responsaveis = data.parcela_responsavel;
	  })
	  .error(function(data, status, headers, config) { });
	}

	$scope.novoEtiqueta = function() {  
	  $scope.etiqueta = {};
	  $scope.etiqueta.tipo = 1;
	}

	$scope.cadastrarEtiqueta = function() {  
	  if ($('#cadastroEtiqueta-form').valid()) {  	
	  	var id_responsavel = '';
	  	if($scope.etiqueta.tipo == 0 && typeof $scope.etiqueta.id_responsavel != 'undefined'){
			id_responsavel = $scope.etiqueta.id_responsavel;
	  	}

	  	mesAno = $scope.etiqueta.mes_ano;
	  	mesAno = mesAno.replace("/", "-");

  	  	url = 'api/index.php/geraretiqueta/'+mesAno+'/'+$scope.etiqueta.id_tipo_carne+'/'+id_responsavel;
  		var link = document.createElement("a");
		link.setAttribute("href", url);
		//link.setAttribute("download", "etiqueta.pdf");
		link.setAttribute("target", "_blank");
		link.click();
	  }
	}   

	$scope.verificarAcaoResponsavel = function(item) {
	  $scope.etiqueta.id_responsavel = item.id_responsavel;
	  $( "em[for='id_responsavel']" ).css("display","none");    
	}

	$scope.$watch('etiqueta.mes_ano', function(){  
	  $scope.etiqueta.mes_ano1 = $scope.etiqueta.mes_ano;     
	  if($scope.etiqueta.mes_ano1 != undefined || $scope.etiqueta.mes_ano1 != null){              
		$( "em[for='mes_ano']" ).css("display","none"); 
	  }
	});

	$scope.$watch('etiqueta.tipo', function(){  
	  if($scope.etiqueta.tipo == 1){
		$scope.etiqueta.id_responsavel = '';
		$scope.responsavel.selected = '';
		$( "em[for='id_responsavel']" ).css("display","none");    
	  }
	});

	$scope.getTipoCarne();
	$scope.getResponsavel();
	$scope.novoEtiqueta();
	
	if (idEtiqueta != undefined) {
	}; 
});