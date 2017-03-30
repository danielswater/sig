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
smartSig.registerCtrl("formCadastroDepartamentoFuncionario", function($scope, $http, $routeParams, Mensagem, $timeout, Permissao){

    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    var idDeptoFuncionario = $routeParams.id;

    $scope.depto = {};
    $scope.error = '';  
    $scope.depto.ativo=1;

    $scope.cadastrarDeptoFuncionario = function() {

      if ($('#cadastroDepartamentoFuncionarios-form').valid()) {

        $scope.json = angular.toJson($scope.depto);
                            
        $http.post('api/index.php/departamentofuncionario/', $scope.json, 
                                       {withCredentials: true,
                                       headers: {'enctype': 'multipart/form-data' },
                                       }
        ).success(function(data, status, headers, config) {
           if (data.error == '0'){   
              $scope.depto.id = data.id_depto;
              Mensagem.success(data.mensagem);              
           }else{
              Mensagem.error(data.mensagem);   
           }
        }).error(function(data, status) { });
      }
    }  

     $scope.getIdDeptoFuncionario = function(){
       $http.get('api/index.php/deptofuncionarios/1/'+idDeptoFuncionario).    
         success(function(data, status, headers, config) {           
           $scope.depto = data.departamentos[0];           
         }).
         error(function(data, status, headers, config) {
          // log error
         }); 
     }  
 

     if (idDeptoFuncionario != undefined) {
       $timeout(function() {
         $scope.getIdDeptoFuncionario(idDeptoFuncionario);
       }, 800);      
    };           

    $scope.novoCadastro = function(){
      $scope.depto = {};
      $scope.depto.ativo = 1;
    }
});

//@ sourceURL=controller.formCadastroDepartamentoFuncionario.js