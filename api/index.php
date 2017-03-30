<?php
include realpath(dirname(__FILE__)) . '/includes/init.php';
$app = new \Slim\Slim(array(
	'mode' => 'development',
	'debug' => true
	));

$gestor = new SIG( array(
	'SlimApp' => $app,
	'env'     => ''
	));

$app->get('/', array($gestor, 'getIndex'));

	//****************MÓDULO MESQUITA
	//Cadastro de Pessoas

$app->get('/cep/:cep', array($gestor, 'getCep'));
$app->get('/allteste', array($gestor, 'allteste'));
$app->get('/stringallteste', array($gestor, 'alltesteString'));
$app->get('/estado(/)(:flgFull)', array($gestor, 'getEstado'));
$app->get('/cidade/:uf(/)(:flgFull)', array($gestor, 'getCidade'));
$app->get('/pais', array($gestor, 'getPais'));
$app->get('/estadocivil(/)(:estadocivil)(/)(:flgFull)', array($gestor, 'getEstadoCivil'));	
$app->get('/tipobeneficiario(/)(:flgFull)', array($gestor, 'getTipoBeneficiario'));	
$app->get('/autentica/', array($gestor, 'autentica'));
/* AUTENTICAÇÃO DO MODO ACADÊMICO */
$app->get('/autentica_usuario/', array($gestor, 'autenticaUsuario'));
$app->get('/usuariologado/', array($gestor, 'getUserLogado'));
$app->get('/logout/', array($gestor, 'logout'));
$app->get('/cpf/:cpf', array($gestor, 'getCpf'));
$app->get('/documentoAll/:documento', array($gestor, 'getDocumentoAll'));
$app->get('/cnpj/:cnpj', array($gestor, 'getCnpj'));
$app->get('/fontecaptacao(/)(:fontecaptacao)(/)(:flgFull)', array($gestor, 'getFonteCaptacao'));
$app->get('/categorianaoassociado(/)(:categorianaoassociado)(/)(:flgFull)', array($gestor, 'getCategoriaNaoAssociado'));
$app->get('/stringtipoevento', array($gestor, 'getTipoEventoString'));
$app->get('/ctipoevento(/)(:tipoevento)(/)(:flgFull)', array($gestor, 'getTipoEvento'));
$app->get('/tipoevento(/)(:pessoa)(/)(:id)(/)(:flgFull)', array($gestor, 'getTipoEventoPessoa'));
$app->get('/evento(/)(:id)', array($gestor, 'getEvento'));
$app->get('/eventofrequencia/:id', array($gestor, 'getEventoFrequencia'));
$app->get('/endereco(/)(:pessoa)(/)(:id)(/)(:flgFull)', array($gestor, 'getEnderecoPessoa'));
$app->get('/documento(/)(:pessoa)(/)(:id)(/)(:flgFull)(/)(:idtipo)', array($gestor, 'getDocumentoPessoa'));
$app->get('/tipodocumento(/)(:tipodocumento)(/)(:flgFull)', array($gestor, 'getTipoDocumento'));
$app->get('/telefone(/)(:pessoa)(/)(:id)(/)(:flgFull)(/)(:idtipo)', array($gestor, 'getTelefonePessoa'));
$app->get('/tipotelefone(/)(:tipotelefone)(/)(:flgFull)', array($gestor, 'getTipoTelefone'));
$app->get('/contribuicao(/)(:pessoa)(/)(:flgFull)', array($gestor, 'getContribuicaoPessoa'));
$app->get('/pessoa(/)(:pessoa)(/)(:flgFull)', array($gestor, 'getPessoa'));
$app->get('/laudo(/)(:pessoa)(/)(:flgFull)', array($gestor, 'getPessoaLaudo'));
$app->get('/beneficiario/:pessoa(/)(:flgFull)', array($gestor, 'getBeneficiarioPessoa'));
$app->get('/stringfalecido', array($gestor, 'getFalecidoString'));
$app->get('/stringpessoa', array($gestor, 'getPessoasString'));
$app->get('/stringaluno', array($gestor, 'getAlunosString'));
$app->get('/stringmatricula', array($gestor, 'getMatriculaString'));	
$app->get('/stringeventofrequencia', array($gestor, 'getEventoFrequenciaString'));	
$app->get('/beneficiariocontribuicao/:pessoa(/)(:flgFull)', array($gestor, 'getContribuicaoBeneficiario'));
$app->get('/contato_pessoa/:pessoa(/)(:flgFull)', array($gestor, 'getPessoaContato'));
$app->post('/pessoa(/)(:data)', array($gestor, 'postPessoa'));
$app->post('/laudo/', array($gestor, 'postPessoaLaudo'));
$app->post('/contribuicao/', array($gestor, 'postContribuicaoPessoa'));	
$app->post('/beneficiario/', array($gestor, 'postBeneficiario'));	
$app->post('/uploadfile/:id', array($gestor, 'uploadFile'));
$app->post('/uploadfiledocumento/:id/:tipo', array($gestor, 'uploadfileDocumento'));
$app->post('/uploadfilefinanceiro/:id', array($gestor, 'uploadFileFinanceiro'));	
$app->post('/updatepessoa/:id', array($gestor, 'updatePessoa'));
$app->post('/updatetelefoneativo/:id', array($gestor, 'updateTelefoneAtivo'));
$app->post('/updatetelefoneprincipal/:id', array($gestor, 'updateTelefonePrincipal'));
$app->post('/updatepessoas', array($gestor, 'updatePessoas'));
$app->post('/socio/', array($gestor, 'postSocio'));
$app->post('/delduracaofase/', array($gestor, 'delDuracaoFase'));
$app->post('/delsocio/', array($gestor, 'delSocio'));
$app->post('/deltelefone/', array($gestor, 'delTelefone'));
$app->post('/delbeneficiario/', array($gestor, 'delBeneficiario'));
$app->post('/deldonatario/', array($gestor, 'delDonatario'));
$app->post('/deldoacao/', array($gestor, 'delDoacao'));
$app->get('/socio(/)(:pessoa)', array($gestor, 'getSocioPessoa'));
$app->post('/evento/', array($gestor, 'postEvento'));    
$app->post('/tipoevento/', array($gestor, 'postTipoEvento'));
$app->post('/eventofrequencia/', array($gestor, 'postEventoFrequencia'));
$app->post('/deleventofrequencia/', array($gestor, 'postDelEventoFrequencia'));
$app->post('/caixaupfrequencia/', array($gestor, 'postCaixaUpFrequencia'));
$app->post('/eventofrequenciauppagante/', array($gestor, 'postEventoFrequenciaUpPagante'));
$app->post('/categorianaoassociado/', array($gestor, 'postCategoriaNaoAssociado'));
$app->post('/contato_pessoa/', array($gestor, 'postPessoaContato'));
$app->post('/delcontato_pessoa/', array($gestor, 'delPessoaContato'));
$app->post('/configUsuario/', array($gestor, 'postConfigUsuario'));

    //Inscrição de Eventos
$app->post('/inscricaoevento/', array($gestor, 'postInscricaoEvento'));
$app->get('/inscricaoevento/:id_evento', array($gestor, 'getInscricaoEvento'));

	//Cadastro de Campanhas de Associação.
$app->post('/campanha/', array($gestor, 'postCampanha'));
$app->get('/campanha(/)(:campanha)(/)(:flgFull)', array($gestor, 'getCampanha'));
$app->get('/cpessoa/:pessoa', array($gestor, 'getCampanhaPessoa'));

	//Cadastro de Departamentos
$app->post('/departamento/', array($gestor, 'postDepartamento'));
$app->post('/departamentofuncionario/', array($gestor, 'postDepartamentoFuncionario'));
$app->post('/integrantedepartamento/', array($gestor, 'postIntegranteDepartamento'));
$app->get('/departamentoevento(/)(:departamento)(/)(:flgFull)', array($gestor, 'getDepartamentoEvento'));
$app->get('/departamento(/)(:departamento)(/)(:flgFull)', array($gestor, 'getDepartamento'));
$app->get('/integrantes(/)(:pessoa)', array($gestor, 'getIntegranteDepartamento'));
$app->post('/delintegrante/', array($gestor, 'delIntegrante'));
$app->get('/deptofuncionarios(/)(:id)(/)(:flgFull)', array($gestor, 'getDepartamentoFuncionario'));

	//Cadastro de Ata
$app->post('/ata/', array($gestor, 'postAta')); 
$app->get('/ata(/)(:id)', array($gestor, 'getAta'));
$app->get('/carometropdf(/)(:id_etapa)(/)(:id_curso)(/)(:id_turma)(/)(:id_aluno)', array($gestor, 'getCarometroPdf'));
$app->get('/atapdf/:id', array($gestor, 'getAtaPdf')); 

	//Cadastro de Agenda do Evento
