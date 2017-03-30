  /*
  Módulo: Escola
  Descrição: CRUD Matricula
  Método: GET
  URL: /gestao/formCadastroMatricula
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 31/05/2015
  Autor: Fabio da Silva
  Versão: 1.0
 */
smartSig.registerCtrl("formCadastroGradeHorario", function($scope, $location, $http, $routeParams, Mensagem, $timeout, Permissao, $modal, $filter){

    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    var idGrade = $routeParams.id;

    $scope.grade = {};
    $scope.cursos = [];
    $scope.curso = [];
    $scope.turmas = [];
    $scope.turma = [];
    $scope.etapas = {};

    $scope.disciplinas = {};
    $scope.diasSemana = {};
    $scope.horarios = {};
    $scope.horario = {};
    $scope.hora = {};

    $scope.gradeHorarios = {};


    $scope.getEtapa = function(){
        $http.get('api/index.php/etapa/1/').    
        success(function(data, status, headers, config) {                           
          $scope.etapas = data.etapa;
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }

    $scope.getDisciplina = function(){
        $http.get('api/index.php/disciplina/1/').    
        success(function(data, status, headers, config) {                           
          $scope.disciplinas = data.disciplina;
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }

    $scope.getCurso = function(){
        $http.get('api/index.php/curso/1/').    
        success(function(data, status, headers, config) {                           
          $scope.cursos = data.curso;
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }

    $scope.getTurma = function(){
        $http.get('api/index.php/turma/1/').    
        success(function(data, status, headers, config) {                           
          $scope.turmas = data.turma;
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }

    $scope.getDiaSemana = function(){
        $http.get('api/index.php/diasemana/').    
        success(function(data, status, headers, config) {                           
          $scope.diasSemana = data.dia_semana;
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }

    $scope.getHorario = function(){
        $http.get('api/index.php/horario/').    
        success(function(data, status, headers, config) {                           
          $scope.horarios = data.horario;
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }

    $scope.getGrade = function(id){
      $http.get('api/index.php/grade/'+id).    
      success(function(data, status, headers, config) {                           
        $scope.grade = data.grade[0];
        $scope.turma = {selected : {"id":$scope.grade.id_turma,"nome":$scope.grade.turma}};
        $scope.curso = {selected : {"id":$scope.grade.id_curso,"nome":$scope.grade.curso}};

        console.log('getGrade', $scope.grade);
      }).
      error(function(data, status, headers, config) {
          // log error
        }); 
    }

    $scope.getGradeHorario = function(id){
        $http.get('api/index.php/horariograde/0/'+id).    
        success(function(data, status, headers, config) {                           
          $scope.gradeHorarios = data.grade_horario;
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }

    $scope.changeCurso = function(item) {
      $scope.grade.id_curso = item.id;
      $( "em[for='id_curso']" ).css("display","none");
    }

    $scope.changeTurma = function(item) {
      $scope.grade.id_turma = item.id;
      $( "em[for='id_turma']" ).css("display","none");
    }

    $scope.novoCadastro = function(){
      $scope.grade = {};
      $scope.grade.ativo = 1;
      $scope.curso.selected = '';
      $scope.turma.selected = '';

      $scope.novoCadastroHorario();

      $scope.gradeHorarios = {};
    }

    $scope.novoCadastroHorario = function(){
      $scope.horario = {};
      $scope.horario.ativo = 1;
    }

    $scope.cadastrarGrade = function() {  
      if ($('#cadastroGrade-form').valid()) {

        $scope.json = angular.toJson($scope.grade);
                            
        $http.post('api/index.php/grade/', $scope.json, 
                                       {withCredentials: true,
                                       headers: {'enctype': 'multipart/form-data' },
                                       }
        ).success(function(data, status, headers, config) {
           if (data.error == '0')
           {   
              Mensagem.success(data.mensagem);   
              $scope.grade.id = data.id;
           }
           else
           {
              Mensagem.error(data.mensagem);   
           }
        }).error(function(data, status) { 
          
        });
      }
    }

    $scope.cadastrarGradeHorario = function() {  
      if ($('#cadastroGradeHorario-form').valid()) {
        if ($scope.grade.id) {
          $scope.horario.id_grade = $scope.grade.id;
          $scope.json = angular.toJson($scope.horario);
                              
          $http.post('api/index.php/horariograde/', $scope.json, 
                                         {withCredentials: true,
                                         headers: {'enctype': 'multipart/form-data' },
                                         }
          ).success(function(data, status, headers, config) {
             if (data.error == '0')
             {   
                Mensagem.success(data.mensagem);   
                
                $scope.getGradeHorario($scope.grade.id);
                $scope.novoCadastroHorario();
             }
             else
             {
                Mensagem.error(data.mensagem);   
             }
          }).error(function(data, status) { 
            
          });
        }
      }else{
        Mensagem.error("Por favor, é necessário cadastrar a Grade de horários primeiro.");
      }
    }


    $scope.editCadastroGradeHorario = function(item) {
      $scope.horario = item
    }

    $scope.$watch('horario.id_horario', function() {
      console.log('item', $scope.horario.id_horario);
      if($scope.horario.id_horario != undefined){
        var item = $filter('filter')($scope.horarios, {"id":$scope.horario.id_horario});
        if(item.length > 0){
          $scope.hora = item[0];
        }
      }else{
        $scope.hora = {};
      }
    }); 

    $scope.delGradeHorario = function(indice, item){
      $scope.json = angular.toJson(item);

      $http.post('api/index.php/delgradehorario/', $scope.json, 
        {withCredentials: true,
          headers: {'enctype': 'multipart/form-data' },
        }).success(function(data, status, headers, config) {
          if (data.error != -1){
            Mensagem.success(data.mensagem); 

            $scope.gradeHorarios.splice(indice, 1);
          } else {
            Mensagem.error(data.mensagem); 
          }
        }).error(function(data, status) {
          // log error
        });
    }

    //Busca carregar dados do combo de departamento
    $scope.novoCadastro();
    $scope.novoCadastroHorario();
    $scope.getEtapa();
    $scope.getCurso();
    $scope.getTurma();
    $scope.getDisciplina();
    $scope.getDiaSemana();
    $scope.getHorario();

    if (idGrade != undefined) {
      $scope.getGrade(idGrade);
      $scope.getGradeHorario(idGrade);
    };  
});
