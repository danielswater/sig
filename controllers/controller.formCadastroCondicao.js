  /*
  Módulo: Escola
  Descrição: CRUD Condicao
  Método: GET
  URL: /gestao/formCadastroCondicao
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 05/04/2015
  Autor: Fabio da Silva
  Versão: 1.0
 */
smartSig.registerCtrl("formCadastroCondicao", function($scope, $location, $http, $routeParams, Mensagem, $timeout, Permissao, $modal, $filter){

    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    var idCondicao = $routeParams.id;

    $scope.condicao = {};

    $scope.addMontar = {};
    $scope.addMontar.formulas = [];
    $scope.valores = {};
    $scope.operadores = [
      {item: '+', descricao: 'Soma', habilita: false},
      {item: '-', descricao: 'Subtração', habilita: false},
      {item: '*', descricao: 'Mutiplicação', habilita: false},
      {item: '/', descricao: 'Divisão', habilita: false},
      {item: '<', descricao: 'Menor que', habilita: false},
      {item: '>', descricao: 'Maior que', habilita: false},
      {item: '=', descricao: 'Igual', habilita: false},
      {item: '(', descricao: 'Abrir parenteses', habilita: true},
      {item: ')', descricao: 'Fechar parenteses', habilita: true}
    ];

    $scope.condicoes = {};
    $scope.tiposcondicoes = {};

    $scope.error = '';  
    
    $scope.montaValores = function(){
      for(var a = 0; a <= 9; a++){
        $scope.valores[a] = {};
        $scope.valores[a].numero = a;
      }
    }

    $scope.selecionarItemFormula = function(){
      $scope.incluirItemFormula($scope.addMontar.notas_cadastradas);
      $scope.addMontar.notas_cadastradas = '';
    }

    $scope.incluirItemFormula = function(valor){
      var num = 100;
      if($scope.addMontar.formulas.length <= num){
        $scope.addMontar.formulas.push(valor);
      }else{
        Mensagem.error("É permitido apenas "+num+" carcteres para a fórmula!"); 
      }
    }

    $scope.removeItemFormula = function(){
      $scope.addMontar.formulas.pop();
    }

    $scope.salvarFormula = function(){
      if($scope.addMontar.formulas.length > 0){
        $scope.condicao.condicao = $scope.addMontar.formulas.join(" ");
        $scope.addMontar.formulas = [];
        $('#myModalMontarFormula').modal('hide'); 
      }else{
        Mensagem.error("A fórmula está invalida!");  
      }
    }

    $scope.cadastrarNota = function() {  
      if ($('#cadastroCondicao-form').valid()) {
        $scope.json = angular.toJson($scope.condicao);
                            
        $http.post('api/index.php/condicao/', $scope.json, 
                                       {withCredentials: true,
                                       headers: {'enctype': 'multipart/form-data' },
                                       }
        ).success(function(data, status, headers, config) {
           if (data.error == '0'){   
              Mensagem.success(data.mensagem);   

              $scope.novoCadastro();
           } else {
              Mensagem.error(data.mensagem);   
           }
        }).error(function(data, status) {
        });
      }
    }  

    $scope.modalMontarFormula = function(){
      console.log('modalMontarFormula', $scope.condicao.condicao);
      if($scope.condicao.condicao != undefined){
        $scope.addMontar.formulas = $scope.condicao.condicao.split(" ");
      }
      $('#myModalMontarFormula').modal('show');        
    }

    $scope.getCondicao = function(){
      $http.get('api/index.php/condicao/'+idCondicao).    
        success(function(data, status, headers, config) {      
          $scope.condicao = data.condicao[0];                   
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    } 


    $scope.getNota = function(){
      $http.get('api/index.php/nota/0/1').    
        success(function(data, status, headers, config) {      
          $scope.notas = data.nota;                   
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }


    $scope.getTipoCondicao = function(){
        $http.get('api/index.php/tipocondicao/').    
        success(function(data, status, headers, config) {                           
          $scope.tiposcondicoes = data.tipo_condicao;
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }       


    $scope.novoCadastro = function(){
      $scope.condicao = {};
      $scope.condicao.tipo = 1;
    }

    //Busca carregar dados do combo de departamento
    $scope.novoCadastro();

    $scope.getTipoCondicao();
    $scope.getNota();

    $scope.montaValores();

    if (idCondicao != undefined) {
      $scope.getCondicao(idCondicao);
    };  
});