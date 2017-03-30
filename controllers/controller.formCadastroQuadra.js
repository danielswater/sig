/*
  Módulo: Cemitério
  Descrição: CRUD Quadra
  Método: GET
  URL: /forms/formCadastroQuadra
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 05/11/2014
  Autor: Ricardo Bruno
  Versão: 1.0
  Data de Alteração: 05/11/2014
 */
smartSig.registerCtrl("formCadastroQuadra", function($scope, $http, $routeParams, Mensagem, $timeout, Permissao){

    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    var idQuadra = $routeParams.id;

    $scope.quadra = {};
    $scope.error = '';  
    $scope.quadra.ativo=1;
    $scope.quadra.id_entidade=2; 

    $scope.cadastrarQuadra = function(objeto) {      

      if ($('#cadastroQuadra-form').valid()) {

        $scope.json = angular.toJson($scope.quadra);
                            
        $http.post('api/index.php/quadra/', $scope.json, 
                                       {withCredentials: true,
                                       headers: {'enctype': 'multipart/form-data' },
                                       }
        ).success(function(data, status, headers, config) {
           if (data.error == '0')
           {   
              $scope.objeto = {}; 

              Mensagem.success(data.mensagem);   

              $scope.quadra = {};
              $scope.quadra.ativo=1;
              $scope.quadra.id_entidade=2; 
           }
           else
           {
              Mensagem.error(data.mensagem);   
           }
        }).error(function(data, status) { 
          
        });
      }

    }  

    $scope.getIdQuadra = function(){
      $http.get('api/index.php/quadra/'+idQuadra).    
        success(function(data, status, headers, config) {      
          $scope.quadra = data.quadra[0];                       
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }  

    $scope.novoCadastro = function(){
      $scope.quadra = {};
      $scope.quadra.ativo = 1;
    }

    if (idQuadra != undefined) {
      $scope.getIdQuadra();
    };        

    

    

});