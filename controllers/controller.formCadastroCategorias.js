/*
  Módulo: Mesquita
  Descrição: CRUD Categoria
  Método: GET
  URL: /forms/formCadastroCategorias
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 20/12/2014
  Autor: Ricardo Bruno
  Versão: 1.0
  Data de Alteração: 20/12/2014
 */
smartSig.registerCtrl("formCadastroCategorias", function($scope, $http, $routeParams, Mensagem, $timeout, Permissao){

    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    var idCategoria = $routeParams.id;

    $scope.categoria = {};
    $scope.error = '';  
    $scope.categoria.ativo=1;
    $scope.tipo_lancamento = {};


    $scope.cadastrarCategoria = function(objeto) {      

      if ($('#cadastroCategoria-form').valid()) {

        $scope.json = angular.toJson($scope.categoria);
                            
        $http.post('api/index.php/categoria/', $scope.json, 
                                       {withCredentials: true,
                                       headers: {'enctype': 'multipart/form-data' },
                                       }
        ).success(function(data, status, headers, config) {
           if (data.error == '0')
           {   
              $scope.objeto = {}; 

              Mensagem.success(data.mensagem);   

              $scope.categoria = {};
              $scope.categoria.ativo=1;
           }
           else
           {
              Mensagem.error(data.mensagem);   
           }
        }).error(function(data, status) { 
          
        });
      }

    }  

    $scope.getIdCategoria = function(idCategoria){
      $http.get('api/index.php/categoria/1/'+idCategoria).    
        success(function(data, status, headers, config) {      
          $scope.categoria = data.categoria[0];   

          console.log('categoria', $scope.categoria)                    ;
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }  

    $scope.getTipoLancamento = function(){
      $http.get('api/index.php/tipolancamento/').    
      success(function(data, status, headers, config) {                           
        $scope.tipo_lancamento = data.tipo_lancamento;
        
      }).
      error(function(data, status, headers, config) {
        // log error
      }); 
    }     

    $scope.novoCadastro = function(){
      $scope.categoria = {};
      $scope.categoria.ativo = 1;
    }

    if (idCategoria != undefined) {
      $timeout(function() {
        $scope.getIdCategoria(idCategoria);
      }, 800);      
    };           

    $scope.getTipoLancamento(); 

    

});