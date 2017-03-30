

smartSig.registerCtrl("formCadastroStatus", function($scope, $http, $routeParams, Mensagem, $timeout, Permissao){

    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    var idStatus = $routeParams.id;

    $scope.status = {};
    $scope.error = '';  
    $scope.status.ativo=1;


    $scope.cadastrarStatus = function(objeto) {

      if ($('#cadastroStatus-form').valid()) {

        $scope.json = angular.toJson(objeto);
                            
        $http.post('api/index.php/status/', $scope.json, 
                                       {withCredentials: true,
                                       headers: {'enctype': 'multipart/form-data' },
                                       }
        ).success(function(data, status, headers, config) {
           if (data.error == '0')
           {   
              //$scope.objeto = {}; 

              Mensagem.success(data.mensagem);   

              //$scope.ciclo = {};
              //$scope.ciclo.ativo=1;
              $scope.status.id = data.id_status;
           }
           else
           {
              Mensagem.error(data.mensagem);   
           }
        }).error(function(data, status) { 
          
        });
      }

    }  


    $scope.getIdStatus = function(){
      $http.get('api/index.php/statusvaga/'+idStatus).    
        success(function(data, status, headers, config) {      
          $scope.status = data.statusvaga[0];   
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }

    $scope.novoCadastro = function(){
      $scope.status = {};
      $scope.status.ativo = 1;
    }

    if (idStatus != undefined) {
      $timeout(function() {
        $scope.getIdStatus(idStatus);
      }, 800);      
    };           

});