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


smartSig.registerCtrl("formCadastroTipoBloqueio", function($scope, $http, $routeParams, Mensagem, $timeout, Permissao){

    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    var idTipoBloqueio = $routeParams.id;

    $scope.tipoBloqueio = {};
    $scope.error = '';  
    $scope.tipoBloqueio.ativo=1;


    $scope.cadastrarTipoBloqueio = function(objeto) {      

      if ($('#cadastroTipoBloqueio-form').valid()) {

        $scope.json = angular.toJson($scope.tipoBloqueio);
                            
        $http.post('api/index.php/tipobloqueio/', $scope.json, 
                                       {withCredentials: true,
                                       headers: {'enctype': 'multipart/form-data' },
                                       }
        ).success(function(data, status, headers, config) {
           if (data.error == '0')
           {   
              //$scope.objeto = {}; 

              Mensagem.success(data.mensagem);

              console.log(data);  

              //$scope.tipoBloqueio = {};
              //$scope.tipoBloqueio.ativo=1;
              $scope.tipoBloqueio.id = data.id_tipo_bloqueio;
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
      $scope.tipoBloqueio = {};
      $scope.tipoBloqueio.ativo = 1;
    }


    $scope.getIdTipoBloqueio = function(){
      $http.get('api/index.php/tipobloqueio/1/'+idTipoBloqueio).    
        success(function(data, status, headers, config) {      
          $scope.tipoBloqueio = data.tipoBloqueio[0];   

          console.log($scope.tipoBloqueio);
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }     

    if (idTipoBloqueio != undefined) {
      $timeout(function() {
        $scope.getIdTipoBloqueio(idTipoBloqueio);
      }, 800);      
    };           

});