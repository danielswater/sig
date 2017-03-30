/*
  Módulo: Mesquita
  Descrição: CRUD Departamento
  Método: GET
  URL: /forms/formCadastroDepartamento
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 27/11/2014
  Autor: Ricardo Bruno
  Versão: 1.0
  Data de Alteração: 27/11/2014
 */
smartSig.registerCtrl("formCadastroDepartamento", function($scope, $http, $routeParams, Mensagem, $timeout, Permissao){

    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    var idDepartamento = $routeParams.id;

    console.log(idDepartamento);


    $scope.departamento = {};
    $scope.error = '';  
    $scope.departamento.ativo=1;
    $scope.socio = {};
    $scope.sociosSel = [];    

    $scope.cadastrarDepartamento = function(objeto) {      

      if ($('#cadastroDepartamento-form').valid()) {

        $scope.json = angular.toJson($scope.departamento);
                            
        $http.post('api/index.php/departamento/', $scope.json, 
                                       {withCredentials: true,
                                       headers: {'enctype': 'multipart/form-data' },
                                       }
        ).success(function(data, status, headers, config) {
           if (data.error == '0')
           {   

              Mensagem.success(data.mensagem);   

              $scope.departamento.id = data.id_departamento;

              SalvarDepartamento.disabled=true;
           }
           else
           {
              Mensagem.error(data.mensagem);   
           }
        }).error(function(data, status) { 
          
        });
      }

    }  

    $scope.getIdDepartamento = function(){
      $http.get('api/index.php/departamento/'+idDepartamento).    
        success(function(data, status, headers, config) {      
          $scope.departamento = data.departamento[0];   

          if (data.departamento[0].sociosSel[0].error != -1) {          
            $scope.sociosSel = data.departamento[0].sociosSel;   
          } 
          
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }  

    if (idDepartamento != undefined) {
      $scope.getIdDepartamento();
    };        

    

    

    $scope.refreshSocios = function(objeto) {
      var params = {objeto: objeto, sensor: false};
      if (objeto.length < 0) {
        objeto = "a";
      };
      return $http.get('api/index.php/stringpessoa?associado=1&string='+objeto,
        {params: params}
      ).then(function(response) {
          //console.log(response.data['pessoa'])
          $scope.socios = response.data['pessoa']
      });
    };

    $scope.salvarSocios = function(item) {
      var itemMatches = false; 
      
      item.id_departamento = $scope.departamento.id;
      $scope.json = angular.toJson(item);

      if ($scope.sociosSel.length > 0) {

        $scope.sociosSel.forEach(function(items) {               

          if (items.id == item.id) {
            itemMatches = true;

            Mensagem.error("Integrante já adicionado no departamento!"); 
          };

        });     
      };

      if (itemMatches == false) {
          $http.post('api/index.php/integrantedepartamento/', $scope.json, 
                                     {withCredentials: true,
                                     headers: {'enctype': 'multipart/form-data' },
                                     }
          ).success(function(data, status, headers, config) {                 
              
              $scope.sociosSel.push(item);
                          
          }).
          error(function(data, status, headers, config) {
            // log error
          }); 
          //   
      };
         
    }

    $scope.excluirSocios = function(indexEl, item) {
      
      $scope.json = angular.toJson(item);
            
      $http.post('api/index.php/delintegrante/', $scope.json, 
                                     {withCredentials: true,
                                     headers: {'enctype': 'multipart/form-data' },
                                     // transformRequest: angular.identity
                                     }
      ).success(function(data, status, headers, config) {    
        $scope.sociosSel.splice(indexEl, 1);                 
      }).
      error(function(data, status, headers, config) {
        // log error
      }); 
      //      
    }    

    $scope.novoCadastro = function(){
      $scope.departamento = {};
      $scope.departamento.ativo = 1;
    }

});