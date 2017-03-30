smartSig.registerCtrl('formAlmoco', function($scope, ngTableParams, $http, $location, $filter, $q, filterFilter, Mensagem, $timeout, Permissao, $routeParams) {

  /*$scope.permissoes = Permissao.validaPermissao();

  $scope.permissoes.then(function (data) {
    $scope.permissoes = data;
  }, function (status) {
    console.log('status',status);
  });*/

$scope.evento = {};
  var idEvento = $routeParams.id;

  $scope.caixa = {};
  $scope.caixa.valor = 0;
  $scope.caixa.quantidade = 0;
  $scope.caixa.id_evento = 0;

  $scope.associado = {};
  $scope.donatario = {};

  $scope.associados = [];
  $scope.donatarios = [];
  $scope.acerto_associado = [];

  $scope.anonimos = [];

  $scope.acerto = {};

  $scope.pessoas_associados = {};
  $scope.pessoas_donatarios = {};
  
  $scope.verificarQuantidade = function(){
    var quant = $scope.associados.length + $scope.anonimos.length;
    
    angular.forEach($scope.donatarios, function(value, key) {
      if(value.id_pessoa_pagante != null){
        quant++;
      }
    });

    $scope.caixa.quantidade = quant;
    console.log('verificarQuantidade', quant);
    console.log('verificarQuantidade valor', $scope.caixa.valor);
  }

  $scope.cadastrarAcertoDonatario = function(){
    $scope.acertoDoantario = {};
    
    var donatario_nao_pago = $filter("filter")($scope.donatarios, {'situacao_pagamento': null});
    
    console.log('cadastrarAcertoDonatario', $scope.donatarios);

    if(donatario_nao_pago.length >= $scope.acerto.quantidade){
      for(i=0; i < $scope.acerto.quantidade; i++) {
        $scope.acertoDoantario[i] = donatario_nao_pago[i];
        $scope.acertoDoantario[i].id_pessoa_pagante = $scope.acerto.id_pessoa_pagante;
        $scope.acertoDoantario[i].pagante = $scope.acerto.nome;
        $scope.acertoDoantario[i].quantidade = $scope.acerto.quantidade;

        console.log('acertoDoantario', $scope.acertoDoantario);
      }
    }else{
      Mensagem.error("Valor da quantidade maior que o numero de donatários a pagar!"); 
      return;
    }

    console.log('cadastrarAcertoDonatario', $scope.acertoDoantario);

    $scope.json = angular.toJson($scope.acertoDoantario);
    $http.post('api/index.php/eventofrequenciaacertodonatario/', $scope.json, 
                                   {withCredentials: true,
                                   headers: {'enctype': 'multipart/form-data' },
                                   // transformRequest: angular.identity
                                   }
    ).success(function(data, status, headers, config) {
      if(data.error == '0'){

        //$scope.donatarios.splice(0, $scope.acerto.quantidade);
        marcar = [];
        angular.forEach($scope.donatarios, function(value, key) {
          marcar = $filter("filter")(data.evento_frequencia, {'id': value.id});
          if(marcar.length > 0){
            $scope.donatarios[key].situacao_pagamento = 'pago';
            $scope.cadastrarCaixa();
          }
        });

        $scope.acerto = {};
        $scope.acertoDoantario = {};
        $scope.acerto_associado.selected = '';

        Mensagem.success(data.mensagem); 

      }else{
        Mensagem.error(data.mensagem);   
      }
    }).error(function(data, status) { 
      
    }); 
  }

  $scope.cadastrarEventoFrequenciaAnonimo = function(){
    var item = {};
    item.id = '';
    item.nome = '';
    $scope.cadastrarEventoFrequencia(item, null);
  }

  $scope.cadastrarEventoFrequencia = function(item, elemento) {
    if(item.donatario != null){
      var valida_associados = $filter("filter")($scope.associados, {'id_pessoa': item.id});
      var valida_donatarios = $filter("filter")($scope.donatarios, {'id_pessoa': item.id});
      console.log('valida_associados', valida_associados.length);
      console.log('valida_donatarios', valida_donatarios.length);
      if(valida_associados.length > 0){
        Mensagem.error("Associado não pode ser incluido pois já esta na lista!"); 
        return;
      }
      if(valida_donatarios.length > 0){
        Mensagem.error("Donatário não pode ser incluido pois já esta na lista!"); 
        return;
      }
    }
    
    $scope.eventoFrequencia = {};
    $scope.eventoFrequencia.id = item.id;
    $scope.eventoFrequencia.nome = item.nome;
    $scope.eventoFrequencia.id_evento = idEvento;
    $scope.eventoFrequencia.donatario = elemento;
    $scope.eventoFrequencia.isento = null;
    $scope.eventoFrequencia.situacao_pagamento = null;
    
    $scope.json = angular.toJson($scope.eventoFrequencia);
    $http.post('api/index.php/eventofrequencia/', $scope.json, 
                                   {withCredentials: true,
                                   headers: {'enctype': 'multipart/form-data' },
                                   // transformRequest: angular.identity
                                   }
    ).success(function(data, status, headers, config) {
      if(data.error == '0'){
        $scope.eventoFrequencia.id = data.id;
        $scope.eventoFrequencia.id_pessoa = item.id;

        if(parseFloat(elemento) == 0) {
          $scope.associados.push($scope.eventoFrequencia);
          $scope.associado.selected = ''; 
          $scope.cadastrarCaixa();
        }else if(parseFloat(elemento) == 1) {
          $scope.donatarios.push($scope.eventoFrequencia);
          $scope.donatario.selected = ''; 
        }else if($scope.eventoFrequencia.id_pessoa == '') {
          $scope.anonimos.push($scope.eventoFrequencia);
          $scope.cadastrarCaixa();
        }



        $scope.eventoFrequencia = {};

        //Mensagem.success(data.mensagem); 

      }else{
        Mensagem.error(data.mensagem);   
      }
    }).error(function(data, status) { 
      
    });   
  }

  $scope.cadastrarCaixa = function() {
    $scope.caixa.id_evento = idEvento;
    $scope.caixa.descricao = "Almoço: " + $scope.evento.title;
    $scope.caixa.id_pessoa = null;
    $scope.caixa.valor = $scope.caixa.valor + parseFloat($scope.evento.valor.replace(",","."));
    $scope.caixa.data_vencimento = $scope.evento.start;


    $scope.json = angular.toJson($scope.caixa);
    $http.post('api/index.php/caixa/', $scope.json, 
                                   {withCredentials: true,
                                   headers: {'enctype': 'multipart/form-data' },
                                   // transformRequest: angular.identity
                                   }
    ).success(function(data, status, headers, config) {
      if(data.error == '0'){
        
        $scope.caixa.id = data.id;

      }else{
        Mensagem.error(data.mensagem);   
      }
    }).error(function(data, status) { 
      
    });   
  }

  $scope.getPessoa = function(){
    $http.get('api/index.php/carregapessoa/14').    
    success(function(data, status, headers, config) {                           

      $scope.pessoas_associados = $filter("filter")(data.pessoa, {'donatario': 0});
      $scope.pessoas_donatarios = $filter("filter")(data.pessoa, {'donatario': 1});
      
      if(idEvento != undefined){
        $scope.getEvento(idEvento);
        $scope.getCaixaEvento(idEvento);
        $scope.getEventoFrequencia(idEvento);
        $scope.verificarQuantidade();
      }
    }).
    error(function(data, status, headers, config) {
        //log error
      });
  }

  $scope.getEvento = function(id){
    $http.get('api/index.php/evento/' + id).    
    success(function(data, status, headers, config) {                           
      $scope.evento = data[0];
      $scope.evento.valor_calculo = $scope.evento.valor.replace(",",".");
    }).
    error(function(data, status, headers, config) {
        // log error
      }); 
  }

  $scope.getCaixaEvento = function(id){
    $http.get('api/index.php/caixaevento/' + id).    
    success(function(data, status, headers, config) {                           
      if(data[0] != undefined){
        $scope.caixa = data[0];
      }
      console.log('getCaixaEvento || caixa', $scope.caixa);
    }).
    error(function(data, status, headers, config) {
      // log error
    }); 
  }

  $scope.getEventoFrequencia = function(id){
    $http.get('api/index.php/eventofrequencia/'+id).    
    success(function(data, status, headers, config) {                           
      $scope.associados = $filter("filter")(data, {'donatario': 0});
      $scope.donatarios = $filter("filter")(data, {'donatario': 1});      
      $scope.anonimos = $filter("filter")(data, {'donatario': null});
    }).
    error(function(data, status, headers, config) {
      //log error
    });
  }

  $scope.delEventoFrequenciaAnonimo = function(){
    console.log('DELETE ANONIMO', $scope.anonimos);
    var pessoa = {};
    pessoa.id = $scope.anonimos[0].id;
    pessoa.id_pessoa = $scope.anonimos[0].id_pessoa;
    pessoa.donatario = $scope.anonimos[0].donatario;
    pessoa.id_pessoa_pagante = $scope.anonimos[0].id_pessoa_pagante;
    $scope.delEventoFrequencia(0, pessoa, false);
  }

  $scope.delEventoFrequencia = function(indiceEl, pessoa, flag){
      console.log('DELETE FREQUENCIA', pessoa);

      verificar_pagante = $filter("filter")($scope.donatarios, {'id_pessoa_pagante': pessoa.id_pessoa});
      console.log('PAGANTES', verificar_pagante.length);

      if(verificar_pagante.length > 0 && flag==true){
        Mensagem.error("Associado não pode ser excluido! Pois existe donatário que está sendo financiando.");
        return;
      }

      $scope.json = angular.toJson(pessoa);
      $http.post('api/index.php/deleventofrequencia/', $scope.json, 
                                     {withCredentials: true,
                                     headers: {'enctype': 'multipart/form-data' },
                                     // transformRequest: angular.identity
                                     }
      ).success(function(data, status, headers, config) {
         if(data.error == '0'){ 
            console.log('pessoa', pessoa);
            if(parseFloat(pessoa.donatario) == 0) {
              $scope.associados.splice(indiceEl, 1);
              $scope.delCaixaEventoFrequencia();
            }else if(parseFloat(pessoa.donatario) == 1) {
              $scope.donatarios.splice(indiceEl, 1);
              if(pessoa.id_pessoa_pagante != null){
                console.log('situacao', pessoa.situacao_pagamento);
                console.log('pessoa', (pessoa.situacao_pagamento == "Pago"));
                $scope.delCaixaEventoFrequencia();
              }
            }else if(pessoa.donatario == null) {
              $scope.anonimos.splice(indiceEl, 1);
              $scope.delCaixaEventoFrequencia();
            }

           // Mensagem.success(data.mensagem);  
         }else{
            Mensagem.error(data.mensagem);   
         }
      }).error(function(data, status) { 
        
      });
  }


  $scope.delCaixaEventoFrequencia = function(){
      $scope.caixa.valor = parseFloat($scope.caixa.valor) - parseFloat($scope.evento.valor.replace(",","."));
      
      console.log('delCaixaEventoFrequencia', $scope.caixa);

      $scope.json = angular.toJson($scope.caixa);
      $http.post('api/index.php/delcaixaeventofrequencia/', $scope.json, 
                                     {withCredentials: true,
                                     headers: {'enctype': 'multipart/form-data' },
                                     // transformRequest: angular.identity
                                     }
      ).success(function(data, status, headers, config) {
         if(data.error == '0'){ 
            if(data.id == null){
              $scope.caixa = {};
              $scope.caixa.valor = 0;
              $scope.caixa.quantidade = 0;
            }
         }else{
            Mensagem.error(data.mensagem);   
         }
      }).error(function(data, status) { 
        
      });
  }

  $scope.verificarAcaoAcertoAssociado = function(item) {
    $scope.acerto.id_pessoa_pagante = item.id_pessoa;
    $scope.acerto.nome = item.nome;
    $( "em[for='id_pessoa_pagante']" ).css("display","none");    
    console.log('verificarAcaoAcertoAssociado', item);
  }
  
  $scope.$watch('caixa.valor', function(){  
    $scope.verificarQuantidade();
  });

  $scope.getPessoa();

});