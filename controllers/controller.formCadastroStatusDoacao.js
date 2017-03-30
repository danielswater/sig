smartSig.registerCtrl("formCadastroStatusDoacao", function($scope, $http, $routeParams, Mensagem, $timeout, Permissao){

    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    var idStatusDoacao = $routeParams.id;

    $scope.statusDoacao = {};
    $scope.error = '';  
    $scope.statusDoacao.ativo = 1;

    $scope.cadastrarStatusDoacao = function(objeto) {      
      console.log('cadastrarStatusDoacao', objeto);
      if ($('#cadastroStatusDoacao-form').valid()) {

        $scope.json = angular.toJson(objeto);
                            
        $http.post('api/index.php/statusdoacao/', $scope.json, 
                                       {withCredentials: true,
                                       headers: {'enctype': 'multipart/form-data' },
                                       }
        ).success(function(data, status, headers, config) {
           if (data.error == '0')
           {   
              $scope.objeto = {}; 

              Mensagem.success(data.mensagem);   

              $scope.statusDoacao = {};
              $scope.statusDoacao.ativo=1;
           }
           else
           {
              Mensagem.error(data.mensagem);   
           }
        }).error(function(data, status) { 
          
        });
      }

    }  

    $scope.getIdStatusDoacao = function(){
      $http.get('api/index.php/statusdoacao/1/'+idStatusDoacao).    
        success(function(data, status, headers, config) {      
          $scope.statusDoacao = data.status_doacao[0];                   
          console.log('getIdStatusDoacao', $scope.statusDoacao);
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }  
    
    $scope.novoCadastro = function(){
      $scope.statusDoacao = {};
      $scope.statusDoacao.ativo = 1;
    }

    if (idStatusDoacao != undefined) {
      $scope.getIdStatusDoacao();
    };        

});