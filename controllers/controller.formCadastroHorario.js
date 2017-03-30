/*
  Módulo: Escola
  Descrição: CRUD Consulta Horario
  Método: GET
  URL: /consulta/consultaHorario
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 05/05/2015
  Autor: Fábio Roberto Haydn
  Versão: 1.0
*/

smartSig.registerCtrl("formCadastroHorario", function($scope, $http, $routeParams, Mensagem, $timeout, Permissao){

    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    var idHorario = $routeParams.id;

    $scope.horario = {};
    $scope.error = '';  
    $scope.horario.ativo=1;    

    $scope.cadastrarHorario = function() {      
      if ($('#cadastroHorario-form').valid()) {  
        if(parseFloat($scope.horario.hora_inicial.replace(":", "")) > parseFloat($scope.horario.hora_final.replace(":", ""))){
          Mensagem.error("Hora de Fim deve ser maior que Hora de Inicio!");
        }else{
          $scope.json = angular.toJson($scope.horario);

        var hini=parseInt($scope.horario.hora_inicial.toString().replace(':',''));
        var hfim=parseInt($scope.horario.hora_final.toString().replace(':',''));

        if(hini > hfim){ 
          Mensagem.error('A hora inicial não pode ser maior que a hora final'); 
          return; 
        };

        $scope.json = angular.toJson($scope.horario);

        $http.post('api/index.php/horario/', $scope.json, {withCredentials: true, headers: {'enctype': 'multipart/form-data' },})
        .success(function(data, status, headers, config) {

            if(data.error != -1){ 
              $scope.objeto = {};                                  
              $scope.horario.id = data.id;     
              Mensagem.success(data.mensagem);
            } else { 
              Mensagem.error(data.mensagem)  ;
            }
          })
          .error(function(data, status) { 
            /* log error */ 
          });
        }
      }
    }  

    $scope.getIdHorario = function(){

      $http.get('api/index.php/horario/'+idHorario)
      .success(function(data, status, headers, config){
          $scope.horario = data.horario[0];   
      })
      .error(function(data, status, headers, config) { /* log error */ }); 
    }

    $scope.novoCadastro = function(){      
      $scope.horario = {};
      $scope.horario.ativo = 1;      
    }

    if (idHorario != undefined) {      
      $scope.getIdHorario();
    };           
});