$app->post('/agendaevento/', array($gestor, 'postAgendaEvento')); 
$app->get('/agendaevento(/)(:id)', array($gestor, 'getAgendaEvento'));
$app->post('/delAgendaEvento/', array($gestor, 'delAgendaEvento')); 
$app->get('/stringlista', array($gestor, 'getListaString'));	

	//Cadastro de Lista de Convidados
$app->post('/excluirlista/', array($gestor, 'delExcluirLista'));
$app->post('/cadastrarlista/', array($gestor, 'postLista'));
$app->post('/cadastrarlistapessoa/', array($gestor, 'postListaPessoa'));
$app->post('/cadastrarsellistapessoa/', array($gestor, 'postSelListaPessoa'));
$app->post('/excluirlistapessoa/', array($gestor, 'delListaPessoa'));
$app->post('/limparlistapessoa/', array($gestor, 'limparListaPessoa'));
$app->post('/quadroassociativo/', array($gestor, 'postQuadroAssociativo'));	
$app->post('/quadroassociativopessoa/', array($gestor, 'postQuadroAssociativoPessoa'));	
$app->post('/delquadroassociativopessoa/', array($gestor, 'delQuadroAssociativoPessoa'));	
$app->post('/cargo/', array($gestor, 'postCargo'));	
$app->post('/formatratamento/', array($gestor, 'postFormaTratamento'));	
$app->get('/formatratamento(/)(:consulta)(/)(:id)', array($gestor, 'getFormaTratamento'));
$app->get('/lista(/)(:id_lista)', array($gestor, 'getLista'));	
$app->get('/listapessoa(/)(:id_lista)', array($gestor, 'getListaPessoa'));	
$app->get('/hojestatusfinanceiro(/)(:data)', array($gestor, 'getStatusFinanceiroHoje'));	
$app->get('/vencidostatusfinanceiro(/)(:data)', array($gestor, 'getStatusFinanceiroVencido'));	
$app->get('/vencerstatusfianceiro(/)(:data)', array($gestor, 'getStatusFinanceiroVencer'));	
$app->get('/statusfinanceiro(/)(:filtro)', array($gestor, 'getStatusFinanceiro'));	
$app->get('/statusagenda(/)(:data)', array($gestor, 'getStatusAgenda'));	
$app->get('/statuscotacao(/)(:id)', array($gestor, 'getStatusCotacao'));	
$app->get('/status(/)', array($gestor, 'getStatus'));	
$app->get('/cargo(/)(:consulta)(/)(:id)(/)(:id_departamento)', array($gestor, 'getCargo'));	
$app->get('/quadroassociativo(/)(:id)', array($gestor, 'getQuadroAssociativo'));	
$app->get('/quadroassociativopessoa(/)(:id_quadro_associativo)', array($gestor, 'getQuadroAssociativoPessoa'));	
$app->get('/contarassociados(/)', array($gestor, 'getContarAssociados'));
$app->get('/contarstatisticaassociados(/)', array($gestor, 'getContarStatisticaAssociados'));
$app->get('/contarstatisticaassociados(/)', array($gestor, 'getContarStatisticaAssociados'));
$app->post('/arquivoevento(/)', array($gestor, 'postArquivoEvento'));
$app->get('/arquivoevento/:id', array($gestor, 'getArquivoEvento'));	
$app->post('/uploadfileevento(/)', array($gestor, 'uploadFileEvento'));

$app->get('/doacoesestoque(/)(:id_tipo)(/)(:id_local)(/)(:status)(/)(:flgFull)', array($gestor, 'getDoacoesEstoque'));	
$app->get('/relatoriosintetico(/)(:id_tipo)(/)(:id_local)(/)(:status)(/)(:flgFull)', array($gestor, 'relatorioSinteticoEstoqueDoacao'));
$app->get('/relatorioanalitico(/)(:id_tipo)(/)(:id_local)(/)(:status)(/)(:flgFull)', array($gestor, 'relatorioAnaliticoEstoqueDoacao'));

$app->get('/relatorioevento(/)(:tiporelatorio)(/)(:tipoevento)(/)(:nomeevento)(/)(:dataini)(/)(:datafim)(/)(:flgFull)', array($gestor, 'getRelatorioEvento'));
$app->get('/gerarrelatoriopdf(/)(:tiporelatorio)(/)(:tipoevento)(/)(:nomeevento)(/)(:dataini)(/)(:datafim)(/)(:flgFull)', array($gestor, 'gerarRelatorioPDF'));

$app->get('/carregarevento(/)(:idevento)(/)(:flgFull)', array($gestor, 'carregarEvento'));
$app->get('/carregartipoevento(/)(:idtipoevento)(/)(:flgFull)', array($gestor, 'carregarTipoEvento'));
$app->get('/stringrecebimento', array($gestor, 'getRecebimentoString'));

$app->post('/conversoes/', array($gestor, 'postConversoes'));
$app->get('/conversoes(/)(:id)(/)(:flgFull)', array($gestor, 'getConversoes'));
$app->post('/delconversoes/', array($gestor, 'delConversoes'));
$app->get('/transferencia(/)(:id)', array($gestor, 'getTransferencia'));
$app->post('/deltransferencia/', array($gestor, 'delTransferencia'));
$app->post('/transferencia/', array($gestor, 'postTransferencia'));
    //****************FIM - MÓDULO MESQUITA

    //****************MÓDULO CONTROLE DE ACESSO
	//Login
$app->get('/usuario/:login/:senha/:modulo', array($gestor, 'getUser'));
$app->get('/atividade(/)(:atividade)', array($gestor, 'getAtividade'));
$app->get('/papel(/)(:papel)(/)(:flgFull)', array($gestor, 'getPapel'));
$app->get('/papelpessoa/:pessoa/:modulo', array($gestor, 'getPapelPessoa'));
$app->post('/esqueceusenha/', array($gestor, 'postEsqueceuSenha'));
	//****************FIM - MÓDULO CONTROLE DE ACESSO

	//****************MÓDULO ADMINISTRADOR
	//Cadastro de Entidades
$app->get('/tipoentidade(/)(:tipoentidade)(/)(:flgFull)', array($gestor, 'getTipoEntidade'));
$app->get('/cnpjentidade/:cnpj', array($gestor, 'getCnpjEntidade'));
$app->get('/entidadepessoa/:id_entidade', array($gestor, 'getEntidadePessoa'));
$app->post('/entidade/', array($gestor, 'postEntidade'));
$app->get('/entidade(/)(:entidade)(/)(:flgFull)', array($gestor, 'getEntidade'));
	//****************FIM- MÓDULO ADMINISTRADOR

	//****************MÓDULO CEMITÉRIO
	//Cadastro de Quadras
$app->post('/quadra/', array($gestor, 'postQuadra'));
$app->get('/quadra(/)(:quadra)(/)(:flgFull)', array($gestor, 'getQuadra'));
	//Popula o combo de Planos de Unidade de Armazenagem
$app->get('/uaplanos/', array($gestor, 'getPlanos'));
	//Popula o combo de Tipos de Unidade de Armazenagem
$app->get('/tiposunidadearmazenagem/', array($gestor, 'getTiposUnidadesArmazenagem'));
	//Popula o combo de Tipos de Concessão
$app->get('/tipoconcessao/', array($gestor, 'getTipoConcessao'));
	//Popula Periodicidades de Cobrança
$app->get('/periodicidadecobranca/', array($gestor, 'getPeriodicidadeCobranca'));
	//Popula status das Gavetas
$app->get('/statusgaveta/', array($gestor, 'getStatusGaveta'));
	//Cadastro de Unidade de Armazenagem
$app->post('/unidadearmazenagem/', array($gestor, 'postUnidadeArmazenagem'));
	//Carrega as Unidades de Armazenagem
$app->get('/unidadearmazenagem/:id', array($gestor, 'getUnidadeArmazenagem'));
	//Cadastro de pessoas nas Unidades de Armazenagem
$app->post('/unidadearmazenagempessoas/', array($gestor, 'postUnidadeArmazenagemPessoas'));
	//Carrega pessoas na Unidade de Armazenagem
$app->get('/unidadearmazenagempessoas/:id', array($gestor, 'getUnidadeArmazenagemPessoas'));
$app->get('/unidadearmazenagemgavetas/:id', array($gestor, 'getUnidadeArmazenagemGavetas'));
$app->post('/unidadearmazenagemgavetas/', array($gestor, 'postUnidadeArmazenagemGavetas'));
	//Deleta as Gavetas
$app->post('/delgavetas/:id', array($gestor, 'postDelGavetas'));
$app->get('/consultaunidadearmazenagem/(:id_quadra)(/)(:id_falecido)', array($gestor, 'getConsultaUnidadeArmazenagem'));

	//Cadastro de Lotes
