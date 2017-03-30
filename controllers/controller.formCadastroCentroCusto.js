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
smartSig.registerCtrl("formCadastroCentroCusto", function($scope, $http, $routeParams, Mensagem, $timeout, Permissao){

    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    var idCentroCusto = $routeParams.id;

    $scope.centro_custo = {};
    $scope.error = '';  
    $scope.centro_custo.ativo=1;
    $scope.departamentos_funcionarios = [];

    $scope.cadastrarCentroCusto = function(objeto) {

      if ($('#cadastroCentroCusto-form').valid()) {

        $scope.json = angular.toJson($scope.centro_custo);
                            
        $http.post('api/index.php/centrocusto/', $scope.json, 
                                       {withCredentials: true,
                                       headers: {'enctype': 'multipart/form-data' },
                                       }
        ).success(function(data, status, headers, config) {
           if (data.error == '0')
           {   
              $scope.objeto = {}; 

              Mensagem.success(data.mensagem);   

              $scope.centro_custo = {};
              $scope.centro_custo.ativo=1;
           }
           else
           {
              Mensagem.error(data.mensagem);   
           }
        }).error(function(data, status) { 
          
        });
      }

    }

    $scope.getListaDepartamentoFuncionarios = function(){
      $http.get('api/index.php/deptofuncionarios/1/').    
         success(function(data, status, headers, config) {
          console.log(data);
           $scope.departamentos_funcionarios = data.departamentos;
           //console.log($scope.departamentos_funcionarios);
         }).
         error(function(data, status, headers, config) {
          // log error
         });
    }

     $scope.getIdCentroCusto = function(){
       $http.get('api/index.php/consultacentrocusto/1/'+idCentroCusto).    
         success(function(data, status, headers, config) {           
           $scope.centro_custo = data.centro_custo[0];           
         }).
         error(function(data, status, headers, config) {
          // log error
         }); 
     }
    
    $scope.novoCadastro = function(){
      $scope.centro_custo = {};
      $scope.centro_custo.ativo = 1;
    }

      if (idCentroCusto != undefined) {
        $timeout(function() {
          $scope.getIdCentroCusto(idCentroCusto);
        }, 800);      
     };    

    $scope.getListaDepartamentoFuncionarios();     

});