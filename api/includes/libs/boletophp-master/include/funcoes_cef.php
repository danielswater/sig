<?php
// +----------------------------------------------------------------------+
// | BoletoPhp - Versão Beta                                              |
// +----------------------------------------------------------------------+
// | Este arquivo está disponível sob a Licença GPL disponível pela Web   |
// | em http://pt.wikipedia.org/wiki/GNU_General_Public_License           |
// | Você deve ter recebido uma cópia da GNU Public License junto com     |
// | esse pacote; se não, escreva para:                                   |
// |                                                                      |
// | Free Software Foundation, Inc.                                       |
// | 59 Temple Place - Suite 330                                          |
// | Boston, MA 02111-1307, USA.                                          |
// +----------------------------------------------------------------------+

// +----------------------------------------------------------------------+
// | Originado do Projeto BBBoletoFree que tiveram colaborações de Daniel |
// | William Schultz e Leandro Maniezo que por sua vez foi derivado do    |
// | PHPBoleto de João Prado Maia e Pablo Martins F. Costa                |
// |                                                                      |
// | Se vc quer colaborar, nos ajude a desenvolver p/ os demais bancos :-)|
// | Acesse o site do Projeto BoletoPhp: www.boletophp.com.br             |
// +----------------------------------------------------------------------+

// +----------------------------------------------------------------------+
// | Equipe Coordenação Projeto BoletoPhp: <boletophp@boletophp.com.br>   |
// | Desenvolvimento Boleto CEF: Elizeu Alcantara                         |
// +----------------------------------------------------------------------+

class boletophp_master{
  private $dadosBoleto, $urlProjeto;

  function __construct($dadosboleto) {
    $this->dadosBoleto = $dadosboleto;

    $this->urlProjeto = 'http://' .$_SERVER['HTTP_HOST'] .'/sig/api/';

    $codigobanco = "104";
    $codigo_banco_com_dv = $this->geraCodigoBanco($codigobanco);
    $nummoeda = "9";
    $fator_vencimento = $this->fator_vencimento($this->dadosBoleto["data_vencimento"]);

    //valor tem 10 digitos, sem virgula
    $valor = $this->formata_numero($this->dadosBoleto["valor_boleto"],10,0,"valor");
    //agencia é 4 digitos
    $agencia = $this->formata_numero($this->dadosBoleto["agencia"],4,0);
    //conta é 5 digitos
    $conta = $this->formata_numero($this->dadosBoleto["conta"],5,0);
    //dv da conta
    $conta_dv = $this->formata_numero($this->dadosBoleto["conta_dv"],1,0);
    //carteira é 2 caracteres
    $carteira = $this->dadosBoleto["carteira"];

    //conta cedente (sem dv) com 6 digitos
    $conta_cedente = $this->formata_numero($this->dadosBoleto["conta_cedente"],6,0);
    //dv da conta cedente
    $conta_cedente_dv = $this->modulo_10($conta_cedente);

    //nosso número (sem dv) é 17 digitos
    $nossonumero = $this->dadosBoleto["inicio_nosso_numero"] . $this->formata_numero($this->dadosBoleto["nosso_numero"],15,0);
    $sequenciaNossoNumero = $this->sequenciaNossoNumero($nossonumero);

    // Campo livre
    $livre = rand(1, 9);

    // 44 numeros para o calculo do digito verificador do codigo de barras
    $dv = $this->digitoVerificador_barra("$codigobanco$nummoeda$fator_vencimento$valor$conta_cedente$conta_cedente_dv$sequenciaNossoNumero$livre", 9, 0);
    // Numero para o codigo de barras com 44 digitos
    $linha = "$codigobanco$nummoeda$dv$fator_vencimento$valor$conta_cedente$conta_cedente_dv$sequenciaNossoNumero$livre";

    $agencia_codigo = $agencia." / ". $conta_cedente ."-". $conta_cedente_dv;

    $this->dadosBoleto["codigo_barras"] = $linha;
    $this->dadosBoleto["linha_digitavel"] = $this->monta_linha_digitavel($linha);
    $this->dadosBoleto["agencia_codigo"] = $agencia_codigo;
    $this->dadosBoleto["nosso_numero"] = $nossonumero;
    $this->dadosBoleto["codigo_banco_com_dv"] = $codigo_banco_com_dv;
  }
  
