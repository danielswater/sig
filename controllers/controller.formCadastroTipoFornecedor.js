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
smartSig.registerCtrl("formCadastroTipoFornecedor", function($scope, $http, $routeParams, Mensagem, $timeout, Permissao){

    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    var idTipoFornecedor = $routeParams.id;

    $scope.tipofornecedor = {};
    $scope.error = '';  
    $scope.tipofornecedor.ativo=1;

    $scope.cadastrarTipoFornecedor = function() {      

      if ($('#cadastroTipoFornecedor-form').valid()) {

        $scope.json = angular.toJson($scope.tipofornecedor);
                            
        $http.post('api/index.php/tipofornecedor/', $scope.json, 
                                       {withCredentials: true,
                                       headers: {'enctype': 'multipart/form-data' },
                                       }
        ).success(function(data, status, headers, config) {
           if (data.error == '0')
           {   
              Mensagem.success(data.mensagem);   
              $scope.tipofornecedor.id = data.id_tipofornecedor;
           }
           else
           {
              Mensagem.error(data.mensagem);   
           }
        }).error(function(data, status) { 
          
        });
      }
    }  

    $scope.getIdTipoFornecedor = function(){
      $http.get('api/index.php/tipofornecedor/0/'+idTipoFornecedor).    
        success(function(data, status, headers, config) {      
          $scope.tipofornecedor = data.tipofornecedor[0]; 
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }  

    $scope.novoCadastro = function(){
      $scope.tipofornecedor = {};
      $scope.tipofornecedor.ativo = 1;
    }

    if (idTipoFornecedor != undefined) {
      $timeout(function() {
        $scope.getIdTipoFornecedor(idTipoFornecedor);
      }, 800);      
    };       

});