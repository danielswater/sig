app.registerCtrl('novoComunicado', function($scope, $http, $location, $timeout, $routeParams, $filter) {

	$scope.idComunicado = $routeParams.id;
		
	$scope.novo = function(){
		//$scope.turma = [];
		$scope.comunicado = {};
		$scope.comunicado.publicado=false;
		$scope.comunicado.exibir_turma=false;
		$scope.comunicado.destino = false;
		$scope.comunicado.descricao = '';
		$scope.comunicado.data_envio = '';
		$scope.data_envio = '';
		$scope.comunicado.email_resposta = '';
		$scope.comunicado.publicado = false;
		$scope.comunicado.comunicado = '';
		$scope.comunicado.id_turmas = [];
	}
	$scope.novo();

	$scope.getCursoTurma = function(){
		
		$http.get('../api/index.php/carregarcursoturma')
		.success(function(data, status, headers, config) {
			if(data.error == 0){
				$scope.listaCursoTurma = data.retorno;				
			}
		})
		.error(function(data, status, headers, config) {});
		
	}
	$scope.getCursoTurma();	

	
	$scope.cadastrar = function(){

	    if ($('#cadastroNovoComunicado-form').valid()) {	

	      	$scope.comunicado.data_envio = new Date($scope.data_envio.split('/').reverse().join('-')+'T12:00:00');
	        $scope.json = angular.toJson($scope.comunicado);                            
	        $http.post('../api/index.php/cadastrarcomunicado', $scope.json,{withCredentials: true, headers: {'enctype': 'multipart/form-data' },})
	                   
	        .success(function(data, status, headers, config){
	            $scope.novo();
	        })
	        .error(function(data, status) {});
	    }
	}    
	
    $scope.getIdComunicado = function(){
      $http.get('../api/index.php/carregarcomunicado/'+$scope.idComunicado)
        .success(function(data, status, headers, config) {

        	$scope.comunicado = data.retorno[0];
        	$scope.comunicado.id_turmas = [];
        	$scope.data_envio = $scope.comunicado.data_envio.split('-').reverse().join('/');
        	$scope.comunicado.exibir_turma = ($scope.comunicado.exibir_turma =='1') ? true : false;
        	$scope.comunicado.publicado = ($scope.comunicado.publicado=='1') ? true : false;

        	angular.forEach($scope.comunicado.comunicado_turma, function(value, index){
				$scope.comunicado.id_turmas.push(value['id_turma']);
			});
        })
        .error(function(data, status, headers, config) {});
    }   

    if ($scope.idComunicado != undefined) {
      $timeout(function(){ 

        $scope.getIdComunicado();
      }, 800);
    };

});
//@ sourceURL=controller.comunicadoGeral.js