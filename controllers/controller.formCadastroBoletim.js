

smartSig.registerCtrl("formCadastroBoletim", function($scope, $http, $routeParams, Mensagem, $timeout, Permissao){

    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    var idBoletim = $routeParams.id;

    console.log("Boletim",idBoletim);

    $scope.boletim = {};
    $scope.error = '';  
    $scope.boletim.ativo=1;
    $scope.boletim.tipo=1;


    $scope.cadastrarBoletim = function(objeto) {      

      if ($('#cadastroBoletim-form').valid()) {

        $scope.json = angular.toJson($scope.boletim);
                            
        $http.post('api/index.php/boletim/', $scope.json, 
                                       {withCredentials: true,
                                       headers: {'enctype': 'multipart/form-data' },
                                       }
        ).success(function(data, status, headers, config) {

           if(data.error != -1){ $scope.objeto = {};                                  
                                 $scope.boletim.id = data.id;     
                                 Mensagem.success(data.mensagem);}
           else                { Mensagem.error(data.mensagem)  ;}
           
        }).error(function(data, status) { /* log error */ });
      }
    }  


    $scope.getIdBoletim = function(){
      $http.get('api/index.php/boletim/'+idBoletim).    
        success(function(data, status, headers, config){
          $scope.boletim = data.boletim[0];   
        }).
        error(function(data, status, headers, config){ /* log error */ }); 
    }

    $scope.novoCadastro = function(){      
      $scope.boletim = {};
      $scope.boletim.ativo = 1;
      $scope.boletim.tipo = 1;
    }

    if (idBoletim != undefined){ 
      $scope.getIdBoletim() 
    };
               
  });