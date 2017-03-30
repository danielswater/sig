smartSig.registerCtrl("formCadastroLocalArmazenamentoDoacao", function($scope, $http, $routeParams, Mensagem, $timeout, Permissao){

    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    var idLocalArmazenamentoDoacao = $routeParams.id;

    $scope.localArmazenamentoDoacao = {};
    $scope.error = '';  
    $scope.localArmazenamentoDoacao.ativo = 1;

    $scope.cadastrarLocalArmazenamentoDoacao = function(objeto) {      
      console.log('cadastrarLocalArmazenamentoDoacao', objeto);
      if ($('#cadastroLocalArmazenamentoDoacao-form').valid()) {

        $scope.json = angular.toJson(objeto);
                            
        $http.post('api/index.php/localarmazenamentodoacao/', $scope.json, 
                                       {withCredentials: true,
                                       headers: {'enctype': 'multipart/form-data' },
                                       }
        ).success(function(data, status, headers, config) {
           if (data.error == '0')
           {   
              $scope.objeto = {}; 

              Mensagem.success(data.mensagem);   

              $scope.localArmazenamentoDoacao = {};
              $scope.localArmazenamentoDoacao.ativo=1;
           }
           else
           {
              Mensagem.error(data.mensagem);   
           }
        }).error(function(data, status) { 
          
        });
      }

    }  

    $scope.getIdLocalArmazenamentoDoacao = function(){
      $http.get('api/index.php/localarmazenamentodoacao/1/'+idLocalArmazenamentoDoacao).    
        success(function(data, status, headers, config) {      
          $scope.localArmazenamentoDoacao = data.local_armazenamento_doacao[0];                   
          console.log('getIdLocalArmazenamentoDoacao', $scope.localArmazenamentoDoacao);
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }  

    if (idLocalArmazenamentoDoacao != undefined) {
      $scope.getIdLocalArmazenamentoDoacao();
    };   

    $scope.novoCadastro = function(){
      $scope.localArmazenamentoDoacao = {};
      $scope.localArmazenamentoDoacao.ativo = 1;
    }     

});