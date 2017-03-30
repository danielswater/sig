  /*
  Módulo: Mesquita
  Descrição: CRUD Bens
  Método: GET
  URL: /gestao/formCadastroBens
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 06/03/2015
  Autor: Fabio da Silva
  Versão: 1.0
  Data de Alteração: 06/03/2015
 */
smartSig.registerCtrl("formCadastroFormaTratamento", function($scope, $location, $http, $routeParams, Mensagem, $timeout, Permissao, $modal){

    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    var idFormaTratamento = $routeParams.id;

    $scope.formaTratamento = {};
    $scope.error = '';  
    $scope.formaTratamento.ativo = 1;

    $scope.cadastrarFormaTratamento = function() {  

      if ($('#cadastroFormaTratamento-form').valid()) {

        $scope.json = angular.toJson($scope.formaTratamento);
                            
        $http.post('api/index.php/formatratamento/', $scope.json, 
                                       {withCredentials: true,
                                       headers: {'enctype': 'multipart/form-data' },
                                       }
        ).success(function(data, status, headers, config) {
           if (data.error == '0')
           {   

              Mensagem.success(data.mensagem);   
              /*  
              $scope.formaTratamento = {};
              $scope.formaTratamento.ativo = 1;
              */
           }
           else
           {
              Mensagem.error(data.mensagem);   
           }
        }).error(function(data, status) { 
          
        });
      }

    }  

    $scope.getFormaTratamento = function(){
      $http.get('api/index.php/formatratamento/1/'+idFormaTratamento).    
        success(function(data, status, headers, config) {      
          $scope.formaTratamento = data.forma_tratamento[0];                   
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    } 

    $scope.novoCadastro = function(){
      $scope.formaTratamento = {};
      $scope.formaTratamento.ativo = 1;
    }

    if (idFormaTratamento != undefined) {
      $scope.getFormaTratamento();
    };  
});