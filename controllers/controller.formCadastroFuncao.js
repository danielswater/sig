/*
  Módulo: Escola
  Descrição: CRUD Função
  Método: POST(cadastrarFuncao)/GET(getFuncao)
  URL: /escolaforms/formCadastroFuncao
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 11/03/2015
  Autor: Luciano Almeida
  Versão: 1.0
 */
smartSig.registerCtrl("formCadastroFuncao", function($scope, $http, $routeParams, Mensagem, $timeout, Permissao){
    $scope.permissoes = Permissao.validaPermissao();

    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    var idFuncao = $routeParams.id;

    $scope.tipo = [];
    $scope.funcao = {};
    $scope.error = '';  
    $scope.funcao.ativo=1;
    $scope.tipofuncionarios = {};

    $scope.getTiposFuncionario = function(){
      $http.get('api/index.php/tipofuncionario/0/').
      success(function(data, status, headers, config) {
            
        $scope.tipofuncionarios = data.tipofuncionario;

      }).
      error(function(data, status, headers, config) { });
    };
    $scope.getTiposFuncionario();
    
    $scope.cadastrarFuncao = function(objeto) {
      if ($('#cadastroFuncao-form').valid()) {
        $scope.json = angular.toJson($scope.funcao);
        console.log($scope.json);

        $http.post('api/index.php/funcao', $scope.json,
          {withCredentials: true,
            headers: {'enctype': 'multipart/form-data' },
          }
        ).success(function(data, status, headers, config) {
           if (data.error != -1){
              $scope.objeto = {};

              Mensagem.success(data.mensagem);              
              $scope.funcao.id = data.id;
           }
           else{
              Mensagem.error(data.mensagem);   
           }
        }).error(function(data, status) {

        });
      }
    }

    $scope.getIdFuncao = function(){
      $http.get('api/index.php/funcao/1/'+idFuncao)
      .success(function(data, status, headers, config) {
          
          $scope.funcao = data.funcao[0];
          $scope.tipo = {selected : {"id":$scope.funcao.id_tipo_funcionario, "descricao":$scope.funcao.tipo_funcionario}};          
      })
      .error(function(data, status, headers, config) { });
    }     

    /* ************************************************************************************************************************* */
    /* MODAL - Tipo de Funcionário                                                                                              */
    /* ************************************************************************************************************************* */

    $scope.getTipoFuncionario = function(){
      $http.get('api/index.php/tipofuncionario/1/')
      .success(function(data, status, headers, config) {
           $scope.tipofuncionarios = data.tipofuncionario;
      })
      .error(function(data, status, headers, config) { });
    }

    $scope.verificarAcaoTipoFuncionario = function(item) {
      if (item.id==-1) {
        $scope.modalNovoTipoFuncionario();
      }

      $scope.funcao.id_tipo_funcionario = item.id;
      $( "em[for='tipo']" ).css("display","none");
    }

    $scope.modalNovoTipoFuncionario = function(size){
        $('#myModalTipoFuncionario').modal('show');
    }

    $scope.adicionarTipoFuncionario = function(){ 
      if ($('#cadastroTipoFuncionario-form').valid()) {
                
        $scope.addTipoFuncionario.ativo = 1;
        $scope.json = angular.toJson($scope.addTipoFuncionario);
                            
        $http.post('api/index.php/tipofuncionario/', $scope.json, {withCredentials: true, headers: {'enctype': 'multipart/form-data' },})
        .success(function(data, status, headers, config) {
            if (data.error == '0'){  
                Mensagem.success(data.mensagem);
                
                $('#myModalTipoFuncionario').modal('hide');
                                
                $scope.getTipoFuncionario();
                $scope.addTipoFuncionario = {};
                $scope.tipo.selected = '';
                
            } else {              
              Mensagem.error(data.mensagem);   
            }
        }).error(function(data, status) { });
      }
    }
    /* ************************************************************************************************************************* */

    if (idFuncao != undefined) {
      $timeout(function() {
        $scope.getIdFuncao(idFuncao);
      }, 800);
    };

    $scope.novoCadastro = function(){
      $scope.funcao = {};
      $scope.funcao.ativo = 1;
    }  


});

//@ sourceURL=controller.formCadastroFuncao.js