/*
  Módulo: Escola
  Descrição: CRUD Disciplina
  Método: POST(cadastraDisciplina)/GET(getIdDisciplina)
  URL: /forms/formCadastroDisciplina
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 07/03/2015
  Autor: Ricardo Nakadomari
  Versão: 1.0
  Data de Alteração: 07/03/2015
 */


smartSig.registerCtrl("formCadastroDisciplina", function($scope, $http, $routeParams, Mensagem, $timeout, Permissao){

    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    var idDisciplina = $routeParams.id;

    $scope.disciplina = {};
    $scope.error = '';  
    $scope.disciplina.ativo=1;


    $scope.cadastrarDisciplina = function(objeto) {      
      if ($('#cadastroDisciplina-form').valid()) {
        $scope.json = angular.toJson($scope.disciplina);
                            
        $http.post('api/index.php/disciplina/', $scope.json, 
                                       {withCredentials: true,
                                       headers: {'enctype': 'multipart/form-data' },
                                       }
        ).success(function(data, status, headers, config) {
           if (data.error == '0')
           {   
              $scope.objeto = {}; 

              Mensagem.success(data.mensagem);
              //$scope.disciplina = {};
              //$scope.disciplina.ativo=1;
              $scope.disciplina.id = data.id_disciplina;
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
      $scope.disciplina = {};
      $scope.disciplina.ativo = 1;
    }


    $scope.getIdDisciplina = function(){
      $http.get('api/index.php/disciplina/1/'+idDisciplina).    
        success(function(data, status, headers, config) {      
          $scope.disciplina = data.disciplina[0];   

          console.log($scope.disciplina);
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }     

    if (idDisciplina != undefined) {
      $timeout(function() {
        $scope.getIdDisciplina(idDisciplina);
      }, 800);      
    };           

});