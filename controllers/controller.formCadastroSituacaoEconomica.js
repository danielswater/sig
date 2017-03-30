/*
  Módulo: Mesquita
  Descrição: CRUD Situação Econômica
  Método: GET
  URL: /gestao/formCadastroSituacaoEconomica
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 07/01/2014
  Autor: Ricardo Bruno
  Versão: 1.0
  Data de Alteração: 07/01/2014
 */
smartSig.registerCtrl("formCadastroSituacaoEconomica", function($scope, $http, $routeParams, Mensagem, $timeout, Permissao){

    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    var idSituacaoEconomica = $routeParams.id;

    $scope.situacaoeconomica = {};
    $scope.error = '';  
    $scope.situacaoeconomica.ativo=1;

    $scope.cadastrarSituacaoEconomica = function(objeto) {      

      if ($('#cadastroSituacaoEconomica-form').valid()) {

        $scope.json = angular.toJson($scope.situacaoeconomica);
                            
        $http.post('api/index.php/situacaoeconomica/', $scope.json, 
                                       {withCredentials: true,
                                       headers: {'enctype': 'multipart/form-data' },
                                       }
        ).success(function(data, status, headers, config) {
           if (data.error == '0')
           {   
              $scope.objeto = {}; 

              Mensagem.success(data.mensagem);   

              $scope.situacaoeconomica = {};
              $scope.situacaoeconomica.ativo=1;
           }
           else
           {
              Mensagem.error(data.mensagem);   
           }
        }).error(function(data, status) { 
          
        });
      }

    }  

    $scope.idSituacaoEconomica = function(){
      $http.get('api/index.php/siteconomica/1/'+idSituacaoEconomica).    
        success(function(data, status, headers, config) {      
          $scope.situacaoeconomica = data.situacaoeconomica[0];   

          console.log($scope.situacaoeconomica)                    ;
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }  

    $scope.novoCadastro = function(){
      $scope.situacaoeconomica = {};
      $scope.situacaoeconomica.ativo = 1;
    }
 

    if (idSituacaoEconomica != undefined) {
      $timeout(function() {
        $scope.idSituacaoEconomica(idSituacaoEconomica);
      }, 800);      
    };           

});