/*
  Módulo: Escola
  Descrição: CRUD Motivo de Bolsa
  Método: GET
  URL: /forms/formCadastroMotivoBolsa
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 22/05/2015
  Autor: Fábio Roberto Haydn
  Versão: 1.0  
 */
smartSig.registerCtrl("formCadastroMotivoBolsa", function($scope, $http, $routeParams, Mensagem, $timeout, Permissao){

    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    var idMotivoBolsa = $routeParams.id;

    $scope.grupo = [];
    $scope.motivobolsa = {};    
    $scope.motivobolsa.ativo=1;    
    $scope.motivobolsa.sem_pontualidade = 0;
    $scope.motivobolsa.gratuidade = 0;
    $scope.motivobolsa.bolsa_irmao = 0;
    $scope.motivobolsa.perde_bolsa = 0;

    $scope.grupomotivobolsas = {};  
    $scope.error = '';  

    $scope.getGrupoMotivoBolsa = function(){
      $http.get('api/index.php/grupomotivobolsa/0')
      .success(function(data, status, headers, config) {
        $scope.grupomotivobolsas = data.grupo_motivo_bolsa;
      })
      .error(function(data, status, headers, config) { });
    }
    $scope.getGrupoMotivoBolsa();
    
    $scope.cadastrarMotivoBolsa = function(objeto) {

      if ($('#cadastroMotivoBolsa-form').valid()) {
        
         $scope.json = angular.toJson($scope.motivobolsa);
                            
        $http.post('api/index.php/motivobolsa/', $scope.json,{withCredentials: true,headers: {'enctype': 'multipart/form-data' },})
        .success(function(data, status, headers, config) {
           if (data.error == '0')
           {   
              Mensagem.success(data.mensagem);   
              $scope.motivobolsa.id = data.id;
           }
           else
           {
              Mensagem.error(data.mensagem);
           }
        })
        .error(function(data, status) {
         });
      }
    }  

    $scope.getIdMotivoBolsa = function(){
      $http.get('api/index.php/motivobolsa/'+idMotivoBolsa)
        .success(function(data, status, headers, config) {

            $scope.motivobolsa = {};
            $scope.motivobolsa = data.motivo_bolsa[0];
            $scope.grupo = {selected : {"id":$scope.motivobolsa.id_grupo_motivo_bolsa, "descricao":$scope.motivobolsa.descGrupomotivobolsa}};
        })
        .error(function(data, status, headers, config) { }); 
    }  


    if (idMotivoBolsa != undefined) {
      $scope.getIdMotivoBolsa();
    };
 
     /* ************************************************************************************************************************* */
    /* MODAL - Grupo de motivo de bolsa                                                                                          */
    /* ************************************************************************************************************************* */

    $scope.getListaGrupoMotivoBolsa = function(){
      $http.get('api/index.php/grupomotivobolsa/0')
      .success(function(data, status, headers, config) {          
           $scope.grupomotivobolsas = data.motivo_bolsa;
         })
         .error(function(data, status, headers, config) { });
    }

    $scope.verificarAcaoGrupoMotivoBolsa = function(item) {
      if (item.id==-1) {
        $scope.modalNovoGrupoMotivoBolsa();        
      }

      $scope.motivobolsa.id_grupo_motivo_bolsa = item.id;

      $( "em[for='grupo']" ).css("display","none");
    }

    $scope.modalNovoGrupoMotivoBolsa = function(size){
        $('#myModalGrupoMotivoBolsa').modal('show');
    }

    $scope.adicionarGrupoMotivoBolsa = function(){ 
      if ($('#cadastroGrupoMotivoBolsa-form').valid()) {
                
        $scope.addGrupoMotivoBolsa.ativo = 1;
        $scope.json = angular.toJson($scope.addGrupoMotivoBolsa);
                            
        $http.post('api/index.php/grupomotivobolsa/', $scope.json, {withCredentials: true, headers: {'enctype': 'multipart/form-data' },})
        .success(function(data, status, headers, config) {
            if (data.error == '0'){  
                Mensagem.success(data.mensagem);
                
                $('#myModalGrupoMotivoBolsa').modal('hide');
                                
                $scope.getGrupoMotivoBolsa();
                $scope.addGrupoMotivoBolsa = {};
                $scope.grupo.selected = '';
                
            } else {              
              Mensagem.error(data.mensagem);   
            }
        }).error(function(data, status) { });
      }
    }
    /* ************************************************************************************************************************* */

    $scope.novoCadastro = function(){

      $scope.motivobolsa = {};
      $scope.grupo.selected = '';
      $scope.motivobolsa.ativo = 1;
      $scope.motivobolsa.sem_pontualidade = 0;
      $scope.motivobolsa.gratuidade = 0;
      $scope.motivobolsa.bolsa_irmao = 0;
      $scope.motivobolsa.perde_bolsa = 0;

      $scope.grupomotivobolsas = {};
      $scope.getGrupoMotivoBolsa();
    }    

});

//@ sourceURL=controller.formCadastroMotivoBolsa.js