smartSig.registerCtrl("formCadastroAluno", function($scope, $http, $routeParams, Mensagem, $timeout, $rootScope, $location, $modal, $filter, Permissao){

    $scope.permissoes = Permissao.validaPermissao();
    
    $scope.permissoes.then(function (data) {
        $scope.permissoes = data;
    }, function (status) {
    });
    
    var responsaveis = [
      {
        'tipo_responsavel': 'col col-xs-12 col-sm-12 col-md-3 col-lg-3',
        'nome': 'col col-xs-12 col-sm-12 col-md-5 col-lg-5',
        'data_nascimento': 'col col-xs-12 col-sm-12 col-md-4 col-lg-4',
        'login': ''
      },{
        'tipo_responsavel': 'col col-xs-12 col-sm-12 col-md-3 col-lg-3',
        'nome': 'col col-xs-12 col-sm-12 col-md-4 col-lg-4',
        'data_nascimento': 'col col-xs-12 col-sm-12 col-md-3 col-lg-3',
        'login': 'col col-xs-12 col-sm-12 col-md-2 col-lg-2'
      }
    ];
    
    $scope.$watch('responsavel.login', function(){ 
      if($scope.responsavel.login != '' && $scope.responsavel.login != undefined && $scope.responsavel.login != null){    
        $scope.config_responsaveis = responsaveis[1]; 
      }else{
        $scope.config_responsaveis = responsaveis[0]; 
      }
      console.log($scope.responsavel.login);
      console.log($scope.config_responsaveis);
    });

    var idPessoa = $routeParams.id;

    $scope.pessoa = {};
    $scope.error = '';  
    $scope.pessoa.ativo = 0;
    $scope.pessoa.nome_title = "Novo Cadastro";

    $scope.endereco = {};
    $scope.endereco.principal = 0;

    // objetos que são usado em combos dinâmicos
    $scope.religiao = {};
    $scope.religioes = [];
    $scope.orgaoemissor = {};
    $scope.orgaosemissores = [];
    $scope.tipoendereco = {};
    $scope.tiposenderecos = [];
    $scope.tipotelefone = {};
    $scope.tipostelefones = [];
    $scope.tiporesponsavel = {};
    $scope.tiposresponsaveis = [];
    $scope.tiponecessidadeespecial = []; 
    $scope.tiponecessidadesespeciais = [];
    $scope.tiponecessidadesespeciais.selecionados = [];   
    $scope.tipocontato = []; 
    $scope.tiposcontatos = [];
    $scope.tiposcontatos.selecionados = []; 
    $scope.cor_raca = {} ;
    $scope.cores_racas = {};
    $scope.documento = {};
    $scope.tipodocumento = {};
    $scope.tiposdocumentos = [];

    $scope.responsavel = {};
    $scope.telefone = {};
    $scope.filesDocumento = '';
    $scope.ocorrencia = {};
    $scope.ocorrencias = [];
    
    // objetos adicionais dos dados do aluno
    $scope.documentos = [];
    $scope.pendentes = [];
    $scope.enderecos = [];
    $scope.telefones = [];
    $scope.responsaveis = [];
    $scope.dados_medico = {};
    // objetos do cadastro de ocorrência
    $scope.gruposocorrencia = [];
    $scope.tiposocorrencia = [];
    $scope.textosocorrencia = [];
    $scope.disciplinas = [];
    $scope.funcionarios = [];
    $scope.grupoocorrencia = {};
    $scope.tipobloqueios = [];
    $scope.tipoocorrencia = {};
    $scope.texto_grupo_ocorrencia = {};

    $scope.telefone_numero_class = "col-xs-12 col-sm-12 col-md-8 col-lg-8";
    $scope.telefone_ramal_class = "";
    $scope.foto_show_file = "col col-xs-12 col-sm-12 col-md-3 col-lg-3";
    $scope.show_camp = "col col-xs-12 col-sm-12 col-md-3 col-lg-3";
    $scope.foto_show_data = "";
    $scope.pessoa_multi_select = "300";


    $scope.mascara = '';

    if(idPessoa == '' || idPessoa == null){
      $scope.thumb = 'foto_no_thumb.jpg';
    }


//Início - Métodos utilizados em várias abas **************************************************************************************
    //Início - carga de dados dos combo box
    $scope.getEstadoCivil = function(){
      $http.get('api/index.php/estadocivil/').
      success(function(data, status, headers, config) {
        $scope.estadocivil = data.estado_civil;
      }).
      error(function
        (data, status, headers, config) {
        // log error
      }); 
    }

    $scope.getPais = function(){
      $http.get('api/index.php/pais').
        success(function(data, status, headers, config) {
          $scope.pais = data;
        }).
        error(function(data, status, headers, config) {
          // log error
        });       
    }      

    $scope.getEstado = function(){

       $http.get('api/index.php/estado/').    
       success(function(data, status, headers, config) {                 
          $scope.estado = data;
       }).
       error(function(data, status, headers, config) {
          // log error
       });
         
    }  

    $scope.getCidade = function(uf){

      console.log('UF:',uf);

       $http.get('api/index.php/cidade/'+uf).
       success(function(data, status, headers, config) {                           
          $scope.cidades = data;
       }).
       error(function(data, status, headers, config) {
          // log error
       });

    }  

    $scope.getCorRaca = function(){
      $http.get('api/index.php/cor_raca/').
      success(function(data, status, headers, config) {

        $scope.cores_racas = data.cor_raca;
      }).
      error(function(data, status, headers, config) {
        // log error
      }); 
    }
    //Fim - carga de dados dos combo box

    // Funcionalidade para buscar listagem da pessoa que esta sendo digitada
    $scope.getPessoaExists = function(val) {
      return $http.get('api/index.php/stringpessoa?todos=1&', {
        params: {
          string: val,
          sensor: false
        }
      }).then(function(response){
        return response.data.pessoa;
      });
    };

    //busca um id no array de objetos passados e retorna o objeto
    $scope.findItem = function(id_find, array_list) {
      //procura o item na lista
      var found = $filter('filter')(array_list, {id: id_find}, true);
      var returnValue;
      //se encontrou retorna o objeto
      if (found.length) {
        returnValue = found[0];
      } else {
        returnValue = false;
      }
      return returnValue;
    }
//Fim - Métodos utilizados em várias abas **************************************************************************************



//Início - Aba 1 - Dados do aluno **************************************************************************************
    //Início - carga de dados dos combo box
    $scope.getReligiao = function(){
      $http.get('api/index.php/religiao/0/').
        success(function(data, status, headers, config) {
          $scope.religioes = data.religiao;
        }).
        error(function(data, status, headers, config) {
          // log error
        });
    }

    $scope.getOrgaoEmissor = function(){
      $http.get('api/index.php/orgaoemissor/0/').
        success(function(data, status, headers, config) {
          $scope.orgaosemissores = data['orgaoEmissor'];
        }).
        error(function(data, status, headers, config) {
          // log error
        });
    }
    //Fim - carga de dados dos combo box


    //Início - carga de dados dos combos de cadastro dinâmicos
    //Início - módulo de religião 
    $scope.verificarAcaoReligiao = function(item) {
      if (item.id==-1) {
        $scope.modalNovoReligiao(); //chana apresentação do modal
        $scope.religiao.selected = ''; //seleciona nenhuma religião
      }
      $scope.pessoa.id_religiao = item.id; //seta o id da religião no campo de religiao da pessoa
      //$( "em[for='religiao']" ).css("display","none"); //não deixa apresentar o campo
    }

    $scope.modalNovoReligiao = function(size){ //apresenta modal de religiao
        $('#myModalReligiao').modal('show');
    }

    $scope.adicionarReligiao = function(){ //objeto para salvar dados da religião
      if ($('#cadastroReligiao-form').valid()) {//valida formulário
        $scope.addReligiao.ativo = 1; //seta o campo ativo como true
        $scope.json = angular.toJson($scope.addReligiao); // transforma o objeto addReligiao para json
        $http.post('api/index.php/religiao/', $scope.json, //envia para a api os dados para cadastro da religião
                      {withCredentials: true,
                      headers: {'enctype': 'multipart/form-data' },
                      }
        ).success(function(data, status, headers, config) { //em caso de sucesso faça o seguinte
            if (data.error == '0'){ // retornou sem erro
              Mensagem.success(data.mensagem); // seta mensagem de sucesso
              $('#myModalReligiao').modal('hide'); // esconde a modal de cadastro
              $scope.getReligiao(); //busca a lista de religião novamente
              $scope.addReligiao = {}; // limpa o objeto addReligiao
            }else{ // retornado com erro
              Mensagem.error(data.mensagem);
            }
        }).error(function(data, status) {
        });
      }
    }
    //Fim - módulo de religião


    //Início - módulo de orgao emissor
    $scope.verificarAcaoOrgaoEmissor = function(item) {
      if (item.id==-1) {
        $scope.modalNovoOrgaoEmissor();
        $scope.orgaoemissor.selected = '';
      }
      $scope.documento.id_orgao_emissor = item.id; 
      $( "em[for='id_orgao_rg_emissor']" ).css("display","none");    
    }

    $scope.modalNovoOrgaoEmissor = function(size){
        $('#myModalOrgaoEmissor').modal('show');
    }

    $scope.adicionarOrgaoEmissor = function(){
      if ($('#cadastroOrgaoEmissor-form').valid()) {
        $scope.addOrgaoEmissor.ativo = 1;
        $scope.json = angular.toJson($scope.addOrgaoEmissor);
        $http.post('api/index.php/orgaoemissor/', $scope.json,
                      {withCredentials: true,
                      headers: {'enctype': 'multipart/form-data' },
                      }
        ).success(function(data, status, headers, config) {
            if (data.error == '0'){
              Mensagem.success(data.mensagem);
              $('#myModalOrgaoEmissor').modal('hide');
              $scope.getOrgaoEmissor();
              $scope.addOrgaoEmissor = {};
            }else{
              Mensagem.error(data.mensagem);
            }
        }).error(function(data, status) {
        });
      }
    }
    //Fim - módulo de orgao emissor


    //Início - módulo de tipo de necessidade especial
    $scope.refreshTipoNecessidadeEspecial = function(pessoa){ 
      $http.get('api/index.php/tiponecessidadesespeciais').    
        success(function(data, status, headers, config) {                 
          $scope.tiponecessidadeespecial = data['tiponecessidadesespeciais'];
          angular.forEach(data['tiponecessidadesespeciais'], function(value, key) {
            angular.forEach(pessoa, function(value2, key2) {
              if(value.id == value2.id){
                $scope.tiponecessidadesespeciais.selecionados.push(data['tiponecessidadesespeciais'][key]);
              }
            });
          });
        }).
        error(function(data, status, headers, config) {
          // log error
        });
    };  

    $scope.setarTipoNecessidadesEspeciaisSelecionado = function(item, select) {
      if(item.length > 0){
        var nivel = item.length - 1;
        if(item[nivel].id==-1){
          $scope.modalNovoTipoNecessidadesEspeciais();          
          item.pop();
        }else{
          $scope.pessoa.tiponecessidadeespecialselecionado = item;
        }
      }
    }
    $scope.modalNovoTipoNecessidadesEspeciais = function(size){
      $('#myModalTipoNecessidadesEspeciais').modal('show');
    }

    $scope.adicionarTipoNecessidadesEspeciais = function(){
      if ($('#cadastroTipoNecessidade-form').valid()) {
        $scope.addTipoNecessidade.ativo = 1;
        $scope.json = angular.toJson($scope.addTipoNecessidade);
        $http.post('api/index.php/tiponecessidadesespeciais/', $scope.json,
                      {withCredentials: true,
                      headers: {'enctype': 'multipart/form-data' },
                      }
        ).success(function(data, status, headers, config) {
            if (data.error == '0'){
              Mensagem.success(data.mensagem);
              $('#myModalTipoNecessidadesEspeciais').modal('hide');
              var novoTipo = {};
              novoTipo.id = data.id_tiposnecessidadesespeciais;
              novoTipo.descricao = $scope.addTipoNecessidade.descricao;
              $scope.tiponecessidadeespecial.push(novoTipo);
              $scope.addTipoNecessidade = {};
            }else{
              Mensagem.error(data.mensagem);
            }
        }).error(function(data, status) {
        });
      }
    }    
    //Fim - módulo de tipo de necessidade especial


    //Início - módulo de tipo de contato

    $scope.refreshTipoContato = function(pessoa){ 
      $http.get('api/index.php/tipodecontato').    
        success(function(data, status, headers, config) {                 
          $scope.tipocontato = data['tipocontato'];
          angular.forEach(data['tipocontato'], function(value, key) {
            //deixa selecionado os itens carregados passados por pessoa
            angular.forEach(pessoa, function(value2, key2) {
              if(value.id == value2.id){
                //adiciona aos itens selecionados
                $scope.tiposcontatos.selecionados.push(data['tipocontato'][key]);
              }
            });
          });
        }).
        error(function(data, status, headers, config) {
          // log error
        });
    };  


    /*
    $scope.setarTipoContatoSelecionado = function(item, select) {
      if(item.length > 0){
        var nivel = item.length - 1;
        if(item[nivel].id == -1){  
          $('#myModalTipoContato').modal('show');
          select.removeChoice(nivel);                     
        }else{
          $scope.pessoa.tipocontatoselecionado = item;
        }
      }
    };*/

    $scope.setarTipoContatoSelecionado = function(item, select) {
      if(item.length > 0){
        var nivel = item.length - 1;
        if(item[nivel].id==-1){
          $scope.modalNovoTipoContato();          
          item.pop();
        }else{
          $scope.pessoa.tipocontatoselecionado = item;
        }
      }
    }
    $scope.modalNovoTipoContato = function(size){
      $('#myModalTipoContato').modal('show');
    }

    $scope.adicionarTipoContato = function(){
      if ($('#cadastroTipoContato-form').valid()) {
        $scope.addTipoContato.ativo = 1;
        $scope.json = angular.toJson($scope.addTipoContato);
        $http.post('api/index.php/tipodecontato/', $scope.json,
                      {withCredentials: true,
                      headers: {'enctype': 'multipart/form-data' },
                      }
        ).success(function(data, status, headers, config) {
            if (data.error == '0'){
              Mensagem.success(data.mensagem);
              $('#myModalTipoContato').modal('hide');
              var novoTipo = {};
              novoTipo.id = data.id_tipocontato;
              novoTipo.descricao = $scope.addTipoContato.descricao;
              $scope.tipocontato.push(novoTipo);
              $scope.addTipoContato = {};
            }else{
              Mensagem.error(data.mensagem);
            }
        }).error(function(data, status) {
        });
      }
    }    
    //Fim - módulo de tipo de contato
    //Fim - carga de dados dos combos de cadastro dinâmicos


    //funcionalidade para cadastrar dados da pessoa
    $scope.posicionaCampos = function(){
      $scope.foto_show_data = "col col-xs-12 col-sm-12 col-md-2 col-lg-2";
      $scope.foto_show_file = "col col-xs-12 col-sm-12 col-md-6 col-lg-6";
      $scope.show_camp = "col col-xs-12 col-sm-12 col-md-4 col-lg-4";
    }

    $scope.cadastrarAluno = function(){

      if ($('#cadastroAluno-form').valid()) {
        SalvarAluno.disabled = true;
        $scope.json = angular.toJson($scope.pessoa);
        $http.post('api/index.php/aluno/', $scope.json,{withCredentials: true,headers: {'enctype': 'multipart/form-data' },})
        .success(function(data, status, headers, config) {

          if (data.error == '0')
          {  
            $scope.pessoa.id = data.id;
            $scope.pessoa.codigo = data.codigo_aluno;
            
            if ($scope.files != null) {
              $scope.uploadFile($scope.files, $scope.pessoa.id);
            };

            $scope.pessoa.nome_title = $scope.pessoa.nome;
            $scope.pessoa.login = data.login;

            $scope.posicionaCampos();
            
            Mensagem.success(data.mensagem);

           // $scope.getIdPessoa($scope.pessoa.id);
          } else {
            Mensagem.error(data.mensagem);
          }
        }).error(function(data, status) { 
          //log erro
        });
      } else{
        Mensagem.error('Por favor, preencha os campos obrigatórios');
      }
      SalvarAluno.disabled = false;
    }

    //funcionalidade para limpar dados do aluno para novo cadastro de aluno
    $scope.novoCadastroAluno = function(){
      $scope.pessoa = {};
      $scope.pessoa.nome_title = "Novo Cadastro";
      $scope.responsavel = {};
      $scope.telefone = {};
      $scope.endereco = {};
      $scope.enderecos = [];
      $scope.telefones = [];
      $scope.responsaveis = [];
      $scope.dados_medico = {};
      $scope.tiposcontatos.selecionados = [];
      $scope.tiponecessidadesespeciais.selecionados = [];
      $scope.religiao = {};
      $scope.orgaoemissor = {};

      $scope.getDocumentoPendente();
      $scope.documento = {};
      $scope.filesDocumento = '';
      $scope.documentos = [];
      $scope.documento.arquivo = '';
      $scope.ocorrencias = [];
      $scope.ocorrencia = {};
      $scope.thumb = 'foto_no_thumb.jpg';
      //ocorrencias
      //
    }

    // Método para calcular a idade do aluno - recebe o campo de idade como parâmetro
    $scope.calculateAge = function calculateAge(birthday) { // birthday is a date
      //verifica se o campo existe e se o valor passado não é string, pois deve ser objeto
      if (birthday && !angular.isString(birthday)){
        var ageDifMs = Date.now() - birthday.getTime();
        var ageDate = new Date(ageDifMs); // miliseconds from epoch
        var returnValue = Math.abs(ageDate.getUTCFullYear() - 1970);
        return returnValue;
      }
    }


    //funcionalidade para buscar dados do aluno que foi passado o id
    $scope.getIdPessoa = function(idPessoa){

      $http.get('api/index.php/aluno/'+idPessoa).
        success(function(data, status, headers, config) {
          $scope.pessoa = data.pessoa[0];
          $scope.pessoa.nome_title = $scope.pessoa.nome;
          $scope.thumb = data.pessoa[0].foto;

          $scope.endereco.id_pessoa = $scope.pessoa.id;
          $scope.telefone.id_pessoa = $scope.pessoa.id;
          $scope.responsavel.id_pessoa_aluno = $scope.pessoa.id;
          $scope.dados_medico.id_pessoa = $scope.pessoa.id;
          $scope.religiao = {selected : {"id":$scope.pessoa.id_religiao,"descricao":$scope.pessoa.religiao}};
          $scope.orgaoemissor = {selected : {"id":$scope.pessoa.id_orgao_rg_emissor, "descricao":$scope.pessoa.orgao_rg_emissor}};

          if (data.pessoa[0].tipo_contato) {
            $scope.refreshTipoContato(data.pessoa[0].tipo_contato);
          }
          if (data.pessoa[0].tipo_necessidades_especiais) {
            $scope.refreshTipoNecessidadeEspecial(data.pessoa[0].tipo_necessidades_especiais);
          }

          $scope.getDocumentos(idPessoa);
          $scope.getEnderecos(idPessoa);
          $scope.getTelefones(idPessoa);
          $scope.getResponsaveis(idPessoa);
          $scope.getDadosMedico(idPessoa);

          $scope.getDocumentoPendente(idPessoa);
          $scope.getOcorrencia(idPessoa);
          if ( $scope.pessoa != '' && $scope.pessoa != null ){
            $scope.posicionaCampos();
            $scope.pessoa_multi_select = "300";
          }
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }

    // Funcionalidade para buscar dados da pessoa que foi digitada
    $scope.passaPessoa = function(item, model, label){        
      $scope.getIdPessoa(item.id);
    }

    $scope.armazenaFile = function(files) {
      $scope.files = files;
    }; 

    $scope.uploadFile = function(files,id) {
      var fd = new FormData();
      file = files.files[0];
      if(file){
        fd.append("file", file);
        $http.post('api/index.php/uploadfile/'+id, fd, {
            withCredentials: true,
            headers: {'Content-Type': undefined },
            transformRequest: angular.identity
        }).success(function(data, status, headers, config) {
          $scope.thumb = 'foto_'+data.arquivo;
        }).error(function(data, status) { 
        });
      }
    }; 

    //método para verificar se calendário foi alterado
    $scope.$watch('pessoa.data_nascimento', function(){ 
      $scope.pessoa.data_nascimento1 = $scope.pessoa.data_nascimento;     
      if($scope.pessoa.data_nascimento1 != undefined || $scope.pessoa.data_nascimento1 != null){    
        $( "em[for='dataNascimento']" ).css("display","none"); 
      }
    });

    $scope.$watch('pessoa.data_nascimento_responsavel', function(){ 
      $scope.pessoa.data_nascimento_responsavel1 = $scope.pessoa.data_nascimento_responsavel;     
      if($scope.pessoa.data_nascimento_responsavel1 != undefined || $scope.pessoa.data_nascimento_responsavel1 != null){    
        $( "em[for='pessoa_dataNascimentoResponsavel']" ).css("display","none"); 
      }
    });

    $scope.$watch('documento.data_entrada_pais', function(){ 
      $scope.documento.data_entrada_pais1 = $scope.documento.data_entrada_pais;     
      if($scope.documento.data_entrada_pais1 != undefined || $scope.documento.data_entrada_pais1 != null){    
        $( "em[for='data_entrada_pais']" ).css("display","none"); 
      }
    });
    
//Fim - Aba 1 - Dados do aluno **************************************************************************************



//Início - Aba 2 - Documentos do aluno **************************************************************************************
    //Início - carga de dados dos combo box
    $scope.getTipoDocumento = function(){
      $http.get('api/index.php/tipodocumento/').
        success(function(data, status, headers, config) {
          $scope.tiposdocumentos = data;
        }).
        error(function(data, status, headers, config) {
          // log error
        });
    }

    //Início cadastro e edição de dados adicionais
    //Início cadastro e edição de dados adicionais de documento
    $scope.editarDocumento = function($index) {   
      angular.copy($scope.documentos[$index], $scope.documento);
      $scope.tipodocumento = {selected : {"id":$scope.documento.id_tipo_documento,"descricao":$scope.documento.documento}};
    }

    $scope.removeLinhaDocumento = function($index){
      $scope.documentos[$index].ativo = 0;
      $scope.json = angular.toJson($scope.documentos[$index]);
      $http.post('api/index.php/documento/', $scope.json,
                                     {withCredentials: true,
                                     headers: {'enctype': 'multipart/form-data' },
                                     }
      ).success(function(data, status, headers, config) {
        if (data.error == '0') {
          Mensagem.success('Documento excluido con sucesso!');
          $scope.documentos.splice($index, 1);
        }
        else {
          Mensagem.error(data.mensagem);
        }
      }).error(function(data, status) {
          //log
      });
    }

    $scope.armazenaFileDocumento = function(files) {
        $scope.filesDocumento = files;
    }; 

    $scope.verificarAcaoTipoDocumento = function(item) {
      if (item.id == -1) {
        $scope.modalNovoTipoDocumento();
        $scope.tipodocumento.selected = '';
      }
      $scope.documento.id_tipo_documento = item.id; 
    }

    $scope.novoDocumentoAluno = function(){
      $scope.documento.ativo = 1;
      $scope.documento.id = "";
      //fazer parte de arquivob
      //$scope.telefone.mensagem = "";
      $scope.documento.numero = "";
      $scope.tipodocumento = {};
      $scope.documento.arquivo = "";
      console.log("arquivo = ", $scope.documento.arquivo);
      $scope.filesDocumento = "";
    }

    $scope.cadastrarDocumentoPessoa = function(objeto) {
      if ($scope.pessoa.id==undefined) {
        Mensagem.error('Por favor, é necessário cadastrar os dados do aluno primeiro.');
      } else {
        if ($('#cadastroDocumento-form').valid()) {
          SalvarTelefone.disabled = true;
          $scope.documento.id_pessoa = $scope.pessoa.id;
          $scope.documento.ativo = 1;
          $scope.json = angular.toJson($scope.documento);
          $http.post('api/index.php/documento/', $scope.json, 
                                         {withCredentials: true,
                                         headers: {'enctype': 'multipart/form-data' },
                                         }
          ).success(function(data, status, headers, config) {
             if (data.error == '0')
             {
                $scope.getDocumentos($scope.pessoa.id);
                
                //montar parte de enviar o arquivo
                if (typeof $scope.filesDocumento == 'object' && data.id) {              
                  $scope.uploadFileDocumento($scope.filesDocumento, data.id, data.documento);
                };

                $scope.novoDocumentoAluno();
                
                Mensagem.success(data.mensagem);
             }
             else
             {
                Mensagem.error(data.mensagem);
             }
          }).error(function(data, status) { 
            //log erro
          });
        } /*else {
          Mensagem.error('Por favor, preencha os campos obrigatórios');
        }*/
        SalvarTelefone.disabled = false;
      }
    }


    $scope.uploadFileDocumento = function(files,id,tipo) {   
      var fd = new FormData();
      file = files.files[0];
      if(file){
        fd.append("file", file);
        $http.post('api/index.php/uploadfiledocumento/'+id+'/'+tipo, fd, {
            withCredentials: true,
            headers: {'Content-Type': undefined },
            transformRequest: angular.identity
        }).success(function(data, status, headers, config) {
          console.log(data);
        }).error(function(data, status) { 
          //log_error
        });
      }
    }; 
    //Fim cadastro adicional de documento
    //Fim cadastro e edição de dados adicionais

    //Busca lista de documentos do aluno
    $scope.getDocumentos = function(id){
      $http.get('api/index.php/documento/'+id).
      success(function(data, status, headers, config) {
        var carregaDados = true;
        if ( angular.isArray(data) ){
          if (data.length == 1){
            if ( data[0].error == '-1' ) {
              carregaDados = false;
            }
          }
        }
        if ( carregaDados ){
          $scope.documentos = $filter('filter')(data, {'ativo': 1});  
        }
      }).
      error(function(data, status, headers, config) {
        // log error
      }); 
    }

    //método para verificar se calendário foi alterado
    $scope.$watch('documento.data_emissao', function(){ 
      $scope.documento.data_emissao1 = $scope.documento.data_emissao;     
      if($scope.documento.data_emissao1 != undefined || $scope.documento.data_emissao1 != null){            $( "em[for='data_emissao']" ).css("display","none"); 
      }
    });
//Fim - Aba 2 - Documentos do aluno **************************************************************************************


//Início - Aba 3 - Documentos pendentes **************************************************************************************
    //Início - carga de dados dos combo box
    $scope.getDocumentoPendente = function(id){
      $http.get('api/index.php/pendentedocumento/'+id).
        success(function(data, status, headers, config) {
          $scope.pendentes = data;
        }).
        error(function(data, status, headers, config) {
          // log error
        });
    }
    //Fim - carga de dados dos combo box

    $scope.updatePendente = function($index){
      if ($scope.pessoa.id==undefined)
      {
        Mensagem.error('Por favor, é necessário cadastrar os dados do aluno primeiro.');
      }
      else {
        //validar o id de pessoa antes de cadastrar
        var obj = {
          'id' : $scope.pendentes[$index].id_pessoa_documento_pendente,
          'id_pessoa' : $scope.pessoa.id,
          'id_lista_documento' : $scope.pendentes[$index].id,
          'pendente' : !$scope.pendentes[$index].pendente,
          'ativo' : 1
        };
        
        console.log('pendentes', obj);
        
        $scope.json = angular.toJson(obj);
        $http.post('api/index.php/pendentedocumento/', $scope.json,
                                       {withCredentials: true,
                                       headers: {'enctype': 'multipart/form-data' },
                                       }
        ).success(function(data, status, headers, config) {
          if (data.error == '0') {
            Mensagem.success(data.mensagem);
            
            //$scope.pendentes[$index] = obj;
            $scope.pendentes[$index].id_pessoa_documento_pendente = data.id;
            $scope.pendentes[$index].id_pessoa = obj.id_pessoa;
            $scope.pendentes[$index].pendente = obj.pendente;

            console.log('resultado', $scope.pendentes[$index]);
            //$scope.getDocumentoPendente($scope.pessoa.id)
          }
          else {
            Mensagem.error(data.mensagem);
          }
        }).error(function(data, status) {
            //log
        });
      }
    }  
//Fim - Aba 3 - Documentos pendentes **************************************************************************************


//Início - Aba 4 - Endereços **************************************************************************************
    //Início - carga de dados dos combo box
    $scope.getTipoEndereco = function(){
      $http.get('api/index.php/tipoendereco/').
        success(function(data, status, headers, config) {
          $scope.tiposenderecos = data['tipoEndereco'];          
        }).
        error(function(data, status, headers, config) {
          // log error
        });
    }
    //Fim - carga de dados dos combo box


    //Início - carga de dados dos combos de cadastro dinâmicos
    //Início - módulo de tipo de endereço
    $scope.verificarAcaoTipoEndereco = function(item) {
      if (item.id==-1) {
        $scope.modalNovoTipoEndereco();
        $scope.tipoendereco.selected = '';
      }
      $scope.endereco.id_tipo_endereco = item.id; 
    }

    $scope.modalNovoTipoEndereco = function(size){
        $('#myModalTipoEndereco').modal('show');
    }

    $scope.adicionarTipoEndereco = function(){
      if ($('#cadastroTipoEndereco-form').valid()) {
        $scope.addTipoEndereco.ativo = 1;
        $scope.json = angular.toJson($scope.addTipoEndereco);
        $http.post('api/index.php/tipoendereco/', $scope.json,
                      {withCredentials: true,
                      headers: {'enctype': 'multipart/form-data' },
                      }
        ).success(function(data, status, headers, config) {
            if (data.error == '0'){
              Mensagem.success(data.mensagem);
              $('#myModalTipoEndereco').modal('hide');
              $scope.getTipoEndereco();
              $scope.addTipoEndereco = {};
            }else{
              Mensagem.error(data.mensagem);
            }
        }).error(function(data, status) {
        });
      }
    }
    //Fim - módulo de tipo de endereço
    //Fim - carga de dados dos combos de cadastro dinâmicos


    //Início cadastro e edição de dados adicionais
    //Início cadastro e edição de dados adicionais endereço
    $scope.editarEndereco = function($index) { 
      angular.copy($scope.enderecos[$index], $scope.endereco);
      $scope.getCidade($scope.endereco.estado); //FRH
      $scope.tipoendereco.selected = {"descricao": $scope.endereco.tipo_endereco};
    }

    $scope.removeLinhaEndereco = function($index){
      $scope.enderecos[$index].ativo = 0;
      $scope.json = angular.toJson($scope.enderecos[$index]);
      $http.post('api/index.php/enderecoaluno/', $scope.json, 
                                     {withCredentials: true,
                                     headers: {'enctype': 'multipart/form-data' },
                                     }
      ).success(function(data, status, headers, config) {
        if (data.error == '0') {  
          Mensagem.success(data.mensagem);
          $scope.enderecos.splice($index, 1);
        } 
        else {
          Mensagem.error(data.mensagem);
        }
      }).error(function(data, status) { 
          //log
      });
    }

    $scope.novoEnderecoAluno = function(){
      $scope.endereco.cep = "";
      $scope.endereco.ativo = 1;
      $scope.endereco.bairro = "";
      $scope.endereco.principal = 0;
      $scope.endereco.cidade = "";
      $scope.endereco.complemento = "";
      $scope.endereco.data_cadastro = "";
      $scope.endereco.estado = "";
      $scope.endereco.id = "";
      $scope.endereco.id_pais = "";
      $scope.endereco.logradouro = "";
      $scope.endereco.numero = "";
      $scope.endereco.observacao = "";
      $scope.tipoendereco = {};
    }

    $scope.cadastrarEnderecoPessoa = function() {
      if ($scope.pessoa.id==undefined)
      {
        Mensagem.error('Por favor, é necessário cadastrar os dados do aluno primeiro.');
      }
      else {
        if ($('#cadastroEndereco-form').valid()) {
          SalvarEndereco.disabled = true;
          $scope.endereco.id_pessoa = $scope.pessoa.id;
          $scope.json = angular.toJson($scope.endereco);
          $http.post('api/index.php/enderecoaluno/', $scope.json, 
                                         {withCredentials: true,
                                         headers: {'enctype': 'multipart/form-data' },
                                         // transformRequest: angular.identity
                                         }
          ).success(function(data, status, headers, config) {
             if (data.error == '0')
             {  
                Mensagem.success(data.mensagem);
                $scope.getEnderecos($scope.pessoa.id);
                $scope.novoEnderecoAluno();
             }
             else
             {
                Mensagem.error(data.mensagem);
             }
          }).error(function(data, status) { 
            //log erro
          });
        } else {
          Mensagem.error('Por favor, preencha os campos obrigatórios');
        }
        SalvarEndereco.disabled = false;
      }
    }
    //Fim cadastro e edição de dados adicionais endereço
    //Fim cadastro e edição de dados adicionais


    // Busca dados do CEP informado no campo
    $scope.getCep = function(id){
      $http.get('api/index.php/cep/'+$scope.endereco.cep).
      success(function(data, status, headers, config) {
        if(data[0].error == -1){
          $scope.error = data[0].mensagem;
          Mensagem.error(data[0].mensagem);
        }else{
          var idPessoa = $scope.endereco.id_pessoa;
          $scope.endereco.cep = data[0].endereco.cep;
          $scope.endereco.logradouro = data[0].endereco.logradouro;
          $scope.endereco.bairro = data[0].endereco.bairro;
          var estadoAnterior = $scope.endereco.estado;
          $scope.endereco.estado = data[0].endereco.estado;
          $scope.endereco.id_pais = data[0].endereco.idPais;
          
          if ( $scope.endereco.estado != estadoAnterior ){
            angular.forEach(data[0].estados, function(value, key) {
              if($scope.endereco.estado == value.uf){
                $scope.cidades = data[0].estados[key].cidades;
              }
            });
          }                           
          $scope.endereco.cidade = data[0].endereco.cidade;
        }
      }).
      error(function(data, status, headers, config) {
        // log error
      });
    }

    //Busca lista de endereços do aluno
    $scope.getEnderecos = function(id){
      $http.get('api/index.php/endereco/'+id).
      success(function(data, status, headers, config) {
        $scope.enderecos = $filter('filter')(data['endereco'], {'ativo': 1});
      }).
      error(function(data, status, headers, config) {
        // log error
      }); 
    }

//Fim - Aba 4 - Endereços **************************************************************************************



//Início - Aba 5 - Telefones **************************************************************************************
    //Início - carga de dados dos combo box
    $scope.getTipoTelefone = function(){
      $http.get('api/index.php/tipotelefone/').
        success(function(data, status, headers, config) {
          $scope.tipostelefones = data.tipo_telefone;          
        }).
        error(function(data, status, headers, config) {
          // log error
        });
    }
    //Fim - carga de dados dos combo box


    //Início - carga de dados dos combos de cadastro dinâmicos
    //Início - módulo de tipo de telefone
    $scope.verificarAcaoTipoTelefone = function(item) {
      if (item.id == -1) {
        $scope.modalNovoTipoTelefone();
        $scope.tipotelefone.selected = '';
      }
      $scope.telefone.id_tipo_telefone = item.id; 
      if($scope.telefone.id_tipo_telefone==3){ 
        $scope.mascara=16; 
      }else{ 
        $scope.mascara=15; 
      }
    }

    $scope.modalNovoTipoTelefone = function(size){
        $('#myModalTipoTelefone').modal('show');
    }

    $scope.adicionarTipoTelefone = function(){
      if ($('#cadastroTipoTelefone-form').valid()) {
        $scope.addTipoTelefone.ativo = 1;
        $scope.json = angular.toJson($scope.addTipoTelefone);
        $http.post('api/index.php/tipotelefone/', $scope.json,
                      {withCredentials: true,
                      headers: {'enctype': 'multipart/form-data' },
                      }
        ).success(function(data, status, headers, config) {
            if (data.error == '0'){
              Mensagem.success(data.mensagem);
              $('#myModalTipoTelefone').modal('hide');
              $scope.getTipoTelefone();
              $scope.addTipoTelefone = {};
            }else{
              Mensagem.error(data.mensagem);
            }
        }).error(function(data, status) {
        });
      }
    }
    //Fim - módulo de tipo de telefone
    //Fim - carga de dados dos combos de cadastro dinâmicos


    //Início cadastro e edição de dados adicionais
    //Início cadastro e edição de dados adicionais de telefone
    $scope.editarTelefone = function($index) {   
      angular.copy($scope.telefones[$index], $scope.telefone);
      $scope.tipotelefone.selected = {"id": $scope.telefone.id_tipo_telefone,"descricao": $scope.telefone.tipo_telefone};
    }

    $scope.removeLinhaTelefone = function($index){
      $scope.telefones[$index].ativo = 0;
      $scope.json = angular.toJson($scope.telefones[$index]);
      $http.post('api/index.php/telefone/', $scope.json,
                                     {withCredentials: true,
                                     headers: {'enctype': 'multipart/form-data' },
                                     }
      ).success(function(data, status, headers, config) {
        if (data.error == '0') {
          Mensagem.success(data.mensagem);
          $scope.telefones.splice($index, 1);
        }
        else {
          Mensagem.error(data.mensagem);
        }
      }).error(function(data, status) {
          //log
      });
    }

    $scope.novoTelefoneAluno = function(){
      $scope.telefone.ativo = 1;
      $scope.telefone.id = "";
      $scope.telefone.mensagem = "";
      $scope.telefone.numero_telefone = "";
      $scope.telefone.observacao = "";
      $scope.telefone.principal = "";
      $scope.telefone.ramal = "";
      $scope.tipotelefone = {};
    }

    $scope.cadastrarTelefonePessoa = function(objeto) {
      if ($scope.pessoa.id==undefined)
      {
        Mensagem.error('Por favor, é necessário cadastrar os dados do aluno primeiro.');
      }
      else {
        if ($('#cadastroTelefone-form').valid()) {
          SalvarTelefone.disabled = true;
          $scope.telefone.id_pessoa = $scope.pessoa.id;
          $scope.telefone.ativo = 1;
          $scope.telefone.numero = $scope.telefone.numero_telefone + $scope.telefone.ramal;
          
          $scope.json = angular.toJson($scope.telefone);
          $http.post('api/index.php/telefone/', $scope.json, 
                                         {withCredentials: true,
                                         headers: {'enctype': 'multipart/form-data' },
                                         }
          ).success(function(data, status, headers, config) {
             if (data.error == '0')
             {
                /*
                Inserir e atualizar dados diretamente no array de objetos telefone
                dadoTipoTelefone = $filter('filter')($scope.tipotelefone, {'id' :  $scope.telefone.id_tipo_telefone});
                $scope.telefone.tipo_telefone = dadoTipoTelefone.selected.descricao;
                var dataTemp = $scope.findItem($scope.telefone.id, $scope.telefones);
                if ( dataTemp ) {
                  angular.copy($scope.telefone, dataTemp);
                } else {
                 $scope.telefones.push($scope.telefone);
                }
                */
                $scope.getTelefones($scope.pessoa.id);
                $scope.novoTelefoneAluno();
                Mensagem.success(data.mensagem);
             }
             else
             {
                Mensagem.error(data.mensagem);
             }
          }).error(function(data, status) { 
            //log erro
          });
        } else {
          Mensagem.error('Por favor, preencha os campos obrigatórios');
        }
        SalvarTelefone.disabled = false;
      }
    }   
    //Fim cadastro adicional de telefone
    //Fim cadastro e edição de dados adicionais


    //Busca lista de telefones do aluno
    $scope.getTelefones = function(id){
      $http.get('api/index.php/telefone/'+id).
      success(function(data, status, headers, config) {
        var carregaDados = true;
        if ( angular.isArray(data) ){
          if (data.length == 1){
            if ( data[0].error == '-1' ) {
              carregaDados = false;
            }
          }
        }
        if ( carregaDados ){
          $scope.telefones = $filter('filter')(data, {'ativo': 1});
        }
      }).
      error(function(data, status, headers, config) {
        // log error
      }); 
    }

    //alterar a forma de apresentar os dados do telefone
    $scope.$watch( 'telefone.id_tipo_telefone', function(){
      //if ( $scope.tipotelefone.selected.id )
      if ( $scope.tipotelefone.selected ){
        if ( $scope.tipotelefone.selected.id == 2 ){
          $scope.telefone_numero_class = "col-xs-12 col-sm-12 col-md-6 col-lg-6";
          $scope.telefone_ramal_class = "col-xs-3 col-sm-3 col-md-2 col-lg-2";
        } else {
          $scope.telefone_numero_class = "col-xs-12 col-sm-12 col-md-8 col-lg-8";
        }
      } else {
        $scope.telefone_numero_class = "col-xs-12 col-sm-12 col-md-8 col-lg-8";
      }
    });
//Fim - Aba 5 - Telefones **************************************************************************************



//Início - Aba 6 - Responsáveis **************************************************************************************
    //Início - carga de dados dos combo box
    $scope.getTipoResponsavel = function(){
      $http.get('api/index.php/tiporesponsavel/0/').
        success(function(data, status, headers, config) {
          $scope.tiposresponsaveis = data['tipoResponsavel'];
        }).
        error(function(data, status, headers, config) {
          // log error
        });
    }
    //Fim - carga de dados dos combo box


    //Início - carga de dados dos combos de cadastro dinâmicos
    //Início - módulo de tipo de responsável
    $scope.verificarAcaoTipoResponsavel = function(item) {
      if (item.id==-1) {
        $scope.modalNovoTipoResponsavel();
        $scope.tiporesponsavel.selected = '';
      }
      $scope.responsavel.id_tipo_responsavel = item.id; 
    }

    $scope.modalNovoTipoResponsavel = function(size){
        $('#myModalTipoResponsavel').modal('show');
    }

    $scope.adicionarTipoResponsavel = function(){
      if ($('#cadastroTipoResponsavel-form').valid()) {
        $scope.addTipoResponsavel.ativo = 1;
        $scope.json = angular.toJson($scope.addTipoResponsavel);
        $http.post('api/index.php/tiporesponsavel/', $scope.json,
                      {withCredentials: true,
                      headers: {'enctype': 'multipart/form-data' },
                      }
        ).success(function(data, status, headers, config) {
            if (data.error == '0'){
              Mensagem.success(data.mensagem);
              $('#myModalTipoResponsavel').modal('hide');
              $scope.getTipoResponsavel();
              $scope.addTipoResponsavel = {};
            }else{
              Mensagem.error(data.mensagem);
            }
        }).error(function(data, status) {
        });
      }
    }
    //Fim - módulo de tipo de responsável
    //Fim - carga de dados dos combos de cadastro dinâmicos


    //Início cadastro e edição de dados adicionais
    //Início cadastro e edição de dados adicionais responsavel
    $scope.editarResponsavel = function($index) {
      angular.copy($scope.responsaveis[$index], $scope.responsavel);
      $scope.tiporesponsavel.selected = {"descricao": $scope.responsavel.tipo_responsavel};
    }

    $scope.removeLinhaResponsavel = function($index){
      $scope.responsaveis[$index].ativo = 0;
      $scope.json = angular.toJson($scope.responsaveis[$index]);
      $http.post('api/index.php/responsavel/', $scope.json,
                                     {withCredentials: true,
                                     headers: {'enctype': 'multipart/form-data' },
                                     }
      ).success(function(data, status, headers, config) {
        if (data.error == '0') {
          Mensagem.success(data.mensagem);
          $scope.responsaveis.splice($index, 1);
        }
        else {
          Mensagem.error(data.mensagem);
        }
      }).error(function(data, status) {
          //log
      });
    }

    $scope.novoResponsavelAluno = function(){
      $scope.responsavel = {};
      $scope.responsavel.ativo = 1;
      $scope.tiporesponsavel = {};
    }

    $scope.cadastrarResponsavel = function() {
      if ($scope.pessoa.id==undefined)
      {
        Mensagem.error('Por favor, é necessário cadastrar os dados do aluno primeiro.');
      }
      else {
        if ($('#cadastroResponsavel-form').valid()) {

          // FRH - Verifica se já tem Responsável Financeiro          
          rf = false;
          if(typeof $scope.responsaveis!='undefined'){
                      
            i=0;
            mt = $scope.responsaveis;                    
            while (i < mt.length) {
                if(mt[i].responsavel_financeiro){ 
                  if(mt[i].id!=$scope.responsavel.id){
                    rf = true; 
                    break; 
                  }
                }
                i++;
            }
          }

          if(rf && $scope.responsavel.responsavel_financeiro)
          {
            Mensagem.error('Já existe um Responsável Financeiro Cadastrado!');     

          }else{

            SalvarResponsavel.disabled = true;
            $scope.responsavel.id_pessoa_aluno = $scope.pessoa.id;          
            $scope.json = angular.toJson($scope.responsavel);
            $http.post('api/index.php/responsavel/', $scope.json, 
                                           {withCredentials: true,
                                           headers: {'enctype': 'multipart/form-data' },
                                           }
            ).success(function(data, status, headers, config) {
               if (data.error == '0')
               {  
                  Mensagem.success(data.mensagem);
                  $scope.responsavel.login = data.login;
                  $scope.getResponsaveis($scope.pessoa.id);
                  $scope.novoResponsavelAluno();
               }
               else
               {
                  Mensagem.error(data.mensagem);
               }
            }).error(function(data, status) {});
          }

        } else {
          Mensagem.error('Por favor, preencha os campos obrigatórios');
        }
        SalvarResponsavel.disabled = false;
      }
    }
    //Fim cadastro adicional de responsável

    // Funcionalidade para carregar dados do responsável
    $scope.passaResponsavel = function(item, model, label){        
        $scope.getIdResponsavel(item.id);    
    }

    //Funcionalidade para carregar os dados do responsável
    $scope.getIdResponsavel = function(idPessoa){
      $http.get('api/index.php/pessoa/'+idPessoa).
        success(function(data, status, headers, config) {
          
          var temp_id_tipo_responsavel = $scope.responsavel.id_tipo_responsavel

          $scope.responsavel = data.pessoa[0];        
          $scope.responsavel.id_pessoa = data.pessoa[0].id;
          $scope.responsavel.id_tipo_responsavel = temp_id_tipo_responsavel;
          $scope.responsavel.id = null;
          
        }).
        error(function(data, status, headers, config) {
          // log error
        }); 
    }
    //Fim cadastro e edição de dados adicionais

    //Busca lista de responsáveis do aluno
    $scope.getResponsaveis = function(id){
      $http.get('api/index.php/responsaveisaluno/'+id).
      success(function(data, status, headers, config) {
        $scope.responsaveis = data.responsaveis;  
        console.log('$scope.responsaveis', $scope.responsaveis);
      }).
      error(function(data, status, headers, config) {
        // log error
      }); 
    }

    //método para verificar se calendário foi alterado
    $scope.$watch('responsavel.data_nascimento', function(){ 
      $scope.responsavel.data_nascimento1 = $scope.responsavel.data_nascimento;     
      if($scope.responsavel.data_nascimento1 != undefined || $scope.responsavel.data_nascimento1 != null){    
        $( "em[for='responsavel_dataNascimento']" ).css("display","none"); 
      }
    });
//Fim - Aba 6 - Responsáveis **************************************************************************************



//Início - Aba 7 - Dados Médicos **************************************************************************************
    //Início - carga de dados dos combo box
    $scope.getGrupoSanguineo = function(){
      $http.get('api/index.php/gruposanguineo/').
      success(function(data, status, headers, config) {
        $scope.gruposanguineo = data['grupoSanguineo'];
      }).
      error(function(data, status, headers, config) {
        // log error
      }); 
    }
    //Fim - carga de dados dos combo box


    //Início cadastro e edição de dados adicionais
    //Início cadastro dados médico de pessoa
    $scope.cadastrarDadosMedicoPessoa = function(objeto) {
      if ($scope.pessoa.id==undefined)
      {
        Mensagem.error('Por favor, é necessário cadastrar os dados do aluno primeiro.');
      }
      else {
        if ($('#cadastroDadosMedico-form').valid()) {
          SalvarDadosMedico.disabled = true;
          $scope.dados_medico.id_pessoa = $scope.pessoa.id;
          $scope.json = angular.toJson($scope.dados_medico);
          $http.post('api/index.php/pessoadadosmedico/', $scope.json, 
                                         {withCredentials: true,
                                         headers: {'enctype': 'multipart/form-data' },
                                         }
          ).success(function(data, status, headers, config) {
             if (data.error == '0')
             {  
                Mensagem.success(data.mensagem);
                $scope.dados_medico.id = data.id;
             }
             else
             {
                Mensagem.error(data.mensagem);
             }
          }).error(function(data, status) { 
            //log erro
          });
        }
        SalvarDadosMedico.disabled = false;
      }
    }   
    //Fim cadastro médico de pessoa
    //Fim cadastro e edição de dados adicionais

    //Busca dados médicos do aluno
    $scope.getDadosMedico = function(id){
      $http.get('api/index.php/dadosmedico/'+id).
      success(function(data, status, headers, config) {
        if( !angular.isArray(data)){
          $scope.dados_medico = data['dadosMedicos'][0];  
          $scope.gruposanguineo.selected = {"id": data['dadosMedicos'][0].id_grupo_sanguineo,"descricao": data['dadosMedicos'][0].grupo_sanguineo};
          $scope.dados_medico.id_pessoa = $scope.pessoa.id;
        }
      }).
      error(function(data, status, headers, config) {
        // log error
      }); 
    }

    //método para verificar se calendário foi alterado
    $scope.$watch('dados_medico.data_medicao_corpo', function(){ 
      $scope.dados_medico.data_medicao_corpo1 = $scope.dados_medico.data_medicao_corpo;     
      if($scope.dados_medico.data_medicao_corpo1 != undefined || $scope.dados_medico.data_medicao_corpo1 != null){    
        $( "em[for='dataMedicaoCorpo']" ).css("display","none"); 
      }
    });

    //método para verificar se calendário foi alterado
    $scope.$watch('dados_medico.data_medicao_vestuario', function(){ 
      $scope.dados_medico.data_medicao_vestuario1 = $scope.dados_medico.data_medicao_vestuario;     
      if($scope.dados_medico.data_medicao_vestuario1 != undefined || $scope.dados_medico.data_medicao_vestuario1 != null){    
        $( "em[for='dataMedicaoVestuario']" ).css("display","none"); 
      }
    });
//Fim - Aba 7 - Dados Médicos **************************************************************************************



//Início - Aba 8 - Ocorrências **************************************************************************************
    //Início - carga de dados dos combo box
    $scope.getGrupoOcorrencia = function(){
      $http.get('api/index.php/grupoocorrencia/').
      success(function(data, status, headers, config) {
        $scope.gruposocorrencia = data['grupoocorrencia'];
      }).
      error(function(data, status, headers, config) {
        // log error
      });
    }

    $scope.getTipoOcorrencia = function(id){
      $http.get('api/index.php/tipoocorrencia/0/0/' + id).
      success(function(data, status, headers, config) {        
        console.log('tipoocorrencia', data);
        $scope.tiposocorrencia = data['tipoocorrencia'];

      }).
      error(function(data, status, headers, config) {
        // log error
      });
    }

    $scope.getTipoBloqueio = function(){
      $http.get('api/index.php/tipobloqueio/1/').
      success(function(data, status, headers, config) {
        $scope.tipobloqueios = data['tipoBloqueio'];
      }).
      error(function(data, status, headers, config) {
        // log error
      });
    }

    $scope.getTextoGrupoOcorrencia = function(id){
      $http.get('api/index.php/textogrupoocorrencia/1/0/' + id).
      success(function(data, status, headers, config) {
        $scope.textosocorrencia = data['textogrupoocorrencia'];
      }).
      error(function(data, status, headers, config) {
        // log error
      });
    }

    $scope.getDisciplina = function(){
      $http.get('api/index.php/disciplina/1/').
      success(function(data, status, headers, config) {
        $scope.disciplinas = data['disciplina'];
      }).
      error(function(data, status, headers, config) {
        // log error
      });
    }


    /* FRH - Filtrar pela entidade logada 20150514 */
    $scope.getLogado = function(){
      $http.get('api/index.php/usuariologado/')
      .success(function(data, status, headers, config){
        $scope.logado = data.user['user'];      
      })
      .error(function(data, status, headers, config){  });
    }
    $scope.getLogado();    


    $scope.getFuncionarioEscola = function(){
      $http.get('api/index.php/funcionarioescola/').
      success(function(data, status, headers, config) {        
        $scope.funcionarios = data['pessoa'];
        $scope.funcionarios = $filter('filter')(data['pessoa'], {'id_entidade': $scope.logado.idTipoEntidade});        
      })
      .error(function(data, status, headers, config) {
        // log error
      });
    }
    //Fim - carga de dados dos combo box

    //Início - carga de dados dos combos de cadastro dinâmicos
    //Início - módulo de grupo ocorrencia
    $scope.verificarAcaoGrupoOcorrencia = function(item) {
      if (item.id==-1) {
        $scope.modalNovoGrupoOcorrencia(); //chana apresentação do modal
        $scope.grupoocorrencia.selected = '';
        $scope.tiposocorrencia = [];
        $scope.textosocorrencia = [];
        $scope.tipoocorrencia.selected = "";
        $scope.ocorrencia.id_texto_grupo_ocorrencia = '';        
      } else {
        if ( item.id > 0 ) {
          $scope.ocorrencia.id_grupo_ocorrencia = item.id;
          $scope.getTipoOcorrencia(item.id);
          $scope.getTextoGrupoOcorrencia(item.id);
          $( "em[for='grupo_ocorrencia']" ).css("display","none");
        } else {
          $scope.tiposocorrencia = [];
          $scope.textosocorrencia = [];
          $scope.tipoocorrencia.selected = "";
          $scope.ocorrencia.id_texto_grupo_ocorrencia = '';         
        }
      }
    }

    $scope.modalNovoGrupoOcorrencia = function(size){ //apresenta modal
        $('#myModalGrupoOcorrencia').modal('show');
    }

    $scope.adicionarGrupoOcorrencia = function(){
      if ($('#cadastroGrupoOcorrencia-form').valid()) {
        $scope.addGrupoOcorrencia.ativo = 1;
        $scope.json = angular.toJson($scope.addGrupoOcorrencia);
        $http.post('api/index.php/grupoocorrencia/', $scope.json,
                      {withCredentials: true,
                      headers: {'enctype': 'multipart/form-data' },
                      }
        ).success(function(data, status, headers, config) {
            if (data.error == '0'){
              Mensagem.success(data.mensagem);
              $('#myModalGrupoOcorrencia').modal('hide');
              $scope.getGrupoOcorrencia();
              $scope.addGrupoOcorrencia = {};
            }else{
              Mensagem.error(data.mensagem);
            }
        }).error(function(data, status) {
        });
      }
    }
    //Fim - módulo de grupo ocorrencia
    //Início - módulo de tipo ocorrencia
    $scope.editarOcorrencia = function($index) {   
      angular.copy($scope.ocorrencias[$index], $scope.ocorrencia);
      
      $scope.grupoocorrencia.selected = {"id": $scope.ocorrencia.id_grupo_ocorrencia, "descricao": $scope.ocorrencia.grupo_ocorrencia};
      
      $scope.getTipoOcorrencia($scope.ocorrencia.id_grupo_ocorrencia);
      $scope.tipoocorrencia.selected = {"id": $scope.ocorrencia.id_tipo_ocorrencia, "descricao": $scope.ocorrencia.tipo_ocorrencia};

      $scope.textosocorrencia = {};
      $scope.getTextoGrupoOcorrencia($scope.ocorrencia.id_grupo_ocorrencia);
    }

    $scope.removeLinhaOcorrencia = function($index){
      $scope.ocorrencias[$index].ativo = 0;
      $scope.json = angular.toJson($scope.ocorrencias[$index]);
      $http.post('api/index.php/ocorrenciapessoa/', $scope.json,
                                     {withCredentials: true,
                                     headers: {'enctype': 'multipart/form-data' },
                                     }
      ).success(function(data, status, headers, config) {
        if (data.error == '0') {
          Mensagem.success(data.mensagem);
          $scope.ocorrencias.splice($index, 1);
        }
        else {
          Mensagem.error(data.mensagem);
        }
      }).error(function(data, status) {
          //log
      });
    }

    $scope.verificarAcaoTipoOcorrencia = function(item) {
      if (item.id==-1) {
        $scope.modalNovoTipoOcorrencia(); //chana apresentação do modal
        $scope.tipoocorrencia.selected = '';
      } else {
        $scope.ocorrencia.id_tipo_ocorrencia = item.id;
        $( "em[for='tipo_ocorrencia']" ).css("display","none");             
      }
    }

    $scope.modalNovoTipoOcorrencia = function(size){ //apresenta modal
        $('#myModalTipoOcorrencia').modal('show');
    }

    $scope.adicionarTipoOcorrencia = function(){
      if ($('#cadastroTipoOcorrencia-form').valid()) {
        $scope.addTipoOcorrencia.ativo = 1;
        $scope.addTipoOcorrencia.id_grupo_ocorrencia = $scope.ocorrencia.id_grupo_ocorrencia;
        $scope.json = angular.toJson($scope.addTipoOcorrencia);
        $http.post('api/index.php/tipoocorrencia/', $scope.json,
                      {withCredentials: true,
                      headers: {'enctype': 'multipart/form-data' },
                      }
        ).success(function(data, status, headers, config) {
            if (data.error == '0'){
              Mensagem.success(data.mensagem);
              $('#myModalTipoOcorrencia').modal('hide');
              $scope.getTipoOcorrencia();
              $scope.addTipoOcorrencia = {};
            }else{
              Mensagem.error(data.mensagem);
            }
        }).error(function(data, status) {
        });
      }
    }
    //Fim - módulo de tipo ocorrencia

    $scope.alimentaTexto = function(item){
      var data = $filter('filter')($scope.textosocorrencia, {id: item}, true);
      $scope.ocorrencia.texto_alterado = data[0].texto;
    }

    //Fim - carga de dados dos combos de cadastro dinâmicos

    $scope.novaOcorrenciaAluno = function(){
      $scope.ocorrencia = {};
      $scope.ocorrencia.ativo = 1;
      $scope.grupoocorrencia.selected = '';
      $scope.tiposocorrencia = [];
      $scope.textosocorrencia = [];
      $scope.tipoocorrencia.selected = "";
      $scope.ocorrencia.id_texto_grupo_ocorrencia = '';
      $scope.ocorrencia.id_responsavel = "";
    }

    //Início cadastro e edição de ocorrências
    //Início cadastro de ocorrências
    $scope.cadastrarOcorrenciaPessoa = function(objeto) {
      if ($scope.pessoa.id==undefined)
      {
        Mensagem.error('Por favor, é necessário cadastrar os dados do aluno primeiro.');
      }
      else {
        if ($('#cadastroOcorrencia-form').valid()) {
          SalvarOcorrencia.disabled = true;
          $scope.ocorrencia.id_pessoa = $scope.pessoa.id;
          $scope.json = angular.toJson($scope.ocorrencia);
          $http.post('api/index.php/ocorrenciapessoa/', $scope.json, 
                                         {withCredentials: true,
                                         headers: {'enctype': 'multipart/form-data' },
                                         }
          ).success(function(data, status, headers, config) {
             if (data.error == '0')
             {  
                Mensagem.success(data.mensagem);
                $scope.novaOcorrenciaAluno();
                $scope.getOcorrencia($scope.pessoa.id);
                //trazer listagem de ocorrencias
             }
             else
             {
                Mensagem.error(data.mensagem);
             }
          }).error(function(data, status) { 
            //log erro
          });
        } else {
          Mensagem.error('Por favor, preencha os campos obrigatórios');
        }
        SalvarOcorrencia.disabled = false;
      }
    }   
    //Fim cadastro de ocorrências
    //Fim cadastro e edição de ocorrências


    //Busca lista de responsáveis do aluno
    $scope.getOcorrencia = function(id){
      $http.get('api/index.php/ocorrenciapessoa/'+id).
      success(function(data, status, headers, config) {
        console.log('ocorrencia', data);
        $scope.ocorrencias = $filter('filter')(data['ocorrencia'], {'ativo': true});
      }).
      error(function(data, status, headers, config) {
        // log error
      }); 
    }


    //método para verificar se calendário foi alterado
    $scope.$watch('ocorrencia.data_ocorrencia', function(){ 
      $scope.ocorrencia.data_ocorrencia1 = $scope.ocorrencia.data_ocorrencia;     
      if($scope.ocorrencia.data_ocorrencia1 != undefined || $scope.ocorrencia.data_ocorrencia1 != null){    
        $( "em[for='data_ocorrencia']" ).css("display","none"); 
      }
    });

    //método para verificar se calendário foi alterado
    $scope.$watch('ocorrencia.data_desbloqueio_ocorrencia', function(){ 
      $scope.ocorrencia.data_desbloqueio_ocorrencia1 = $scope.ocorrencia.data_desbloqueio_ocorrencia;     
      if($scope.ocorrencia.data_desbloqueio_ocorrencia1 != undefined || $scope.ocorrencia.data_desbloqueio_ocorrencia1 != null){    
        $( "em[for='data_desbloqueio_ocorrencia']" ).css("display","none"); 
      }
    });

//Fim - Aba 8 - Ocorrências **************************************************************************************


    //Inicializa dados dos combos
    $scope.getPais();
    $scope.getEstado();
    $scope.getEstadoCivil();
    $scope.getReligiao();
    $scope.getOrgaoEmissor();
    $scope.getTipoEndereco();
    $scope.getTipoTelefone();
    $scope.getTipoResponsavel();
    $scope.getGrupoSanguineo();
    $scope.getCorRaca();
    $scope.getTipoDocumento();
    $scope.getDocumentoPendente();

    $scope.getGrupoOcorrencia();
    $scope.getDisciplina();
    $scope.getFuncionarioEscola();
    $scope.getTipoBloqueio();

    if (idPessoa != undefined) {
      $timeout(function() {
        $scope.getIdPessoa(idPessoa);
      }, 800);
    };
});

//@ sourceURL=controller.formCadastroAluno.js