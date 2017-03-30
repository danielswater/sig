smartSig.registerCtrl("formCadastroListaConvidados", function($scope, ngTableParams, $http, $location, $filter, $q, filterFilter, $timeout, Modulos,$routeParams, Mensagem ) {
  $scope.lista_selected = {};
  $scope.lista_selected.id = '';
  $scope.tabela_pessoa = [];
  $scope.tabela_lista = [];
  $scope.searchNome = '';

  $scope.getPessoa = function(id_lista){
      $http.get('api/index.php/listapessoa/'+id_lista).    
        success(function(data, status, headers, config) {                           
          $scope.tabela_pessoa = data;
          console.log('getPessoa', $scope.tabela_pessoa);
          //$("#addTodos").removeAttr("disabled");
          //$("#limparLista").removeAttr("disabled");
        }).
        error(function(data, status, headers, config) {
          //log error
      });
    }
  $scope.tabelaLista = function(indiceEl){
      console.log('tabela lista', $scope.lista[indiceEl]);
      $scope.lista_selected = $scope.lista[indiceEl];  

      if($scope.lista[indiceEl].convidados.length > 0){
          $scope.tabela_lista = $scope.lista[indiceEl].convidados;
      }else{
        $scope.tabela_lista = [];
      }
      
      $scope.getPessoa($scope.lista_selected.id);
  }

  $scope.limparHistoricoSel = function(){
      //$scope.tableParams2 = '';
      $scope.tabela_lista = [];
      $scope.tabela_pessoa = [];
      $scope.lista_selected = {};

      //$("#addTodos").attr("disabled", "disabled");
      //$("#limparLista").attr("disabled", "disabled");
  }

  $scope.strInArray = function(arr, atr, str) {
    for(i=0; i < arr.length; i++) {
      if(arr[i][atr] == str) {

        return i; 
      }
    }
    return -1;
  }
  
  $scope.addLista = function(item, id_lista){
    console.log('add lista', item);
  }

  $scope.addListaConvidados = function(item){
      $scope.addListaPessoa = {};
      $scope.addListaPessoa.id_lista = $scope.lista_selected.id;
      $scope.addListaPessoa.id_pessoa = item.id;

      $scope.json = angular.toJson($scope.addListaPessoa);
                            
      $http.post('api/index.php/cadastrarlistapessoa/', $scope.json, 
                                     {withCredentials: true,
                                     headers: {'enctype': 'multipart/form-data' },
                                     }
      ).success(function(data, status, headers, config) {
         if (data.error == '0'){ 
              var newitem = [];
              newitem.empresa = item.empresa;
              newitem.id_lista = $scope.lista_selected.id;
              newitem.id_pessoa = item.id;
              newitem.nome = item.nome;
              newitem.ocupacao = item.ocupacao;

              $scope.tabela_lista.push(newitem);

              $scope.getPessoa($scope.lista_selected.id);

              //$scope.mensagemSuccess(data.mensagem);  
         }else{
            $scope.mensagemError(data.mensagem);   
         }
      }).error(function(data, status) { 
        
      });

      $scope.addListaPessoa = {};
  }

  $scope.addSelListaPessoa = function(selected){
      nova_lista = {};
      nova_lista['id_lista'] = $scope.lista_selected.id;
      nova_lista['selecionados'] = selected;
      
      $scope.json = angular.toJson(nova_lista);
                            
      $http.post('api/index.php/cadastrarsellistapessoa/', $scope.json, 
                                     {withCredentials: true,
                                     headers: {'enctype': 'multipart/form-data' },
                                     }
      ).success(function(data, status, headers, config) {
         if(data.error == '0'){  
            angular.forEach(selected, function(value, key) {
              var newitem = [];
              newitem.empresa = value.empresa;
              newitem.id_lista = $scope.lista_selected.id;
              newitem.id_pessoa = value.id;
              newitem.nome = value.nome;
              newitem.ocupacao = value.ocupacao;

              $scope.tabela_lista.push(newitem);
            });

            $scope.getPessoa($scope.lista_selected.id);
            
            $scope.mensagemSuccess(data.mensagem); 
         }else{
            $scope.mensagemError(data.mensagem);   
         }
      }).error(function(data, status) { 
        
      });

      $scope.addListaPessoa = {};

  }

  $scope.delLista = function(item){
    var nivel = $scope.strInArray($scope.tabela_lista, 'id_pessoa', item.id_pessoa);
    $scope.tabela_lista.splice(nivel,1);
  }

  $scope.excluirListaConvidados = function(item){
    $scope.excluirListaPessoa = {};
    $scope.excluirListaPessoa.id_pessoa = item.id_pessoa;
    $scope.excluirListaPessoa.id_lista = item.id_lista;

    $scope.json = angular.toJson($scope.excluirListaPessoa);
                          
    $http.post('api/index.php/excluirlistapessoa/', $scope.json, 
                                   {withCredentials: true,
                                   headers: {'enctype': 'multipart/form-data' },
                                   }
    ).success(function(data, status, headers, config) {
       if (data.error == '0'){       
          
          $scope.delLista(item);
          
          //$scope.mensagemSuccess(data.mensagem); 
          $scope.getPessoa($scope.lista_selected.id);
       }else{
          $scope.mensagemError(data.mensagem);   
       }
    }).error(function(data, status) { 
      
    });

    $scope.excluirListaPessoa = {};
  }

  $scope.excluirLista = function(indexEl, item) {

    $scope.json = angular.toJson(item);
          
    $http.post('api/index.php/excluirlista/', $scope.json, 
                                   {withCredentials: true,
                                   headers: {'enctype': 'multipart/form-data' },
                                   // transformRequest: angular.identity
                                   }
    ).success(function(data, status, headers, config) {    
      if (data.error == '0'){   
          $scope.lista.splice(indexEl, 1);
        
          $scope.limparHistoricoSel();
      }else{
          Mensagem.error(data.mensagem);
      }               
    }).
    error(function(data, status, headers, config) {
      // log error
    }); 
  }

  $scope.modalAddSelListaPessoa = function(filtro){
      $.SmartMessageBox({
        title : "Adicionar Pessoas a Lista",
        content : "Tem certeza que deseja adicionar todas as pessoas selecionada a lista " + $scope.lista_selected.nome + ".",
        buttons : "[Sim][Não]",
        placeholder : ""
      }, function(ButtonPress, Value) {
        if (ButtonPress == "Sim") {
          $scope.filtered = $filter('filter')($scope.tabela_pessoa, filtro);
          $scope.addSelListaPessoa($scope.filtered);
          return 0;
        }else{
          return 0;  
        }
      });
  }

  $scope.modalExcluirLista = function(indexEl, item){
      $.SmartMessageBox({
        title : "Excluir Lista: " + item.nome,
        content : "Tem certeza que deseja excluir a lista " + item.nome + " e os vinculos com os convidados",
        buttons : "[Sim][Não]",
        placeholder : ""
      }, function(ButtonPress, Value) {
        if (ButtonPress == "Sim") {
          $scope.excluirLista(indexEl, item);
          return 0;
        }else{
          return 0;  
        }
      });
  }

  $scope.modalLimparLista = function(){
      var conteudo, botoes;
      if($scope.tabela_lista.length > 0){
        conteudo = "Tem certeza que deseja excluir todos os convidados da lista " + $scope.lista_selected.nome + ".";
        botoes = "[Sim][Não]";
      }else{
        conteudo = "A lista de convidados " + $scope.lista_selected.nome + ", já esta vazia.";
        botoes = "[Ok]";
      }

      $.SmartMessageBox({
        title : "Limpar Lista: " + $scope.lista_selected.nome,
        content : conteudo,
        buttons : botoes,
        placeholder : ""
      }, function(ButtonPress, Value) {
        if (ButtonPress == "Sim") {
          $scope.limparLista = {};
          $scope.limparLista.id = $scope.lista_selected.id;

          $scope.json = angular.toJson($scope.limparLista);
                                
          $http.post('api/index.php/limparlistapessoa/', $scope.json, 
                                         {withCredentials: true,
                                         headers: {'enctype': 'multipart/form-data' },
                                         }
          ).success(function(data, status, headers, config) {
             if (data.error == '0'){
              
              $scope.tabela_lista.splice(0, $scope.tabela_lista.length)

              $scope.getPessoa($scope.lista_selected.id);
              
              $scope.mensagemSuccess(data.mensagem); 
          }else{
                $scope.mensagemError(data.mensagem);   
             }
          }).error(function(data, status) { 
            
          });
          return 0;
        }else{
          return 0;  
        }
      });
  }


  $scope.modalNovaLista = function(){
      $('#myModal #addLista').show();
      $('#myModal #upLista').hide();
      $('#myModalLabel').html("Nova lista");
      $('#myModal').modal('show');
      
      $scope.addLista = {};
      $scope.addLista.id = '';
      $scope.addLista.nome = '';
      $scope.addLista.descricao = '';
  }

  $scope.modalAlterLista = function(indexEl, item){
      $('#myModal #addLista').hide();
      $('#myModal #upLista').show();
      $('#myModalLabel').html("Alterar lista");
      $('#myModal').modal('show');
      
      $scope.addLista = {};
      $scope.addLista.id = item.id;
      $scope.addLista.nome = item.nome;
      $scope.addLista.descricao = item.descricao;
  }

  $scope.novaLista = function(){
      if ($('#cadastroLista-form').valid()) {

        $scope.json = angular.toJson($scope.addLista);

        console.log('novaLista', $scope.addLista);  
                            
        $http.post('api/index.php/cadastrarlista/', $scope.json, 
                                       {withCredentials: true,
                                       headers: {'enctype': 'multipart/form-data' },
                                       }
        ).success(function(data, status, headers, config) {
           if (data.error == '0'){  
                //$scope.mensagemSuccess(data.mensagem);   
                //$scope.lista = [];
                //$scope.getLista();
                if($scope.addLista.id == ""){
                  new_item = {};
                  new_item.descricao = $scope.addLista.descricao;
                  new_item.nome = $scope.addLista.nome;
                  new_item.id = data.id_lista;
                  new_item.convidados = [];
                  $scope.lista.push(new_item);
                }else{
                  var nivel = $scope.strInArray ($scope.lista, 'id', data.id_lista);
                  $scope.lista[nivel].descricao = $scope.addLista.descricao;
                  $scope.lista[nivel].nome = $scope.addLista.nome;
                }

                $('#myModal').modal('hide');
                
                $scope.limparHistoricoSel();
                
                $scope.addLista = {};
         }else{
              Mensagem.error(data.mensagem);   
           }
        }).error(function(data, status) { 
          
        });
      }
  }

  $scope.getLista = function(){
      $http.get('api/index.php/lista/').    
      success(function(data, status, headers, config) {                           
        $scope.lista = data;
        console.log('lista', $scope.lista);
      }).
      error(function(data, status, headers, config) {
        // log error
      }); 
  }

  $scope.mensagemSuccess = function(contentMensagem){
        Mensagem.success(contentMensagem);
  }

  $scope.mensagemError = function(contentMensagem){
      Mensagem.error(contentMensagem);
  } 




  $scope.filtro = function(){
    $scope.counter++;
    console.log($scope.counter);
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

  $scope.getLista();
});