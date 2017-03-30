/*
  Módulo: Escola
  Descrição: CRUD Grupo Ocorrência
  URL: /gestao/formCadastroGrupoOcorrência
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 16/02/2015
  Autor: Hamzi Jalel
  Versão: 1.0
  Data de Alteração: 16/02/2015
 */
 
smartSig.registerCtrl("formCadastroGrupoOcorrencia", function($scope, $http, $routeParams, Mensagem, $timeout, Permissao){

    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    //console.log('hamzi',$routeParams);    

    var idGrupoOcorrencia = $routeParams.id;

    $scope.grupoocorrencia = {};
    $scope.error = '';  
    $scope.grupoocorrencia.ativo=1;
    $scope.grupoocorrencia.aviso=false;
    $scope.grupoocorrencia.confidencial=false;
    $scope.grupoocorrencia.financeiro=false;
    $scope.grupoocorrencia.internet=false;
    $scope.grupoocorrencia.pedagogico=false;
    $scope.grupoocorrencia.quiosque=false;

    $scope.cadastrarGrupoOcorrencia = function(objeto) {

      if ($('#cadastroGrupoOcorrencia-form').valid()) {

        $scope.json = angular.toJson($scope.grupoocorrencia);
                            
        $http.post('api/index.php/grupoocorrencia/', $scope.json, 
                                       {withCredentials: true,
                                       headers: {'enctype': 'multipart/form-data' },
                                       }
        ).success(function(data, status, headers, config) {         

           if (data.error == '0')
           {   
              $scope.objeto = {};

              console.log(data); 
  
              Mensagem.success(data.mensagem);  

              //$scope.grupoocorrencia = {};
              $scope.grupoocorrencia.ativo=1;  
              $scope.grupoocorrencia.id = data.id_grupoocorrencia;            

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
      $scope.grupoocorrencia = {};
      $scope.grupoocorrencia.ativo = 1;
      $scope.grupoocorrencia.aviso=false;
              $scope.grupoocorrencia.confidencial=false;
              $scope.grupoocorrencia.financeiro=false;
              $scope.grupoocorrencia.internet=false;
              $scope.grupoocorrencia.pedagogico=false;
              $scope.grupoocorrencia.quiosque=false;
    }

    
    $scope.getIdGrupoOcorrencia = function(){
      $http.get('api/index.php/grupoocorrencia/1/'+idGrupoOcorrencia).    
        success(function(data, status, headers, config) {      
          $scope.grupoocorrencia = data.grupoocorrencia[0];   

          console.log('hamzi',$scope.grupoocorrencia);

        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }  
 

    if (idGrupoOcorrencia != undefined) {
      $timeout(function() {
        $scope.getIdGrupoOcorrencia(idGrupoOcorrencia);
      }, 800);      
    };           
    
});