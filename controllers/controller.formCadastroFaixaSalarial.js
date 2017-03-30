

smartSig.registerCtrl("formCadastroFaixaSalarial", function($scope, $http, $routeParams, Mensagem, $timeout, Permissao){

    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    var idFaixaSalarial = $routeParams.id;

    $scope.faixasalarial = {};
    $scope.error = '';  
    $scope.faixasalarial.ativo=1;


    $scope.cadastrarFaixaSalarial = function(objeto) {

      if ($('#cadastroFaixaSalarial-form').valid()) {

        $scope.json = angular.toJson(objeto);
                            
        $http.post('api/index.php/faixasalarial/', $scope.json, 
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
              $scope.faixasalarial.id = data.id_faixasalarial;
           }
           else
           {
              Mensagem.error(data.mensagem);   
           }
        }).error(function(data, status) { 
          
        });
      }

    }  


    $scope.getIdFaixaSalarial = function(){
      $http.get('api/index.php/salariofaixa/'+idFaixaSalarial).    
        success(function(data, status, headers, config) {
          console.log(" faixa salarial ",data);
          $scope.faixasalarial = data.faixasalarial[0];   

          console.log('faixa salarial',$scope.faixasalarial);
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }

    $scope.novoCadastro = function(){
      $scope.faixasalarial = {};
      $scope.faixasalarial.ativo = 1;
    }

    if (idFaixaSalarial != undefined) {
      $timeout(function() {
        $scope.getIdFaixaSalarial(idFaixaSalarial);
      }, 800);      
    };           

});