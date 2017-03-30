<?php

/**
 * Creates a WordML fragment composed of twice the same table that is inserted within another table
 *
 * @category   Phpdocx
 * @package    examples
 * @subpackage easy
 * @copyright  Copyright (c) 2009-2013 Narcea Producciones Multimedia S.L.
 *             (http://www.2mdc.com)
 * @license    http://www.phpdocx.com/wp-content/themes/lightword/pro_license.php
 * @version    2012.12.30
 * @link       http://www.phpdocx.com
 * @since      2012.12.30
 */
require_once '../../classes/DocxUtilities.inc';

$docx = new DocxUtilities();
$source = '../files/Text.docx';

$newDocx = new CreateDocx();
$newDocx->addText('Text');

$valuesTable = array(
    array(
        11,
        12
    ),
    array(
        21,
        22
    ),
);

$paramsTable = array(
    'border' => 'single',
    'border_sz' => 4,
    'rawWordML' => true
);

$myTable = $newDocx->addTable($valuesTable, $paramsTable);

$fragment = $newDocx->createWordMLFragment(array($myTable));

$docx->addWordMLContent($source, $newDocx, $fragment);