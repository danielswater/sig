
/*
  Módulo: Escola
  Descrição: CRUD Cadastro de Tipo de Itens de Publicação
  Método: GET
  URL: /escolaforms/formCadastroSituacaoOcorrencia
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 30/06/2015
  Autor: Fábio Roberto Haydn
  Versão: 1.0
*/

smartSig.registerCtrl("cadastroSituacaoOcorrencia", function($scope, $http, $routeParams, Mensagem, $timeout, Permissao, $filter){    

    $scope.permissoes = Permissao.validaPermissao();

    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    $scope.situacaoocorrencia       = {};
    $scope.situacaoocorrencia.ativo = 1;     

    var id = $routeParams.id;    

    /* ----------------------------------------------------------------------------------*/
    /* Funções para cadastro da situacaoocorrencia                                                     */
    /* ----------------------------------------------------------------------------------*/
    $scope.cadastrarSituacaoOcorrencia = function() {
      if ($('#cadastroSituacaoOcorrencia-form').valid()) {
      
        $scope.json = angular.toJson($scope.situacaoocorrencia);
        $http.post('api/index.php/ocorrenciasituacao/', $scope.json,{withCredentials: true,headers: {'enctype': 'multipart/form-data' },})
                   
        .success(function(data, status, headers, config) {
           
           if (data.error == '0'){

              Mensagem.success(data.mensagem);
              $scope.situacaoocorrencia.id = data.id_retorno;
           }
           else { Mensagem.error(data.mensagem); }
        })
        .error(function(data, status) { });
      }
    }    

    $scope.novoCadastro = function(){
      $scope.situacaoocorrencia = {};
      $scope.situacaoocorrencia.ativo = 1;
    }
    
    $scope.getIdSituacaoOcorrencia = function(id){
      $http.get('api/index.php/ocorrenciasituacao/'+id)
        .success(function(data, status, headers, config) {
          
          $scope.situacaoocorrencia = data.situacao_ocorrencia[0];
        })
        .error(function(data, status, headers, config) { });
    }

    if (id != undefined) {
      $timeout(function(){ $scope.getIdSituacaoOcorrencia(id); }, 800);
    };
});

//@ sourceURL=controller.formCadastroSituacaoOcorrencia.js