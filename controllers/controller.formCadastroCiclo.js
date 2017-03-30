

smartSig.registerCtrl("formCadastroCiclo", function($scope, $http, $routeParams, Mensagem, $timeout, Permissao){

    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    var idCiclo = $routeParams.id;

    $scope.ciclo = {};
    $scope.error = '';  
    $scope.ciclo.ativo=1;


    $scope.cadastrarCiclo = function(objeto) {      

      if ($('#cadastroCiclo-form').valid()) {

        $scope.json = angular.toJson($scope.ciclo);
                            
        $http.post('api/index.php/ciclo/', $scope.json, 
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
              $scope.ciclo.id = data.id_ciclo;
           }
           else
           {
              Mensagem.error(data.mensagem);   
           }
        }).error(function(data, status) { 
          
        });
      }

    }  


    $scope.getIdCiclo = function(){
      $http.get('api/index.php/ciclo/1/'+idCiclo)
      .success(function(data, status, headers, config){
          $scope.ciclo = data.retorno[0];
      })
      .error(function(data, status, headers, config){}); 
    }

    $scope.novoCadastro = function(){
      $scope.ciclo = {};
      $scope.ciclo.ativo = 1;
    }

    if (idCiclo != undefined) {
      $timeout(function() {
        $scope.getIdCiclo(idCiclo);
      }, 800);      
    };           

});
//@ sourceURL=controller.formCadastroCiclo.js