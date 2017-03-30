/*
  Módulo: Escola
  Descrição: CRUD Tipo de Receita
  Método: GET
  URL: /forms/formCadastroTipoReceita
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 22/05/2015
  Autor: Fábio Roberto Haydn
  Versão: 1.0  
 */
smartSig.registerCtrl("formCadastroTipoReceita", function($scope, $http, $routeParams, Mensagem, $timeout, Permissao){

    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    var idTipoReceita = $routeParams.id;

    $scope.centro = [];
    $scope.tiporeceita = {};    
    $scope.tiporeceita.ativo=1;
    $scope.tiporeceita.compoe_anuidade = 1;
    $scope.centros = {};  
    $scope.error = '';  


    $scope.getCentroCusto = function(){
      $http.get('api/index.php/consultacentrocusto/0')
      .success(function(data, status, headers, config) {
        $scope.centros = data.centro_custo;
      })
      .error(function(data, status, headers, config) { });
    }
    
    $scope.cadastrarTipoReceita = function(objeto) {

      if ($('#cadastroTipoReceita-form').valid()) {
        
         $scope.json = angular.toJson($scope.tiporeceita);
                            
        $http.post('api/index.php/tiporeceita/', $scope.json,{withCredentials: true,headers: {'enctype': 'multipart/form-data' },})
        .success(function(data, status, headers, config) {
           if (data.error == '0')
           {   
              Mensagem.success(data.mensagem);   
              $scope.tiporeceita.id = data.id;
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

    $scope.getIdTipoReceita = function(){
      $http.get('api/index.php/tiporeceita/1/'+idTipoReceita)
        .success(function(data, status, headers, config) {

            $scope.tiporeceita = {};
            $scope.tiporeceita = data.tiporeceita[0];
            $scope.centro = {selected : {"id":$scope.tiporeceita.id_centro_custo, "descricao":$scope.tiporeceita.descricao_centro_custo}};
        })
        .error(function(data, status, headers, config) { }); 
    }  

    /* ************************************************************************************************************************* */
    /* MODAL - Centro de Custo                                                                                                   */
    /* ************************************************************************************************************************* */

    $scope.getListaDepartamentoFuncionarios = function(){
      $http.get('api/index.php/deptofuncionarios/1/')
      .success(function(data, status, headers, config) {          
           $scope.departamentos = data.departamentos;    
         })
         .error(function(data, status, headers, config) { });
    }

    $scope.verificarAcaoCentroCusto = function(item) {
      if (item.id==-1) {
        $scope.modalNovoCentroCusto();
        $scope.getListaDepartamentoFuncionarios();
      }

      $scope.tiporeceita.id_centro_custo = item.id;

      $( "em[for='centro']" ).css("display","none");    
    }

    $scope.modalNovoCentroCusto = function(size){
        $('#myModalCentroCusto').modal('show');
    }

    $scope.adicionarCentroCusto = function(){ 
      if ($('#cadastroCentroCusto-form').valid()) {
                
        $scope.addCentroCusto.ativo = 1;
        $scope.json = angular.toJson($scope.addCentroCusto);
                            
        $http.post('api/index.php/centrocusto/', $scope.json, {withCredentials: true, headers: {'enctype': 'multipart/form-data' },})
        .success(function(data, status, headers, config) {
            if (data.error == '0'){  
                Mensagem.success(data.mensagem);    
                
                $('#myModalCentroCusto').modal('hide');    
                                
                $scope.getCentroCusto();
                $scope.addCentroCusto = {};
                $scope.centro.selected = '';               
                
            } else {              
              Mensagem.error(data.mensagem);   
            }
        }).error(function(data, status) { });
      }
    }
    /* ************************************************************************************************************************* */


    if (idTipoReceita != undefined) {
      $scope.getIdTipoReceita();
    };
 

    $scope.novoCadastro = function(){
      $scope.tiporeceita = {};
      $scope.tiporeceita.ativo = 1;
      $scope.tiporeceita.compoe_anuidade = 1;
      $scope.centros = {};
      $scope.getCentroCusto();
      $scope.centro.selected = '';
    }

    //Inicializa Combos
    $scope.getCentroCusto();
    

});

//@ sourceURL=controller.formCadastroTipoReceita.js