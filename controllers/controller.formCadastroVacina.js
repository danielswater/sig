/*
  Módulo: Escola
  Descrição: CRUD Vacina
  URL: /gestao/formCadastroVacina
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 27/02/2015
  Autor: Hamzi Jalel
  Versão: 1.0
  Data de Alteração: 27/02/2015
 */
 
smartSig.registerCtrl("formCadastroVacina", function($scope, $http, $routeParams, Mensagem, $timeout, Permissao){

    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });  

    var idVacina = $routeParams.id;

    $scope.vacina = {};
    $scope.error = '';  
    $scope.vacina.ativo=true;

    $scope.cadastrarVacina = function(objeto) {    


      if ($('#cadastroVacina-form').valid()) {

        $scope.json = angular.toJson($scope.vacina);
                            
        $http.post('api/index.php/vacina/', $scope.json, 
                                       {withCredentials: true,
                                       headers: {'enctype': 'multipart/form-data' },
                                       }
        ).success(function(data, status, headers, config) {

          console.log('DATA:',data);         

           if (data.error == '0')
           {   
              //$scope.objeto = {}; 
  
              Mensagem.success(data.mensagem);  

              //$scope.vacina = {};
              //$scope.vacina.ativo=1;
              $scope.vacina.id = data.id_vacina;

           }
           else
           {
              Mensagem.error(data.mensagem);   
           }
        }).error(function(data, status) { 
          
        });
      }

    }

    $scope.novoCadastro = function(){
      $scope.vacina = {};
      $scope.vacina.ativo = 1;
    }

    
    $scope.getIdVacina = function(){
      $http.get('api/index.php/vacina/1/'+idVacina).    
        success(function(data, status, headers, config) {      
          $scope.vacina = data.vacina[0];   

          console.log('hamzi',$scope.vacina);

        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    } 


    if (idVacina != undefined) {
      $timeout(function() {

        $scope.getIdVacina(idVacina);



      }, 800);      
    };           
    
});