

smartSig.registerCtrl("formCadastroTipoVaga", function($scope, $http, $routeParams, Mensagem, $timeout, Permissao){

    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    var idTipoVaga = $routeParams.id;

    $scope.tipovaga = {};
    $scope.error = '';  
    $scope.tipovaga.ativo=1;


    $scope.cadastrarTipoVaga = function(objeto) {

      if ($('#cadastroTipoVaga-form').valid()) {

        $scope.json = angular.toJson(objeto);
                            
        $http.post('api/index.php/tipovaga/', $scope.json, 
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
              $scope.tipovaga.id = data.id_tipovaga;
           }
           else
           {
              Mensagem.error(data.mensagem);   
           }
        }).error(function(data, status) { 
          
        });
      }

    }  


    $scope.getIdTipoVaga = function(){
      $http.get('api/index.php/tipovaga/'+idTipoVaga).    
        success(function(data, status, headers, config) { 
        console.log('asdasdasdasd',data);    
          $scope.tipovaga = data.tipovaga[0];   

          console.log('tipo de vaga',$scope.tipovaga);
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }

    $scope.novoCadastro = function(){
      $scope.tipovaga = {};
      $scope.status.ativo = 1;
    }

    if (idTipoVaga != undefined) {
      $timeout(function() {
        $scope.getIdTipoVaga(idTipoVaga);
      }, 800);      
    };           

});