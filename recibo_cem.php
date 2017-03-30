<?php
include('api/includes/init.php');
include('valor_extenso.php');

setlocale( LC_ALL, 'pt_BR', 'pt_BR.iso-8859-1', 'pt_BR.utf-8', 'portuguese' );
date_default_timezone_set( 'America/Sao_Paulo' );

$template = $_GET['template'];
$id_pessoa = $_GET['pessoa'];
$id_jazigo = $_GET['jazigo'];

$tabela = fRecordSet::build('Template', array('id=' => $template));

$descricao = '';

foreach ($tabela as $key => $value) {
	$texto = $value->getTexto();
}

$ua = fRecordSet::build('UnidadeArmazenagemPessoa', array('id_unidade_armazenagem=' => $id_jazigo));
$valor = '';

foreach ($ua as $key => $value) {
	$valor = $value->getValor();
	$valor_manutencao = $value->getValorManutencao();
}
/*$caixa = fRecordSet::build('Caixa', array('id=' => $cx));

foreach ($caixa as $key => $value) {
	$id = $value->getId();
	$id_situacao = $value->getIdSituacao();
	$id_tipo_lancamento = $value->getIdTipoLancamento();
	$id_categoria = $value->getIdCategoria();
	$id_conta_bancaria = $value->getIdContaBancaria();
	$id_forma_pagamento = $value->getIdFormaPagamento();
	$id_pessoa = $value->getIdPessoa();
	$data_vencimento = $value->getDataVencimento();
	$descricao = $value->getDescricao();
	$valor = $value->getValor();
	$juros = $value->getJuros();
	$multa = $value->getMulta();
	$desconto = $value->getDesconto();
	$valor_final = $value->getValorFinal();
	$data_lancamento = $value->getDataLancamento();
	$numero_documento = $value->getNumeroDocumento();
	$mais_detalhes = $value->getMaisDetalhes();
	$data_pagamento = $value->getDataPagamento();
	$ativo = $value->getAtivo();
}*/

$ext =  @valorPorExtenso($valor,true);

$pessoa = new Pessoa($id_pessoa);
$nome_pessoa = $pessoa->getNome();

$numeroDocumento = '';
$docPessoa = fRecordSet::build('Documento', array('id_pessoa=' => $id_pessoa));
foreach ($docPessoa as $key => $value) {
	$numeroDocumento = $value->getNumero();
		# code...
}
$endPessoa = fRecordSet::build('Endereco', array('id_pessoa=' => $id_pessoa));
$logradouro = '';
$numero = '';
$bairro = '';
$complemento = '';
$cidade = '';
$estado = '';
$codigo_postal = '';
foreach ($endPessoa as $key => $value) {
	$logradouro = $value->getLogradouro();
	$numero = $value->getNumero();
	$bairro = $value->getBairro();
	$complemento = $value->getComplemento();
	$cidade = $value->getCidade();
	$estado = $value->getEstado();
	$codigo_postal = $value->getCodigoPostal();
}

$dados = array();
$vars = array();
$variavel = fRecordSet::build('Variavel');

if($template == 7){
	$descricao = "de venda de Jazigo";
}
if($template == 8){
	$descricao = "de manutenção de Jazigo";
}

foreach ($variavel as $key => $value) {
	if($value->getTag() == "[NOME]"){
		$vars[] = $value->getTag();
		$dados[] = $nome_pessoa;
	}
	if($value->getTag() == "[DOCUMENTO]"){
		$vars[] = $value->getTag();
		$dados[] = $numeroDocumento;
	}
	if($value->getTag() == "[LOGRADOURO]"){
		$vars[] = $value->getTag();
		$dados[] = $logradouro;
	}
	if($value->getTag() == "[NUMERO_LOGRADOURO]"){
		$vars[] = $value->getTag();
		$dados[] = $numero;
	}
	if($value->getTag() == "[BAIRRO]"){
		$vars[] = $value->getTag();
		$dados[] = $bairro;
	}
	if($value->getTag() == "[COMPLEMENTO]"){
		$vars[] = $value->getTag();
		$dados[] = $complemento;
	}
	if($value->getTag() == "[CIDADE]"){
		$vars[] = $value->getTag();
		$dados[] = $cidade;
	}
	if($value->getTag() == "[ESTADO]"){
		$vars[] = $value->getTag();
		$dados[] = $estado;
	}
	if($value->getTag() == "[CODIGO_POSTAL]"){
		$vars[] = $value->getTag();
		$dados[] = $codigo_postal;
	}
	if($value->getTag() == "[VALOR]"){
		$vars[] = $value->getTag();
		$dados[] = number_format($valor, 2, ',', '.');
	}
	if($value->getTag() == "[DATA_ATUAL]"){
		$vars[] = $value->getTag();
		$dados[] = utf8_encode(strftime( '%A, %d de %B de %Y', strtotime( date( 'Y-m-d' ) ) ));
	}
	if($value->getTag() == "[DESCRICAO_SERVICOS]"){
		$vars[] = $value->getTag();
		$dados[] = $descricao;
	}
	if($value->getTag() == "[VALOR_EXTENSO]"){
		$vars[] = $value->getTag();
		$dados[] = $ext;
	}
}


?>

<html>
<head>
	<title>Documento</title>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<style type="text/css">
	*{
		margin: 0px;
		padding: 0px;
	}
	button{
		padding: 3px;
	}
	.container{
		width: 700px;
		margin: auto;		
		padding: 20px;
	}
	.recibo{
		font-size: 10px;
		border-top: 5px #E28750 solid;
		padding-top: 20px;
	}
	.recibo p{
		font-size: 12px;
	}
	.btn{
		padding: 10px;
		margin-bottom: 50px;
		background-color: #F3F3F1;
	}

</style>
<body>
	<div class="container" >
		<div class="btn" align="center">
			<button  onclick="window.print();" id="imprime">Imprimir Recibo</button> <button  onclick="window.close();" id="fecha">Fechar Janela</button>
		</div>
		<div class="recibo">

			<?php echo str_replace($vars, $dados, $texto); ?>
		</div>
		
	</div>
</body>
</html>