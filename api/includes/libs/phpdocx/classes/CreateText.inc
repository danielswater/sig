<?php

/**
 * Create text
 *
 * @category   Phpdocx
 * @package    elements
 * @copyright  Copyright (c) 2009-2013 Narcea Producciones Multimedia S.L.
 *             (http://www.2mdc.com)
 * @license    http://www.phpdocx.com/wp-content/themes/lightword/pro_license.php
 * @version    2013.01.04
 * @link       http://www.phpdocx.com
 * @since      File available since Release 1.0
 */
include_once dirname(__FILE__) . '/CreateElement.inc';

class CreateText extends CreateElement
{
    const IDTITLE = 229998237;
    /**
     *
     * @access private
     * @var string
     */
    private static $_instance = NULL;
    /**
     *
     * @access private
     * @var int
     */
    private static $_idTitle = 0;

    /**
     * Construct
     *
     * @access public
     */
    public function __construct()
    {

    }

    /**
     * Destruct
     *
     * @access public
     */
    public function __destruct()
    {

    }

    /**
     * Magic method, returns current XML
     *
     * @access public
     * @return string Return current XML
     */
    public function __toString()
    {
        return $this->_xml;
    }

    /**
     * Singleton, return instance of class
     *
     * @access public
     * @return CreateText
     * @static
     */
    public static function getInstance()
    {
        if (self::$_instance == NULL) {
            self::$_instance = new CreateText();
        }
        return self::$_instance;
    }

    /**
     * Create embedded text
     *
     * @access public
     * @param array $args[0]
     * @param array $args[1]
     */
    public function createEmbeddedText()
    {
        $this->_xml = '';
        $args = func_get_args();
        foreach ($args[0]->_embeddedText as $texts) {
            if (
                isset($texts['pStyle']) ||
                isset($texts['jc']) ||
                isset($texts['pageBreakBefore']) ||
                isset($texts['widowControl']) ||
                isset($args['wordWrap'])
            ) {
                $this->generatePPRPPR();
                if (isset($texts['pStyle'])) {
                    $this->generatePSTYLE($texts['pStyle']);
                }
                if (!empty($args[1]['keepNext'])) {
                    $this->generateKEEPNEXT($args[1]['keepNext']);
                }
                if (!empty($args[1]['keepLines'])) {
                    $this->generateKEEPLINES($args[1]['keepLines']);
                }
                if (isset($texts['jc'])) {
                    $this->generateJC($texts['jc']);
                }
                if (isset($texts['pageBreakBefore'])) {
                    $this->generatePAGEBREAKBEFORE($texts['pageBreakBefore']);
                }
                if (isset($texts['widowControl'])) {
                    $this->generateWIDOWCONTROL($texts['widowControl']);
                }
                if (isset($texts['wordWrap'])) {
                    $this->generateWORDWRAP($texts['wordWrap']);
                }
                if (!empty($args[1]['contextualSpacing'])) {
                    $this->generateCONTEXTUALSPACING($args[1]['contextualSpacing']);
                }
                if (!empty($args[1]['textDirection'])) {
                    $this->generateTEXTDIRECTION($args[1]['textDirection']);
                }
                $this->cleanTemplateFirstRPR();
                //We include now paragraph wide run properties
            $this->generateR();
                    if (
                        !empty($args[1]['rStyle']) ||
                        !empty($args[1]['b']) ||
                        !empty($args[1]['i']) ||
                        !empty($args[1]['sz']) ||
                        !empty($args[1]['u']) ||
                        !empty($args[1]['color']) ||
                        !empty($args[1]['font']) ||
                        !empty($args[1]['tabs'])
                    ) {
                        $this->generateRPR();
                        if (!empty($args[1]['rStyle'])) {
                            $this->generateRSTYLE($args[1]['rStyle']);
                        }
                        if (!empty($args[1]['font'])) {
                            $this->generateRFONTS($args[1]['font']);
                        }
                        if (!empty($args[1]['b'])) {
                            $this->generateB($args[1]['b']);
                        }
                        if (!empty($args[1]['i'])) {
                            $this->generateI($args[1]['i']);
                        }
                        if (!empty($args[1]['color'])) {
                            $this->generateCOLOR($args[1]['color']);
                        }
                        if (!empty($args[1]['sz'])) {
                            $this->generateSZ($args[1]['sz']);
                        }
                        if (!empty($args[1]['u'])) {
                            $this->generateU($args[1]['u']);
                        }
                        if (!empty($args[1]['tabs'])) {
                            $this->generateTABS();
                        }
                    }
            }
            if ($texts instanceof WordMLFragment) {
                $runContent = $texts->inlineWordML();
                if (preg_match("/__GENERATEP__/", $this->_xml)) {
                    $this->_xml = str_replace('__GENERATEP__', $runContent . '__GENERATESUBR__', $this->_xml);
                }else{
                    $this->_xml = str_replace('__GENERATESUBR__', $runContent . '__GENERATESUBR__', $this->_xml);
                }
            }else{
                $this->generateR();
                if (
                    isset($texts['rStyle']) ||
                    isset($texts['b']) ||
                    isset($texts['i']) ||
                    isset($texts['u']) ||
                    isset($texts['sz']) ||
                    isset($texts['color']) ||
                    isset($texts['font']) ||
                    isset($args['tabs'])
                ) {
                    $this->generateRPR();
                    if (isset($texts['rStyle'])) {
                        $this->generateRSTYLE($texts['rStyle']);
                    }
                    if (isset($texts['font'])) {
                        $this->generateRFONTS($texts['font']);
                    }
                    if (isset($texts['b'])) {
                        $this->generateB($texts['b']);
                    }
                    if (isset($texts['i'])) {
                        $this->generateI($texts['i']);
                    }
                    if (isset($texts['u'])) {
                        $this->generateU($texts['u']);
                    }
                    if (isset($texts['sz'])) {
                        $this->generateSZ($texts['sz']);
                    }
                    if (isset($texts['color'])) {
                        $this->generateCOLOR($texts['color']);
                    }
                    if (isset($args['tabs'])) {
                        $this->generateTABS();
                    }
                }

                if (!isset($args['spaces'])) {
                    $args['spaces'] = '';
                }
                if (!isset($args['lineBreak'])) {
                    $args['lineBreak'] = false;
                }
                if (!isset($args['columnBreak'])) {
                    $args['columnBreak'] = false;
                }
                if (!isset($args['text'])) {
                    $args['text'] = '';
                }

                $this->generateT($texts['text'], $args['spaces'], $args['lineBreak'], $args['columnBreak']);
                $this->cleanTemplateFirstRPR();
            }
        }
        
    }

