smartSig.registerCtrl("formCadastroProgramaDoacao", function($scope, $http, $routeParams, Mensagem, $timeout, Permissao){

    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });
    var idProgramaDoacao = $routeParams.id;

    $scope.programaDoacao = {};
    $scope.error = '';  
    $scope.programaDoacao.ativo = 1;

    $scope.cadastrarProgramaDoacao = function(objeto) {      
      console.log('cadastrarProgramaDoacao', objeto);
      if ($('#cadastroProgramaDoacao-form').valid()) {

        $scope.json = angular.toJson(objeto);
                            
        $http.post('api/index.php/programadoacao/', $scope.json, 
                                       {withCredentials: true,
                                       headers: {'enctype': 'multipart/form-data' },
                                       }
        ).success(function(data, status, headers, config) {
           if (data.error == '0')
           {   
              $scope.objeto = {}; 

              Mensagem.success(data.mensagem);   

              $scope.programaDoacao = {};
              $scope.programaDoacao.ativo=1;
           }
           else
           {
              Mensagem.error(data.mensagem);   
           }
        }).error(function(data, status) { 
          
        });
      }

    }  

    $scope.getIdProgramaDoacao = function(){
      $http.get('api/index.php/programadoacao/1/'+idProgramaDoacao).    
        success(function(data, status, headers, config) {      
          $scope.programaDoacao = data.programa_doacao[0];                   
          console.log('getIdProgramaDoacao', $scope.programaDoacao);
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }  

    if (idProgramaDoacao != undefined) {
      $scope.getIdProgramaDoacao();
    }; 


    $scope.open = function($event,opened) {
      $event.preventDefault();
      $event.stopPropagation();

      $scope[opened] = true;
    };   

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd/MM/yyyy', 'shortDate'];
    $scope.format = $scope.formats[2];

    /*Validar datas*/
    $scope.$watch('programaDoacao.data_inicio', function(){  
      $scope.programaDoacao.data_inicio1 = $scope.programaDoacao.data_inicio;     
      if($scope.programaDoacao.data_inicio1 != undefined || $scope.programaDoacao.data_inicio1 != null){              
        $( "em[for='data_inicio']" ).css("display","none"); 
      }
    });

    $scope.$watch('programaDoacao.data_fim', function(){  
      $scope.programaDoacao.data_fim1 = $scope.programaDoacao.data_fim;     
      if($scope.programaDoacao.data_fim1 != undefined || $scope.programaDoacao.data_fim1 != null){              
        $( "em[for='data_fim']" ).css("display","none"); 
      }
    });

    $scope.novoCadastro = function(){
      $scope.programaDoacao = {};
      $scope.programaDoacao.ativo = 1;
    }
});