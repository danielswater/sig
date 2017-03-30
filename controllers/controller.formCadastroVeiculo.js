
/*
  Módulo: Escola
  Descrição: CRUD Cadastro de Veículos
  Método: GET
  URL: /escolaforms/formCadastroVeiculo
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 29/05/2015
  Autor: Fábio Roberto Haydn
  Versão: 1.0
*/

smartSig.registerCtrl("formCadastroVeiculo", function($scope, $http, $routeParams, Mensagem, $timeout, Permissao, $filter){    

    $scope.permissoes = Permissao.validaPermissao();

    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    $scope.veiculo         = {};
    $scope.caminho  = {};    
    
    $scope.veiculo.ativo   = 1; 
    $scope.motoristas      = [];
    $scope.motorista       = [];
    $scope.selMotoristas   = [];
    $scope.showMotorista   = false;

    var idVeiculo = $routeParams.id;
    
    /* ----------------------------------------------------------------------------------*/
    /* Funções para seleção de Motorista                                                 */
    /* ----------------------------------------------------------------------------------*/
    $scope.getListaMotoristas_IdVeiculo = function(id_veiculo){
       $http.get('api/index.php/veiculomotorista/0/'+id_veiculo)
       .success(function(data, status, headers, config) {
  
          if (data.error == '0'){

            angular.forEach(data.veiculo, function(value, key) {
              $scope.getMotorista_ID(value.id_motorista)
            });
          }
       }).error(function(data, status, headers, config) { });
    } 

    $scope.getMotorista_ID = function(id){
       $http.get('api/index.php/motorista/'+id)
       .success(function(data, status, headers, config) {

          if (data.error == '0')
          { 
              $scope.selMotoristas.push(data.motorista[0]); 
          }
       }).error(function(data, status, headers, config) { });
    }

    $scope.getMotorista = function(){
       $http.get('api/index.php/motorista')
       .success(function(data, status, headers, config) {
          
          $scope.motoristas = data.motorista;          
       })
       .error(function(data, status, headers, config) { });
    } 
    $scope.getMotorista();


    $scope.refreshMotorista = function(motorista){
      $http.get('api/index.php/stringmotorista')
      .success(function(data, status, headers, config){
        if(data[0].error != -1){
          
          angular.forEach(data, function(value, key) {
            angular.forEach(motorista, function(value2, key2) {
              if(value.id == value2.id){
                $scope.selMotoristas.push(data[key]);
              }
            });
          });
        }
      }).error(function(data, status, headers, config) { });
    };
    
    $scope.excluirMotorista = function(indexEl, item) {

      $scope.objMotoExcluir = {};
      $scope.objMotoExcluir.id_veiculo = $scope.veiculo.id;
      $scope.objMotoExcluir.id_motorista = item.id;

      $scope.json = angular.toJson($scope.objMotoExcluir);
      $http.post('api/index.php/delveiculomotorista/', $scope.json, {withCredentials: true, headers: {'enctype': 'multipart/form-data' },})

      .success(function(data, status, headers, config) {        
        $scope.selMotoristas.splice(indexEl, 1);

      }).error(function(data, status, headers, config) { });
    }

    $scope.salvarMotorista = function(itemParm) {
      
      $scope.rep = $filter('filter')($scope.selMotoristas, {'id': itemParm.id});
      if($scope.rep.length == 0){ 

        $scope.objMotoSalvar = {};
        $scope.objMotoSalvar.id_veiculo = $scope.veiculo.id;
        $scope.objMotoSalvar.id_motorista = itemParm.id;

        $scope.json = angular.toJson($scope.objMotoSalvar);

        $http.post('api/index.php/veiculomotorista/', $scope.json,{withCredentials: true, headers: {'enctype': 'multipart/form-data' },})   
        .success(function(data, status, headers, config) {
       
            if($scope.files != null){ $scope.uploadFileVeiculo($scope.files, data.id); };
            $scope.selMotoristas.push(itemParm);            
            Mensagem.success(data.mensagem);            

        }).error(function(data, status, headers, config) { });

      }else{ Mensagem.error('Motorista já cadastrado!'); }

      $scope.item.selected = '';
    }

    /* ----------------------------------------------------------------------------------*/
    /* Funções para cadastro do veículo                                                  */
    /* ----------------------------------------------------------------------------------*/
    
    $scope.setPathUpload = function(files) {

      var fd = new FormData();
      file = files.files[0];
      if(file){ 
       
        fd.append("file", file);
      }

      $('#foto_veiculo1').val(file.name);

      $http.post('api/index.php/uploadfileveiculo/', fd, { withCredentials: true, headers: {'Content-Type': undefined }, transformRequest: angular.identity })
      .success(function(data, status, headers, config){
        
        $scope.veiculo.foto_veiculo = data.caminho;         
      })
      .error(function(data, status){ });
    };
    
    $scope.cadastrarVeiculo = function(objeto) {
      if ($('#cadastroVeiculo-form').valid()){

        $scope.json = angular.toJson($scope.veiculo);
        $http.post('api/index.php/veiculo/', $scope.json,{withCredentials: true,headers: {'enctype': 'multipart/form-data' },})

        .success(function(data, status, headers, config) {
           if (data.error == '0'){
              $scope.objeto = {};

              Mensagem.success(data.mensagem);
              $scope.veiculo.id = data.id_veiculo;
              $scope.showMotorista = true;

           }
           else { Mensagem.error(data.mensagem); }
        })
        .error(function(data, status) { });
      }
    }    

    $scope.novoCadastro = function(){
      $scope.veiculo = {};
      $scope.veiculo.ativo = 1;
      $scope.showMotorista = false;
      $scope.selMotoristas.length=0;
    }

    $scope.getIdVeiculo = function(idVeiculo){
      $http.get('api/index.php/veiculo/'+idVeiculo)
        .success(function(data, status, headers, config) {
          
          $scope.veiculo = data.veiculo[0];          
          $scope.getListaMotoristas_IdVeiculo($scope.veiculo.id);
          $scope.showMotorista = true;           
          $('#foto_veiculo1').val($scope.veiculo.foto_veiculo);
          /*
          nomeArq = $scope.veiculo.foto_veiculo.split("/");
          $('#foto_veiculo1').val(nomeArq[nomeArq.length-1]);
          */
        })
        .error(function(data, status, headers, config) { });
    }

    if (idVeiculo != undefined) {
      $timeout(function(){ 

        $scope.getIdVeiculo(idVeiculo);

      }, 800);
    };

});

//@ sourceURL=controller.formCadastroVeiculo.js