    /**
     * Create text
     *
     * @access public
     * @param mixed $args[0]
     * @param array $args[1]
     */
    public function createText()
    {
        $this->_xml = '';
        $args = func_get_args();

        $this->generateP();
        
        $this->generatePPR();
        if (!empty($args[1]['pStyle'])) {
            $this->generatePSTYLE($args[1]['pStyle']);
        }
        if (!empty($args[1]['keepNext'])) {
            $this->generateKEEPNEXT($args[1]['keepNext']);
        }
        if (!empty($args[1]['keepLines'])) {
            $this->generateKEEPLINES($args[1]['keepLines']);
        }
        if (!empty($args[1]['jc'])) {
            $this->generateJC($args[1]['jc']);
        }
        if (!empty($args[1]['pageBreakBefore'])) {
            $this->generatePAGEBREAKBEFORE($args[1]['pageBreakBefore']);
        }
        if (!empty($args[1]['widowControl'])) {
            $this->generateWIDOWCONTROL($args[1]['widowControl']);
        }
        if (!empty($args[1]['wordWrap'])) {
            $this->generateWORDWRAP($args[1]['wordWrap']);
        }
        if (!empty($args[1]['lineSpacing'])) {
            $this->generateSPACING($args[1]['lineSpacing']);
        }
        if (
            !empty($args[1]['indent_left']) ||
            !empty($args[1]['indent_right'])
        ) {
            if (!!empty($args[1]['indent_left'])) {
                $args[1]['indent_left'] = '';
            }
            if (!!empty($args[1]['indent_right'])) {
                $args[1]['indent_right'] = '';
            }

            $this->generateINDENT($args[1]['indent_left'],
                $args[1]['indent_right']);
        }
        if (!empty($args[1]['contextualSpacing'])) {
            $this->generateCONTEXTUALSPACING($args[1]['contextualSpacing']);
        }
        if (!empty($args[1]['textDirection'])) {
            $this->generateTEXTDIRECTION($args[1]['textDirection']);
        }
        //We include now paragraph wide run properties                
            $this->generatePPRRPR();
            if (!empty($args[1]['rStyle'])) {
                $this->generateRSTYLE($args[1]['rStyle']);
            }
            if (!empty($args[1]['font'])) {
                $this->generateRFONTS($args[1]['font']);
            }
            if (!empty($args[1]['b'])) {
                $this->generateB($args[1]['b']);
            }
            if (!empty($args[1]['i'])) {
                $this->generateI($args[1]['i']);
            }
            if (!empty($args[1]['color'])) {
                $this->generateCOLOR($args[1]['color']);
            }
            if (!empty($args[1]['sz'])) {
                $this->generateSZ($args[1]['sz']);
            }
            if (!empty($args[1]['u'])) {
                $this->generateU($args[1]['u']);
            }
            if (!empty($args[1]['tabs'])) {
                $this->generateTABS();
            }
            $this->cleanTemplateFirstRPR();
                
        if (!is_array($args[0])) {
            if ($args[0] instanceof WordMLFragment) {
                    $runContent = $args[0]->inlineWordML();
                    if (preg_match("/__GENERATEP__/", $this->_xml)) {
                        $this->_xml = str_replace('__GENERATEP__', $runContent . '__GENERATESUBR__', $this->_xml);
                    }else{
                        $this->_xml = str_replace('__GENERATESUBR__', $runContent . '__GENERATESUBR__', $this->_xml);
                    }
                }else{
                    $this->generateR();                
                    $this->generateRPR();
                    if (!empty($args[1]['rStyle'])) {
                        $this->generateRSTYLE($args[1]['rStyle']);
                    }
                    if (!empty($args[1]['font'])) {
                        $this->generateRFONTS($args[1]['font']);
                    }
                    if (!empty($args[1]['b'])) {
                        $this->generateB($args[1]['b']);
                    }
                    if (!empty($args[1]['i'])) {
                        $this->generateI($args[1]['i']);
                    }
                    if (!empty($args[1]['color'])) {
                        $this->generateCOLOR($args[1]['color']);
                    }
                    if (!empty($args[1]['sz'])) {
                        $this->generateSZ($args[1]['sz']);
                    }
                    if (!empty($args[1]['u'])) {
                        $this->generateU($args[1]['u']);
                    }
                    if (!empty($args[1]['tabs'])) {
                        $this->generateTABS();
                    }                  
                    if (empty($args[1]['spaces'])) {
                        $args[1]['spaces'] = '';
                    }
                    if (!isset($args[1]['lineBreak'])) {
                            $args[1]['lineBreak'] = false;
                    }
                    if (!isset($args[1]['columnBreak'])) {
                            $args[1]['columnBreak'] = false;
                    }

                    $this->generateT($args[0], $args[1]['spaces'], $args[1]['lineBreak'], $args[1]['columnBreak']);
                    $this->cleanTemplateFirstRPR();
                }
        } else {
            foreach ($args[0] as $texts) {
                if ($texts instanceof WordMLFragment) {
                    $runContent = $texts->inlineWordML();
                    if (preg_match("/__GENERATEP__/", $this->_xml)) {
                        $this->_xml = str_replace('__GENERATEP__', $runContent . '__GENERATESUBR__', $this->_xml);
                    }else if(preg_match("/__GENERATER__/", $this->_xml)){
                        $this->_xml = str_replace('__GENERATER__', $runContent . '__GENERATER__', $this->_xml);
                    }else{
                        $this->_xml = str_replace('__GENERATESUBR__', $runContent . '__GENERATESUBR__', $this->_xml);
                    }
                }else{
                    $this->generateR();
                    //Inherit run styles from paragraph styles if they have not been
                    //explicitely set
                    if(empty($texts['b']) && !empty($args[1]['b'])){
                        $texts['b'] = $args[1]['b'];
                    }
                    if(empty($texts['i']) && !empty($args[1]['i'])){
                        $texts['i'] = $args[1]['i'];
                    }
                    if(empty($texts['u']) && !empty($args[1]['u'])){
                        $texts['u'] = $args[1]['u'];
                    }
                    if(empty($texts['sz']) && !empty($args[1]['sz'])){
                        $texts['sz'] = $args[1]['sz'];
                    }
                    if(empty($texts['color']) && !empty($args[1]['color'])){
                        $texts['color'] = $args[1]['color'];
                    }
                    if(empty($texts['font']) && !empty($args[1]['font'])){
                        $texts['font'] = $args[1]['font'];
                    }
                    if(empty($texts['tabs']) && !empty($args[1]['tabs'])){
                        $texts['tabs'] = $args[1]['tabs'];
                    }

                    
                    $this->generateRPR();
                    if (!empty($texts['font'])) {
                        $this->generateRFONTS($texts['font']);
                    }
                    if (!empty($texts['b'])) {
                        $this->generateB($texts['b']);
                    }
                    if (!empty($texts['i'])) {
                        $this->generateI($texts['i']);
                    }
                    if (!empty($texts['u'])) {
                        $this->generateU($texts['u']);
                    }
                    if (!empty($texts['sz'])) {
                        $this->generateSZ($texts['sz']);
                    }
                    if (!empty($texts['color'])) {
                        $this->generateCOLOR($texts['color']);
                    }
                    if (!empty($texts['tabs'])) {
                        $this->generateTABS();
                    }
                    

                    if (empty($texts['spaces'])) {
                        $texts['spaces'] = '';
                    }
                    if (!isset($texts['lineBreak'])) {
                        $texts['lineBreak'] = false;
                    }
                    if (!isset($texts['columnBreak'])) {
                        $texts['columnBreak'] = false;
                    }
                    if (empty($texts['text'])) {
                        $texts['text'] = '';
                    }

                    $this->generateT($texts['text'], $texts['spaces'], $texts['lineBreak'], $texts['columnBreak']);
                    $this->cleanTemplateFirstRPR();
                }
            }
        }
    }

