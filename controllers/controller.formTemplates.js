smartSig.registerCtrl('formTemplates', function($scope, ngTableParams, $http, $location, $filter, filterFilter, Mensagem, $timeout, Permissao ,$routeParams) {
	$scope.permissoes = Permissao.validaPermissao();
	$scope.permissoes.then(function (data) {
		$scope.permissoes = data;
	}, function (status) {
		console.log('status',status);
	});

	$scope.modulo_documento = {};
	$scope.tabela = {};
	$scope.templates = [];
	$scope.template = {};
	$scope.addTemplate = {};
	$scope.documento = {};
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

	$scope.getModeloDocumento = function(){
		$http.get('api/index.php/modelodocumento/').
		success(function(data, status, headers, config) {
			$scope.modelo_documento = data;

			if($scope.templates.length == 0){
				$scope.template.id_modelo_documento = data[0].id;
			}

			$scope.addTemplate.id_modelo_documento = data[0].id;
			$scope.getTemplate(data[0].id);
		}).
		error(function(data, status, headers, config) {
			//log error
		});
	}
	$scope.getModeloDocumento();

	$scope.setTemplate = function(indiceEl){
		if(!angular.isUndefined($scope.templates[indiceEl])){
			$scope.template = $scope.templates[indiceEl];
			aHTML = $('#summernote').code($scope.template.texto);
		}
	}

	$scope.getTemplate = function(id_modelo_documento){
		$http.get('api/index.php/template/' + id_modelo_documento).
		success(function(data, status, headers, config) {
			
			var dado = $filter('filter')(data, {'id_entidade': $scope.logado.idTipoEntidade});
			
			$scope.templates = dado.reverse();
			//console.log('$scope.templates', $scope.templates);
			if(dado.length > 0){
				$scope.templates[0].active = true;
			}else{
				var modelo = $scope.template.id_modelo_documento;
				$scope.template.id_modelo_documento = modelo;
				$scope.template.descricao = '';
				aHTML = $('#summernote').code('');
			}
		}).
		error(function(dado, status, headers, config) {
			//log error
		});
	}

	$http.get('api/index.php/variavel/')
	.success(function(data, status, headers, config) {

		$scope.tabela = $filter('filter')(data, {'id_entidade': $scope.logado.idTipoEntidade});
	})
	.error(function(data, status, headers, config){  });

	$scope.exeCadastraTemplate = function(dtTemplate){
		$scope.json = angular.toJson(dtTemplate);
		$http.post('api/index.php/cadastrartemplate/', $scope.json, 
			{withCredentials: true,
				headers: {'enctype': 'multipart/form-data' },
					// transformRequest: angular.identity
				})
		.success(function(data, status, headers, config) {
			if (data.error == '0'){ 
				if(data.novoReg == 1){
					//$scope.limparHistoricoTemplate(dtTemplate.id_modelo_documento);
					$scope.getTemplate(data.id_modelo_documento);
				}
				Mensagem.success(data.mensagem);  
			} else {
				Mensagem.error(data.mensagem);
			}
		})
		.error(function(data, status) { 
			// log error
		});
	}

	$scope.cadastraTemplate = function(){
		if($('#cadastroTemplates-form').valid()) {
			var aHTML = $('#summernote').code();
			$scope.template.texto = aHTML;
			$scope.template.ativo = 1;
			$scope.exeCadastraTemplate($scope.template);
		}
	}

	$scope.modalDelTemplate = function(){
		$.SmartMessageBox({
			title : "Excluir Template",
			content : "Tem certeza que deseja excluir o template " + $scope.template.descricao + ".",
			buttons : "[Sim][Não]",
			placeholder : ""
		}, function(ButtonPress, Value) {
			if (ButtonPress == "Sim") {
				$scope.delTemplate();
				return 0;
			} else {
				return 0;  
			}
		});
	}

	$scope.delTemplate = function(){
		$scope.json = angular.toJson($scope.template);
		$http.post('api/index.php/deltemplate/', $scope.json, 
			{withCredentials: true,
				headers: {'enctype': 'multipart/form-data' },
					// transformRequest: angular.identity
				})
		.success(function(data, status, headers, config) {
			if (data.error == '0'){
				$scope.limparHistoricoTemplate($scope.template.id_modelo_documento);
				Mensagem.success(data.mensagem);  
			} else {
				Mensagem.error(data.mensagem);
			}
		}).error(function(data, status) {
			// log error
		});
	}

	$scope.limparHistoricoTemplate = function(id_modelo_documento){
		$scope.getTemplate(id_modelo_documento);
		//$scope.setTemplate();
	}

	$scope.modalNovoTemplate = function(){
		$('#myModal').modal('show'); 
		//$("#addTodos").removeAttr("disabled");
		//$("#limparLista").removeAttr("disabled");

		$(".inputValidate").removeClass("state-error has-error");
		$(".invalid").remove();
	}

	$scope.novoTemplate = function(){
		if($('#cadastroAddTemplates-form').valid()) {
			/*$scope.template.texto = '';
			$scope.template.ativo = 1;*/

			$scope.exeCadastraTemplate($scope.addTemplate);
			$scope.addTemplate.descricao = '';
			$scope.addTemplate.id_modelo_documento = $scope.modelo_documento[0].id;

			$('#myModal').modal('hide');
		}
	}
	
});
//@ sourceURL=controller.formTemplates.js