  private function sequenciaNossoNumero($nossoNumero) {
  $constante1 = substr($nossoNumero, 0, 1);
  $constante2 = substr($nossoNumero, 1, 1);

  $sequencia1 = substr($nossoNumero, 2, 3);
  $sequencia2 = substr($nossoNumero, 5, 3);
  $sequencia3 = substr($nossoNumero, 8, 9);

  return $sequencia1 . $constante1 . $sequencia2 . $constante2 . $sequencia3;
  }

  private function digitoVerificador_nossonumero($numero) {
  $resto2 = $this->modulo_11($numero, 9, 1);
     $digito = 11 - $resto2;
     if ($digito == 10 || $digito == 11) {
      $dv = 0;
     } else {
      $dv = $digito;
     }
   return $dv;
  }

  private function digitoVerificador_barra($numero) {
  $resto2 = $this->modulo_11($numero, 9, 1);
     if ($resto2 == 0 || $resto2 == 1 || $resto2 == 10) {
      $dv = 1;
     } else {
    $dv = 11 - $resto2;
     }
   return $dv;
  }

  // FUNÇÕES
  // Algumas foram retiradas do Projeto PhpBoleto e modificadas para atender as particularidades de cada banco

  function formata_numero($numero,$loop,$insert,$tipo = "geral") {
  if ($tipo == "geral") {
    $numero = str_replace(",","",$numero);
    while(strlen($numero)<$loop){
    $numero = $insert . $numero;
    }
  }
  if ($tipo == "valor") {
    /*
    retira as virgulas
    formata o numero
    preenche com zeros
    */
    $numero = str_replace(",","",$numero);
    while(strlen($numero)<$loop){
    $numero = $insert . $numero;
    }
  }
  if ($tipo == "convenio") {
    while(strlen($numero)<$loop){
    $numero = $numero . $insert;
    }
  }
  return $numero;
  }

  function fbarcode($valor){
    $fino = 1;
    $largo = 3;
    $altura = 50;

    $barcodes[0] = "00110";
    $barcodes[1] = "10001";
    $barcodes[2] = "01001";
    $barcodes[3] = "11000";
    $barcodes[4] = "00101";
    $barcodes[5] = "10100";
    $barcodes[6] = "01100";
    $barcodes[7] = "00011";
    $barcodes[8] = "10010";
    $barcodes[9] = "01010";

    for($f1=9;$f1>=0;$f1--){
    for($f2=9;$f2>=0;$f2--){
      $f = ($f1 * 10) + $f2 ;
      $texto = "" ;
      for($i=1;$i<6;$i++){
      $texto .=  substr($barcodes[$f1],($i-1),1) . substr($barcodes[$f2],($i-1),1);
      }
      $barcodes[$f] = $texto;
    }
    }


    //Desenho da barra

    //Guarda inicial
    $conteudo = '<img src=' .$this->urlProjeto .'includes/libs/boletophp-master/imagens/p.png width=' .$fino .' height=' .$altura .' border=0><img
    src=' .$this->urlProjeto .'includes/libs/boletophp-master/imagens/b.png width=' .$fino .' height=' .$altura .' border=0><img
    src=' .$this->urlProjeto .'includes/libs/boletophp-master/imagens/p.png width=' .$fino .' height=' .$altura .' border=0><img
    src=' .$this->urlProjeto .'includes/libs/boletophp-master/imagens/b.png width=' .$fino .' height=' .$altura .' border=0><img
    ';

    $texto = $valor ;
    if((strlen($texto) % 2) <> 0){
    $texto = "0" . $texto;
    }

    // Draw dos dados
    while (strlen($texto) > 0) {
    $i = round($this->esquerda($texto,2));
    $texto = $this->direita($texto,strlen($texto)-2);
    $f = $barcodes[$i];
    for($i=1;$i<11;$i+=2){
      if (substr($f,($i-1),1) == "0") {
      $f1 = $fino ;
      }else{
      $f1 = $largo ;
      }

      $conteudo.= '
      src=' .$this->urlProjeto .'includes/libs/boletophp-master/imagens/p.png width='. $f1 .' height='. $altura .' border=0><img
      ';
      
      if (substr($f,$i,1) == "0") {
      $f2 = $fino ;
      }else{
      $f2 = $largo ;
      }
      
      $conteudo.= '
      src=' .$this->urlProjeto .'includes/libs/boletophp-master/imagens/b.png width=' .$f2 .' height=' .$altura .' border=0><img
      ';
    }
    }

    // Draw guarda final
    $conteudo.= '
    src=' .$this->urlProjeto .'includes/libs/boletophp-master/imagens/p.png width=' .$largo .' height=' .$altura .' border=0><img
    src=' .$this->urlProjeto .'includes/libs/boletophp-master/imagens/b.png width=' .$fino .' height=' .$altura .' border=0><img
    src=' .$this->urlProjeto .'includes/libs/boletophp-master/imagens/p.png width=1 height=' .$altura .' border=0>
    ';

    return $conteudo;
  } //Fim da função

