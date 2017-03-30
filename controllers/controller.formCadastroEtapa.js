
/*
  Módulo: Escola
  Descrição: CRUD Consulta etapa
  Método: GET
  URL: /consulta/consultaEtapa
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 25/02/2015
  Autor: Daniel Swater
  Data de Alteração: 13/03/2015
  Autor: Luciano Almeida
  Versão: 1.0
*/

smartSig.registerCtrl("formCadastroEtapa", function($scope, $http, $routeParams, Mensagem, $timeout, Permissao){

    $scope.permissoes = Permissao.validaPermissao();

    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    var idEtapa = $routeParams.id;

    $scope.etapa = {};
    $scope.error = '';
    $scope.etapa.ativo=1;
    $scope.ciclo = {};
    $scope.situacao_etapa = {};

    $scope.open = function($event,opened) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope[opened] = true;
    };

    $scope.disabled = function(date, mode) {
      return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
    };

    $scope.toggleMin = function() {
      $scope.minDate = $scope.minDate ? null : new Date();
    };

    $scope.toggleMin();

    $scope.open = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.opened = true;
    };

    $scope.dateOptions = {
      formatYear: 'yy',
      startingDay: 1,
      language: 'pt-BR',
    };

    $scope.initDate = new Date();
    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd','yyyy/MM', 'dd/MM/yyyy', 'shortDate'];
    $scope.format = $scope.formats[2];

    $scope.cadastrarEtapa = function(objeto) {
      if ($('#cadastroEtapa-form').valid()) {
        $scope.json = angular.toJson($scope.etapa);
                            
        $http.post('api/index.php/etapa/', $scope.json,
                   {withCredentials: true,
                    headers: {'enctype': 'multipart/form-data' },
                   }
                   
        ).success(function(data, status, headers, config) {
           if (data.error == '0'){
              $scope.objeto = {};

              Mensagem.success(data.mensagem);
              $scope.etapa.ativo=1;
              $scope.etapa.id = data.id_etapa;
           }
           else {
              Mensagem.error(data.mensagem);
           }
        }).error(function(data, status) {

        });
      }
    }

    $scope.novoCadastro = function(){
      $scope.etapa = {};
      $scope.etapa.ativo = 1;
    }

    $scope.getCiclo = function(){
      $http.get('api/index.php/ciclo/1').
        success(function(data, status, headers, config) {
          $scope.ciclo = data.retorno;
        }).
        error(function(data, status, headers, config) {
          // log error
        });
    }

    $scope.getSituacaoEtapa = function(){
      $http.get('api/index.php/etapasituacao/').
        success(function(data, status, headers, config) {
          $scope.situacao_etapa = data.situacao_etapa;
          console.log("situacao_etapa",$scope.situacao_etapa);
        }).
        error(function(data, status, headers, config) {
          // log error
        });
    }

    $scope.getIdEtapa = function(idEtapa){
      $http.get('api/index.php/etapa/1/'+idEtapa).
        success(function(data, status, headers, config) {
          $scope.etapa = data.etapa[0];
          console.log('ID ETAPA',$scope.etapa);
        }).
        error(function(data, status, headers, config) {
          // log error
        });
    }

    $scope.$watch('etapa.data_inicio', function(){  
      $scope.etapa.data_inicio1 = $scope.etapa.data_inicio;     
      if($scope.etapa.data_inicio1 != undefined || $scope.etapa.data_inicio1 != null){              
        $( "em[for='data_inicio']" ).css("display","none"); 
      }
    });  
    
    $scope.$watch('etapa.data_fim', function(){  
      $scope.etapa.data_fim1 = $scope.etapa.data_fim;     
      if($scope.etapa.data_fim1 != undefined || $scope.etapa.data_fim1 != null){              
        $( "em[for='data_fim']" ).css("display","none"); 
      }
    });        

    if (idEtapa != undefined) {
      $timeout(function() {
        $scope.getIdEtapa(idEtapa);
      }, 800);
    };

    //Carrega os combos
    $scope.getCiclo();
    $scope.getSituacaoEtapa();
});