$app->post('/lote/', array($gestor, 'postLote'));
$app->get('/lote(/)(:lote)(/)(:flgFull)', array($gestor, 'getLote'));
$app->get('/carregaquadralote/:quadra', array($gestor, 'getQuadraLote'));	
$app->get('/jazigo/:lote', array($gestor, 'getJazigo'));
$app->get('/gaveta/(:livre)(/)(:jazigo)', array($gestor, 'getGaveta'));
	//Cadastro de Causa Mortis
$app->post('/causamortis/', array($gestor, 'postCausaMortis'));
$app->get('/causamortis(/)(:causamortis)(/)(:flgFull)', array($gestor, 'getCausaMortis'));
	//Cadastro de Proprietario
	//$app->post('/proprietario/', array($gestor, 'postProprietario'));
$app->get('/consultapessoas(/)(:flgFull)', array($gestor, 'getConsultaPessoas'));
$app->get('/consultapessoa(/)(:id)(/)(:flag)', array($gestor, 'getConsultaPessoa'));
	//Cadastro de Funeraria
$app->get('/cnpjfuneraria/:cnpj', array($gestor, 'getCnpjFuneraria'));
$app->post('/funeraria/', array($gestor, 'postFuneraria'));
$app->get('/funeraria(/)(:funeraria)(/)(:flgFull)', array($gestor, 'getFuneraria'));		
	//Cadastro de Falecido
$app->get('/falecidocausamortis/(:idfalecido)', array($gestor, 'getFalecidoCausaMortis'));
$app->post('/uploadfilefalecido/:id', array($gestor, 'uploadFileFalecido'));
$app->post('/falecido/', array($gestor, 'postFalecido'));
$app->get('/falecidogaveta/', array($gestor, 'getFalecidoGaveta'));
$app->get('/falecido/(:idfalecido)', array($gestor, 'getFalecido'));

$app->get('/falecidomovimentacao/(:idfalecido)', array($gestor, 'getFalecidoMovimentacao'));
	//Cadastro de Atividade
$app->post('/cadastraratividade/', array($gestor, 'postCadastrarTreeAtividade'));
$app->post('/cadastrarperfil/', array($gestor, 'postCadastrarPerfil'));
$app->post('/excluirperfil/', array($gestor, 'postExcluirPerfil'));
$app->post('/atividade/', array($gestor, 'postAtividade'));
$app->post('/permissaotreeatividade/', array($gestor, 'postPermissaoTreeAtividade'));
$app->get('/treeatividade/(:idtreeatividade)', array($gestor, 'getTreeAtividade'));
	//Cadastro de Templates
$app->post('/cadastrartemplate/', array($gestor, 'postCadastrarTemplate'));
$app->post('/deltemplate/', array($gestor, 'postDelTemplate'));
$app->get('/template(/)(:idtemplate)', array($gestor, 'getTemplate'));
$app->get('/variavel(/)(:idvariavel)', array($gestor, 'getVariavel'));
$app->get('/modelodocumento(/)(:idmodelodocumento)', array($gestor, 'getModeloDocumento'));
$app->get('/recibo/', array($gestor, 'getListaRecibo'));
$app->get('/certificado/', array($gestor, 'getListaCertificado'));
$app->get('/listarcontrato/', array($gestor, 'getListaContrato'));
$app->get('/modelotemplate/:id', array($gestor, 'getModeloTemplate'));
$app->get('/stringcausamortis', array($gestor, 'getCausaMortisString'));

$app->post('/uparquivos(/)(:id)(/)(:dir)(/)(:tipo)', array($gestor, 'upArquivos'));
$app->get('/getresponsaveljazigo(/)(:id_pessoa)', array($gestor, 'getResponsavelJazigo'));
$app->post('/delcemiteriolote', array($gestor, 'delCemiterioLote'));
$app->post('/delcemiterioquadra', array($gestor, 'delCemiterioQuadra'));
$app->post('/deljazigo/', array($gestor, 'delJazigo'));
$app->post('/delfalecido/', array($gestor, 'delFalecido'));

	//****************FIM - MÓDULO CEMITÉRIO

	//envia email
$app->get('/email', array($gestor, 'sendEmail'));

	//****************MÓDULO FINANCEIRO
$app->get('/resumofinanceiro(/)(:periodo)(/)(:tipo)(/)(:flgFull)', array($gestor, 'getResumoFinanceiro'));
$app->get('/categoria(/)(:consulta)(/)(:id)(/)(:idTipoLancamento)(/)(:flgFull)', array($gestor, 'getCategoria'));
$app->post('/categoria/', array($gestor, 'postCategoria'));
$app->get('/formapagamento(/)(:id)(/)(:flgFull)', array($gestor, 'getFormaPagamento'));
$app->get('/contabancaria(/)(:id)(/)(:flgFull)', array($gestor, 'getContaBancaria'));
$app->post('/contabancaria/', array($gestor, 'postContaBancaria'));
$app->get('/tipoconta(/)(:id)(/)(:flgFull)', array($gestor, 'getTipoConta'));
$app->get('/banco(/)(:id)(/)(:flgFull)', array($gestor, 'getBanco'));
$app->get('/situacaoserie(/)(:consulta)(/)(:id)(/)(:flgFull)', array($gestor, 'getSituacaoSerie'));
$app->get('/situacao(/)(:id)(/)(:flgFull)', array($gestor, 'getSituacao'));
$app->get('/tipolancamentosituacao(/)(:id_tipo_lancamento)(/)(:flgFull)', array($gestor, 'tipoLancamentoSituacao'));
$app->get('/tipolancamento(/)(:id)(/)(:flgFull)', array($gestor, 'getTipoLancamento'));
$app->get('/tipofornecedor(/)(:id)(/)(:flgFull)', array($gestor, 'getTipoFornecedor'));
$app->get('/stringtipofornecedor', array($gestor, 'getTipoFornecedorString'));	
$app->post('/tipofornecedor/', array($gestor, 'postTipoFornecedor'));	
$app->post('/movimentacao/(:id)', array($gestor, 'postMovimentacao'));
$app->post('/pedido/', array($gestor, 'postPedido'));
$app->post('/pedidoitens/', array($gestor, 'postPedidoItens'));
$app->post('/delpedidoitem/', array($gestor, 'delPedidoItem'));
$app->get('/listasituacaopedido/', array($gestor, 'getListaSituacaoPedido'));
$app->post('/bordero/', array($gestor, 'postBordero'));
$app->get('/pedido/(:id_pedido)', array($gestor, 'getPedido'));
$app->get('/pedidoitens/:id_pedido', array($gestor, 'getPedidoItens'));
$app->get('/movimentacao/(:id)', array($gestor, 'getMovimentacao'));
$app->post('/centrocusto/', array($gestor, 'postCentroCusto'));
$app->get('/consultacentrocusto(/)(:id)(/)(:flgFull)', array($gestor, 'getCentroCusto'));
$app->get('/gerarbordero(/):id_bordero(/)(:flgFull)', array($gestor, 'getGerarBordero'));
$app->post('/fontecaptacao/', array($gestor, 'postFonteCaptacao'));
$app->post('/moeda/', array($gestor, 'postMoeda'));
$app->get('/moeda/(:id)', array($gestor, 'getMoeda'));
$app->get('/itenscategoria/:id_categoria', array($gestor, 'getItensCategoria'));
	//****************FIM - MÓDULO FINANCEIRO

	//****************MÓDULO DOAÇÕES
$app->post('/doacao/', array($gestor, 'postDoacao'));
$app->post('/addmovimentacaodoacao/', array($gestor, 'postMovimentacaoDoacao'));
$app->post('/delmovimentacaodoacao/', array($gestor, 'delMovimentacaoDoacao'));
$app->post('/tipodoacao/', array($gestor, 'postTipoDoacao'));
$app->post('/statusdoacao/', array($gestor, 'postStatusDoacao'));
$app->post('/localarmazenamentodoacao/', array($gestor, 'postLocalArmazenamentoDoacao'));
$app->post('/programadoacao/', array($gestor, 'postProgramaDoacao'));
$app->get('/doacao(/)(:id)(/)(:flgFull)', array($gestor, 'getDoacao'));
$app->get('/movimentacaodoacao(/)(:id)(/)(:flgFull)', array($gestor, 'getMovimentacaoDoacao'));
$app->get('/tipodoacao(/)(:id)(/)(:flgFull)', array($gestor, 'getTipoDoacao'));
$app->get('/statusdoacao(/)(:id)(/)(:flgFull)', array($gestor, 'getStatusDoacao'));
$app->get('/localarmazenamentodoacao(/)(:id)(/)(:flgFull)', array($gestor, 'getLocalArmazenamentoDoacao'));
$app->get('/programadoacao(/)(:id)(/)(:flgFull)', array($gestor, 'getProgramaDoacao'));
	//****************FIM - MÓDULO DOAÇÕES

	//****************MÓDULO GESTÃO PATRIMONIAL
