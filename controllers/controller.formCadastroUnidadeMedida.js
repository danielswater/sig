/*
  Módulo: Mesquita
  Descrição: CRUD Unidade de Medida
  Método: GET
  URL: /gestao/formCadastroUnidadeMedida
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 07/01/2014
  Autor: Ricardo Bruno
  Versão: 1.0
  Data de Alteração: 07/01/2014
 */
smartSig.registerCtrl("formCadastroUnidadeMedida", function($scope, $http, $routeParams, Mensagem, $timeout, Permissao){

    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    var idUnidadeMedida = $routeParams.id;

    $scope.unidademedida = {};
    $scope.error = '';  
    $scope.unidademedida.ativo=1;

    $scope.cadastrarUnidadeMedida = function(objeto) {      

      if ($('#cadastroUnidadeMedida-form').valid()) {

        $scope.json = angular.toJson($scope.unidademedida);
                            
        $http.post('api/index.php/unidademedida/', $scope.json, 
                                       {withCredentials: true,
                                       headers: {'enctype': 'multipart/form-data' },
                                       }
        ).success(function(data, status, headers, config) {
           if (data.error == '0')
           {   
              $scope.objeto = {}; 

              Mensagem.success(data.mensagem);   

              $scope.unidademedida = {};
              $scope.unidademedida.ativo=1;
           }
           else
           {
              Mensagem.error(data.mensagem);   
           }
        }).error(function(data, status) { 
          
        });
      }

    }  

    $scope.getIdUnidadeMedida = function(){
      $http.get('api/index.php/unidademedida/1/'+idUnidadeMedida).    
        success(function(data, status, headers, config) {      
          $scope.unidademedida = data.unidademedida[0];   

          console.log($scope.unidademedida)                    ;
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }  
    
    $scope.novoCadastro = function(){
      $scope.unidademedida = {};
      $scope.unidademedida.ativo = 1;
    }
 

    if (idUnidadeMedida != undefined) {
      $timeout(function() {
        $scope.getIdUnidadeMedida(idUnidadeMedida);
      }, 800);      
    };           

});