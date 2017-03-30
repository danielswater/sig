/*
  Módulo: Escola
  Descrição: CRUD Consulta Duração Fase
  Método: GET
  URL: /consulta/consultaDuracaoFase
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 29/05/2015
  Autor: Fábio Roberto Haydn    
  Versão: 1.0
  */

  smartSig.registerCtrl('consultaDuracaoFase', function($scope, $http, $location, $filter, Permissao, Mensagem) {
    $scope.permissoes = Permissao.validaPermissao();

    $scope.permissoes.then(function (data) {
      $scope.permissoes = data;
    }, function (status) {
      console.log('status',status);
    });

    $scope.duracaofases = [];
    $scope.searchNome = '';

    $scope.getDuracaoFase = function(){
      $http.get('api/index.php/duracaofase/')
      .success(function(data, status, headers, config) {
        if (data.error == 0) {
          $scope.duracaofases = data.duracao_fase;
        };
      })
      .error(function(data, status, headers, config) { });
    }

    $scope.editCadastro = function(id){
      $location.path('/escolaforms/formCadastroDuracaoFase/1/'+id)
    }
    
    $scope.currentPage = 1;
    $scope.pageSize = 10;

    $scope.sort = {
      active: 'nome',
      descending: undefined
    }

    $scope.excluirCadastro = function(id){
      console.log("id", id);
      $scope.duracaofases.id = id;
      $scope.json = angular.toJson($scope.duracaofases.id);

      $http.post('api/index.php/delduracaofase/', $scope.json,
        {withCredentials: true,
          headers: {'enctype': 'multipart/form-data' },
        })
      .success(function(data, status, headers, config) {
        Mensagem.success(data.mensagem);
        $scope.getDuracaoFase();
      })
      .error(function(data, status, headers, config) {
        Mensagem.error('Erro na exclusão de fase');
      });
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

    $scope.getDuracaoFase();
  });

//@ sourceURL=controller.consultaDuracaoFase.js