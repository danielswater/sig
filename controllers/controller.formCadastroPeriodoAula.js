/*
  Módulo: Escola
  Descrição: CRUD Período de Aula
  Método: POST(cadastrPeriodoAula)/GET(getIdPeriodoAula)
  URL: /forms/formCadastroPeriodoAula
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 07/03/2015
  Autor: Ricardo Nakadomari
  Versão: 1.0
  Data de Alteração: 07/03/2015
 */


smartSig.registerCtrl("formCadastroPeriodoAula", function($scope, $http, $routeParams, Mensagem, $timeout, Permissao){

    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    var idPeriodoAula = $routeParams.id;

    $scope.periodo_aula = {};
    $scope.error = '';  
    $scope.periodo_aula.ativo=1;


    $scope.cadastrarPeriodoAula = function(objeto) {      

      if ($('#cadastroPeriodoAula-form').valid()) {

        $scope.json = angular.toJson($scope.periodo_aula);
                            
        $http.post('api/index.php/periodoaula/', $scope.json, 
                                       {withCredentials: true,
                                       headers: {'enctype': 'multipart/form-data' },
                                       }
        ).success(function(data, status, headers, config) {
           if (data.error == '0')
           {   
              $scope.objeto = {}; 

              Mensagem.success(data.mensagem);
              console.log(data);

              //$scope.periodo_aula = {};
              //$scope.periodo_aula.ativo=1;
              $scope.periodo_aula.id = data.id_periodo_aula;
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
      $scope.periodo_aula = {};
      $scope.periodo_aula.ativo = 1;
    }


    $scope.getIdPeriodoAula = function(){
      $http.get('api/index.php/periodoaula/1/'+idPeriodoAula).    
        success(function(data, status, headers, config) {      
          $scope.periodo_aula = data.periodo_aula[0];   

          console.log($scope.periodo_aula);
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }     

    if (idPeriodoAula != undefined) {
      $timeout(function() {
        $scope.getIdPeriodoAula(idPeriodoAula);
      }, 800);      
    };           

});