/*
  Módulo: Cemitério
  Descrição: CRUD Lote
  Método: GET
  URL: /forms/formCadastroLotes
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 05/11/2014
  Autor: Fabio da Silva
  Versão: 1.0
  Data de Alteração: 05/11/2014
  */
  smartSig.registerCtrl("consultaCotacaoAprovacao", function($scope, $http, $routeParams, Mensagem, $timeout, Permissao){

    /*$scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });*/

    $scope.addDataInicial = {};
    $scope.addDataFinal = {};
    $scope.depto = {};
    $scope.lista_situacao_pedido = [];
    
    $scope.busca = {};
    $scope.busca.id_situacao_pedido = 2;

    $scope.pedidos = {};
    $scope.pedido = {};
    $scope.pedido_itens = {};
    $scope.addRejeitar = {};

    $scope.searchNome = '';

    $scope.setarTipoDeptoSelecionado = function(item) {      
      $scope.depto.tipodeptoselecionado = item;
    } 

    $scope.departamento = []; 
    $scope.departamentos = [];
    $scope.departamentos.selecionados = []; 
    
    $scope.$watch('busca.data_inicial', function(){  
      $scope.busca.data_inicial1 = $scope.busca.data_inicial;     
      if($scope.busca.data_inicial1 != undefined || $scope.busca.data_inicial1 != null){              
        $( "em[for='data_inicial']" ).css("display","none"); 
      }
    });

    $scope.$watch('busca.data_final', function(){  
      $scope.busca.data_final1 = $scope.busca.data_final;     
      if($scope.busca.data_final1 != undefined || $scope.busca.data_final1 != null){              
        $( "em[for='data_final']" ).css("display","none"); 
      }
    });

    $scope.refreshTipoDepto = function(depto) {      
      $scope.departamentos = [];
      $scope.departamentos.selecionados = [];
      
      $http.get('api/index.php/deptofuncionarios').    
      success(function(data, status, headers, config) {
        
        if(data.error != -1){
          $scope.departamento = data.departamentos;
          delete $scope.departamento[0];
          for (var i=0; i < $scope.departamento.length; i++) {
            if ( $scope.departamento[i] === undefined ) {
              $scope.departamento.splice(i,1);
              i--;
            }
          }
          angular.forEach(data, function(value, key) {

            angular.forEach(depto, function(value2, key2) {
              if(value.id == value2.id){
                $scope.departamentos.selecionados.push(data[key]);
              }
              
            });
          });

        }
      }).
      error(function(data, status, headers, config) {
        // log error
      });
    };

    $scope.getListaSituacaoPedido = function(){
      $http.get('api/index.php/listasituacaopedido/').    
      success(function(data, status, headers, config) {                           
        $scope.lista_situacao_pedido = data;
      }).
      error(function(data, status, headers, config) {
          // log error
        });

    }

    $scope.$watch('addDataInicial.data_inicial', function(){  
      $scope.addDataInicial.data_inicial1 = $scope.addDataInicial.data_inicial;     
      if($scope.addDataInicial.data_inicial1 != undefined || $scope.addDataInicial.data_inicial1 != null){              
        $( "em[for='data_inicial']" ).css("display","none");
        
      }
    });

    $scope.$watch('addDataFinal.data_final', function(){  
      $scope.addDataInicial.data_final1 = $scope.addDataInicial.data_final;     
      if($scope.addDataFinal.data_final1 != undefined || $scope.addDataFinal.data_final1 != null){              
        $( "em[for='data_inicial']" ).css("display","none");
      }
    });

    $scope.ModalEditarSituacao = function(item, indexEl, situacao){
      $scope.addRejeitar = {};
      $scope.addRejeitar.id = item.id;
      $scope.addRejeitar.index = indexEl;
      $scope.addRejeitar.id_situacao_pedido = situacao;
      $scope.addRejeitar.justificativa = '';

      $('#myModalSituacao').modal('show');     
    }

    $scope.editarSituacaoRejeitado = function(){
        if ($('#adicionarSituacao-form').valid()) {
          $scope.editarSituacao($scope.addRejeitar, $scope.addRejeitar.index, $scope.addRejeitar.id_situacao_pedido);
        }
    }

    
    $scope.consultaCotacao = function(){
        if ($('#consultaCotacaoAprovacao-form').valid()) {
            $scope.json = angular.toJson($scope.busca);

            $http.post('api/index.php/cotacaoaprovacao/', $scope.json, 
             {withCredentials: true,
               headers: {'enctype': 'multipart/form-data' },
             }
             ).success(function(data, status, headers, config) {
                  $scope.pedidos = data.pedido;

                  if(typeof $scope.pedidos === 'undefined'){
                    Mensagem.error('Não foi encontrado nenhum Registro com os dados especificados!');
                  }
            }).error(function(data, status) { 
              // log error
            });        
        }
    }
    
    $scope.editarSituacao = function(item, indexEl, situacao){
      item.id_situacao_nova = situacao;
      $scope.json = angular.toJson(item);

      $http.post('api/index.php/uppedidosituacao/', $scope.json, 
       {withCredentials: true,
         headers: {'enctype': 'multipart/form-data' },
       }
       ).success(function(data, status, headers, config) {
            if (data.error == '0'){
                Mensagem.success(data.mensagem);

                $scope.pedidos[indexEl].id_situacao_pedido = data.id_situacao_pedido;
                $scope.pedidos[indexEl].situacao_pedido = data.situacao_pedido;

                if(data.justificativa != ''){
                  $scope.addRejeitar = {};
                  $('#myModalSituacao').modal('hide');
                }
              }
              else{
                Mensagem.error(data.mensagem);   
              }
      }).error(function(data, status) { 

      });        
    }

    $scope.$watch("searchNome", function(q){
      console.log(q);
        //$scope.filteredData = $filter("filter")($scope.data, query);
    });
    
    $scope.currentPage = 1;
    $scope.pageSize = 10;    

    $scope.sort = {        
        active: 'nome',
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

    $scope.modalPedidoItens = function(pedido, $index){
      $scope.pedido = [];      
      $('#myModalItens').modal('show'); 
      
      $scope.getPedido(pedido.id)
      $scope.getPedidoItens(pedido.id);

      console.log('modalPedidoItens', $scope.pedido);
    }


    $scope.getPedido = function(id){
      if(id){
        $http.get('api/index.php/pedido/'+id).        
        success(function(data, status, headers, config) {                     
          $scope.pedido = data.pedido[0];
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
      }
    }
    $scope.getPedidoItens = function(id){
      if(id){
        $http.get('api/index.php/pedidoitens/'+id).        
        success(function(data, status, headers, config) {                           
          $scope.pedido_itens = data.pedido_itens;
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
      }
    }

    //Busca dados do usuário logado para usar em ação num botão
    $scope.getUserLogado = function(){
      $scope.user_logado = {};
      $http.get('api/index.php/usuariologado/').
        success(function(data, status, headers, config) {
          $scope.user_logado.id = data.user.user.id;
          $scope.user_logado.apelido = data.user.user.apelido;
        }).
        error(function(data, status, headers, config) {
          // log error
        });
    }

    $scope.getUserLogado();
    $scope.getListaSituacaoPedido();
    
  });