$app->get('/grupobens(/)(:id)(/)(:flgFull)', array($gestor, 'getGrupoBens'));
$app->post('/grupobens/', array($gestor, 'postGrupoBens'));
$app->get('/fabricante(/)(:id)(/)(:flgFull)', array($gestor, 'getFabricante'));
$app->post('/fabricante/', array($gestor, 'postFabricante'));
$app->get('/marca(/)(:id)(/)(:flgFull)', array($gestor, 'getMarca'));
$app->post('/marca/', array($gestor, 'postMarca'));	
$app->get('/seguradora(/)(:id)(/)(:flgFull)', array($gestor, 'getSeguradora'));
$app->post('/seguradora/', array($gestor, 'postSeguradora'));		
$app->get('/procedencia(/)(:id)(/)(:flgFull)', array($gestor, 'getProcedencia'));
$app->post('/procedencia/', array($gestor, 'postProcedencia'));	
$app->get('/localidadebens(/)(:id)(/)(:flgFull)', array($gestor, 'getLocalidadeBens'));
$app->post('/localidadebens/', array($gestor, 'postLocalidadeBens'));		
$app->get('/siteconomica(/)(:id)(/)(:flgFull)', array($gestor, 'getSituacaoEconomica'));
$app->post('/situacaoeconomica/', array($gestor, 'postSituacaoEconomica'));	
$app->get('/estadoconservacao(/)(:id)(/)(:flgFull)', array($gestor, 'getEstadoConservacao'));
$app->post('/estadoconservacao/', array($gestor, 'postEstadoConservacao'));
$app->get('/statusbem(/)(:id)(/)(:flgFull)', array($gestor, 'getStatusBem'));
$app->post('/statusbem/', array($gestor, 'postStatusBem'));	
$app->get('/formaaquisicao(/)(:id)(/)(:flgFull)', array($gestor, 'getFormaAquisicao'));
$app->post('/formaaquisicao/', array($gestor, 'postFormaAquisicao'));	
$app->get('/unidademedida(/)(:id)(/)(:flgFull)', array($gestor, 'getUnidadeMedida'));
$app->post('/unidademedida/', array($gestor, 'postUnidadeMedida'));	
$app->post('/uploadfilebens/:id', array($gestor, 'uploadFileBens'));	
$app->post('/bens/', array($gestor, 'postBens'));									
$app->post('/bensseguro/', array($gestor, 'postBensSeguro'));
$app->post('/delseguro/', array($gestor, 'delSeguro'));
$app->post('/bensmovimentacao/', array($gestor, 'postBensMovimentacao'));
$app->post('/delbensmovimentacao/', array($gestor, 'delBensMovimentacao'));
$app->get('/bens(/)(:bem)(/)(:flgFull)', array($gestor, 'getBens'));
$app->get('/bemseguro/:bem(/)(:flgFull)', array($gestor, 'getBensSeguro'));
$app->get('/bemmovimentacao/:bem(/)(:flgFull)', array($gestor, 'getBensMovimentacao'));
	//****************FIM - MÓDULO GESTÃO PATRIMONIAL

	//****************MÓDULO COMPRAS
$app->post('/produtosservicos/', array($gestor, 'postProdutosServicos'));
$app->post('/delprodutosservicosfornecedor/', array($gestor, 'delProdutosServicosFornecedor'));
$app->post('/fornecedor/', array($gestor, 'postFornecedor'));
$app->post('/uppedidosituacao/', array($gestor, 'upPedidoSituacao'));
$app->post('/cotacaoaprovacao/', array($gestor, 'postCotacaoAprovacao'));
$app->get('/produtosservicos(/)(:id)(/)(:flgFull)', array($gestor, 'getProdutosServicos'));
$app->get('/fornecedor(/)(:id)(/)(:flgFull)', array($gestor, 'getFornecedor'));
	//****************FIM - MÓDULO COMPRAS

$app->get('/permissao/(:page)/(:child)(/)(:tipo)', array($gestor, 'getPermissao'));
$app->get('/cotacaolista(/)(:id)(/)(:flgFull)', array($gestor, 'getListaCotacao'));
$app->post('/cadastracotacaolista/', array($gestor, 'postListaCotacao'));
$app->get('/cotacaocompraitensfornecedor(/)(:id)(/)(:flgFull)', array($gestor, 'getCotacaoCompraItensFornecedor'));
$app->post('/updatecotacaocompra/', array($gestor, 'postAtualizaCotacaoCompra'));
$app->get('/cotacaopendentelista(/)(:id)(/)(:flgFull)', array($gestor, 'getListaCotacaoPendente'));
$app->post('/aprovareprovacotacao/', array($gestor, 'postAprovaReprovaCotacao'));
$app->get('/compraslistas(/)(:id)(/)(:flgFull)', array($gestor, 'getListaCompra'));
$app->get('/familia/', array($gestor, 'getFamilia'));
$app->get('/relatoriodespesa/', array($gestor, 'relatorioDespesa'));
$app->get('/relatorioinadimplente(/)(:id_pessoa)', array($gestor, 'relatorioInadimplente'));
$app->get('/quadroassociativo/', array($gestor, 'getQuadroAssociativo'));
$app->post('/cadastrarfamilia/', array($gestor, 'postCadastrarFamilia'));
$app->get('/itenslista/', array($gestor, 'getListaItens'));
	//$app->post('/updatecotacaocompra/', array($gestor, 'postAtualizaCotacaoCompra'));

	//****************MÓDULO ESCOLA
$app->post('/tipodecontato/', array($gestor, 'postTipoContato'));	
$app->get('/tipodecontato(/)(:id)(/)(:flgFull)', array($gestor, 'getTipoContato'));
$app->post('/tiponecessidadesespeciais/', array($gestor, 'postTipoNecessidadesEspeciais'));	
$app->get('/tiponecessidadesespeciais(/)(:id)(/)(:flgFull)', array($gestor, 'getTipoNecessidadesEspeciais'));
$app->post('/grupoocorrencia/', array($gestor, 'postGrupoOcorrencia'));	
$app->get('/grupoocorrencia(/)(:id)(/)(:flgFull)', array($gestor, 'getGrupoOcorrencia'));
$app->post('/tipoocorrencia/', array($gestor, 'postTipoOcorrencia'));	
$app->get('/tipoocorrencia(/)(:consulta)(/)(:id)(/)(:id_grupo_ocorrencia)(/)(:flgFull)', array($gestor, 'getTipoOcorrencia'));
$app->post('/religiao/', array($gestor, 'postReligiao'));	
$app->get('/religiao(/)(:id)(/)(:flgFull)', array($gestor, 'getReligiao'));
$app->post('/orgaoemissor/', array($gestor, 'postOrgaoEmissor'));	
$app->get('/orgaoemissor(/)(:id)(/)(:flgFull)', array($gestor, 'getOrgaoEmissor'));
$app->post('/tiporesponsavel/', array($gestor, 'postTipoResponsavel'));	
$app->get('/tiporesponsavel(/)(:id)(/)(:flgFull)', array($gestor, 'getTipoResponsavel'));
$app->post('/tipoendereco/', array($gestor, 'postTipoEndereco'));	
$app->get('/tipoendereco(/)(:id)(/)(:flgFull)', array($gestor, 'getTipoEndereco'));
$app->post('/tipobloqueio/', array($gestor, 'postTipoBloqueio'));
$app->get('/tipobloqueio(/)(:id)(/)(:flgFull)', array($gestor, 'getTipoBloqueio'));

$app->post('/ciclo/', array($gestor, 'postCiclo'));
$app->get('/ciclo(/)(:id)(/)(:flgFull)', array($gestor, 'getCiclo'));

