smartSig.registerCtrl("formCadastroTipoDoacao", function($scope, $http, $routeParams, Mensagem, $timeout, Permissao){

    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    var idTipoDoacao = $routeParams.id;

    $scope.tipoDoacao = {};
    $scope.error = '';  
    $scope.tipoDoacao.ativo = 1;

    $scope.cadastrarTipoDoacao = function(objeto) {      
      console.log('cadastrarTipoDoacao', objeto);
      if ($('#cadastroTipoDoacao-form').valid()) {

        $scope.json = angular.toJson(objeto);
                            
        $http.post('api/index.php/tipodoacao/', $scope.json, 
                                       {withCredentials: true,
                                       headers: {'enctype': 'multipart/form-data' },
                                       }
        ).success(function(data, status, headers, config) {
           if (data.error == '0')
           {   
              $scope.objeto = {}; 

              Mensagem.success(data.mensagem);   

              $scope.tipoDoacao = {};
              $scope.tipoDoacao.ativo=1;
           }
           else
           {
              Mensagem.error(data.mensagem);   
           }
        }).error(function(data, status) { 
          
        });
      }

    }  

    $scope.getIdTipoDoacao = function(){
      $http.get('api/index.php/tipodoacao/1/'+idTipoDoacao).    
        success(function(data, status, headers, config) {      
          $scope.tipoDoacao = data.tipo_doacao[0];  

          console.log('getIdTipoDoacao data', data);                     
          console.log('getIdTipoDoacao', $scope.tipo_doacao);                     
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }  

    $scope.novoCadastro = function(){
      $scope.tipoDoacao = {};
      $scope.tipoDoacao.ativo = 1;
    }

    if (idTipoDoacao != undefined) {
      $scope.getIdTipoDoacao();
    };        

});