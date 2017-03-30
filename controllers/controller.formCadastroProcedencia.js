/*
  Módulo: Mesquita
  Descrição: CRUD Procedencia
  Método: GET
  URL: /gestao/formCadastroProcedencia
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 07/01/2014
  Autor: Ricardo Bruno
  Versão: 1.0
  Data de Alteração: 07/01/2014
 */
smartSig.registerCtrl("formCadastroProcedencia", function($scope, $http, $routeParams, Mensagem, $timeout, Permissao){

    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    var idProcedencia = $routeParams.id;

    $scope.procedencia = {};
    $scope.error = '';  
    $scope.procedencia.ativo=1;

    $scope.cadastrarProcedencia = function(objeto) {      

      if ($('#cadastroProcedencia-form').valid()) {

        $scope.json = angular.toJson($scope.procedencia);
                            
        $http.post('api/index.php/procedencia/', $scope.json, 
                                       {withCredentials: true,
                                       headers: {'enctype': 'multipart/form-data' },
                                       }
        ).success(function(data, status, headers, config) {
           if (data.error == '0')
           {   
              $scope.objeto = {}; 

              Mensagem.success(data.mensagem);   

              $scope.procedencia = {};
              $scope.procedencia.ativo=1;
           }
           else
           {
              Mensagem.error(data.mensagem);   
           }
        }).error(function(data, status) { 
          
        });
      }

    }  

    $scope.getIdProcedencia = function(){
      $http.get('api/index.php/procedencia/1/'+idProcedencia).    
        success(function(data, status, headers, config) {      
          $scope.procedencia = data.procedencia[0];   

          console.log($scope.procedencia)                    ;
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }  
    
    $scope.novoCadastro = function(){
      $scope.procedencia = {};
      $scope.procedencia.ativo = 1;
    }

    if (idProcedencia != undefined) {
      $timeout(function() {
        $scope.getIdProcedencia(idProcedencia);
      }, 800);      
    };           

});