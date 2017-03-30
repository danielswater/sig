/*
  Módulo: Cemitério
  Descrição: CRUD Quadra
  Método: GET
  URL: /consulta/consultaQuadra
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 05/11/2014
  Autor: Ricardo Bruno
  Versão: 1.0
  Data de Alteração: 05/11/2014
  */
  smartSig.registerCtrl('consultaFalecidos', function($scope, $http, $location, $filter, filterFilter, $timeout, Permissao, $routeParams,Mensagem) {

  	$scope.permissoes = Permissao.validaPermissao();

  	$scope.permissoes.then(function (data) {
  		$scope.permissoes = data;
  	}, function (status) {
  		console.log('status',status);
  	});

    //var falecido = Array();
    $scope.data = [];

    $scope.searchNome = '';

    $scope.carregarFalecido = function(){
    	$http.get('api/index.php/falecido/').    
    	success(function(data, status, headers, config) {        
    		$scope.data  = data.falecido;
    		
           //$scope.tabelaConsulta();
       }).
    	error(function(data, status, headers, config) {
          // log error
      });
    }
    $scope.carregarFalecido();

    $scope.editCadastro = function(id){
    	$location.path('/forms/formCadastroFalecidos/1/'+id)
    }      
    
    $scope.filtro = function(){
    	$scope.counter++;
      //console.log($scope.counter);
  }

  $scope.$watch("searchNome", function(q){
      //console.log(q);
        //$scope.filteredData = $filter("filter")($scope.data, query);
    });

  $scope.tabelaConsulta = function(){
  	$scope.tableParams = new ngTableParams({
          page: 1,            // show first page
          count: 10,          // count per page
          filter: {
              nome: ''       // initial filter
          },
          sorting: {
              nome: 'asc'     // initial sorting
          }
      }, {
          total: falecido.length, // length of data
          getData: function($defer, params) {
              // use build-in angular filter
              var filteredData = params.filter() ?
              $filter('filter')(falecido, params.filter()) :
              falecido;
              var orderedData = params.sorting() ?
              $filter('orderBy')(filteredData, params.orderBy()) :
              falecido;

              params.total(orderedData.length); // set total for recalc pagination
              $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
          }
      });
  }
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

  $scope.delCadastro = function(idFalecido, idGaveta){

  	$scope.tmp = {};
  	$scope.tmp.id_falecido = idFalecido;
    $scope.tmp.id_gaveta = idGaveta;
  	$scope.json = angular.toJson($scope.tmp);

  	$http.post('api/index.php/delfalecido', $scope.json, {withCredentials: true, headers: {'enctype': 'multipart/form-data' },})

  	.success(function(data, status, headers, config){        

  		if (data.error < 0){ Mensagem.error(data.retorno); }
  		else{                Mensagem.success(data.retorno); }        
  		$scope.carregarFalecido();

  	}).error(function(data, status, headers, config){});
  }

  function convertDate(inputFormat) {
  	function pad(s) { return (s < 10) ? '0' + s : s; }
  	var d = new Date(inputFormat);
  	return [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('/');
  }

});