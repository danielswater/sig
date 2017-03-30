/*
  Módulo: Mesquita
  Descrição: CRUD Evento
  Método: GET
  URL: /agenda/evento
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 15/03/2015
  Autor: Luciano Almeida
  Versão: 1.0
 */
smartSig.registerCtrl('Evento', function($scope, $http, $location, $filter, filterFilter, $compile, uiCalendarConfig, $timeout, Permissao, $routeParams,Mensagem) {
    $scope.permissoes = Permissao.validaPermissao();

    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    $scope.selEvento_arquivos = [];
  	$scope.agenda = {};
  	$scope.eventoata = {};
    $scope.eventoata.ata = {};
  	$scope.eventoagenda = {};
    $scope.eventoFrequencia = {};
  	$scope.agendasSel = [];
    $scope.tipo_informativo = {};

  	var idEvento = $routeParams.id;

    $scope.lista = []; 
    $scope.listas = [];
    $scope.listas.selecionados = [];   
    
    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd/MM/yyyy', 'shortDate'];
    $scope.format = $scope.formats[2];



  	$scope.initEvento = function(){		
  		$scope.agenda.color = 'bg-color-darken';
  		$scope.agenda.icon = 'fa-user';		
  	}


    $scope.getEventoFrequencia = function(){
      $http.get('api/index.php/eventofrequencia/'+idEvento).    
        success(function(data, status, headers, config) {                           
          $scope.eventoFrequencia = data;
        }).
        error(function(data, status, headers, config) {
          //log error
      });
    }
  

    $scope.getTipoEvento = function(){
        $http.get('api/index.php/ctipoevento/').    
          success(function(data, status, headers, config) {                           
            $scope.tipoevento = data.tipoevento;
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    } 	


    $scope.getDepartamento = function(){
      $http.get('api/index.php/departamentoevento/').
      success(function(data, status, headers, config) {
        $scope.departamento = data.departamento;
        console.log('DEPTOS', $scope.departamento);
      }).
      error(function(data, status, headers, config) {
        // log error
      });
    }


  	$scope.eventColor = function(value){    	
    	$scope.agenda.color = value;
    }


    $scope.eventIcon = function(value){    	
    	$scope.agenda.icon = value;
    }
	

  	$scope.addEvento = function(agenda){
  		//$scope.evento.push(agenda);
  		console.log(agenda);
  		console.log($scope.agenda);
  	}

  
    $scope.dateFormatIso = function(dt, hr){
        if(dt == null || dt == ''){
            return '';
        } else {
           var d = dt.split("/");
           var dia = d[0];
           var mes = d[1];
           var ano = d[2];
           var data = new Date(Date.parse(ano+'/'+mes+'/'+dia +' '+hr));
           console.log('dt', ano+'/'+mes+'/'+dia +' '+hr);
           console.log('return', data.toISOString());
           return data.toISOString();
        }
    }


    $scope.getIdEvento = function(){
      $http.get('api/index.php/evento/'+idEvento).    
        success(function(data, status, headers, config) {
          $scope.agenda = data[0];
          console.log('EVENTO;', $scope.agenda);

          if (data[0].evento_lista) {
            $scope.refreshLista(data[0].evento_lista);

            if (data[0].evento_lista.error!=-1) {
              $scope.agenda.listaselecionado = data[0].evento_lista;
            }
          }
        }).
        error(function(data, status, headers, config) {
          // log error
        });
    }


    $scope.getIdAta = function(){
      $http.get('api/index.php/ata/'+idEvento).    
        success(function(data, status, headers, config) {
          console.log("Ricardo",data);
          if (data!="") { 
            $scope.eventoata = data[0];

            $('.summernote').code(data[0].ata);
          }
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    } 


    $scope.modalGerarPdf = function(agenda){
      console.log('evento', agenda); 
      
      var aHTML = $('.summernote').code();
      
      if(aHTML == $scope.eventoata.ata){
        console.log('savar'); 

        $scope.gerarPdf(agenda);
      } else {
        console.log('perguntar'); 

        $.SmartMessageBox({
          title : "Opa!! Não foi possivel gerar o PDF de " + agenda.title,
          content : "Para gerar o PDF é necessário que primeiro salve a Ata!",
          buttons : "[Salvar][Cancelar]",
          placeholder : ""
        }, function(ButtonPress, Value) {
          if (ButtonPress == "Salvar") {
            
            $scope.cadastrarAta(agenda, 1);
            return 0;
          }else{
            return 0;  
          }
        });
      }
    }



    $scope.gerarPdf = function(agenda){
      var link = document.createElement("a");
            
      link.setAttribute("href", 'api/index.php/atapdf/'+agenda.id);
      //link.setAttribute("download", "eventos_ata.pdf");

      link.click();
    }


    $scope.getIdAgendaEvento = function(){
      $http.get('api/index.php/agendaevento/'+idEvento).    
        success(function(data, status, headers, config) { 

          $scope.agendasSel = data; 
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }                
    
    /*$scope.verificaData = function(){

      if($scope.agenda.datadeinicio < $scope.agenda.datadetermino){

        $scope.agenda.datadetermino = '';
      }
    }*/

    /* FRH - Desativar Evento (Ativo=0) */
    $scope.excluirEvento = function($index){
      $scope.agenda.ativo = 0;
      $scope.json = angular.toJson($scope.agenda);
      $http.post('api/index.php/evento/', $scope.json,{withCredentials: true,headers: {'enctype': 'multipart/form-data' },}
      ).success(function(data, status, headers, config) {
        if (data.error == '0') {
          //Mensagem.success(data.mensagem);
          $msg_ee = 'Evento excluído com sucesso!';
          Mensagem.success($msg_ee);
          $location.path('/agenda/cadastroEvento/');
        }
        else {
          Mensagem.error(data.mensagem);
        }
      }).error(function(data, status) {  });
    }

	   $scope.cadastrarEvento = function(agenda) {
        if ($('#cadastroEvento-form').valid()) {       

          $scope.json = angular.toJson($scope.agenda);

          $http.post('api/index.php/evento/', $scope.json, 
                     {withCredentials: true,
                       headers: {'enctype': 'multipart/form-data' },
                       // transformRequest: angular.identity
                     }
          ).success(function(data, status, headers, config) {
             if (data.error == '0') {
                agenda.id = data.id_evento; 
                //$scope.uploadFileEvento();
                Mensagem.success(data.mensagem);  
             } else {
                Mensagem.error(data.mensagem);   
             }
          }).error(function(data, status) { 
            
          });
      }
    } 


  	$scope.cadastrarAta = function(ata, baixarPdf) {      
      var aHTML = $('.summernote').code();

  		$scope.eventoata.ata = aHTML;
  		$scope.eventoata.id_evento = $scope.agenda.id;
      $scope.json = angular.toJson($scope.eventoata);

      $http.post('api/index.php/ata/', $scope.json, 
                 {withCredentials: true,
                   headers: {'enctype': 'multipart/form-data' },
                   // transformRequest: angular.identity
                 }
        ).success(function(data, status, headers, config) {
           if (data.error == '0') {
    	       $scope.eventoata.id = data.id_ata;
             console.log('teste', data);
             
             if(baixarPdf == 1){
              $scope.gerarPdf(ata);
             }

             Mensagem.success(data.mensagem);            
           } else {
              Mensagem.error(data.mensagem);
           }
        }).error(function(data, status) {
          
        });
    }    


  	$scope.cadastrarEventoAgenda = function(eventoagenda) {      
          if ($('#cadastroEventoAgenda-form').valid()) {
            $scope.eventoagenda.id_evento = $scope.agenda.id;
            $scope.eventoagenda.horario = $scope.eventoagenda.horarioinicio + " às " + $scope.eventoagenda.horariofim;
            $scope.json = angular.toJson($scope.eventoagenda);

            $http.post('api/index.php/agendaevento/', $scope.json, 
                                           {withCredentials: true,
                                           headers: {'enctype': 'multipart/form-data' },
                                           }
            ).success(function(data, status, headers, config) {
               if (data.error == '0') {
          				eventoagenda.id = data.id_evento_agenda; 
          				$scope.getIdAgendaEvento();
          				$scope.eventoagenda = {};

                  Mensagem.success(data.mensagem);
               } else {
                  Mensagem.error(data.mensagem);   
               }
            }).error(function(data, status) { 
              
            });
        }
    }


    $scope.excluirAgenda = function(indexEl, item) {
      $scope.json = angular.toJson(item);
            
      $http.post('api/index.php/delAgendaEvento/', $scope.json, 
                                     {withCredentials: true,
                                     headers: {'enctype': 'multipart/form-data' },
                                     }
      ).success(function(data, status, headers, config) {
        $scope.getIdAgendaEvento();
        $scope.eventoagenda = {};
      }).
      error(function(data, status, headers, config) {
        // log error
      });
    }


    $scope.setarListaSelecionado = function(item) {      
      $scope.agenda.listaselecionado = item;
    }         


    $scope.refreshLista = function(objeto) {      
      $scope.listas = [];
      $scope.listas.selecionados = [];
      
      $http.get('api/index.php/stringlista').    
      success(function(data, status, headers, config) {
        if(data[0].error != -1){
          $scope.lista = data;
          angular.forEach(data, function(value, key) {
            angular.forEach(objeto, function(value2, key2) {
              if(value.id == value2.id){
                $scope.listas.selecionados.push(data[key]);
              }
            });
          });
        }
      }).
      error(function(data, status, headers, config) {
        // log error
      });
    }; 


    $scope.cadastrarInscricaoEvento = function(objeto){
      var id = objeto.id;
      $scope.agenda.id_evento = id;
      $scope.json = angular.toJson($scope.agenda);
    
      if(objeto.listaselecionado == undefined){
        objeto.listaselecionado = [];
      }

      if (objeto.listaselecionado.length>1){
        $http.post('api/index.php/inscricaoevento/', $scope.json, 
        {withCredentials: true,
          headers: {'enctype': 'multipart/form-data' },
        }
        ).success(function(data, status, headers, config) {
          if (data.error == '0') {
            Mensagem.success(data.mensagem); 
            $location.path('/agenda/formInscricaoEventos/1/'+id);
          }else{
            Mensagem.error(data.mensagem);   
          }
        }).error(function(data, status) { 
          // log error
        });
      }else{
        $location.path('/agenda/formInscricaoEventos/1/'+id);  
      }
    }


    $scope.cadastrarFrequenciaEvento = function(objeto){
      var id = objeto.id;
      $location.path('/agenda/formAlmoco/1/'+id);
    }             


    $scope.editarAgenda = function(indexEl, item) {
      $scope.eventoagenda.id = item.id;
      $scope.eventoagenda.titulo = item.titulo;
      $scope.eventoagenda.horarioinicio = item.horario.substr(0,5);
      $scope.eventoagenda.horariofim = item.horario.substr(9,5);
    }         


    /*Validar datas*/
    $scope.$watch('agenda.datadeinicio', function(){
      $scope.agenda.datadeinicio1 = $scope.agenda.datadeinicio;
      if($scope.agenda.datadeinicio1 != undefined || $scope.agenda.datadeinicio1 != null){
        $( "em[for='inicio']" ).css("display","none"); 
      }
    });

    $scope.$watch('agenda.datadetermino', function(){
      $scope.agenda.datadetermino1 = $scope.agenda.datadetermino;
      if($scope.agenda.datadetermino1 != undefined || $scope.agenda.datadetermino1 != null){
        $( "em[for='fim']" ).css("display","none"); 
      }
    });


    $scope.getTipoInformativo = function(){
      $http.get('api/index.php/tipoinformativo/').
        success(function(data, status, headers, config) {
          $scope.tipoinformativos = data.tipoinformativo;
        }).
        error(function(data, status, headers, config) {
          // log error
        });
    }

    $scope.modalEventoRecorrente = function(){
      $location.path('/agenda/formEventosRecorrente/1/'+$scope.agenda.id); 
    }

    $scope.modalEventoInformativo = function(){
      $http.get('api/index.php/eventoinformativo/0/' + $scope.agenda.id).
        success(function(data, status, headers, config) {
          $scope.eventoinformativo = {};

          if (data.error == 0) {
            $scope.eventoinformativo.id = data.eventoinformativo[0].id;
            $scope.eventoinformativo.id_evento = $scope.agenda.id;
            $scope.eventoinformativo.id_tipo_informativo = data.eventoinformativo[0].id_tipo_informativo;
            $scope.eventoinformativo.descricao_tipo_informativo = data.eventoinformativo[0].descricao_tipo_informativo;
            $scope.id_tipo_informativo = {selected : {"id":$scope.eventoinformativo.id_tipo_informativo,"descricao":$scope.eventoinformativo.descricao_tipo_informativo}};
            $scope.eventoinformativo.descricao = data.eventoinformativo[0].descricao;
            $scope.eventoinformativo.nome = data.eventoinformativo[0].nome;
            $scope.eventoinformativo.familia = data.eventoinformativo[0].familia;
            $scope.eventoinformativo.local = data.eventoinformativo[0].local;
            $scope.eventoinformativo.texto = data.eventoinformativo[0].texto;
            $('.summernote_eventoinformativo').code(data.eventoinformativo[0].texto);
            $scope.eventoinformativo.tipo_envio = data.eventoinformativo[0].tipo_envio;
          } else {
            $scope.eventoinformativo.tipo_envio = 1;
          }
        }).
        error(function(data, status, headers, config) {
          // log error
        });

      $('#myModalEventoInformativo').modal('show');
    }


    $scope.cadastrarEventoInformativo = function(){
      if ($('#cadastroEventoInformativo-form').valid()) {
        $scope.eventoinformativo.id_evento = $scope.agenda.id;
        $scope.eventoinformativo.texto = $('.summernote_eventoinformativo').code();
        $scope.json = angular.toJson($scope.eventoinformativo);
        $http.post('api/index.php/eventoinformativo/', $scope.json, 
                   {withCredentials: true,
                      headers: {'enctype': 'multipart/form-data' },
                   }
          ).success(function(data, status, headers, config) {
            if (data.error == '0'){
              Mensagem.success(data.mensagem);
              
              $('#myModalEventoInformativo').modal('hide');
              $scope.eventoinformativo = {};
            } else {
              Mensagem.error(data.mensagem);   
            }
        });
      }
    }


    $scope.modalNovoTipoInformativo = function(){
      $('#myModalNovoTipoInformativo').modal('show');
    }


    $scope.cadastrarTipoInformativo = function(){
      if ($('#cadastroTipoInformativo-form').valid()) {
        $scope.tipoinformativo.ativo = 1;
        $scope.json = angular.toJson($scope.tipoinformativo);

        $http.post('api/index.php/tipoinformativo/', $scope.json, 
                   {withCredentials: true,
                     headers: {'enctype': 'multipart/form-data' },
                   }
        ).success(function(data, status, headers, config) {
            if (data.error == '0'){  
                Mensagem.success(data.mensagem);

                $('#myModalNovoTipoInformativo').modal('hide');
                $scope.getTipoInformativo();
                $scope.tipoinformativo = {};
            } else {
              Mensagem.error(data.mensagem);   
            }
        }).error(function(data, status) {
          // log error
        });
      }
    }

    $scope.verificarAcaoTipoInformativo = function(item) {
      if (item.id==-1) {
        $scope.modalNovoTipoInformativo();
        $scope.tipo_informativo.selected = ''
      }
      $scope.eventoinformativo.id_tipo_informativo = item.id;
      $( "em[for='id_tipo_informativo']" ).css("display","none");
    }

    /* ==================================================================================================== */
    /* ============================ROTINAS PARA ARQUIVO (fotos,documentos,etc)============================= */    
    /* ==================================================================================================== */

    $scope.eventoarquivo = {};

    $scope.prepareFileEvento = function(files) {  

      $scope.files = files.files[0];

      var fd = new FormData();
      fd.append("file", $scope.files);      
      $scope.fd = fd;     

      $('#eventoarquivo1').val($scope.files.name);
    }

    $scope.getListaArquivo_IdEvento = function(){
       $http.get('api/index.php/arquivoevento/'+idEvento)
       .success(function(data, status, headers, config) {
  
          if (data.error == '0'){
            $scope.selEvento_arquivos = data.evento_arquivo;
            
            var i=0;
            while (i < $scope.selEvento_arquivos.length) {
              tmp = data.evento_arquivo[i].arquivo;
              $scope.selEvento_arquivos[i].tipo = tmp.substring(tmp.length-3);
              i++;
            }
          }
       }).error(function(data, status, headers, config) { });
    } 
    $scope.getListaArquivo_IdEvento();


    $scope.salvarEventoArquivo = function(){

      if(typeof $scope.eventoarquivo.id != 'undefined'){
        $scope.rep = $filter('filter')($scope.selEvento_arquivos, {'id': $scope.eventoarquivo.id});
      }else{
        $scope.rep = [];      
      }

      if($scope.rep.length == 0){ 
        
        $scope.eventoarquivo.id_evento = idEvento;
        $scope.eventoarquivo.ativo = 1;       

      $http.post('api/index.php/uploadfileevento', $scope.fd, { withCredentials: true, headers: {'Content-Type': undefined }, transformRequest: angular.identity })
      .success(function(data, status, headers, config){
        
        if (data.error == '0'){ 

          tmp=data.caminho.split("/");
          $scope.eventoarquivo.arquivo = tmp[tmp.length-1]; 
          $scope.eventoarquivo.tipo = $scope.eventoarquivo.arquivo.split(".")[1];

          $scope.json = angular.toJson($scope.eventoarquivo);

          $http.post('api/index.php/arquivoevento/', $scope.json,{withCredentials: true, headers: {'enctype': 'multipart/form-data' },})   
          .success(function(data, status, headers, config) {
            if (data.error == '0'){                 
              $scope.selEvento_arquivos.push($scope.eventoarquivo);
              Mensagem.success(data.mensagem);
              $scope.eventoarquivo ={};
              $('#eventoarquivo1').val("");
            }
            else{ Mensagem.error("ERR01"+data.mensagem); }

          }).error(function(data, status, headers, config) { });        
        }
        else{ Mensagem.error("ERR02:"+data.mensagem); }
      })
      .error(function(data, status){ });

      }else{ Mensagem.error('ERR03: Arquivo já cadastrado!'); }
    }

    $scope.excluirEventoArquivo = function(indexEl, item) {

      $scope.tmp = {};
      $scope.tmp.id = item.id;
      $scope.tmp.id_evento = item.id_evento;
      $scope.tmp.descricao = item.descricao;
      $scope.tmp.arquivo = item.arquivo;
      $scope.tmp.ativo = 0;

      $scope.json = angular.toJson($scope.tmp);
      $http.post('api/index.php/arquivoevento/', $scope.json, {withCredentials: true, headers: {'enctype': 'multipart/form-data' },})

      .success(function(data, status, headers, config){
        $scope.selEvento_arquivos.splice(indexEl, 1);
        Mensagem.success('Arquivo excluído com sucesso!');

      }).error(function(data, status, headers, config) { });
    }

    $scope.downloadArquivo = function($index, itemEvtArq){
      
      var a = document.createElement("a");
      //a.href = "/sig/PHP/trunk/sig/img/evento/";
      a.href = "/sig/img/evento/";
      a.download = itemEvtArq.arquivo;
      document.body.appendChild(a);
      a.click();
    }

    $scope.fotomodal="";

    $scope.showFoto = function($index, itemEvtArq){
      //$scope.fotomodal = "/sig/PHP/trunk/sig/img/evento/" + itemEvtArq.arquivo;
      $scope.fotomodal = "/sig/img/evento/" + itemEvtArq.arquivo;
      $('#myModalFoto').modal('show');
    }

    $scope.hideFoto = function(){
      $scope.fotomodal = "";
      $('#myModalFoto').modal('hide');
    }

    /*-------------------------------------------------------------------------------------------*/
    /*-------------------------------------------------------------------------------------------*/

    $scope.getTipoEvento();
    $scope.getDepartamento();
    $scope.getTipoInformativo();
              
    if (idEvento != undefined){
      $timeout(function() {
        $scope.getIdEvento(idEvento);
        $scope.getEventoFrequencia();
      }, 800);  
      $timeout(function() {
        $scope.getIdAta(idEvento);
      }, 800);
      $timeout(function() {
        $scope.getIdAgendaEvento(idEvento);
      }, 800);                   
    };

});

//@ sourceURL=controller.Evento.js