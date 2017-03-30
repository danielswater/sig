/*
  Módulo: Escola
  Descrição: CRUD Tipo de Turma
  Método: GET
  URL: /forms/formCadastroTipoTurma
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 13/03/2015
  Autor: HAMZI JALEL
  Versão: 1.0
  Data de Alteração: 13/03/2015
 */
smartSig.registerCtrl("formCadastroTipoTurma", function($scope, $http, $routeParams, Mensagem, $timeout, Permissao){

    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    var idTipoTurma = $routeParams.id;

    $scope.tipoturma = {};
    $scope.error = '';  
    $scope.tipoturma.ativo=1;
    
    $scope.cadastrarTipoTurma = function(objeto) {      

      if ($('#cadastroTipoTurma-form').valid()) {

        $scope.json = angular.toJson($scope.tipoturma);
                            
        $http.post('api/index.php/tipoturma/', $scope.json, 
                                               {withCredentials: true,
                                               headers: {'enctype': 'multipart/form-data' },
                                               }
        ).success(function(data, status, headers, config) {
           if (data.error == '0')
           {
            console.log('tipoturma',data);
              Mensagem.success(data.mensagem);   
              $scope.tipoturma.id = data.id;                        
              
           }
           else
           {              
              Mensagem.error(data.mensagem);                 
           }
        }).error(function(data, status) { 
          
        });
      }
    }  

    $scope.getIdTipoTurma = function(){
      $http.get('api/index.php/tipoturma/1/'+idTipoTurma).    
        success(function(data, status, headers, config) {

          //$scope.tipoturma = {};
          $scope.tipoturma = data.tipoturma[0];  

        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }  

    if (idTipoTurma != undefined) {
      $scope.getIdTipoTurma();
    };

    $scope.novoCadastro = function(){

      $scope.tipoturma = {};
      $scope.tipoturma.ativo = 1;

    }

});