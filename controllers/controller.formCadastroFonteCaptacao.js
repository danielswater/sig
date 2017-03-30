/*
  Módulo: Mesquita
  Descrição: CRUD Tipo de Fornecedor
  Método: GET
  URL: /forms/formCadastroTipoFornecedor
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 21/12/2014
  Autor: Ricardo Bruno
  Versão: 1.0
  Data de Alteração: 21/12/2014
 */
smartSig.registerCtrl("formCadastroFonteCaptacao", function($scope, $http, $routeParams, Mensagem, $timeout, Permissao){

    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    var idFonteCaptacao = $routeParams.id;

    $scope.fonteCaptacao = {};
    $scope.error = '';  
    $scope.fonteCaptacao.ativo = 1;

    $scope.cadastrarFonteCaptacao = function() {      

      if ($('#cadastroFonteCaptacao-form').valid()) {

        $scope.json = angular.toJson($scope.fonteCaptacao);
                            
        $http.post('api/index.php/fontecaptacao/', $scope.json, 
                                       {withCredentials: true,
                                       headers: {'enctype': 'multipart/form-data' },
                                       }
        ).success(function(data, status, headers, config) {
           if (data.error == '0')
           {   
              $scope.objeto = {}; 

              Mensagem.success(data.mensagem);   

              $scope.fonteCaptacao = {};
              $scope.fonteCaptacao.ativo=1;
           }
           else
           {
              Mensagem.error(data.mensagem);   
           }
        }).error(function(data, status) { 
          
        });
      }

    }  

    $scope.getFonteCaptacao = function(){
      console.log(idFonteCaptacao);
      $http.get('api/index.php/fontecaptacao/'+idFonteCaptacao).    
        success(function(data, status, headers, config) {      
          $scope.fonteCaptacao = data[0]; 
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }  

    if (idFonteCaptacao != undefined) {
      $timeout(function() {
        $scope.getFonteCaptacao();
      }, 800);      
    };  

    $scope.novoCadastro = function(){
      $scope.fonteCaptacao = {};
      $scope.fonteCaptacao.ativo = 1;
    }      

});