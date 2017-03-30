/*
  Módulo: Escola
  Descrição: CRUD GrupoTipo de Carne
  Método: GET
  URL: /forms/formCadastroGrupoTipoCarne
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 22/05/2015
  Autor: Fábio Roberto Haydn
  Versão: 1.0  
 */
smartSig.registerCtrl("formCadastroGrupoTipoCarne", function($scope, $http, $routeParams, Mensagem, $timeout, Permissao){

    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    var idGrupoTipoCarne = $routeParams.id;

    $scope.grupotipocarne = {};    
    $scope.grupotipocarne.ativo=1;        
    $scope.error = '';  

    
    $scope.cadastrarGrupoTipoCarne = function(objeto) {

      if ($('#cadastroGrupoTipoCarne-form').valid()) {
        
         $scope.json = angular.toJson($scope.grupotipocarne);
                            
        $http.post('api/index.php/grupotipocarne/', $scope.json,{withCredentials: true,headers: {'enctype': 'multipart/form-data' },})
        .success(function(data, status, headers, config) {
           if (data.error == '0')
           {   
              Mensagem.success(data.mensagem);   
              $scope.grupotipocarne.id = data.id;
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

    $scope.getIdGrupoTipoCarne = function(){
      $http.get('api/index.php/grupotipocarne/'+idGrupoTipoCarne)
        .success(function(data, status, headers, config) {

            $scope.grupotipocarne = {};
            $scope.grupotipocarne.ativo = 1;
            $scope.grupotipocarne = data.grupo_tipo_carne[0];            
        })
        .error(function(data, status, headers, config) { }); 
    }  

    if (idGrupoTipoCarne != undefined) {
      $scope.getIdGrupoTipoCarne();
    }; 

    $scope.novoCadastro = function(){
      $scope.grupotipocarne = {};
      $scope.grupotipocarne.ativo = 1;
    }  
});

//@ sourceURL=controller.formCadastroGrupoTipoCarne.js