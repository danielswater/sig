/*
  Módulo: Escola
  Descrição: CRUD Feriado
  URL: /gestao/formCadastroFeriado
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 27/02/2015
  Autor: Hamzi Jalel
  Versão: 1.0
  Data de Alteração: 27/02/2015
 */
 
smartSig.registerCtrl("formCadastroFeriado", function($scope, $http, $routeParams, Mensagem, $timeout, Permissao){

    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });  

    var idFeriado = $routeParams.id;

    $scope.feriado = {};
    $scope.error = '';  
    $scope.feriado.ativo=true;

    $scope.cadastrarFeriado = function(objeto) {    


      if ($('#cadastroFeriado-form').valid()) {

        $scope.json = angular.toJson($scope.feriado);

        console.log('JSON:',$scope.json);
                            
        $http.post('api/index.php/feriado/', $scope.json, 
                                       {withCredentials: true,
                                       headers: {'enctype': 'multipart/form-data' },
                                       }
        ).success(function(data, status, headers, config) {

          console.log('DATA:',data);         

           if (data.error == '0')
           {   
              $scope.objeto = {}; 
  
              Mensagem.success(data.mensagem);  

              //$scope.feriado = {};
              //$scope.feriado.ativo=1;
              $scope.feriado.id = data.id_feriado;

           }
           else
           {
              Mensagem.error(data.mensagem);   
           }
        }).error(function(data, status) { 
          
        });
      }

    }

    $scope.novoCadastro = function(){
      $scope.feriado = {};
      $scope.feriado.ativo = 1;
    }
    
    $scope.getIdFeriado = function(){
      $http.get('api/index.php/feriado/1/'+idFeriado).    
        success(function(data, status, headers, config) {      
          $scope.feriado = data.feriado[0];   

          console.log('hamzi',$scope.feriado);

        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }

    /*Calendario*/
    $scope.open = function($event,opened) {
      $event.preventDefault();
      $event.stopPropagation();

      $scope[opened] = true;
    };   

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd/MM/yyyy', 'shortDate'];
    $scope.format = $scope.formats[2];

    /*Validar datas*/
    $scope.$watch('feriado.data_feriado', function(){  
      $scope.feriado.data_feriado1 = $scope.feriado.data_feriado;     
      if($scope.feriado.data_feriado1 != undefined || $scope.feriado.data_feriado1 != null){              
        $( "em[for='data_feriado']" ).css("display","none"); 
      }
    });

    /*
    
      $scope.$watch('campanha.data_fim', function(){  
        $scope.campanha.data_fim1 = $scope.campanha.data_fim;     
        if($scope.campanha.data_fim1 != undefined || $scope.campanha.data_fim1 != null){              
          $( "em[for='data_fim']" ).css("display","none"); 
        }
      }); 
    
    */


    if (idFeriado != undefined) {
      $timeout(function() {

        $scope.getIdFeriado(idFeriado);

      }, 800);      
    };           
    
});