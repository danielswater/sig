<?php

/**
 * Create Scatter Chart
 *
 * @category   Phpdocx
 * @package    elements
 * @copyright  Copyright (c) 2009-2013 Narcea Producciones Multimedia S.L.
 *             (http://www.2mdc.com)
 * @license    http://www.phpdocx.com/wp-content/themes/lightword/pro_license.php
 * @version    2012.29.11
 * @link       http://www.phpdocx.com
 * @since      File available since Release 2.7
 */
include_once dirname(__FILE__) . '/CreateElement.inc';

class CreateScatterChart extends CreateGraphic implements InterfaceGraphic
{
    /**
     * Create embedded xml chart
     *
     * @access public
     */
    public function createEmbeddedXmlChart(){
        $this->_xmlChart = '';
        $this->generateCHARTSPACE();
        $this->generateDATE1904(1);
        $this->generateLANG();
        $color = 2;
        if ($this->_color) {
            $color = $this->_color;
        }
        $this->generateSTYLE($color);
        $this->generateCHART();
        if ($this->_title != '') {
            $this->generateTITLE();
            $this->generateTITLETX();
            $this->generateRICH();
            $this->generateBODYPR();
            $this->generateLSTSTYLE();
            $this->generateTITLEP();
            $this->generateTITLEPPR();
            $this->generateDEFRPR();
            $this->generateTITLER();
            $this->generateTITLERPR();
            $this->generateTITLET($this->_title);
            $this->generateTITLELAYOUT();
        } else {
            $this->generateAUTOTITLEDELETED();
            $title = '';
        }
        if (strpos($this->_type, '3D') !== false) {
            $this->generateVIEW3D();
            $cornerX = 30;
            $cornerY = 30;
            $cornerP = 30;
            if ($this->_cornerX != '') {
                $cornerX = $this->_cornerX;
            }
            if ($this->_cornerY != '') {
                $cornerY = $this->_cornerY;
            }
            if ($this->_cornerP != '') {
                $cornerP = $this->_cornerP;
            }
            $this->generateROTX($cornerX);
            $this->generateROTY($cornerY);
            $this->generatePERSPECTIVE($cornerP);
        }
        if ($this->values == '') {
            exit('You haven`t added data');
        }
        $this->generatePLOTAREA();
        $this->generateLAYOUT();


        $this->generateSCATTERCHART();
        $this->generateSCATTERSTYLE($this->_style);

        $numValues = count($this->values);
        $legends = array('X values', 'Y values');

        $letter = 'A';
        $this->generateSER();
        $this->generateIDX(0);
        $this->generateORDER(0);
        $letter++;

        $this->generateTX();
        $this->generateSTRREF();
        $this->generateF('Sheet1!$' . $letter . '$1');
        $this->generateSTRCACHE();
        $this->generatePTCOUNT();
        $this->generatePT();
        $this->generateV($legends[0]);
        if(!empty($this->_symbol)){
            if($this->_symbol == 'line'){
                $this->generateMARKER('none');
            }elseif($this->_symbol == 'dot'){
                $this->generateSPPR_SER();
                $this->generateLN(2,25);
                $this->generateNOFILL();
            }
        }
        $this->cleanTemplate2();
        if(!empty($this->_showValue) || !empty($this->_showCategory)){
            $this->generateSERDLBLS();
            if(!empty($this->_showValue))
                $this->generateSHOWVAL();
            if(!empty($this->_showCategory))
                $this->generateSHOWCATNAME();
        }

        $this->generateXVAL();
        $this->generateNUMREF();
        $this->generateF('Sheet1!$A$2:$A$' . ($numValues + 1));
        $this->generateNUMCACHE();
        $this->generateFORMATCODE();
        $this->generatePTCOUNT($numValues);
        $num = 0;
        foreach ($this->values as $datas) {
            foreach ($datas as $data) {
                $this->generatePT($num);
                $this->generateV($data);
                $num++;
                break;
            }
        }
        $this->cleanTemplate2();
        $this->generateYVAL();
        $this->generateNUMREF();
        $this->generateF('Sheet1!$B$2:$B$' . ($numValues + 1));
        $this->generateNUMCACHE();
        $this->generateFORMATCODE();
        $this->generatePTCOUNT($numValues);
        $num = 0;
        foreach ($this->values as $datas) {
            $flag = true;
            foreach ($datas as $data) {
                if($flag){
                    $flag = false;
                    continue;
                }
                $this->generatePT($num);
                $this->generateV($data);
                $num++;
                break;
            }
        }
        $this->cleanTemplate2();
        if(!empty($this->_smooth) && $this->_smooth && $this->_symbol != 'dot')
            $this->generateSMOOTH();
        $this->cleanTemplate3();

        $this->generateAXID();
        $this->generateAXID(59040512);
        $this->generateVALAX();
        $this->generateAXAXID(59034624);
        $this->generateSCALING();
        $this->generateORIENTATION();
        $this->generateAXPOS();
        switch ($this->_vgrid) {
            case 1:
                $this->generateMAJORGRIDLINES();
            break;
            case 2:
                $this->generateMINORGRIDLINES();
            break;
            case 3:
                $this->generateMAJORGRIDLINES();
                $this->generateMINORGRIDLINES();
            break;
            default:
            break;
        }
        if (!empty($this->_haxlabel)) {
            $this->generateAXLABEL($this->_haxlabel);
            $vert = 'horz';
            $rot = 0;
            if ($this->_haxlabel_display == 'vertical') {
                $vert = 'wordArtVert';
            }
            if ($this->_haxlabel_display == 'rotated') {
                $rot = '-5400000';
            }
            $this->generateAXLABELDISP($vert, $rot);
        }
        $this->generateNUMFMT();
        $this->generateTICKLBLPOS();
        $this->generateCROSSAX();
        $this->generateCROSSES();
        $this->generateCROSSBETWEEN('midCat');
        $this->generateVALAX();
        $this->generateAXAXID(59040512);
        $this->generateSCALING();
        $this->generateORIENTATION();
        $this->generateAXPOS('l');
        switch ($this->_hgrid) {
            case 1:
                $this->generateMAJORGRIDLINES();
            break;
            case 2:
                $this->generateMINORGRIDLINES();
            break;
            case 3:
                $this->generateMAJORGRIDLINES();
                $this->generateMINORGRIDLINES();
            break;
            default:
            break;
        }
        if (!empty($this->_vaxlabel)) {
            $this->generateAXLABEL($this->_vaxlabel);
            $vert = 'horz';
            $rot = 0;
            if ($this->_vaxlabel_display == 'vertical') {
                $vert = 'wordArtVert';
            }
            if ($this->_vaxlabel_display == 'rotated') {
                $rot = '-5400000';
            }
            $this->generateAXLABELDISP($vert, $rot);
        }
        $this->generateNUMFMT();
        $this->generateTICKLBLPOS();
        $this->generateCROSSAX(59034624);
        $this->generateCROSSES();
        $this->generateCROSSBETWEEN();

        if ($this->_legendpos != 'none') {
            $this->generateLEGEND();
            if (!empty($this->_legendpos)) {
                $this->generateLEGENDPOS($this->_legendpos);
            }
            if (!empty($this->_legendoverlay)) {
                $this->generateLEGENDOVERLAY($this->_legendoverlay);
            }
        }
        $this->generatePLOTVISONLY();

        if ((!isset($this->_border) || $this->_border == 0 || !is_numeric($this->_border))
        ) {
            $this->generateSPPR();
            $this->generateLN();
            $this->generateNOFILL();
        }else{
            $this->generateSPPR();
            $this->generateLN($this->_border);
        }

        if ($this->_font != '') {
            $this->generateTXPR();
            $this->generateLEGENDBODYPR();
            $this->generateLSTSTYLE();
            $this->generateAP();
            $this->generateAPPR();
            $this->generateDEFRPR();
            $this->generateRFONTS($this->_font);
            $this->generateENDPARARPR();
        }

        $this->generateEXTERNALDATA();
        $this->cleanTemplateDocument();
        return $this->_xmlChart;
    }

    public function dataTag(){
        return array('xVal', 'yVal');
    }

    /**
     * Return the type of the xlsx object
     *
     * @access public
     */
    public function getXlsxType(){
        return CreateScatterXlsx::getInstance();
    }
}