    /**
     * Create title
     *
     * @access protected
     * @param string $arrArgs[0]
     * @param array $arrArgs[1]
     */
    public function createTitle()
    {
        $this->_xml = '';
        $args = func_get_args();
        if (isset($args[0])) {
            $this->generateP();
            $this->generatePPR();
            if (!isset($args[1]['val'])) {
                $args[1]['val'] = '';
            }
            if (isset($args[1]['type'])) {
                if ($args[1]['type'] == 'subtitle') {
                    $this->generatePSTYLE('SubtitlePHPDOCX');
                }
                else {
                    $this->generatePSTYLE('TitlePHPDOCX');
                }
            }
            else {
                $this->generatePSTYLE('TitlePHPDOCX');
            }
            if (isset($args[1]['pageBreakBefore'])) {
                $this->generatePAGEBREAKBEFORE($args[1]['pageBreakBefore']);
            }
            if (isset($args[1]['widowControl'])) {
                $this->generateWIDOWCONTROL($args[1]['widowControl']);
            }
            if (isset($args[1]['wordWrap'])) {
                $this->generateWORDWRAP($args[1]['wordWrap']);
            }
            self::$_idTitle++;
            $this->generateBOOKMARKSTART(
                self::$_idTitle, '_Toc' . (self::$_idTitle + self::IDTITLE)
            );
            $this->generateR();
            if (
                isset($args[1]['b']) ||
                isset($args[1]['i']) ||
                isset($args[1]['u']) ||
                isset($args[1]['sz']) ||
                isset($args[1]['color']) ||
                isset($args[1]['font'])
            ) {
                $this->generateRPR();
                if (isset($args[1]['font'])) {
                    $this->generateRFONTS($args[1]['font']);
                }
                if (isset($args[1]['b'])) {
                    $this->generateB($args[1]['b']);
                }
                if (isset($args[1]['i'])) {
                    $this->generateI($args[1]['i']);
                }
                if (isset($args[1]['u'])) {
                    $this->generateU($args[1]['u']);
                }
                if (isset($args[1]['sz'])) {
                    $this->generateSZ($args[1]['sz']);
                }
                if (isset($args[1]['color'])) {
                    $this->generateCOLOR($args[1]['color']);
                }
            }
            $this->generateT($args[0]);
            $this->generateBOOKMARKEND(self::$_idTitle);
            $this->cleanTemplate();
        }
    }

