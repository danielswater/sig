/*
  Módulo: Cemitério
  Descrição: CRUD Tamanho de Lotes
  Método: GET
  URL: /forms/formCadastroTamanhoLotes
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 22/05/2015
  Autor: Fabio Roberto Haydn 
  Versão: 1.0  
*/

smartSig.registerCtrl("formCadastroTamanhoLotes", function($scope, $http, $routeParams, Mensagem, $timeout, Permissao){

    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    var idTamanhoLotes = $routeParams.id;

    $scope.tamanholotes = {};
    $scope.error = '';  
    $scope.tamanholotes.ativo=1;

    $scope.cadastrarTamanhoLotes = function(objeto) {      

      if ($('#cadastroTamanhoLotes-form').valid()) {

        $scope.json = angular.toJson($scope.tamanholotes);

        $http.post('api/index.php/tamanholotes/', $scope.json, 
                                       {withCredentials: true,
                                       headers: {'enctype': 'multipart/form-data' },
                                       }
        ).success(function(data, status, headers, config) {
           if (data.error == '0')
           {   
              $scope.objeto = {}; 

              Mensagem.success(data.mensagem);   

              //$scope.tamanholotes = {};
              //$scope.tamanholotes.ativo=1;
           }
           else
           {
              Mensagem.error(data.mensagem);   
           }
        }).error(function(data, status) { 
          
        });
      }

    }  

    $scope.getIdTamanhoLotes = function(){
      $http.get('api/index.php/tamanholotes/1/'+idTamanhoLotes).    
        success(function(data, status, headers, config) {      
          $scope.tamanholotes = data.tamanholotes[0];                       
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }  

    $scope.novoCadastro = function(){
      $scope.tamanholotes = {};
      $scope.tamanholotes.ativo = 1;
    }

    if (idTamanhoLotes != undefined) {
      $scope.getIdTamanhoLotes();
    };

});

//@ sourceURL=controller.formCadastroTamanhoLotes.js