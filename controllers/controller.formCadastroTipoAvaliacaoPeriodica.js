
/*
  Módulo: Escola
  Descrição: CRUD Cadastro de Tipo de Itens de Publicação
  Método: GET
  URL: /escolaforms/formCadastroTipoAvalPeriodica
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 30/06/2015
  Autor: Fábio Roberto Haydn
  Versão: 1.0
*/

smartSig.registerCtrl("formCadastroTipoAvaliacaoPeriodica", function($scope, $http, $routeParams, Mensagem, $timeout, Permissao, $filter){    

    $scope.permissoes = Permissao.validaPermissao();

    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    $scope.tipoavaliacaoperiodica       = {};
    $scope.tipoavaliacaoperiodica.ativo = 1;     

    var id = $routeParams.id;    

    /* ----------------------------------------------------------------------------------*/
    /* Funções para cadastro da tipoavaliacaoperiodica                                                     */
    /* ----------------------------------------------------------------------------------*/
    $scope.cadastrarTipoAvaliacaoPeriodica = function() {
      if ($('#cadastroTipoAvaliacaoPeriodica-form').valid()) {
      
        $scope.json = angular.toJson($scope.tipoavaliacaoperiodica);
        $http.post('api/index.php/tipoavaliacaoperiodica/', $scope.json,{withCredentials: true,headers: {'enctype': 'multipart/form-data' },})
                   
        .success(function(data, status, headers, config) {
           
           if (data.error == '0'){

              Mensagem.success(data.mensagem);
              $scope.tipoavaliacaoperiodica.id = data.id_retorno;
           }
           else { Mensagem.error(data.mensagem); }
        })
        .error(function(data, status) { });
      }
    }    

    $scope.novoCadastro = function(){
      $scope.tipoavaliacaoperiodica = {};
      $scope.tipoavaliacaoperiodica.ativo = 1;
    }
    
    $scope.getIdTipoAvaliacaoPeriodica = function(id){
      $http.get('api/index.php/tipoavaliacaoperiodica/'+id)
        .success(function(data, status, headers, config) {
          
          $scope.tipoavaliacaoperiodica = data.tipo_avaliacao_periodica[0];
        })
        .error(function(data, status, headers, config) { });
    }

    if (id != undefined) {
      $timeout(function(){ $scope.getIdTipoAvaliacaoPeriodica(id); }, 800);
    };
});

//@ sourceURL=controller.formCadastroTipoAvaliacaoPeriodica.js