    /**
     * Init text
     *
     * @access public
     * @param array $args[0]
     */
    public function initText()
    {
        $args = func_get_args();

        $this->_embeddedText = $args[0];
    }

    /**
     * Generate w:bookmarkend
     *
     * @access protected
     * @param int $id
     */
    protected function generateBOOKMARKEND($id)
    {
        $this->_xml = str_replace(
            '__GENERATEBOOKMARKEND__', '<' . CreateElement::NAMESPACEWORD .
            ':bookmarkEnd ' . CreateElement::NAMESPACEWORD . ':id="' . $id .
            '"></' . CreateElement::NAMESPACEWORD . ':bookmarkEnd>', $this->_xml
        );
    }

    /**
     * Generate w:bookmarkstart
     *
     * @access protected
     * @param int $id
     * @param string $name
     */
    protected function generateBOOKMARKSTART($id, $name)
    {
        $this->_xml = str_replace(
            '__GENERATER__', '<' . CreateElement::NAMESPACEWORD .
            ':bookmarkStart ' . CreateElement::NAMESPACEWORD . ':id="' . $id .
            '" ' . CreateElement::NAMESPACEWORD . ':name="' . $name . '"></' .
            CreateElement::NAMESPACEWORD .
            ':bookmarkStart>__GENERATER____GENERATEBOOKMARKEND__', $this->_xml
        );
    }

