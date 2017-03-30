<?php
require_once("api/includes/libs/tcpdf/tcpdf.php");
require_once("api/includes/libs/fpdi/fpdi.php");

class concat_pdf extends FPDI {
   var $files = array();
   function setFiles($files) {
        $this->files = $files;
   }
   function concat() {
        foreach($this->files AS $file) {
             $pagecount = $this->setSourceFile($file);
             for  ($i = 1; $i <= $pagecount; $i++) {
                  $tplidx = $this->ImportPage($i);
                  $s = $this->getTemplatesize($tplidx);
                  $this->AddPage('P', array($s['w'], $s['h']));
                  $this->useTemplate($tplidx);
             }
        }
   }
}

$path = "download/" .$_GET['ano_mes'] ."/"; 
$dir = dir($path); 
$aFile = array();
while($file = $dir->read()){ 
  if($file != '.' && $file != '..' && $file != 'etiqueta.pdf'){
    $aFile[] = $path. $file;   
  }
}

$dir->close();

$pdf = new concat_pdf();
$pdf->setFiles($aFile);
$pdf->concat();
$pdf->Output($path ."boletos.pdf", "D"); 
?>