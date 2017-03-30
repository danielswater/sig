/*
  Módulo: Mesquita
  Descrição: CRUD Forma de Aquisição
  Método: GET
  URL: /gestao/formCadastroFormaAquisicao
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 07/01/2014
  Autor: Ricardo Bruno
  Versão: 1.0
  Data de Alteração: 07/01/2014
 */
smartSig.registerCtrl("formCadastroFormaAquisicao", function($scope, $http, $routeParams, Mensagem, $timeout, Permissao){

    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    var idFormaAquisicao = $routeParams.id;

    $scope.formaaquisicao = {};
    $scope.error = '';  
    $scope.formaaquisicao.ativo=1;

    $scope.cadastrarFormaAquisicao = function(objeto) {      

      if ($('#cadastroFormaAquisicao-form').valid()) {

        $scope.json = angular.toJson($scope.formaaquisicao);
                            
        $http.post('api/index.php/formaaquisicao/', $scope.json, 
                                       {withCredentials: true,
                                       headers: {'enctype': 'multipart/form-data' },
                                       }
        ).success(function(data, status, headers, config) {
           if (data.error == '0')
           {   
              $scope.objeto = {}; 

              Mensagem.success(data.mensagem);   

              $scope.formaaquisicao = {};
              $scope.formaaquisicao.ativo=1;
           }
           else
           {
              Mensagem.error(data.mensagem);   
           }
        }).error(function(data, status) { 
          
        });
      }

    }  

    $scope.getIdFormaAquisicao = function(){
      $http.get('api/index.php/formaaquisicao/1/'+idFormaAquisicao).    
        success(function(data, status, headers, config) {      
          $scope.formaaquisicao = data.formaaquisicao[0];   

          console.log($scope.formaaquisicao);
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }  

    $scope.novoCadastro = function(){
      $scope.formaaquisicao = {};
      $scope.formaaquisicao.ativo = 1;
    }
 

    if (idFormaAquisicao != undefined) {
      $timeout(function() {
        $scope.getIdFormaAquisicao(idFormaAquisicao);
      }, 800);      
    };           

});