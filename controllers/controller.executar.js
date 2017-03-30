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
smartSig.registerCtrl("executar", function($scope, $location, $http, $routeParams, Mensagem, $timeout, Permissao, $modal){
    $scope.executar = {};

    $scope.cadastrar = function(objeto) {  

      if ($('#cadastroExecutar-form').valid()) {

        $scope.json = angular.toJson(objeto);
                            
        $http.post('api/index.php/executar/', $scope.json, 
                                       {withCredentials: true,
                                       headers: {'enctype': 'multipart/form-data' },
                                       }
        ).success(function(data, status, headers, config) {
           if (data.error == '0')
           {  

              Mensagem.success(data.mensagem);   
           }
           else
           {
              Mensagem.error(data.mensagem);   
           }
        }).error(function(data, status) { 
          
        });
      }

    }  
});