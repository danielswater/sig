/*
  Módulo: Cemitério
  Descrição: CRUD Quadra
  Método: GET
  URL: /forms/formCadastroQuadra
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 05/11/2014
  Autor: Ricardo Bruno
  Versão: 1.0
  Data de Alteração: 05/11/2014
 */
smartSig.registerCtrl("formCadastroCausaMortis", function($scope, $http, $routeParams, Mensagem, $timeout, Permissao){

    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    var idCausaMortis = $routeParams.id;

    $scope.causamortis = {};
    $scope.error = '';  
    $scope.causamortis.ativo=1;

    $scope.cadastrarCausaMortis = function(objeto) {      

      if ($('#cadastroCausaMortis-form').valid()) {

        $scope.json = angular.toJson($scope.causamortis);
                            
        $http.post('api/index.php/causamortis/', $scope.json, 
                                       {withCredentials: true,
                                       headers: {'enctype': 'multipart/form-data' },
                                       }
        ).success(function(data, status, headers, config) {
           if (data.error == '0')
           {   
              $scope.objeto = {}; 

              Mensagem.success(data.mensagem);   

              $scope.causamortis = {};
              $scope.causamortis.ativo=1;
           }
           else
           {
              Mensagem.error(data.mensagem);   
           }
        }).error(function(data, status) { 
          
        });
      }

    }  

    $scope.getIdCausaMortis = function(){
      $http.get('api/index.php/causamortis/'+idCausaMortis).    
        success(function(data, status, headers, config) {      
          $scope.causamortis = data.causamortis[0];                       
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }  

    $scope.novoCadastro = function(){
      $scope.causamortis = {};
      $scope.causamortis.ativo = 1;
    }

    if (idCausaMortis != undefined) {
      $scope.getIdCausaMortis();
    };        

    

    

});