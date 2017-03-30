/*
  Módulo: Mesquita
  Descrição: CRUD Marca
  Método: GET
  URL: /gestao/formCadastroMarca
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 07/01/2014
  Autor: Ricardo Bruno
  Versão: 1.0
  Data de Alteração: 07/01/2014
 */
smartSig.registerCtrl("formCadastroMarca", function($scope, $http, $routeParams, Mensagem, $timeout, Permissao){

    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    var idMarca = $routeParams.id;

    $scope.marca = {};
    $scope.error = '';  
    $scope.marca.ativo=1;

    $scope.cadastrarMarca = function(objeto) {      

      if ($('#cadastroMarca-form').valid()) {

        $scope.json = angular.toJson($scope.marca);
                            
        $http.post('api/index.php/marca/', $scope.json, 
                                       {withCredentials: true,
                                       headers: {'enctype': 'multipart/form-data' },
                                       }
        ).success(function(data, status, headers, config) {
           if (data.error == '0')
           {   
              $scope.objeto = {}; 

              Mensagem.success(data.mensagem);   

              $scope.marca = {};
              $scope.marca.ativo=1;
           }
           else
           {
              Mensagem.error(data.mensagem);   
           }
        }).error(function(data, status) { 
          
        });
      }

    }  

    $scope.getIdMarca = function(){
      $http.get('api/index.php/marca/1/'+idMarca).    
        success(function(data, status, headers, config) {      
          $scope.marca = data.marca[0];   

          console.log($scope.marca)                    ;
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }  
 
    $scope.novoCadastro = function(){
      $scope.marca = {};
      $scope.marca.ativo = 1;
    }
    
    if (idMarca != undefined) {
      $timeout(function() {
        $scope.getIdMarca(idMarca);
      }, 800);      
    };           

});