/*
  Módulo: Mesquita
  Descrição: CRUD Bens
  Método: GET
  URL: /gestao/formCadastroBens
  Autenticação: Não
  Resposta: JSON
  Data de Criação: 08/01/2014
  Autor: Ricardo Bruno
  Versão: 1.0
  Data de Alteração: 08/01/2014
 */
smartSig.registerCtrl("formCadastroBens", function($scope, $http, $routeParams, Mensagem, $timeout, Permissao, $modal){

    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
        console.log('status',status);
    });

    var idBens = $routeParams.id;

    $scope.bens = {};
    $scope.seguro = {};
    $scope.bensmovimentacao = {};
    $scope.bensmovimentacao.tipo_entrada = 1;
    $scope.error = '';
    $scope.files = ''; 
    $scope.bens.ativo=1;
    $scope.grupobens = [];     
    $scope.grupodebens = []; 
    $scope.fabricante = [];     
    $scope.fabricantes = []; 
    $scope.marca = [];     
    $scope.marcas = []; 
    $scope.procedencia = [];     
    $scope.procedencias = []; 
    $scope.pessoa = []; 
    $scope.unidademedida = [];     
    $scope.unidademedidas = []; 
    $scope.estadoconservacao = [];     
    $scope.estadoconservacaos = []; 
    $scope.situacaoeconomica = [];     
    $scope.situacaoeconomicas = []; 
    $scope.formaaquisicao = [];     
    $scope.formaaquisicaos = [];
    $scope.seguradora = [];     
    $scope.seguradoras = []; 
    $scope.localidade = [];     
    $scope.localidadeB = [];
    $scope.localidades = [];   
    $scope.statusbem = [];     
    $scope.statusbemB = [];     
    $scope.statusbems = [];    
    $scope.centro_custo = []; 
    $scope.movimentacoes = []; 
    $scope.localidadeM = [];
    $scope.statusbemM = [];

    $scope.seguros = [];

    //$scope.bens.id_bens = 21;

    $scope.cadastrarBens = function(objeto) {      

      if ($('#cadastroBens-form').valid()) {

        $scope.json = angular.toJson($scope.bens);
                            
        $http.post('api/index.php/bens/', $scope.json, 
                                       {withCredentials: true,
                                       headers: {'enctype': 'multipart/form-data' },
                                       }
        ).success(function(data, status, headers, config) {
           if (data.error == '0')
           {   
              $scope.objeto = {}; 

              if($scope.files != ''){
                $scope.uploadFile($scope.files, data.id_bens);
              }              

              Mensagem.success(data.mensagem);   
              
              SalvarBens.disabled = true;  
              $scope.bens.id_bens = data.id_bens;
              $scope.seguro.id_bens = data.id_bens;
              $scope.bensmovimentacao.id_bens = data.id_bens;
                    
              objeto.id_bens = data.id_bens;
              objeto.tipoMovimentacao = "Entrada";
              objeto.historico = "Histórico Inicial";
              objeto.quantidade = $scope.bens.quantidade;

              objeto.data_movimentacao = dataHoje();
              $scope.movimentacoes.push(objeto);        
           }
           else
           {
              Mensagem.error(data.mensagem);   
           }
        }).error(function(data, status) { 
          
        });
      }

    } 

    function dataHoje() {
        var data = new Date();
        var dia = data.getDate();
        var mes = data.getMonth() + 1;
        var ano = data.getFullYear();
        return [dia, mes, ano].join('/');
    }    

    $scope.cadastrarBensSeguro = function(objeto) {  

      if ($scope.bens.id_bens==undefined)
      {
        Mensagem.error('Por favor, é necessário cadastrar o bem.');
        return;
      }  

      $scope.seguro.id_bens = $scope.bens.id_bens;     

      if ($('#cadastroBensSeguro-form').valid()) {

        $scope.json = angular.toJson($scope.seguro);
                            
        $http.post('api/index.php/bensseguro/', $scope.json, 
                                       {withCredentials: true,
                                       headers: {'enctype': 'multipart/form-data' },
                                       }
        ).success(function(data, status, headers, config) {
           if (data.error == '0')
           {   

              Mensagem.success(data.mensagem);  

              objeto.id_seguro = data.id_seguro;
              objeto.numero_apolice = $scope.seguro.numero_apolice;
              objeto.data_inicio = $scope.seguro.data_inicio;
              objeto.data_termino = $scope.seguro.data_termino;
              objeto.seguradoraNome = $scope.seguro.seguradoraNome.descricao;
              $scope.seguros.push(objeto);        
              $scope.seguro = {};
              $scope.seguradora = {};   
               
           }
           else
           {
              Mensagem.error(data.mensagem);   
           }
        }).error(function(data, status) { 
          
        });
      }

    }  

    $scope.cadastrarBensMovimentacao = function(objeto) {   

      if ($scope.bens.id_bens==undefined)
      {
        Mensagem.error('Por favor, é necessário cadastrar o bem.');
        return;
      }           

      if ($('#cadastroBensMovimentacao-form').valid()) {

        $scope.bensmovimentacao.id_bens = $scope.bens.id_bens;

        $scope.json = angular.toJson($scope.bensmovimentacao);
                            
        $http.post('api/index.php/bensmovimentacao/', $scope.json, 
                                       {withCredentials: true,
                                       headers: {'enctype': 'multipart/form-data' },
                                       }
        ).success(function(data, status, headers, config) {
           if (data.error == '0')
           {   
              //$scope.objeto = {}; 

              Mensagem.success(data.mensagem);   

              $scope.bens.id_bens = data.id_bens;
                    
              objeto.id_bens_movimentacao = data.id_bens_movimentacao;

              if (objeto.tipo_entrada==1) {
                objeto.tipoMovimentacao = "Entrada";                
              } else {
                objeto.tipoMovimentacao = "Saída";
              }

              objeto.data_movimentacao = $scope.bensmovimentacao.data_movimentacao;
              objeto.historico = $scope.bensmovimentacao.historico;
              objeto.quantidade = $scope.bensmovimentacao.quantidade;

              $scope.movimentacoes.push(objeto);                

              $scope.bensmovimentacao = {};
              $scope.localidadeM = {};
              $scope.statusbemM = {};
              $scope.bensmovimentacao.tipo_entrada = 1;
              $scope.bens.id_bens = data.id_bens;
           }
           else
           {
              Mensagem.error(data.mensagem);   
           }
        }).error(function(data, status) { 
          
        });
      }

    }         

    $scope.getIdBens = function(){
      $http.get('api/index.php/bens/'+idBens).    
        success(function(data, status, headers, config) {      
          $scope.bens = data.bens[0];
          
          $scope.grupobens = {selected : {"id":$scope.bens.id_grupo_bens,"descricao":$scope.bens.grupo_bens}};        
          $scope.bens.grupobens = $scope.bens.id_grupo_bens;

          $scope.fabricante = {selected : {"id":$scope.bens.id_fabricante,"descricao":$scope.bens.fabricante}};        
          $scope.bens.fabricante = $scope.bens.id_fabricante;

          $scope.marca = {selected : {"id":$scope.bens.id_marca,"descricao":$scope.bens.marca}};        
          $scope.bens.marca = $scope.bens.id_marca;  

          $scope.procedencia = {selected : {"id":$scope.bens.id_procedencia,"descricao":$scope.bens.procedencia}};        
          $scope.bens.procedencia = $scope.bens.id_procedencia;                             

          $scope.pessoa = {selected : {"id":$scope.bens.id_pessoa,"nome":$scope.bens.fornecedor}};        
          $scope.bens.pessoa = $scope.bens.id_pessoa;

          $scope.unidademedida = {selected : {"id":$scope.bens.id_unidade_medida,"descricao":$scope.bens.unidade_medida}};        
          $scope.bens.unidademedida = $scope.bens.id_unidade_medida;  

          $scope.estadoconservacao = {selected : {"id":$scope.bens.id_estado_conservacao,"descricao":$scope.bens.estado_conservacao}};        
          $scope.bens.estadoconservacao = $scope.bens.id_estado_conservacao; 

          $scope.situacaoeconomica = {selected : {"id":$scope.bens.id_situacao_economica,"descricao":$scope.bens.situacao_economica}};        
          $scope.bens.situacaoeconomica = $scope.bens.id_situacao_economica;

          $scope.formaaquisicao = {selected : {"id":$scope.bens.id_forma_aquisicao,"descricao":$scope.bens.forma_aquisicao}};        
          $scope.bens.formaaquisicao = $scope.bens.id_forma_aquisicao;  

          $scope.centrocusto = {selected : {"id":$scope.bens.id_centro_custo,"descricao":$scope.bens.centro_custo}};        
          $scope.bens.centro_custo = $scope.bens.id_centro_custo; 

          $scope.localidadeB = {selected : {"id":$scope.bens.id_localidade_bens,"descricao":$scope.bens.localidade_bens}};        
          $scope.bens.localidadeB = $scope.bens.id_localidade_bens;  

          $scope.statusbemB = {selected : {"id":$scope.bens.id_status_bem,"descricao":$scope.bens.status_bem}};        
          $scope.bens.statusbemB = $scope.bens.id_status_bem;   

          if (data.bens[0].seguros[0].error != -1) {          
            $scope.seguros = data.bens[0].seguros;   
          } 

          if (data.bens[0].movimentacoes[0].error != -1) {          
            $scope.movimentacoes = data.bens[0].movimentacoes;   
          }  

          $scope.bens.id_bens = data.bens[0].id;                                                         

          console.log("Ricardo",data.bens[0].seguros);
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }  

    $scope.getGrupoBens = function(){

        $http.get('api/index.php/grupobens/0/').        
        success(function(data, status, headers, config) {                           
          $scope.grupodebens = data.grupobens;
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }

    $scope.adicionarGrupoBens = function(){
      if ($('#cadastroGrupoBens-form').valid()) {
        
        $scope.addGrupoBens.ativo = 1;

        $scope.json = angular.toJson($scope.addGrupoBens);
                            
        $http.post('api/index.php/grupobens/', $scope.json, 
                                       {withCredentials: true,
                                       headers: {'enctype': 'multipart/form-data' },
                                       }
        ).success(function(data, status, headers, config) {
            if (data.error == '0'){  

                Mensagem.success(data.mensagem);    
                
                $('#myModalGrupoBens').modal('hide');    

                $scope.getGrupoBens(); 
                
                $scope.addGrupoBens = {};
            }else{              
              Mensagem.error(data.mensagem);   
            }
        }).error(function(data, status) { 
          
        });
      }
    }      

    $scope.verificarAcao = function(item) {
      if (item.id==-1) {
        $scope.modalNovoGrupoBens();
        $scope.grupobens.selected = '';
      }
      $scope.bens.id_grupo_bens = item.id;
      $( "em[for='grupobens']" ).css("display","none");    
    }

    $scope.modalNovoGrupoBens = function(size){
        $('#myModalGrupoBens').modal('show');        
    }      

    $scope.getFabricante = function(){

        $http.get('api/index.php/fabricante/0/').        
        success(function(data, status, headers, config) {                           
          $scope.fabricantes = data.fabricante;
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    } 

    $scope.adicionarFabricante = function(){
      if ($('#cadastroFabricante-form').valid()) {
        
        $scope.addFabricante.ativo = 1;

        $scope.json = angular.toJson($scope.addFabricante);
                            
        $http.post('api/index.php/fabricante/', $scope.json, 
                                       {withCredentials: true,
                                       headers: {'enctype': 'multipart/form-data' },
                                       }
        ).success(function(data, status, headers, config) {
            if (data.error == '0'){  

                Mensagem.success(data.mensagem);    
                
                $('#myModalFabricante').modal('hide');    

                $scope.getFabricante(); 
                
                $scope.addFabricante = {};
            }else{              
              Mensagem.error(data.mensagem);   
            }
        }).error(function(data, status) { 
          
        });
      }
    }     

    $scope.verificarAcaoFabricante = function(item) {
      if (item.id==-1) {
        $scope.modalNovoFabricante();
        $scope.fabricante.selected = '';
      }
      $scope.bens.id_fabricante = item.id;
      $( "em[for='fabricante']" ).css("display","none");    
    } 

    $scope.modalNovoFabricante = function(size){
        $('#myModalFabricante').modal('show');        
    }   

    $scope.getMarca = function(){

        $http.get('api/index.php/marca/0/').        
        success(function(data, status, headers, config) {                           
          $scope.marcas = data.marca;
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    } 

    $scope.adicionarMarca = function(){
      if ($('#cadastroMarca-form').valid()) {
        
        $scope.addMarca.ativo = 1;

        $scope.json = angular.toJson($scope.addMarca);
                            
        $http.post('api/index.php/marca/', $scope.json, 
                                       {withCredentials: true,
                                       headers: {'enctype': 'multipart/form-data' },
                                       }
        ).success(function(data, status, headers, config) {
            if (data.error == '0'){  

                Mensagem.success(data.mensagem);    
                
                $('#myModalMarca').modal('hide');    

                $scope.getMarca(); 
                
                $scope.addMarca = {};
            }else{              
              Mensagem.error(data.mensagem);   
            }
        }).error(function(data, status) { 
          
        });
      }
    }     

    $scope.verificarAcaoMarca = function(item) {
      if (item.id==-1) {
        $scope.modalNovoMarca();
        $scope.marca.selected = '';
      }
      $scope.bens.id_marca = item.id;
      $( "em[for='marca']" ).css("display","none");    
    } 

    $scope.modalNovoMarca = function(size){
        $('#myModalMarca').modal('show');        
    }  

    $scope.getProcedencia = function(){

        $http.get('api/index.php/procedencia/0/').        
        success(function(data, status, headers, config) {                           
          $scope.procedencias = data.procedencia;
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    } 

    $scope.adicionarProcedencia = function(){
      if ($('#cadastroProcedencia-form').valid()) {
        
        $scope.addProcedencia.ativo = 1;

        $scope.json = angular.toJson($scope.addProcedencia);
                            
        $http.post('api/index.php/procedencia/', $scope.json, 
                                       {withCredentials: true,
                                       headers: {'enctype': 'multipart/form-data' },
                                       }
        ).success(function(data, status, headers, config) {
            if (data.error == '0'){  

                Mensagem.success(data.mensagem);    
                
                $('#myModalProcedencia').modal('hide');    

                $scope.getProcedencia(); 
                
                $scope.addProcedencia = {};
            }else{              
              Mensagem.error(data.mensagem);   
            }
        }).error(function(data, status) { 
          
        });
      }
    }     

    $scope.verificarAcaoProcedencia = function(item) {
      if (item.id==-1) {
        $scope.modalNovoProcedencia();
        $scope.procedencia.selected = '';
      }
      $scope.bens.id_procedencia = item.id;
      $( "em[for='procedencia']" ).css("display","none");    
    } 

    $scope.modalNovoProcedencia = function(size){
        $('#myModalProcedencia').modal('show');        
    } 

    $scope.changeFornecedor = function(obj){      
      $scope.bens.id_pessoa = obj.id;
      $( "em[for='fornecedorclasse']" ).css("display","none");      
    } 

    $scope.changeCentroCusto = function(obj){      
      $scope.bens.id_centro_custo = obj.id;
      
      $( "em[for='recebidopago']" ).css("display","none");      
    }    

    $scope.getPessoaFornecedor = function(objeto) {
      var params = {objeto: objeto, sensor: false};
      if (objeto.length < 0) {
        objeto = "a";
      };
      return $http.get('api/index.php/stringpessoa?associado=0&string='+objeto,
        {params: params}
      ).then(function(response) {          
          $scope.pessoas = response.data['pessoa']
      });
    }; 

    $scope.getUnidadeMedida = function(){

        $http.get('api/index.php/unidademedida/0/').        
        success(function(data, status, headers, config) {                           
          $scope.unidademedidas = data.unidademedida;
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    } 

    $scope.adicionarUnidadeMedida = function(){
      if ($('#cadastroUnidadeMedida-form').valid()) {
        
        $scope.addUnidadeMedida.ativo = 1;

        $scope.json = angular.toJson($scope.addUnidadeMedida);
                            
        $http.post('api/index.php/unidademedida/', $scope.json, 
                                       {withCredentials: true,
                                       headers: {'enctype': 'multipart/form-data' },
                                       }
        ).success(function(data, status, headers, config) {
            if (data.error == '0'){  

                Mensagem.success(data.mensagem);    
                
                $('#myModalUnidadeMedida').modal('hide');    

                $scope.getUnidadeMedida(); 
                
                $scope.addUnidadeMedida = {};
            }else{              
              Mensagem.error(data.mensagem);   
            }
        }).error(function(data, status) { 
          
        });
      }
    }     

    $scope.verificarAcaoUnidadeMedida = function(item) {
      if (item.id==-1) {
        $scope.modalNovoUnidadeMedida();
        $scope.unidademedida.selected = '';
      }
      $scope.bens.id_unidade_medida = item.id;
      $( "em[for='unidademedida']" ).css("display","none");    
    } 

    $scope.modalNovoUnidadeMedida = function(size){
        $('#myModalUnidadeMedida').modal('show');        
    }  

    $scope.getEstadoConservacao = function(){

        $http.get('api/index.php/estadoconservacao/0/').        
        success(function(data, status, headers, config) {                           
          $scope.estadoconservacaos = data.estadoconservacao;
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    } 

    $scope.adicionarEstadoConservacao = function(){
      if ($('#cadastroEstadoConservacao-form').valid()) {
        
        $scope.addEstadoConservacao.ativo = 1;

        $scope.json = angular.toJson($scope.addEstadoConservacao);
                            
        $http.post('api/index.php/estadoconservacao/', $scope.json, 
                                       {withCredentials: true,
                                       headers: {'enctype': 'multipart/form-data' },
                                       }
        ).success(function(data, status, headers, config) {
            if (data.error == '0'){  

                Mensagem.success(data.mensagem);    
                
                $('#myModalEstadoConservacao').modal('hide');    

                $scope.getEstadoConservacao(); 
                
                $scope.addEstadoConservacao = {};
            }else{              
              Mensagem.error(data.mensagem);   
            }
        }).error(function(data, status) { 
          
        });
      }
    }     

    $scope.verificarAcaoEstadoConservacao = function(item) {
      if (item.id==-1) {
        $scope.modalNovoEstadoConservacao();
        $scope.estadoconservacao.selected = '';
      }
      $scope.bens.id_estado_conservacao = item.id;
      $( "em[for='estadoconservacao']" ).css("display","none");    
    } 

    $scope.modalNovoEstadoConservacao = function(size){
        $('#myModalEstadoConservacao').modal('show');        
    }   

    $scope.getSituacaoEconomica = function(){

        $http.get('api/index.php/siteconomica/0/').        
        success(function(data, status, headers, config) {                           
          $scope.situacaoeconomicas = data.situacaoeconomica;
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    } 

    $scope.adicionarSituacaoEconomica = function(){
      if ($('#cadastroSituacaoEconomica-form').valid()) {
        
        $scope.addSituacaoEconomica.ativo = 1;

        $scope.json = angular.toJson($scope.addSituacaoEconomica);
                            
        $http.post('api/index.php/situacaoeconomica/', $scope.json, 
                                       {withCredentials: true,
                                       headers: {'enctype': 'multipart/form-data' },
                                       }
        ).success(function(data, status, headers, config) {
            if (data.error == '0'){  

                Mensagem.success(data.mensagem);    
                
                $('#myModalSituacaoEconomica').modal('hide');    

                $scope.getSituacaoEconomica(); 
                
                $scope.addSituacaoEconomica = {};
            }else{              
              Mensagem.error(data.mensagem);   
            }
        }).error(function(data, status) { 
          
        });
      }
    }     

    $scope.verificarAcaoSituacaoEconomica = function(item) {
      if (item.id==-1) {
        $scope.modalNovoSituacaoEconomica();
        $scope.situacaoeconomica.selected = '';
      }
      $scope.bens.id_situacao_economica = item.id;
      $( "em[for='situacaoeconomica']" ).css("display","none");    
    } 

    $scope.modalNovoSituacaoEconomica = function(size){
        $('#myModalSituacaoEconomica').modal('show');        
    }   

    $scope.getFormaAquisicao = function(){

        $http.get('api/index.php/formaaquisicao/0/').        
        success(function(data, status, headers, config) {                           
          $scope.formaaquisicaos = data.formaaquisicao;
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    } 

    $scope.adicionarFormaAquisicao = function(){
      if ($('#cadastroFormaAquisicao-form').valid()) {
        
        $scope.addFormaAquisicao.ativo = 1;

        $scope.json = angular.toJson($scope.addFormaAquisicao);
                            
        $http.post('api/index.php/formaaquisicao/', $scope.json, 
                                       {withCredentials: true,
                                       headers: {'enctype': 'multipart/form-data' },
                                       }
        ).success(function(data, status, headers, config) {
            if (data.error == '0'){  

                Mensagem.success(data.mensagem);    
                
                $('#myModalFormaAquisicao').modal('hide');    

                $scope.getFormaAquisicao(); 
                
                $scope.addFormaAquisicao = {};
            }else{              
              Mensagem.error(data.mensagem);   
            }
        }).error(function(data, status) { 
          
        });
      }
    }     

    $scope.verificarAcaoFormaAquisicao = function(item) {
      if (item.id==-1) {
        $scope.modalNovoFormaAquisicao();
        $scope.formaaquisicao.selected = '';
      }
      $scope.bens.id_forma_aquisicao = item.id;
      $( "em[for='formaaquisicao']" ).css("display","none");    
    } 

    $scope.modalNovoFormaAquisicao = function(size){
        $('#myModalFormaAquisicao').modal('show');        
    } 

    $scope.getSeguradora = function(){

        $http.get('api/index.php/seguradora/0/').        
        success(function(data, status, headers, config) {                           
          $scope.seguradoras = data.seguradora;
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    } 

    $scope.adicionarSeguradora = function(){
      if ($('#cadastroSeguradora-form').valid()) {
        
        $scope.addSeguradora.ativo = 1;

        $scope.json = angular.toJson($scope.addSeguradora);
                            
        $http.post('api/index.php/seguradora/', $scope.json, 
                                       {withCredentials: true,
                                       headers: {'enctype': 'multipart/form-data' },
                                       }
        ).success(function(data, status, headers, config) {
            if (data.error == '0'){  

                Mensagem.success(data.mensagem);    
                
                $('#myModalSeguradora').modal('hide');    

                $scope.getSeguradora(); 
                
                $scope.addSeguradora = {};
            }else{              
              Mensagem.error(data.mensagem);   
            }
        }).error(function(data, status) { 
          
        });
      }
    }     

    $scope.verificarAcaoSeguradora = function(item) {
      if (item.id==-1) {
        $scope.modalNovoSeguradora();
        $scope.seguradora.selected = '';
      }
      $scope.seguro.id_seguradora = item.id;
      $scope.seguro.seguradoraNome = $scope.seguradora.selected;
      $( "em[for='seguradora']" ).css("display","none");    
    } 

    $scope.modalNovoSeguradora = function(size){
        $('#myModalSeguradora').modal('show');        
    }   

    $scope.getLocalidade = function(){

        $http.get('api/index.php/localidadebens/0/').        
        success(function(data, status, headers, config) {                           
          $scope.localidades = data.localidadebens;
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    } 

    $scope.adicionarLocalidade = function(){
      if ($('#cadastroLocalidade-form').valid()) {
        
        $scope.addLocalidade.ativo = 1;

        $scope.json = angular.toJson($scope.addLocalidade);
                            
        $http.post('api/index.php/localidadebens/', $scope.json, 
                                       {withCredentials: true,
                                       headers: {'enctype': 'multipart/form-data' },
                                       }
        ).success(function(data, status, headers, config) {
            if (data.error == '0'){  

                Mensagem.success(data.mensagem);    
                
                $('#myModalLocalidade').modal('hide');    

                $scope.getLocalidade(); 
                
                $scope.addLocalidade = {};
            }else{              
              Mensagem.error(data.mensagem);   
            }
        }).error(function(data, status) { 
          
        });
      }
    }     

    $scope.verificarAcaoLocalidadeB = function(item) {
      if (item.id==-1) {
        $scope.modalNovoLocalidade();
        $scope.localidadeB.selected = '';
      }
      $scope.bens.id_localidade_bens = item.id;
      $( "em[for='localidadeB']" ).css("display","none");    
    }

    $scope.verificarAcaoLocalidadeM = function(item) {
      if (item.id==-1) {
        $scope.modalNovoLocalidade();
        $scope.localidadeM.selected = '';
      }
      $scope.bensmovimentacao.id_localidade_bens = item.id;
      $( "em[for='localidadeM']" ).css("display","none");    
    }     

    $scope.modalNovoLocalidade = function(size){
        $('#myModalLocalidade').modal('show');        
    }     

    $scope.getStatus = function(){

        $http.get('api/index.php/statusbem/0/').        
        success(function(data, status, headers, config) {                           
          $scope.statusbems = data.statusbem;
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    } 

    $scope.adicionarStatus = function(){
      if ($('#cadastroStatus-form').valid()) {
        
        $scope.addStatus.ativo = 1;

        $scope.json = angular.toJson($scope.addStatus);
                            
        $http.post('api/index.php/statusbem/', $scope.json, 
                                       {withCredentials: true,
                                       headers: {'enctype': 'multipart/form-data' },
                                       }
        ).success(function(data, status, headers, config) {
            if (data.error == '0'){  

                Mensagem.success(data.mensagem);    
                
                $('#myModalStatus').modal('hide');    

                $scope.getStatus(); 
                
                $scope.addStatus = {};
            }else{              
              Mensagem.error(data.mensagem);   
            }
        }).error(function(data, status) { 
          
        });
      }
    }     

    $scope.verificarAcaoStatusBemB = function(item) {
      if (item.id==-1) {
        $scope.modalNovoStatus();
        $scope.statusbemB.selected = '';
      }
      $scope.bens.id_status_bem = item.id;
      $( "em[for='statusbemB']" ).css("display","none");    
    } 

    $scope.verificarAcaoStatusBemM = function(item) {
      if (item.id==-1) {
        $scope.modalNovoStatus();
        $scope.statusbemM.selected = '';
      }
      $scope.bensmovimentacao.id_status_bem = item.id;
      $( "em[for='statusbemM']" ).css("display","none");    
    }     

    $scope.modalNovoStatus = function(size){
        $('#myModalStatus').modal('show');        
    }                      

    $scope.setCurDate = function(){
      $scope.curDate = new Date();    
    }  

    $scope.$watch('bens.data_aquisicao', function(){  
      $scope.bens.data_aquisicao1 = $scope.bens.data_aquisicao;     
      if($scope.bens.data_aquisicao1 != undefined || $scope.bens.data_aquisicao1 != null){              
        $( "em[for='data_aquisicao']" ).css("display","none"); 
      }
    }); 

    $scope.$watch('bens.data_limite_utilizacao', function(){  
      $scope.bens.data_limite_utilizacao1 = $scope.bens.data_limite_utilizacao;     
      if($scope.bens.data_limite_utilizacao1 != undefined || $scope.bens.data_limite_utilizacao1 != null){              
        $( "em[for='data_limite_utilizacao']" ).css("display","none"); 
      }
    }); 

    $scope.$watch('seguro.data_termino', function(){  
      $scope.seguro.data_termino1 = $scope.seguro.data_termino;     
      if($scope.seguro.data_termino1 != undefined || $scope.seguro.data_termino1 != null){              
        $( "em[for='data_termino']" ).css("display","none"); 
      }
    });

    $scope.$watch('seguro.data_inicio', function(){  
      $scope.seguro.data_inicio1 = $scope.seguro.data_inicio;     
      if($scope.seguro.data_inicio1 != undefined || $scope.seguro.data_inicio1 != null){              
        $( "em[for='data_inicio']" ).css("display","none"); 
      }
    }); 

    $scope.$watch('bensmovimentacao.data_movimentacao', function(){  
      $scope.bensmovimentacao.data_movimentacao1 = $scope.bensmovimentacao.data_movimentacao;     
      if($scope.bensmovimentacao.data_movimentacao1 != undefined || $scope.bensmovimentacao.data_movimentacao1 != null){              
        $( "em[for='data_movimentacao1']" ).css("display","none"); 
      }
    });                   

    $scope.getCentroCusto = function(){
      $http.get('api/index.php/consultacentrocusto/1').    
        success(function(data, status, headers, config) {                           
          $scope.centro_custo = data.centro_custo;
          
        }).
        error(function(data, status, headers, config) {
          // log error
        });      
    }      

    //Funções do Datepicker
    $scope.open = function($event,opened) {
      $event.preventDefault();
      $event.stopPropagation();

      $scope[opened] = true;
    };   

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd/MM/yyyy', 'shortDate'];
    $scope.format = $scope.formats[2];  
 
    $scope.armazenaFile = function(files) {
          $scope.files = files;
          console.log('file: ',$scope.files);
    };

    $scope.uploadFile = function(files,id) {

        var fd = new FormData();
        
        file = files.files[0];
                
        if(file){
            fd.append("file", file);

            $http.post('api/index.php/uploadfilebens/'+id, fd, {
                withCredentials: true,
                headers: {'Content-Type': undefined },
                transformRequest: angular.identity
            }).success(function(data, status, headers, config) {
              console.log(data);
            }).error(function(data, status) { 
              
            });
        }
    };

    $scope.delSeguro = function(indexEl,item){            

      $scope.json = angular.toJson(item);

      $http.post('api/index.php/delseguro/', $scope.json, 
                                     {withCredentials: true,
                                     headers: {'enctype': 'multipart/form-data' },
                                     // transformRequest: angular.identity
                                     }
      ).success(function(data, status, headers, config) {    
        $scope.seguros.splice(indexEl, 1);  
        Mensagem.success(data.mensagem);               
      }).
      error(function(data, status, headers, config) {
        Mensagem.error('Erro na exclusão de seguro');
      });       
    }   

    $scope.delBensMovimentacao = function(indexEl,item){            

      $scope.json = angular.toJson(item);

      $http.post('api/index.php/delbensmovimentacao/', $scope.json, 
                                     {withCredentials: true,
                                     headers: {'enctype': 'multipart/form-data' },
                                     // transformRequest: angular.identity
                                     }
      ).success(function(data, status, headers, config) {    
        $scope.movimentacoes.splice(indexEl, 1);  
        Mensagem.success(data.mensagem);               
      }).
      error(function(data, status, headers, config) {
        Mensagem.error('Erro na exclusão da movimentação');
      });       
    }   

    $scope.novoCadastro = function(){
      $scope.bens = {};

      $scope.grupobens.selected = '';        
      $scope.fabricante.selected = '';
      $scope.marca.selected = '';
      $scope.procedencia.selected = '';
      $scope.pessoa.selected = '';
      $scope.unidademedida.selected = '';
      $scope.estadoconservacao.selected = '';
      $scope.situacaoeconomica.selected = '';
      $scope.formaaquisicao.selected = '';
      $scope.centrocusto.selected = '';
      $scope.localidadeB.selected = '';
      $scope.statusbemB.selected = '';

      SalvarBens.disabled = false;

      $scope.seguro = {};
      $scope.seguradora.selected = '';

      $scope.seguros = {}; 

      $scope.bensmovimentacao = {};
      $scope.bensmovimentacao.tipo_entrada = 1;
      $scope.localidadeM.selected = '';
      $scope.statusbemM.selected = '';
      
      $scope.movimentacoes = {};
    }    

    if (idBens != undefined) {
      $timeout(function() {
        $scope.getIdBens(idBens);
      }, 800);      
    };   

    $scope.getGrupoBens(); 
    $scope.getFabricante();  
    $scope.getMarca();
    $scope.getProcedencia();
    $scope.getUnidadeMedida();
    $scope.getEstadoConservacao();
    $scope.getSituacaoEconomica();
    $scope.getFormaAquisicao();    
    $scope.getSeguradora(); 
    $scope.getLocalidade();     
    $scope.getStatus(); 
    $scope.getCentroCusto();

});