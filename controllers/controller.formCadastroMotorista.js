

/*
  Módulo: Escola
  Descrição: CRUD Cadastro Duração de Fase
  Método: GET
  URL: /escolaforms/formCadastroMotorista
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 29/05/2015
  Autor: Fábio Roberto Haydn
  Versão: 1.0
*/

smartSig.registerCtrl("formCadastroMotorista", function($scope, $http, $routeParams, Mensagem, $timeout, $filter, Permissao){
    

    $scope.permissoes = Permissao.validaPermissao();

    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    $scope.motorista       = {};
    $scope.motorista.ativo = 1; 
    $scope.estados = {};
    $scope.cidades = {};
    
    var idMotorista = $routeParams.id;

    /* ----------------------------------------------------------------------------------*/

    $scope.getEstado = function(){

       $http.get('api/index.php/estado/')
       .success(function(data, status, headers, config) {                 
          $scope.estados = data;
       })
       .error(function(data, status, headers, config) {  });         
    }  
    $scope.getEstado();

    $scope.getCep = function(){

      $scope.estados = {};
      $scope.cidades = {};

      $http.get('api/index.php/cep/'+$scope.motorista.codigo_postal)
      .success(function(data, status, headers, config) {

        if(data[0].error == -1){
          $scope.error = data[0].mensagem;
          Mensagem.error(data[0].mensagem);
        }
          
        $scope.motorista.cep         = data[0].endereco.cep;
        $scope.motorista.logradouro  = data[0].endereco.logradouro;
        $scope.motorista.bairro      = data[0].endereco.bairro;
        $scope.motorista.estado      = data[0].endereco.estado;
        $scope.motorista.cidade      = data[0].endereco.cidade;
          
        $scope.estados    = data[0].estados;

        var cidades_estado = $filter('filter')(data[0].estados, {uf: $scope.motorista.estado});
        $scope.cidades = cidades_estado[0].cidades;        

      })
      .error(function(data, status, headers, config) { });
    }

    $scope.getCidade = function(uf){
       $http.get('api/index.php/cidade/'+uf)
       .success(function(data, status, headers, config) {                           
          $scope.cidades = data;
       })
       .error(function(data, status, headers, config) { });
    }  

    $scope.setPathUpload = function(files) {

      var fd = new FormData();
      file = files.files[0];
      if(file){ 
       
        fd.append("file", file);
      }

      $('#foto1').val(file.name);

      $http.post('api/index.php/uploadfilemotorista/', fd, { withCredentials: true, headers: {'Content-Type': undefined }, transformRequest: angular.identity })
      .success(function(data, status, headers, config){
        
        $scope.motorista.foto = data.caminho;         
      })
      .error(function(data, status){ });
    };

    $scope.cadastrarMotorista = function(objeto) {
      if ($('#cadastroMotorista-form').valid()) {
              
        $scope.json = angular.toJson($scope.motorista);                            
        $http.post('api/index.php/motorista/', $scope.json,{withCredentials: true,headers: {'enctype': 'multipart/form-data' },})
                   
        .success(function(data, status, headers, config) {
           if (data.error == '0'){
              $scope.objeto = {};

              Mensagem.success(data.mensagem);
              $scope.motorista.id = data.id;              
           }
           else { Mensagem.error(data.mensagem); }
        })
        .error(function(data, status) { });
      }
    }

    $scope.novoCadastro = function(){
      $scope.motorista = {};
      $scope.motorista.ativo = 1;   
      $scope.estados = {};
      $scope.cidades = {};         
    }

    $scope.getIdMotorista = function(idMotorista){
      $http.get('api/index.php/motorista/'+idMotorista)
        .success(function(data, status, headers, config) {
          
          $scope.motorista.codigo_postal = data.motorista[0].codigo_postal;
          $scope.getCep();
          $scope.motorista = data.motorista[0];
          $('#foto1').val($scope.motorista.foto);
          /*
          nomeArq = $scope.motorista.foto.split("/");
          $('#foto1').val(nomeArq[nomeArq.length-1]);
          */
        })
        .error(function(data, status, headers, config) { });
    }


    if (idMotorista != undefined) {
      $timeout(function(){ 

        $scope.getIdMotorista(idMotorista);

      }, 800);
    };



});

//@ sourceURL=controller.formCadastroMotorista.js