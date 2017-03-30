/*
  Módulo: Escola
  Descrição: CRUD Tipo de Carne
  Método: GET
  URL: /forms/formCadastroTipoCarne
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 22/05/2015
  Autor: Fábio Roberto Haydn
  Versão: 1.0  
 */
smartSig.registerCtrl("formCadastroTipoCarne", function($scope, $http, $routeParams, Mensagem, $timeout, Permissao){

    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    var idTipoCarne = $routeParams.id;

    /* -------------------------------------------------- */
    $scope.limpar = function(){

      $scope.tipocarne = {};

      //$scope.empresas = {};
      $scope.tiporeceitas = {};
      $scope.grupotipocarnes = {};
      $scope.tipobloqueios = {};

      $scope.tipocarne.recibo_avulso = 0;
      $scope.tipocarne.calcula_correcao = 0;
      $scope.tipocarne.ativo = 1;

      $scope.error = '';  

      $scope.grupo = [];
      $scope.bloqueio = [];
    }
    $scope.limpar();
    
    $scope.getTipoReceita = function(){
      $http.get('api/index.php/tiporeceita/')
      .success(function(data, status, headers, config) {
        $scope.tiporeceitas = data.tiporeceita;
      })
      .error(function(data, status, headers, config) { });
    }
    $scope.getTipoReceita();
    /* -------------------------------------------------- */
    $scope.getGrupoTipoCarne = function(){
      $http.get('api/index.php/grupotipocarne/0/')
      .success(function(data, status, headers, config) {
        $scope.grupotipocarnes = data.grupo_tipo_carne; 
      })
      .error(function(data, status, headers, config) { });
    }
    $scope.getGrupoTipoCarne();
    /* -------------------------------------------------- */
    $scope.getTipoBloqueio = function(){      
      $http.get('api/index.php/bloqueiomatricula/0/')
      .success(function(data, status, headers, config) {
        $scope.tipobloqueios = data.bloqueiomatricula;
      })
      .error(function(data, status, headers, config) { });
    }
    $scope.getTipoBloqueio();


    /* ------------------------------------------------------------------------------------------------------------------------- */
    $scope.cadastrarTipoCarne = function(objeto) {

      if ($('#cadastroTipoCarne-form').valid()) {
        
         $scope.json = angular.toJson($scope.tipocarne);
                            
        $http.post('api/index.php/tipocarne/', $scope.json,{withCredentials: true,headers: {'enctype': 'multipart/form-data' },})
        .success(function(data, status, headers, config) {
           if (data.error == '0')
           {   
              Mensagem.success(data.mensagem);   
              $scope.tipocarne.id = data.id;
           }
           else
           {
              Mensagem.error(data.mensagem);
           }
        })
        .error(function(data, status) {  });
      }
    }

    /* ------------------------------------------------------------------------------------------------------------------------- */
    $scope.getIdTipoCarne = function(){
      $http.get('api/index.php/tipocarne/'+idTipoCarne)
        .success(function(data, status, headers, config) {
            
            $scope.tipocarne = data.tipo_carne[0];
            $scope.grupo    = {selected : {"id":$scope.tipocarne.id_grupo_carne       ,"descricao":$scope.tipocarne.descGrupoCarne}};
            $scope.bloqueio = {selected : {"id":$scope.tipocarne.id_bloqueio_matricula,"descricao":$scope.tipocarne.descBloqueioMatricula}};
        })
        .error(function(data, status, headers, config) { }); 
    }  
    if (idTipoCarne != undefined) { $scope.getIdTipoCarne() };
 
    /* ------------------------------------------------------------------------------------------------------------------------- */
    $scope.novoCadastro = function()
    { 
      $scope.limpar();      
      $scope.getTipoReceita();
      $scope.getGrupoTipoCarne();
      $scope.getTipoBloqueio();
    };

    /* ************************************************************************************************************************* */
    /* MODAL - Grupo Tipo de Carnê                                                                                               */
    /* ************************************************************************************************************************* */

    $scope.verificarAcaoGrupoTipoCarne = function(item) {
      if (item.id==-1) {
        $scope.modalNovoGrupoTipoCarne();        
      }

      $scope.tipocarne.id_grupo_carne = item.id;

      $( "em[for='selgrupoTipoCarne']" ).css("display","none");    
    }

    $scope.modalNovoGrupoTipoCarne = function(size){
        $('#myModalGrupoTipoCarne').modal('show');        
    }

    $scope.adicionarGrupoTipoCarne = function(){ 
      if ($('#cadastroGrupoTipoCarne-form').valid()) {
                
        $scope.addGrupoTipoCarne.ativo = 1;
        $scope.json = angular.toJson($scope.addGrupoTipoCarne);
                            
        $http.post('api/index.php/grupotipocarne/', $scope.json, {withCredentials: true, headers: {'enctype': 'multipart/form-data' },})
        .success(function(data, status, headers, config) {
            if (data.error == '0'){  
                Mensagem.success(data.mensagem);    
                
                $('#myModalGrupoTipoCarne').modal('hide');    
                                
                $scope.getGrupoTipoCarne();
                $scope.addGrupoTipoCarne = {};
                $scope.grupo.selected = '';
                
            } else {              
              Mensagem.error(data.mensagem);   
            }
        }).error(function(data, status) { });
      }
    }

    /* ************************************************************************************************************************* */
    /* MODAL - Bloqueio de Matrícula                                                                                             */
    /* ************************************************************************************************************************* */

    $scope.verificarAcaoBloqueioMatricula = function(item) {
      if (item.id==-1) {
        $scope.modalNovoBloqueioMatricula();        
      }

      $scope.tipocarne.id_bloqueio_matricula = item.id;

      $( "em[for='selbloqueiomatricula']" ).css("display","none");    
    }

    $scope.modalNovoBloqueioMatricula = function(size){
        $('#myModalBloqueioMatricula').modal('show');        
    }

    $scope.adicionarBloqueioMatricula = function(){ 
      if ($('#cadastroBloqueioMatricula-form').valid()) {
                
        $scope.addBloqueioMatricula.ativo = 1;
        $scope.json = angular.toJson($scope.addBloqueioMatricula);
                            
        $http.post('api/index.php/bloqueiomatricula/', $scope.json, {withCredentials: true, headers: {'enctype': 'multipart/form-data' },})
        .success(function(data, status, headers, config) {
            if (data.error == '0'){  
                Mensagem.success(data.mensagem);    
                
                $('#myModalBloqueioMatricula').modal('hide');    
                
                $scope.getTipoBloqueio();
                $scope.addBloqueioMatricula = {};
                $scope.bloqueio.selected = '';

            } else {              
              Mensagem.error(data.mensagem);   
            }
        }).error(function(data, status) { });
      }
    }

});

//@ sourceURL=controller.formCadastroTipoCarne.js