    /**
     * Generate w:color
     *
     * @access protected
     * @param string $val
     */
    protected function generateCOLOR($val = '000000')
    {
        $this->_xml = str_replace(
            '__GENERATERPR__', '<' . CreateElement::NAMESPACEWORD . ':color ' .
            CreateElement::NAMESPACEWORD . ':val="' . $val . '"></' .
            CreateElement::NAMESPACEWORD . ':color>__GENERATERPR__', $this->_xml
        );
    }
    
    /**
     * Generate w:contextualSpacing
     *
     * @access protected
     * @param string $val
     */
    protected function generateCONTEXTUALSPACING($val = 'on')
    {
        $this->_xml = str_replace(
            '__GENERATEPPR__', '<' . CreateElement::NAMESPACEWORD .
            ':contextualSpacing w:val="' . $val . '"></' .
            CreateElement::NAMESPACEWORD . ':contextualSpacing>__GENERATEPPR__',
            $this->_xml
        );
    }

    /**
     * Generate w:i
     *
     * @access protected
     * @param string $val
     */
    protected function generateI($val = 'single')
    {
        $this->_xml = str_replace(
            '__GENERATERPR__', '<' . CreateElement::NAMESPACEWORD . ':i ' .
            CreateElement::NAMESPACEWORD . ':val="' . $val . '"></' .
            CreateElement::NAMESPACEWORD . ':i>__GENERATERPR__', $this->_xml
        );
    }

    /**
     * Generate w:ind
     *
     * @access protected
     * @param string $val
     */
    protected function generateINDENT($indent_left = 0, $indent_right = 0)
    {
        $this->_xml = str_replace(
            '__GENERATEPPR__', '<' . CreateElement::NAMESPACEWORD . ':ind ' .
            CreateElement::NAMESPACEWORD . ':left="' . $indent_left . '" ' .
            CreateElement::NAMESPACEWORD . ':right="' . $indent_right .
            '"></' . CreateElement::NAMESPACEWORD . ':ind>__GENERATEPPR__',
            $this->_xml
        );
    }
    
    /**
     * Generate w:keepLines
     *
     * @access protected
     * @param string $val
     */
    protected function generateKEEPLINES($val = 'on')
    {
        $this->_xml = str_replace(
            '__GENERATEPPR__', '<' . CreateElement::NAMESPACEWORD .
            ':keepLines w:val="' . $val . '"></' .
            CreateElement::NAMESPACEWORD . ':keepLines>__GENERATEPPR__',
            $this->_xml
        );
    }
    
    /**
     * Generate w:keepNext
     *
     * @access protected
     * @param string $val
     */
    protected function generateKEEPNEXT($val = 'on')
    {
        $this->_xml = str_replace(
            '__GENERATEPPR__', '<' . CreateElement::NAMESPACEWORD .
            ':keepNext w:val="' . $val . '"></' .
            CreateElement::NAMESPACEWORD . ':keepNext>__GENERATEPPR__',
            $this->_xml
        );
    }

