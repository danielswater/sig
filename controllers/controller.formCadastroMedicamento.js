/*
  Módulo: Escola
  Descrição: CRUD Medicamento
  URL: /gestao/formCadastroMedicamento
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 27/02/2015
  Autor: Hamzi Jalel
  Versão: 1.0
  Data de Alteração: 27/02/2015
 */
 
smartSig.registerCtrl("formCadastroMedicamento", function($scope, $http, $routeParams, Mensagem, $timeout, Permissao){

    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });  

    var idMedicamento = $routeParams.id;

    $scope.medicamento = {};
    $scope.error = '';  
    $scope.medicamento.ativo=true;

    $scope.cadastrarMedicamento = function(objeto) {    


      if ($('#cadastroMedicamento-form').valid()) {

        $scope.json = angular.toJson($scope.medicamento);
                            
        $http.post('api/index.php/medicamento/', $scope.json, 
                                       {withCredentials: true,
                                       headers: {'enctype': 'multipart/form-data' },
                                       }
        ).success(function(data, status, headers, config) {

          console.log('DATA:',data);         

           if (data.error == '0')
           {   
              $scope.objeto = {}; 
  
              Mensagem.success(data.mensagem);  

              //$scope.medicamento = {};
              //$scope.medicamento.ativo=1;
              $scope.medicamento.id = data.id_medicamento;

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
      $scope.medicamento = {};
      $scope.medicamento.ativo = 1;
    }
    
    $scope.getIdMedicamento = function(){
      $http.get('api/index.php/medicamento/1/'+idMedicamento).    
        success(function(data, status, headers, config) {      
          $scope.medicamento = data.medicamento[0];   

          console.log('hamzi',$scope.medicamento);

        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    } 


    if (idMedicamento != undefined) {
      $timeout(function() {

        $scope.getIdMedicamento(idMedicamento);



      }, 800);      
    };           
    
});