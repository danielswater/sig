  /*
  Módulo: Mesquita
  Descrição: CRUD Bens
  Método: GET
  URL: /gestao/formCadastroBens
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 08/01/2014
  Autor: Fabio da Silva
  Versão: 1.0
  Data de Alteração: 15/03/2015
  Autor: Ricardo S. Nakadomari
  Adição do campo de Departamento
 */
smartSig.registerCtrl("formCadastroExecutar", function($scope, $location, $http, $routeParams, Mensagem, $timeout, Permissao, $modal){

    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    var idCargo = $routeParams.id;

    $scope.cargo = {};
    $scope.error = '';  
    $scope.cargo.ativo = 1;
    $scope.departamentos = [];

    $scope.cadastrarCargo = function(objeto) {  

      if ($('#cadastroCargo-form').valid()) {

        $scope.json = angular.toJson(objeto);
                            
        $http.post('api/index.php/cargo/', $scope.json, 
                                       {withCredentials: true,
                                       headers: {'enctype': 'multipart/form-data' },
                                       }
        ).success(function(data, status, headers, config) {
           if (data.error == '0')
           {   
              $scope.objeto = {}; 

              Mensagem.success(data.mensagem);   

              // $scope.cargo = {};
              $scope.cargo.id = data.id_cargo;
              $scope.cargo.ativo=1;
           }
           else
           {
              Mensagem.error(data.mensagem);   
           }
        }).error(function(data, status) { 
          
        });
      }

    }  

    $scope.getCargo = function(){
      $http.get('api/index.php/cargo/1/'+idCargo).    
        success(function(data, status, headers, config) {      
          $scope.cargo = data.cargo[0];                   
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    } 


    $scope.getDepartamento = function(){
        $http.get('api/index.php/departamento/').    
        success(function(data, status, headers, config) {                           
          $scope.departamentos = data.departamento;
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }       


    $scope.novoCadastro = function(){
      $scope.cargo = {};
      $scope.cargo.ativo = 1;
    }

    //Busca carregar dados do combo de departamento
    $scope.getDepartamento();

    if (idCargo != undefined) {
      $scope.getCargo();
    };  
});