    /**
     * Generate w:jc
     *
     * @access protected
     * @param string $val
     */
    protected function generateJC($val = '')
    {
        $this->_xml = str_replace(
            '__GENERATEPPR__', '<' . CreateElement::NAMESPACEWORD . ':jc ' .
            CreateElement::NAMESPACEWORD . ':val="' . $val . '"></' .
            CreateElement::NAMESPACEWORD . ':jc>__GENERATESZ__', $this->_xml
        );
    }

    /**
     * Generate w:pagebreakbefore
     *
     * @access protected
     * @param string $val
     */
    protected function generatePAGEBREAKBEFORE($val = 'on')
    {
        $this->_xml = str_replace(
            '__GENERATEPPR__', '<' . CreateElement::NAMESPACEWORD .
            ':pageBreakBefore val="' . $val . '"></' .
            CreateElement::NAMESPACEWORD . ':pageBreakBefore>__GENERATEPPR__',
            $this->_xml
        );
    }

    /**
     * Generate w:ppr
     *
     * @access protected
     */
    protected function generatePPR()
    {
        $xml = '<' . CreateElement::NAMESPACEWORD . ':pPr>__GENERATEPPR__</' . CreateElement::NAMESPACEWORD .
               ':pPr>__GENERATER__';

        $this->_xml = str_replace('__GENERATEP__', $xml, $this->_xml);
    }
    
    /**
     * Generate w:rPr within a w:pPr tag
     *
     * @access protected
     */
    protected function generatePPRRPR()
    {
        /*$xml = '<' . CreateElement::NAMESPACEWORD .
                ':rPr>__GENERATERPR__</' . CreateElement::NAMESPACEWORD .
                ':rPr>__GENERATER__';

        $this->_xml = str_replace('__GENERATER__', $xml, $this->_xml);*/
        
        $this->_xml = str_replace(
            '__GENERATEPPR__', '<' . CreateElement::NAMESPACEWORD . ':rPr >__GENERATERPR__</' .
            CreateElement::NAMESPACEWORD . ':rPr>__GENERATEPPR__',
            $this->_xml
        );
    }

    /**
     * Generate w:pstyle
     *
     * @access protected
     * @param string $val
     */
    protected function generatePSTYLE($val = 'TitlePHPDOCX')
    {
        $this->_xml = str_replace(
            '__GENERATEPPR__', '<' . CreateElement::NAMESPACEWORD . ':pStyle ' .
            CreateElement::NAMESPACEWORD . ':val="' . $val . '"></' .
            CreateElement::NAMESPACEWORD . ':pStyle>__GENERATEPPR__',
            $this->_xml
        );
    }

    /**
     * Generate w:spacing
     *
     * @access protected
     */
    protected function generateSPACING($line = '240')
    {
        $xml = '<' . CreateElement::NAMESPACEWORD . ':spacing ' . CreateElement::NAMESPACEWORD . ':line="' . $line  .
               '" ' . CreateElement::NAMESPACEWORD . ':lineRule="auto"/>__GENERATEPPR__';

        $this->_xml = str_replace('__GENERATEPPR__', $xml, $this->_xml);
    }

    /**
     * Generate w:sz
     *
     * @access protected
     * @param string $val
     */
    protected function generateSZ($val = '11')
    {
        $val *= 2;
        $this->_xml = str_replace(
            '__GENERATERPR__', '<' . CreateElement::NAMESPACEWORD . ':sz ' .
            CreateElement::NAMESPACEWORD . ':val="' . $val . '"></' .
            CreateElement::NAMESPACEWORD . ':sz>__GENERATERPR__', $this->_xml
        );
    }

