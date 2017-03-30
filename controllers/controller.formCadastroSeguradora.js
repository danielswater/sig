/*
  Módulo: Mesquita
  Descrição: CRUD Seguradora
  Método: GET
  URL: /gestao/formCadastroSeguradora
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 07/01/2014
  Autor: Ricardo Bruno
  Versão: 1.0
  Data de Alteração: 07/01/2014
 */
smartSig.registerCtrl("formCadastroSeguradora", function($scope, $http, $routeParams, Mensagem, $timeout, Permissao){

    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    var idSeguradora = $routeParams.id;

    $scope.seguradora = {};
    $scope.error = '';  
    $scope.seguradora.ativo=1;

    $scope.cadastrarSeguradora = function(objeto) {      

      if ($('#cadastroSeguradora-form').valid()) {

        $scope.json = angular.toJson($scope.seguradora);
                            
        $http.post('api/index.php/seguradora/', $scope.json, 
                                       {withCredentials: true,
                                       headers: {'enctype': 'multipart/form-data' },
                                       }
        ).success(function(data, status, headers, config) {
           if (data.error == '0')
           {   
              $scope.objeto = {}; 

              Mensagem.success(data.mensagem);   

              $scope.seguradora = {};
              $scope.seguradora.ativo=1;
           }
           else
           {
              Mensagem.error(data.mensagem);   
           }
        }).error(function(data, status) { 
          
        });
      }

    }  

    $scope.getIdSeguradora = function(){
      $http.get('api/index.php/seguradora/1/'+idSeguradora).    
        success(function(data, status, headers, config) {      
          $scope.seguradora = data.seguradora[0];   

          console.log($scope.seguradora)                    ;
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }  
 
    $scope.novoCadastro = function(){
      $scope.seguradora = {};
      $scope.seguradora.ativo = 1;
    }

    if (idSeguradora != undefined) {
      $timeout(function() {
        $scope.getIdSeguradora(idSeguradora);
      }, 800);      
    };           

});