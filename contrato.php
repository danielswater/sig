<?php
include('api/includes/init.php');
include('valor_extenso.php');
fSession::setPath('api/includes/classes/session');
fSession::setLength('1 hour');
fSession::open();
setlocale( LC_ALL, 'pt_BR', 'pt_BR.iso-8859-1', 'pt_BR.utf-8', 'portuguese' );
date_default_timezone_set( 'America/Sao_Paulo' );

$template = $_GET['template'];
$id_pessoa = $_GET['pessoa'];

$id_jazigo = $_GET['jazigo'];

$sessionID = fSession::get('user');
$user_id = $sessionID['user']['id'];

$entidade = fRecordSet::build('Entidade', array('id=' => $user_id));

$nome_entidade = '';
$cnpj_entidade = '';
$cidade_entidade = '';
$estado_entidade = '';

foreach ($entidade as $key => $value) {
	$nome_entidade = $value->getNome();
	$cnpj_entidade = $value->getCnpj();
	$cidade_entidade = $value->getCidade();
	$estado_entidade = $value->getEstado();
}

$tabela = fRecordSet::build('Template', array('id=' => $template));

foreach ($tabela as $key => $value) {
	$texto = $value->getTexto();
}

$pessoa = fRecordSet::build('Pessoa', array('id=' => $id_pessoa));

foreach ($pessoa as $key => $value){
	$nome_pessoa = $value->getNome();
	$nacionalidade = $value->getNacionalidade(); 
}

$numeroDocumento = '';
$docPessoa = fRecordSet::build('Documento', array('id_pessoa=' => $id_pessoa));
foreach ($docPessoa as $key => $value) {
	$numeroDocumento = $value->getNumero();
		# code...
}

$aSearchDoc = array();
$aSearchDoc['id_pessoa='] = $id_pessoa;
$aSearchDoc['id_tipo_documento='] = 1;
$rg = '';
$doc = fRecordSet::build('Documento',$aSearchDoc);
foreach ($doc as $key => $value) {
	$rg = $value->getNumero();
}

//$rg = $doc->getNumero();

$aSearchDoc = array();
$aSearchDoc['id_pessoa='] = $id_pessoa;
$aSearchDoc['id_tipo_documento='] = 2;

$cpf = '';
$doc = fRecordSet::build('Documento',$aSearchDoc);
foreach ($doc as $key => $value) {
	$cpf = $value->getNumero();
}

//$cpf = $doc->getNumero();

$jazigo_val = fRecordSet::build('UnidadeArmazenagemPessoa', array('id_unidade_armazenagem=' => $id_jazigo));
$valor = '';
$valor_manutencao = '';
$data_concessao = '';
foreach ($jazigo_val as $key => $value) {
	$valor = $value->getValor();
	$valor_manutencao = $value->getValorManutencao();
	$data_concessao = $value->getDataConcessao()->format('d/m/Y');
}

$jazigo = fRecordSet::build('UnidadeArmazenagem', array('id=' => $id_jazigo));
$descricao_jazigo ='';
$numero_tumulo = '';
$id_lote = '';
$id_periodicidade_cobranca = '';
$id_tipo_concessao = '';

foreach ($jazigo as $key => $value) {
	$descricao_jazigo = $value->getDescricao();
	$numero_tumulo = $value->getNumeroTumulo();
	$id_lote = $value->getIdLote();
	$id_periodicidade_cobranca = $value->getIdPeriodicidadeCobranca();
	$id_tipo_concessao = $value->getIdTipoConcessao();
}

if($id_tipo_concessao == 2){
	$clausula = "<strong>Cláusula 3</strong> – Conforme contrato de concessão onerosa de jazigo firmado entre as partes aos ".$data_concessao.", a <strong>CONTRATADA</strong> concedeu ao <strong>CONTRATANTE</strong> , para fins exclusivos de sepultamento, na forma da legislação em vigor e obedecidos os preceitos estatutários e vigentes, o uso do jazigo no: [JAZIGO] UNITARIOS da quadra [QUADRA] , para o exclusivo efeito de nele ser sepultado quem for designado, a qualquer tempo, como beneficiário, pelo concessionário ora <strong>CONTRATANTE</strong>.</br></br>

<strong>Cláusula 4</strong> – A título de ADMINISTRAÇÃO E MANUTENÇÃO da concessão do jazigo acima epigrafado, pagará o <strong>CONTRATANTE</strong> à <strong>CONTRATADA</strong> uma taxa anual de administração e manutenção equivalente a 01 (UM) salário mínimo vigente na Capital do Estado de São Paulo, respeitando-se sua evolução natural, que será aplicada à presente concessão somente no ano seguinte, a ser pago da seguinte forma : [PERIODICIDADE].
";
}
else{
	$clausula = "<strong>Cláusula 3</strong> – Conforme contrato de concessão onerosa de jazigo firmado entre as partes aos ".$data_concessao.", a <strong>CONTRATADA</strong> concedeu ao <strong>CONTRATANTE</strong> , para fins exclusivos de sepultamento, na forma da legislação em vigor e obedecidos os preceitos estatutários e vigentes, o uso do jazigo nº [JAZIGO] da quadra [QUADRA], setor [SETOR] para o exclusivo efeito de nele ser sepultado quem for designado, a qualquer tempo, como beneficiário, pelo concessionário ora <strong>CONTRATANTE</strong>.</br></br>

<strong>Cláusula 4</strong> – A título de ADMINISTRAÇÃO E MANUTENÇÃO da concessão do jazigo acima epigrafado, pagará o <strong>CONTRATANTE</strong> à <strong>CONTRATADA</strong> uma taxa anual de administração e manutenção equivalente a 02 (DOIS) salários mínimos vigente na Capital do Estado de São Paulo, respeitando-se sua evolução natural, que será aplicada à presente concessão somente no ano seguinte, a ser pago da seguinte forma :
";
}

