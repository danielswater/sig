<?php

include('api/includes/init.php');
include('valor_extenso.php');

function _getDb() {	
	$db = new fDatabase(DB_TYPE, ID_DB_NAME, ID_DB_USER, ID_DB_PASS, ID_DB_HOST);	
	return $db;
}

setlocale( LC_ALL, 'pt_BR', 'pt_BR.iso-8859-1', 'pt_BR.utf-8', 'portuguese' );
date_default_timezone_set( 'America/Sao_Paulo' );

$id_template = $_GET['template'];
$id_conversao = $_GET['conversao'];

$tabela = fRecordSet::build('Template', array('id=' => $id_template));

foreach ($tabela as $key => $value) {	
	$texto = $value->getTexto();
}


$campos = array('c.id'					 			 ,
				'c.id_religiao'			 			 ,
				'r.descricao religiao_descricao'	 ,
				'c.id_tipo_documento'		 		 ,
				't.descricao tipodocumento_descricao',
				'c.nome'					 		 ,
				'c.nacionalidade'			 		 ,
				'c.nome_convertido'		 			 ,
				'c.data_nascimento'		 			 ,
				'c.numero_documento'		 		 ,
				'c.logradouro'			 			 ,
				'c.numero'				 			 ,
				'c.bairro'				 			 ,
				'c.complemento'			 			 ,
				'c.cidade'				 			 ,
				'c.estado'				 			 ,
				'c.codigo_postal'			 		 ,
				'c.nome_testemunha_01'	 			 ,
				'c.documento_testemunha_01'			 ,
				'c.nome_testemunha_02'	 			 ,
				'c.documento_testemunha_02'			 ,	
				'c.data_conversao'					 ,
				'c.ativo');

$consulta = "SELECT %S FROM %F %J %W ORDER BY %O";
$tabela   = "conversoes c";
$join 	  = "LEFT JOIN religiao r ON r.id = c.id_religiao ";
$join 	 .= "LEFT JOIN tipo_documento t ON t.id = c.id_tipo_documento";
$condicao = "WHERE c.id = ".$id_conversao;
$ordem 	  = "c.id";

$sqlq = $consulta;
$sqlq = str_replace("%S", implode(",", $campos) , $sqlq);
$sqlq = str_replace("%F", $tabela 				, $sqlq);
$sqlq = str_replace("%J", $join 				, $sqlq);
$sqlq = str_replace("%W", $condicao 			, $sqlq);
$sqlq = str_replace("%O", $ordem 				, $sqlq);

$conversao = array();
$rs = _getDb()->query($sqlq);
foreach ($rs as $key => $value){ 		

	$dt = new DateTime($value['data_nascimento']);			
	$dt = $dt->format('d/m/Y');
	$value['data_nascimento'] = $dt;

	$dt = new DateTime($value['data_conversao']);			
	$dt = $dt->format('d/m/Y');
	$value['data_conversao'] = $dt;

	$conversao[] = $value;
}
$rs = _getDb()->close();	
$len = (count($conversao)>0) ? true : false;

if($len){
	foreach ($conversao as $key => $val) {

		$id 					 = $val['id'];
		$id_religiao 			 = $val['id_religiao'];
		$religiao_descricao		 = $val['religiao_descricao'];
		$id_tipo_documento 		 = $val['id_tipo_documento'];
		$tipodocumento_descricao = $val['tipodocumento_descricao'];
		$nome 					 = $val['nome'];
		$nacionalidade 			 = $val['nacionalidade'];
		$nome_convertido 		 = $val['nome_convertido'];
		$data_nascimento 		 = $val['data_nascimento'];
		$numero_documento 		 = $val['numero_documento'];
		$logradouro 			 = $val['logradouro'];
		$numero 				 = $val['numero'];
		$bairro 				 = $val['bairro'];
		$complemento 			 = $val['complemento'];
		$cidade 				 = $val['cidade'];
		$estado 				 = $val['estado'];
		$codigo_postal 			 = $val['codigo_postal'];
		$nome_testemunha_01 	 = $val['nome_testemunha_01'];
		$documento_testemunha_01 = $val['documento_testemunha_01'];
		$nome_testemunha_02 	 = $val['nome_testemunha_02'];
		$documento_testemunha_02 = $val['documento_testemunha_02'];
		$data_conversao 		 = $val['data_conversao'];
		$ativo 					 = $val['ativo'];
	}
}else{
		$id 					 = '';
		$id_religiao 			 = '';
		$religiao_descricao		 = '';
		$id_tipo_documento 		 = '';
		$tipodocumento_descricao = '';
		$nome 					 = '';
		$nacionalidade 			 = '';
		$nome_convertido 		 = '';
		$data_nascimento 		 = '';
		$numero_documento 		 = '';
		$logradouro 			 = '';
		$numero 				 = '';
		$bairro 				 = '';
		$complemento 			 = '';
		$cidade 				 = '';
		$estado 				 = '';
		$codigo_postal 			 = '';
		$nome_testemunha_01 	 = '';
		$documento_testemunha_01 = '';
		$nome_testemunha_02 	 = '';
		$documento_testemunha_02 = '';
		$data_conversao 		 = '';
		$ativo 					 = '';
}


