/*
  Módulo: Escola
  Descrição: CRUD Consulta Origens
  Método: GET
  URL: /consulta/consultaOrigem
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 05/05/2015
  Autor: Fábio Roberto Haydn
  Versão: 1.0
*/

smartSig.registerCtrl("formCadastroOrigem", function($scope, $http, $routeParams, Mensagem, $timeout, Permissao){

    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    var idOrigem = $routeParams.id;

    $scope.origem = {};
    $scope.error = '';  
    $scope.origem.ativo=1;    

    $scope.cadastrarOrigem = function(objeto) {      

      if ($('#cadastroOrigem-form').valid()) {

        $scope.json = angular.toJson($scope.origem);
                            
        $http.post('api/index.php/origem/', $scope.json, {withCredentials: true, headers: {'enctype': 'multipart/form-data' },})
        .success(function(data, status, headers, config) {

           if(data.error != -1){ $scope.objeto = {};                                  
                                 $scope.origem.id = data.id;     
                                 Mensagem.success(data.mensagem);}
           else                { Mensagem.error(data.mensagem)  ;}
        })
        .error(function(data, status) { /* log error */ });
      }
    }  

    $scope.getIdOrigem = function(){

      $http.get('api/index.php/origem/'+idOrigem)
      .success(function(data, status, headers, config) {                
          $scope.origem = data.origem[0];   
      })
      .error(function(data, status, headers, config) { /* log error */ }); 
    }

    $scope.novoCadastro = function(){      
      $scope.origem = {};
      $scope.origem.ativo = 1;      
    }

    if (idOrigem != undefined) {      
      $scope.getIdOrigem();      
    };           
});