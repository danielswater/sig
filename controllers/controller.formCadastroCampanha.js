/*
  Módulo: Mesquita
  Descrição: CRUD Mesquita
  Método: GET
  URL: /forms/formCadastroMesquida
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 18/11/2014
  Autor: Ricardo Bruno
  Versão: 1.0
  Data de Alteração: 18/11/2014
 */
smartSig.registerCtrl("formCadastroCampanha", function($scope, $http, $routeParams, Mensagem, $timeout, Permissao){

    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    var idCampanha = $routeParams.id;

    $scope.campanha = {};
    $scope.error = '';  
    $scope.campanha.ativo=1;

    $scope.cadastrarCampanha = function(objeto) {      

      if ($('#cadastroCampanha-form').valid()) {

        $scope.json = angular.toJson($scope.campanha);
                            
        $http.post('api/index.php/campanha/', $scope.json, 
                                       {withCredentials: true,
                                       headers: {'enctype': 'multipart/form-data' },
                                       }
        ).success(function(data, status, headers, config) {
           if (data.error == '0')
           {   
              $scope.objeto = {}; 

              Mensagem.success(data.mensagem);   

              $scope.campanha = {};
              $scope.campanha.ativo=1;
           }
           else
           {
              Mensagem.error(data.mensagem);   
           }
        }).error(function(data, status) { 
          
        });
      }

    }  

    $scope.getIdCampanha = function(){
      $http.get('api/index.php/campanha/'+idCampanha).    
        success(function(data, status, headers, config) {      
          $scope.campanha = data.campanha[0];  
          console.log('getIdCampanha', $scope.campanha);                     
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }  

    if (idCampanha != undefined) {
      $scope.getIdCampanha();
    };        

    /*Calendario*/
    $scope.open = function($event,opened) {
      $event.preventDefault();
      $event.stopPropagation();

      $scope[opened] = true;
    };   

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd/MM/yyyy', 'shortDate'];
    $scope.format = $scope.formats[2];

    /*Validar datas*/
    $scope.$watch('campanha.data_inicio', function(){  
      $scope.campanha.data_inicio1 = $scope.campanha.data_inicio;     
      if($scope.campanha.data_inicio1 != undefined || $scope.campanha.data_inicio1 != null){              
        $( "em[for='data_inicio']" ).css("display","none"); 
      }
    });

    $scope.$watch('campanha.data_fim', function(){  
      $scope.campanha.data_fim1 = $scope.campanha.data_fim;     
      if($scope.campanha.data_fim1 != undefined || $scope.campanha.data_fim1 != null){              
        $( "em[for='data_fim']" ).css("display","none"); 
      }
    });

    $scope.novoCadastro = function(){
      $scope.campanha = {};
      $scope.campanha.ativo = 1;
    }
});