  function esquerda($entra,$comp){
    return substr($entra,0,$comp);
  }

  function direita($entra,$comp){
    return substr($entra,strlen($entra)-$comp,$comp);
  }

  function fator_vencimento($data) {
    if ($data != "") {
    $data = explode("/",$data);
    $ano = $data[2];
    $mes = $data[1];
    $dia = $data[0];
    return(abs(($this->_dateToDays("1997","10","07")) - ($this->_dateToDays($ano, $mes, $dia))));
    } else {
    return "0000";
    }
  }

  function _dateToDays($year,$month,$day) {
    $century = substr($year, 0, 2);
    $year = substr($year, 2, 2);
    if ($month > 2) {
      $month -= 3;
    } else {
      $month += 9;
      if ($year) {
        $year--;
      } else {
        $year = 99;
        $century --;
      }
    }
    return ( floor((  146097 * $century)    /  4 ) +
        floor(( 1461 * $year)        /  4 ) +
        floor(( 153 * $month +  2) /  5 ) +
          $day +  1721119);
  }

  function modulo_10($num) {
    $numtotal10 = 0;
    $fator = 2;

    // Separacao dos numeros
    for ($i = strlen($num); $i > 0; $i--) {
      // pega cada numero isoladamente
      $numeros[$i] = substr($num,$i-1,1);
      // Efetua multiplicacao do numero pelo (falor 10)
      $temp = $numeros[$i] * $fator;
      $temp0=0;
      foreach (preg_split('//',$temp,-1,PREG_SPLIT_NO_EMPTY) as $k=>$v){ $temp0+=$v; }
      $parcial10[$i] = $temp0; //$numeros[$i] * $fator;
      // monta sequencia para soma dos digitos no (modulo 10)
      $numtotal10 += $parcial10[$i];
      if ($fator == 2) {
        $fator = 1;
      } else {
        $fator = 2; // intercala fator de multiplicacao (modulo 10)
      }
    }

    // várias linhas removidas, vide função original
    // Calculo do modulo 10
    $resto = $numtotal10 % 10;
    $digito = 10 - $resto;
    if ($resto == 0) {
      $digito = 0;
    }

    return $digito;

  }

  function modulo_11($num, $base=9, $r=0)  {
    /**
     *   Autor:
     *           Pablo Costa <pablo@users.sourceforge.net>
     *
     *   Função:
     *    Calculo do Modulo 11 para geracao do digito verificador
     *    de boletos bancarios conforme documentos obtidos
     *    da Febraban - www.febraban.org.br
     *
     *   Entrada:
     *     $num: string numérica para a qual se deseja calcularo digito verificador;
     *     $base: valor maximo de multiplicacao [2-$base]
     *     $r: quando especificado um devolve somente o resto
     *
     *   Saída:
     *     Retorna o Digito verificador.
     *
     *   Observações:
     *     - Script desenvolvido sem nenhum reaproveitamento de código pré existente.
     *     - Assume-se que a verificação do formato das variáveis de entrada é feita antes da execução deste script.
     */

    $soma = 0;
    $fator = 2;

    /* Separacao dos numeros */
    for ($i = strlen($num); $i > 0; $i--) {
      // pega cada numero isoladamente
      $numeros[$i] = substr($num,$i-1,1);
      // Efetua multiplicacao do numero pelo falor
      $parcial[$i] = $numeros[$i] * $fator;
      // Soma dos digitos
      $soma += $parcial[$i];
      if ($fator == $base) {
        // restaura fator de multiplicacao para 2
        $fator = 1;
      }
      $fator++;
    }

    /* Calculo do modulo 11 */
    if ($r == 0) {
      $soma *= 10;
      $digito = $soma % 11;
      if ($digito == 10) {
        $digito = 0;
      }
      return $digito;
    } elseif ($r == 1){
      $resto = $soma % 11;
      return $resto;
    }
  }

