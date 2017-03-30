
smartSig.registerCtrl("formCadastroMoeda", function($scope, $http, $routeParams, Mensagem, $timeout, Permissao){

    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    var idMoeda = $routeParams.id;

    $scope.moeda = {};
    $scope.error = '';  
    $scope.moeda.ativo=1;

    $scope.cadastrarMoeda = function(objeto) {

      if ($('#cadastroMoeda-form').valid()) {

        $scope.json = angular.toJson($scope.moeda);
                            
        $http.post('api/index.php/moeda/', $scope.json, 
                                       {withCredentials: true,
                                       headers: {'enctype': 'multipart/form-data' },
                                       }
        ).success(function(data, status, headers, config) {
           if (data.error == '0')
           {   
              $scope.objeto = {}; 

              console.log(data);

              Mensagem.success(data.mensagem);   

              //$scope.moeda = {};
              $scope.moeda.ativo=1;
              $scope.moeda.id = data.id_moeda;
           }
           else
           {
              Mensagem.error(data.mensagem);   
           }
        }).error(function(data, status) { 
          
        });
      }

    }

    $scope.getIdMoeda = function(){
      $http.get('api/index.php/moeda/'+idMoeda).    
        success(function(data, status, headers, config) {      
          $scope.moeda = data.moeda[0];   

          console.log($scope.moeda);
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }
    
    $scope.novoCadastro = function(){
      $scope.moeda = {};
      $scope.moeda.ativo = 1;
    }

      if (idMoeda != undefined) {
        $timeout(function() {
          $scope.getIdMoeda(idMoeda);
        }, 800);      
     };

});