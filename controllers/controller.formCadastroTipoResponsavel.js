/*
  Módulo: Escola
  Descrição: CRUD Tipo de Responsável
  Método: POST(cadastrarTipoResponsavel)/GET(getIdTipoResponsavel)
  URL: /forms/formCadastroTipoResponsavel
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 19/02/2015
  Autor: Ricardo Nakadomari
  Versão: 1.0
  Data de Alteração: 19/02/2015
 */


smartSig.registerCtrl("formCadastroTipoResponsavel", function($scope, $http, $routeParams, Mensagem, $timeout, Permissao){

    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    var idTipoResponsavel = $routeParams.id;

    $scope.tipoResponsavel = {};
    $scope.error = '';  
    $scope.tipoResponsavel.ativo=1;


    $scope.cadastrarTipoResponsavel = function(objeto) {      

      if ($('#cadastroTipoResponsavel-form').valid()) {

        $scope.json = angular.toJson($scope.tipoResponsavel);
                            
        $http.post('api/index.php/tiporesponsavel/', $scope.json, 
                                       {withCredentials: true,
                                       headers: {'enctype': 'multipart/form-data' },
                                       }
        ).success(function(data, status, headers, config) {
           if (data.error == '0')
           {   
              //$scope.objeto = {};

              Mensagem.success(data.mensagem);   

              //$scope.tipoResponsavel = {};
              //$scope.tipoResponsavel.ativo=1;
              $scope.tipoResponsavel.id = data.id_tipo_responsavel;

           }
           else
           {
              Mensagem.error(data.mensagem);   
           }
        }).error(function(data, status) { 
          
        });
      }

    }

    $scope.novoCadastro = function(){
      $scope.tipoResponsavel = {};
      $scope.tipoResponsavel.ativo = 1;
    }  


    $scope.getIdTipoResponsavel = function(){
      $http.get('api/index.php/tiporesponsavel/1/'+idTipoResponsavel).    
        success(function(data, status, headers, config) {      
          $scope.tipoResponsavel = data.tipoResponsavel[0];   

          console.log($scope.tipoResponsavel);
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }     

    if (idTipoResponsavel != undefined) {
      $timeout(function() {
        $scope.getIdTipoResponsavel(idTipoResponsavel);
      }, 800);      
    };           

});