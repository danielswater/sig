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
smartSig.registerCtrl("formCadastroSituacaoMatricula", function($scope, $location, $http, $routeParams, Mensagem, $timeout, Permissao, $modal){

    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    var idSituacaoMatricula = $routeParams.id;

    $scope.situacaoMatricula = {};
    $scope.error = '';  
    $scope.situacaoMatricula.ativo = 1;

    //console.log('teste');

    $scope.cadastrarSituacaoMatricula = function() {  

      if ($('#cadastroSituacaoMatricula-form').valid()) {

        $scope.json = angular.toJson($scope.situacaoMatricula);
                            
        $http.post('api/index.php/situacaomatricula/', $scope.json, 
                                       {withCredentials: true,
                                       headers: {'enctype': 'multipart/form-data' },
                                       }
        ).success(function(data, status, headers, config) {
           if (data.error == '0')
           {   
              Mensagem.success(data.mensagem);   
              $scope.situacaoMatricula.id = data.id_situacao_matricula;
           }
           else
           {
              Mensagem.error(data.mensagem);   
           }
        }).error(function(data, status) { 
          
        });
      }

    }  

    $scope.getSituacaoMatricula = function(id){
      $http.get('api/index.php/situacaomatricula/1/'+id).    
        success(function(data, status, headers, config) {      
          $scope.situacaoMatricula = data.situacao_matricula[0];                   
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    } 
       


    $scope.novoCadastro = function(){
      $scope.situacaoMatricula = {};
      $scope.situacaoMatricula.ativo = 1;
    }

    //Busca carregar dados do combo de departamento 

    if (idSituacaoMatricula != undefined) {
      $scope.getSituacaoMatricula(idSituacaoMatricula);
    };  
});