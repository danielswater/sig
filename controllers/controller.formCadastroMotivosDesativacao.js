

smartSig.registerCtrl("formCadastroMotivosDesativacao", function($scope, $http, $routeParams, Mensagem, $timeout, Permissao){

    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    var idMotivo = $routeParams.id;

    $scope.motivos = {};
    $scope.error = '';  
    $scope.motivos.ativo=1;    


    $scope.cadastrarMotivosDesativacao = function(objeto) {

      if ($('#cadastroMotivosDesativacao-form').valid()) {

        $scope.json = angular.toJson($scope.motivos);
                            
        $http.post('api/index.php/motivosdesativacao/', $scope.json, {withCredentials: true, headers: {'enctype': 'multipart/form-data' },})
        .success(function(data, status, headers, config) {

           if(data.error != -1){ $scope.objeto = {};                                  
                                 $scope.motivos.id = data.id;     
                                 Mensagem.success(data.mensagem);}
           else                { Mensagem.error(data.mensagem)  ;}
           
        })
        .error(function(data, status) { /* log error */ });
      }
    }  

    $scope.getIdMotivosDesativacao = function(){

      $http.get('api/index.php/motivosdesativacao/'+idMotivo)
      .success(function(data, status, headers, config) {      
          $scope.motivos = data.motivos[0];   
          console.log('OK');
          return;
      })
      .error(function(data, status, headers, config) { console.log('OK'); return; }); 
    }

    $scope.novoCadastro = function(){      
      $scope.motivos = {};
      $scope.motivos.ativo = 1;      
    }

    if (idMotivo != undefined) {      
      $scope.getIdMotivosDesativacao();      
    };           
});