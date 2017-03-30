/*
  Módulo: Cemitério
  Descrição: CRUD Lote
  Método: GET
  URL: /forms/formCadastroLotes
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 05/11/2014
  Autor: Ricardo Bruno
  Versão: 1.0
  Data de Alteração: 05/11/2014
 */
smartSig.registerCtrl("formCadastroLote", function($scope, $http, $routeParams, Mensagem, $timeout, Permissao){

    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    var idLote = $routeParams.id;

    $scope.lote = {};
    $scope.error = '';  
    $scope.lote.ativo=1;
    $scope.quadra = {};
    
    $scope.tamanhoLote = [];
    $scope.tamanholotes = {};

    $scope.getQuadra = function(){

        $http.get('api/index.php/quadra/').    
        success(function(data, status, headers, config) {                           
          $scope.quadra = data.quadra;
          
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }      

    $scope.cadastrarLote = function(objeto) {      

      if ($('#cadastroLote-form').valid()) {

        $scope.json = angular.toJson($scope.lote);
                            
        $http.post('api/index.php/lote/', $scope.json, 
                                       {withCredentials: true,
                                       headers: {'enctype': 'multipart/form-data' },
                                       }
        ).success(function(data, status, headers, config) {
           if (data.error == '0')
           {   
              $scope.objeto = {}; 

              Mensagem.success(data.mensagem);   

              $scope.lote = {};
              $scope.lote.ativo=1;
              $scope.tamanhoLote.selected = ''
           }
           else
           {
              Mensagem.error(data.mensagem);   
           }
        }).error(function(data, status) { 
          
        });
      }

    }  

    $scope.getIdLote = function(){
      $http.get('api/index.php/lote/'+idLote).    
        success(function(data, status, headers, config) {      
          $scope.lote = data.lote[0];

          $scope.tamanhoLote = {selected : {"id":$scope.lote.id_tamanho_lote,"descricao":$scope.lote.tamanho}};        

          console.log('getIdLote', $scope.lote);
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }

    $scope.getIdTamanhoLotes = function(){
      $http.get('api/index.php/tamanholotes/1/').    
        success(function(data, status, headers, config) {      
          $scope.tamanhoLotes = data.tamanholotes;     
          console.log('getIdTamanhoLotes', $scope.tamanhoLotes);     
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    } 

    $scope.verificarAcaoTamanhoLote = function(item) {
      $scope.lote.id_tamanho_lotes = item.id;
      $( "em[for='id_tamanho_lotes']" ).css("display","none");    
    }

    $scope.novoCadastro = function(){
      $scope.lote = {};
      $scope.lote.ativo = 1;
    }
    
    if (idLote != undefined) {
      $scope.getIdLote();
    };  
    
    $scope.getIdTamanhoLotes();
    $scope.getQuadra();      

});
//@ sourceURL=controller.formCadastroLote.js