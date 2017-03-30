/*
  Módulo: Escola
  Descrição: CRUD Texto Grupo Ocorrência
  URL: /gestao/formCadastroTextoGrupoOcorrência
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 26/02/2015
  Autor: Hamzi Jalel
  Versão: 1.0
  Data de Alteração: 13/03/2015
  Autor: Luciano Almeida
 */
smartSig.registerCtrl("formCadastroTextoGrupoOcorrencia", function($scope, $http, $routeParams, Mensagem, $timeout, Permissao){
    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    var idTextoGrupoOcorrencia = $routeParams.id;

    $scope.textogrupoocorrencia = {};
    $scope.grupoocorrencia = {};
    $scope.ocorrencia = {};
    $scope.error = '';  
    $scope.textogrupoocorrencia.ativo=1;

    $scope.getGrupoOcorrencia = function(){
        $http.get('api/index.php/grupoocorrencia').    
          success(function(data, status, headers, config) {                           
            $scope.grupoocorrencia = data.grupoocorrencia;
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    } 

    $scope.getIdTextoGrupoOcorrencia = function(){
      $http.get('api/index.php/textogrupoocorrencia/1/'+idTextoGrupoOcorrencia).    
        success(function(data, status, headers, config) {      
          $scope.textogrupoocorrencia = data.textogrupoocorrencia[0]; 
          $scope.ocorrencia = {selected : {"id":$scope.textogrupoocorrencia.id_grupo_ocorrencia,"descricao":$scope.textogrupoocorrencia.descricao_grupo_ocorrencia}};
          $scope.textogrupoocorrencia.ocorrencia = $scope.textogrupoocorrencia.id_grupo_ocorrencia;
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }

    $scope.cadastrarTextoGrupoOcorrencia = function(objeto) {
      if ($('#cadastroTextoGrupoOcorrencia-form').valid()) {
        $scope.json = angular.toJson($scope.textogrupoocorrencia);
        $http.post('api/index.php/textogrupoocorrencia/', $scope.json, 
                   {withCredentials: true,
                     headers: {'enctype': 'multipart/form-data' },
                   }
        ).success(function(data, status, headers, config) {

          console.log('DATA CADASTRAR:',data);

           if (data.error == '0'){   
              //$scope.objeto = {}; 

              Mensagem.success(data.mensagem);   

              $scope.textogrupoocorrencia.id = data.id;

           }
           else{
              Mensagem.error(data.mensagem);   
           }
        }).error(function(data, status) { 
          // log error
        });
      }
    }  
    
    $scope.verificarAcao = function(item) {
      if (item.id==-1) {
        $scope.modalNovoGrupo();
        $scope.ocorrencia.selected = '';
      }

      $scope.textogrupoocorrencia.id_grupo_ocorrencia = item.id;

      $( "em[for='ocorrencia']" ).css("display","none");    
    }

    $scope.modalNovoGrupo = function(size){
        $('#myModal').modal('show');        
    }

    $scope.adicionarGrupo = function(){ 
      if ($('#cadastroGrupo-form').valid()) {
        $scope.addGrupo.descricao = $scope.addGrupo.descricao;
        $scope.addGrupo.ativo = 1;
        $scope.json = angular.toJson($scope.addGrupo);
                            
        $http.post('api/index.php/grupoocorrencia/', $scope.json, 
                   {withCredentials: true,
                     headers: {'enctype': 'multipart/form-data' },
                   }
        ).success(function(data, status, headers, config) {
            if (data.error == '0'){  
                Mensagem.success(data.mensagem);    
                
                $('#myModal').modal('hide');    

                $scope.getGrupoOcorrencia();
                $scope.addGrupo = {};
            } else {              
              Mensagem.error(data.mensagem);   
            }
        }).error(function(data, status) { 
          // log error
        });
      }
    }

    $scope.novoTextoGrupoOcorrencia = function(){
      $scope.textogrupoocorrencia = {};
      $scope.grupoocorrencia = {};
      $scope.ocorrencia = {};
      $scope.textogrupoocorrencia.ativo=1;
    }

    //Inicializa Combos
    $scope.getGrupoOcorrencia();

    if (idTextoGrupoOcorrencia != undefined) {
      $timeout(function() {
        $scope.getIdTextoGrupoOcorrencia(idTextoGrupoOcorrencia);
      }, 800);      
    };           
    
});