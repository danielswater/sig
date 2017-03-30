/*
  Módulo: Escola
  Descrição: CRUD Orgão Emissor
  Método: POST(cadastraOrgaoEmissor)/GET(getIdOrgaoEmissor)
  URL: /forms/formCadastroOrgaoEmissor
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 19/02/2015
  Autor: Ricardo Nakadomari
  Versão: 1.0
  Data de Alteração: 19/02/2015
 */


smartSig.registerCtrl("formCadastroOrgaoEmissor", function($scope, $http, $routeParams, Mensagem, $timeout, Permissao){

    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    var idOrgaoEmissor = $routeParams.id;

    $scope.orgaoEmissor = {};
    $scope.error = '';  
    $scope.orgaoEmissor.ativo=1;


    $scope.cadastrarOrgaoEmissor = function(objeto) {      

      if ($('#cadastroOrgaoEmissor-form').valid()) {

        $scope.json = angular.toJson($scope.orgaoEmissor);
                            
        $http.post('api/index.php/orgaoemissor/', $scope.json, 
                                       {withCredentials: true,
                                       headers: {'enctype': 'multipart/form-data' },
                                       }
        ).success(function(data, status, headers, config) {
           if (data.error == '0')
           {   
              //$scope.objeto = {}; 

              Mensagem.success(data.mensagem);

              //console.log(data);

              //$scope.orgaoEmissor = {};
              //$scope.orgaoEmissor.ativo=1;
              $scope.orgaoEmissor.id = data.id_orgao_emissor;
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
      $scope.orgaoEmissor = {};
      $scope.orgaoEmissor.ativo = 1;
    }  


    $scope.getIdOrgaoEmissor = function(){
      $http.get('api/index.php/orgaoemissor/1/'+idOrgaoEmissor).    
        success(function(data, status, headers, config) {      
          $scope.orgaoEmissor = data.orgaoEmissor[0];   

          console.log($scope.orgaoEmissor);
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }     

    if (idOrgaoEmissor != undefined) {
      $timeout(function() {
        $scope.getIdOrgaoEmissor(idOrgaoEmissor);
      }, 800);      
    };           

});