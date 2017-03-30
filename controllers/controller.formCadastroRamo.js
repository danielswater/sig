

smartSig.registerCtrl("formCadastroRamo", function($scope, $http, $routeParams, Mensagem, $timeout, Permissao){

    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    var idRamo = $routeParams.id;

    $scope.ramo = {};
    $scope.error = '';  
    $scope.ramo.ativo=1;


    $scope.cadastrarRamo = function(objeto) {

      if ($('#cadastroRamo-form').valid()) {

        $scope.json = angular.toJson(objeto);
                            
        $http.post('api/index.php/ramoempresa/', $scope.json, 
                                       {withCredentials: true,
                                       headers: {'enctype': 'multipart/form-data' },
                                       }
        ).success(function(data, status, headers, config) {
           if (data.error == '0')
           {   
              //$scope.objeto = {}; 

              Mensagem.success(data.mensagem);  
              $scope.ramo.id = data.id_ramo;
           }
           else
           {
              Mensagem.error(data.mensagem);   
           }
        }).error(function(data, status) { 
          
        });
      }

    }  


    $scope.getIdRamo = function(){
      $http.get('api/index.php/ramoempresa/'+idRamo).    
        success(function(data, status, headers, config) { 
        //console.log('asdasdasdasd',data);    
          $scope.ramo = data.ramoempresa[0];   

          console.log('ramo ',$scope.ramoempresa);
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }

    $scope.novoCadastro = function(){
      $scope.ramo = {};
      $scope.ramo.ativo = 1;
    }

    if (idRamo != undefined) {
      $timeout(function() {
        $scope.getIdRamo(idRamo);
      }, 800);      
    };           

});