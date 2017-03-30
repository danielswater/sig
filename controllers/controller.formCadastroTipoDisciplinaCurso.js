/*
  Módulo: Escola
  Descrição: CRUD Tipo de Disciplina para Curso
  Método: GET
  URL: /forms/formCadastroTipoDisciplinaCurso
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 19/03/2015
  Autor: THIAGO MALLON
  Versão: 1.0
  Data de Alteração: 19/03/2015
 */
smartSig.registerCtrl("formCadastroTipoDisciplinaCurso", function($scope, $http, $routeParams, Mensagem, $timeout, Permissao){

    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    var idTipoDisciplinaCurso = $routeParams.id;

    $scope.tipodisciplinacurso = {};
    $scope.error = '';  
    $scope.tipodisciplinacurso.ativo=1;
    
    $scope.cadastrarTipoDisciplinaCurso = function(objeto) {      

      if ($('#cadastroTipoDisciplinaCurso-form').valid()) {

        $scope.json = angular.toJson($scope.tipodisciplinacurso);
                            
        $http.post('api/index.php/tipodisciplinacurso/', $scope.json, 
                                       {withCredentials: true,
                                       headers: {'enctype': 'multipart/form-data' },
                                       }
        ).success(function(data, status, headers, config) {


          console.log('cadastro',data);

           if (data.error == '0')
           {   

              Mensagem.success(data.mensagem);   
              $scope.tipodisciplinacurso.id = data.id;              
           }
           else
           {
              Mensagem.error(data.mensagem);   
           }
        }).error(function(data, status) { 
          
        });
      }

    }  

    $scope.getIdTipoDisciplinaCurso = function(){
      $http.get('api/index.php/tipodisciplinacurso/1/'+idTipoDisciplinaCurso).    
        success(function(data, status, headers, config) {

          $scope.tipodisciplinacurso = {};

          $scope.tipodisciplinacurso = data.tipodisciplinacurso[0];  
          
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }  

    if (idTipoDisciplinaCurso != undefined) {
      $scope.getIdTipoDisciplinaCurso();
    };

    $scope.novoCadastro = function(){

      $scope.tipodisciplinacurso = {};
      $scope.tipodisciplinacurso.ativo = 1;

    }

});