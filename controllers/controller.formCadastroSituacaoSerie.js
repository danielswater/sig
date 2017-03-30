/*
  Módulo: Escola
  Descrição: CRUD Situação da Série
  Método: GET
  URL: /forms/formCadastroSituacaoSerie
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 28/05/2015
  Autor: Fábio Roberto Haydn
  Versão: 1.0  
*/

smartSig.registerCtrl("formCadastroSituacaoSerie", function($scope, $http, $routeParams, Mensagem, $timeout, Permissao){

    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    var idSituacaoSerie = $routeParams.id;

    $scope.situacaoserie = {};    
    $scope.situacaoserie.ativo=1;        
    $scope.error = '';  

    
    $scope.cadastrarSituacaoSerie = function(objeto) {

      if ($('#cadastroSituacaoSerie-form').valid()) {
        
         $scope.json = angular.toJson($scope.situacaoserie);
                            
        $http.post('api/index.php/situacaoserie/', $scope.json,{withCredentials: true,headers: {'enctype': 'multipart/form-data' },})
        .success(function(data, status, headers, config) {
           if (data.error == '0')
           {   
              Mensagem.success(data.mensagem);   
              $scope.situacaoserie.id = data.id;
           }
           else
           {
              Mensagem.error(data.mensagem);
           }
        })
        .error(function(data, status) {
         });
      }
    }  

    $scope.getIdSituacaoSerie = function(){
      $http.get('api/index.php/situacaoserie/1/'+idSituacaoSerie)
        .success(function(data, status, headers, config) {

            $scope.situacaoserie = data.situacao_serie[0];
        })
        .error(function(data, status, headers, config) { }); 
    }  

    if (idSituacaoSerie != undefined) {
      $scope.getIdSituacaoSerie();
    }; 

    $scope.novoCadastro = function(){
      $scope.situacaoserie = {};
      $scope.situacaoserie.ativo = 1;
    }  
});

//@ sourceURL=controller.formCadastroSituacaoSerie.js