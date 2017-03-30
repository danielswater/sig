/*
  Módulo: Escola
  Descrição: CRUD Tipo Contato
  URL: /gestao/formCadastroTipoContato
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 12/02/2015
  Autor: Hamzi Jalel
  Versão: 1.0
  Data de Alteração: 12/02/2015
 */
 
smartSig.registerCtrl("formCadastroTipoContato", function($scope, $http, $routeParams, Mensagem, $timeout, Permissao){

    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    var idTipoContato = $routeParams.id;

    $scope.tipocontato = {};
    $scope.error = '';  
    $scope.tipocontato.ativo=1;

    $scope.cadastrarTipoContato = function(objeto) {      

      if ($('#cadastroTipoContato-form').valid()) {

        $scope.json = angular.toJson($scope.tipocontato);
                            
        $http.post('api/index.php/tipodecontato/', $scope.json, 
                                       {withCredentials: true,
                                       headers: {'enctype': 'multipart/form-data' },
                                       }
        ).success(function(data, status, headers, config) {
           if (data.error == '0')
           {   
              $scope.objeto = {};

              console.log(data);

              Mensagem.success(data.mensagem);   

              //$scope.tipocontato = {};
              //$scope.tipocontato.ativo=1;
              $scope.tipocontato.id = data.id_tipocontato;
           }
           else
           {
              Mensagem.error(data.mensagem);   
           }
        }).error(function(data, status) { 
          
        });
      }

    }

    $scope.novoCadastro = function(){
      $scope.tipocontato = {};
      $scope.tipocontato.ativo = 1;
    }  

    
    $scope.getIdTipoContato = function(){
      $http.get('api/index.php/tipodecontato/1/'+idTipoContato).    
        success(function(data, status, headers, config) {      
          $scope.tipocontato = data.tipocontato[0];   

          //console.log($scope.tipocontato)                    ;
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }  
 

    if (idTipoContato != undefined) {
      $timeout(function() {
        $scope.getIdTipoContato(idTipoContato);
      }, 800);      
    };           
    
});