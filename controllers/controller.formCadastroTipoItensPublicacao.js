
/*
  Módulo: Escola
  Descrição: CRUD Cadastro de Tipo de Itens de Publicação
  Método: GET
  URL: /escolaforms/formCadastroTipoItensPublicacao
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 30/06/2015
  Autor: Fábio Roberto Haydn
  Versão: 1.0
*/

smartSig.registerCtrl("formCadastroTipoItensPublicacao", function($scope, $http, $routeParams, Mensagem, $timeout, Permissao, $filter){    

    $scope.permissoes = Permissao.validaPermissao();

    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    $scope.tipoitenspublicacao       = {};
    $scope.tipoitenspublicacao.ativo = 1;     

    var id = $routeParams.id;    

    /* ----------------------------------------------------------------------------------*/
    /* Funções para cadastro da tipoitenspublicacao                                                     */
    /* ----------------------------------------------------------------------------------*/
    $scope.cadastrarTipoItensPublicacao = function() {
      if ($('#cadastroTipoItensPublicacao-form').valid()) {
      
        $scope.json = angular.toJson($scope.tipoitenspublicacao);
        $http.post('api/index.php/tipoitenspublicacao/', $scope.json,{withCredentials: true,headers: {'enctype': 'multipart/form-data' },})
                   
        .success(function(data, status, headers, config) {
           
           if (data.error == '0'){

              Mensagem.success(data.mensagem);
              $scope.tipoitenspublicacao.id = data.id_retorno;
           }
           else { Mensagem.error(data.mensagem); }
        })
        .error(function(data, status) { });
      }
    }    

    $scope.novoCadastro = function(){
      $scope.tipoitenspublicacao = {};
      $scope.tipoitenspublicacao.ativo = 1;
    }
    
    $scope.getIdTipoItensPublicacao = function(id){
      $http.get('api/index.php/tipoitenspublicacao/'+id)
        .success(function(data, status, headers, config) {
          
          $scope.tipoitenspublicacao = data.tipo_itens_publicacao[0];          
        })
        .error(function(data, status, headers, config) { });
    }

    if (id != undefined) {
      $timeout(function(){ $scope.getIdTipoItensPublicacao(id); }, 800);
    };
});

//@ sourceURL=controller.formCadastroTipoItensPublicacao.js