/*
  Módulo: Escola
  Descrição: CRUD Religião
  Método: POST(cadastraReligiao)/GET(getIdReligiao)
  URL: /forms/formCadastroReligiao
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 19/02/2015
  Autor: Ricardo Nakadomari
  Versão: 1.0
  Data de Alteração: 19/02/2015
 */


smartSig.registerCtrl("formCadastroReligiao", function($scope, $http, $routeParams, Mensagem, $timeout, Permissao){

    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    var idReligiao = $routeParams.id;

    $scope.religiao = {};
    $scope.error = '';  
    $scope.religiao.ativo=1;


    $scope.cadastrarReligiao = function(objeto) {      

      if ($('#cadastroReligiao-form').valid()) {

        $scope.json = angular.toJson($scope.religiao);
                            
        $http.post('api/index.php/religiao/', $scope.json, 
                                       {withCredentials: true,
                                       headers: {'enctype': 'multipart/form-data' },
                                       }
        ).success(function(data, status, headers, config) {
           if (data.error == '0')
           {   
              $scope.objeto = {}; 

              Mensagem.success(data.mensagem);
              console.log(data);

              //$scope.religiao = {};
              //$scope.religiao.ativo=1;
              $scope.religiao.id = data.id_religiao;
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
      $scope.religiao = {};
      $scope.religiao.ativo = 1;
    }


    $scope.getIdReligiao = function(){
      $http.get('api/index.php/religiao/1/'+idReligiao).    
        success(function(data, status, headers, config) {      
          $scope.religiao = data.religiao[0];   

          console.log($scope.religiao);
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }     

    if (idReligiao != undefined) {
      $timeout(function() {
        $scope.getIdReligiao(idReligiao);
      }, 800);      
    };           

});