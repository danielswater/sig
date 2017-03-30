/*
  Módulo: Escola
  Descrição: CRUD Tipo Necessidades Especiais
  URL: /escolaforms/formCadastroTipoNecessidadesEspeciais
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 12/02/2015
  Autor: Ricardo Nakadomari
  Versão: 1.0
  Data de Alteração: 12/02/2015
 */
/*aplicação smartSig nome da aplicacao)- conceito maior do angular */
/*com $ é do angular*/
smartSig.registerCtrl("formCadastroTipoNecessidadesEspeciais", function($scope, $http, $routeParams, Mensagem, $timeout, Permissao){

/*início verifica permissão de acesso*/
    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });
/*fim permissãio de acesso*/

/*está armazenando na var o id da rota*/
    var idTipoNecessidadesEspeciais = $routeParams.id;

  /*criando escopo*/
    $scope.tiponecessidadesespeciais = {};
    $scope.error = '';  
  /*obrigando o ativo como 1*/
    $scope.tiponecessidadesespeciais.ativo=1;

/*para criar uma função tem de de ter $scope*/
    $scope.cadastrarTipoNecessidadesEspeciais = function(objeto) {      
/*verifica se o formulário está valido para chamar o serviço*/
      if ($('#cadastroTipoNecessidadesEspeciais-form').valid()) {
/*precisa mandar um json, por isso converte*/
        $scope.json = angular.toJson($scope.tiponecessidadesespeciais);
/*                                        ^inicializa o objeto

http chama um serviço http
*/
        $http.post('api/index.php/tiponecessidadesespeciais/', $scope.json, 
                                       {withCredentials: true,
                                       headers: {'enctype': 'multipart/form-data' },
                                       }
        ).success(function(data, status, headers, config) {
           if (data.error == '0')
           {   
              $scope.objeto = {};

              console.log(data);

              Mensagem.success(data.mensagem);   

              //$scope.tiponecessidadesespeciais = {};
              //$scope.tiponecessidadesespeciais.ativo=1;
              $scope.tiponecessidadesespeciais.id = data.id_tiponecessidadesespeciais;
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
      $scope.tiponecessidadesespeciais = {};
      $scope.tiponecessidadesespeciais.ativo = 1;
    }


    $scope.getIdTipoNecessidadesEspeciais = function(){
      $http.get('api/index.php/tiponecessidadesespeciais/1/'+idTipoNecessidadesEspeciais).    
        success(function(data, status, headers, config) {      
          $scope.tiponecessidadesespeciais = data.tiponecessidadesespeciais[0];   

          console.log($scope.tiponecessidadesespeciais)                    ;
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }  
 

    if (idTipoNecessidadesEspeciais != undefined) {
      $timeout(function() {
        $scope.getIdTipoNecessidadesEspeciais(idTipoNecessidadesEspeciais);
      }, 800);      
    };           

});