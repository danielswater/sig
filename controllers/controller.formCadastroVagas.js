

smartSig.registerCtrl("formCadastroVagas", function($scope, $http, $routeParams, Mensagem, $timeout, Permissao){

    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    var idVaga = $routeParams.id;

    console.log('id vaga', idVaga);

    $scope.multiple = {};    
    $scope.multiple.tags = [];

    $scope.status = {};
    $scope.vagas = {};
    $scope.error = '';  
    $scope.status.ativo=1;
    $scope.vagas.ativo = 1;
    $scope.vagas.tags2 = [];
    var tags = [];


    $scope.cadastrarVaga = function(objeto) {

      $scope.vagas.tags2 = $scope.multiple.tags;

      if ($('#cadastroVagas-form').valid()) {

        $scope.json = angular.toJson(objeto);
                            
        $http.post('api/index.php/vaga/', $scope.json, 
                                       {withCredentials: true,
                                       headers: {'enctype': 'multipart/form-data' },
                                       }
        ).success(function(data, status, headers, config) {
           if (data.error == '0')
           {   
              Mensagem.success(data.mensagem);  
              $scope.vagas.id = data.id_vaga;
           }
           else
           {
              Mensagem.error(data.mensagem);   
           }
        }).error(function(data, status) { 
          
        });
      }

    }  


    $scope.getIdVaga = function(){
      $http.get('api/index.php/vaga/'+idVaga).    
        success(function(data, status, headers, config) {      
          $scope.vagas = data.vagas[0];
          var count = data.vagas[0].tags;
          for(var i = 0; i < count.length; i++){
            tags[i] = data.vagas[0].tags[i]['descricao'];
          }
          $scope.multiple.tags = tags;
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }

        $scope.getStatusVaga = function(){
      $http.get('api/index.php/statusvaga/').    
        success(function(data, status, headers, config) { 
        console.log('GET STATUS VAGA',data);    
          $scope.status = data.statusvaga;
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }

    $scope.getFaixaSalarial = function(){
      $http.get('api/index.php/salariofaixa/').    
        success(function(data, status, headers, config) { 
        console.log('GET FAIXA SALARIAL',data);    
          $scope.faixas = data.faixasalarial;
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }

    $scope.getTipoVaga = function(){
      $http.get('api/index.php/tipovaga/').    
        success(function(data, status, headers, config) { 
        console.log('GET TIPO VAGA',data);    
          $scope.tipovagas = data.tipovaga;
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }

    $scope.getEmpresa = function(){
      $http.get('api/index.php/empresa/').    
        success(function(data, status, headers, config) { 
        console.log('GET EMPRESA',data);    
          $scope.empresas = data.empresa
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }

    $scope.$watch('vagas.data_anuncio', function(){  
      $scope.vagas.data_anuncio1 = $scope.vagas.data_anuncio;     
      if($scope.vagas.data_anuncio1 != undefined || $scope.vagas.data_anuncio1 != null){              
        $( "em[for='data_anuncio']" ).css("display","none"); 
      }
    });

    $scope.$watch('vagas.data_anuncio', function(){  
      $scope.vagas.data_anuncio1 = $scope.vagas.data_anuncio;     
      if($scope.vagas.data_anuncio1 != undefined || $scope.vagas.data_anuncio1 != null){              
        $( "em[for='data_anuncio']" ).css("display","none"); 
      }
    });

    $scope.$watch('vagas.data_fim_anuncio', function(){  
      $scope.vagas.data_fim_anuncio1 = $scope.vagas.data_fim_anuncio;     
      if($scope.vagas.data_fim_anuncio1 != undefined || $scope.vagas.data_fim_anuncio1 != null){              
        $( "em[for='data_fim_anuncio']" ).css("display","none"); 
      }
    });

    $scope.$watch('vagas.data_fim_anuncio', function(){  
      $scope.vagas.data_fim_anuncio1 = $scope.vagas.data_fim_anuncio;     
      if($scope.vagas.data_fim_anuncio1 != undefined || $scope.vagas.data_fim_anuncio1 != null){              
        $( "em[for='data_fim_anuncio']" ).css("display","none"); 
      }
    }); 

    $scope.novoCadastro = function(){
      $scope.vagas.ativo = 1;
      $scope.status.ativo=1;
      $scope.vagas = {};
      $scope.multiple.tags = [];
    }

    if (idVaga != undefined) {
      $timeout(function() {
        $scope.getIdVaga(idVaga);
      }, 800);      
    };

    $scope.getStatusVaga();
    $scope.getFaixaSalarial();
    $scope.getTipoVaga();
    $scope.getEmpresa();
});