/*
  Módulo: Mesquita
  Descrição: CRUD Função
  Método: GET
  URL: /financeiro/consultaGastosReceitas
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 12/05/2015
  Autor: Fabio da Silva
  Versão: 1.0
 */
smartSig.registerCtrl('consultaGastosReceitas', function($scope, $http, $location, $filter, filterFilter, $timeout, Permissao, $routeParams, Mensagem) {
    $scope.permissoes = Permissao.validaPermissao();
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    $scope.statusGastoReceitas = {};

    $scope.despesasReceitas = [
      {"key":"Despesas","x":1,"y":50},
      {"key":"Receitas","x":2,"y":50}
    ];

    $scope.detalhes = {};

    $scope.despesas = {};

    $scope.historicos = [];

    allEventoItem = [{
      tipo: "Todos os Eventos",
      allDay: false,
      className: "bg-color-red",
      data_cadastro: "",
      data_evento: "",
      data_evento_formatada: "",
      datadeinicio: "",
      datadetermino: "",
      description: "Selecionar Todos",
      end: "",
      evento_lista: {},
      horadeinicio: "",
      horadetermino: "",
      icon: "",
      id: "",
      id_departamento: "",
      id_tipo_evento: "",
      start: "",
      title: "Selecionar Todos",
      url: "",
      valor: ""
    }];
    
    $scope.eventos = [];
    $scope.evento = [];
    $scope.evento = {selected : {"id": '',"title": allEventoItem[0].title}};        

    $scope.searchNome = '';

    $scope.getEvento = function(){
      $http.get('api/index.php/evento/').    
      success(function(data, status, headers, config) {
        $scope.eventos = allEventoItem.concat(data);
        console.log('getEvento', $scope.eventos);
      }).error(function(data, status, headers, config) {
       // log error
      });
    }

  
    $scope.filtroReceitas = function(item) {
      if(item.id_tipo_lancamento == 1 || item.id_tipo_lancamento == 7){
        return item;  
      }
    }

    $scope.somaReceitas = function(itens) {
      var soma = 0;
      $filter('filter')(itens, function(str){
        if(str.id_tipo_lancamento == 1 || str.id_tipo_lancamento == 7){
          soma = parseFloat(soma) + parseFloat(str.valor);  
        }
      });
      return soma;
    }    

    $scope.somaDespesa = function(itens) {
      var soma = 0;
      $filter('filter')(itens, function(str){
        if(str.id_tipo_lancamento == 2 || str.id_tipo_lancamento == 3 || str.id_tipo_lancamento == 5){  
          soma = parseFloat(soma) + parseFloat(str.valor);  
        }
      });
      return soma;
    }

    $scope.filtroDespesas = function(item) {
      if(item.id_tipo_lancamento == 2 || item.id_tipo_lancamento == 3 || item.id_tipo_lancamento == 5){
        return item;  
      }
    }

    $scope.statusGastosReceitas = function() {
      console.log('statusGastosReceitas', $scope.buscar);

      if ($('#buscarGastosReceitas-form').valid()){
        $scope.json = angular.toJson($scope.buscar);

        $http.post('api/index.php/statusgastoreceitas/', $scope.json, 
          {withCredentials: true,
            headers: {'enctype': 'multipart/form-data' },
          }
        ).success(function(data, status, headers, config) {
          console.log('teste', data[0]);
          if (data[0].error != -1){
            $scope.despesasReceitas = data[0].despesa_receita;
            $scope.detalhes = data[0].detalhe;
            $scope.historicos = data[0].historico;
          } else {
            Mensagem.error(data[0].mensagem); 
          }

          $scope.statusGastoReceitas = data[0];
        }).error(function(data, status) {
          // log error
        });
      }      
    }

    $scope.verificarAcaoEvento = function(item) {
      $scope.buscar.id_evento = item.id;
      $scope.buscar.data_inicio = '';
      $scope.buscar.data_fim = '';
      $( "em[for='id_evento']" ).css("display","none");    
    }

    $scope.xFunction = function(){
      return function(d) {
          return d.key;
      };
    }

    $scope.yFunction = function(){
      return function(d) {
          return d.y;
      };
    }

    $scope.toolTipContentFunction = function(){
      return function(key, y, x, e, graph) {
        return  '<div style="margin: 10px;">' + 
                  '<h1>' + 
                      key + 
                  '</h1>' +
                  '<div style="text-align: center;">' +
                      y + '% <br />' +
                      'R$ ' + x.point.x +
                  '</div>' +
                '</div>'
      }
    }

    $scope.xAxisTickFormatFunction = function(){
    return function(d){
        return d3.format(',f')(new Number(d));
    }
  }

  $scope.tooltipUsuarios = function(){
    return function (key, y, e, graph) {
        var pessoas = "";
        // console.log(key, y, e, graph)
        $scope.historico
        angular.forEach($scope.historico[0].pessoas['2015-03'], function(value, key) {
          // console.log(value, key);
          pessoas+=value.nome+"<br>";
        });

        console.log('pessoas', pessoas);

        var content = '<h3 style="background-color: ';
        content += e.color + '">';
        content += key + '</h3><p>' +  y + '</p>';
        content += '<p>' +  pessoas + '</p>';
        return content;
    }
  }

    /*$scope.$watch("buscar.id_evento", function(q){
      if($scope.buscar.id_evento != ''){
        $scope.buscar.data_inicio = '';
        $scope.buscar.data_fim = '';
      }
    });*/

    $scope.$watch("searchNome", function(q){
      console.log(q);
    });

    $scope.getEvento();
    //$scope.getDespesasReceitas();
});