  function monta_linha_digitavel($codigo) {

    // Posição  Conteúdo
      // 1 a 3    Número do banco
      // 4        Código da Moeda - 9 para Real
      // 5        Digito verificador do Código de Barras
      // 6 a 9   Fator de Vencimento
    // 10 a 19 Valor (8 inteiros e 2 decimais)
      // 20 a 44 Campo Livre definido por cada banco (25 caracteres)

      // 1. Campo - composto pelo código do banco, código da moéda, as cinco primeiras posições
      // do campo livre e DV (modulo10) deste campo
      $p1 = substr($codigo, 0, 4);
      $p2 = substr($codigo, 19, 5);
      $p3 = $this->modulo_10("$p1$p2");
      $p4 = "$p1$p2$p3";
      $p5 = substr($p4, 0, 5);
      $p6 = substr($p4, 5);
      $campo1 = "$p5.$p6";

      // 2. Campo - composto pelas posiçoes 6 a 15 do campo livre
      // e livre e DV (modulo10) deste campo
      $p1 = substr($codigo, 24, 10);
      $p2 = $this->modulo_10($p1);
      $p3 = "$p1$p2";
      $p4 = substr($p3, 0, 5);
      $p5 = substr($p3, 5);
      $campo2 = "$p4.$p5";

      // 3. Campo composto pelas posicoes 16 a 25 do campo livre
      // e livre e DV (modulo10) deste campo
      $p1 = substr($codigo, 34, 10);
      $p2 = $this->modulo_10($p1);
      $p3 = "$p1$p2";
      $p4 = substr($p3, 0, 5);
      $p5 = substr($p3, 5);
      $campo3 = "$p4.$p5";

      // 4. Campo - digito verificador do codigo de barras
      $campo4 = substr($codigo, 4, 1);

      // 5. Campo composto pelo fator vencimento e valor nominal do documento, sem
      // indicacao de zeros a esquerda e sem edicao (sem ponto e virgula). Quando se
      // tratar de valor zerado, a representacao deve ser 000 (tres zeros).
    $p1 = substr($codigo, 5, 4);
    $p2 = substr($codigo, 9, 10);
    $campo5 = "$p1$p2";

      return "$campo1 $campo2 $campo3 $campo4 $campo5";
  }

  function geraCodigoBanco($numero) {
    $parte1 = substr($numero, 0, 3);
    $parte2 = $this->modulo_11($parte1);
    return $parte1 . "-" . $parte2;
  }

  public function head($boleto){
    $conteudo = '
      <!DOCTYPE HTML PUBLIC \'-//W3C//DTD HTML 4.0 Transitional//EN\'>
      <html>
      <head>
      <title>'. utf8_decode($this->dadosBoleto["identificacao"]) .'</title>
      <meta http-equiv="Content-Type" content="text/html" charset="utf-8">
      <meta name="Generator" content="Projeto BoletoPHP - www.boletophp.com.br - Licença GPL" />
      </head>

      <body text="#000000" bgColor="#ffffff" topMargin="0" rightMargin="0">'
        .$boleto
      .'
      </body>
      </html>';

      return $conteudo;
  }

