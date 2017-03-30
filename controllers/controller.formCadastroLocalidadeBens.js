/*
  Módulo: Mesquita
  Descrição: CRUD Localidade de Bens
  Método: GET
  URL: /gestao/formCadastroLocalidadeBens
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 07/01/2014
  Autor: Ricardo Bruno
  Versão: 1.0
  Data de Alteração: 07/01/2014
 */
smartSig.registerCtrl("formCadastroLocalidadeBens", function($scope, $http, $routeParams, Mensagem, $timeout, Permissao){

    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    var idLocalidadeBens = $routeParams.id;

    $scope.localidadebens = {};
    $scope.error = '';  
    $scope.localidadebens.ativo=1;

    $scope.cadastrarLocalidadeBens = function(objeto) {      

      if ($('#cadastroLocalidadeBens-form').valid()) {

        $scope.json = angular.toJson($scope.localidadebens);
                            
        $http.post('api/index.php/localidadebens/', $scope.json, 
                                       {withCredentials: true,
                                       headers: {'enctype': 'multipart/form-data' },
                                       }
        ).success(function(data, status, headers, config) {
           if (data.error == '0')
           {   
              $scope.objeto = {}; 

              Mensagem.success(data.mensagem);   

              $scope.localidadebens = {};
              $scope.localidadebens.ativo=1;
           }
           else
           {
              Mensagem.error(data.mensagem);   
           }
        }).error(function(data, status) { 
          
        });
      }

    }  

    $scope.idLocalidadeBens = function(){
      $http.get('api/index.php/localidadebens/1/'+idLocalidadeBens).    
        success(function(data, status, headers, config) {      
          $scope.localidadebens = data.localidadebens[0];   

          console.log($scope.localidadebens)                    ;
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }  

    $scope.novoCadastro = function(){
      $scope.localidadebens = {};
      $scope.localidadebens.ativo = 1;
    }
 

    if (idLocalidadeBens != undefined) {
      $timeout(function() {
        $scope.idLocalidadeBens(idLocalidadeBens);
      }, 800);      
    };           

});