$dados = array();
$vars = array();
$variavel = fRecordSet::build('Variavel');

foreach ($variavel as $key => $value) {

	if($value->getTag() == "[CERTIFICADO_ID]"){
		$vars[] = $value->getTag();
		$dados[] = $id;
	}
	if($value->getTag() == "[CERTIFICADO_TIPO_DOCUMENTO]"){
		$vars[] = $value->getTag();
		$dados[] = $tipodocumento_descricao;
	}
	if($value->getTag() == "[CERTIFICADO_RELIGIAO]"){
		$vars[] = $value->getTag();
		$dados[] = $religiao_descricao;
	}
	if($value->getTag() == "[CERTIFICADO_NOME]"){
		$vars[] = $value->getTag();
		$dados[] = $nome;
	}
	if($value->getTag() == "[CERTIFICADO_NACIONALIDADE]"){
		$vars[] = $value->getTag();
		$dados[] = $nacionalidade;
	}
	if($value->getTag() == "[CERTIFICADO_NOME_CONVERTIDO]"){
		$vars[] = $value->getTag();
		$dados[] = $nome_convertido;
	}
	if($value->getTag() == "[CERTIFICADO_DATA_NASCIMENTO]"){
		$vars[] = $value->getTag();
		$dados[] = $data_nascimento;
	}
	if($value->getTag() == "[CERTIFICADO_NUMERO_DOCUMENTO]"){
		$vars[] = $value->getTag();
		$dados[] = $numero_documento;
	}
	if($value->getTag() == "[CERTIFICADO_LOGRADOURO]"){		
		$vars[] = $value->getTag();
		$dados[] = $logradouro;
	}
	if($value->getTag() == "[CERTIFICADO_NUMERO]"){
		$vars[] = $value->getTag();
		$dados[] = $numero;
	}
	if($value->getTag() == "[CERTIFICADO_BAIRRO]"){
		$vars[] = $value->getTag();
		$dados[] = $bairro;
	}
	if($value->getTag() == "[CERTIFICADO_COMPLEMENTO]"){
		$vars[] = $value->getTag();
		$dados[] = $complemento;
	}
	if($value->getTag() == "[CERTIFICADO_CIDADE]"){
		$vars[] = $value->getTag();
		$dados[] = $cidade;
	}
	if($value->getTag() == "[CERTIFICADO_ESTADO]"){
		$vars[] = $value->getTag();
		$dados[] = $estado;
	}
	if($value->getTag() == "[CERTIFICADO_CODIGO_POSTAL]"){
		$vars[] = $value->getTag();
		$dados[] = $codigo_postal;
	}
	if($value->getTag() == "[CERTIFICADO_NOME_TESTEMUNHA_01]"){
		$vars[] = $value->getTag();
		$dados[] = $nome_testemunha_01;
	}
	if($value->getTag() == "[CERTIFICADO_DOCUMENTO_TESTEMUNHA_01]"){
		$vars[] = $value->getTag();
		$dados[] = $documento_testemunha_01;
	}
	if($value->getTag() == "[CERTIFICADO_NOME_TESTEMUNHA_02]"){
		$vars[] = $value->getTag();
		$dados[] = $nome_testemunha_02;
	}
	if($value->getTag() == "[CERTIFICADO_DOCUMENTO_TESTEMUNHA_02]"){
		$vars[] = $value->getTag();
		$dados[] = $documento_testemunha_02;
	}
	if($value->getTag() == "[CERTIFICADO_DATA_CONVERSAO]"){
		$vars[] = $value->getTag();
		$dados[] = $data_conversao;
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
		width: 900px;
		margin: auto;		
		padding: 20px;
	}
	.recibo{
		font-size: 10px;
		border-top: 5px #E28750 solid;
		padding-top: 20px;
	}
	.certificado p{
		font-size: 12px;
	}
	.btn{
		padding: 10px;
		margin-bottom: 50px;
		background-color: #F3F3F1;
	}
</style>
<script type="text/javascript">
    function printpage() {        
    	document.getElementById("bts").style.visibility='hidden';
    	window.print();
    	document.getElementById("bts").style.visibility='visible';
    }
</script>
<body>
	<div class="container" >
		<div id='bts' name='bts' class="btn" align="center">
			<button onclick="printpage()" id="imprime">Imprimir Certificado</button><button onclick="window.close();" id="fecha">Fechar Janela</button>
		</div>
		<div id="corpo" name="corpo" class="certificado">
			<?php echo str_replace($vars, $dados, $texto); ?>			
		</div>
		
	</div>
</body>
</html>