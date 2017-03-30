/*
  Módulo: Escola
  Descrição: CRUD Convênio
  Método: POST(cadastraConvenio)/GET(getIdConvenio)
  URL: /forms/formCadastroConvenio
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 07/03/2015
  Autor: Ricardo Nakadomari
  Versão: 1.0
  Data de Alteração: 07/03/2015
 */


smartSig.registerCtrl("formCadastroConvenio", function($scope, $http, $routeParams, Mensagem, $timeout, Permissao){

    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    var idConvenio = $routeParams.id;

    $scope.convenio = {};
    $scope.error = '';  
    $scope.convenio.ativo=1;

    $scope.cadastrarConvenio = function(objeto) {      
      if ($('#cadastroConvenio-form').valid()) {
        $scope.json = angular.toJson($scope.convenio);
                            
        $http.post('api/index.php/convenio/', $scope.json, 
          {withCredentials: true,
            headers: {'enctype': 'multipart/form-data' },
          }
        ).success(function(data, status, headers, config) {
           if (data.error != -1){
              $scope.objeto = {}; 

              Mensagem.success(data.mensagem);

              //$scope.convenio.ativo=1;
              $scope.convenio.id = data.id;
           }
           else {
              Mensagem.error(data.mensagem);   
           }
        }).error(function(data, status) { 
          
        });
      }
    }

    $scope.novoCadastro = function(){
      $scope.convenio = {};
      $scope.convenio.ativo = 1;
    }


    $scope.getIdConvenio = function(){
      $http.get('api/index.php/convenio/1/'+idConvenio).    
        success(function(data, status, headers, config) {      
          $scope.convenio = data.convenio[0];   

          console.log($scope.convenio);
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }     

    if (idConvenio != undefined) {
      $timeout(function() {
        $scope.getIdConvenio(idConvenio);
      }, 800);      
    };           

});