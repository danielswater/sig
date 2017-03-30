/*
  Módulo: Mesquita
  Descrição: CRUD Status do Bem
  Método: GET
  URL: /gestao/formCadastroStatusBem
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 07/01/2014
  Autor: Ricardo Bruno
  Versão: 1.0
  Data de Alteração: 07/01/2014
 */
smartSig.registerCtrl("formCadastroStatusBem", function($scope, $http, $routeParams, Mensagem, $timeout, Permissao){

    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    var idStatusBem = $routeParams.id;

    $scope.statusbem = {};
    $scope.error = '';  
    $scope.statusbem.ativo=1;

    $scope.cadastrarStatusBem = function(objeto) {      

      if ($('#cadastroStatusBem-form').valid()) {

        $scope.json = angular.toJson($scope.statusbem);
                            
        $http.post('api/index.php/statusbem/', $scope.json, 
                                       {withCredentials: true,
                                       headers: {'enctype': 'multipart/form-data' },
                                       }
        ).success(function(data, status, headers, config) {
           if (data.error == '0')
           {   
              $scope.objeto = {}; 

              Mensagem.success(data.mensagem);   

              $scope.statusbem = {};
              $scope.statusbem.ativo=1;
           }
           else
           {
              Mensagem.error(data.mensagem);   
           }
        }).error(function(data, status) { 
          
        });
      }

    }  

    $scope.getIdStatusBem = function(){
      $http.get('api/index.php/statusbem/1/'+idStatusBem).    
        success(function(data, status, headers, config) {      
          $scope.statusbem = data.statusbem[0];   

          console.log($scope.statusbem);
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }  

    $scope.novoCadastro = function(){
      $scope.statusbem = {};
      $scope.statusbem.ativo = 1;
    }
 

    if (idStatusBem != undefined) {
      $timeout(function() {
        $scope.getIdStatusBem(idStatusBem);
      }, 800);      
    };           

});