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
smartSig.registerCtrl("formCadastroMatricula", function($scope, $location, $http, $routeParams, Mensagem, $timeout, Permissao, $modal, $filter){

    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    var idMatricula = $routeParams.id;

    $scope.matricula = {};

    $scope.alunos = [];
    $scope.aluno = [];
    $scope.cursos = [];
    $scope.curso = [];
    $scope.turmas = [];
    $scope.turma = [];

    $scope.etapas = {};
    $scope.situacoesSeries = {};


    $scope.getEtapa = function(){
        $http.get('api/index.php/etapa/1/').    
        success(function(data, status, headers, config) {                           
          $scope.etapas = data.etapa;

          console.log('etapa', $scope.etapas);
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }

    $scope.getAluno = function(){
        $http.get('api/index.php/carregapessoa/10').    
        success(function(data, status, headers, config) {                           
          $scope.alunos = data.pessoa;
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }

    $scope.getCurso = function(idEtapa){

      $scope.cursos = [];

      $http.get('api/index.php/curso/1/0/'+idEtapa)
      .success(function(data, status, headers, config) {
          $scope.cursos = data.curso;
      })
      .error(function(data, status, headers, config) {}); 
    }

    $scope.getTurma = function(id_curso){
      console.log('getTurma', id_curso);
      $http.get('api/index.php/turma/1/0/'+id_curso)
      .success(function(data, status, headers, config) {                           
        $scope.turmas = data.turma;
      })
      .error(function(data, status, headers, config) {}); 
    }

    $scope.getSituacaoSerie = function(){
        $http.get('api/index.php/situacaoserie/1/').    
        success(function(data, status, headers, config) {                           
          $scope.situacoesSeries = data.situacao_serie;
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }

    $scope.getMatricula = function(id){
        $http.get('api/index.php/matricula/'+id).    
        success(function(data, status, headers, config) {
          $scope.matricula = data.matricula[0];
          $scope.aluno = {selected : {"id":$scope.matricula.id_aluno,"nome":$scope.matricula.aluno}};
          //$scope.turma = {selected : {"id":$scope.matricula.id_turma,"nome":$scope.matricula.turma}};
          //$scope.curso = {selected : {"id":$scope.matricula.id_curso,"nome":$scope.matricula.curso}};
          
          $scope.getCurso($scope.matricula.id_etapa);
          $scope.getTurma($scope.matricula.id_curso);
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }

    $scope.getIdMatricula = function(idEtapa,idAluno){
        $http.get('api/index.php/matricula/0/0/'+idEtapa+'/'+idAluno)
        .success(function(data, status, headers, config) {

          $scope.matricula = data.matricula[0];
          $scope.aluno = {selected : {"id":$scope.matricula.id_aluno,"nome":$scope.matricula.aluno}};
        })
        .error(function(data, status, headers, config) {}); 
    }

    $scope.changeAluno = function(item) {
      $scope.matricula.id_aluno = item.id;
      $( "em[for='id_aluno']" ).css("display","none");
    }

    $scope.$watch('matricula.id_etapa', function(){ 
      if((typeof $routeParams.id=='undefined') && (typeof $scope.matricula.id_aluno!='undefined')){
        $scope.getIdMatricula($scope.matricula.id_etapa,$scope.matricula.id_aluno);
        $scope.getCurso($scope.matricula.id_etapa);
        $scope.getTurma($scope.matricula.id_curso);
      }
    });
    $scope.$watch('matricula.id_aluno', function(){ 
      if((typeof $routeParams.id=='undefined') && (typeof $scope.matricula.id_etapa!='undefined')){
        $scope.getIdMatricula($scope.matricula.id_etapa,$scope.matricula.id_aluno);
        $scope.getCurso($scope.matricula.id_etapa);
        $scope.getTurma($scope.matricula.id_curso);
      }      
    });


    $scope.changeCurso = function(item) {
      $scope.matricula.id_curso = item.id;
      $scope.getTurma($scope.matricula.id_curso);
      $( "em[for='id_curso']" ).css("display","none");
    }

    $scope.changeTurma = function(item) {
      $scope.matricula.id_turma = item.id;
      $( "em[for='id_turma']" ).css("display","none");
    }
    //método para verificar se calendário foi alterado
    $scope.$watch('matricula.data_transferencia_escola', function(){ 
      $scope.matricula.data_transferencia_escola1 = $scope.matricula.data_transferencia_escola;     
      if($scope.matricula.data_transferencia_escola1 != undefined || $scope.matricula.data_transferencia_escola != null){    
        $( "em[for='data_transferencia_escola']" ).css("display","none"); 
      }
    });

    $scope.$watch('matricula.data_contrato', function(){ 
      $scope.matricula.data_contrato1 = $scope.matricula.data_contrato;     
      if($scope.matricula.data_contrato1 != undefined || $scope.matricula.data_contrato != null){    
        $( "em[for='data_contrato']" ).css("display","none"); 
      }
    });

    $scope.$watch('matricula.data_matricula', function(){ 
      $scope.matricula.data_matricula1 = $scope.matricula.data_matricula;     
      if($scope.matricula.data_matricula1 != undefined || $scope.matricula.data_matricula != null){    
        $( "em[for='data_matricula']" ).css("display","none"); 
      }
    });

    $scope.novoCadastro = function(){
      $scope.matricula = {};
      $scope.etapa = '';
      $scope.aluno.selected = '';
      $scope.curso.selected = '';
      $scope.turma.selected = '';
    }

    $scope.cadastrarMatricula = function() {

      if ($('#cadastroMatricula-form').valid()) {

        $scope.json = angular.toJson($scope.matricula);
                            
        $http.post('api/index.php/matricula/', $scope.json, 
                                       {withCredentials: true,
                                       headers: {'enctype': 'multipart/form-data' },
                                       }
        ).success(function(data, status, headers, config) {
           if (data.error == '0')
           {   
              Mensagem.success(data.mensagem);   
              
              $scope.novoCadastro();
           }
           else
           {
              Mensagem.error(data.mensagem);   
           }
        }).error(function(data, status) {});
      }
    } 

    //Busca carregar dados do combo de departamento
    $scope.novoCadastro();
    $scope.getEtapa();
    $scope.getAluno();
    $scope.getSituacaoSerie();

    if (idMatricula != undefined) {
      $scope.getMatricula(idMatricula);
    }
});
//@ sourceURL=controller.formCadastroMatricula.js