smartSig.registerCtrl('formEventosRecorrente', function($scope, ngTableParams, $http, $location, $filter, $q, filterFilter, Mensagem, $timeout, Permissao, $routeParams) {  
  /*
  $scope.permissoes = Permissao.validaPermissao();

  $scope.permissoes.then(function (data) {
    $scope.permissoes = data;
  }, function (status) {
    console.log('status',status);
  });
  */

  $scope.evento = {};
  $scope.evento.id = $routeParams.id;

  $scope.eventoRecorrente = {};

  $scope.mensagemSuccess = function(contentMensagem){
      Mensagem.success(contentMensagem);
  }

  $scope.mensagemError = function(contentMensagem){
      Mensagem.error(contentMensagem);
  }

  $scope.novoCadastro = function(){   
    $scope.eventoRecorrente = {};    
  } 

  $scope.cadastrarEventoRecorrente = function(){  
    
    if ($('#eventoRecorrente-form').valid()) {
      var recorrencia = $filter("filter")($scope.recorrencias,  {'id': $scope.eventoRecorrente.id_recorrencia});

      $scope.eventoRecorrente.id_evento = $scope.evento.id;
      $scope.eventoRecorrente.periodicidade = recorrencia[0].periodicidade;

      console.log('teste', $scope.eventoRecorrente);

      $scope.json = angular.toJson($scope.eventoRecorrente);
      $http.post('api/index.php/eventorecorrente/', $scope.json, 
                                     {withCredentials: true,
                                     headers: {'enctype': 'multipart/form-data' },
                                     // transformRequest: angular.identity
                                     }
      ).success(function(data, status, headers, config) {
        if(data.error == '0'){ 
          $scope.getEventoRecorrente();
          $scope.eventoRecorrente = {};
          Mensagem.success(data.mensagem);  
        }else{
          Mensagem.error(data.mensagem);   
        }
      }).error(function(data, status) { 
        
      });
    }
  }

  $scope.delEventoRecorrente = function(indiceEl, obj){
      $scope.json = angular.toJson(obj);
      $http.post('api/index.php/deleventorecorrente/', $scope.json, 
                                     {withCredentials: true,
                                     headers: {'enctype': 'multipart/form-data' },
                                     // transformRequest: angular.identity
                                     }
      ).success(function(data, status, headers, config) {
         if(data.error == '0'){ 
            $scope.recorrentes.splice(indiceEl,1);
            Mensagem.success(data.mensagem);  
         }else{
            Mensagem.error(data.mensagem);   
         }
      }).error(function(data, status) { 
        
      });
  }

  $scope.editCadastro = function(id){
      $location.path('/agenda/evento/1/'+id)
  }

  $scope.getEvento = function(){
      $http.get('api/index.php/evento/' + $scope.evento.id).    
      success(function(data, status, headers, config) {                           
        $scope.evento = data[0];
      }).
      error(function(data, status, headers, config) {
        // log error
      }); 
  }

  $scope.getEventoRecorrente = function(){
      $http.get('api/index.php/eventorecorrente/' + $scope.evento.id).    
      success(function(data, status, headers, config) {                           
        $scope.recorrentes = data.eventorecorrente;
      }).
      error(function(data, status, headers, config) {
        // log error
      }); 
  }

  $scope.getRecorrencia = function(){
      $http.get('api/index.php/recorrencia/1').    
      success(function(data, status, headers, config) {                           
        $scope.recorrencias = data.recorrencia;
      }).
      error(function(data, status, headers, config) {
        // log error
      }); 
  }

  
  $scope.getRecorrencia();
  $scope.getEvento();
  $scope.getEventoRecorrente();
});