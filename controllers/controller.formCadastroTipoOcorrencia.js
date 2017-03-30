/*
  Módulo: Escola
  Descrição: CRUD Tipo Ocorrência
  URL: /gestao/formCadastroTipoOcorrência
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 16/02/2015
  Autor: Hamzi Jalel
  Versão: 1.0
  Data de Alteração: 16/02/2015
 */
 
smartSig.registerCtrl("formCadastroTipoOcorrencia", function($scope, $http, $routeParams, Mensagem, $timeout, Permissao){

    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    var idTipoOcorrencia = $routeParams.id;

    $scope.tipoocorrencia = {};
    $scope.grupoocorrencia = {};
    $scope.tipobloqueio = {};
    $scope.ocorrencia = {};
    $scope.bloqueio = {};
    
    $scope.error = '';  
    $scope.tipoocorrencia.ativo=1;

    $scope.cadastrarTipoOcorrencia = function(objeto) {
      if ($('#cadastroTipoOcorrencia-form').valid()) {

        $scope.json = angular.toJson($scope.tipoocorrencia);
                            
        $http.post('api/index.php/tipoocorrencia/', $scope.json, 
                                       {withCredentials: true,
                                       headers: {'enctype': 'multipart/form-data' },
                                       }
        ).success(function(data, status, headers, config) {

           if (data.error == '0'){   

              $scope.objeto = {};

              Mensagem.success(data.mensagem);   

              /*$scope.tipoocorrencia = {};
              $scope.grupoocorrencia = {};

              $scope.tipobloqueio = {};

              $scope.ocorrencia = {};
              $scope.bloqueio = {};*/

              //$scope.tipoocorrencia.ativo=1;
              $scope.tipoocorrencia.id = data.id_tipoocorrencia;
           }
           else{
              
              Mensagem.error(data.mensagem);   
           }

        }).error(function(data, status) { 
          
        });
      }

    }

    $scope.novoCadastro = function(){

      $scope.tipoocorrencia   = {};
      $scope.grupoocorrencia  = {};
      $scope.tipobloqueio     = {};
      $scope.ocorrencia       = {};
      $scope.bloqueio         = {};
      $scope.tipoocorrencia.ativo = 1;
    }


    $scope.getIdTipoOcorrencia = function(){
      $http.get('api/index.php/tipoocorrencia/1/'+idTipoOcorrencia).    
        success(function(data, status, headers, config) {      

          $scope.tipoocorrencia = data.tipoocorrencia[0]; 

          $scope.ocorrencia = {selected : {"id":$scope.tipoocorrencia.id_grupo_ocorrencia,"descricao":$scope.tipoocorrencia.grupo_ocorrencia}};        
          $scope.tipoocorrencia.ocorrencia = $scope.tipoocorrencia.id_grupo_ocorrencia;

          $scope.bloqueio = {selected : {"id":$scope.tipoocorrencia.id_tipo_bloqueio,"descricao":$scope.tipoocorrencia.tipo_bloqueio}};        
          $scope.tipoocorrencia.bloqueio = $scope.tipoocorrencia.id_tipo_bloqueio;

        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }

    // VERIFICAR AÇÃO 

    $scope.verificarAcao = function(item) {
      
      if (item.id==-1) {
        $scope.modalNovoGrupo();
        $scope.ocorrencia.selected = '';
      }

      $scope.tipoocorrencia.id_grupo_ocorrencia = item.id;

      $( "em[for='ocorrencia']" ).css("display","none");    
    }

    $scope.verificarAcaoBloqueio = function(item) {
      
      if (item.id==-1) {
        $scope.modalNovoBloqueio();
        $scope.ocorrencia.selected = '';
      }

      $scope.tipoocorrencia.id_tipo_bloqueio = item.id;

      $( "em[for='ocorrencia']" ).css("display","none");    
    }

    // MODAL

    $scope.modalNovoGrupo = function(size){
        $('#myModal').modal('show');        
    }

    $scope.modalNovoBloqueio = function(size){
        $('#myModal2').modal('show');        
    }

    // ADICIONAR 

    $scope.adicionarGrupo = function(){ 
      if ($('#cadastroGrupo-form').valid()) {

        $scope.addGrupo.descricao = $scope.addGrupo.descricao;
        $scope.addGrupo.ativo = 1;

        $scope.json = angular.toJson($scope.addGrupo);
                            
        $http.post('api/index.php/grupoocorrencia/', $scope.json, 
                                       {withCredentials: true,
                                       headers: {'enctype': 'multipart/form-data' },
                                       }
        ).success(function(data, status, headers, config) {
            if (data.error == '0'){  

                Mensagem.success(data.mensagem);    
                
                $('#myModal').modal('hide');    

                $scope.getGrupoOcorrencia(); 
                
                $scope.addGrupo = {};
            }else{              
              Mensagem.error(data.mensagem);   
            }
        }).error(function(data, status) { 
          
        });
      }
    }

    $scope.adicionarBloqueio = function(){ 
      if ($('#cadastroGrupo-form').valid()) {

        $scope.addBloqueio.descricao = $scope.addBloqueio.descricao;
        $scope.addBloqueio.ativo = 1;

        $scope.json = angular.toJson($scope.addBloqueio);
                            
        $http.post('api/index.php/tipobloqueio/', $scope.json, 
                                       {withCredentials: true,
                                       headers: {'enctype': 'multipart/form-data' },
                                       }
        ).success(function(data, status, headers, config) {
            if (data.error == '0'){  

                Mensagem.success(data.mensagem);    
                
                $('#myModal2').modal('hide');    

                $scope.getTipoBloqueio(); 
                
                $scope.addBloqueio = {};
            }else{              
              Mensagem.error(data.mensagem);   
            }
        }).error(function(data, status) { 
          
        });
      }
    }

    // POPULANDO O CAMPO SELECT  

    $scope.getGrupoOcorrencia = function(){

        $http.get('api/index.php/grupoocorrencia').    
        success(function(data, status, headers, config) {                           
          $scope.grupoocorrencias = data.grupoocorrencia;

          console.log('GRUPOS DE OCORRENCIA:',$scope.grupoocorrencias);
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    } 

    $scope.getTipoBloqueio = function(){

        $http.get('api/index.php/tipobloqueio').    
        success(function(data, status, headers, config) {                           
          $scope.tipobloqueios = data.tipoBloqueio;

          console.log('TIPOS DE BLOQUEIO:',$scope.tipobloqueios);
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }

    //Inicializa Combos
    $scope.getGrupoOcorrencia();
    $scope.getTipoBloqueio();     


    if (idTipoOcorrencia != undefined) {
      $timeout(function() {
        $scope.getIdTipoOcorrencia(idTipoOcorrencia);
      }, 800);      
    };           
    
});