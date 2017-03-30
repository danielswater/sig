/*
  Módulo: Mesquita
  Descrição: CRUD Fabricante
  Método: GET
  URL: /gestao/formCadastroFabricante
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 07/01/2014
  Autor: Ricardo Bruno
  Versão: 1.0
  Data de Alteração: 07/01/2014
 */
smartSig.registerCtrl("formCadastroFabricante", function($scope, $http, $routeParams, Mensagem, $timeout, Permissao){

    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    var idFabricante = $routeParams.id;

    $scope.fabricante = {};
    $scope.error = '';  
    $scope.fabricante.ativo=1;

    $scope.cadastrarFabricante = function(objeto) {      

      if ($('#cadastroFabricante-form').valid()) {

        $scope.json = angular.toJson($scope.fabricante);
                            
        $http.post('api/index.php/fabricante/', $scope.json, 
                                       {withCredentials: true,
                                       headers: {'enctype': 'multipart/form-data' },
                                       }
        ).success(function(data, status, headers, config) {
           if (data.error == '0')
           {   
              $scope.objeto = {}; 

              Mensagem.success(data.mensagem);   

              $scope.fabricante = {};
              $scope.fabricante.ativo=1;
           }
           else
           {
              Mensagem.error(data.mensagem);   
           }
        }).error(function(data, status) { 
          
        });
      }

    }  

    $scope.getIdFabricante = function(){
      $http.get('api/index.php/fabricante/1/'+idFabricante).    
        success(function(data, status, headers, config) {      
          $scope.fabricante = data.fabricante[0];   

          console.log($scope.fabricante)                    ;
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }

    $scope.novoCadastro = function(){
      $scope.fabricante = {};
      $scope.fabricante.ativo = 1;
    }

    if (idFabricante != undefined) {
      $timeout(function() {
        $scope.getIdFabricante(idFabricante);
      }, 800);      
    };           

});