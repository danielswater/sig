  /*
  Módulo: Mesquita
  Descrição: CRUD Bens
  Método: GET
  URL: /gestao/formCadastroBens
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 08/01/2014
  Autor: Fabio da Silva
  Versão: 1.0
  Data de Alteração: 15/03/2015
  Autor: Ricardo S. Nakadomari
  Adição do campo de Departamento
 */
smartSig.registerCtrl("formCadastroNota", function($scope, $location, $http, $routeParams, Mensagem, $timeout, Permissao, $modal, $filter){

    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    var idNota = $routeParams.id;

    $scope.nota = {};
    $scope.nota.nota_informada = 1;

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
    $scope.arredondamentos = {};

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
        $scope.nota.formula = $scope.addMontar.formulas.join(" ");
        $scope.addMontar.formulas = [];
        $('#myModalMontarFormula').modal('hide'); 
      }else{
        Mensagem.error("A fórmula está invalida!");  
      }
    }

    $scope.cadastrarNota = function() {  

      if ($('#cadastroNota-form').valid()) {

        $scope.json = angular.toJson($scope.nota);
                            
        $http.post('api/index.php/nota/', $scope.json, 
                                       {withCredentials: true,
                                       headers: {'enctype': 'multipart/form-data' },
                                       }
        ).success(function(data, status, headers, config) {
           if (data.error == '0')
           {   
              Mensagem.success(data.mensagem);   
              
              $scope.getNotaInformada();
              
              $scope.novoCadastro();
           }
           else
           {
              Mensagem.error(data.mensagem);   
           }
        }).error(function(data, status) { 
          
        });
      }
    }  

    $scope.modalMontarFormula = function(){
      console.log('modalMontarFormula', $scope.nota.formula);
      if($scope.nota.formula != undefined){
        $scope.addMontar.formulas = $scope.nota.formula.split(" ");
      }
      $('#myModalMontarFormula').modal('show');        
    }

    $scope.getCondicao = function(){
      $http.get('api/index.php/condicao/').    
        success(function(data, status, headers, config) {      
          $scope.condicoes = data.condicao;                   
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    } 

    $scope.getNota = function(id){
      $http.get('api/index.php/nota/'+id).    
        success(function(data, status, headers, config) {      
          $scope.nota = data.nota[0];                   
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }

    $scope.getNotaInformada = function(){
      $http.get('api/index.php/nota/').    
      success(function(data, status, headers, config) {    
      
        tmp = $filter('filter')(data.nota, function(value) { if(!value.formula){ return value; }});      
        $scope.notasInformadas = tmp; 
        
      }).
      error(function(data, status, headers, config) {
          // log error
        }); 
    }

    $scope.getArredondamento = function(){
        $http.get('api/index.php/arredondamento/1/').    
        success(function(data, status, headers, config) {                           
          $scope.arredondamentos = data.arredondamento;
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }       


    $scope.novoCadastro = function(){
      $scope.nota = {};
      $scope.nota.ativo = 1;
      $scope.nota.recuperacao = 0;
      $scope.nota.nota_informada = 1;
    }

    //*** Arredondamento ***********************************************************
    $scope.arredondamento_tratar = function(valor){
      v = {};
      v.interio = Math.trunc(valor);
      v.decimais = valor - v.interio;
      v.decimais = parseFloat(v.decimais.toFixed(2));
      return v;
    }

    $scope.arredondamento_normal_casa_decimos = function(valor){
      num = $scope.arredondamento_tratar(valor);
      valor = Math.round(num.decimais * 10)/10 + num.interio;

      return valor.toFixed(2);
    }

    $scope.arredondamento_maior_casa_decimos = function(valor){
      num = $scope.arredondamento_tratar(valor);
      valor = Math.ceil(num.decimais * 10)/10 + num.interio;

      return valor.toFixed(2);
    }

    $scope.arredondamento_normal_intervalos_0_50 = function(valor){
      num = $scope.arredondamento_tratar(valor);

      if(num.decimais < parseFloat(0.25) && num.decimais >= parseFloat(0.00)) {
        valor = num.interio;
      }else if(num.decimais < parseFloat(0.75) && num.decimais >= parseFloat(0.25)) {
        valor = num.interio + parseFloat(0.50);
        valor = valor;
      }else if(num.decimais >= parseFloat(0.75)) {
        valor = num.interio + parseFloat(1);
        valor = valor;
      }

      return valor.toFixed(2);
    }

    $scope.arredondamento_maior_intervalos_0_50 = function(valor){
      num = $scope.arredondamento_tratar(valor);

      if(num.decimais < parseFloat(0.50) && num.decimais >= parseFloat(0.00)) {
        valor = num.interio + parseFloat(0.50);
      }else{
        valor = num.interio + parseFloat(1.00);
      }

      return valor.toFixed(2);
    }

    $scope.arredondamento_menor_intervalos_0_50 = function(valor){
      num = $scope.arredondamento_tratar(valor);

      if(num.decimais < parseFloat(0.50) && num.decimais >= parseFloat(0.00)) {
        valor = num.interio;
      }else{
        valor = num.interio + parseFloat(0.50);
      }

      return valor.toFixed(2);
    }

    $scope.arredondamento_trunca = function(valor){
      num = $scope.arredondamento_tratar(valor);
      valor = Math.trunc(num.decimais * 10)/10 + num.interio;
      
      return valor.toFixed(2);
    }

    $scope.arredondamento_normal_inteiro = function(valor){
      valor = Math.round(valor);

      return valor.toFixed(2);
    }


    $scope.arredondamento_intervalos_0_25 = function(valor){
      num = $scope.arredondamento_tratar(valor);

      if(num.decimais <= parseFloat(0.25) && num.decimais >= parseFloat(0.00)) {
        valor = num.interio.toFixed(2);
      }else if(num.decimais <= parseFloat(0.75) && num.decimais > parseFloat(0.25)) {
        valor = num.interio + parseFloat(0.50);
        valor = valor.toFixed(2);
      }else if(num.decimais > parseFloat(0.75)) {
        valor = num.interio + parseFloat(1);
        valor = valor.toFixed(2);
      }

      return valor;
    }

    $scope.calcularArredondamento = function(id, valor){
      switch(id) {
          case '1':
              valor = $scope.arredondamento_normal_casa_decimos(valor);
              break;
          case '2':
              valor = $scope.arredondamento_normal_intervalos_0_50(valor);
              break;
          case '3':
            valor = $scope.arredondamento_trunca(valor);
            break;
          case '4':
            valor = $scope.arredondamento_maior_intervalos_0_50(valor);
            break;
          case '5':
            valor = $scope.arredondamento_menor_intervalos_0_50(valor);
            break;
          case '6':
            valor = $scope.arredondamento_normal_inteiro(valor);
            break;
          case '7':
            valor = $scope.arredondamento_maior_casa_decimos(valor);
            break;
          case '8':
            valor = $scope.arredondamento_intervalos_0_25(valor);
            break;
      }

      console.log('calcularArredondamento id', id);
      console.log('calcularArredondamento valor', valor);

      return valor;
    }
    //*** Fim - arredondamento ***********************************************************

    //Busca carregar dados do combo de departamento
    $scope.novoCadastro();

    $scope.getArredondamento();
    $scope.getCondicao();
    $scope.montaValores();
    $scope.getNotaInformada();

    if (idNota != undefined) {
      $scope.getNota(idNota);
    };  
});
//@ sourceURL=controller.formCadastroNota.js