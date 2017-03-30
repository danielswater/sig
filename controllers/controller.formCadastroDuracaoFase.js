
/*
  Módulo: Escola
  Descrição: CRUD Cadastro Duração de Fase
  Método: GET
  URL: /escolaforms/formCadastroDuracaoFase
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 29/05/2015
  Autor: Fábio Roberto Haydn
  Versão: 1.0
*/

smartSig.registerCtrl("formCadastroDuracaoFase", function($scope, $http, $routeParams, Mensagem, $timeout, Permissao){
    

    $scope.permissoes = Permissao.validaPermissao();

    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    $scope.duracaofase       = {};
    $scope.duracaofase.ativo = 1; 
    $scope.itemEtapa         = {};

    $scope.etapas   = [];
    $scope.cursos   = [];

    var idDuracaoFase = $routeParams.id;

    /* ----------------------------------------------------------------------------------*/
    $scope.getEtapa = function(){
      $http.get('api/index.php/etapa/1')
      .success(function(data, status, headers, config){ $scope.etapas = data.etapa; 
        console.log('Etapa', $scope.etapas);
      })
      .error(function(data, status, headers, config){  });
    }
    $scope.getEtapa();
    /* ----------------------------------------------------------------------------------*/  
    $scope.getCurso = function(){
      $http.get('api/index.php/curso/1')
      .success(function(data, status, headers, config){ $scope.cursos = data.curso; })
      .error(function(data, status, headers, config){  });
    }
    $scope.getCurso();
    /* ----------------------------------------------------------------------------------*/

    $scope.cadastrarDuracaoFase = function(objeto) {
      if ($('#cadastroDuracaoFase-form').valid()) {
      
        $scope.json = angular.toJson($scope.duracaofase);                            
        $http.post('api/index.php/duracaofase/', $scope.json,{withCredentials: true,headers: {'enctype': 'multipart/form-data' },})
                   
        .success(function(data, status, headers, config) {
           if (data.error == '0'){              

              Mensagem.success(data.mensagem);
              $scope.duracaofase.id = data.id;
           }
           else { Mensagem.error(data.mensagem); }
        })
        .error(function(data, status) { });
      }
    }

    $scope.novoCadastro = function(){
      $scope.duracaofase = {};
      $scope.duracaofase.ativo = 1;
      
      $scope.itemEtapa   = {};
    }

    $scope.getIdDuracaoFase = function(idDuracaoFase){
      $http.get('api/index.php/duracaofase/'+idDuracaoFase)
        .success(function(data, status, headers, config) {

          $scope.duracaofase = data.duracao_fase[0];
          
          $scope.itemEtapa = {selected : {"id":$scope.duracaofase.id_etapa,"descricao":$scope.duracaofase.descEtapa}};
        })
        .error(function(data, status, headers, config) { });
    }

    /*Validar datas*/
    $scope.$watch('duracaofase.data_inicial', function(){
      $scope.duracaofase.data_inicial1 = $scope.duracaofase.data_inicial;
      if($scope.duracaofase.data_inicial1 != undefined || $scope.duracaofase.data_inicial1 != null){
        $( "em[for='data_inicial']" ).css("display","none"); 
      }
    });
    $scope.$watch('duracaofase.data_final', function(){
      $scope.duracaofase.data_final1 = $scope.duracaofase.data_final;
      if($scope.duracaofase.data_final1 != undefined || $scope.duracaofase.data_final1 != null){
        $( "em[for='data_final']" ).css("display","none"); 
      }
    });


    if (idDuracaoFase != undefined) {
      $timeout(function(){ 

        $scope.getIdDuracaoFase(idDuracaoFase);
        $scope.getEtapa_ID(id_etapa);


      }, 800);
    };

    /* ----------------------------------------------------------------------------------*/

    /* --------------- */
    /* -----Modal----- */
    /* --------------- */
    
    $scope.getEtapa_ID = function(id){
      $http.get('api/index.php/etapa/'+id)
      .success(function(data, status, headers, config){ $scope.etapas = data.etapa; })
      .error(function(data, status, headers, config){  });
    } 

    $scope.getCiclo = function(){
      $http.get('api/index.php/ciclo/1').
        success(function(data, status, headers, config) {
          $scope.ciclos = data.retorno;
        }).
        error(function(data, status, headers, config) { });
    }

    $scope.getSituacaoEtapa = function(){
      $http.get('api/index.php/etapasituacao/').
        success(function(data, status, headers, config) {
          $scope.situacaoEtapas = data.situacao_etapa;          
        }).
        error(function(data, status, headers, config) { });
    }

    $scope.changeEtapa = function(item) {
      if (item.id==-1) {
        $scope.modalNovaEtapa();   
        $scope.itemEtapa.selected = '';    
        $scope.getSituacaoEtapa(); 
        $scope.getCiclo();
      }
      $scope.duracaofase.id_etapa = item.id;
      $( "em[for='id_etapa']" ).css("display","none");    
    }
    $scope.modalNovaEtapa = function(size){
      $('#myModalEtapa').modal('show');
    }

    $scope.mod_etapa       = {};
    $scope.mod_etapa.ativo = 1;
    $scope.ciclos          = {};
    $scope.situacaoEtapas  = {};

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

    /*Validar datas MODAL*/
    $scope.$watch('mod_etapa.data_inicio', function()
    { 
      $scope.mod_etapa.data_inicio1 = $scope.mod_etapa.data_inicio;
      if($scope.mod_etapa.data_inicio1 != undefined || $scope.mod_etapa.data_inicio1 != null)
      {        
        $( "em[for='data_inicio1']" ).css("display","none");
      }
    });

    $scope.$watch('mod_etapa.data_fim', function()
    {
      $scope.mod_etapa.data_fim1 = $scope.mod_etapa.data_fim;
      if($scope.mod_etapa.data_fim1 != undefined || $scope.mod_etapa.data_fim1 != null)
      {
        $( "em[for='data_fim1']" ).css("display","none");
      }
    });

    $scope.novoCadastroModEtapa = function()
    {
      $scope.etapa = {};
      $scope.etapa.ativo = 1;
    }
    /* --------------------------------------------------------------------------------------------------------------------------- */

    /* --------------- */
    /* -----Misc.----- */
    /* --------------- */
    
    $scope.$watch('duracaofase.data_inicial1', function()
    { 
      $scope.duracaofase.data_inicial1 = $scope.duracaofase.data_inicial;
      if($scope.duracaofase.data_inicial1 != undefined || $scope.duracaofase.data_inicial1 != null)
      {        
        $( "em[for='data_inicial1']" ).css("display","none");
      }
    });

    $scope.$watch('duracaofase.data_final', function()
    {
      $scope.duracaofase.data_final1 = $scope.duracaofase.data_final;
      if($scope.duracaofase.data_final1 != undefined || $scope.duracaofase.data_final1 != null)
      {
        $( "em[for='data_final1']" ).css("display","none");
      }
    });

    $scope.open = function($event,opened) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope[opened] = true;
    };

    $scope.disabled = function(date, mode) {
      return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
    };

    $scope.toggleMin = function() {
      $scope.minDate = $scope.minDate ? null : new Date();
    };

    $scope.toggleMin();

    $scope.dateOptions = {
      formatYear: 'yy',
      startingDay: 1,
      language: 'pt-BR',
    };

    $scope.initDate = new Date();
    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd','yyyy/MM', 'dd/MM/yyyy', 'shortDate'];
    $scope.format = $scope.formats[2];

    $scope.open = function($event,opened) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope[opened] = true;
    };

    $scope.disabled = function(date, mode) {
      return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
    };

    $scope.toggleMin = function() {
      $scope.minDate = $scope.minDate ? null : new Date();
    };

    $scope.toggleMin();

    $scope.open = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.opened = true;
    };

    $scope.dateOptions = {
      formatYear: 'yy',
      startingDay: 1,
      language: 'pt-BR',
    };

    $scope.initDate = new Date();
    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd','yyyy/MM', 'dd/MM/yyyy', 'shortDate'];
    $scope.format = $scope.formats[2];
    /* --------------------------------------------------------------------------------------------------------------------------- */

});

//@ sourceURL=controller.formCadastroDuracaoFase.js