  public function show($data_venc){
    setlocale( LC_ALL, 'pt_BR', 'pt_BR.iso-8859-1', 'pt_BR.utf-8', 'portuguese' );
            

    $mt_nome_aluno      = explode(",",$this->dadosBoleto['nome_aluno']);
    $mt_id_aluno        = explode(",",$this->dadosBoleto['id_aluno']);
    $mt_codigo_aluno    = explode(",",$this->dadosBoleto['codigo_aluno']);
    $mt_turma           = explode(",",$this->dadosBoleto['turma']);
    $mt_mensalidade     = explode(",",$this->dadosBoleto['mensalidade']);
    $mt_desconto        = explode(",",$this->dadosBoleto['desconto']);
    $mt_tipo_percentual = explode(",",$this->dadosBoleto['tipo_percentual']);
    $mt_seg_resp_civel  = explode(",",$this->dadosBoleto['seg_resp_civel']);
    $mt_quadro_entidade = explode(",",$this->dadosBoleto['quadro_entidade']);
    $mt_receita_fixa    = explode(",",$this->dadosBoleto['receita_fixa']);   

    $ct=0;
    $ctdiv=0;
    $quadro='<table>';

    foreach($mt_nome_aluno as $val){

      if($ctdiv>2){ $quadro.='<tr>'; }

      switch($mt_tipo_percentual[$ct]){

        case 0: // Valor fixo                
                $desconto = $mt_desconto[$ct];
        break;

        case 1: // Percentual de desconto
                $desconto = ($mt_mensalidade[$ct]/100)*$mt_desconto[$ct];
        break;

        case 2: // Não tem Bolsa
                $desconto = 0;
        break;
      }

      $quadro.= '<td style="border:solid 1px #000"><table>';
      $quadro.= '<tr><td colspan=2><b>'.utf8_decode($mt_codigo_aluno[$ct])." - ".utf8_decode($mt_nome_aluno[$ct]).'</b></td></tr>
                 <tr><td colspan=2><b>'.utf8_decode($mt_turma[$ct]).'</b></td></tr>
                 <tr><td><b>Mensalidade</b></td><td>R$'.number_format((float)$mt_mensalidade[$ct], 2, '.', '').'</td></tr>';
                                                               
                if($mt_receita_fixa[$ct]!='0'){

                  $mt_rf_itens = explode(";",$mt_receita_fixa[$ct]);
                  foreach($mt_rf_itens as $vrfi){
                    
                    $mt_tmp = explode("-",$vrfi);
                    $quadro.= '<tr><td>'.utf8_decode($mt_tmp[0]).'</td><td>'.utf8_decode($mt_tmp[1]).'</td></tr>';
                  }
                }

      $quadro.= '<tr><td><b>SEG.DE RESP.CIVEL</b></td><td>'.$mt_seg_resp_civel[$ct].'</td></tr>
                 <tr><td><b>Desconto</b></td><td>R$'.number_format((float)$desconto, 2, '.', '').'</td></tr>';

      $quadro.= '</table></td>';

      if($ctdiv>2){ $quadro.='</tr>'; $ctdiv=0; }

      $ct++;
      $ctdiv++;
    } 

    $quadro.='</table>
              <br><br>
              <table width=100% class="titulo">
              <tr><td width=40%><b>'.utf8_decode($mt_quadro_entidade[0]).'</b></td><td width=60%><b>SAC CAIXA:</b> 0800 726 0101 (Informa&ccedil;&otilde;es, reclama&ccedil;&otilde;es, Sugest&otilde;es e elogios)</td></tr><tr><td>'.utf8_decode($mt_quadro_entidade[1]).','.utf8_decode($mt_quadro_entidade[2]).' - '.utf8_decode($mt_quadro_entidade[3]).'</td><td><b>Para pessoas com defici&ecirc;ncia auditiva ou de fala:</b> 0800 726 2492</td></tr>
              <tr><td>'.utf8_decode($mt_quadro_entidade[5]).'-'.utf8_decode($mt_quadro_entidade[6]).'-CEP.:'.utf8_decode($mt_quadro_entidade[7]).'</td><td><b>Ouvidoria:</b> 0800 726 7474</td></tr>
              <tr><td>'.utf8_decode($mt_quadro_entidade[8]).'</td><td>caixa.gov.br</td></tr>
              <tr><td colspan=2><b>TEL.:</b>'.utf8_decode($mt_quadro_entidade[9]).'</td></tr></table>';

    $conteudo = '
    <style>
    .titulo{
      font-size: 9px;
      margin: 1px 0px 0px 5px;
    }
    .campo{
      font-size: 11px; 
      margin: 3px 0px 0px 5px;
    }
    </style>

    <div style="font: 9px #000 arial;">
    <!--p>
      <div width="666" align="center">
        Instruções de Impressão
      </div>
      <div width="666" align="center">
        Caso tenha problemas ao imprimir, copie a seqüencia numérica 
        abaixo e pague no caixa eletrônico ou no internet banking:<br><br>
      </div>
      <p>
        Linha Digitável: &nbsp;'.$this->dadosBoleto["linha_digitavel"] .'<br>
        R$ '.$this->dadosBoleto["valor_boleto"] .'<br>
      </p>
    </p-->
    <!--p>
      <div width="690" align="right" style="border-top: dashed 2px #000;">
        Recibo do Sacado
      </div>
    </p-->

    <table cellspacing="0" cellpadding="0" width="666" border="0">
      <tr>
        <td valign="bottom" width="157">
          <img src="' .$this->urlProjeto .'includes/libs/boletophp-master/imagens/logocaixa.jpg">
        </td>
        <td width="3" valign="bottom">
          <img height="22" src="' .$this->urlProjeto .'includes/libs/boletophp-master/imagens/3.png" width="2">
        </td>
        <td width="58" valign="bottom">
          <div align="center" style="font-weight: bold; font-size: 14px;">
            '.$this->dadosBoleto["codigo_banco_com_dv"] .'
          </div>
        </td>
        <td width="3" valign="bottom">
          <img height="22" src="' .$this->urlProjeto .'includes/libs/boletophp-master/imagens/3.png" width="2">
        </td>
        <td align="right" width="450" valign="bottom" style="font-weight: bold; font-size: 14px;">
          '.$this->dadosBoleto["linha_digitavel"] .'
        </td>
      </tr>
    </table>

    <div style="border: solid 1px #000;" width="666">
      <div style="border-bottom: solid 1px #000;">
        <table border="0" cellpadding="0" cellspacing="0">
          <tr style="border-bottom: solid 1px #000;">
            <td width="300">
              <div style="margin-left: 2px; height: 20px;" valign="top">
                <span class="titulo">Cedente<br></span><span class="campo">'. utf8_decode($this->dadosBoleto["cedente"]) .'</span>
              </div>
            </td>
            <td width="150" style="border-left: solid 1px #000;" valign="top">
              <div style="margin-left: 2px; height: 20px;">
                <span class="titulo">Agência/Código do Cedente<br></span><span class="campo">'. $this->dadosBoleto["agencia_codigo"].'</span>
              </div>
            </td>
            <td width="50" style="border-left: solid 1px #000;" valign="top">
              <span class="titulo">' .utf8_decode('Espécie') .'<br></span><span class="campo">'. $this->dadosBoleto["especie"].'</span>
            </td>
            <td width="56" style="border-left: solid 1px #000;" valign="top">
              <div style="margin-left: 2px; height: 20px;">
                <span class="titulo">Quantidade<br></span><span class="campo">'. $this->dadosBoleto["quantidade"].'</span>
              </div>
            </td>
            <td width="110" style="border-left: solid 1px #000;" valign="top">
              <div style="margin-left: 2px; height: 20px;">
                <span class="titulo">Nosso número</span><div class="campo" align="right">'. $this->dadosBoleto["nosso_numero"].'</div>
              </div>
            </td>
          </tr>
        </table>
      </div>
      <div style="border-bottom: solid 1px #000;">
        <table border="0" cellpadding="0" cellspacing="0">
          <tr>
            <td width="200">
              <span class="titulo">Número do documento<br></span><span class="campo">'. $this->dadosBoleto["numero_documento"].'</span>
            </td>
            <td width="150" style="border-left: solid 1px #000;">
              <span class="titulo">CPF/CNPJ<br></span><span class="campo">'. $this->dadosBoleto["cpf_cnpj"].'</span>
            </td>
            <td width="150" style="border-left: solid 1px #000;">
              <span class="titulo">Vencimento<br></span><span class="campo">';
                if($data_venc != "") {
                  $conteudo.= $this->dadosBoleto["data_vencimento"];
                }else{
                  $conteudo.= "Contra Apresentação"; 
                }
              $conteudo.= '</span>
            </td>
            <td width="166" style="border-left: solid 1px #000;">
              <span class="titulo">Valor documento<br></span><div class="campo" align="right">'. utf8_decode($this->dadosBoleto["valor_boleto"]).'</div>
            </td>
          </tr>
        </table>
      </div>
      <div style="border-bottom: solid 1px #000;">
        <table border="0" cellpadding="0" cellspacing="0">
          <tr>
            <td width="123">
              <span class="titulo">(-) Desconto / Abatimentos<br></span><span class="campo">&nbsp;</span>
            </td>
            <td width="123" style="border-left: solid 1px #000;">
              <span class="titulo">(-) Outras deduções<br></span><span class="campo">&nbsp;</span>
            </td>
            <td width="124" style="border-left: solid 1px #000;">
              <span class="titulo">(+) Mora / Multa<br></span><span class="campo">&nbsp;</span>
            </td>
            <td width="124" style="border-left: solid 1px #000;">
              <span class="titulo">(+) Outros acréscimos<br></span><span class="campo">&nbsp;</span>
            </td>
            <td width="166" style="border-left: solid 1px #000;">
              <span class="titulo">(=) Valor cobrado</span><span class="campo">&nbsp;</span>
            </td>
          </tr>
        </table>
      </div>
      <div style="border-bottom: solid 1px #000;">
        <table border="0" cellpadding="0" cellspacing="0">
          <tr>
            <td width="666">
              <span class="titulo">Sacado<br></span><span class="campo">'. utf8_decode($this->dadosBoleto["sacado"]).'</span>
            </td>
          </tr>
        </table>
      </div>
    </div>
    <div>
      <table border="0" cellpadding="0" cellspacing="0">
        <tr>
          <td width="610">
            <span class="titulo">Demonstrativo<br></span>
            <div class="campo">'. 
              utf8_decode($this->dadosBoleto["demonstrativo1"])
            .'<br>'. 
              utf8_decode($this->dadosBoleto["demonstrativo2"])
            .'<br>'.  
              utf8_decode($this->dadosBoleto["demonstrativo3"]).'</div>
          </td>
        </tr>
      </table>
    </div>
    <br><br>

    '.$quadro.'

    <br><br>
    <table cellpadding="0" cellspacing="0">
      <tr>
        <td width="50%">
          <br><br>
          <span>Autenticação mecânica</span>
        </td>
      </tr>
    </table>
    
    

    <p>
      <div width="690" align="right" style="border-bottom: dashed 2px #000;">
        Corte na linha pontilhada
      </div>
    </p>

    <table cellspacing="0" cellpadding="0" width="666" border="0">
      <tr>
        <td valign="bottom" width="157">
          <img src="' .$this->urlProjeto .'includes/libs/boletophp-master/imagens/logocaixa.jpg">
        </td>
        <td width="3" valign="bottom">
          <img height="22" src="' .$this->urlProjeto .'includes/libs/boletophp-master/imagens/3.png" width="2">
        </td>
        <td width="58" valign="bottom">
          <div align="center" style="font-weight: bold; font-size: 14px;">
            '.$this->dadosBoleto["codigo_banco_com_dv"] .'
          </div>
        </td>
        <td width="3" valign="bottom">
          <img height="22" src="' .$this->urlProjeto .'includes/libs/boletophp-master/imagens/3.png" width="2">
        </td>
        <td align="right" width="450" valign="bottom" style="font-weight: bold; font-size: 14px;">
          '.$this->dadosBoleto["linha_digitavel"] .'
        </td>
      </tr>
    </table>
    <div style="border: solid 1px #000;" width="666">
      <div style="border-bottom: solid 1px #000;">
        <table border="0" cellpadding="0" cellspacing="0">
          <tr>
            <td width="512">
              <span class="titulo">Local de pagamento<br></span><span class="campo">Pagável em qualquer Banco até o vencimento</span>
            </td>
            <td width="166" style="border-left: solid 1px #000;">
              <span class="titulo">Vencimento</span><div class="campo" align="rigth">';
                if($data_venc != "") {
                  $conteudo.= utf8_decode($this->dadosBoleto["data_vencimento"]);
                }else{
                  $conteudo.= utf8_decode("Contra Apresentação"); 
                }
                $conteudo.= '</div>
            </td>
          </tr>
        </table>
      </div>
      <div style="border-bottom: solid 1px #000;">
        <table border="0" cellpadding="0" cellspacing="0">
          <tr>
            <td width="512">
              <span class="titulo">Cedente<br></span><span class="campo">'. utf8_decode($this->dadosBoleto["cedente"]).'</span>
            </td>
            <td width="166" style="border-left: solid 1px #000;">
              <span class="titulo">Agência/Código cedente<br></span><div class="campo" align="rigth">'. $this->dadosBoleto["agencia_codigo"].'</div>
            </td>
          </tr>
        </table>
      </div>
      <div style="border-bottom: solid 1px #000;">
        <table border="0" cellpadding="0" cellspacing="0">
          <tr>
            <td width="123">
              <span class="titulo">Data do documento<br></span><span class="campo">'. $this->dadosBoleto["data_documento"].'</span>
            </td>
            <td width="123" style="border-left: solid 1px #000;">
              <span class="titulo">N<u>o</u> documento<br></span><span class="campo">'. $this->dadosBoleto["numero_documento"].'</span>
            </td>
            <td width="70" style="border-left: solid 1px #000;">
              <span class="titulo">'. utf8_decode('Espécie doc.') .'<br></span><span class="campo">'. $this->dadosBoleto["especie_doc"].'</span>
            </td>
            <td width="49" style="border-left: solid 1px #000;">
              <span class="titulo">Aceite<br></span><span class="campo">'. $this->dadosBoleto["aceite"].'</span>
            </td>
            <td width="123" style="border-left: solid 1px #000;">
              <span class="titulo">Data processamento<br></span><span class="campo">'. $this->dadosBoleto["data_processamento"].'</span>
            </td>
            <td width="166" style="border-left: solid 1px #000;">
              <span class="titulo">Nosso número</span><div class="campo" align="rigth">'. $this->dadosBoleto["nosso_numero"].'</div>
            </td>
          </tr>
        </table>
      </div>
      <div style="border-bottom: solid 1px #000;">
        <table border="0" cellpadding="0" cellspacing="0">
          <tr>
            <td width="123">
              <span class="titulo">Uso do banco<br></span><span class="campo">'. $this->dadosBoleto["nosso_numero"].'</span>
            </td>
            <td width="70" style="border-left: solid 1px #000;">
              <span class="titulo">Carteira<br></span><span class="campo">'. $this->dadosBoleto["carteira"].'</span>
            </td>
            <td width="49" style="border-left: solid 1px #000;">
              <span class="titulo">'. utf8_decode('Espécie') .'<br></span><span class="campo">'. $this->dadosBoleto["especie"].'</span>
            </td>
            <td width="123" style="border-left: solid 1px #000;">
              <span class="titulo">Quantidade<br></span><span class="campo">'. $this->dadosBoleto["quantidade"].'</span>
            </td>
            <td width="123" style="border-left: solid 1px #000;">
              <span class="titulo">Valor Documento<br></span><span class="campo">'. $this->dadosBoleto["valor_unitario"].'</span>
            </td>
            <td width="166" style="border-left: solid 1px #000;">
              <span class="titulo">(=) Valor documento<br></span><span class="campo">'. $this->dadosBoleto["valor_boleto"].'</span>
            </td>
          </tr>
        </table>
      </div>
      <div style="border-bottom: solid 1px #000;">
        <table border="0" cellpadding="0" cellspacing="0">
          <tr>
            <td width="512" rowspan="5">
              <span class="titulo">Instruções (Texto de responsabilidade do cedente)</span><div class="campo">'
                .utf8_decode($this->dadosBoleto["instrucoes1"]) .'<br>'
                .utf8_decode($this->dadosBoleto["instrucoes2"]) .'<br>'
                .utf8_decode($this->dadosBoleto["instrucoes3"]) .'<br>'
                .utf8_decode($this->dadosBoleto["instrucoes4"]) .'</div>
            </td>
            <td width="166" style="border-left: solid 1px #000; border-bottom: solid 1px #000;">
              <span class="titulo">(-) Desconto / Abatimentos<br></span><span class="campo">&nbsp;</span>
            </td>
          </tr>
          <tr>
            <td width="166" style="border-left: solid 1px #000; border-bottom: solid 1px #000;">
              <span class="titulo">(-) Outras deduções<br></span><span class="campo">&nbsp;</span>
            </td>
          </tr>
          <tr>
            <td width="166" style="border-left: solid 1px #000; border-bottom: solid 1px #000;">
              <span class="titulo">(+) Mora / Multa<br></span><span class="campo">&nbsp;</span>
            </td>
          </tr>
          <tr>
            <td width="166" style="border-left: solid 1px #000; border-bottom: solid 1px #000;">
              <span class="titulo">(+) Outros acréscimos<br></span><span class="campo">&nbsp;</span>
            </td>
          </tr>
          <tr>
            <td width="166" style="border-left: solid 1px #000; border-bottom: solid 1px #000;">
              <span class="titulo">(=) Valor cobrado<br></span><span class="campo">&nbsp;</span>
            </td>
          </tr>
        </table>
      </div>
      <div style="border-bottom: solid 1px #000;">
        <table border="0" cellpadding="0" cellspacing="0">
          <tr>
            <td width="512" rowspan="2">
              <span class="titulo">Sacado<br></span><div class="campo">'
              .utf8_decode($this->dadosBoleto['responsavel']) .'<br>' 
              .utf8_decode($this->dadosBoleto['logradouro']).' '.utf8_decode($this->dadosBoleto['complemento']).'-'.utf8_decode($this->dadosBoleto['bairro']).' - '.utf8_decode($this->dadosBoleto['cidade']).'/'.utf8_decode($this->dadosBoleto['estado']).'<br>'
              .'CEP.:'.utf8_decode($this->dadosBoleto['codigo_postal']).'</div>
            </td>
            <td width="166">
              &nbsp;
            </td>
          </tr>
          <tr>
            <td width="166" style="border-left: solid 1px #000;">
              <span class="titulo">' .utf8_decode('Cód. baixa') .'<br></span>
            </td>
          </tr>
        </table>
      </div>
    </div>

    <div>
      <table border="0" cellpadding="0" cellspacing="0">
        <tr>
          <td width="500" valign="bottom">
            <span class="titulo">
              Sacador/Avalista
            </span>
          </td>
          <td width="178">
            <span class="titulo">
              Autenticação mecânica - Ficha de Compensação
            </span>
          </td>
        </tr>
        <tr>
          <td colspan="2">
            '. $this->fbarcode($this->dadosBoleto["codigo_barras"]) .'
          </td>
        </tr>
      </table>
    </div>
    <p>
      <div width="690" align="right" style="border-bottom: dashed 2px #000;">
        Corte na linha pontilhada
      </div>
    </p>
    </div>
    ';


    //$conteudo = $this->head($conteudo);

    return $conteudo;
  }
}