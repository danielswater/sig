smartSig.registerCtrl("formCadastroPerfil", function($scope, $http, $routeParams, Mensagem, $filter){

  $scope.perfil = {}
  $scope.perfil.ativo = 1;
  $scope.perfil.show_menu = 1;
  $scope.papel = [];
  $scope.addPerfil = {};
  $scope.tree = {};  


  $scope.getUserLogado = function(){
    $http.get('api/index.php/usuariologado/')
    .success(function(data, status, headers, config) {

        $scope.entidadeLogada = data['user']['user'].idTipoEntidade;

        //Inicializa Combos
        $scope.getPapel();
        $scope.getTipoEntidade();
        $scope.getAtividades();
        $scope.getTreeAtividade('');

    })
    .error(function(data, status, headers, config) { });
  }
  $scope.getUserLogado();

  $scope.strInArray = function(arr, atr, str) {
    if (typeof arr !== "undefined") {
      for(i=0; i < arr.length; i++) {
        if(arr[i][atr] == str) {
          return i; 
        }
      }
    }
    return -1;
  }

  $scope.getTipoEntidade = function(){

      $http.get('api/index.php/tipoentidade/'+$scope.entidadeLogada).    
      success(function(data, status, headers, config) {        
        $scope.tipoentidade = data;        
      }).
      error(function(data, status, headers, config) {
        // log error
      }); 
  } 

  $scope.getAtividades = function(){

      $http.get('api/index.php/atividade').    
      success(function(data, status, headers, config) {                           
        $scope.atividades = data;
      }).
      error(function(data, status, headers, config) {
        // log error
      }); 
  } 

  $scope.getPapel = function(){
      $http.get('api/index.php/treeatividade/')
      .success(function(data, status, headers, config) {
        
        $scope.papel = data;        
      })
      .error(function(data, status, headers, config) { }); 
  }


  $scope.cadastrarAtividade = function(objeto) {      

      if ($('#cadastroAtividade-form').valid()) {

        $scope.json = angular.toJson($scope.perfil);
                            
        $http.post('api/index.php/atividade/', $scope.json, 
                                       {withCredentials: true,
                                       headers: {'enctype': 'multipart/form-data' },
                                       }
        ).success(function(data, status, headers, config) {
           if (data.error == '0')
           {   
              $scope.objeto = {}; 

              Mensagem.success(data.mensagem);   

              $scope.perfil = {};
              $scope.perfil.ativo = 1;
              $scope.perfil.show_menu = 1;

              $scope.getTreeAtividade('');
           }
           else
           {
              Mensagem.error(data.mensagem);   
           }
        }).error(function(data, status) { 
          
        });

      }

   } 

   $scope.mensagemSuccess = function(contentMensagem){
       Mensagem.success(contentMensagem);
   }

   $scope.mensagemError = function(contentMensagem){
       Mensagem.error(contentMensagem);
   }

   $scope.getTreeAtividade = function(id_perfil){
      var url = 'treeatividade/';
      if(id_perfil != ''){
        url+= id_perfil;
        $scope.id_perfil = id_perfil;

        $http.get('api/index.php/' + url).    
            success(function(data, status, headers, config) {                           
              $scope.treeAtividade = data;
            }).
            error(function(data, status, headers, config) {
              // log error
            }); 
      }else{
        $http.get('api/index.php/' + url).    
            success(function(data, status, headers, config) {                           
              var data_atividade = data[0].children;//Traz as atividades sem o perfil
              $scope.treeAtividade = data_atividade;
            }).
            error(function(data, status, headers, config) {
              // log error
            });
      }

      

      $scope.$watch('perfil.currentNode', function( newObj, oldObj ) {
          if($scope.perfil && angular.isObject($scope.perfil.currentNode) ) {
              console.log( 'Node Selected!!' );
              console.log( $scope.perfil.currentNode );
          }
      }, false);

   } 

   $scope.removeValidate = function(){
      $('#cadastroAtividade-form .inputValidate').removeClass("state-error");
      $('#cadastroAtividade-form .invalid').remove();
   }

   $scope.novoCadastro = function(){
      $scope.perfil = {};
      $scope.perfil.show_menu = 1;
      $scope.perfil.ativo = 1;

      $scope.removeValidate();
   }

   $scope.montarAlterarAtividade = function(treeatividade){
      console.log('montarAlterarAtividade', treeatividade);
      $scope.perfil.id = treeatividade.id_modulo;
      $scope.perfil.nome = treeatividade.nome;
      $scope.perfil.descricao = treeatividade.descricao;
      $scope.perfil.url = treeatividade.url;
      $scope.perfil.id_atividade_parent = treeatividade.id_parent;
      $scope.perfil.id_tipo_entidade = treeatividade.id_tipo_entidade;
      $scope.perfil.show_menu = treeatividade.show_menu;
      $scope.perfil.ativo = treeatividade.ativo;

      $scope.removeValidate();
   }

   $scope.cadastrarTreeAtividade = function(id_atividade, indiceEl) {      
        console.log('cadastrarTreeAtividade', $scope.treeAtividade);
        var perfil = {};
        perfil.id_perfil = $scope.id_perfil;
        perfil.id_atividade = id_atividade;        

        $scope.json = angular.toJson(perfil);

        $http.post('api/index.php/cadastraratividade', $scope.json, 
                                       {withCredentials: true,
                                       headers: {'enctype': 'multipart/form-data' },
                                       }
        ).success(function(data, status, headers, config) {
           if (data.error == '0')
           {  
              $scope.getTreeAtividade($scope.id_perfil); 
              Mensagem.success(data.mensagem);   
           }
           else
           {
              Mensagem.error(data.mensagem);   
           }
        }).error(function(data, status) { 
          
        });

  } 

  $scope.permissaoTreeAtividade = function(item, indiceEl, tipo) {      
        var permissao = {};
        permissao.id_perfil = $scope.id_perfil;
        permissao.id_atividade = item.id_modulo;
        permissao.tipo = tipo;

        switch (tipo) {
          case 'VISUALIZAR':
              permissao.valor = item.visualizar == 0 ? 1: 0;  
              break;
          case 'CADASTRAR':
              permissao.valor = item.cadastrar == 0 ? 1: 0;  
              break;
          case 'EXCLUIR':
              permissao.valor = item.excluir == 0 ? 1: 0;  
              break;
        }
        
        $scope.json = angular.toJson(permissao);

        $http.post('api/index.php/permissaotreeatividade', $scope.json, 
                                       {withCredentials: true,
                                       headers: {'enctype': 'multipart/form-data' },
                                       }
        ).success(function(data, status, headers, config) {
           if (data.error == '0')
           {   
              Mensagem.success(data.mensagem);   
           }
           else
           {
              Mensagem.error(data.mensagem);   
           }
        }).error(function(data, status) { 
          
        });

  }

  $scope.cadastrarPerfil = function(indiceEl, id_perfil, nome, descricao){
     if ($('#cadastroPerfil-form').valid()) {
        var indice = $scope.strInArray ($scope.papel, 'id_perfil', $scope.addPerfil.id_perfil);

        var perfil = {};
        perfil.id_perfil = $scope.addPerfil.id_perfil;
        perfil.nome = $scope.addPerfil.nome;
        perfil.descricao = $scope.addPerfil.descricao;
        perfil.id_tipo_entidade = $scope.entidadeLogada;

        $scope.json = angular.toJson(perfil);

        $http.post('api/index.php/cadastrarperfil/', $scope.json, 
                                       {withCredentials: true,
                                       headers: {'enctype': 'multipart/form-data' },
                                       }
          ).success(function(data, status, headers, config) {
             if (data.error == '0')
             {   
                console.log('cadastrarPerfil', $scope.addPerfil.id_perfil);
                if($scope.addPerfil.id_perfil == ''){
                  newPerfil = [];
                  newPerfil['id_perfil'] = data.id_papel;
                  newPerfil['nome'] = $scope.addPerfil.nome;
                  newPerfil['descricao'] = $scope.addPerfil.descricao;
                  newPerfil['children'] = '';

                  newPerfil['ativo'] = 1;
                  newPerfil['id_tipo_entidade'] = $scope.entidadeLogada;


                  $scope.papel.push(newPerfil);
                }else{
                  $scope.papel[indice].nome = $scope.addPerfil.nome;
                  $scope.papel[indice].descricao = $scope.addPerfil.descricao;
                }

                $('#myModalPerfil').modal('hide');

                Mensagem.success(data.mensagem);   

             }
             else
             {
                Mensagem.error(data.mensagem);   
             }
          }).error(function(data, status) { 
          
        });
     }
 }

 $scope.excluirPerfil = function(indiceEl, id_perfil) {      

        console.log('excluirPerfil', 'indice:' +indiceEl +' id:' +id_perfil);

        var perfil = {};
        perfil.id_perfil = id_perfil;

        $scope.json = angular.toJson(perfil);

        $http.post('api/index.php/excluirperfil/', $scope.json, 
                                       {withCredentials: true,
                                       headers: {'enctype': 'multipart/form-data' },
                                       }
        ).success(function(data, status, headers, config) {
           if (data.error == '0'){   
              Mensagem.success(data.mensagem);   
              
              $scope.papel.splice(indiceEl,1);
              $scope.getTreeAtividade('');
           }else{
              Mensagem.error(data.mensagem);   
           }
        }).error(function(data, status) { 
          
        });

  } 

  $scope.modalNovoPerfil = function(){
      $scope.addPerfil.id_perfil = '';
      $scope.addPerfil.nome = '';
      $scope.addPerfil.descricao = '';

      $('#myModalPerfil').modal('show');
  }

  $scope.modalAlterarPerfil = function(id_perfil, nome, descricao){
      $scope.addPerfil.id_perfil = id_perfil;
      $scope.addPerfil.nome = nome;
      $scope.addPerfil.descricao = descricao;

      $('#myModalPerfil').modal('show');
  }


  $scope.modalExcluirPerfil = function(indiceEl, nome, id_perfil){

      $.SmartMessageBox({
        title : "Excluir Perfil: " + nome,
        content : "Tem certeza que deseja excluir o perfil " + nome + " e os vínculos com as atividades?",
        buttons : "[Sim][Não]",
        placeholder : ""
      }, function(ButtonPress, Value) {
        if (ButtonPress == "Sim") {
          $scope.excluirPerfil(indiceEl, id_perfil);
          return 0;
        }else{
          return 0;  
        }
      });
  }
});

//@ sourceURL=controller.formCadastroAluno.js