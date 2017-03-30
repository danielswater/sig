/*
  Módulo: Escola
  Descrição: CRUD Cadastro Turma
  Método: GET
  URL: /escolaforms/formCadastroTurma
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 05/05/2015
  Autor: Fábio Roberto Haydn
  Versão: 1.0
*/

smartSig.registerCtrl("formCadastroTurma", function($scope, $http, $location, $routeParams, Mensagem, $timeout, Permissao){

    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {  });

    var idTurma = $routeParams.id;

    $scope.turma       = {};
    $scope.turma.ativo = 1; 

    $scope.etapas   = [];
    $scope.cursos   = []; 
    $scope.periodos = []; 
    $scope.tipos    = [];      

    $scope.itemEtapa   = {};
    $scope.itemCurso   = {};
    $scope.itemPeriodo = {};
    $scope.itemTipo    = {};

    $scope.matriculas = {};
    $scope.disciplinas_professores = {};

    $scope.error       = '';  

    $scope.cadastrarTurma = function(objeto) {      

      if ($('#cadastroTurma-form').valid()) {

        $scope.json = angular.toJson($scope.turma);
                   
        $http.post('api/index.php/turma/', $scope.json, {withCredentials: true, headers: {'enctype': 'multipart/form-data' },})
        .success(function(data, status, headers, config) {
          if(data.error != -1){ 
            $scope.objeto = {};
            $scope.turma.id = data.id;     
            Mensagem.success(data.mensagem);
          }else{ 
            Mensagem.error(data.mensagem);
          }
        })
        .error(function(data, status) { /* log error */ });
      }
    }

    /* FRH - Carregar Elementos <Select> ********************************************************** */    
    /* GET inicial */

    $scope.getEtapa = function(){
      $http.get('api/index.php/etapa/0')
      .success(function(data, status, headers, config){ $scope.select_etapas = data.etapa; })
      .error(function(data, status, headers, config){  });
    }

    $scope.getMatricula = function(id_turma, id_etapa){
      $http.get('api/index.php/matricula/0/'+id_turma+'/'+id_etapa)
      .success(function(data, status, headers, config){ 
        
        $scope.matriculas = data.matricula; 
        

      }).error(function(data, status, headers, config){  });
    }

    $scope.getDisciplinaProfessore = function(id_curso){
      $http.get('api/index.php/professorcurso/'+id_curso)
      .success(function(data, status, headers, config){ 
        
        $scope.disciplinas_professores = data.curso_professor; 
        
        console.log('getDisciplinasProfessores', $scope.disciplinas_professores);

      }).error(function(data, status, headers, config){  });
    }
  
    $scope.getCurso = function(){
      $http.get('api/index.php/curso/1')
      .success(function(data, status, headers, config){ 
        $scope.select_cursos = data.curso; 
        console.log('curso', $scope.select_cursos);
      })
      .error(function(data, status, headers, config){  });
    }
  
    $scope.getPeriodoAula = function(){
      $http.get('api/index.php/periodoaula/0')
      .success(function(data, status, headers, config){ $scope.select_periodos = data.periodo_aula; })
      .error(function(data, status, headers, config){  });
    }

    $scope.getTipoTurma = function(){
      $http.get('api/index.php/tipoturma/0')
      .success(function(data, status, headers, config){ $scope.select_tipos = data.tipoturma; })
      .error(function(data, status, headers, config){  });
    }

    /* GET com ID (Alterações) */

    $scope.getEtapa_ID = function(id){
      $http.get('api/index.php/etapa/'+id)
      .success(function(data, status, headers, config){ $scope.select_etapas = data.etapa; })
      .error(function(data, status, headers, config){  });
    }    
  
    $scope.getCurso_ID = function(id){
      $http.get('api/index.php/curso/'+id)
      .success(function(data, status, headers, config){ $scope.select_cursos = data.curso; })
      .error(function(data, status, headers, config){  });
    }
  
    $scope.getPeriodoAula_ID = function(id){
      $http.get('api/index.php/periodoaula/'+id)
      .success(function(data, status, headers, config){ $scope.select_periodos = data.periodo_aula; })
      .error(function(data, status, headers, config){  });
    }

    $scope.getTipoTurma_ID = function(id){
      $http.get('api/index.php/tipoturma/'+id)
      .success(function(data, status, headers, config){ $scope.select_tipos = data.tipoturma; })
      .error(function(data, status, headers, config){  });
    }
    

    /****************** FRH - Inicio Modal Etapa ******************/
    
    $scope.modalNovaEtapa = function(size){
      $('#myModalEtapa').modal('show');
    }

    $scope.verificarAcaoEtapa = function(item){
      if (item.id==-1) {
        $scope.modalNovaEtapa();
        $scope.itemEtapa.selected = '';
        $scope.getCiclo();
        $scope.getSituacaoEtapa();
      }
      $scope.turma.id_etapa = item.id;
      $( "em[for='id_etapa']" ).css("display","none");      
    }       

    $scope.mod_etapa       = {};
    $scope.mod_etapa.ativo = 1;
    $scope.ciclo           = {};
    $scope.situacao_etapa  = {};
    
    /** FRH - Controle de validação para campos de data *********************************************/

    $scope.$watch('mod_etapa.data_inicio', function()
    { 
      $scope.mod_etapa.data_inicio1 = $scope.mod_etapa.data_inicio;
      if($scope.mod_etapa.data_inicio1 != undefined || $scope.mod_etapa.data_inicio1 != null)
      {        
        $( "em[for='data_inicio']" ).css("display","none");
      }
    });

    $scope.$watch('mod_etapa.data_fim', function()
    {
      $scope.mod_etapa.data_fim1 = $scope.mod_etapa.data_fim;
      if($scope.mod_etapa.data_fim1 != undefined || $scope.mod_etapa.data_fim1 != null)
      {
        $( "em[for='data_fim']" ).css("display","none");
      }
    });
    /************************************************************************************************/

    $scope.adicionarModEtapa = function(){
      if ($('#cadastroModEtapa-form').valid()) 
      {
        $scope.mod_etapa.ativo = 1;
        $scope.json = angular.toJson($scope.mod_etapa);
        $http.post('api/index.php/etapa/', $scope.json,{withCredentials: true,headers: {'enctype': 'multipart/form-data' },})
        .success(function(data, status, headers, config) 
        {
          if (data.error == '0')
          {
            Mensagem.success(data.mensagem);
            $('#myModalEtapa').modal('hide');
            $scope.getEtapa();
            $scope.mod_etapa = {};
          }
          else
          {
            Mensagem.error(data.mensagem);
          }
        })
        .error(function(data, status) { });
      }
    }

    $scope.novoCadastroModEtapa = function()
    {
      $scope.etapa = {};
      $scope.etapa.ativo = 1;
    }

    $scope.getCiclo = function()
    {
      $http.get('api/index.php/ciclo/1')
      .success(function(data, status, headers, config) 
      {
        $scope.select_ciclo = data.ciclo;
      })
      .error(function(data, status, headers, config) {  });
    }

    $scope.getSituacaoEtapa = function()
    {
      $http.get('api/index.php/etapasituacao/')
      .success(function(data, status, headers, config) 
      {
        $scope.select_situacao = data.situacao_etapa;        
      })
      .error(function(data, status, headers, config) {  });
    }
    
    /****************** FRH - Fim Modal Etapa ******************/
    /****************** FRH - Inicio Modal Periodo Aula ******************/
    
    $scope.modalNovoPeriodo = function(size){
      $('#myModalPeriodo').modal('show');
    }

    $scope.verificarAcaoPeriodo = function(item){      
      if (item.id==-1) {
        $scope.modalNovoPeriodo();
        $scope.itemPeriodo.selected = '';
      }
      $scope.turma.id_periodo_aula = item.id;
      $("em[for='id_periodo_aula']").css("display","none");
    }

    $scope.mod_periodo       = {};
    $scope.mod_periodo.ativo = 1;
    
    $scope.adicionarModPeriodo = function(objeto) {      

      if ($('#cadastroModPeriodo-form').valid()) 
      {
        $scope.json = angular.toJson($scope.mod_periodo);

        $http.post('api/index.php/periodoaula/', $scope.json,{withCredentials: true,headers: {'enctype': 'multipart/form-data' },})        
        .success(function(data, status, headers, config) {
           if (data.error == '0')
           {   
              $scope.objeto = {};                             
              Mensagem.success(data.mensagem);
              $('#myModalPeriodo').modal('hide');
              $scope.getPeriodoAula();
              $scope.mod_periodo = {};
           }
           else
           {
              Mensagem.error(data.mensagem);   
           }
        })
        .error(function(data, status){  });
      }
    }

    $scope.novoCadastroModPeriodo = function(){
      $scope.periodo_aula = {};
      $scope.periodo_aula.ativo = 1;
    }
    
    /****************** FRH - Fim Modal Periodo Aula ******************/
    /****************** FRH - Inicio Modal Tipo de turma ******************/

    $scope.modalNovoTipo = function(size){
      $('#myModalTipo').modal('show');
    }

    $scope.verificarAcaoTipo = function(item){      
      if (item.id==-1) {
        $scope.modalNovoTipo();
        $scope.itemTipo.selected = '';
      }      
      $scope.turma.id_tipo_turma = item.id;
      $( "em[for='id_tipo_turma']" ).css("display","none");
    }
    
    $scope.error = '';  
    $scope.mod_tipo = {};    
    $scope.mod_tipo.ativo=1;

    $scope.adicionarModTipo = function(){
      if ($('#cadastroModTipo-form').valid()) 
      {
        $scope.mod_tipo.ativo = 1;
        $scope.json = angular.toJson($scope.mod_tipo);
        $http.post('api/index.php/tipoturma/', $scope.json,{withCredentials: true,headers: {'enctype': 'multipart/form-data' },})
        .success(function(data, status, headers, config) 
        {
          if (data.error == '0')
          {
            Mensagem.success(data.mensagem);
            $('#myModalTipo').modal('hide');
            $scope.getTipoTurma();
            $scope.mod_tipo = {};
          }
          else
          {
            Mensagem.error(data.mensagem);
          }
        })
        .error(function(data, status) { });
      }
    }

    $scope.novoCadastroModTipo = function()
    {
      $scope.mod_tipo = {};
      $scope.mod_tipo.ativo = 1;
    }
    

    /* ******************************************************************************************* */  

    $scope.getIdTurma = function(id){
      $http.get('api/index.php/turma/1/'+id)
      .success(function(data, status, headers, config){ 
        $scope.turma      = data.turma[0];           
        $scope.itemEtapa  = {selected : {"id":$scope.turma.id_etapa,        "descricao":$scope.turma.etapa_descricao}};        
        $scope.itemCurso  = {selected : {"id":$scope.turma.id_curso,        "descricao":$scope.turma.curso_descricao}};
        $scope.itemPeriodo= {selected : {"id":$scope.turma.id_periodo_aula, "descricao":$scope.turma.periodoaula_descricao}};        
        $scope.itemTipo   = {selected : {"id":$scope.turma.id_tipo_turma,   "descricao":$scope.turma.tipoturma_descricao}};                

        $scope.getMatricula(id, $scope.turma.id_etapa);
        $scope.getDisciplinaProfessore($scope.turma.id_curso);
      })
      .error(function(data, status, headers, config) {  });
    }

    $scope.novoCadastroTurma = function(){
      $scope.turma = {};
      $scope.turma.ativo = 1;

      $scope.itemEtapa   = {};
      $scope.itemCurso   = {};
      $scope.itemPeriodo = {};
      $scope.itemTipo    = {};

      $scope.matriculas = {};
      $scope.disciplinas_professores = {};
    }


  $scope.editCadastroAluno = function(id){
    $location.path('/escolaforms/formCadastroAluno/1/'+id);
  }

  $scope.editCadastroDisciplinaProfessor = function(id){
    $location.path('/escolaforms/formCadastroCurso/1/'+id);
  }

  $scope.currentPage = 1;
  $scope.pageSize = 10;
  $scope.sort = {
    active: 'descricao',
    descending: undefined
  } 

  $scope.changeSorting = function(column) {
    var sort = $scope.sort;
    if (sort.active == column) {
      sort.descending = !sort.descending;
    } else {
      sort.active = column;
      sort.descending = false;
    }
  };

  $scope.getIcon = function(column) {
    var sort = $scope.sort;
    if (sort.active == column) {
      return sort.descending
      ? 'glyphicon-chevron-up'
      : 'glyphicon-chevron-down';
    }
    return 'glyphicon-star';
  }

  $scope.getEtapa();
  $scope.getCurso();
  $scope.getPeriodoAula();
  $scope.getTipoTurma();

  if (idTurma != undefined){
    $timeout(function() {
      $scope.getIdTurma(idTurma);
      $scope.getTipoTurma_ID(id_tipoturma);
      //$scope.getPeriodoAula_ID(id_periodoaula);
      //$scope.getCurso_ID(id_curso);
      //$scope.getEtapa_ID(id_etapa);
    }, 800);
  }

});