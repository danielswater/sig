smartSig.registerCtrl("formCadastroFuneraria", function($scope, $http, $routeParams, Mensagem, $timeout, Permissao){

    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    var idFuneraria = $routeParams.id;

    $scope.funeraria = {};
    $scope.endereco = {};
    $scope.estados = {};
    $scope.cidades = {}; 
    $scope.paises = {};   
    $scope.error = '';

    $scope.getCep = function(id){

        $http.get('api/index.php/cep/'+$scope.funeraria.cep).    
        success(function(data, status, headers, config) {                 
          if(data[0].error == -1){
            //$scope.error = data[0].mensagem;
            //Mensagem.error(data[0].mensagem);

        }else{
            $scope.endereco.cep = data[0].endereco.cep;
            $scope.funeraria.logradouro = data[0].endereco.logradouro;            
            $scope.funeraria.bairro = data[0].endereco.bairro;
            $scope.funeraria.estado = data[0].endereco.estado;
            $scope.funeraria.cidade = data[0].endereco.cidade;
            $scope.funeraria.idPais = data[0].endereco.idPais;
            $scope.estados    = data[0].estados;
            $scope.cidades    = data[0].cidades;
            $scope.paises     = data[0].pais;  
        }


    }).
        error(function(data, status, headers, config) {
          // log error
      }); 
    }

    $scope.getCnpjFuneraria = function(id){
        var cnpj = $("#"+id).val();

        cnpj = cnpj.replace(".", "");
        cnpj = cnpj.replace("/", "");
        cnpj = cnpj.replace("-", "");
        cnpj = cnpj.replace(".", "");

        $http.get('api/index.php/cnpjfuneraria/'+cnpj).        
        success(function(data, status, headers, config) {                 
          if(data[0].error == -1){
            $scope.error = data[0].mensagem;

            if (data[0].id_funeraria!=$scope.funeraria.id) {
              Mensagem.error(data[0].mensagem); 
              SalvarFuneraria.disabled = true; 
          } else {
              SalvarFuneraria.disabled = false;
          }


      } else {
        SalvarFuneraria.disabled = false;
    }         

}).
        error(function(data, status, headers, config) {
          // log error
      }); 
    }     

    $scope.getPaises = function(){

        $http.get('api/index.php/pais').    
        success(function(data, status, headers, config) {                           
          $scope.paises = data;
      }).
        error(function(data, status, headers, config) {
          // log error
      }); 
    }

    $scope.getPaises();

    $scope.getEstado = function(){
        $http.get('api/index.php/estado/')
        .success(function(data, status, headers, config) {                           
            //$scope.cidades = data;
            $scope.estados = data;
        })
        .error(function(data, status, headers, config) { });
    }

    $scope.getEstado();

    
    $scope.getCidade = function(uf){
        console.log("CIDADES", uf);
        $http.get('api/index.php/cidade/'+uf)
        .success(function(data, status, headers, config) {                           
            $scope.cidades = data;
        })
        .error(function(data, status, headers, config) { });
    } 

    $scope.cadastrarFuneraria = function(objeto) {      

      if ($('#cadastroFuneraria-form').valid()) {

        $scope.json = angular.toJson($scope.funeraria);

        $http.post('api/index.php/funeraria/', $scope.json, 
         {withCredentials: true,
             headers: {'enctype': 'multipart/form-data' },
         }
         ).success(function(data, status, headers, config) {
             if (data.error == '0')
             {   
              $scope.objeto = {}; 

              Mensagem.success(data.mensagem);   

              $scope.funeraria = {};
              SalvarFuneraria.disabled = true; 
          }
          else
          {
              Mensagem.error(data.mensagem);   
          }
      }).error(function(data, status) { 

      });
  }

}  

$scope.getIdFuneraria = function(){
  $http.get('api/index.php/funeraria/'+idFuneraria).    
  success(function(data, status, headers, config) {      
      $scope.funeraria = data.funeraria[0];             
      $scope.getCep();
      SalvarFuneraria.disabled = false;
  }).
  error(function(data, status, headers, config) {
          // log error
      }); 
}

$scope.novoCadastro = function(){
  $scope.funeraria = {};
  $scope.endereco = {};
  $scope.estados = {};
  $scope.cidades = {}; 
  $scope.paises = {};   
}  

if (idFuneraria != undefined) {
  $scope.getIdFuneraria();
};        





});