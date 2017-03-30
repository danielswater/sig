/*
  Módulo: Escola
  Descrição: CRUD GrupoMotivo de Bolsa
  Método: GET
  URL: /forms/formCadastroGrupoMotivoBolsa
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 22/05/2015
  Autor: Fábio Roberto Haydn
  Versão: 1.0  
 */
smartSig.registerCtrl("formCadastroGrupoMotivoBolsa", function($scope, $http, $routeParams, Mensagem, $timeout, Permissao){

    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    var idGrupoMotivoBolsa = $routeParams.id;

    $scope.grupomotivobolsa = {};    
    $scope.grupomotivobolsa.ativo=1;        
    $scope.error = '';  

    
    $scope.cadastrarGrupoMotivoBolsa = function(objeto) {

      if ($('#cadastroGrupoMotivoBolsa-form').valid()) {
        
         $scope.json = angular.toJson($scope.grupomotivobolsa);
                            
        $http.post('api/index.php/grupomotivobolsa/', $scope.json,{withCredentials: true,headers: {'enctype': 'multipart/form-data' },})
        .success(function(data, status, headers, config) {
           if (data.error == '0')
           {   
              Mensagem.success(data.mensagem);   
              $scope.grupomotivobolsa.id = data.id;
           }
           else
           {
              Mensagem.error(data.mensagem);
           }
        })
        .error(function(data, status) {
         });
      }
    }  

    $scope.getIdGrupoMotivoBolsa = function(){
      $http.get('api/index.php/grupomotivobolsa/'+idGrupoMotivoBolsa)
        .success(function(data, status, headers, config) {

            $scope.grupomotivobolsa = {};
            $scope.grupomotivobolsa.ativo = 1;
            $scope.grupomotivobolsa = data.grupo_motivo_bolsa[0];            
        })
        .error(function(data, status, headers, config) { }); 
    }  

    if (idGrupoMotivoBolsa != undefined) {
      $scope.getIdGrupoMotivoBolsa();
    }; 

    $scope.novoCadastro = function(){
      $scope.grupomotivobolsa = {};
      $scope.grupomotivobolsa.ativo = 1;
    }  
});

//@ sourceURL=controller.formCadastroGrupoMotivoBolsa.js