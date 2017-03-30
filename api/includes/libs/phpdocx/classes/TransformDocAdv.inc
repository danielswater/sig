<?php

/**
 * Transform DOCX to PDF, ODT, SXW, RTF, DOC, TXT, HTML or WIKI
 *
 * @category   Phpdocx
 * @package    converters
 * @copyright  Copyright (c) 2009-2013 Narcea Producciones Multimedia S.L.
 *             (http://www.2mdc.com)
 * @license    http://www.phpdocx.com/wp-content/themes/lightword/pro_license.php
 * @version    2013.01.30
 * @link       http://www.phpdocx.com
 * @since      File available since Release 2.5
 */

require_once dirname(__FILE__) . '/CreateDocx.inc';

class TransformDocAdv
{
    /**
     *
     * @access private
     * @var ZipArchive
     */
    private $_allowedExtensions;  
    
    /**
     * Construct
     *
     * @access public
     */
    public function __construct()
    {
        $this->_allowedExtensions = array('docx', 'pdf', 'odt', 'sxw', 'rtf', 'doc', 'txt', 'html', 'htm', 'wiki');
    }
    
    /**
     * Prepare docx before pdf transformation
     *
     * @access public
     * @param $docSource
     * @param $temdir
     * @return string
     */
    public function prepareDocx($docSource, $tempDir = null){
        if($tempDir === null){
            $tempDir = $this->getTempDirPath();
            $tempName = $tempDir.'/tempDocX_'.uniqid().'.docx';
        }else{
            $tempName = $tempDir.'/tempDocX_'.uniqid().'.docx';
        }
        copy($docSource, $tempName);
        $originalDocx = new zipArchive();
        $originalDocx->open($tempName);
        $numberingXML = $originalDocx->getFromName('word/numbering.xml');
        if($numberingXML ==''){
            $originalDocx->close();
            return 'noList';
        }else{
            $numberingDOM = new DOMDocument();
            $numberingDOM->loadXML($numberingXML);
            $numberingXPath = new DOMXPath($numberingDOM);
            $numberingXPath->registerNamespace('w', 'http://schemas.openxmlformats.org/wordprocessingml/2006/main');
            $query = '//w:lvl[w:rPr/w:rFonts[@w:ascii="Symbol"]]';
            $affectedNodes = $numberingXPath->query($query);
            foreach($affectedNodes as $node){
                $childs = $node->childNodes;
                foreach($childs as $myChildNode){
                  if($myChildNode->nodeName == 'w:lvlText'){
                      $myChildNode->setAttribute('w:val', '•');
                  }else if($myChildNode->nodeName == 'w:rPr'){
                      $rPrChilds = $myChildNode->childNodes;
                      foreach($rPrChilds as $myRPrNode){
                         if($myRPrNode->nodeName == 'w:rFonts'){
                             $myRPrNode->setAttribute('w:ascii', 'Arial');
                             $myRPrNode->setAttribute('w:hAnsi', 'Arial');
                         } 
                      }
                  }  
                }
            }
            $newNumbering = $numberingDOM->saveXML();
            $originalDocx->addFromString('word/numbering.xml', $newNumbering );
            $originalDocx->close();
            return $tempName;
        }
    }

    /**
     * Transform DOCX to PDF, ODT, SXW, RTF, DOC, TXT, HTML or WIKI
     *
     * @access public
     * @param $docSource
     * @param $docDestination
     * @param string $tempDir
     * @param array $options :
     *      · method : 'direct' (default), 'script' ; 'direct' method uses 
     *                  passthru and 'script' uses a external script. 
     *                  If you're using Apache and 'direct' doesn't work use 'script'
     *      · 'odfconverter' : true (default) or false . Use odf-converter.
     * @return void
     */
    public function transformDocument($docSource, $docDestination, $tempDir = null, $options = array())
    {
        if (!isset($options['method'])) {
            $options['method'] = 'direct';
        }
        if (!isset($options['odfconverter'])) {
            $options['odfconverter'] = true;
        }

        $destination = explode('.', $docDestination);
        $extension = strtolower(array_pop($destination));
        if (!in_array($extension, $this->_allowedExtensions)) {
          PhpdocxLogger::logger('The chosen extension is not supported', 'fatal');
        }

        $newDocx = $this->prepareDocx($docSource, $tempDir);
        if ($newDocx != 'noList') {
            $docSource = $newDocx;
        }
        if ($tempDir === null) {
            $tempDir = $this->getTempDirPath();
            $tempDoc = $tempDir.'/tempOdt_'.uniqid().'.odt';
        } else {
            $tempDoc = $tempDir.'/tempOdt_'.uniqid().'.odt';
        }

        if ($options['method'] == 'script') {
            passthru('php ' . dirname(__FILE__) . '/../lib/convert.php -s ' . $docSource . ' -t ' . $tempDoc . ' -d ' . $docDestination . ' -o ' . $options['odfconverter']);
        } else {
            if ($extension != 'rtf' && $options['odfconverter']) {
                passthru(dirname(__FILE__) . '/../lib/OdfConverter /I ' . $docSource . ' /O ' . $tempDoc . ' >/dev/null');
            } else {
                copy($docSource, $tempDoc);
            }
            // How to start OpenOffice in headless mode: lib/openoffice/openoffice.org3/program/soffice -headless -accept="socket,host=127.0.0.1,port=8100;urp;" -nofirststartwizard';
            passthru('java -jar ' . dirname(__FILE__) . '/../lib/openoffice/jodconverter-2.2.2/lib/jodconverter-cli-2.2.2.jar ' . $tempDoc . ' ' . $docDestination);
        }
    }
    
    /**
     * To add support of sys_get_temp_dir for PHP versions under 5.2.1
     * 
     * @access private
     * @return string
     */
    private function getTempDirPath() {
        if ( !function_exists('sys_get_temp_dir')) {
            function sys_get_temp_dir() {
                if ($temp = getenv('TMP')) {
                    return $temp;
                }
                if ($temp = getenv('TEMP')) {
                    return $temp;
                }
                if ($temp = getenv('TMPDIR')) {
                    return $temp;
                }
                $temp = tempnam(__FILE__,'');
                if (file_exists($temp)) {
                    unlink($temp);
                    return dirname($temp);
                }
                return null;
            }
        } else {
            return sys_get_temp_dir();
        }
    }
    
}