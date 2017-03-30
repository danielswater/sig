<?php

    $_SERVER['HTTP_HOST']   = 'digital.ftd.com.br';
    $_SERVER['SERVER_NAME'] = 'digital.ftd.com.br';

    include realpath(dirname(__FILE__)) . '/ftdId_init.php';
    include realpath(dirname(__FILE__)) . '/ftdId_models.php';

    $db->enableDebugging(TRUE);

    //1- Recuperar id do CT_ITEM que corresponde ao cod_mestre velho
    //2- Recuperar id do CT_ITEM que corresponde ao cod_mestrenovo
    //3- Filtrar usuarios (fidUsersItem) que possuem o codigo do velho
    //4- Atualiza todos os registros FidUsersItem do item_id velho para o novo

    $rsLeds = fRecordSet::build('FidLedItem');
    $aCodes = array();
    foreach ($rsLeds as $led) {
        $aCodes[] = $led->getItemId();
    }

    $aSearch                          = array();
    $aSearch['item_id=']              = $aCodes;
    $aSearch['item_access_level_id='] = 16;
    $aSearch['added_on>=']            = '2012-12-31 00:00:00';

    // $aSearch['fid_user_id='] = 22463;


    $timestamp = new fTimestamp('today');
    $timestamp = $timestamp->modify('Y-12-31 23:59:59');
    $timestamp = $timestamp->adjust('+3years');

    $rsUserItems = fRecordSet::build('FidUsersItem',$aSearch);
    foreach ($rsUserItems as $items) {
        $ctItem = new CtItem($items->getItemId());
        $bookCodigo = $ctItem->getCodMestre();

        $fid_user_id = $items->getFidUserId();
        $accessLevel = $items->getItemAccessLevelId();

        $aSearch                 = array();
        $aSearch['cod_ftd=']     = $bookCodigo;
        $rsFidLedItem            = fRecordSet::build('FidLedItem', $aSearch);
        foreach ($rsFidLedItem as $key => $value) {
            $bookLedId = $value->getCodFtdErp();

            $aSearch                          = array();
            $aSearch['fid_user_id=']          = $fid_user_id;
            $aSearch['item_id=']              = $items->getItemId();
            $aSearch['item_access_level_id='] = $accessLevel;
            $aSearch['cod_ftd_erp=']          = $bookLedId;

            $rsLeds = fRecordSet::build('FidLedUsersItem', $aSearch);
            if($rsLeds->count() == 0){
                // $aSearch                 = array();
                // $aSearch['fid_user_id='] = null;
                // $rsLicenses              = fRecordSet::build('FidLedLicense', $aSearch);
                // $license                 = $rsLicenses->getRecord(0);

                // $license->setFidUserId($fid_user_id);
                // $license->store();

                $ledUserItem = new FidLedUsersItem();
                $ledUserItem->setFidUserId($fid_user_id);
                $ledUserItem->setItemId($items->getItemId());
                $ledUserItem->setCodFtdErp($bookLedId);
                $ledUserItem->setItemAccessLevelId($accessLevel);
                $ledUserItem->setExpirationDate($timestamp->format('Y-m-d H:i:s'));
                $ledUserItem->setItemLicensesAllowed(LED_LICENSES_AMOUNT);
                // $ledUserItem->setLicense($license->getLicense());
                $ledUserItem->store();
            }
        }
    }
?>