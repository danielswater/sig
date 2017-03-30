
smartSig.registerCtrl("formCadastroConversoes", function($scope, $http, $routeParams, Mensagem, $timeout, $filter, Permissao){
    

    $scope.permissoes = Permissao.validaPermissao();

    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    $scope.conversao       = {};
    $scope.conversao.ativo = 1; 
    $scope.estados         = {};
    $scope.cidades         = {};
    
    var idConversao = $routeParams.id;

    /* ----------------------------------------------------------------------------------*/
    /* ------------------------------- RELIGIÃO -----------------------------------------*/
    /* ----------------------------------------------------------------------------------*/

    $scope.getReligiao = function(){
      $http.get('api/index.php/religiao/0/')
      .success(function(data, status, headers, config) {
        $scope.religioes = data.religiao;
      })
      .error(function(data, status, headers, config) {});
    }
    $scope.getReligiao();

    $scope.verificar = function(item) {
      if(item.id==-1){
        $scope.modalNovoReligiao();        
      }
      $scope.pessoa.id_religiao = item.id;      
    }

    $scope.modalNovoReligiao = function(size){
      $('#myModalReligiao').modal('show');
    }

    $scope.adicionarReligiao = function(){
      if ($('#cadastroReligiao-form').valid()) {
        $scope.addReligiao.ativo = 1;
        $scope.json = angular.toJson($scope.addReligiao);
        $http.post('api/index.php/religiao/', $scope.json,{withCredentials: true,headers: {'enctype': 'multipart/form-data' },})
        .success(function(data, status, headers, config) {
            if (data.error == '0'){
              Mensagem.success(data.mensagem);
              $('#myModalReligiao').modal('hide');
              $scope.getReligiao();
              $scope.addReligiao = {};
              $scope.religiao.selected={};

            }else{
              Mensagem.error(data.mensagem);
            }
        })
        .error(function(data, status){});
      }
    }
    /* ----------------------------------------------------------------------------------*/

    $scope.getTipoDocumento = function(){
      $http.get('api/index.php/tipodocumento/')
        .success(function(data, status, headers, config) {
          $scope.tiposdocumentos = data;
        })
        .error(function(data, status, headers, config) {});
    }
    $scope.getTipoDocumento();

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

      $http.get('api/index.php/cep/'+$scope.conversao.codigo_postal)
      .success(function(data, status, headers, config) {

        if(data[0].error == -1){
          $scope.error = data[0].mensagem;
          Mensagem.error(data[0].mensagem);
        }
          
        $scope.conversao.cep         = data[0].endereco.cep;
        $scope.conversao.logradouro  = data[0].endereco.logradouro;
        $scope.conversao.bairro      = data[0].endereco.bairro;
        $scope.conversao.estado      = data[0].endereco.estado;
        $scope.conversao.cidade      = data[0].endereco.cidade;
          
        $scope.estados    = data[0].estados;

        var cidades_estado = $filter('filter')(data[0].estados, {uf: $scope.conversao.estado});
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

    $scope.novoCadastro = function(){
      $scope.conversao = {};
      $scope.conversao.ativo = 1;   
      $scope.estados = {};
      $scope.cidades = {};         

      $scope.religiao      = {};
      $scope.tipodocumento = {};
    }

    /* ----------------------------------------------------------------------------------*/
    /* ----------------------------------------------------------------------------------*/

    $scope.getListaCertificado = function(){
      $http.get('api/index.php/certificado/')
      .success(function(data, status, headers, config) {
        $scope.certificados = data.retorno;
      })
      .error(function(data, status, headers, config) {});
    }
    $scope.getListaCertificado();    

    $scope.cadastrar = function(objeto) {

      if ($('#cadastroConversao-form').valid()) {
        
        $scope.json = angular.toJson($scope.conversao);
        $http.post('api/index.php/conversoes/', $scope.json,{withCredentials: true,headers: {'enctype': 'multipart/form-data' },})
                   
        .success(function(data, status, headers, config) {
           if (data.error == '0'){
              $scope.objeto = {};

              Mensagem.success(data.mensagem);
              $scope.conversao.id = data.id;              
           }
           else { Mensagem.error(data.mensagem); }
        })
        .error(function(data, status) { });
      }
    }

    $scope.getIdConversao = function(idConversao){
      $http.get('api/index.php/conversoes/'+idConversao)
        .success(function(data, status, headers, config) {
          
          $scope.conversao.codigo_postal = data.retorno[0].codigo_postal;
          $scope.getCep();

          $scope.conversao = data.retorno[0];   

          $scope.conversao.data_nasc = $scope.conversao.data_nascimento;
          $scope.conversao.data_conv = $scope.conversao.data_conversao ;

          $scope.religiao      = {selected : {"id":$scope.conversao.id_religiao,      "descricao":$scope.conversao.religiao_descricao}};
          $scope.tipodocumento = {selected : {"id":$scope.conversao.id_tipo_documento,"descricao":$scope.conversao.tipodocumento_descricao}};
        })
        .error(function(data, status, headers, config) { });
    }


    if (idConversao != undefined) {
      $timeout(function(){ 

        $scope.getIdConversao(idConversao);

      }, 800);
    };



    $scope.$watch('conversao.data_nascimento', function(){ 
      $scope.conversao.data_nascimento1 = $scope.conversao.data_nascimento;     
      if($scope.conversao.data_nascimento1 != undefined || $scope.conversao.data_nascimento1 != null){    
        $( "em[for='conversao_dataNascimento']" ).css("display","none"); 
      }
    })

    $scope.$watch('conversao.data_conversao', function(){ 
      $scope.conversao.data_conversao1 = $scope.conversao.data_conversao;
      if($scope.conversao.data_conversao1 != undefined || $scope.conversao.data_conversao1 != null){    
        $( "em[for='conversao_dataConversao']" ).css("display","none"); 
      }
    })

    $scope.verificarAcaoReligiao = function(item) {
      $scope.conversao.id_religiao = item.id; 
      $( "em[for='conversao_religiao']" ).css("display","none");
    }

    $scope.verificarAcaoTipoDocumento = function(item) {
      $scope.conversao.id_tipo_documento = item.id; 
      $( "em[for='conversao_tipodocumento']" ).css("display","none");
    }

});

//@ sourceURL=controller.formCadastroConversoes.js