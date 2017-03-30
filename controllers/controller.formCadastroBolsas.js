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
smartSig.registerCtrl("formCadastroBolsas", function($scope, $location, $http, $routeParams, Mensagem, $timeout, Permissao, $modal, $filter){

    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    var idBolsa = $routeParams.id;

    $scope.bolsa = {};
    $scope.alunos = [];
    $scope.aluno = [];
    $scope.cursos = [];
    $scope.curso = [];
    $scope.grupomotivobolsas = [];
    $scope.grupomotivobolsa = [];

    $scope.motivobolsas = [];
    $scope.motivobolsa = [];    

    $scope.padrinhos = [];
    $scope.padrinho = [];    

    $scope.etapas = {};
    $scope.situacoesMatriculas = {};


    $scope.getEtapa = function(){
        $http.get('api/index.php/etapa/1/').    
        success(function(data, status, headers, config) {                           
          $scope.etapas = data.etapa;
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }

    $scope.getAluno = function(){
        $http.get('api/index.php/consultapessoa/10/').    
        success(function(data, status, headers, config) {                           
          $scope.alunos = data.pessoa;
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }

    $scope.getPadrinho = function(){
        $http.get('api/index.php/consultapessoa/15/').    
        success(function(data, status, headers, config) {                           
          $scope.padrinhos = data.pessoa;
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

    $scope.getGrupoMotivoBolsa = function(){
        $http.get('api/index.php/grupomotivobolsa/1/').    
        success(function(data, status, headers, config) {                           
          $scope.grupomotivobolsas = data.grupo_motivo_bolsa;
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }

    $scope.getMotivoBolsa = function(){
        $http.get('api/index.php/motivobolsa/').    
        success(function(data, status, headers, config) {                           
          $scope.motivobolsas = data.motivo_bolsa;
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }    

    $scope.getSituacaoMatricula = function(){
        $http.get('api/index.php/situacaomatricula/1/').    
        success(function(data, status, headers, config) {                           
          $scope.situacoesMatriculas = data.situacao_matricula;
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }

    $scope.getBolsa = function(id){
        $http.get('api/index.php/bolsa/'+id).    
        success(function(data, status, headers, config) {
        console.log("bolsa", data);                         
          $scope.bolsa = data.retorno;
          $scope.aluno = {selected : {"id":$scope.bolsa.id_aluno,"nome":$scope.bolsa.aluno}};
          $scope.grupomotivobolsa = {selected : {"id":$scope.bolsa.id_grupo_motivo_bolsa,"descricao":$scope.bolsa.grupo_motivo_bolsa}};
          $scope.motivobolsa = {selected : {"id":$scope.bolsa.id_motivo_bolsa,"descricao":$scope.bolsa.motivo_bolsa}};
          $scope.curso = {selected : {"id":$scope.bolsa.id_curso,"nome":$scope.bolsa.curso}};
          $scope.padrinho = {selected : {"id":$scope.bolsa.id_pessoa_padrinho,"nome":$scope.bolsa.padrinho}};
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }

    $scope.changeAluno = function(item) {
      $scope.bolsa.id_aluno = item.id;
      $( "em[for='id_aluno']" ).css("display","none");
    }

    $scope.changePadrinho = function(item) {
      $scope.bolsa.id_pessoa_padrinho = item.id;
      $( "em[for='id_pessoa_padrinho']" ).css("display","none");
    }    

    $scope.changeCurso = function(item) {
      $scope.bolsa.id_curso = item.id;
      $( "em[for='id_curso']" ).css("display","none");
    }

    $scope.changeGrupoMotivoBolsa = function(item) {
      $scope.bolsa.id_grupo_motivo_bolsa = item.id;
      $( "em[for='id_grupo_motivo_bolsa']" ).css("display","none");

      $scope.getMotivoBolsa($scope.bolsa.id_grupo_motivo_bolsa);
    }

    $scope.changeMotivoBolsa = function(item) {
      $scope.bolsa.id_motivo_bolsa = item.id;
      $( "em[for='id_motivo_bolsa']" ).css("display","none");
    }    

    //método para verificar se calendário foi alterado
    $scope.$watch('bolsa.data_inicio_validade', function(){ 
      $scope.bolsa.data_inicio_validade1 = $scope.bolsa.data_inicio_validade;     
      if($scope.bolsa.data_inicio_validade1 != undefined || $scope.bolsa.data_inicio_validade != null){    
        $( "em[for='data_inicio_validade']" ).css("display","none"); 
      }
    });

    $scope.$watch('bolsa.data_final_validade', function(){ 
      $scope.bolsa.data_final_validade1 = $scope.bolsa.data_final_validade;     
      if($scope.bolsa.data_final_validade1 != undefined || $scope.bolsa.data_final_validade != null){    
        $( "em[for='data_final_validade']" ).css("display","none"); 
      }
    });

    $scope.novoCadastro = function(){
      $scope.bolsa = {};
      $scope.aluno.selected = '';
      $scope.curso.selected = '';
      $scope.grupomotivobolsa.selected = '';
      $scope.motivobolsa.selected = '';
      $scope.padrinho.selected = '';
    }

    $scope.cadastrarBolsa = function() {  

      if ($('#cadastroBolsas-form').valid()) {

        $scope.json = angular.toJson($scope.bolsa);
                            
        $http.post('api/index.php/bolsa/', $scope.json, 
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
        }).error(function(data, status) { 
          
        });
      }

    } 

    //Busca carregar dados do combo de departamento
    $scope.novoCadastro();
    $scope.getEtapa();
    $scope.getAluno();
    $scope.getPadrinho();
    $scope.getCurso();
    $scope.getGrupoMotivoBolsa();

    if (idBolsa != undefined) {
      $scope.getBolsa(idBolsa);
    };  
});