    /**
     * Generate w:t
     *
     * @access protected
     * @param string $dat
     * @param int $spaces
     * @param string $lineBreak
     * @param string $columnBreak
     */
    protected function generateT($dat, $spaces = 0, $lineBreak = false, $columnBreak = false)
    {
        $strSpaces = '';
        if ($spaces) {
            $i = 0;
            while ($i < $spaces) {
                $strSpaces .= ' ';
                $i++;
            }
        }
        if($lineBreak == 'before'){
            $this->_xml = str_replace(
                '__GENERATER__', '<w:br /><' . CreateElement::NAMESPACEWORD .
                ':t xml:space="preserve">' . $strSpaces . htmlspecialchars($dat) . '</' .
                CreateElement::NAMESPACEWORD . ':t>', $this->_xml
            );
        }else if($lineBreak == 'after'){
            $this->_xml = str_replace(
                '__GENERATER__', '<' . CreateElement::NAMESPACEWORD .
                ':t xml:space="preserve">' . $strSpaces . htmlspecialchars($dat) . '</' .
                CreateElement::NAMESPACEWORD . ':t><w:br />', $this->_xml
            );
        }else if($lineBreak == 'both'){
            $this->_xml = str_replace(
                '__GENERATER__', '<w:br /><' . CreateElement::NAMESPACEWORD .
                ':t xml:space="preserve">' . $strSpaces . htmlspecialchars($dat) . '</' .
                CreateElement::NAMESPACEWORD . ':t><w:br />', $this->_xml
            );
        }else if($columnBreak == 'before'){
            $this->_xml = str_replace(
                '__GENERATER__', '<w:br w:type="column" /><' . CreateElement::NAMESPACEWORD .
                ':t xml:space="preserve">' . $strSpaces . htmlspecialchars($dat) . '</' .
                CreateElement::NAMESPACEWORD . ':t>', $this->_xml
            );
        }else if($columnBreak == 'after'){
            $this->_xml = str_replace(
                '__GENERATER__', '<' . CreateElement::NAMESPACEWORD .
                ':t xml:space="preserve">' . $strSpaces . htmlspecialchars($dat) . '</' .
                CreateElement::NAMESPACEWORD . ':t><w:br w:type="column" />', $this->_xml
            );
        }else if($columnBreak == 'both'){
            $this->_xml = str_replace(
                '__GENERATER__', '<w:br w:type="column" /><' . CreateElement::NAMESPACEWORD .
                ':t xml:space="preserve">' . $strSpaces . htmlspecialchars($dat) . '</' .
                CreateElement::NAMESPACEWORD . ':t><w:br w:type="column" />', $this->_xml
            );
        }else{
            $this->_xml = str_replace(
                '__GENERATER__', '<' . CreateElement::NAMESPACEWORD .
                ':t xml:space="preserve">' . $strSpaces . htmlspecialchars($dat) . '</' .
                CreateElement::NAMESPACEWORD . ':t>', $this->_xml
            );           
        }
    }

    /**
     * Generate w:abs
     *
     * @access protected
     */
    protected function generateTABS()
    {
        $this->_xml = str_replace(
            '__GENERATER__', '<' . CreateElement::NAMESPACEWORD .
             ':tab/>__GENERATER__', $this->_xml
        );
    }
    
    /**
     * Generate w:textDirection
     *
     * @access protected
     * @param string $val
     */
    protected function generateTEXTDIRECTION($val = 'lrTb')
    {
        $this->_xml = str_replace(
            '__GENERATEPPR__', '<' . CreateElement::NAMESPACEWORD .
            ':textDirection w:val="' . $val . '"></' .
            CreateElement::NAMESPACEWORD . ':textDirection>__GENERATEPPR__',
            $this->_xml
        );
    }

    /**
     * Generate w:u
     *
     * @access protected
     * @param string $val
     */
    protected function generateU($val = 'single')
    {
        $this->_xml = str_replace(
            '__GENERATERPR__', '<' . CreateElement::NAMESPACEWORD . ':u ' .
            CreateElement::NAMESPACEWORD . ':val="' . $val . '"></' .
            CreateElement::NAMESPACEWORD . ':u>__GENERATERPR__', $this->_xml
        );
    }

    /**
     * Generate w:widowcontrol
     *
     * @access protected
     * @param string $val
     */
    protected function generateWIDOWCONTROL($val = 'on')
    {
        $this->_xml = str_replace(
            '__GENERATEPPR__', '<' . CreateElement::NAMESPACEWORD .
            ':widowControl val="' . $val . '"></' .
            CreateElement::NAMESPACEWORD . ':widowControl>__GENERATEPPR__',
            $this->_xml
        );
    }

    /**
     * Generate w:wordwrap
     *
     * @access protected
     * @param string $val
     */
    protected function generateWORDWRAP($val = 'on')
    {
        $this->_xml = str_replace(
            '__GENERATEPPR__', '<' . CreateElement::NAMESPACEWORD .
            ':wordWrap val="' . $val . '"></' . CreateElement::NAMESPACEWORD .
            ':wordWrap>__GENERATEPPR__', $this->_xml
        );
    }

}
