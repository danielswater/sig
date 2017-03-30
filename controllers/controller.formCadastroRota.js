
/*
  Módulo: Escola
  Descrição: CRUD Cadastro de Rotas
  Método: GET
  URL: /escolaforms/formCadastroRota
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 04/06/2015
  Autor: Fábio Roberto Haydn
  Versão: 1.0
*/

smartSig.registerCtrl("formCadastroRota", function($scope, $http, $routeParams, Mensagem, $timeout, Permissao, $filter){    

    $scope.permissoes = Permissao.validaPermissao();

    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    $scope.rota       = {};
    $scope.rota.ativo = 1; 
    $scope.rotas    = [];

    $scope.itinerario = {};
    $scope.itinerario.ativo = 1; 
    $scope.selItinerarios = [];
    $scope.showItinerario = false;

    var idRota = $routeParams.id;    

    /* ----------------------------------------------------------------------------------*/
    /* Funções para manipulação dos Itinerários                                          */
    /* ----------------------------------------------------------------------------------*/

    $scope.editarItinerario = function(indexEl, item) {      
      $scope.itinerario = item;
      $scope.itinerario.indexEl = indexEl;      
    }

    $scope.getItinerario = function(id_rota){
       $http.get('api/index.php/itinerario/'+id_rota)
       .success(function(data, status, headers, config) {
  
          if (data.error == '0'){
              $scope.selItinerarios = data.itinerario;

          }else { if(parseInt(data.error) != -1){ Mensagem.error(data.mensagem); }}

       }).error(function(data, status, headers, config) { });
    }

    $scope.excluirItinerario = function(indexEl, item) {

      $scope.objItinerarioExcluir = {};      
      $scope.objItinerarioExcluir.id = item.id;

      $scope.json = angular.toJson($scope.objItinerarioExcluir);
      $http.post('api/index.php/delitinerario/', $scope.json, {withCredentials: true, headers: {'enctype': 'multipart/form-data' },})

      .success(function(data, status, headers, config) {        
        $scope.selItinerarios.splice(indexEl, 1);

      }).error(function(data, status, headers, config) { });
    }

    $scope.cadastrarItinerario = function() {
      if ($('#cadastroRota-Itinerario-form').valid()) {

        $scope.itinerario.id_rota = $scope.rota.id;        
        $scope.json = angular.toJson($scope.itinerario);

        if($scope.itinerario.id=="" || (typeof $scope.itinerario.id == 'undefined')){ 
          addLista = true; 
        } else { 
          addLista = false;            
        }

        $http.post('api/index.php/itinerario/', $scope.json,{withCredentials: true, headers: {'enctype': 'multipart/form-data' },})   
        .success(function(data, status, headers, config) {

          if(data.error != -1){
            
            Mensagem.success(data.mensagem);
            $scope.itinerario.id = data.id_itinerario;
        
            if($scope.itinerario.ativo==1){$scope.itinerario.statAtivo = "Ativo";}else{$scope.itinerario.statAtivo = "Inativo";}
            if(addLista){ $scope.selItinerarios.push($scope.itinerario); }

            $scope.itinerario = {};
            $scope.itinerario.ativo = 1; 
            $scope.itinerario.statAtivo = "Ativo"; 

          }else{ Mensagem.error(data.mensagem); }

        }).error(function(data, status, headers, config) { });
      }
    }

    /* ----------------------------------------------------------------------------------*/
    /* Funções para cadastro da rota                                                     */
    /* ----------------------------------------------------------------------------------*/
    $scope.cadastrarRota = function(objeto) {
      if ($('#cadastroRota-form').valid()) {
      
        $scope.json = angular.toJson($scope.rota);
        $http.post('api/index.php/rota/', $scope.json,{withCredentials: true,headers: {'enctype': 'multipart/form-data' },})
                   
        .success(function(data, status, headers, config) {
           if (data.error == '0'){
              $scope.objeto = {};

              Mensagem.success(data.mensagem);
              $scope.rota.id = data.id_rota;

              $scope.showItinerario = true;
              $scope.itinerario = {};
              $scope.itinerario.ativo = 1; 
              $scope.itinerario.statAtivo = 'Ativo';
           }
           else { Mensagem.error(data.mensagem); }
        })
        .error(function(data, status) { });
      }
    }    

    $scope.novoCadastro = function(){
      $scope.rota = {};
      $scope.rota.ativo = 1;
      $scope.showItinerario = false;       
      $scope.selItinerarios.length=0;
    }
    
    $scope.getIdRota = function(idRota){
      $http.get('api/index.php/rota/'+idRota)
        .success(function(data, status, headers, config) {

          $scope.showItinerario = true;
          $scope.rota = data.rota[0];
          $scope.getItinerario($scope.rota.id);
        })
        .error(function(data, status, headers, config) { });
    }

    if (idRota != undefined) {
      $timeout(function(){ $scope.getIdRota(idRota); }, 800);
    };
});
//@ sourceURL=controller.formCadastroRota.js