$app->get('/etapasituacao(/)(:id)(/)(:flgFull)', array($gestor, 'getSituacaoEtapa'));
$app->get('/etapacursoturmaaluno/:id_aluno(/)(:flgFull)', array($gestor, 'getEtapaCursoTurmaAluno'));
$app->post('/etapa/', array($gestor, 'postEtapa'));
$app->get('/etapa(/)(:id)(/)(:flgFull)', array($gestor, 'getEtapa'));
$app->post('/medicamento/', array($gestor, 'postMedicamento'));	
$app->get('/medicamento(/)(:id)(/)(:flgFull)', array($gestor, 'getMedicamento'));
$app->post('/vacina/', array($gestor, 'postVacina'));	
$app->get('/vacina(/)(:id)(/)(:flgFull)', array($gestor, 'getVacina'));
$app->post('/feriado/', array($gestor, 'postFeriado'));	
$app->get('/feriado(/)(:id)(/)(:flgFull)', array($gestor, 'getFeriado'));
$app->post('/telefone/', array($gestor, 'postTelefonePessoa'));
$app->post('/pessoadadosmedico/', array($gestor, 'postDadosMedicoPessoa'));
$app->get('/gruposanguineo(/)(:id)(/)(:flgFull)', array($gestor, 'getGrupoSanguineo'));
$app->get('/responsaveisaluno(/)(:id)(/)(:flgFull)', array($gestor, 'getResponsaveis'));
$app->get('/dadosmedico(/)(:id)(/)(:flgFull)', array($gestor, 'getDadosMedicoPessoa'));
$app->post('/responsavel(/)(:data)(/)(:flgFull)', array($gestor, 'postResponsavelPessoa'));
$app->post('/alunoreceitafixa/', array($gestor, 'postAlunoReceitaFixa'));	
$app->get('/alunoreceitafixa(/)(:id)(/)(:id_aluno)(/)(:flgFull)', array($gestor, 'getAlunoReceitaFixa'));	
$app->post('/alunofinanceiro/', array($gestor, 'postAlunoFinanceiro'));	
$app->get('/alunofinanceiro(/)(:id)(/)(:id_aluno)(/)(:flgFull)', array($gestor, 'getAlunoFinanceiro'));	
$app->post('/aluno(/)(:data)(/)(:flgFull)', array($gestor, 'postAluno'));
$app->get('/aluno(/)(:id)(/)(:flgFull)', array($gestor, 'getAluno'));
$app->post('/enderecoaluno/', array($gestor, 'postEnderecoAluno'));	
$app->post('/endereco(/)(:data)(/)(:flgFull)', array($gestor, 'postEnderecoPessoa'));	
$app->get('/tiponecessidadesespeciaispessoa(/)(:pessoa)(/)(:id)(/)(:flgFull)', array($gestor, 'getTipoNecessidadesEspeciaisPessoa'));
$app->get('/tipocontatopessoa(/)(:pessoa)(/)(:id)(/)(:flgFull)', array($gestor, 'getTipoContatoPessoa'));
$app->post('/disciplina/', array($gestor, 'postDisciplina'));	
$app->get('/disciplina(/)(:id)(/)(:flgFull)', array($gestor, 'getDisciplina'));
$app->get('/getdisciplinaaluno/', array($gestor, 'getDisciplinaAluno'));
$app->post('/periodoaula/', array($gestor, 'postPeriodoAula'));	
$app->get('/periodoaula(/)(:iD)(/)(:flgFull)', array($gestor, 'getPeriodoAula'));
$app->post('/doenca/', array($gestor, 'postDoenca'));	
$app->get('/doenca(/)(:id)(/)(:flgFull)', array($gestor, 'getDoenca'));
$app->post('/convenio/', array($gestor, 'postConvenio'));	
$app->get('/convenio(/)(:id)(/)(:flgFull)', array($gestor, 'getConvenio'));
$app->post('/tipofuncionario/', array($gestor, 'postTipoFuncionario'));
$app->get('/tipofuncionario(/)(:consulta)(/)(:id)(/)(:flgFull)', array($gestor, 'getTipoFuncionario'));
$app->post('/funcao/', array($gestor, 'postFuncao'));
$app->get('/funcao(/)(:consulta)(/)(:id)(/)(:idtipofuncionario)(/)(:flgFull)', array($gestor, 'getFuncao'));
$app->post('/estabelecimento/', array($gestor, 'postEstabelecimento'));
$app->get('/estabelecimento(/)(:consulta)(/)(:id)(/)(:flgFull)', array($gestor, 'getEstabelecimento'));
$app->post('/cor_raca/', array($gestor, 'postCorRaca'));
$app->get('/cor_raca(/)(:consulta)(/)(:id)(/)(:flgFull)', array($gestor, 'getCorRaca'));
$app->post('/tipoturma/', array($gestor, 'postTipoTurma'));
$app->get('/tipoturma(/)(:consulta)(/)(:id)(/)(:flgFull)', array($gestor, 'getTipoTurma'));
$app->post('/textogrupoocorrencia/', array($gestor, 'postTextoGrupoOcorrencia'));
$app->get('/textogrupoocorrencia(/)(:id)(/)(:id_grupo_ocorrencia)(/)(:flgFull)', array($gestor, 'getTextoGrupoOcorrencia'));
$app->post('/tipoinformativo/', array($gestor, 'postTipoInformativo'));
$app->get('/tipoinformativo(/)(:id)(/)(:flgFull)', array($gestor, 'getTipoInformativo'));
$app->post('/eventoinformativo/', array($gestor, 'postEventoInformativo'));
$app->get('/eventoinformativo(/)(:id)(/)(:flgFull)', array($gestor, 'getEventoInformativo'));
$app->post('/faixa/', array($gestor, 'postFaixa'));
$app->get('/faixa(/)(:id)(/)(:flgFull)', array($gestor, 'getFaixa'));
$app->post('/origem/', array($gestor, 'postOrigem'));
$app->get('/origem(/)(:id)(/)(:flgFull)', array($gestor, 'getOrigem'));
$app->post('/funcionarioescola/', array($gestor, 'postFuncionarioEscola'));
$app->get('/funcionarioescola(/)(:tipo)(/)(:id)(/)(:flgFull)', array($gestor, 'getFuncionarioEscola'));
$app->post('/tipodisciplinacurso/', array($gestor, 'postTipoDisciplinaCurso'));
$app->get('/tipodisciplinacurso(/)(:id)(/)(:flgFull)', array($gestor, 'getTipoDisciplinaCurso'));
$app->post('/documento/', array($gestor, 'postDocumentoPessoa'));
$app->get('/pendentedocumento(/)(:id_pessoa)(/)(:flgFull)', array($gestor, 'getDocumentoPendente'));
$app->post('/pendentedocumento/', array($gestor, 'postDocumentoPessoaPendente'));
$app->get('/produtosfornecedores(/)(:id)(/)(:flgFull)', array($gestor, 'getProdutosFornecedores'));
$app->post('/tipocurso/', array($gestor, 'postTipoCurso'));
$app->get('/tipocurso(/)(:consulta)(/)(:id)(/)(:flgFull)', array($gestor, 'getTipoCurso'));
$app->post('/cursohorarioordenacao/', array($gestor, 'postCursoHorarioOrdenacao'));
$app->post('/delcursohorario/', array($gestor, 'delCursoHorario'));
$app->get('/cursoetapa/:id_etapa', array($gestor, 'getCursoEtapa'));
$app->post('/cursohorario/', array($gestor, 'postCursoHorario'));
$app->get('/cursohorario(/)(:id)(/)(:id_curso)(/)(:flgFull)', array($gestor, 'getCursoHorario'));
$app->post('/cursonotaordenacao/', array($gestor, 'postCursoNotaOrdenacao'));
$app->post('/cursocondicaoordenacao/', array($gestor, 'postCursoCondicaoOrdenacao'));
$app->post('/cursocondicao/', array($gestor, 'postCursoCondicao'));
$app->get('/cursocondicao(/)(:id)(/)(:id_curso)(/)(:id_condicao)(/)(:flgFull)', array($gestor, 'getCursoCondicao'));
$app->get('/cursonota(/)(:id)(/)(:id_curso)(/)(:id_condicao)(/)(:flgFull)', array($gestor, 'getCursoNota'));
$app->post('/cursonota/', array($gestor, 'postCursoNota'));
$app->get('/cursoturmaalunocomponente(/)(:id_curso)(/)(:id_turma)(/)(:fase)(/)(:id_aluno)(/)(:flgFull)', array($gestor, 'getCursoTurmaAlunoComponente'));
$app->post('/curso/', array($gestor, 'postCurso'));
$app->get('/curso(/)(:consulta)(/)(:id)(/)(:id_etapa)(/)(:flgFull)', array($gestor, 'getCurso'));
$app->post('/ocorrenciapessoa/', array($gestor, 'postPessoaOcorrencia'));
$app->get('/ocorrenciapessoa(/)(:id)(/)(:flgFull)', array($gestor, 'getPessoaOcorrencia'));
$app->get('/recorrencia(/)(:consulta)(/)(:id)(/)(:flgFull)', array($gestor, 'getRecorrencia'));
$app->post('/eventorecorrente/', array($gestor, 'postEventoRecorrente'));
$app->get('/eventorecorrente(/)(:id)(/)(:flgFull)', array($gestor, 'getEventoRecorrente'));
$app->post('/deleventorecorrente/', array($gestor, 'delEventoRecorrente'));

$app->post('/eventofrequenciaacertodonatario/', array($gestor, 'postEventoFrequenciaAcertoDonatario'));

