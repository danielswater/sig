
/*
  Módulo: Escola
  Descrição: CRUD Cadastro de Tipo de Itens de Publicação
  Método: GET
  URL: /escolaforms/formCadastroGrupoTipoAvaliacaoPeriodica
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 30/06/2015
  Autor: Fábio Roberto Haydn
  Versão: 1.0
*/

smartSig.registerCtrl("formCadastroGrupoTipoAvaliacaoPeriodica", function($scope, $http, $routeParams, Mensagem, $timeout, Permissao, $filter){    

    $scope.permissoes = Permissao.validaPermissao();

    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    $scope.grupotipoavaliacaoperiodica       = {};
    $scope.grupotipoavaliacaoperiodica.ativo = 1;     

    var id = $routeParams.id;    

    /* ----------------------------------------------------------------------------------*/
    /* Funções para cadastro da grupotipoavaliacaoperiodica                                                     */
    /* ----------------------------------------------------------------------------------*/           
    $scope.cadastrarGrupoTipoAvaliacaoPeriodica = function() {
      if ($('#cadastroGrupoTipoAvaliacaoPeriodica-form').valid()) {
      
        $scope.json = angular.toJson($scope.grupotipoavaliacaoperiodica);
        $http.post('api/index.php/grupotipoavaliacaoperiodica/', $scope.json,{withCredentials: true,headers: {'enctype': 'multipart/form-data' },})
                   
        .success(function(data, status, headers, config) {
           
           if (data.error == '0'){

              Mensagem.success(data.mensagem);
              $scope.grupotipoavaliacaoperiodica.id = data.id_retorno;
           }
           else { Mensagem.error(data.mensagem); }
        })
        .error(function(data, status) { });
      }
    }    

    $scope.novoCadastro = function(){
      $scope.grupotipoavaliacaoperiodica = {};
      $scope.grupotipoavaliacaoperiodica.ativo = 1;
    }
    
    $scope.getIdGrupoTipoAvaliacaoPeriodica = function(id){
      $http.get('api/index.php/grupotipoavaliacaoperiodica/'+id)
        .success(function(data, status, headers, config) {
          
          $scope.grupotipoavaliacaoperiodica = data.grupo_tipo_avaliacao_periodica[0];
        })
        .error(function(data, status, headers, config) { });
    }

    if (id != undefined) {
      $timeout(function(){ $scope.getIdGrupoTipoAvaliacaoPeriodica(id); }, 800);
    };
});

//@ sourceURL=controller.formCadastroGrupoTipoAvaliacaoPeriodica.js