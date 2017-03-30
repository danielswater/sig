/*
  Módulo: Mesquita
  Descrição: CRUD Categoria de Não Associado
  Método: GET
  URL: /forms/formCadastroCategoriaNaoAssociado
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 20/01/2015
  Autor: Ricardo Bruno
  Versão: 1.0
  Data de Alteração: 20/01/2015
 */
smartSig.registerCtrl("formCadastroCategoriaNaoAssociado", function($scope, $http, $routeParams, Mensagem, $timeout, Permissao){

    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    var idCategoria = $routeParams.id;

    $scope.categoria = {};
    $scope.error = '';  
    $scope.categoria.ativo = 1;
    $scope.categoria.tipo = 1;
    $scope.categoria.pronome_tratamento = false;
    $scope.categoria.documento = false;

    $scope.cadastrarCategoriaNaoAssociado = function(objeto) {      

      if ($('#cadastroCategoriaNaoAssociado-form').valid()) {

        $scope.json = angular.toJson($scope.categoria);
                            
        $http.post('api/index.php/categorianaoassociado/', $scope.json, 
                                       {withCredentials: true,
                                       headers: {'enctype': 'multipart/form-data' },
                                       }
        ).success(function(data, status, headers, config) {
           if (data.error == '0')
           {   
              $scope.objeto = {}; 

              Mensagem.success(data.mensagem);   

              $scope.categoria = {};
              $scope.categoria.ativo = 1;
              $scope.categoria.tipo = 1;
              $scope.categoria.pronome_tratamento = false;
              $scope.categoria.documento = false;
           }
           else
           {
              Mensagem.error(data.mensagem);   
           }
        }).error(function(data, status) { 
          
        });
      }

    }  

   /* $scope.getIdCategoria = function(){
      $http.get('api/index.php/categoria/1/'+idCategoria).    
        success(function(data, status, headers, config) {      
          $scope.categoria = data.categoria[0];   

          console.log($scope.categoria)                    ;
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }  */

    $scope.getIdCategoriaNaoAssociado = function(){
      $http.get('api/index.php/categorianaoassociado/1/'+idCategoria).    
        success(function(data, status, headers, config) {      
          $scope.categoria = data.categoria[0];   

          $scope.categoria.tipo = $scope.categoria.tipo_valor;

          console.log($scope.categoria)                    ;
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }     

    if (idCategoria != undefined) {
      $timeout(function() {
        $scope.getIdCategoriaNaoAssociado(idCategoria);
      }, 800);      
    };           


    $scope.novoCadastro = function(){
      $scope.categoria = {};
      $scope.categoria.ativo = 1;
    }

});