$app->post('/caixa/', array($gestor, 'postCaixa'));
$app->post('/delcaixaeventofrequencia/', array($gestor, 'delCaixaEventoFrequencia'));
$app->get('/caixaevento(/)(:id_evento)(/)(:flgFull)', array($gestor, 'getCaixaEvento'));
$app->post('/cursoprofessor/', array($gestor, 'postCursoProfessor'));
$app->get('/professorcurso(/)(:id)(/)(:flgFull)', array($gestor, 'getCursoProfessor'));
$app->get('/statusunidadearmazenagemhoje(/)(:data)(/)(:flgFull)', array($gestor, 'getStatusUnidadeArmazenagemHoje'));
$app->get('/statusunidadearmazenagemvencido(/)(:data)(/)(:flgFull)', array($gestor, 'getStatusUnidadeArmazenagemVencido'));
$app->get('/statusunidadearmazenagemvencer(/)(:data)(/)(:flgFull)', array($gestor, 'getStatusUnidadeArmazenagemVencer'));
$app->post('/delprofessorcurso/', array($gestor, 'delCursoProfessor'));

$app->post('/boletim/', array($gestor, 'postBoletim'));
$app->get('/boletim(/)(:id)(/)(:consulta)(/)(:flgFull)', array($gestor, 'getBoletim'));
$app->post('/motivosdesativacao/', array($gestor, 'postMotivosDesativacao'));
$app->get('/motivosdesativacao(/)(:id)(/)(:flgFull)', array($gestor, 'getMotivosDesativacao'));
$app->post('/horariograde/', array($gestor, 'postGradeHorario'));	
$app->get('/horariograde(/)(:id)(/)(:id_grade)(/)(:flgFull)', array($gestor, 'getGradeHorario'));	
$app->post('/horario/', array($gestor, 'postHorario'));
$app->get('/horario(/)(:id)(/)(:flgFull)', array($gestor, 'getHorario'));
$app->post('/turma/', array($gestor, 'postTurma'));
$app->get('/turmaaluno(/)(:id_turma)(/)(:flgFull)', array($gestor, 'getTurmaAluno'));
$app->get('/turma(/)(:id)(/)(:id_curso)(/)(:flgFull)', array($gestor, 'getTurma'));

$app->post('/tamanholotes/', array($gestor, 'postTamanhoLotes'));
$app->get('/tamanholotes(/)(:consulta)(/)(:id)(/)(:flgFull)', array($gestor, 'getTamanhoLotes'));
$app->get('/caixadocumento(/)(:id_caixa)(/)(:id_documento)(/)(:flgFull)', array($gestor, 'getDocumentoCaixa'));
$app->get('/removefiledocumentocaixa(/)(:id)', array($gestor, 'removeFileDocumentoCaixa'));
$app->get('/condicao(/)(:id)(/)(:flgFull)', array($gestor, 'getCondicao'));
$app->get('/arredondamento(/)(consulta)(/)(:id)(/)(:flgFull)', array($gestor, 'getArredondamento'));
$app->post('/notaavaliacao/', array($gestor, 'postNotaAvaliacao'));
$app->get('/notaavaliacao/:id_curso/:id_turma/:fase(/)(:flgFull)', array($gestor, 'getNotaAvaliacao'));
$app->get('/notadetalhe(/)(:id_curso)(/)(:id_turma)(/)(:flag)', array($gestor, 'getNotaDetalhe'));
$app->post('/nota/', array($gestor, 'postNota'));
$app->get('/nota(/)(:id)(/)(:nota_informada)(/)(:flgFull)', array($gestor, 'getNota'));
$app->get('/tipocondicao(/)(:id)(/)(:flgFull)', array($gestor, 'getTipoCondicao'));
$app->post('/condicao/', array($gestor, 'postCondicao'));
$app->post('/delcursocondicao/', array($gestor, 'delCursoCondicao'));
$app->post('/delcursonota/', array($gestor, 'delCursoNota'));	

$app->get('/despesasreceitas(/)(:id)(/)(:data_inicio)(/)(:data_fim)(/)(:flgFull)', array($gestor, 'getDespesasReceitas'));
$app->post('/statusgastoreceitas/', array($gestor, 'postStatusGastosReceitas'));
$app->get('/statusdetalhe(/)(:id)(/)(:data_inicio)(/)(:data_fim)(/)(:flgFull)', array($gestor, 'getStatusDetalhe'));
$app->get('/statushistorico(/)(:data_inicio)(/)(:data_fim)(/)(:flgFull)', array($gestor, 'getStatusHistorico'));

$app->post('/tiporeceita/', array($gestor, 'postTipoReceita'));
$app->get('/tiporeceita(/)(:id)(/)(:flgFull)', array($gestor, 'getTipoReceita'));

$app->post('/motivobolsa/', array($gestor, 'postMotivoBolsa'));
$app->get('/motivobolsa(/)(:id)(/)(:flgFull)', array($gestor, 'getMotivoBolsa'));
$app->get('/carregamotivobolsagrupo/:id_grupo_motivo_bolsa', array($gestor, 'getMotivoBolsaGrupo'));
$app->post('/grupomotivobolsa/', array($gestor, 'postGrupoMotivoBolsa'));
$app->get('/grupomotivobolsa(/)(:id)(/)(:flgFull)', array($gestor, 'getGrupoMotivoBolsa'));

$app->post('/tipocarne/', array($gestor, 'postTipoCarne'));
$app->get('/tipocarne(/)(:id)(/)(:flgFull)', array($gestor, 'getTipoCarne'));
$app->post('/grupotipocarne/', array($gestor, 'postGrupoTipoCarne'));
$app->get('/grupotipocarne(/)(:id)(/)(:flgFull)', array($gestor, 'getGrupoTipoCarne'));

$app->post('/situacaoserie/', array($gestor, 'postSituacaoSerie'));

$app->post('/duracaofase/', array($gestor, 'postDuracaoFase'));
$app->get('/duracaofase(/)(:id)(/)(:flgFull)', array($gestor, 'getDuracaoFase'));

$app->post('/motorista/', array($gestor, 'postMotorista'));
$app->get('/motorista(/)(:id)(/)(:flgFull)', array($gestor, 'getMotorista'));

$app->post('/bolsa/', array($gestor, 'postBolsa'));
$app->get('/bolsa(/)(:id_aluno)(/)(:flgFull)', array($gestor, 'getBolsa'));	

$app->post('/veiculo/', array($gestor, 'postVeiculo'));
$app->get('/veiculo(/)(:id)(/)(:flgFull)', array($gestor, 'getVeiculo'));
$app->post('/veiculomotorista/', array($gestor, 'postVeiculoMotorista'));
$app->get('/veiculomotorista(/)(:id)(/)(:flgFull)', array($gestor, 'getVeiculoMotorista'));
$app->get('/stringmotorista', array($gestor, 'getMotoristaString'));

$app->post('/uploadfilemotorista/', array($gestor, 'uploadFileMotorista'));
$app->post('/uploadfileveiculo/', array($gestor, 'uploadFileVeiculo'));
$app->post('/delveiculomotorista/', array($gestor, 'delVeiculoMotorista'));
$app->post('/delitinerario/', array($gestor, 'delItinerario'));
$app->post('/rota/', array($gestor, 'postRota'));
$app->get('/rota(/)(:id)(/)(:flgFull)', array($gestor, 'getRota'));
$app->post('/itinerario(/)(:id)(/)(:flgFull)', array($gestor, 'postItinerario'));
$app->get('/itinerario(/)(:id)(/)(:flgFull)', array($gestor, 'getItinerario'));	
$app->post('/bloqueiomatricula/', array($gestor, 'postBloqueioMatricula'));
$app->get('/bloqueiomatricula(/)(:id)(/)(:flgFull)', array($gestor, 'getBloqueioMatricula'));
$app->post('/complementocurso/', array($gestor, 'postComplementoCurso'));
$app->get('/complementocurso(/)(:id)(/)(:flgFull)', array($gestor, 'getComplementoCurso'));
$app->post('/delcomplementocurso/', array($gestor, 'delComplementoCurso'));	

$app->get('/entbytipo(/)(:id)(/)(:flgFull)', array($gestor, 'getEntidadeByTipo'));

$app->get('/grupotipoavaliacaoperiodica(/)(:id)(/)(:flgFull)', array($gestor, 'getGrupoTipoAvaliacaoPeriodica'));
$app->post('/grupotipoavaliacaoperiodica(/)(:id)(/)(:flgFull)', array($gestor, 'postGrupoTipoAvaliacaoPeriodica'));

$app->get('/ocorrenciasituacao(/)(:id)(/)(:flgFull)', array($gestor, 'getSituacaoOcorrencia'));
$app->post('/ocorrenciasituacao(/)(:id)(/)(:flgFull)', array($gestor, 'postSituacaoOcorrencia'));

