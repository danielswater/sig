/*
  Módulo: Mesquita
  Descrição: CRUD bloqueio de matricula
  Método: GET
  URL: /forms/formCadastroBloqueioMatricula
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 12/06/2015
  Autor: Bloqueio de Matrícula
  Versão: 1.0  
*/

smartSig.registerCtrl("formCadastroBloqueioMatricula", function($scope, $http, $routeParams, Mensagem, $timeout, Permissao){

    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    var idBloqueioMatricula = $routeParams.id;

    $scope.bloqueiomatricula = {};    
    $scope.bloqueiomatricula.ativo=1;
    $scope.error = '';  

    $scope.cadastrarBloqueioMatricula = function() {      

      if ($('#cadastroBloqueioMatricula-form').valid()) {

        $scope.json = angular.toJson($scope.bloqueiomatricula);
                            
        $http.post('api/index.php/bloqueiomatricula/', $scope.json, {withCredentials: true, headers: {'enctype': 'multipart/form-data' }, })
        .success(function(data, status, headers, config) {
           if (data.error == '0')
           {   
              Mensagem.success(data.mensagem);   
              $scope.bloqueiomatricula.id = data.id_bloqueiomatricula;
           }else{
              Mensagem.error(data.mensagem);
           }
        })
        .error(function(data, status) { });
      }
    }  

    $scope.getIdBloqueioMatricula = function(){
      $http.get('api/index.php/bloqueiomatricula/1/'+idBloqueioMatricula)
      .success(function(data, status, headers, config) {      
          $scope.bloqueiomatricula = data.bloqueiomatricula[0]; 
      })
      .error(function(data, status, headers, config) { }); 
    }  

    $scope.novoCadastro = function(){
      $scope.bloqueiomatricula = {};
      $scope.bloqueiomatricula.ativo = 1;
    }

    if(idBloqueioMatricula != undefined){
      $timeout(function(){
        $scope.getIdBloqueioMatricula(idBloqueioMatricula);
      }, 800);      
    };       

});

//@ sourceURL=controller.formCadastroBloqueioMatricula.js