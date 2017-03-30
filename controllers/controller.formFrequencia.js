smartSig.registerCtrl('formFrequencia', function($scope, ngTableParams, $http, $location, $filter, $q, filterFilter, Mensagem, $timeout, Permissao, $routeParams) {
    
    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

  $scope.evento = {};
  $scope.evento.id = $routeParams.id;

  $scope.pago = [];
  $scope.forma = [];

  $scope.associado = {};
  $scope.donatario = {};
  $scope.tabela_pessoa = [];
  $scope.tabela_donatario = [];
  $scope.forma_pagamento = {};
  $scope.situacao = {};
  $scope.donatario_check = {};
  $scope.pagante = {};

  $scope.strInArray = function(arr, atr, str) {
    for(i=0; i < arr.length; i++) {
      if(arr[i][atr] == str) {

        return i; 
      }
    }
    return -1;
  }

  $scope.mensagemSuccess = function(contentMensagem){
      Mensagem.success(contentMensagem);
  }

  $scope.mensagemError = function(contentMensagem){
      Mensagem.error(contentMensagem);
  }
  
  $scope.consoleLog = function (obj) {
  	console.log(obj);
  }

  $scope.postEventoFrequenciaUpPagante = function(liberado){
      if ($('#cadastroFormaPagamento-form').valid() || liberado == 1) {
        
        angular.forEach($scope.aPagante, function(value, key) {
          $scope.aPagante[key].data_lancamento = $scope.evento.data_cadastro;
          $scope.aPagante[key].data_vencimento = $scope.evento.data_evento;
          $scope.aPagante[key].title = $scope.evento.title;
          $scope.aPagante[key].valor = $scope.evento.valor;
          $scope.aPagante[key].id_forma_pagamento = $scope.addForma.id_forma_pagamento;
        });
        
        console.log('postEventoFrequenciaUpPagante', $scope.evento);

        $scope.json = angular.toJson($scope.aPagante);
        $http.post('api/index.php/eventofrequenciauppagante/', $scope.json, 
                                       {withCredentials: true,
                                       headers: {'enctype': 'multipart/form-data' },
                                       // transformRequest: angular.identity
                                       }
        ).success(function(data, status, headers, config) {
           if(data.error == '0'){ 
              
              var indice;
              angular.forEach($scope.aPagante, function(value, key) {
                indice = $scope.strInArray($scope.tabela_pessoa, 'id', value.id);

                console.log('postEventoFrequenciaUpPagante', $scope.aPagante);

                $scope.tabela_pessoa[indice].pagante = $scope.aPagante[key].nome_pagante;
                $scope.tabela_pessoa[indice].id_pessoa_pagante = $scope.aPagante[key].id;
                $scope.tabela_pessoa[indice].id_caixa = data.id_caixa;
              });

              angular.forEach($scope.donatario_check, function(value, key) {
                angular.forEach($scope.donatario_check[key], function(value2, key2) {
                  $scope.donatario_check[key][key2] = false;
                });
              });

              $scope.pagante.selected = '';

              $('#myModalFormaPagamento').modal('hide');
              $scope.addForma.id_forma_pagamento = '';

              Mensagem.success(data.mensagem);  
           }else{
              Mensagem.error(data.mensagem);                
           }
        }).error(function(data, status) { 
          
        });
      }
  }
  
  $scope.modalFormaPagamento = function(obj){
    $scope.aPagante = [];

    angular.forEach($scope.donatario_check, function(value, key) {
      angular.forEach($scope.donatario_check[key], function(value2, key2) {
        if($scope.donatario_check[key][key2] != false){
          var newitem = [];
          newitem['id'] = $scope.donatario_check[key][key2];
          newitem['id_pessoa_pagante'] = obj.id;
          newitem['nome_pagante'] = obj.nome;
          
          $scope.aPagante.push($.extend({}, newitem));
        }
      });
    });

    if($scope.aPagante.length > 0){
      $('#myModalFormaPagamento').modal('show');
    }else{
      $scope.pagante.selected = {};

      Mensagem.error("Selecione um donatário.");   
    }
  }

  $scope.postEventoFrequencia = function(obj, donatarioEl){
      var liberado = true;
      var situacao = null;
      obj.id_evento = $scope.evento.id;



      obj.isento = null;
      if($scope.evento.valor == '0,00'){
        obj.isento = 1;
        situacao = 'Não';
      }

      var indice = $scope.tabela_pessoa.map(function (element) {
          return element.id_pessoa;
      }).indexOf(obj.id);

      if(indice < 0 || (indice>=0 && obj.donatario != donatarioEl)){

        console.log('postEventoFrequencia', $scope.aPagante);

        $scope.json = angular.toJson(obj);
        $http.post('api/index.php/eventofrequencia/', $scope.json, 
                                       {withCredentials: true,
                                       headers: {'enctype': 'multipart/form-data' },
                                       // transformRequest: angular.identity
                                       }
        ).success(function(data, status, headers, config) {
           if(data.error == '0'){ 

              var newitem = {};
              newitem.id = data.id;
              newitem.id_evento = obj.id_evento;
              newitem.id_pessoa = obj.id;
              newitem.id_pessoa_pagante = null;
              newitem.pagante = null;
              newitem.id_caixa = null;
              newitem.id_situacao = null,
              newitem.situacao = situacao,
              newitem.id_forma_pagamento = null;
              newitem.forma_pagamento = null,
              newitem.nome = obj.nome;
              newitem.isento = obj.isento;
              newitem.donatario = obj.donatario;
              newitem.data_cadastro = data.data_cadastro;

              $scope.tabela_pessoa.push(newitem);

              $scope.refreshPagante('');
              
              Mensagem.success(data.mensagem); 

              if(donatarioEl == 0){
                $scope.associado.selected = ''; 
              }

              if(donatarioEl == 1){
                console.log('donatario', $scope.donatario.selected);
                $scope.donatario.selected = '';
              }
           }else{
              Mensagem.error(data.mensagem);   
           }
        }).error(function(data, status) { 
          
        });
      }else{
        Mensagem.error("Registro não pode ser incluido pois já esta na lista!"); 
      }
  }

  $scope.refreshPagante = function(objeto) {
    var params = {
      objeto: objeto,
      sensor: false
    };
    if (objeto.length < 0) {
      objeto = "a";
    };
    return $http.get('api/index.php/stringeventofrequencia?todos=1&idevento='+$scope.evento.id+'&string=' + objeto, {
    //return $http.get('api/index.php/eventofrequencia?idevento='+ $scope.evento.id +'&string=' + objeto, {
      
      params: params
    }).then(function(response) {
      $scope.sociosPag = response.data['pessoa'];
      console.log('refreshPagante', $scope.sociosPag);
    });
  };
  
  $scope.refreshAssociados = function(objeto) {
		var params = {
			objeto: objeto,
			sensor: false
		};
		if (objeto.length < 0) {
			objeto = "a";
		};
		return $http.get('api/index.php/stringpessoa?todos=1&string=' + objeto, {
			params: params
		}).then(function(response) {
			$scope.socios = response.data['pessoa']
		});
	};


  $scope.refreshDonatarios = function(objeto) {
    var params = {
      objeto: objeto,
      sensor: false
    };
    if (objeto.length < 0) {
      objeto = "a";
    };
    return $http.get('api/index.php/stringpessoa?todos=1&string=' + objeto, {
      params: params
    }).then(function(response) {
      $scope.membros = response.data['pessoa']
    });
  };

	$scope.getFormaPagamento = function(){
      $http.get('api/index.php/formapagamento/').    
      success(function(data, status, headers, config) {                           
        $scope.forma_pagamento = data.forma_pagamento;
      }).
      error(function(data, status, headers, config) {
        // log error
      }); 
  }


  $scope.getSituacao = function(){
      $http.get('api/index.php/situacao/').    
      success(function(data, status, headers, config) {                           
        $scope.situacao = data.situacao;
      }).
      error(function(data, status, headers, config) {
        // log error
      }); 
  }

  $scope.postCaixaUpFrequencia = function(nivelEl, obj){
    var validar = true;
    var id_situacao = null;
    var id_forma_pagamento = null;

    var nivel = $scope.strInArray($scope.tabela_pessoa, 'id', obj.id);

    if(!angular.isUndefined($scope.pago[nivelEl])){
      if(($scope.pago[nivelEl].id != '' && angular.isUndefined($scope.forma[nivelEl])) || ($scope.pago[nivelEl].id != '' && $scope.forma[nivelEl].id == '')) {
        validar = false;
      }else{
        id_situacao = $scope.pago[nivelEl].id;
        if(!angular.isUndefined($scope.forma[nivelEl])){
          id_forma_pagamento = $scope.forma[nivelEl].id;
        }
      }
    }
    
    if(validar == true){
      var item = $scope.tabela_pessoa[nivel];
      item.id_situacao = id_situacao;
      if(id_situacao == null || id_situacao == ''){
        item.isento = 1;
        var situacao = 'Não';
      }else{
        item.isento = 0;
        var situacao = 'Pago';
      }
      item.id_forma_pagamento = id_forma_pagamento;
      item.valor = $scope.evento.valor;
      item.title = $scope.evento.title;
      item.data_vencimento = $scope.evento.data_evento;

      console.log('postCaixaUpFrequencia', item);

      $scope.json = angular.toJson(item);
        $http.post('api/index.php/caixaupfrequencia/', $scope.json, 
                                       {withCredentials: true,
                                       headers: {'enctype': 'multipart/form-data' },
                                       // transformRequest: angular.identity
                                       }
        ).success(function(data, status, headers, config) {
           if(data.error == '0'){ 
              var forma_pag_descricao = '';
              if(id_situacao != null){
                angular.forEach($scope.forma_pagamento, function(value, key) {
                  if(!angular.isUndefined($scope.forma[nivelEl])){
                    if(value['id'] == $scope.forma[nivelEl]['id']){
                      forma_pag_descricao = value['descricao'];
                    }
                  }
                });
              }

              $scope.tabela_pessoa[nivel].situacao = situacao;

              $scope.tabela_pessoa[nivel].id_situacao = item.id_situacao;

              $scope.tabela_pessoa[nivel].id_caixa = data.id_caixa;
              
              $scope.tabela_pessoa[nivel].forma_pagamento = forma_pag_descricao;
              $scope.tabela_pessoa[nivel].id_forma_pagamento = item.id_forma_pagamento;
              
              Mensagem.success(data.mensagem);  
           }else{
              Mensagem.error(data.mensagem);   
           }
        }).error(function(data, status) { 
          
        });
    }else{
      Mensagem.error("Não foi informado a forma de pagamento!");   
    }
  }

  $scope.delEventoFrequencia = function(indiceEl, pessoa){
      console.log('delEventoFrequencia', pessoa);

      $scope.json = angular.toJson(pessoa);
      $http.post('api/index.php/deleventofrequencia/', $scope.json, 
                                     {withCredentials: true,
                                     headers: {'enctype': 'multipart/form-data' },
                                     // transformRequest: angular.identity
                                     }
      ).success(function(data, status, headers, config) {
         if(data.error == '0'){ 
            var nivel = $scope.strInArray($scope.tabela_pessoa, 'id_pessoa', pessoa.id_pessoa);
            $scope.tabela_pessoa.splice(nivel,1);

            $scope.refreshPagante('');

            angular.forEach($scope.tabela_pessoa, function(value, key) {
              nivel = $scope.strInArray($scope.tabela_pessoa, 'id_pessoa_pagante', pessoa.id_pessoa);
              
              if(!angular.isUndefined($scope.tabela_pessoa[nivel])){
                $scope.tabela_pessoa[nivel].id_pessoa_pagante = null;
                $scope.tabela_pessoa[nivel].pagante = null;
              }
            });
            
            Mensagem.success(data.mensagem);  
         }else{
            Mensagem.error(data.mensagem);   
         }
      }).error(function(data, status) { 
        
      });
  }

  $scope.getEvento = function(){
      $http.get('api/index.php/evento/' + $scope.evento.id).    
      success(function(data, status, headers, config) {                           
        $scope.evento = data[0];
      }).
      error(function(data, status, headers, config) {
        // log error
      }); 
  }

  $scope.getPessoa = function(){
    $http.get('api/index.php/eventofrequencia/'+$scope.evento.id).    
      success(function(data, status, headers, config) {                           
        $scope.tabela_pessoa = data;
        $scope.tabela_donatario = data;
        
      }).
      error(function(data, status, headers, config) {
        //log error
    });
  }

  $scope.getFormaPagamento();
  $scope.getSituacao();
  $scope.getEvento();
  $scope.getPessoa();
});