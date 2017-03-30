
  smartSig.registerCtrl("consultaRelatorioEvento", function($scope, $http, $routeParams, Mensagem, $timeout, Permissao){

    $scope.select_tipoevento = [];
    $scope.select_evento     = [];

    $scope.regst = {};
    $scope.regan = {};
    $scope.retorno_sintetico = [];
    $scope.retorno_analitico = [];

    $scope.relatorioevento = {};
    $scope.relatorioevento.tipo = 0;
    str_GET = '';

    $scope.getDataIso = function(tipo){ 

      dt = new Date();
      mes = ('0'+(dt.getMonth()+1)).slice(-2);
      ano = dt.getYear();
      ano += (ano<1000) ? 1900 : 0;      
      
      switch(tipo){
        case 0:
                // Dia Atual
                dia = ('0'+(new Date(ano, mes, dt.getDate()).getDate())).slice(-2);
        break;
        case 1:
                // Primeiro dia do mês
                dia = '01';
        break;
        case 2:
                // Último dia do mês
                dia = ('0'+(new Date(ano, mes, 0).getDate())).slice(-2);
        break;
      }
      dt_iso = ano+'-'+mes+'-'+dia+'T12:00:00';
      return dt_iso;
    }    

    $scope.relatorioevento.data_inicial = $scope.getDataIso(1);
    $scope.relatorioevento.data_final   = $scope.getDataIso(0);

    $scope.getTipoEvento = function(){    
      $http.get('api/index.php/carregartipoevento')
      .success(function(data, status, headers, config){
        if (data.error == 0) {
          $scope.select_tipoevento = data.tipo_evento;        
          $scope.select_tipoevento.push({'id':'0','descricao':'Todos','ativo':'1'});
          $scope.itemte = {selected : {'id':'0', 'descricao':'Todos','ativo':'1'}};
        };
      })
      .error(function(data, status, headers, config) {});
    }
  
    $scope.getEvento = function(){
      $http.get('api/index.php/carregarevento')
      .success(function(data, status, headers, config){
        if (data.error == 0) {
          $scope.select_evento = data.evento;
          $scope.select_evento.push({'id': "0", 'description': "Todos", 'ativo': '1'});
          $scope.itemne = {selected : {'id':'0', 'description':'Todos'}};
        };
      })
      .error(function(data, status, headers, config) {});
    }



    $scope.getRelatorioEvento = function(parm_tipo_relatorio, parm_tipo_evento, parm_nome_evento, parm_data_ini, parm_data_fim){

      $http.get('api/index.php/relatorioevento/'+parm_tipo_relatorio+'/'+parm_tipo_evento+'/'+parm_nome_evento+'/'+parm_data_ini+'/'+parm_data_fim)
      .success(function(data, status, headers, config){

        if (data.error == 0) {
          
          //Formatar como 01/01/2015 a data que vem do SELECT como 01/01/2015-12:00
          i=0;
          mt = data.retorno_relatorio;
          while (i < mt.length) {
              mt[i].data = mt[i].data.substring(0,10);
              i++;
          }
          
          switch(parseInt(parm_tipo_relatorio)){
            case 0: 
                    $scope.retorno_sintetico = data.retorno_relatorio; 
            break;
            case 1: 
                    $scope.retorno_analitico = data.retorno_relatorio; 
            break;
          }
        }
      })
      .error(function(data, status, headers, config) {});
    }

    $scope.getTipoEvento();
    $scope.getEvento();    

    $scope.verificarAcao = function(tipo,item){

      switch(tipo) {

          case 0: $scope.insel_tipoevento.itemte = item.id;
                  $("em[for='itemte']").css("display","none");
                  break;

          case 1: $scope.insel_evento.itemne = item.id;
                  $("em[for='itemne']").css("display","none");
                  break;
      }
    } 

    $scope.getDataBusca = function(data_iso){

      // data_iso (STRING) em formato: "2015-01-01T12:00:00"
      dt = new Date(data_iso);
      ano = dt.getFullYear().toString();
      mes = ('0'+(dt.getMonth()+1).toString()).slice(-2);
      dia = ('0'+dt.getDate().toString()).slice(-2);

      return ano+mes+dia;
    }

    $scope.gerarRelatorio = function(){

      relTipo = $scope.relatorioevento.tipo;

      switch(parseInt(relTipo)){
        case 0: 
                $scope.showRelatorio = 0; 
                
                $scope.currentPage = 1;
                $scope.pageSize = 10;
                $scope.sort = { active: 'evento', descending: undefined }
                break;
        case 1: 
                $scope.showRelatorio = 1; 

                $scope.currentPage = 1;
                $scope.pageSize = 10;
                $scope.sort = { active: 'evento', descending: undefined }
                break;
        }     

      parm_data_ini = $scope.getDataBusca($scope.relatorioevento.data_inicial1);
      parm_data_fim = $scope.getDataBusca($scope.relatorioevento.data_final1);
      
      str_GET = relTipo+'/'+$scope.itemte.selected.descricao+'/'+$scope.itemne.selected.description+'/'+parm_data_ini+'/'+parm_data_fim;

      $scope.getRelatorioEvento(relTipo, $scope.itemte.selected.descricao, $scope.itemne.selected.description, parm_data_ini, parm_data_fim);
    }

    $scope.gerarRelatorioPDF = function(){
      var link = document.createElement("a");
      link.setAttribute("href", 'api/index.php/gerarrelatoriopdf/'+str_GET);
      link.click();
    }

    $scope.sort = {};

    $scope.changeSorting = function(column) {
        var sort = $scope.sort;
        if (sort.active == column) {
            sort.descending = !sort.descending;    
        } else {
            sort.active = column;
            sort.descending = false;
        }
    }

    $scope.getIcon = function(column) {        
        var sort = $scope.sort;        
        if (sort.active == column) {
          return sort.descending
            ? 'glyphicon-chevron-up'
            : 'glyphicon-chevron-down';
        }        
        return 'glyphicon-star';
    }    

    /*Validar datas*/
    $scope.$watch('relatorioevento.data_inicial', function(){       
      
      $scope.relatorioevento.data_inicial1 = $scope.relatorioevento.data_inicial;
      if($scope.relatorioevento.data_inicial1 != undefined || $scope.relatorioevento.data_inicial1 != null){
        $( "em[for='data_inicial1']" ).css("display","none"); 
      }
      
    });
    $scope.$watch('relatorioevento.data_final1', function(){    
      
      $scope.relatorioevento.data_final1 = $scope.relatorioevento.data_final;
      if($scope.relatorioevento.data_final1 != undefined || $scope.relatorioevento.data_final1 != null){
        $( "em[for='data_final1']" ).css("display","none"); 
      }
      
    });

    /* --------------------------------------------------------------------------------------------------------------------------- */
    /* ------------------------------------------------- MISC -------------------------------------------------------------------- */
    /* --------------------------------------------------------------------------------------------------------------------------- */
    
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

//@ sourceURL=controller.consultaRelatorioEvento.js