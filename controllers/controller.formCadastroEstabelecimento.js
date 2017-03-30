/*
  Módulo: Escola
  Descrição: CRUD Estabelecimento
  Método: GET
  URL: /forms/formCadastroEstabelecimento
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 12/03/2015
  Autor: HAMZI JALEL
  Versão: 1.0
  Data de Alteração: 12/03/2015
 */
smartSig.registerCtrl("formCadastroEstabelecimento", function($scope, $http, $routeParams, Mensagem, $timeout, Permissao){

    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    var idEstabelecimento = $routeParams.id;

    $scope.estabelecimento = {};
    $scope.error = '';  
    $scope.estabelecimento.ativo=1;
    $scope.estabelecimento.tipo=1;
    $scope.cidade = {};
    $scope.cidades = {};  

    $scope.cadastrarEstabelecimento = function(objeto) {      

      if ($('#cadastroEstabelecimento-form').valid()) {

        $scope.json = angular.toJson($scope.estabelecimento);
                            
        $http.post('api/index.php/estabelecimento/', $scope.json, 
                                       {withCredentials: true,
                                       headers: {'enctype': 'multipart/form-data' },
                                       }
        ).success(function(data, status, headers, config) {
           if (data.error == '0')
           {   
              Mensagem.success(data.mensagem);   
              $scope.estabelecimento.id = data.id;              
           }
           else
           {
              Mensagem.error(data.mensagem);   
           }
        }).error(function(data, status) { 
          
        });
      }

    }  

    $scope.getIdEstabelecimento = function(){
      $http.get('api/index.php/estabelecimento/'+idEstabelecimento).    
        success(function(data, status, headers, config) {

          $scope.estabelecimento = {};

          $scope.estabelecimento = data.estabelecimento[0];  

          $scope.getCidade(data.estabelecimento[0].estado);
          
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }  

    if (idEstabelecimento != undefined) {
      $scope.getIdEstabelecimento();
    };

    $scope.getEstado = function(){

       $http.get('api/index.php/estado/').    
       success(function(data, status, headers, config) {                 
          $scope.estados = data;
       }).
       error(function(data, status, headers, config) {
          // log error
       });
         
    }  

    $scope.getCidade = function(uf){

      console.log('UF:',uf);

       $http.get('api/index.php/cidade/'+uf).    
       success(function(data, status, headers, config) {                 
          $scope.cidades = data;
       }).
       error(function(data, status, headers, config) {
          // log error
       });

    }  

    $scope.novoCadastro = function(){
      $scope.estabelecimento = {};
      $scope.estabelecimento.ativo = 1;
      $scope.estabelecimento.tipo =1;
      $scope.cidade = {};
      $scope.cidades = {};
    }

    //Inicializa Combos
    $scope.getEstado();   
    

});