/*
  Módulo: Mesquita
  Descrição: CRUD Grupo Bens
  Método: GET
  URL: /gestao/formCadastroGrupoBens
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 07/01/2014
  Autor: Ricardo Bruno
  Versão: 1.0
  Data de Alteração: 07/01/2014
 */
smartSig.registerCtrl("formCadastroGrupoBens", function($scope, $http, $routeParams, Mensagem, $timeout, Permissao){

    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    var idGrupoBens = $routeParams.id;

    $scope.grupobens = {};
    $scope.error = '';  
    $scope.grupobens.ativo=1;

    $scope.cadastrarGrupoBens = function(objeto) {      

      if ($('#cadastroGrupoBens-form').valid()) {

        $scope.json = angular.toJson($scope.grupobens);
                            
        $http.post('api/index.php/grupobens/', $scope.json, 
                                       {withCredentials: true,
                                       headers: {'enctype': 'multipart/form-data' },
                                       }
        ).success(function(data, status, headers, config) {
           if (data.error == '0')
           {   
              $scope.objeto = {}; 

              Mensagem.success(data.mensagem);   

              $scope.grupobens = {};
              $scope.grupobens.ativo=1;
           }
           else
           {
              Mensagem.error(data.mensagem);   
           }
        }).error(function(data, status) { 
          
        });
      }

    }  

    $scope.getIdGrupoBens = function(){
      $http.get('api/index.php/grupobens/1/'+idGrupoBens).    
        success(function(data, status, headers, config) {      
          $scope.grupobens = data.grupobens[0];   

          console.log($scope.grupobens)                    ;
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }  
    
    $scope.novoCadastro = function(){
      $scope.grupobens = {};
      $scope.grupobens.ativo = 1;
    }

    if (idGrupoBens != undefined) {
      $timeout(function() {
        $scope.getIdGrupoBens(idGrupoBens);
      }, 800);      
    };           

});