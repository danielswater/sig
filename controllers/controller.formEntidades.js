smartSig.registerCtrl("formEntidades", function($scope, $http, $routeParams, Mensagem, $timeout, $rootScope, $location, $modal, Permissao){

    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
    });
    

    $scope.passaPessoa = function(item, model, label){        
      $scope.getIdPessoa(item.id);
    }

    $scope.getPessoaExists = function(val) {
    return $http.get('api/index.php/stringpessoa?associado=1&', {
      params: {
        string: val,
        sensor: false
      }
    }).then(function(response){
      return response.data.pessoa;
    });
    };

    
    var idPessoa = $routeParams.id;
    var idCadastro = $routeParams.tipo;  

    // Disable weekend selection
    $scope.disabled = function(date, mode) {
      return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
    };

    $scope.toggleMin = function() {
      $scope.minDate = $scope.minDate ? null : new Date();
    };
    $scope.toggleMin();

    $scope.open = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.opened = true;
    };    

    $scope.dateOptions = {
      formatYear: 'yy',
      startingDay: 1,
      language: 'pt-BR',
    };

    $scope.initDate = new Date();
    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd/MM/yyyy', 'shortDate'];
    $scope.format = $scope.formats[2];

    $scope.endereco = {};   
    $scope.contato = {};
    $scope.pessoa = {};
    $scope.estados = {};
    $scope.cidades = {};
    $scope.error = '';
    $scope.files = '';
    $scope.contato.tipo_contato = 0; 
    $scope.contato.enviar_convite = 0;
    $scope.labelPF = 1;
    $scope.labelPJ = 1;    
    $scope.updatePessoa = 0;

    $scope.contatos = [];
    $scope.socio = {};
    $scope.sociosSel = [];
    $scope.departamento = [];

    $scope.categoria = [];     
    $scope.categorias = []; 

    $scope.forma_tratamento = [];     
    $scope.forma_tratamentos = [];

    $scope.cargo = [];     
    $scope.cargos = [];  

    $scope.categoria = {};
    $scope.categoria.pronome_tratamento = false;
    $scope.categoria.documento = false;

    $scope.religiao = {};
    $scope.isLoading = false;
    // $scope.pessoa.id=24;
    
   /* $scope.pessoa.id = '19';
    $scope.pessoa.nome = 'Rafael Frota';
    $scope.pessoa.cpf = '26498074825';
    $scope.pessoa.rg = '30640729-1';
    $scope.pessoa.empresa = 'Marabraz';
    $scope.pessoa.ocupacao = 'Analista';
    $scope.pessoa.sexo = 'M';
    $scope.pessoa.data_nascimento = '17/10/1977';
    $scope.pessoa.data_associacao = '01/01/2000';
    $scope.pessoa.telefone_celular = '(011) 96881-6876';
    $scope.pessoa.telefone_residencial = '(011) 1111-1111';
    $scope.pessoa.telefone_comercial = '(011) 2222-2222';
    $scope.pessoa.email = 'rafael.frotac@gmail.com';
    $scope.pessoa.email = 'rafael.frotac@gmail.com';
    $scope.pessoa.id_estado_civil = '2';*/
    
    $scope.novoCadastro = function(){
      $location.path('/forms/formEntidades/'+idCadastro+'/');
    }

    $scope.limparPessoa = function(){
      $scope.id_tipo_pessoa_default = $scope.pessoa.id_tipo_pessoa;
      $scope.pessoa = {};
      $scope.pessoa.id_tipo_pessoa = $scope.id_tipo_pessoa_default;
    }  
    
    $scope.tratarData = function(data){
      var new_data = '';
      if(data != null && data != undefined){
        new_data = data.split("/");
        new_data = new_data[2] +'/'+ new_data[1] +'/'+ new_data[0];
      }
      return new_data;
    }

    $scope.getIdPessoa = function(idPessoa){

      $http.get('api/index.php/pessoa/'+idPessoa).    
        success(function(data, status, headers, config) {      

          $scope.updatePessoa = 1;

          $scope.pessoa = data.pessoa[0];   
                                   
          $scope.contato.id_pessoa = data.pessoa[0].id;          
          $scope.endereco = data.pessoa[0].endereco.endereco[0];
         
          if ($scope.endereco!=undefined) {
            $scope.endereco.id_pessoa = data.pessoa[0].id;
            $scope.getCep();
          } else {
            $scope.endereco = {}
            $scope.endereco.id_pessoa = data.pessoa[0].id;
          }
          
          if (data.pessoa[0].contatos[0].error != -1) {          
            $scope.contatos = data.pessoa[0].contatos;   
          }           

          if (data.pessoa[0].rg.length>0) {
            $scope.pessoa.id_tipo_documento=1;
            $scope.pessoa.numero_documento = data.pessoa[0].rg;
          } else if (data.pessoa[0].rne.length>0) {
            $scope.pessoa.id_tipo_documento=3;
            $scope.pessoa.numero_documento = data.pessoa[0].rne;
          } else if (data.pessoa[0].identificacao_internacional.length>0) {
            $scope.pessoa.id_tipo_documento=7;
            $scope.pessoa.numero_documento = data.pessoa[0].identificacao_internacional;
          }

          if (data.pessoa[0].telefones.length>0) {
            angular.forEach(data.pessoa[0].telefones, function(value, key) {                           
              if(value.id_tipo_telefone==2){                   
                $scope.pessoa.telefone_comercial =value.numero_telefone;
              }                       

              if(value.id_tipo_telefone==3){                   
                $scope.pessoa.telefone_celular =value.numero_telefone;
              }                       

            }); 


          }
          
          $scope.categoria = {selected : {"id":$scope.pessoa.id_categoria_naoassociado,"descricao":$scope.pessoa.categoria_naoassociado}};        
          $scope.pessoa.categoria = $scope.pessoa.id_categoria_naoassociado; 

          $scope.religiao = {selected : {"id":$scope.pessoa.id_religiao,"descricao":$scope.pessoa.religiao}};        
          $scope.pessoa.religiao = $scope.pessoa.id_religiao;             

          $scope.cargo = {selected : {"id":$scope.contato.id_cargo,"descricao":$scope.pessoa.cargo}};        
          $scope.contato.cargo = $scope.contato.id_cargo;  


          $scope.forma_tratamento = {selected : {"id":$scope.contato.id_forma_tratamento,"descricao":$scope.contato.forma_tratamento}};        
          $scope.contato.forma_tratamento = $scope.contato.id_forma_tratamento;  
        
          if (data.pessoa[0].tipo_evento) {            
            $scope.refreshTipoEvento(data.pessoa[0].tipo_evento);
          }

          //console.log('Pessoa', data);

        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }  

    $scope.getContatoPessoa = function(id){
        //var cep = $("#"+id).val();
        $http.get('api/index.php/contato_pessoa/'+id).    
        success(function(data, status, headers, config) {                 
          if(data[0].error != -1){
            $scope.contatos = data;
          }
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }

    $scope.getCep = function(id){

      $scope.isLoading = true;

        //var cep = $("#"+id).val();
        $http.get('api/index.php/cep/'+$scope.endereco.cep).    
        success(function(data, status, headers, config) {
        $scope.isLoading = true;                        
          if(data[0].error == -1){
            $scope.error = data[0].mensagem;

            Mensagem.error(data[0].mensagem);

          }

            var idPessoa = $scope.endereco.id_pessoa;
            $scope.endereco.cep = data[0].endereco.cep;
            $scope.endereco.logradouro = data[0].endereco.logradouro;            
            $scope.endereco.bairro = data[0].endereco.bairro;
            $scope.endereco.estado = data[0].endereco.estado;
            $scope.endereco.cidade = data[0].endereco.cidade;
            $scope.endereco.idPais = data[0].endereco.idPais;
            $scope.endereco.id_pessoa = idPessoa;
            $scope.estados    = data[0].estados;
            angular.forEach(data[0].estados, function(value, key) {
              if($scope.endereco.estado == value.uf){
                $scope.cidades = data[0].estados[key].cidades;
              }
            });
            
            $scope.paises     = data[0].pais;  
          
          console.log('teste', $scope.endereco);
          
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }

    $scope.getCidade = function(nome){
      angular.forEach($scope.estados, function(value, key) {
        if(nome == value.nome){
          $scope.cidades = $scope.estados[key].cidades;
        }
      });
    }

    $scope.getCpf = function(id){
        var cpf = $("#"+id).val();
        //cpf = cpf.replace('XXX.XXX.XXX-XX', "");

        if (cpf.length > 0) {
          $http.get('api/index.php/cpf/'+cpf).    
          success(function(data, status, headers, config) {                 
            if(data[0].error == -1){
              $scope.error = data[0].mensagem;

              Mensagem.error(data[0].mensagem);  
              SalvarDadosPessoais.disabled=true;

            }else{
             SalvarDadosPessoais.disabled=false;
            }
            
            
          }).
          error(function(data, status, headers, config) {
            // log error
          });   
        };
    }       

    $scope.getDocumento = function(){

          if ($scope.pessoa.numero_documento) {
            $http.get('api/index.php/documentoAll/'+$scope.pessoa.numero_documento).    
            success(function(data, status, headers, config) {                 
              if(data[0].error == -1){
                $scope.error = data[0].mensagem;

                Mensagem.error(data[0].mensagem);  
                SalvarDadosPessoais.disabled=true;

              }else{
               SalvarDadosPessoais.disabled=false;
              }
              
              
            }).
            error(function(data, status, headers, config) {
              // log error
            });   
          };
    }       
    
    $scope.getPaises = function(){

        $http.get('api/index.php/pais').    
        success(function(data, status, headers, config) {                           
          $scope.paises = data.paises;
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }

    $scope.getEstadoCivil = function(){

        $http.get('api/index.php/estadocivil/').    
        success(function(data, status, headers, config) {                           
          $scope.estadocivil = data;
          
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }

    $scope.getTipoBeneficiario = function(){

        $http.get('api/index.php/tipobeneficiario/').    
        success(function(data, status, headers, config) {                           
          $scope.tipobeneficiario = data;
          
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }   

    $scope.getPapel = function(){
      $http.get('api/index.php/papel/').    
        success(function(data, status, headers, config) {                                     
          $scope.papeis = data;          
        }).
        error(function(data, status, headers, config) {
          // log error
        });       
    }      

    $scope.getFonteCaptacao = function(){
      $http.get('api/index.php/fontecaptacao/').    
        success(function(data, status, headers, config) {                                     
          $scope.fonte_captacao = data;          
        }).
        error(function(data, status, headers, config) {
          // log error
        });       
    }    

    $scope.getCampanha = function(){
      $http.get('api/index.php/campanha?flagPeriodo=1').    
        success(function(data, status, headers, config) {                                     
          $scope.campanha = data.campanha;          
        }).
        error(function(data, status, headers, config) {
          // log error
        });       
    }
    $scope.getDepartamento = function(){
      $http.get('api/index.php/deptofuncionarios/1').    
        success(function(data, status, headers, config) {
          console.log('depto = ', data);
          $scope.departamento = data.departamentos;
        }).
        error(function(data, status, headers, config) {
          // log error
        });       
    }

    $scope.getCargo = function(){
      $http.get('api/index.php/cargo/0/').    
        success(function(data, status, headers, config) {                                     
          $scope.cargos = data.cargo;          
        }).
        error(function(data, status, headers, config) {
          // log error
        });       
    }    

    $scope.cadastrarPessoa = function(tipocadastro) {

        if ($('#formEntidades-form').valid()) {
          SalvarDadosPessoais.disabled = true
          $scope.pessoa.tipocadastro = 8;
          $scope.pessoa.id_tipo_pessoa = 2;    //Pessoa Jurídica

          $scope.json = angular.toJson($scope.pessoa);

          $http.post('api/index.php/pessoa/', $scope.json, 
                                         {withCredentials: true,
                                         headers: {'enctype': 'multipart/form-data' },
                                         }
          ).success(function(data, status, headers, config) {
             if (data.error == '0')
             {  
                Mensagem.success(data.mensagem); 
                
                $scope.pessoa.id_tipo_pessoa = 2;
                $scope.endereco.id_pessoa = data.id_pessoa;
                $scope.pessoa.id = data.id_pessoa;
                idPessoa = $scope.pessoa.id;
                
                $scope.getIdPessoa(idPessoa);
                SalvarDadosPessoais.disabled = false;     
                
             }
             else
             {
                Mensagem.error(data.mensagem);   
             }
          }).error(function(data, status) { 
            
          });
      }

    }  

    $scope.cadastrarEnderecoPessoa = function(objeto,idTipoEndereco) {      
      
      if ($scope.endereco.id_pessoa==undefined)
      {
        Mensagem.error('Por favor, é necessário cadastrar os dados pessoais primeiro.');
        return;
      }

      if ($('#cadastroPF-Endereco-form').valid()) {
        SalvarEndereco.disabled = true;
        objeto.idTipoEndereco = idTipoEndereco;

        $scope.json = angular.toJson($scope.endereco);
                            
        $http.post('api/index.php/endereco/', $scope.json,{withCredentials: true,headers: {'enctype': 'multipart/form-data' },})
        .success(function(data, status, headers, config) {
           if (data.error == '0')
           {  
              Mensagem.success(data.mensagem);
              $scope.getIdPessoa(idPessoa);
              SalvarEndereco.disabled = false;
           }
           else
           {
              Mensagem.error(data.mensagem);
           }
        }).error(function(data, status) { 
          
        });
      }
    }   
    

    $scope.delContatoPessoa = function(indexEl){            

      $scope.json = angular.toJson($scope.contatos[indexEl]);

      $http.post('api/index.php/delcontato_pessoa/', $scope.json, 
                                     {withCredentials: true,
                                     headers: {'enctype': 'multipart/form-data' },
                                     // transformRequest: angular.identity
                                     }
      ).success(function(data, status, headers, config) {    
        //$scope.getContatoPessoa($scope.pessoa.id); 
        $scope.contatos.splice(indexEl, 1);

        Mensagem.success(data.mensagem);               
      }).
      error(function(data, status, headers, config) {
        Mensagem.error('Erro na exclusão de contato');
      });       
    } 

    $scope.saveContato = function(objeto) {  

      if ($scope.pessoa.id==undefined)
      {
        Mensagem.error('Por favor, é necessário cadastrar os dados pessoais primeiro.');
        return;
      }else{
        $scope.contato.id_pessoa = $scope.pessoa.id;
      }      

      if ($('#cadastroContato-form').valid()) {

        objeto.tipoeventos = $scope.tipoeventos.selecionados;
        console.log('cadastrarPessoa', objeto);

        $scope.json = angular.toJson(objeto);

        $http.post('api/index.php/contato_pessoa/', $scope.json, 
                                       {withCredentials: true,
                                       headers: {'enctype': 'multipart/form-data' },
                                       }
        ).success(function(data, status, headers, config) {
           if (data.error == '0')
           {   

              $scope.objeto = {};
              Mensagem.success(data.mensagem);   

                  
              objeto.id_pessoa_contato = data.id_pessoa_contato;
              objeto.id = data.id;    
              $scope.contato = {} 
              $scope.contato.tipo_contato = 0; 
              $scope.contato.enviar_convite = 0;              
              $scope.tipoeventos.selecionados = {};

              $scope.getContatoPessoa($scope.pessoa.id);               
           }
           else
           {
              Mensagem.error(data.mensagem);   
           }
        }).error(function(data, status) { 
          
        });
      }

    }        

    $scope.getCnpj = function(id){
        var cnpj = $("#"+id).val();

        cnpj = cnpj.replace(".", "");
        cnpj = cnpj.replace("/", "");
        cnpj = cnpj.replace("-", "");
        cnpj = cnpj.replace(".", "");

        $http.get('api/index.php/cnpj/'+cnpj).    
        success(function(data, status, headers, config) {                 
          if(data[0].error == -1){
            $scope.error = data[0].mensagem;

            Mensagem.error(data[0].mensagem);  
            SalvarDadosPessoais.disabled=true;

          }else{
           SalvarDadosPessoais.disabled=false;
          }
          
          
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }     

    $scope.disabled = undefined;

    $scope.enable = function() {
      $scope.disabled = false;
    };

    $scope.disable = function() {
      $scope.disabled = true;
    };

    $scope.clear = function() {
      $scope.socio.selected = undefined;
    };
   
    $scope.setarTipoEventoSelecionado = function(item, select) {
      if(item.length > 0){
        var nivel = item.length - 1;
        if(item[nivel].id == -1){  
          $('#myModalTipoEvento').modal('show');
          select.removeChoice(nivel);                     
        }else{
          $scope.pessoa.tipoeventoselecionado = item;
        }
      }
    } 

    $scope.adicionarTipoEvento = function() {      
      if ($('#cadastroTipoEvento-form').valid()) {
        
        $scope.addTipoEvento.ativo = 1;
        $scope.addTipoEvento.tipo = 'Eventos';

        $scope.json = angular.toJson($scope.addTipoEvento);
                            
        $http.post('api/index.php/tipoevento/', $scope.json, 
                                       {withCredentials: true,
                                       headers: {'enctype': 'multipart/form-data' },
                                       }
        ).success(function(data, status, headers, config) {
            if (data.error == '0'){  

                Mensagem.success(data.mensagem);    
                
                $('#myModalTipoEvento').modal('hide');

                var novoTipo = {};
                novoTipo.id = data.id_tipoevento;
                novoTipo.descricao = $scope.addTipoEvento.descricao;
                novoTipo.tipo = $scope.addTipoEvento.tipo;

                $scope.tipoevento.push(novoTipo);
                
                $scope.addTipoEvento = {};
            }else{              
              Mensagem.error(data.mensagem);   
            }
        }).error(function(data, status) { 
          
        });
      }
    }
            

    $scope.tipoevento = []; 
    $scope.tipoeventos = [];
    $scope.tipoeventos.selecionados = [];   

    $scope.refreshTipoEvento = function(pessoa) { 
      $scope.tipoeventos = [];
      $scope.tipoeventos.selecionados = [];

      //$scope.tipoeventos.selecionados.splice(nivel, 1);
      
      $http.get('api/index.php/stringtipoevento').    
      success(function(data, status, headers, config) {                 
        if(data[0].error != -1){
          $scope.tipoevento = data;          
          angular.forEach(data, function(value, key) {
            
            angular.forEach(pessoa, function(value2, key2) {
              if(value.id == value2.id){
                $scope.tipoeventos.selecionados.push(data[key]);
              }
            });
          });

        }
      }).
      error(function(data, status, headers, config) {
        // log error
      });
    };  

    $scope.verificarAcao = function(item) {
      if (item.id==-1) {
        $scope.modalNovoTipoFornecedor();
        $scope.tipofornecedor.selected = '';
      }
      $scope.pessoa.id_tipo_fornecedor = item.id;
      $( "em[for='tipofornecedor']" ).css("display","none");    
    }

    $scope.getTipoFornecedor = function(){

        $http.get('api/index.php/tipofornecedor/0/').        
        success(function(data, status, headers, config) {                           
          $scope.tipofornecedores = data.tipofornecedor;
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }    

    $scope.modalNovoTipoFornecedor = function(size){
        $('#myModalTipoFornecedor').modal('show');        
    }      

    $scope.adicionarTipoFornecedor = function(){
      if ($('#cadastroTipoFornecedor-form').valid()) {
        
        $scope.addTipoFornecedor.ativo = 1;

        $scope.json = angular.toJson($scope.addTipoFornecedor);
                            
        $http.post('api/index.php/tipofornecedor/', $scope.json, 
                                       {withCredentials: true,
                                       headers: {'enctype': 'multipart/form-data' },
                                       }
        ).success(function(data, status, headers, config) {
            if (data.error == '0'){  

                Mensagem.success(data.mensagem);    
                
                $('#myModalTipoFornecedor').modal('hide');    

                $scope.getTipoFornecedor(); 
                
                $scope.addTipoFornecedor = {};
            }else{              
              Mensagem.error(data.mensagem);   
            }
        }).error(function(data, status) { 
          
        });
      }
    }    

    $scope.verificarAcaoCategoria = function(item) {

      $scope.pronome_tratamento = item.pronome_tratamento;
      $scope.documento = item.documento;

      if (item.id==-1) {
        $scope.modalNovoCategoria();
        $scope.categoria.selected = '';
      }
      $scope.pessoa.id_categoria_naoassociado = item.id;
      $( "em[for='categoria']" ).css("display","none");    
    }    

    $scope.verificarAcaoReligiao = function(item) {
      if (item.id==-1) {
        $scope.modalReligiao();
        $scope.religiao.selected = '';
      }
      $scope.pessoa.id_religiao = item.id;
      $( "em[for='religiao']" ).css("display","none");    
    } 

    $scope.verificarAcaoPronomeTratamento = function(item) {

      if (item.id==-1) {
        $scope.modalNovoFormaTratamento();
        $scope.forma_tratamento.selected = '';
      }
      $scope.contato.id_forma_tratamento = item.id;
      $( "em[for='forma_tratamento']" ).css("display","none");    
    } 


    $scope.verificarAcaoFormaTratamento = function(item) {
      if (item.id==-1) {
        $scope.modalFormaTratamento();
        $scope.forma_tratamento.selected = '';
      }
      $scope.contato.id_forma_tratamento = item.id;
      $( "em[for='forma_tratamento']" ).css("display","none");    
    }

    $scope.verificarAcaoCargo = function(item) {

      if (item.id==-1) {
        $scope.modalCargo();
        $scope.cargo.selected = '';
      }
      $scope.contato.id_cargo = item.id;
      $( "em[for='cargo']" ).css("display","none");    
    }     




    $scope.getCategoriaNaoAssociado = function(){
        $http.get('api/index.php/categorianaoassociado/0/').        
        success(function(data, status, headers, config) {                           
          $scope.categorias = data.categoria;
        }).
        error(function(data, status, headers, config) {
          // log error
        });              
    }          

    $scope.modalNovoCategoria = function(size){
        $('#myModalCategoria').modal('show');        
    }

    $scope.adicionarCategoria = function(){
      if ($('#cadastroCategoria-form').valid()) {
        
        $scope.addCategoria.ativo = 1;
        $scope.addCategoria.tipo = 0;

        $scope.json = angular.toJson($scope.addCategoria);
                            
        $http.post('api/index.php/categorianaoassociado/', $scope.json, 
                                       {withCredentials: true,
                                       headers: {'enctype': 'multipart/form-data' },
                                       }
        ).success(function(data, status, headers, config) {
            if (data.error == '0'){  

                Mensagem.success(data.mensagem);    
                
                $('#myModalCategoria').modal('hide');    

                $scope.getCategoriaNaoAssociado(); 
                
                $scope.addCategoria = {};
            }else{              
              Mensagem.error(data.mensagem);   
            }
        }).error(function(data, status) { 
          
        });
      }
    }   

    $scope.modalReligiao = function(size){
        $('#myModalReligiao').modal('show');        
    }

    $scope.adicionarReligiao = function() {      
      if ($('#cadastroReligiao-form').valid()) {
        
        $scope.addReligiao.ativo = 1;

        $scope.json = angular.toJson($scope.addReligiao);
                            
        $http.post('api/index.php/religiao/', $scope.json, 
                                       {withCredentials: true,
                                       headers: {'enctype': 'multipart/form-data' },
                                       }
        ).success(function(data, status, headers, config) {
            if (data.error == '0'){  

                Mensagem.success(data.mensagem);    
                
                $('#myModalReligiao').modal('hide');

                $scope.getReligiao();
                
                $scope.addReligiao = {};
            }else{              
              Mensagem.error(data.mensagem);   
            }
        }).error(function(data, status) { 
          
        });
      }
    }   

     $scope.modalCargo = function(size){
        $('#myModalCargo').modal('show');        
    }

    $scope.adicionarCargo = function() {      
      if ($('#cadastroCargo-form').valid()) {
        
        $scope.addCargo.ativo = 1;

        $scope.json = angular.toJson($scope.addCargo);
                            
        $http.post('api/index.php/cargo/', $scope.json, 
                                       {withCredentials: true,
                                       headers: {'enctype': 'multipart/form-data' },
                                       }
        ).success(function(data, status, headers, config) {
            if (data.error == '0'){  

                Mensagem.success(data.mensagem);    
                
                $('#myModalCargo').modal('hide');

                $scope.getCargo();
                
                $scope.addCargo = {};
            }else{              
              Mensagem.error(data.mensagem);   
            }
        }).error(function(data, status) { 
          
        });
      }
    }

    $scope.modalFormaTratamento = function(size){
        $('#myModalFormaTratamento').modal('show');        
    }

    $scope.adicionarFormaTratamento = function() {      
      if ($('#cadastroFormaTratamento-form').valid()) {
        
        $scope.addFormaTratamento.ativo = 1;

        $scope.json = angular.toJson($scope.addFormaTratamento);
                            
        $http.post('api/index.php/formatratamento/', $scope.json, 
                                       {withCredentials: true,
                                       headers: {'enctype': 'multipart/form-data' },
                                       }
        ).success(function(data, status, headers, config) {
            if (data.error == '0'){  

                Mensagem.success(data.mensagem);    
                
                $('#myModalFormaTratamento').modal('hide');

                $scope.getFormaTratamento();
                
                $scope.addFormaTratamento = {};
            }else{              
              Mensagem.error(data.mensagem);   
            }
        }).error(function(data, status) { 
          
        });
      }
    }

    $scope.getReligiao = function(){
      $http.get('api/index.php/religiao/0/').
        success(function(data, status, headers, config) {
          $scope.religioes = data.religiao;
        }).
        error(function(data, status, headers, config) {
          // log error
        });
    } 

    $scope.getFormaTratamento = function(){
      $http.get('api/index.php/formatratamento/0/').
        success(function(data, status, headers, config) {
          $scope.forma_tratamentos = data.forma_tratamento;
        }).
        error(function(data, status, headers, config) {
          // log error
        });
    }         
    
    //Inicializa Combos
    $scope.getCategoriaNaoAssociado();
    $scope.getReligiao();
    $scope.getCargo();
    $scope.getDepartamento();
    $scope.getFormaTratamento();
    $scope.coluna = "col-4";

    $scope.$watch('pronome_tratamento', function(){  
          
      if($scope.pronome_tratamento){              
        $scope.coluna = "col-3";
      } else {
        $scope.coluna = "col-4";
      }
    });    


        
    //Se houver pessoa, carrega pessoa    
    if (idPessoa != undefined) {
      $timeout(function() {
        $scope.getIdPessoa(idPessoa);
        $scope.getContatoPessoa(idPessoa);
      }, 800);      
    };  

    /*Calendario*/
    $scope.open = function($event,opened) {
      $event.preventDefault();
      $event.stopPropagation();

      $scope[opened] = true;
    };   

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd/MM/yyyy', 'shortDate'];
    $scope.format = $scope.formats[2];

    /*Validar datas*/
    $scope.$watch('pessoa.data_associacao', function(){  
      $scope.pessoa.data_associacao1 = $scope.pessoa.data_associacao;     
      if($scope.pessoa.data_associacao1 != undefined || $scope.pessoa.data_associacao1 != null){              
        $( "em[for='dataAssociacao']" ).css("display","none"); 
      }
    });

    /*$scope.$watch('beneficiario.data_nascimento', function(){ 
      $scope.beneficiario.data_nascimento1 = $scope.beneficiario.data_nascimento;     
      if($scope.beneficiario.data_nascimento1 != undefined || $scope.beneficiario.data_nascimento1 != null){    
        $( "em[for='dataNascimentoBeneficiario']" ).css("display","none"); 
      }
    });*/

});

//@ sourceURL=controller.formEntidades.js