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
  Data de Alteração: 08/01/2014
  */
  smartSig.registerCtrl("formCadastroDoacao", function($scope, $http, $routeParams, Mensagem, $filter, $timeout, Permissao, $modal){ 

    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
      $scope.permissoes = data;
    }, function (status) {
      console.log('status',status);
    });
    
    $scope.showCadastroRapido=false;
    $scope.doacao = {};
    //$scope.doacao.id_selected = '';
    
    $scope.doacao.id = $routeParams.id;

    $scope.addDoacao = {};
    $scope.addDoacao.ativo = 1;
    $scope.addMovimentacaoDoacao = {};
    $scope.addMovimentacaoDoacao.tipo_entrada = 1;
    $scope.entidade = {};
    $scope.progDoacao = []; 
    $scope.programaDoacao = []; 
    $scope.tipoDoacao = []; 
    $scope.tipoDeDoacao = []; 
    $scope.statusDoacao = []; 
    $scope.id_categoria = [];
    $scope.statusDeDoacao = []; 
    $scope.localDoacao = [];
    $scope.id_centro_custo = []; 
    $scope.localDeDoacao = [];

    $scope.movStatusDoacao = {};
    $scope.movLocalDoacao = {};
    $scope.movDoador = {};
    $scope.movDoadoPara = {};

    $scope.movimentacaoDoacao = [];

    $scope.addProgramaDoacao = {}; 

    $scope.doador = {};

    $scope.movimentacao_quant = [];
    $scope.movimentacao_quant.entrada = 0;
    $scope.movimentacao_quant.saida = 0;
    $scope.movimentacao_quant.estoque = 0;

    $scope.addDoacao.tipo_de_doacao = 1;

    $scope.moeda = {};

    $scope.categorias = [];

    $scope.centro_custo = [];

    $scope.contabancaria = [];

    $scope.addCategoria = {};
    $scope.addCentroCusto = {};

    $scope.departamentos_funcionarios = [];

    $scope.addDoacao.id_pessoa = {};

    $scope.getDoador = function(){
      $http.get('api/index.php/carregapessoa/16')      
      .success(function(data, status, headers, config) {
        $scope.doadores = data.pessoa;
      })
      .error(function(data, status, headers, config) {
          // log error
        }); 
    };
    $scope.getDoador();

   $scope.getEvento = function(){
      $http.get('api/index.php/evento/')
      .success(function(data, status, headers, config) {
          $scope.eventos  = data;
      })
      .error(function(data, status, headers, config) { });
    };
    $scope.getEvento();

    $scope.getPessoa = function(){
      $http.get('api/index.php/carregapessoa/6').        
      success(function(data, status, headers, config) {                           
        $scope.pessoa = data.pessoa;
      }).
      error(function(data, status, headers, config) {
          // log error
        }); 
    };

    $scope.getContaBancaria = function(){
      $http.get('api/index.php/contabancaria/').    
      success(function(data, status, headers, config) {
        if (data.error == 0) {
          
          if($scope.showCadastroRapido){
            var conta = $filter('filter')(data.contabancaria, {'principal': 1});
            $scope.addDoacao.id_conta_bancaria = conta[0].id;
          }

          $scope.contabancaria  = data.contabancaria;
        };  
      }).
      error(function(data, status, headers, config) { return false; });
    };

    $scope.getEntidade = function(){
      $http.get('api/index.php/entidade/').    
      success(function(data, status, headers, config) {                           
        $scope.entidade = data.entidade;

      }).
      error(function(data, status, headers, config) {
          // log error
        }); 
    };

    $scope.getProgDoacao = function(){
      $http.get('api/index.php/programadoacao/0/').        
      success(function(data, status, headers, config) {                           
        $scope.programaDoacao = data.programa_doacao;
      }).
      error(function(data, status, headers, config) {
          // log error
        }); 
    };

    $scope.getTipoDoacao = function(){
      $http.get('api/index.php/tipodoacao/0/').        
      success(function(data, status, headers, config) {                           
        $scope.tipoDeDoacao = data.tipo_doacao;
      }).
      error(function(data, status, headers, config) {
          // log error
        }); 
    };

    $scope.getCategoria = function(){
      $http.get('api/index.php/categoria/7').    
      success(function(data, status, headers, config) {    
        if (data.error == 0) {
          
          if($scope.showCadastroRapido){ 
            data.categoria.splice(0, 1); 
          }

          $scope.categorias = data.categoria;          
        }                              
      }).
      error(function(data, status, headers, config) {
        // log error
      });
    };

    $scope.verificarAcaoPrograma = function(item) {
      if (item.id==-1) {
        $scope.modalNovoPrograma();
        $scope.progDoacao.selected = '';
      }
      $scope.addDoacao.progDoacao = item.id;
      $( "em[for='progDoacao']" ).css("display","none");    
    };

    $scope.modalNovoPrograma = function(size){
      $('#myModalPrograma').modal('show');        
    };

    $scope.adicionarProgramaDoacao = function(){
      if ($('#cadastroProgramaDoacao-form').valid()) {

        $scope.addProgramaDoacao.ativo = 1;

        $scope.json = angular.toJson($scope.addProgramaDoacao);

        $http.post('api/index.php/programadoacao/', $scope.json, 
         {withCredentials: true,
           headers: {'enctype': 'multipart/form-data' },
         }
         ).success(function(data, status, headers, config) {
          if (data.error == '0'){  

            Mensagem.success(data.mensagem);    

            $('#myModalPrograma').modal('hide');    

            $scope.getProgDoacao(); 

            $scope.addProgramaDoacao = {};
          }else{              
            Mensagem.error(data.mensagem);   
          }
        }).error(function(data, status) { 

        });
      }
    };

    $scope.adicionarCategoria = function(){

      if ($('#cadastroCategoria-form').valid()) {

        $scope.addCategoria.id_tipo_lancamento = 7;
        $scope.addCategoria.ativo = 1;

        $scope.json = angular.toJson($scope.addCategoria);

        $http.post('api/index.php/categoria/', $scope.json, 
         {withCredentials: true,
           headers: {'enctype': 'multipart/form-data' },
         }
         ).success(function(data, status, headers, config) {
          if (data.error == '0'){  

            Mensagem.success(data.mensagem);    

            $('#myModalCategoria').modal('hide');

            $scope.getCategoria();

            $scope.addCategoria = {};
          }else{              
            Mensagem.error(data.mensagem);   
          }
        }).error(function(data, status) { 

        });
      }
    };

    $scope.verificarAcaoTipo = function(item) {
      if (item.id==-1) {
        $scope.modalNovoTipo();
        $scope.tipoDoacao.selected = '';
      }
      $scope.addDoacao.tipoDoacao = item.id;
      $( "em[for='tipoDoacao']" ).css("display","none");    
    };

    $scope.modalNovoTipo = function(size){
      $('#myModalTipo').modal('show');        
    };

    $scope.adicionarTipoDoacao = function(){
      if ($('#cadastroTipoDoacao-form').valid()) {

        $scope.addTipoDoacao.ativo = 1;

        $scope.json = angular.toJson($scope.addTipoDoacao);

        $http.post('api/index.php/tipodoacao/', $scope.json, 
         {withCredentials: true,
           headers: {'enctype': 'multipart/form-data' },
         }
         ).success(function(data, status, headers, config) {
          if (data.error == '0'){  

            Mensagem.success(data.mensagem);    

            $('#myModalTipo').modal('hide');    

            $scope.getTipoDoacao(); 

            $scope.addTipoDoacao = {};
          }else{              
            Mensagem.error(data.mensagem);   
          }
        }).error(function(data, status) { 

        });
      }
    };  

    $scope.getStatusDoacao = function(){
      $http.get('api/index.php/statusdoacao/0/').        
      success(function(data, status, headers, config) {                           
        $scope.statusDeDoacao = data.status_doacao;        
      }).
      error(function(data, status, headers, config) {
          // log error
        }); 
    };

    $scope.verificarAcaoMovStatus = function(item) {
      if (item.id==-1) {
        $scope.modalNovoStatus();
        $scope.movStatusDoacao.selected = '';
      }
      $scope.addMovimentacaoDoacao.statusDoacao = item.id;
      $( "em[for='movStatusDoacao']" ).css("display","none");    
    };

    $scope.verificarAcaoStatus = function(item) {
      if (item.id==-1) {
        $scope.modalNovoStatus();
        $scope.statusDoacao.selected = '';
      }
      $scope.addDoacao.statusDoacao = item.id;
      $( "em[for='statusDoacao']" ).css("display","none");    
    };

    $scope.verificarCategorias = function(item) {
      if (item.id==-1) {
        $scope.modalNovaCategoria();
        $scope.categoria.selected = '';
      }
      $scope.addDoacao.id_categoria = item.id;
      $( "em[for='categoria']" ).css("display","none");    
    };     

    $scope.modalNovoStatus = function(size){
      $('#myModalStatus').modal('show');        
    };

    $scope.modalNovaCategoria = function(size){
      $('#myModalCategoria').modal('show');        
    };

    $scope.modalNovoCentroCusto = function(size){
      $('#myModalCentroCusto').modal('show');        
    };

    $scope.adicionarStatusDoacao = function(){
      if ($('#cadastroStatusDoacao-form').valid()) {

        $scope.addStatusDoacao.ativo = 1;

        $scope.json = angular.toJson($scope.addStatusDoacao);

        $http.post('api/index.php/statusdoacao/', $scope.json, 
         {withCredentials: true,
           headers: {'enctype': 'multipart/form-data' },
         }
         ).success(function(data, status, headers, config) {
          if (data.error == '0'){  

            Mensagem.success(data.mensagem);    

            $('#myModalStatus').modal('hide');    

            $scope.getStatusDoacao(); 

            $scope.addStatusDoacao = {};
          }else{              
            Mensagem.error(data.mensagem);   
          }
        }).error(function(data, status) { 

        });
      }
    };      

    $scope.getLocalDoacao = function(){
      $http.get('api/index.php/localarmazenamentodoacao/0/').        
      success(function(data, status, headers, config) {                           
        $scope.localDeDoacao = data.local_armazenamento_doacao;        
      }).
      error(function(data, status, headers, config) {
          // log error
        }); 
    };

    $scope.verificarAcaoLocal = function(item) {
      if (item.id==-1) {
        $scope.modalNovoLocal();
        $scope.localDoacao.selected = '';
      }
      $scope.addDoacao.localDoacao = item.id;
      $( "em[for='localDoacao']" ).css("display","none");    
    };

    $scope.verificarCentroCusto = function(item) {
      if (item.id==-1) {
        $scope.modalNovoCentroCusto();
        $scope.centro_custo.selected = '';
      }
      $scope.addDoacao.id_centro_custo = item.id;
      $( "em[for='centro_custo']" ).css("display","none");    
    };

    $scope.verificarAcaoMovLocal = function(item) {
      if (item.id==-1) {
        $scope.modalNovoLocal();
        $scope.movLocalDoacao.selected = '';
      }
      $scope.addMovimentacaoDoacao.localDoacao = item.id;
      $( "em[for='movLocalDoacao']" ).css("display","none");    
    };

    $scope.modalNovoLocal = function(size){
      $('#myModalLocal').modal('show');        
    };


    $scope.adicionarLocalDoacao = function(){
      if ($('#cadastroLocalDoacao-form').valid()) {

        $scope.addLocalDoacao.ativo = 1;

        $scope.json = angular.toJson($scope.addLocalDoacao);

        $http.post('api/index.php/localarmazenamentodoacao/', $scope.json, 
         {withCredentials: true,
           headers: {'enctype': 'multipart/form-data' },
         }
         ).success(function(data, status, headers, config) {
          if (data.error == '0'){  

            Mensagem.success(data.mensagem);    

            $('#myModalLocal').modal('hide');

            $scope.getLocalDoacao(); 

            $scope.addLocalDoacao = {};
          }else{              
            Mensagem.error(data.mensagem);   
          }
        }).error(function(data, status) { 

        });
      }
    };      

    $scope.verificarAcaoDoadorDoacao = function(item) {
      if (item.id==-1) {
        $scope.tipoDoacao.selected = '';
      }
      $scope.addDoacao.doadorDoacao = item.id;
      $( "em[for='doadorDoacao']" ).css("display","none");    
    };

    $scope.verificarAcaoDoador = function(item) {
      console.log('verificarAcaoDoador', item);
      $scope.addDoacao.idDoador = item.id;
      $( "em[for='doador']" ).css("display","none");    
    };

    $scope.verificarAcaoMovDoadoPara = function(item) {
      $scope.addMovimentacaoDoacao.idDoadoPara = item.id;
      $( "em[for='movDoadoPara']" ).css("display","none");    
    };

    $scope.verificarAcaoMovDoador = function(item) {
      $scope.addMovimentacaoDoacao.idDoador = item.id;
      $( "em[for='movDoador']" ).css("display","none");    
    };

    $scope.$watch('addDoacao.data_validade', function(){  
      $scope.addDoacao.data_validade1 = $scope.addDoacao.data_validade;     
      if($scope.addDoacao.data_validade1 != undefined || $scope.addDoacao.data_validade1 != null){              
        $( "em[for='data_validade']" ).css("display","none"); 
      }
    }); 

    $scope.$watch('addMovimentacaoDoacao.data_movimentacao', function(){  
      $scope.addMovimentacaoDoacao.data_movimentacao1 = $scope.addMovimentacaoDoacao.data_movimentacao;     
      if($scope.addMovimentacaoDoacao.data_movimentacao1 != undefined || $scope.addMovimentacaoDoacao.data_movimentacao1 != null){              
        $( "em[for='data_movimentacao']" ).css("display","none"); 
      }
    });    

    $scope.$watch('addProgramaDoacao.data_inicio', function(){  
      $scope.addProgramaDoacao.data_inicio1 = $scope.addProgramaDoacao.data_inicio;     
      if($scope.addProgramaDoacao.data_inicio1 != undefined || $scope.addProgramaDoacao.data_inicio1 != null){              
        $("em[for='data_inicio']").css("display","none"); 
      }
    });  

    $scope.$watch('addProgramaDoacao.data_fim', function(){  
      $scope.addProgramaDoacao.data_fim1 = $scope.addProgramaDoacao.data_fim;     
      if($scope.addProgramaDoacao.data_fim1 != undefined || $scope.addProgramaDoacao.data_fim1 != null){              
        $( "em[for='data_fim']" ).css("display","none"); 
      }
    });

    $scope.cadastrarDoacao = function(){
      //console.log("DOAÇÃO", $scope.addDoacao);
      //return;
      $scope.addDoacao.id = $scope.doacao.id;

      $scope.addDoacao.id_pessoa = $scope.addDoacao.idDoador;

      if ($('#cadastroDoacao-form').valid()) {        

        if($scope.addDoacao.tipo_de_doacao == 1){

          $scope.json = angular.toJson($scope.addDoacao);
          $http.post('api/index.php/doacao/', $scope.json, 
           {withCredentials: true,
             headers: {'enctype': 'multipart/form-data' },
           }
           ).success(function(data, status, headers, config) {
            if (data.error == '0'){  

              Mensagem.success(data.mensagem);    

              $scope.doacao.id = data.id_doacao;

              $scope.getMovimentacaoDoacao();
            }else{              
              Mensagem.error(data.mensagem);   
            }
          }).error(function(data, status) { 

          });

        }else if($scope.addDoacao.tipo_de_doacao == 0){

          $scope.addDoacao.id_situacao = 6;
          $scope.addDoacao.id_tipo_lancamento = 7;
          $scope.addDoacao.id_forma_pagamento = 4;
          
          $scope.addDoacao.data_vencimento = $scope.addDoacao.data_validade;
                    
          $scope.json = angular.toJson($scope.addDoacao);
          $http.post('api/index.php/movimentacao/', $scope.json, 
           {withCredentials: true,
             headers: {'enctype': 'multipart/form-data' },
           }
           ).success(function(data, status, headers, config) {
            if (data.error == '0'){  

              Mensagem.success(data.mensagem);
              $scope.doacao.id = data.id_doacao;

              $scope.novoCadastro($scope.addDoacao.tipo_de_doacao);
             
            }else{              
              Mensagem.error(data.mensagem);   
            }
          }).error(function(data, status) { 

          });

        }else if($scope.addDoacao.tipo_de_doacao == 2){

          $scope.json = angular.toJson($scope.addDoacao);
          $http.post('api/index.php/doacao/', $scope.json, {withCredentials: true, headers: {'enctype': 'multipart/form-data' },})
          .success(function(data, status, headers, config) {
            if (data.error == '0'){  

              Mensagem.success(data.mensagem);
              //$scope.doacao.id = data.id_doacao;
              $scope.addDoacao.valor = '';

            }else{

              Mensagem.error(data.mensagem);   
            }
          })
          .error(function(data, status) {});

        }
      }
    };

    $scope.cadastrarMovimentacaoDoacao = function(){
      $scope.addMovimentacaoDoacao.id_doacao = $scope.doacao.id;

        if ($('#cadastroMovimentacaoDoacao-form').valid()) {

          if(!$scope.proc){

            $scope.proc = true;

            if($scope.addMovimentacaoDoacao.tipo_entrada == 0 && $scope.addMovimentacaoDoacao.quantidade > $scope.movimentacao_quant.estoque){
              Mensagem.error("A quantidade de saida é maior que estoque!");   
              $scope.proc = false;
            }else if($scope.addMovimentacaoDoacao.tipo_entrada == 1 && $scope.addMovimentacaoDoacao.localDoacao == ''){
              Mensagem.error("Em caso de tipo entrada, o campo Local de Armazenamento de Doação é obrigatorio!");   
              $scope.proc = false;
            }else{
              $scope.json = angular.toJson($scope.addMovimentacaoDoacao);

              $http.post('api/index.php/addmovimentacaodoacao/', $scope.json, 
               {withCredentials: true,
                 headers: {'enctype': 'multipart/form-data' },
               }
               ).success(function(data, status, headers, config) {

                $scope.proc = false;

                if (data.error == '0'){  
                  
                  Mensagem.success(data.mensagem);    

                  $scope.getMovimentacaoDoacao();

                  $scope.addMovimentacaoDoacao = {};
                  $scope.addMovimentacaoDoacao.tipo_entrada = 1;

                  $scope.movStatusDoacao = {};
                  $scope.movLocalDoacao = {};
                  $scope.movDoador = {};
                  $scope.movDoadoPara = {};

                }else{              
                  Mensagem.error(data.mensagem);   
                }
              }).error(function(data, status) { $scope.proc = false; });
            }
          }
        }      
    };

    $scope.getMovimentacaoDoacao = function(){
      if($scope.doacao.id){
        $http.get('api/index.php/movimentacaodoacao/'+$scope.doacao.id).    
        success(function(data, status, headers, config) {                           
          $scope.movimentacaoDoacao = data.movimentacao_doacao;

          var qnt_entrada = 0;
          var qnt_saida = 0;

          angular.forEach($scope.movimentacaoDoacao, function(value, key) {
            if(value.tipo_entrada == 'Entrada'){
              qnt_entrada = qnt_entrada + parseFloat(value.quantidade);
            }
            if(value.tipo_entrada == 'Saida'){
              qnt_saida = qnt_saida + parseFloat(value.quantidade);
            }
          });

          $scope.movimentacao_quant.entrada = qnt_entrada;  
          $scope.movimentacao_quant.saida = qnt_saida;
          $scope.movimentacao_quant.estoque = qnt_entrada - qnt_saida;  
        }).
        error(function(data, status, headers, config) {
            // log error
          }); 
      }
    };

    $scope.getCentroCusto = function(){
      $http.get('api/index.php/consultacentrocusto/0').    
      success(function(data, status, headers, config) {
        if (data.error == 0) {
          $scope.centro_custo  = data.centro_custo;
          console.log($scope.centro_custo);
        };                       
      }).
      error(function(data, status, headers, config) {
        // log error
      });
    };

    $scope.getDoacao = function(){
      
        if($scope.doacao.id){

          $http.get('api/index.php/doacao/'+$scope.doacao.id).    
          success(function(data, status, headers, config) {    

            $scope.addDoacao = data.doacao[0];
            $scope.addDoacao.tipo_de_doacao = 1;

            $scope.progDoacao = {selected : {"id":$scope.addDoacao.id_programa_doacao,"descricao":$scope.addDoacao.programa_doacao}};        
            $scope.addDoacao.progDoacao = $scope.addDoacao.id_programa_doacao;

            $scope.tipoDoacao = {selected : {"id":$scope.addDoacao.id_tipo_doacao,"descricao":$scope.addDoacao.tipo_doacao}};        
            $scope.addDoacao.tipoDoacao = $scope.addDoacao.id_tipo_doacao;

            $scope.statusDoacao = {selected : {"id":$scope.addDoacao.movimentacao[0].id_status_doacao,"descricao":$scope.addDoacao.movimentacao[0].status_doacao}};        
            $scope.addDoacao.statusDoacao = $scope.addDoacao.movimentacao[0].id_status_doacao;

            $scope.localDoacao = {selected : {"id":$scope.addDoacao.movimentacao[0].id_local_armazenamento_doacao,"descricao":$scope.addDoacao.movimentacao[0].local_armazenamento_doacao}};        
            $scope.addDoacao.localDoacao = $scope.addDoacao.movimentacao[0].id_local_armazenamento_doacao;

            $scope.doador = {selected : {"id":$scope.addDoacao.movimentacao[0].id_doador,"nome":$scope.addDoacao.movimentacao[0].doador}};        
            $scope.addDoacao.idDoador = $scope.addDoacao.movimentacao[0].id_doador;
          }).
          error(function(data, status, headers, config) {}); 
        }     
    };

    $scope.delMovimentacaoDoacao = function(indiceEl, item){

      $scope.json = angular.toJson(item);

      $http.post('api/index.php/delmovimentacaodoacao/', $scope.json, 
       {withCredentials: true,
         headers: {'enctype': 'multipart/form-data' },
       }
       ).success(function(data, status, headers, config) {
        if (data.error == '0'){  

          Mensagem.success(data.mensagem);    

          $scope.movimentacaoDoacao.splice(indiceEl,1);
        }else{              
          Mensagem.error(data.mensagem);   
        }
      }).error(function(data, status) { 

      });
    };

    $scope.getMoeda = function(){

      $http.get('api/index.php/moeda/').        
      success(function(data, status, headers, config) {                           
        $scope.moeda = data.moeda;

      }).
      error(function(data, status, headers, config) {
          // log error
        }); 
    };

    $scope.getListaDepartamentoFuncionarios = function(){
      $http.get('api/index.php/deptofuncionarios/1/').    
         success(function(data, status, headers, config) {
          console.log(data);
           $scope.departamentos_funcionarios = data.departamentos;
           //console.log($scope.departamentos_funcionarios);
         }).
         error(function(data, status, headers, config) {
          // log error
         });
    };

    $scope.novoCadastro = function(tipo){

      switch(parseInt(tipo)){
        case 0: 
                $scope.showCadastroRapido = false;
                $scope.addDoacao.tipo_de_doacao = 0;
                $scope.getMoeda();
                $scope.getCentroCusto();
                $scope.getContaBancaria();
        break;
        case 1: 
                $scope.showCadastroRapido = false;
                $scope.addDoacao.tipo_de_doacao = 1;
                console.log("oeooo");
        break;
        case 2: 
                $scope.showCadastroRapido = true;
                $scope.addDoacao.tipo_de_doacao = 2;
                $scope.addDoacao.valor = '0';
                $scope.getContaBancaria();
                $scope.getCategoria();
                $scope.addDoacao.descricao = 'Doação';
                $scope.addDoacao.statusDoacao = 1;
                $scope.addDoacao.id_moeda = 1;
                $scope.addDoacao.id_entidade = 1;
                $scope.addDoacao.tipoDoacao = 1;
        break;
        case 3:
                $scope.showCadastroRapido=false;
                $scope.addDoacao = {};
                $scope.addDoacao.ativo = 1;
                $scope.addDoacao.tipo_de_doacao = tipo;
                $scope.addMovimentacaoDoacao = {};
                $scope.addMovimentacaoDoacao.tipo_entrada = 1;
                $scope.entidade            = {};
                $scope.movStatusDoacao     = {};
                $scope.movLocalDoacao      = {};
                $scope.movDoador           = {};
                $scope.movDoadoPara        = {};
                $scope.addProgramaDoacao   = {}; 
                $scope.doador              = {};
                $scope.moeda               = {};
                $scope.addCategoria        = {};
                $scope.addCentroCusto      = {};
                $scope.addDoacao.id_pessoa = {};
                $scope.movimentacaoDoacao         = [];
                $scope.categorias                 = [];
                $scope.centro_custo               = [];
                $scope.contabancaria              = [];
                $scope.departamentos_funcionarios = [];
                $scope.progDoacao                 = []; 
                $scope.programaDoacao             = []; 
                $scope.tipoDoacao                 = []; 
                $scope.tipoDeDoacao               = []; 
                $scope.statusDoacao               = []; 
                $scope.id_categoria               = [];
                $scope.statusDeDoacao             = []; 
                $scope.localDoacao                = [];
                $scope.id_centro_custo            = []; 
                $scope.localDeDoacao              = [];
                $scope.movimentacao_quant = [];
                $scope.movimentacao_quant.entrada = 0;
                $scope.movimentacao_quant.saida = 0;
                $scope.movimentacao_quant.estoque = 0; 
                $scope.carregarPrincipal(); 
        break;
      }
    };

    $scope.carregarPrincipal = function(){
      $scope.getLocalDoacao();
      $scope.getContaBancaria();
      $scope.getStatusDoacao();
      $scope.getTipoDoacao();
      $scope.getProgDoacao();
      $scope.getEntidade();
      $scope.getPessoa();
      $scope.getDoador();      
      $scope.getCategoria();
      $scope.novoCadastro(1);
    }
    $scope.carregarPrincipal();

    // SE HOUVER PESSOA, CARREGA PESSOA
    if ($scope.doacao.id != undefined) {
      $timeout(function() {
        $scope.getDoacao();
        $scope.getMovimentacaoDoacao();
        $scope.doador = {selected : {"id":$scope.addDoacao.id_doador,"nome":$scope.addDoacao.doador}};
        
      }, 3000);
    };

});

  //@ sourceURL=controller.formCadastroDoacao.js