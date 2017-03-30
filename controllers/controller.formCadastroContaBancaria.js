/*
  Módulo: Mesquita
  Descrição: CRUD Conta Bancaria
  Método: GET
  URL: /forms/formCadastroContaBancaria
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 20/12/2014
  Autor: Ricardo Bruno
  Versão: 1.0
  Data de Alteração: 20/12/2014
 */
smartSig.registerCtrl("formCadastroContaBancaria", function($scope, $http, $routeParams, Mensagem, $timeout, Permissao){

    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    var idContaBancaria = $routeParams.id;

    $scope.contabancaria = {};
    $scope.campBanco = {};
    $scope.error = '';  
    $scope.contabancaria.ativo=1;
    $scope.tipoconta = {};
    $scope.banco = {};
    $scope.entidade = {};
    $scope.contabancaria.principal=1;

    $scope.verificarAcaoBanco = function(item) {
      $scope.contabancaria.id_banco = item.id;
      $( "em[for='id_banco']" ).css("display","none");    
    }

    $scope.cadastrarContaBancaria = function(confirmar) {
      
      if ($('#cadastroContaBancaria-form').valid()) {
        
        $scope.contabancaria.confirmacao = confirmar;
        
        $scope.json = angular.toJson($scope.contabancaria);
                            
        $http.post('api/index.php/contabancaria/', $scope.json, 
                                       {withCredentials: true,
                                       headers: {'enctype': 'multipart/form-data' },
                                       }
        ).success(function(data, status, headers, config) {
           if (data.error == '0')
           {
            console.log('cadastrarContaBancaria', data);
              if (data.verificar == '1'){
                $.SmartMessageBox({
                  title : "Ops!!!: ",
                  content : "Foi encontrada outra conta classificada como principal! Deseja continuar a alteração?",
                  buttons : "[Sim][Não]",
                  placeholder : ""
                }, function(ButtonPress, Value) {
                  if (ButtonPress == "Sim") {
                    $scope.cadastrarContaBancaria(0);
                    return 0;
                  }else{
                    return 0;  
                  }
                });
              }else{
                Mensagem.success(data.mensagem);   
                
                if (idContaBancaria == undefined) {
                  $scope.contabancaria = {};
                  $scope.contabancaria.ativo=1;
                  $scope.contabancaria.principal=1;

                  $scope.campBanco.selected = '';
                }
              }

           }
           else
           {
              Mensagem.error(data.mensagem);   
           }
        }).error(function(data, status) { 
          
        });
      }

    }  

    $scope.getidContaBancaria = function(){
      $http.get('api/index.php/contabancaria/'+idContaBancaria).    
        success(function(data, status, headers, config) {      
          $scope.contabancaria = data.contabancaria[0];  
          console.log('getidContaBancaria', $scope.contabancaria);
          
          $scope.campBanco = {selected : {"id":$scope.contabancaria.id_banco,"nome":$scope.contabancaria.banco}};        

        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }  

    $scope.getEntidade = function(){

        $http.get('api/index.php/entidade/').    
        success(function(data, status, headers, config) {                           
          $scope.entidade = data.entidade;
          
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }     

    $scope.getBanco = function(){
        $http.get('api/index.php/banco/').    
        success(function(data, status, headers, config) {                           
          $scope.banco = data.banco;
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    } 

    $scope.getTipoConta = function(){
        $http.get('api/index.php/tipoconta/').    
        success(function(data, status, headers, config) {                           
          $scope.tipoconta = data.tipoconta;
          
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }       

    $scope.novoCadastro = function(){
      $scope.contabancaria = {};
      $scope.contabancaria.principal = 1;
      $scope.contabancaria.ativo = 1;

      $scope.campBanco.selected = '';
    }    

    $scope.getEntidade(); 
    $scope.getBanco();
    $scope.getTipoConta();

    if (idContaBancaria != undefined) {
      $timeout(function() {
        $scope.getidContaBancaria(idContaBancaria);
      }, 800);      
    };           

});
//@ sourceURL=controller.formCadastroContaBancaria.js