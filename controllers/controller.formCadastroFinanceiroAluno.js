smartSig.registerCtrl("formCadastroFinanceiroAluno", function($scope, $http, $routeParams, Mensagem, $timeout, $rootScope, $location, $modal, $filter, Permissao){

    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
    });

    $scope.diasMes = [];

    for(var ct=1;ct<=31;ct++)
    {
      $scope.diasMes.push({'dia_vencimento':ct,'descricao':("0"+ct).split("").reverse().join("").substring(0,2).split("").reverse().join("")});
    }


    var idAlunoSelecionado = $routeParams.id;
    
    $scope.error = '';  
    $scope.bloqueio = {};
    $scope.alunoSelecionado = {};

    $scope.aluno = [];
    $scope.alunos = [];

    $scope.receitaFixa = {};
    $scope.receitasFixas = {};

    $scope.tipoReceita = {};
    $scope.tiposReceitas = [];

    $scope.alunoFinanceiros = [];

    $scope.getAluno = function(){
      $http.get('api/index.php/stringpessoa?string=&todos=0&aluno=1')      
      .success(function(data, status, headers, config) {
        $scope.alunos = data.pessoa;
      })
      .error(function(data, status, headers, config) {}); 
    }

    $scope.getPessoa = function(id){
      $http.get('api/index.php/pessoa/'+id).
      success(function(data, status, headers, config) {
        $scope.aluno = {selected:{"id": data.pessoa[0].id, "nome": data.pessoa[0].nome}};
        $scope.changeAluno($scope.aluno.selected);
      }).
      error(function
        (data, status, headers, config) {
        // log error
      }); 
    }

    $scope.dadosGerais = {};
    $scope.dadosGerais.ativo = 1;
    $scope.dadosGerais.id_faixa = 1;
    $scope.dadosGerais.id_etapa = [];
    $scope.dadosGerais.id_curso = [];

    $scope.etapas = [];
    $scope.cursos = [];

    var id_etapa = '';
    var id_curso = '';
    var id_turma = '';

    $scope.getEtapaCurso = function(){
      
      $http.get('api/index.php/etapacursoturmaaluno/'+$scope.aluno.selected.id)
      .success(function(data, status, headers, config) {
      
        $scope.dadosGerais.id_curso='';
        $scope.dadosGerais.id_etapa='';

        $scope.bolsa.id_curso='';
        $scope.bolsa.id_etapa='';

        $scope.turmas=[];
        $scope.etapas=[];
        $scope.cursos=[];

        if(data.error==0){
          id_etapa = data.retorno[0].id_etapa;
          id_curso = data.retorno[0].id_curso;
          id_turma = data.retorno[0].id_turma;

          $scope.etapas = [{'id':id_etapa,'descricao':data.retorno[0].etapa}];  
          $scope.cursos = [{'id':id_curso,'descricao':data.retorno[0].curso}];  
          $scope.turmas = [{'id':id_turma,'descricao':data.retorno[0].turma}];  

          $scope.dadosGerais.id_etapa = id_etapa;
          $scope.dadosGerais.id_curso = id_curso;
          $scope.dadosGerais.id_turma = id_turma;

          $scope.bolsa.id_etapa = id_etapa;
          $scope.bolsa.id_curso = id_curso;          
        }

      })
      .error(function(data, status, headers, config) {}); 
    }

    $scope.getFaixa = function(){
      $http.get('api/index.php/faixa/').
      success(function(data, status, headers, config) {
        $scope.faixas = data.faixa;
      }).
      error(function
        (data, status, headers, config) {
        // log error
      }); 
    }

    $scope.getTipoCarne = function(){
      $http.get('api/index.php/tipocarne/').
      success(function(data, status, headers, config) {
        $scope.tiposCarnes = data.tipo_carne;
      }).
      error(function
        (data, status, headers, config) {
        // log error
      }); 
    }

    $scope.getResponsavel = function(id){
      $http.get('api/index.php/responsaveisaluno/'+id)
      .success(function(data, status, headers, config) {        
        $scope.responsaveis = $filter('filter')(data.responsaveis, {responsavel_financeiro: 1});        
        $scope.dadosGerais.id_responsavel = $scope.responsaveis[0].id_pessoa;
      })
      .error(function(data, status, headers, config) {}); 
    }
    
    $scope.getAlunoFinanceiro = function(id){
      $http.get('api/index.php/alunofinanceiro/0/'+id)
      .success(function(data, status, headers, config) {
        if(data.error==0){
          $scope.alunoFinanceiros = data.aluno_financeiro;          
        }
      })
      .error(function(data, status, headers, config) {}); 
    }

    $scope.getReceitaFixa = function(id){
      $http.get('api/index.php/alunoreceitafixa/0/'+id)
      .success(function(data, status, headers, config) {
        $scope.receitasFixas = data.aluno_receita_fixa;
      })
      .error(function(data, status, headers, config) {  }); 
    }

    $scope.getTipoReceita = function(){
      $http.get('api/index.php/tiporeceita/').
      success(function(data, status, headers, config) {
        $scope.tiposReceitas = data.tiporeceita;
      }).
      error(function
        (data, status, headers, config) {
        // log error
      }); 
    }
    $scope.getTipoBloqueio = function(){
      $http.get('api/index.php/tipobloqueio/1')
      .success(function(data, status, headers, config) {
        $scope.bloqueios = data.tipoBloqueio;
      })
      .error(function
        (data, status, headers, config) {}); 
    }
    $scope.getTipoBloqueio();


    $scope.getBloqueioAluno = function(idAluno){
      $http.get('api/index.php/bloqueioaluno/'+idAluno)
      .success(function(data, status, headers, config) {
        $scope.bloqueioaluno = data.bloqueioaluno;
      })
      .error(function
        (data, status, headers, config) {}); 
    }    

    
    $scope.cadastrarDadosGerais = function(){ 
      if ($('#cadastroDadosGerais-form').valid()) {

        $scope.bolsa.responsavel = $("#dados_responsavel option:selected").text();
      	$scope.dadosGerais.id_aluno = $scope.alunoSelecionado.id;

        $scope.json = angular.toJson($scope.dadosGerais); 
        $http.post('api/index.php/alunofinanceiro/', $scope.json, {withCredentials: true, headers: {'enctype': 'multipart/form-data' },})
        .success(function(data, status, headers, config) {

            if (data.error == '0'){ 
              
              Mensagem.success(data.mensagem);
              $scope.changeAluno($scope.aluno.selected);

            }else{ Mensagem.error(data.mensagem); }
        })
        .error(function(data, status) { });
      }
    }

    $scope.cadastrarReceitaFixa = function(){
      if ($('#cadastroReceitaFixa-form').valid()) {
        $scope.receitaFixa.id_aluno = $scope.alunoSelecionado.id;

        $scope.receitaFixa.data_final_validade = ['31'].concat($scope.receitaFixa.data_final_validade.split('/')).reverse().join('-');
        $scope.receitaFixa.data_inicio_validade = ['01'].concat($scope.receitaFixa.data_inicio_validade.split('/')).reverse().join('-');

        $scope.json = angular.toJson($scope.receitaFixa); 
        $http.post('api/index.php/alunoreceitafixa/', $scope.json,
                      {withCredentials: true,
                      headers: {'enctype': 'multipart/form-data' },
                      }
        ).success(function(data, status, headers, config) {
            if (data.error == '0'){ 
              
              Mensagem.success(data.mensagem);
              $scope.receitasFixas={};
              $scope.receitaFixa={};
              $scope.tipoReceita.selected=''
              $scope.getReceitaFixa($scope.alunoSelecionado.id);

            }else{ 
              Mensagem.error(data.mensagem);
            }
        }).error(function(data, status) {
        });
      }
    }

    $scope.delDadosGerais = function(indice, item){ 
      $scope.json = angular.toJson(item); 
      $http.post('api/index.php/delalunofinanceiro/', $scope.json,
                    {withCredentials: true,
                    headers: {'enctype': 'multipart/form-data' },
                    }
      ).success(function(data, status, headers, config) {
          if (data.error == '0'){ 
            
            Mensagem.success(data.mensagem);
            $scope.alunoFinanceiros.splice(indice, 1);

          }else{ 
            Mensagem.error(data.mensagem);
          }
      }).error(function(data, status) {
      });
    }

    $scope.delReceitaFixa = function(indice, item){ 
      $scope.json = angular.toJson(item); 
      $http.post('api/index.php/delalunoreceitafixa/', $scope.json,{withCredentials: true,headers: {'enctype': 'multipart/form-data' },})
      .success(function(data, status, headers, config) {
          if (data.error == '0'){ 
            
            Mensagem.success(data.mensagem);

            areceitasFixas = $scope.receitasFixas;
            areceitasFixas.splice(indice, 1);
            $scope.receitasFixas = areceitasFixas;

          }else{ Mensagem.error(data.mensagem); }
      })
      .error(function(data, status) {});
    }

    $scope.editCadastroDadosGerais = function(item) {
      $scope.dadosGerais = item;
      //$scope.etapa = {selected:{"id": $scope.dadosGerais.id_etapa,"descricao": $scope.dadosGerais.etapa}};
      //$scope.curso = {selected:{"id": $scope.dadosGerais.id_curso,"nome": $scope.dadosGerais.curso}};
      //$scope.responsavel = {selected:{"id": $scope.dadosGerais.id_responsavel,"nome": $scope.dadosGerais.responsavel}};
      $scope.dadosGerais.dia_vencimento = parseInt($scope.dadosGerais.dia_vencimento);
    }

    function convertDate(inputFormat) {
      function pad(s) { return (s < 10) ? '0' + s : s; }
      var d = new Date(inputFormat);
      return [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('/');
    }  

    $scope.editCadastroBloqueioAluno = function(item) {
      $scope.bloqueio = item;
    }

    $scope.editCadastroReceitaFixa = function(item) {

      //item.data_inicio_validade += 'T12:00:00';
      //item.data_final_validade += 'T12:00:00';

      $scope.receitaFixa = item;
      $scope.receitaFixa.data_inicio_validade = item.data_inicio_validade_formatada;
      $scope.receitaFixa.data_final_validade  = item.data_final_validade_formatada;

      $scope.tipoReceita = {selected:{"id": item.id_tipo_receita,"descricao": item.tipo_receita}};
    }
    
    $scope.changeAluno = function(item) {
      $scope.alunoSelecionado.id = item.id; 
      $scope.getBloqueioAluno(item.id);
      $scope.novoCadastroDadosGerais();
      $scope.getResponsavel($scope.alunoSelecionado.id);      
      $scope.getAlunoFinanceiro($scope.alunoSelecionado.id);
      $scope.getReceitaFixa($scope.alunoSelecionado.id);
      $scope.getBolsa($scope.alunoSelecionado.id);
      $scope.getEtapaCurso($scope.aluno.selected.id);      
    }

    $scope.changeTipoReceita = function(item) {
      $scope.receitaFixa.id_tipo_receita = item.id; 
      $( "em[for='id_tipo_receita']" ).css("display","none");    
    }

    $scope.novoCadastroDadosGerais = function() {
      $scope.alunoFinanceiros=[];
      $scope.dadosGerais = {};
      $scope.dadosGerais.ativo = 1;
      $scope.dadosGerais.id_faixa = 1;
    }

    $scope.novoCadastroReceitaFixa = function() {
      $scope.receitaFixa = {};
      $scope.tipoReceita.selected = '';
    }

    $scope.getAluno();
    $scope.getFaixa();
    $scope.getTipoCarne();
    $scope.getTipoReceita();                                                                                                                                                                

    /* ======================================== */
    /* =============== ABA BOLSA ============== */
    /* ======================================== */

    $scope.bolsas = [];
    $scope.grupomotivobolsas = [];
    $scope.grupomotivobolsa = [];

    $scope.motivobolsas = [];
    $scope.motivobolsa = [];    

    $scope.itemc = {};
    $scope.padrinhos = [];
    $scope.padrinho = [];    
    $scope.situacoesMatriculas = {};

    $scope.getGrupoMotivoBolsa = function(){
        $http.get('api/index.php/grupomotivobolsa/1/')
        .success(function(data, status, headers, config) {
          $scope.grupomotivobolsas = data.grupo_motivo_bolsa;
        })
        .error(function(data, status, headers, config) {}); 
    }

    $scope.changeGrupoMotivoBolsa = function(itemid){
      $scope.getMotivoBolsa(itemid);
    }

    $scope.getMotivoBolsa = function(idGrupo){
        $http.get('api/index.php/motivobolsa/0/'+idGrupo)
        .success(function(data, status, headers, config) {
          $scope.motivobolsas = data.motivo_bolsa;
          console.log($scope.motivobolsas);
        })
        .error(function(data, status, headers, config) {}); 
    }    

    $scope.getSituacaoMatricula = function(){
        $http.get('api/index.php/situacaomatricula/1/')
        .success(function(data, status, headers, config) {                           
          $scope.situacoesMatriculas = data.situacao_matricula;
        })
        .error(function(data, status, headers, config) {}); 
    }

    $scope.getBolsa = function(idAluno){
        $http.get('api/index.php/bolsa/'+idAluno)
        .success(function(data, status, headers, config) {
          if (data['error'] == '0'){
            $scope.bolsas = data.retorno;
          }else{
            $scope.bolsas = [];
          }
        })
        .error(function(data, status, headers, config) {}); 
    }

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

    $scope.$watch('bloqueio.data_inicio_validade', function(){ 
      $scope.bloqueio.data_inicio_validade1 = $scope.bloqueio.data_inicio_validade;     
      if($scope.bloqueio.data_inicio_validade1 != undefined || $scope.bloqueio.data_inicio_validade != null){
        $( "em[for='blq_data_inicio_validade']" ).css("display","none");
      }
    });

    $scope.$watch('bloqueio.data_final_validade', function(){ 
      $scope.bloqueio.data_final_validade1 = $scope.bloqueio.data_final_validade;     
      if($scope.bloqueio.data_final_validade1 != undefined || $scope.bloqueio.data_final_validade != null){    
        $( "em[for='blq_data_final_validade']" ).css("display","none"); 
      }
    });

    $scope.$watch('receitaFixa.data_inicio_validade', function(){ 
      $scope.receitaFixa.data_inicio_validade1 = $scope.receitaFixa.data_inicio_validade;     
      if($scope.receitaFixa.data_inicio_validade1 != undefined || $scope.receitaFixa.data_inicio_validade != null){
        $( "em[for='rf_data_inicio_validade']" ).css("display","none");
      }
    });

    $scope.$watch('receitaFixa.data_final_validade', function(){ 
      $scope.receitaFixa.data_final_validade1 = $scope.receitaFixa.data_final_validade;     
      if($scope.receitaFixa.data_final_validade1 != undefined || $scope.receitaFixa.data_final_validade != null){    
        $( "em[for='rf_data_final_validade']" ).css("display","none"); 
      }
    });    

    $scope.novoCadastroBolsa = function(){
      $scope.bolsa = {};
      $scope.bolsa.id_etapa = id_etapa;
      $scope.bolsa.id_curso = id_curso;
    }
    $scope.novoCadastroBloqueioAluno = function(){
      $scope.bloqueio = {};
    }
    // ########################################################################################################################### //
    // #################################################### CADASTRAR ############################################################ //
    // ########################################################################################################################### //

    abolsas = [];

    $scope.cadastrarBolsa = function() {  

      if($('#cadastroBolsa-form').valid()) {

        $scope.bolsa.curso = $("#bolsa_curso option:selected").text();

        $scope.bolsa.motivo_bolsa = $("#bolsa_motivo option:selected").text();
        $scope.bolsa.grupo_motivo_bolsa = $("#bolsa_grupo option:selected").text();
        $scope.bolsa.padrinho = $("#bolsa_padrinho option:selected").text();

        $scope.bolsa.id_aluno = $scope.aluno.selected.id;
        $scope.bolsa.ativo = 1;

        //$scope.bolsa.motivo_bolsa = $scope.motivobolsa.selected.descricao;
        //$scope.bolsa.padrinho = $scope.padrinho.selected.nome;

        $scope.bolsa.data_final_validade = ['31'].concat($scope.bolsa.data_final_validade.split('/')).reverse().join('-');
        $scope.bolsa.data_inicio_validade = ['01'].concat($scope.bolsa.data_inicio_validade.split('/')).reverse().join('-');

        $scope.json = angular.toJson($scope.bolsa);

        $http.post('api/index.php/bolsa/', $scope.json, {withCredentials: true, headers: {'enctype': 'multipart/form-data' },})
        .success(function(data, status, headers, config) {

           if (data.error == '0'){
              Mensagem.success(data.mensagem);
              
              abolsas = $scope.bolsas;
              abolsas.push($scope.bolsa);
              $scope.bolsas = abolsas;
              
              $scope.novoCadastroBolsa();

           }else{ Mensagem.error(data.mensagem); }
        })
        .error(function(data, status) {});
      }
    } 
    // ########################################################################################################################### //

    $scope.cadastrarBloqueioAluno = function() {  

      if($('#cadastroBloqueio-form').valid()) {

        $scope.bloqueio.data_inicio = $scope.bloqueio.data_inicio_validade
        $scope.bloqueio.data_fim =  $scope.bloqueio.data_final_validade
        $scope.bloqueio.id_aluno = $scope.aluno.selected.id;

        $scope.json = angular.toJson($scope.bloqueio);

        $http.post('api/index.php/bloqueioaluno/', $scope.json, {withCredentials: true, headers: {'enctype': 'multipart/form-data' },})
        .success(function(data, status, headers, config) {

           if (data.error == '0'){
              Mensagem.success(data.mensagem);
              /*
              $scope.bloqueio.data_inicio_validade_grid = convertDate($('#blq_data_inicio_validade').val());              
              $scope.bloqueio.data_final_validade_grid = convertDate($('#blq_data_final_validade').val());              
              $scope.bloqueio.descricao = $("#bloqueio_tipo option:selected").text();
              abloqueioaluno = $scope.bloqueioaluno;
              abloqueioaluno.push($scope.bloqueio);
              $scope.bloqueioaluno = abloqueioaluno;
              */
              $scope.bloqueio={};
              $scope.getBloqueioAluno($scope.alunoSelecionado.id);

           }else{ Mensagem.error(data.mensagem); }
        })
        .error(function(data, status) {});
      }
    }

    $scope.delBolsa = function(indice, item){ 
      $scope.json = angular.toJson(item); 
      $http.post('api/index.php/delbolsa/', $scope.json,{withCredentials: true,headers: {'enctype': 'multipart/form-data' },})
      .success(function(data, status, headers, config) {
          if(data.error == '0'){ 
            
            Mensagem.success(data.mensagem);

            abolsas = $scope.bolsas;
            abolsas.splice(indice, 1);
            $scope.bolsas = abolsas;

          }else{ Mensagem.error(data.mensagem); }
      })
      .error(function(data, status) {});
    }    

    $scope.delBloqueioAluno = function(indice, item){ 
      $scope.json = angular.toJson(item); 
      $http.post('api/index.php/delbloqueio/', $scope.json,{withCredentials: true,headers: {'enctype': 'multipart/form-data' },})
      .success(function(data, status, headers, config) {
          if(data.error == '0'){ 
            
            Mensagem.success(data.mensagem);

            abloqueioaluno = $scope.bloqueioaluno;
            abloqueioaluno.splice(indice, 1);
            $scope.bloqueioaluno = abloqueioaluno;

          }else{ Mensagem.error(data.mensagem); }
      })
      .error(function(data, status) {});
    }

    $scope.editCadastroBolsa = function(item) {

      $scope.bolsa = item;      
    }

    $scope.novoCadastroBolsa();    
    $scope.getGrupoMotivoBolsa();
    
    if (idAlunoSelecionado != undefined) {
      $timeout(function() {
        $scope.getPessoa(idAlunoSelecionado);
        $scope.getBolsa(idAlunoSelecionado);
      }, 800);
    };
});

//@ sourceURL=controller.formCadastroFinanceiroAluno.js