/*
  Módulo: Mesquita
  Descrição: CRUD Parametros de Cobranca
  Método: GET
  URL: /gestao/consultaParametrosCobranca
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 16/06/2015
  Autor: Fabio S. da Silva
  Versão: 1.0
  */
  smartSig.registerCtrl('consultaParametroCobranca', function($scope, $http, $location, $filter, filterFilter, $timeout, Permissao, $routeParams, Mensagem) {

    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    $scope.parametroCobranca = {};
    $scope.copiar = {};

    $scope.searchNome = '';

    $scope.carregar = function(){
      $http.get('api/index.php/parametrocobranca/')
      .success(function(data, status, headers, config) {
        if (data.error == 0) {
          $scope.parametroCobranca = data.parametro_cobranca;         
        };                       
      })
      .error(function(data, status, headers, config) {});
    }
    $scope.carregar();

    $scope.editCadastro = function(id){
      $location.path('/financeiro/formCadastroParametrosCobranca/1/'+id)
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
  
  $scope.modalCopiar = function(id){
    $scope.copiar = {};
    $scope.copiar.id = id;
    $('#myModalCopiar').modal('show');        
  };


  $scope.copiarParametroCobranca = function(){
    if ($('#copiarParametroCobranca-form').valid()) {
      console.log('copiar', $scope.copiar);

      $scope.json = angular.toJson($scope.copiar);

      $http.post('api/index.php/copiarparametrocobranca/', $scope.json, {withCredentials: true, headers: {'enctype': 'multipart/form-data' },})
      .success(function(data, status, headers, config) {
        if (data.error == '0'){  

          Mensagem.success(data.mensagem);    
          $('#myModalCopiar').modal('hide');
          $scope.carregar();

        }else{              
          Mensagem.error(data.mensagem);   
        }
      }).error(function(data, status) {});
    }
  }

  $scope.$watch('copiar.data', function(){  
    $scope.copiar.data1 = $scope.copiar.data;     
    if($scope.copiar.data1 != undefined || $scope.copiar.data1 != null){              
      $( "em[for='data']" ).css("display","none"); 
    }
  });
  
});
//@ sourceURL=controller.consultaParametroCobranca.js