$clausula_tag = "[CLAUSULAS]";

$texto = str_replace($clausula_tag, $clausula, $texto);

$descricao_periodicidade = '';

switch($id_periodicidade_cobranca){
	case 1:
	$descricao_periodicidade = "Mensal";
	break;

	case 2:
	$descricao_periodicidade = "Trimestral";
	break;

	case 3:
	$descricao_periodicidade = "Semestral";
	break;

	case 4:
	$descricao_periodicidade = "Anual";
	break;
}

$lote = fRecordSet::build('Lote', array('id=' => $id_lote));
foreach ($lote as $key => $value) {
	$id_quadra = $value->getIdQuadra();
	$descricao_lote = $value->getDescricao();
	//$tamanho_lote = $value->getTamanho();
	$preco_lote = $value->getPreco();
}

$quadra = fRecordSet::build('Quadra', array('id=' => $id_quadra));
$descricao_quadra = '';
$setor_quadra = '';
foreach ($quadra as $key => $value) {
	$descricao_quadra = $value->getDescricao();
	$setor_quadra = $value->getSetor();
}
$telefone = '';
$ddd = '';
$tel = fRecordSet::build('Telefone',array('id_pessoa=' => $id_pessoa));
foreach ($tel as $key => $value) {
	$ddd = $value->getDdd();
	$telefone = $value->getNumero();
}

$endPessoa = fRecordSet::build('Endereco', array('id_pessoa=' => $id_pessoa));
$descricao = '';
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

$ext = @valorPorExtenso($valor_manutencao,true);

$dados = array();
$vars = array();
$variavel = fRecordSet::build('Variavel');

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
	if($value->getTag() == "[NACIONALIDADE]"){
		$vars[] = $value->getTag();
		$dados[] = $nacionalidade;
	}
	if($value->getTag() == "[RG]"){
		$vars[] = $value->getTag();
		$dados[] = $rg;
	}
	if($value->getTag() == "[CPF]"){
		$vars[] = $value->getTag();
		$dados[] = $cpf;
	}
	if($value->getTag() == "[JAZIGO]"){
		$vars[] = $value->getTag();
		$dados[] = $numero_tumulo;
	}
	if($value->getTag() == "[QUADRA]"){
		$vars[] = $value->getTag();
		$dados[] = $descricao_quadra;
	}
	if($value->getTag() == "[SETOR]"){
		$vars[] = $value->getTag();
		$dados[] = $setor_quadra;
	}
	if($value->getTag() == "[VALOR_MANUTENCAO]"){
		$vars[] = $value->getTag();
		$dados[] = number_format($valor_manutencao, 2, ',', '.');
	}
	if($value->getTag() == "[TELEFONE]"){
		$vars[] = $value->getTag();
		$dados[] = "(".$ddd.") " . $telefone;
	}
	if($value->getTag() == "[PERIODICIDADE]"){
		$vars[] = $value->getTag();
		$dados[] = $descricao_periodicidade;
	}
	if($value->getTag() == "[NOME_ENTIDADE]"){
		$vars[] = $value->getTag();
		$dados[] = $nome_entidade;
	}
	if($value->getTag() == "[CNPJ_ENTIDADE]"){
		$vars[] = $value->getTag();
		$dados[] = mask($cnpj_entidade,'##.###.###/####-##');
	}
	if($value->getTag() == "[CIDADE_ENTIDADE]"){
		$vars[] = $value->getTag();
		$dados[] = $cidade_entidade;
	}
	if($value->getTag() == "[ESTADO_ENTIDADE]"){
		$vars[] = $value->getTag();
		$dados[] = $estado_entidade;
	}
}

function mask($val, $mask)
{
 $maskared = '';
 $k = 0;
 for($i = 0; $i<=strlen($mask)-1; $i++)
 {
 if($mask[$i] == '#')
 {
 if(isset($val[$k]))
 $maskared .= $val[$k++];
 }
 else
 {
 if(isset($mask[$i]))
 $maskared .= $mask[$i];
 }
 }
 return $maskared;
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