$app->get('/tipoavaliacaoperiodica(/)(:id)(/)(:flgFull)', array($gestor, 'getTipoAvaliacaoPeriodica'));
$app->post('/tipoavaliacaoperiodica(/)(:id)(/)(:flgFull)', array($gestor, 'postTipoAvaliacaoPeriodica'));

$app->get('/tipoitenspublicacao(/)(:id)(/)(:flgFull)', array($gestor, 'getTipoItensPublicacao'));
$app->post('/tipoitenspublicacao(/)(:id)(/)(:flgFull)', array($gestor, 'postTipoItensPublicacao'));
$app->get('/carregarcursoturma(/)(:id_curso)(/)(:flgFull)', array($gestor, 'carregarCursoTurma'));
$app->get('/carregaetapacurso(/)(:id_curso)(/)(:id_etapa)', array($gestor, 'carregaEtapaCurso'));

$app->get('/historico(/)(:id)(/)(:flgFull)', array($gestor, 'getHistorico'));
$app->post('/historico(/)(:id)(/)(:flgFull)', array($gestor, 'postHistorico'));

$app->get('/getstringetapa(/)(:id)(/)(:flgFull)', array($gestor, 'getStringEtapa'));
$app->get('/gethistoricoparte(/)(:flgFull)', array($gestor, 'getHistoricoParte'));
$app->post('/delbolsa/', array($gestor, 'delBolsa'));
$app->post('/delbloqueio/', array($gestor, 'delBloqueio'));
$app->get('/bloqueioaluno(/)(:id)(/)(:flgFull)', array($gestor, 'getAlunoBloqueio'));
$app->post('/bloqueioaluno/', array($gestor, 'postAlunoBloqueio'));


	//****************FIM - MÓDULO ESCOLA


	//*************** MÓDULO EMPREGOS
