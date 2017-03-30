/*
  Módulo: Mesquita
  Descrição: CRUD Estado de Conservação
  Método: GET
  URL: /gestao/formCadastroEstadoConservacao
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 07/01/2014
  Autor: Ricardo Bruno
  Versão: 1.0
  Data de Alteração: 07/01/2014
 */
smartSig.registerCtrl("formCadastroEstadoConservacao", function($scope, $http, $routeParams, Mensagem, $timeout, Permissao){

    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    var idEstadoConservacao = $routeParams.id;

    $scope.estadoconservacao = {};
    $scope.error = '';  
    $scope.estadoconservacao.ativo=1;

    $scope.cadastrarEstadoConservacao = function(objeto) {      

      if ($('#cadastroEstadoConservacao-form').valid()) {

        $scope.json = angular.toJson($scope.estadoconservacao);
                            
        $http.post('api/index.php/estadoconservacao/', $scope.json, 
                                       {withCredentials: true,
                                       headers: {'enctype': 'multipart/form-data' },
                                       }
        ).success(function(data, status, headers, config) {
           if (data.error == '0')
           {   
              $scope.objeto = {}; 

              Mensagem.success(data.mensagem);   

              $scope.estadoconservacao = {};
              $scope.estadoconservacao.ativo=1;
           }
           else
           {
              Mensagem.error(data.mensagem);   
           }
        }).error(function(data, status) { 
          
        });
      }

    }  

    $scope.getIdEstadoConservacao = function(){
      $http.get('api/index.php/estadoconservacao/1/'+idEstadoConservacao).    
        success(function(data, status, headers, config) {      
          $scope.estadoconservacao = data.estadoconservacao[0];   

          console.log($scope.estadoconservacao);
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }  

    $scope.novoCadastro = function(){
      $scope.estadoconservacao = {};
      $scope.estadoconservacao.ativo = 1;
    }
 

    if (idEstadoConservacao != undefined) {
      $timeout(function() {
        $scope.getIdEstadoConservacao(idEstadoConservacao);
      }, 800);      
    };           

});