$app->post('/status/', array($gestor, 'postStatus'));
$app->post('/vaga/', array($gestor, 'postVaga'));
$app->post('/tipovaga/', array($gestor, 'postTipoVaga'));
$app->post('/faixasalarial/', array($gestor, 'postFaixaSalarial'));
$app->post('/ramoempresa/', array($gestor, 'postRamoEmpresa'));
$app->post('/empresa/', array($gestor, 'postEmpresa'));
$app->post('/uploadlogo/:id/', array($gestor, 'uploadLogo'));
$app->post('/logotipo_matriz/:id', array($gestor, 'uploadLogomarca'));
$app->post('/contatoempresa/', array($gestor, 'postContatoEmpresa'));
	/*
	$app->get('/statusvaga(/)(:id)(/)(:flgFull)', array($gestor, 'getStatusVaga'));
	$app->get('/salariofaixa(/)(:id)(/)(:flgFull)', array($gestor, 'getFaixaSalarial'));
	$app->get('/tipovaga(/)(:id)(/)(:flgFull)', array($gestor, 'getTipoVaga'));
	$app->get('/empresa(/)(:id)(/)(:flgFull)', array($gestor, 'getEmpresa'));
	*/

	$app->get('/statusvaga(/)(:id)(/)(:flgFull)', array($gestor, 'getStatusVaga'));
	$app->get('/vaga(/)(:id)(/)(:flgFull)', array($gestor, 'getVaga'));
	$app->get('/tipovaga(/)(:id)(/)(:flgFull)', array($gestor, 'getTipoVaga'));
	$app->get('/salariofaixa(/)(:id)(/)(:flgFull)', array($gestor, 'getFaixaSalarial'));		
	$app->get('/ramoempresa(/)(:id)(/)(:flgFull)', array($gestor, 'getRamoEmpresa'));		
	$app->get('/empresa(/)(:id)(/)(:flgFull)', array($gestor, 'getEmpresa'));
	$app->get('/contatoempresa(/)(:id)(/)(:flgFull)', array($gestor, 'getContatoEmpresa'));
	$app->get('/painelvagas(/)(:flgFull)', array($gestor, 'getPainelVagas'));
	
	$app->get('/contaralunosprofessores(/)(:flgFull)', array($gestor, 'getContarAlunosProfessores'));
	$app->get('/contarstatisticaalunos(/)(:flgFull)', array($gestor, 'getContarStatisticaAlunos'));
	$app->get('/dashboardgraficopizza(/)(:flgFull)', array($gestor, 'getDashboardGraficoPizza'));
	$app->get('/dashboardgraficobarra(/)(:flgFull)', array($gestor, 'getDashboardGraficoBarra'));

	$app->get('/graficofinanceiroentidade/:id_entidade/', array($gestor, 'getGraficoFinanceiroEntidade'));
	$app->get('/graficopagantesinadimplentes/:id_entidade/', array($gestor, 'getGraficoPagantesInadimplentes'));

	$app->get('/graficojazigocemiterio/', array($gestor, 'getGraficoJazigoCemiterio'));
	$app->get('/graficomesquitadoacoes/', array($gestor, 'getGraficoMesquitaDoacoes'));

	$app->get('/graficoalunosmensalistasbolsistas/', array($gestor, 'getGraficoAlunoMensalistaBolsista'));

	$app->get('/reuniaoalunopdf(/)(:id_etapa)(/)(:id_curso)(/)(:id_turma)(/)(:id_aluno)', array($gestor, 'getGraficoAlunoTurma'));
	
	$app->get('/matriculadisciplina(/)(:id_aluno)(/)(:flgFull)', array($gestor, 'getMatriculaDisciplina'));	
	$app->post('/matricula/', array($gestor, 'postMatricula'));	
	$app->get('/matricula(/)(:id)(/)(:id_turma)(/)(:id_etapa)(/)(:id_aluno)(/)(:turma_x_etapa)(/)(:flgFull)', array($gestor, 'getMatricula'));	
	$app->get('/grade(/)(:id)(/)(:flgFull)', array($gestor, 'getGrade'));	
	$app->post('/grade/', array($gestor, 'postGrade'));	
	$app->post('/delgradehorario/', array($gestor, 'delGradeHorario'));	
	$app->get('/diasemana(/)(:consulta)(/)(:id)(/)(:flgFull)', array($gestor, 'getDiaSemana'));	
	$app->get('/situacaomatricula(/)(:consulta)(/)(:id)(/)(:flgFull)', array($gestor, 'getSituacaoMatricula'));	
	$app->post('/situacaomatricula/', array($gestor, 'postSituacaoMatricula'));	
	$app->post('/delcontatoempresa/', array($gestor, 'delContatoEmpresa'));	
	$app->post('/delalunofinanceiro/', array($gestor, 'delAlunoFinanceiro'));	
	$app->post('/delalunoreceitafixa/', array($gestor, 'delAlunoReceitaFixa'));	

	$app->get('/usuario(/)(:id)(/)(:id_pessoa)(/)(:flgFull)', array($gestor, 'getUsuario'));

	$app->post('/parametrocobrancaocorrencia/', array($gestor, 'postParametroCobrancaOcorrencia'));	
	$app->get('/parametrocobrancaocorrencia(/)(:id)(/)(:id_parametro)(/)(:flgFull)', array($gestor, 'getParametroCobrancaOcorrencia'));
	$app->post('/delparametrocobrancaocorrencia/', array($gestor, 'delParametroCobrancaOcorrencia'));	
	
	$app->post('/parametrocobranca/', array($gestor, 'postParametroCobranca'));	
	$app->get('/parametrocobranca(/)(:id)(/)(:flgFull)', array($gestor, 'getParametroCobranca'));


	$app->post('/cobrancapreco/', array($gestor, 'postCobrancaPreco'));	
	$app->get('/cobrancapreco(/)(:id)(/)(:id_parambetro_ocorrencia)(/)(:flgFull)', array($gestor, 'getCobrancaPreco'));
	$app->post('/delcobrancapreco/', array($gestor, 'delCobrancaPreco'));

	$app->get('/gerarparcelaparametrocobranca/:id_tipo_carne/:id_etapa/:id_aluno/:mes_ano(/)(:flgFull)', array($gestor, 'getGerarParcelaParametroCobranca'));
	$app->post('/gerarparcela/', array($gestor, 'postGerarParcela'));	

	//$app->get('/gerarparcelaalunoReceitafixa/:id_aluno/:data_inicio/:data_fim(/)(:flgFull)', array($gestor, 'getGerarParcelaAlunoReceitaFixa'));	
	$app->get('/gerarparcela/:id_tipo_carne/:ano_mes(/)(:id_aluno)(/)(:posicao)(/)(:pacote)(/)(:flgFull)', array($gestor, 'getGerarParcela'));	
	
	$app->get('/carregapessoa/:tipopessoa', array($gestor, 'getCarregaPessoa'));
	$app->get('/parcelaresponsavel(/)(:id_parcela)(/)(:id_responsavel)(/)(:flgFull)', array($gestor, 'getParcelaResponsavel'));
	$app->get('/parcelaaluno(/)(:id_aluno)(/)(:flgFull)', array($gestor, 'getParcelaAluno'));
	$app->get('/parcela(/)(:id)(/)(:flgFull)', array($gestor, 'getParcela'));

	$app->get('/tipoplanoua(/)(:id)(/)(:flgFull)', array($gestor, 'getTipoPlanoUa'));

	$app->post('/gerarboleto/', array($gestor, 'postGerarBoleto'));
	
	$app->get('/geraboletodownload/:arquivo(/)(:flgFull)', array($gestor, 'getGeraBoletoDownload'));

	$app->get('/listapessoaturma(/)(:id)', array($gestor, 'getListaComboPessoaTurma'));
	
	$app->get('/listaalunoturma/:id_turma', array($gestor, 'getListaAlunoTurma'));
	$app->post('/cadastrasalavirtual/', array($gestor, 'postSalaVirtual'));
	$app->post('/salavirtualitempublicacao/', array($gestor, 'postSalaVirtualItemPublicacao'));
	$app->get('/listatipoitempublicacao/', array($gestor, 'getSalaTipoItensPublicacao'));
	$app->post('/uploaditempublicacao/:id', array($gestor, 'uploadFilePublicacao'));
	$app->get('/salavirtual/', array($gestor, 'getSalaVirtual'));
	$app->get('/salavirtualdetalhes/:id/', array($gestor, 'getSalaVirtualDetalhes'));
	$app->get('/salavirtualcategoria/', array($gestor, 'getSalaVirtualCategoria')); 
	$app->get('/logoutacademico/', array($gestor, 'logoutAcademico'));
	$app->get('/serie(/)(:id)', array($gestor, 'getSerie'));
	$app->get('/professor(/)(:id_curso)(/)(:id_disciplina)(/)(:id_pessoa)', array($gestor, 'getProfessor'));
	$app->get('/listacombocursos(/)(:ano)', array($gestor, 'getListaComboCurso'));
	$app->get('/listacomboturmas/:id_curso/:id_serie(/)(:ano)', array($gestor, 'getListaComboTurmas'));
	$app->get('/listacombodisciplinas/:id_curso', array($gestor, 'getListaComboDisciplinas'));
	$app->get('/listacomunicadoturmaaluno/:id_turma', array($gestor, 'getComunicadoTurma'));
	$app->get('/griddisciplinas/:id_curso(/)(:ano)(/)(:serie)(/)(:turma)(/)(:disciplina)(/)(:professor)', array($gestor, 'getGridDisciplinas'));
	

	$app->get('/ocorrenciasaula(/)(:id)', array($gestor, 'getOcorrenciasAula'));
	$app->get('/aulas(/)(:id)(/):id_turma/:fase/:id_disciplina/:id_pessoa_professor', array($gestor, 'getAulas'));
	$app->post('/cadastrarconteudoaulas/', array($gestor, 'postCadastrarConteudoAulas'));
	$app->post('/excluirconteudoaula/', array($gestor, 'excluirConteudoAula'));
	$app->post('/cadastrarcomunicado/', array($gestor, 'cadastrarComunicado'));
	$app->get('/carregarcomunicado(/)(:id)', array($gestor, 'carregarComunicado'));
	$app->get('/listaaulasturma/:id', array($gestor, 'getListaAulasTurma'));
	$app->post('/salvafaltaaluno/', array($gestor, 'salvaFaltaAluno'));
	$app->get('/selectfaltas/:id_aula/:id_aluno', array($gestor, 'getSelectFaltas'));
	$app->get('/getfaltaaluno/', array($gestor, 'getFaltaAluno'));

	$app->post('/cadastraratribuicao/', array($gestor, 'cadastrarAtribuicao'));
	$app->get('/carregaratribuicao(/)(:id)(/)(:flgFull)', array($gestor, 'carregarAtribuicao'));
	$app->get('/carregarsalavirtualitem(/)(:id_sala_virtual)(/)(:flgFull)', array($gestor, 'carregarSalaVirtualItem'));
	$app->get('/carregarsalavirtual(/)(:id_sala_virtual)(/)(:flgFull)', array($gestor, 'carregarSalaVirtual'));
	
	$app->post('/cadastraravaliacaodescritiva/', array($gestor, 'cadastrarAvaliacaoDescritiva'));
	$app->get('/carregaravaliacaodescritiva(/)(:id)(/)(:flgFull)', array($gestor, 'carregarAvaliacaoDescritiva'));
	$app->post('/salvaocorrenciaaluno/', array($gestor, 'postOcorrenciaAluno'));
	$app->get('/listaocorrenciaalunos/:id', array($gestor, 'getListaOcorrenciaAlunos'));
	
	$app->get('/salavirtualaluno/:id_turma/:id_curso/:serie(/)(:id_categoria)(/)(:id_disciplina)', array($gestor, 'getSalaVirtualAluno'));

	$app->get('/getlistadadosaluno/', array($gestor, 'getAlunoAll'));

	$app->get('/carregardadosusuario(/)(:id_pessoa)(/)(:flgFull)', array($gestor, 'carregarDadosUsuario'));
	$app->get('/carregardadosanoletivo(/)(:flgFull)', array($gestor, 'carregarDadosAnoLetivo'));

	$app->post('/salvaavaliacaoperiodica/', array($gestor, 'postAvaliacaoPeriodicaAluno'));
	$app->get('/listaavaliacaoperiodicaaluno/:turma/:disciplina/:fase', array($gestor, 'getAvaliacaoPeriodicaAluno'));

	$app->get('/componentedetalhe(/)(:id_componente)(/)(:flgFull)', array($gestor, 'getComponenteDetalhe'));

	$app->post('/importarpessoa/', array($gestor, 'postImportarPessoa'));
	$app->post('/importaraluno/', array($gestor, 'postImportarAluno'));
	$app->post('/importarresponsavel/', array($gestor, 'postImportarResponsavel'));
	$app->post('/importarcomplementarresponsavel/', array($gestor, 'postImportarComplementarResponsavel'));
	
	$app->get('/lerpasta(/)(:pasta)(/)(:flgFull)', array($gestor, 'getLerPasta'));
	$app->get('/relatoriopessoaenderecocontatodocumento/:tipo(/)(:data_inicio)(/)(:data_final)(/)(:formato)', array($gestor, 'relatorioPessoaEnderecoContatoDocumento'));
	$app->get('/relatorioentredasaida(/)(:data_inicio)(/)(:data_final)(/)(:id_conta_bancaria)(/)(:formato)', array($gestor, 'relatorioEntradaSaida'));
	
	$app->post('/uploadcommumfile(/)', array($gestor, 'uploadCommumFile'));
	$app->post('/baixaboleto(/)', array($gestor, 'postBaixaBoleto'));

	$app->get('/baixaboleto(/)(:flgFull)', array($gestor, 'getBaixaBoleto'));

	$app->post('/copiarparametrocobranca(/)', array($gestor, 'postCopiarParametroCobranca'));

	$app->post('/importarfinanceiro(/)', array($gestor, 'postImportarFinanceiro'));

	$app->get('/extrair(/)(:tipo_grid_ou_inserts_ou_alter)(/)(:nome_tabela)(/)(:condicao)(/)(:ordem)', array($gestor, 'getExtrair'));
	$app->post('/executar(/)', array($gestor, 'postExecutar'));
	$app->get('/relatoriomatricula(/)(:id_etapa)(/)(:formato)', array($gestor, 'relatorioMatricula'));
	$app->get('/relatoriofamilia(/)(:id_turma)(/)(:formato)', array($gestor, 'relatorioFamilia'));
	$app->get('/relatoriodespesa(/)(:id_conta_bancaria)(/)(:data_inicio)(/)(:data_fim)(/)(:formato)', array($gestor, 'relatorioDespesa'));
	$app->get('/avisovencimentogaveta/', array($gestor, 'getAvisoVencimentoGaveta'));

	$app->get('/visualizararquivoboleto/:mes_ano(/)(:id_responsavel)', array($gestor, 'getVisualizarArquivoBoleto'));

	$app->post('/updatesituacaomobimentacao/:id', array($gestor, 'updateSituacaoMovimentacao'));
	
	$app->get('/geraretiqueta/:mes_ano/:id_tipo_carne(/)(:id_responsavel)(/)(:flgFull)', array($gestor, 'getGerarEtiqueta'));
	$app->post('/updateparcela/', array($gestor, 'postUpdateParcela'));

	$app->get('/fase(/)(:ano)(/)(:flgFull)', array($gestor, 'getFase'));

	$app->run();