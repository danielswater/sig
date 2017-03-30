<?php
  class Cms {
    
    protected $_slimApp;
    protected $_db;

    public function __construct( $options ) {

      if (array_key_exists('SlimApp', $options)) {
            $this->_slimApp = $options['SlimApp'];
      }      

    }


    protected function _getDb() {
      if (!$this->_db) {
        var_dump(DB_TYPE, DB_NAME, DB_USER, DB_PASS, DB_HOST);
        $this->_db = new fDatabase(DB_TYPE, DB_NAME, DB_USER, DB_PASS, DB_HOST);
      }
      return $this->_db;
    }

    //GETS
    public function getIndex() {      
                
    }

    public function getHomeLogado() {       

        $rowHome = array();

        $strQueryHome = 'SELECT * FROM fid_home_logado';
        $resultHome = $this->_getDb()->query($strQueryHome);
        
        if ($resultHome->valid()) {
            $rowHome[] = $resultHome->fetchRow();
        }

        $resultBanner         = $this->getBanners(true);
        $resultLinks          = $this->getHomeGroupLinks(true);
        $resultEntrevista     = $this->getInterviewHome(true);
        $resultDigitalItem    = $this->getHomeDigitalItem(true);
        $resultTotalizadores  = $this->getTotalizadores(true);

        $home['banners']        = $resultBanner;
        $home['semana']         = $resultDigitalItem;
        $home['entrevista']     = $resultEntrevista;
        $home['links']          = $resultLinks;
        $home['home']  = $resultTotalizadores;
                
        fJSON::output($home);
    }

    public function getCatalogo($q){

      // var_dump($q);
      // var_dump(FTD_DIGITAL_URL . 'catalogo/index_api.php/catalogo?id=&naoclassificados=&type=&string='.urlencode($q).'&disciplina=&nivel=&conteudo=13,10,12,11,4,2,1,3&ordem=id');

      $ch = curl_init();

      curl_setopt($ch, CURLOPT_URL, FTD_DIGITAL_URL . 'catalogo/index_api.php/catalogo?id=&naoclassificados=&type=&string='.urlencode($q).'&disciplina=&nivel=&conteudo=13,10,12,11,4,2,1,3&ordem=id');
      curl_setopt($ch, CURLOPT_HEADER, 0);
      curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

      $result = curl_exec($ch);
      
      curl_close($ch);

      echo $result ;

    }

    public function getWeeks($flgArr = false){
      
      $weeks = array();
      $i = 1;
      $n = 1;
      $year           = date("Y");
      $month           = date("m");
      $firstDayOfYear = mktime(0, 0, 0, 1, 1, $year);
      $nextMonday     = strtotime('monday', $firstDayOfYear);
      $nextSunday     = strtotime('sunday', $nextMonday);

      while (date('Y', $nextMonday) == $year) {
          
          $dateA = substr(date('c', $nextSunday), 0, -15);
          $dateRest = explode('-', $dateA);
          $dateB = $dateRest[2].'-'.$dateRest[1].'-'.$dateRest[0];
          
          if($dateRest[1] >= $month){
            $weeks[] = array('dataA' => $dateA, 'dataB' => $dateB, 'semana' => 'semana '.$i.' '.$dateRest[0]);  
            $n++;
          }          

          $nextMonday = strtotime('+1 week', $nextMonday);
          $nextSunday = strtotime('+1 week', $nextSunday);
          $i++;

      }

      $i = 1;
      while (date('Y', $nextMonday) == $year+1) {
          // echo date('c', $nextMonday), '- ', date('c', $nextSunday), '<br>';
          $dateA = substr(date('c', $nextSunday), 0, -15);
          $dateRest = explode('-', $dateA);
          $dateB = $dateRest[2].'-'.$dateRest[1].'-'.$dateRest[0];
          // echo $rest, '<br>';
          $weeks[] = array('dataA' => $dateA, 'dataB' => $dateB, 'semana' => 'semana '.$i.' '.$dateRest[0]);  

          $nextMonday = strtotime('+1 week', $nextMonday);
          $nextSunday = strtotime('+1 week', $nextSunday);
          if ($n == '52') {
              break;    /* You could also write 'break 1;' here. */
          }
          $i++;
          $n++;
      }

      if ($flgArr == false) {           
        fJSON::output($weeks);          
      }else{
        return $weeks;
      }

    }    

    public function getTotalizadores($flgArr = false) {      

      $totalizadores = array();

      $ftdId_User_Tot = json_decode(ftdId::getUserToken(), true);
      
      $sBooksId = '';
      $aBooksCodMestre = array();
      $lBooksCod = '';

      foreach($ftdId_User_Tot['livros'] as $book){
        $sBooksId .= 'id[]='.$book['cod'].'&';            
        $aBooksCodMestre[] = $book['cod'];    
      }

      $aSearch = array();      
      $aSearch['cod_mestre='] = $aBooksCodMestre;
      $relItems = fRecordSet::build('CtItem', $aSearch);

      foreach($relItems as $item){
        $lBooksCod .= '"'.$item->getCod().'"+';  
      }
      
      $rsBooksId = substr($sBooksId, 0, strlen($sBooksId)-1);
      $rsBooksCod = substr($lBooksCod, 0, strlen($lBooksCod)-1);

      fSession::set('flgHasTotalizadores', null); 
      $flgHasTotalizadores = fSession::get('flgHasTotalizadores', null);            

      if(is_null($flgHasTotalizadores) === true){
        
        $searchUrl = FTD_DIGITAL_URL . 'catalogo/index_api.php/catalogo/true?naoclassificados=&type=&string=&disciplina=&nivel=&conteudo=13,10,12,11,4,2,1,3&ordem=id';
        $searchUrl.= '&'.$rsBooksId;
        
        $ch = curl_init();

        // set URL and other appropriate options
        curl_setopt($ch, CURLOPT_URL, $searchUrl);

        curl_setopt($ch, CURLOPT_HEADER, 0);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        // grab URL and pass it to the browser
        $response = curl_exec($ch);

        // close cURL resource, and free up system resources
        curl_close($ch);

        $response = json_decode($response, true);

        $imagemAnimada = 0;
        $useSugestion = 0;

        foreach($response['data-catalogo'] as $item){          
          if($item['content_type_id'] == 4){
            $imagemAnimada++;
          }            
          if($item['use_sugestion'] != ''){
            $useSugestion++;
          }            
        }

        $conteudoMultimidia = $response['total_format'] - $imagemAnimada;

        $searchUrl = 'http://links.ftd.com.br/acervo/search/?q=*.*&fq=books:+('.urlencode($rsBooksCod).')&rows=1';
                
        $ch = curl_init();

        // set URL and other appropriate options
        curl_setopt($ch, CURLOPT_URL, $searchUrl);

        curl_setopt($ch, CURLOPT_HEADER, 0);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        // grab URL and pass it to the browser
        $response = curl_exec($ch);

        // close cURL resource, and free up system resources
        curl_close($ch);

        $response = json_decode($response, true);
        
        $acervoLinks = $response['response']['numFound'];

        $readingProjects  = fRecordSet::build('FidReadingProject');
        
        $projetosLeitura = $readingProjects->count();
        $sugestaoUso = $useSugestion;

        $flgHasTotalizadores = false;        

        fSession::set('imagemAnimada', $imagemAnimada);
        fSession::set('conteudoMultimidia', $conteudoMultimidia);
        fSession::set('projetosLeitura', $projetosLeitura);
        fSession::set('sugestaoUso', $sugestaoUso);
        fSession::set('acervoLinks', $acervoLinks);
        fSession::set('flgHasTotalizadores', $flgHasTotalizadores);
      }
      // var_dump($ftdId_User_Tot);
      // die();
      $perfil =  $this->getPerfil(true);
      
      $perfilCompleto = 0;

      if($ftdId_User_Tot['nome'] != ''){
        $perfilCompleto += $perfil[0]['nome'];
      }

      if($ftdId_User_Tot['email'] != ''){
        $perfilCompleto += $perfil[0]['email'];
      }

      if($ftdId_User_Tot['cpf'] != ''){
        $perfilCompleto += $perfil[0]['cpf'];
      }

      if($ftdId_User_Tot['rg'] != ''){
        $perfilCompleto += $perfil[0]['rg'];
      }

      if($ftdId_User_Tot['sexo'] != ''){
        $perfilCompleto += $perfil[0]['sexo'];
      }

      if($ftdId_User_Tot['data_nascimento'] != ''){
        $perfilCompleto += $perfil[0]['data_nascimento'];
      }

      if($ftdId_User_Tot['cep'] != ''){
        $perfilCompleto += $perfil[0]['cep'];
      }

      if($ftdId_User_Tot['foto'] != ''){
        $perfilCompleto += $perfil[0]['foto'];
      }

      if($ftdId_User_Tot['telefone'] != ''){
        $perfilCompleto += $perfil[0]['telefone'];
      }

      if($ftdId_User_Tot['celular'] != ''){
        $perfilCompleto += $perfil[0]['celular'];
      }

      if($ftdId_User_Tot['endereco_logradouro'] != ''){
        $perfilCompleto += $perfil[0]['endereco'];
      }

      if($ftdId_User_Tot['cidade'] != ''){
        $perfilCompleto += $perfil[0]['cidade'];
      }

      if($ftdId_User_Tot['estado'] != ''){
        $perfilCompleto += $perfil[0]['estado'];
      }

      if($ftdId_User_Tot['pais'] != ''){
        $perfilCompleto += $perfil[0]['pais'];
      }

      if($ftdId_User_Tot['sexo'] == 'M'){
        $saudacao = 'Bem-vindo ';
      }elseif ($ftdId_User_Tot['sexo'] == 'F') {
        $saudacao = 'Bem-vinda ';
      }

      $nomeCompleto = explode(' ', $ftdId_User_Tot['nome']);
      $saudacao .= $nomeCompleto[0];

      $totalizadores['totais']['imagemAnimada']       = fSession::get('imagemAnimada');
      $totalizadores['totais']['conteudoMultimidia']  = fSession::get('conteudoMultimidia');
      $totalizadores['totais']['acervoLinks']         = fSession::get('acervoLinks');
      $totalizadores['totais']['projetosLeitura']     = fSession::get('projetosLeitura');
      $totalizadores['totais']['sugestaoUso']         = fSession::get('sugestaoUso');
      $totalizadores['totais']['livros']              = count($ftdId_User_Tot['livros']);
      $totalizadores['totais']['perfil']              = $perfilCompleto;
      $totalizadores['totais']['saudacao']            = $saudacao;
      
      if ($flgArr == false) {           
        fJSON::output($totalizadores);          
      }else{
        return $totalizadores;
      }
    }

    public function getLinksSial($q = 'sial'){
      $ch = curl_init();

      curl_setopt($ch, CURLOPT_URL, 'http://links.ftd.com.br/acervo/search?q=*'.$q.'*');
      curl_setopt($ch, CURLOPT_HEADER, 0);
      curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

      $result = curl_exec($ch);
      
      curl_close($ch);

      echo $result ;

    }    

    public function getShortLinks($flgArr = false){
        $rowShortLinks = array();

        $strQueryShortLinks = 'SELECT * FROM fid_home_shortlinks_group where ativo = 1';
        $resultShortLinks = $this->_getDb()->query($strQueryShortLinks);
                
        $i = 0;
        while ($resultShortLinks->valid()) {
            $result = $resultShortLinks->fetchRow(); 
            $rowShortLinks[$i] = $result;
            $rowShortLinks[$i]['folderClass'] = "icon-plus";
            $strQueryShortLinksGroup = 'SELECT * FROM fid_home_shortlinks WHERE ativo = 1 and home_shortlink_group_id = '.$result['id'];
            $resultShortLinksGroup = $this->_getDb()->query($strQueryShortLinksGroup);
            
            while ($resultShortLinksGroup->valid()) { 
              $rowShortLinks[$i]['links'][] = $resultShortLinksGroup->fetchRow();
            }
            $i++;
        }
        // else{
        //   $arrMensagem = array('error' => -1, 'msg' => "Não há ShortLinks para serem retornados!");        
        //   fJSON::output( $arrMensagem );
        //   die();
        // }

        if ($flgArr == false) {           
          fJSON::output($rowShortLinks);          
        }else{
          return $rowShortLinks;
        }
    }  

    public function getShortLinksGroup($id, $flgArr = false){
        $rowShortLinks = array();

        $strQueryShortLinks = 'SELECT * FROM fid_home_shortlinks where ativo = 1 and home_shortlink_group_id = '.$id;
        $resultShortLinks = $this->_getDb()->query($strQueryShortLinks);

        while ($resultShortLinks->valid()) {
            $rowShortLinks[] = $resultShortLinks->fetchRow();
        }
        // else{
        //   $arrMensagem = array('error' => -1, 'msg' => "Não há ShortLinks para serem retornados!");        
        //   fJSON::output( $arrMensagem );
        //   die();
        // }

        if ($flgArr == false) {           
          fJSON::output($rowShortLinks);          
        }else{
          return $rowShortLinks;
        }
    }  

    public function getShortLink($id, $flgArr = false){
        $rowShortLinks = array();

        $strQueryShortLinks = 'SELECT * FROM fid_home_shortlinks_group WHERE id = '.$id;
        $resultShortLinks = $this->_getDb()->query($strQueryShortLinks);

        if ($resultShortLinks->valid()) {          
            $rowShortLinks[0] = $resultShortLinks->fetchRow();
            $strQueryShortLinksGroup = 'SELECT * FROM fid_home_shortlinks WHERE ativo = 1 and home_shortlink_group_id = '.$id;
            $resultShortLinksGroup = $this->_getDb()->query($strQueryShortLinksGroup);
            while ($resultShortLinksGroup->valid()) { 
              $rowShortLinks[0]['links'] = $resultShortLinksGroup->fetchRow();
            }
        }
        // else{
        //   $arrMensagem = array('error' => -1, 'msg' => "Não há ShortLinks para serem retornados!");        
        //   fJSON::output( $arrMensagem );
        //   die();
        // }

        if ($flgArr == false) {           
          fJSON::output($rowShortLinks);          
        }else{
          return $rowShortLinks;
        }
    }  

    public function getBanner($id, $flgArr = false) {              

        $rowBanners = array();

        $strQueryBanners = 'SELECT fhb.*, DATE_FORMAT(periodo_ini , "%d/%m/%Y") periodoiniformat,  DATE_FORMAT(periodo_end , "%d/%m/%Y") periodoendformat, fb.img FROM fid_home_banner fhb inner join fid_banners fb on fhb.banner_id = fb.id where fhb.id = ' . $id;
        $resultBanners = $this->_getDb()->query($strQueryBanners);

        if ($resultBanners->valid()) {
            $rowBanners[] = $resultBanners->fetchRow();
        }
        // else{
        //   $arrMensagem = array('error' => -1, 'msg' => "Não há banners para serem retornados!");        
        //   fJSON::output( $arrMensagem );
        //   die();
        // }

        if ($flgArr == false) {           
          fJSON::output($rowBanners);          
        }else{
          return $rowBanners;
        }
        
    }

    public function getBannersAll($flgArr = false) {              

        $rowBanner = array();

        $strQueryBanner = "SELECT fcb.id banner_id, fcb.name, fcb.path, DATE_FORMAT(periodo_ini , '%d/%m/%Y') periodoiniformat,  DATE_FORMAT(periodo_end , '%d/%m/%Y') periodoendformat , (
        CASE 
            WHEN fhb.id IS NULL
            THEN ''
            ELSE fhb.id
        END
      ) id, fhb.link, fhb.ordem, fhb.periodo_ini, fhb.periodo_end, fhb.target, fhb.ativo , fhb.vinculo FROM `fid_collections_banners` fcb left join `fid_home_banner` fhb on fcb.id = fhb.banner_id
      order by 
      (fhb.ordem IS NOT NULL) desc       
      ";
        //$strQueryBanner = "SELECT fcb.*, fhb.id idHomeBanner, fhb.link, fhb.ordem, fhb.periodo_ini, fhb.periodo_end, fhb.target, fhb.ativo , fhb.vinculo FROM `fid_collections_banners` fcb left join `fid_home_banner` fhb on fcb.id = fhb.banner_id where fhb.vinculo =1";
        $resultBanner = $this->_getDb()->query($strQueryBanner);

        while ($resultBanner->valid()) {
            $rowBanner[] = $resultBanner->fetchRow();
        }

        if ($flgArr == false) {
          fJSON::output($rowBanner);
        }else{
          return $rowBanner;
        }        
        
    }  

    public function getBanners($flgArr = false) {              

        $rowBanner = array();

        $strQueryBanner = "SELECT fcb.id banner_id, fcb.name, fcb.path , ( CASE WHEN fhb.id IS NULL THEN '' ELSE fhb.id END ) id, (CASE 
            WHEN fhb.link is null
            THEN ''
            ELSE fhb.link
        END
      ) link, fhb.ordem, fhb.periodo_ini, fhb.periodo_end, (
        CASE 
            WHEN fhb.target = 0
            THEN '_blank'
            ELSE '_self'
        END
      ) target, fhb.ativo , fhb.vinculo FROM `fid_collections_banners` fcb inner join `fid_home_banner` fhb on fcb.id = fhb.banner_id order by (fhb.ordem IS NOT NULL) desc";
        $resultBanner = $this->_getDb()->query($strQueryBanner);

        while ($resultBanner->valid()) {
            $rowBanner[] = $resultBanner->fetchRow();
        }
        // else{
        //   $arrMensagem = array('error' => -1, 'msg' => "Não há banners para serem retornados!");        
        //   fJSON::output( $arrMensagem );
        //   die();
        // }

        if ($flgArr == false) {
          fJSON::output($rowBanner);
        }else{
          return $rowBanner;
        }        
        
    }    

    public function getDigitalItems($flgArr = false) {              

        $rowDigitalItem = array();

        $strQueryDigitalItem = 'SELECT * FROM fid_digital_items';
        $resultDigitalItem = $this->_getDb()->query($strQueryDigitalItem);

        if ($resultDigitalItem->valid()) {
            $rowDigitalItem[] = $resultDigitalItem->fetchRow();
        }
        // else{
        //   $arrMensagem = array('error' => -1, 'msg' => "Não há objetos para serem retornados!");        
        //   fJSON::output( $arrMensagem );
        //   die();
        // }

        if ($flgArr == false) {
          fJSON::output($rowDigitalItem);
        }else{
          return $rowDigitalItem;
        }

    }



    public function getHomeDigitalItem($flgArr = false) {              

        $rowDigitalItem = array();

        $strQueryDigitalItem = "SELECT fhdi.*, 
          fdi.name, 
          fdi.description, 
          fdi.download_link, 
          fdi.view_link, 
          fdi.thumbnail,
          fps.name segment_name,
          fpd.name discipline_name,
          fdit.display_name display_name,
          fdit.lightbox_type lightbox_type,
          fdit.fancybox_type fancybox_type,
          DATE_FORMAT(fhdi.periodo_ini , '%d/%m/%Y') periodoiniformat          
        FROM fid_home_digital_item fhdi 
        inner join fid_digital_items fdi on fhdi.digital_item_id = fdi.id 
        inner join fid_profile_segments fps on fps.id = fdi.profile_segment_id
        inner join fid_profile_disciplines fpd on fpd.id = fdi.profile_discipline_id
        inner join fid_digital_item_types fdit on fdit.id = fdi.digital_type_id
        WHERE fhdi.periodo_ini >= ".date('Y-m-d')." and ativo = 1 ORDER BY fhdi.periodo_ini asc limit 1     
        ";
          //$strQueryBanner = "SELECT fcb.*, fhb.id idHomeBanner, fhb.link, fhb.ordem, fhb.periodo_ini, fhb.periodo_end, fhb.target, fhb.ativo , fhb.vinculo FROM `fid_collections_banners` fcb left join `fid_home_banner` fhb on fcb.id = fhb.banner_id where fhb.vinculo =1";
          $resultDigitalItem = $this->_getDb()->query($strQueryDigitalItem);

          while ($resultDigitalItem->valid()) {
              $rowDigitalItem[] = $resultDigitalItem->fetchRow();
          }

          if ($flgArr == false) {
            fJSON::output($rowDigitalItem);
          }else{
            return $rowDigitalItem;
          } 

    }

    public function getHomeDigitalItems($flgArr = false) { 

        $rowDigitalItem = array();

        $strQueryDigitalItem = "SELECT fhdi.*, DATE_FORMAT(fhdi.periodo_ini , '%d/%m/%Y') periodoiniformat, fdi.name, fdi.thumbnail, fdi.description,fdi.view_link, fdi.production_id FROM fid_home_digital_item fhdi inner join fid_digital_items fdi on fhdi.digital_item_id = fdi.id   where ativo = 1";
          //$strQueryBanner = "SELECT fcb.*, fhb.id idHomeBanner, fhb.link, fhb.ordem, fhb.periodo_ini, fhb.periodo_end, fhb.target, fhb.ativo , fhb.vinculo FROM `fid_collections_banners` fcb left join `fid_home_banner` fhb on fcb.id = fhb.banner_id where fhb.vinculo =1";
        $resultDigitalItem = $this->_getDb()->query($strQueryDigitalItem);

        while ($resultDigitalItem->valid()) {
              $rowDigitalItem[] = $resultDigitalItem->fetchRow();
        }

        if ($flgArr == false) {
            fJSON::output($rowDigitalItem);
        }else{
            return $rowDigitalItem;
        } 
    }

    public function getHomeLink($id, $flgArr = false) {              

        $rowHomeLink = array();

        $strQueryHomeLink = 'SELECT * FROM fid_home_shortlinks where id = ' . $id;
        $resultHomeLink = $this->_getDb()->query($strQueryHomeLink);

        if ($resultHomeLink->valid()) {
            $rowHomeLink[] = $resultHomeLink->fetchRow();
        }
        // else{
        //   $arrMensagem = array('error' => -1, 'msg' => "Não há links para serem retornados!");        
        //   fJSON::output( $arrMensagem );
        //   die();
        // }

        if ($flgArr == false) {
          fJSON::output($rowHomeLink);
        }else{
          return $rowHomeLink;
        }

    }    

    public function getHomeGroupLinks($flgArr = false) {              

        $rowHomeLinks = array();

        $strQueryHomeLinks = 'SELECT * FROM fid_home_shortlinks_group where ativo = 1 and date >= '.date("Y-m-d").' ORDER BY date asc limit 1';
        $resultHomeLinks = $this->_getDb()->query($strQueryHomeLinks);

        if ($resultHomeLinks->valid()) {
          $result = $resultHomeLinks->fetchRow();
          $strQueryShortLinksGroup = 'SELECT * FROM fid_home_shortlinks WHERE ativo = 1 and home_shortlink_group_id = '.$result['id'];
          $resultShortLinksGroup = $this->_getDb()->query($strQueryShortLinksGroup);
          
          while ($resultShortLinksGroup->valid()) { 
            $rowHomeLinks[] = $resultShortLinksGroup->fetchRow();
          }
          // $rowHomeLinks[] = $resultHomeLinks->fetchRow();                      
        }
        // else{
        //   $arrMensagem = array('error' => -1, 'msg' => "Não há links para serem retornados!");        
        //   fJSON::output( $arrMensagem );
        //   die();
        // }

        if ($flgArr == false) {
          fJSON::output($rowHomeLinks);
        }else{
          return $rowHomeLinks;
        }        
        
    }

    public function getHomeLinks($flgArr = false) {              

        $rowHomeLinks = array();

        $strQueryHomeLinks = 'SELECT * FROM fid_home_shortlinks where ativo = 1 limit 5';
        $resultHomeLinks = $this->_getDb()->query($strQueryHomeLinks);

        if ($resultHomeLinks->valid()) {
          while ($resultHomeLinks->valid()) {
            $rowHomeLinks[] = $resultHomeLinks->fetchRow();
          }            
        }
        // else{
        //   $arrMensagem = array('error' => -1, 'msg' => "Não há links para serem retornados!");        
        //   fJSON::output( $arrMensagem );
        //   die();
        // }

        if ($flgArr == false) {
          fJSON::output($rowHomeLinks);
        }else{
          return $rowHomeLinks;
        }        
        
    }

    public function getAllHomeLinks($flgArr = false) {              

        $rowHomeLinks = array();

        $strQueryHomeLinks = 'SELECT * FROM fid_home_shortlinks order by id';
        $resultHomeLinks = $this->_getDb()->query($strQueryHomeLinks);

        if ($resultHomeLinks->valid()) {
          while ($resultHomeLinks->valid()) {
            $rowHomeLinks[] = $resultHomeLinks->fetchRow();
          } 
        }
        // else{
        //   $arrMensagem = array('error' => -1, 'msg' => "Não há links para serem retornados!");        
        //   fJSON::output( $arrMensagem );
        //   die();
        // }
        
        if ($flgArr == false) {          
          fJSON::output($rowHomeLinks);
        }else{
          return $rowHomeLinks;
        }
    }

    public function getInterviewHome($flgArr = false) {              

        $rowInterview = array();

        $strQueryInterview = "SELECT * FROM `fid_interviews` WHERE mes = ".date('n')." and ano = ".date('Y')." and ativo = 1";
        $resultInterview = $this->_getDb()->query($strQueryInterview);
        // var_dump($strQueryInterview);
        if ($resultInterview->valid()) {
            $rowInterview[] = $resultInterview->fetchRow();
        }
        // else{
        //   $arrMensagem = array('error' => -1, 'msg' => "Não há entrevistas para serem retornados!");        
        //   fJSON::output( $arrMensagem );
        //   die();
        // }        

        if ($flgArr == false) {
          fJSON::output($rowInterview);
        }else{
          return $rowInterview;
        }          
    }

    public function getInterview($id, $flgArr = false) {              

        $rowInterview = array();

        $strQueryInterview = 'SELECT * FROM fid_interviews where id = ' . $id;
        $resultInterview = $this->_getDb()->query($strQueryInterview);
        
        if ($resultInterview->valid()) {
            $rowInterview[] = $resultInterview->fetchRow();
        }
        // else{
        //   $arrMensagem = array('error' => -1, 'msg' => "Não há entrevistas para serem retornados!");        
        //   fJSON::output( $arrMensagem );
        //   die();
        // }        

        if ($flgArr == false) {
          fJSON::output($rowInterview);
        }else{
          return $rowInterview;
        }          
    }    

    public function getInterviews($flgArr = false) {              

        $rowInterviews = array();

        $strQueryInterviews = "SELECT *, CASE WHEN mes = 1 THEN 'Janeiro' WHEN mes = 2 THEN 'Fevereiro' WHEN mes = 3 THEN 'Março' WHEN mes = 4 THEN 'Abril' WHEN mes = 5 THEN 'Maio' WHEN mes = 6 THEN 'Junho' WHEN mes = 7 THEN 'Julho' WHEN mes = 8 THEN 'Agosto' WHEN mes = 9 THEN 'Setembro' WHEN mes = 10 THEN 'Outubro' WHEN mes = 11 THEN 'Novembro' WHEN mes = 12 THEN 'Dezembro' END as mesliteral FROM fid_interviews where ativo = 1 order by mes desc, ano desc";
        $resultInterviews = $this->_getDb()->query($strQueryInterviews);
        
        if ($resultInterviews->valid()) {
          while ($resultInterviews->valid()) {
            $rowInterviews[] = $resultInterviews->fetchRow();
          }             
        }
        // else{
        //   $arrMensagem = array('error' => -1, 'msg' => "Não há entrevistas para serem retornados!");        
        //   fJSON::output( $arrMensagem );
        //   die();
        // } 

        if ($flgArr == false) {
          fJSON::output($rowInterviews);
        }else{
          return $rowInterviews;
        } 
    }

    public function getPerfil($flgArr = false) {              

        $rowHomePerfil = array();

        $strQueryHomePerfil = 'SELECT * FROM fid_home_perfil';
        $resultHomePerfil = $this->_getDb()->query($strQueryHomePerfil);
        
        if ($resultHomePerfil->valid()) {
            $rowHomePerfil[] = $resultHomePerfil->fetchRow();
        }
        // else{
        //   $arrMensagem = array('error' => -1, 'msg' => "Não há dados para serem retornados!");        
        //   fJSON::output( $arrMensagem );
        //   die();
        // } 

        if ($flgArr == false) {
          fJSON::output($rowHomePerfil);
        }else{
          return $rowHomePerfil;
        } 
    }

    //POSTS
    public function postBanner(){

      /*
      Recebe Json: 
      banner_id = Id do Banner criado no banner ftd, 
      link = link de redirecionamento do banner, 
      ordem = ordem que o banner irá aparecer no carrousel, 
      ativo = ativa ou não o banner; 0 off, 1 on, 
      periodo_ini = período que o banner estará disponível inicialmente; timestamp, 
      periodo_end = período que o banner não poderá aparecer; timestamp, 
      target = onde o banner irá abrir no navegador; 0 self, 1 blank
      */

      $data = json_decode(file_get_contents("php://input"));
      
      // var_dump($data); //die(); 

      $aSearch             = array();
      $aSearch['banner_id='] = $data->banner_id;
      $homeBanner       = fRecordSet::build('FidHomeBanner', $aSearch);
            
      if($homeBanner->count() == 1){
        // $homeBanner[0]->setBannerId(null);
        $homeBanner[0]->setUpdatedAt(date('Y-m-d H:i:s'));
        $homeBanner[0]->store(); 
        $arrMensagem = array('error' => 0, 'msg' => "Alterado com sucesso!");
        fJSON::output( $arrMensagem );        
        die();        
      }

      $homeBanner = new FidHomeBanner();
  
      try {
        
        
        $homeBanner->setBannerId($data->banner_id);
        $homeBanner->setLink($data->link);
        $homeBanner->setOrdem($data->ordem);
        $homeBanner->setAtivo($data->ativo);
        $homeBanner->setPeriodoIni($data->periodo_ini);
        $homeBanner->setPeriodoEnd($data->periodo_end);
        $homeBanner->setTarget($data->target);
        $homeBanner->store();        

        $arrMensagem = array('error' => 0, 'msg' => "Incluído com sucesso!");
        fJSON::output( $arrMensagem );        
        die();
      } catch (fValidationException $e) {        
        $arrMensagem = array('error' => -1, 'msg' => "Erro na inclusão");        
        fJSON::output( $arrMensagem );
        die();
      }

    }

    public function uploadS3(){
      
      $filedata           = array();

      $type = explode('/', $_FILES['file']['type']);
      
      if($type[0] == 'image'){
        $path = 'image';
        $filedata["type"]   = $type[1];
      }else{
        $path = 'audio';
        $filedata["type"]   = $type[1];
      }
      $filePath = $_FILES['file']['tmp_name'];
      
      $fileName = $_FILES['file']['name'];      
      $filedata["uri"]    = $path.'/'.$fileName;
      $uploader           = new ftdCmsUpload();

      $result             = $uploader->storeObject($filePath, $filedata);
      // $result['url']  

      $arrMensagem = array('error' => 0, 'type' => $path, 'msg' => "Upload feito com sucesso!", 'url' => $result['url']);
      fJSON::output( $arrMensagem ); 

    }

    public function postS3($file){
      // var_dump($file);
      
      $filedata           = array();
      
      $type = explode('/', $file['type']);
      
      if($file['type'] == 'image/jpeg'){
        $path = 'image';
        $filedata["type"]   = $type[1];
      }else{
        $path = 'audio';
        $filedata["type"]   = $type[1];
      }
      $filePath = $file['tmp_name'];
      
      $fileName = $file['name'];      
      $filedata["uri"]    = $path.'/'.$fileName;
      $uploader           = new ftdCmsUpload();
      $result             = $uploader->storeObject($filePath, $filedata);
      // $result['url']  

      return $result['url'];

    }

    public function postInterview(){

      // include realpath(dirname(__FILE__)) . '/../../libs/S3/ftdCapacitacaoUpload.php';
      // $uploader = new ftdCapacitacaoUpload();
      // $filedata           = array();
      // $filedata["type"]   = 'pdf';
      // $filedata["uri"]    = 'certificado/'.$fileName; //gerar filename randomico / timestamp
      // $uploader           = new ftdCapacitacaoUpload();
      // $result             = $uploader->storeObject($filePath, $filedata);
      // $result['url']  
      /*
      Recebe $_FILES, $_POST: 
      banner_id = Id do Banner criado no banner ftd, 
      link = link de redirecionamento do banner, 
      ordem = ordem que o banner irá aparecer no carrousel, 
      ativo = ativa ou não o banner; 0 off, 1 on, 
      periodo_ini = período que o banner estará disponível inicialmente; timestamp, 
      periodo_end = período que o banner não poderá aparecer; timestamp, 
      target = onde o banner irá abrir no navegador; 0 self, 1 blank
      */
      // $data = json_decode(file_get_contents("php://input"));
      // var_dump($data);
      // var_dump($_FILES);

      // foreach ($_FILES as $value) {
         
      //     $type = explode('/', $value['type']);
          
      //     $url = $this->postS3($value);

      //     if($type[0] == 'image'){            
      //       $imagem = $url;
      //     }else{
      //       $audio = $url;
      //     }
      // }
      $data = json_decode(file_get_contents("php://input"));

      // var_dump($data);      
      // die();
      $homeInterview = new FidInterviews();
      // var_dump($data);      
      // die();
      // a imagem e o aúdio será feita através do upload no S3 da amazon
      $homeInterview->setImagem($data->imagem);
      $homeInterview->setMes($data->mes);
      $homeInterview->setAno($data->ano);
      $homeInterview->setEntrevistado($data->entrevistado);
      $homeInterview->setOlho($data->olho);
      $homeInterview->setAudio($data->audio);
      $homeInterview->setDescricao($data->descricao);  

      try {        
        $homeInterview->store();        
        $arrMensagem = array('error' => 0, 'msg' => "Entrevista incluída com sucesso!");
        fJSON::output( $arrMensagem );        
        die();
      } catch (fValidationException $e) {        
        $arrMensagem = array('error' => -1, 'msg' => "Erro na inclusão");        
        fJSON::output( $arrMensagem );
        die();
      }

    }

    public function postLinkGroup(){
      $data = json_decode(file_get_contents("php://input"));
      // var_dump($data);
      // die();

      $dataFormated = explode('-', $data->data);
      $dataFormated = $dataFormated[2].'-'.$dataFormated[1].'-'.$dataFormated[0];

      $homeLinksGroup = new FidHomeShortlinkGroup();
            
      try {        
        $homeLinksGroup->setDate($dataFormated);
        $homeLinksGroup->setName($data->name);
        $id_group = $homeLinksGroup->store();   
           
        $arrMensagem = array('error' => 0, 'msg' => "Incluído com sucesso!", 'id' => $id_group->getId());
        fJSON::output( $arrMensagem );        
        die();
      } catch (fValidationException $e) {        
        $arrMensagem = array('error' => -1, 'msg' => "Erro na inclusão");        
        fJSON::output( $arrMensagem );
        die();
      }
    }

    public function postLink(){
      /*
      jason: 
      link = encurtado da encubadora de links SIAL, 
      ordem = ordem que o link irá aparecer na listagem, 
      ativo = ativa ou não o link; 0 off, 1 on,       
      */

      $data = json_decode(file_get_contents("php://input"));
      // var_dump($data);
            
      $homeLinks = new FidHomeShortlink();
            
      try {        
        $homeLinks->setShortLinkCode($data->short_link_code);
        $homeLinks->setThumbnailUrl($data->thumbnail_url);    
        $homeLinks->setTitle($data->title);    
        $homeLinks->setHomeShortlinkGroupId($data->id);    
        $homeLinks->store();        

        $arrMensagem = array('error' => 0, 'msg' => "Incluído com sucesso!");
        fJSON::output( $arrMensagem );        
        die();
      } catch (fValidationException $e) {        
        $arrMensagem = array('error' => -1, 'msg' => "Erro na inclusão");        
        fJSON::output( $arrMensagem );
        die();
      }
    }

    public function postDigitalItem(){

      $data = json_decode(file_get_contents("php://input"));      
      // var_dump($data);
      // die();
      $dataFormated = explode('/', $data->periodo_ini);
      $dataFormated = $dataFormated[2].'-'.$dataFormated[1].'-'.$dataFormated[0];
      // var_dump($dataFormated);
      // die();
      $homeDigitalItem = new FidHomeDigitalItem();
  
      try {        
        $homeDigitalItem->setDigitalItemId($data->selected->id);
        $homeDigitalItem->setPeriodoIni($dataFormated);        
        $homeDigitalItem->store();        

        $arrMensagem = array('error' => 0, 'msg' => "Incluído com sucesso!");
        fJSON::output( $arrMensagem );        
        die();
      } catch (fValidationException $e) {        
        $arrMensagem = array('error' => -1, 'msg' => "Erro na inclusão");        
        fJSON::output( $arrMensagem );
        die();
      }
    }

    //PUTS
    public function putBanner($id){
      
      $request = $this->_slimApp->request()->getBody();
      $campos = json_decode($request);        
      // var_dump($campos);
      // die();
      $homeBanner = new FidHomeBanner($campos->id);
      
      if(property_exists($campos, 'banner_id')){
        $homeBanner->setBannerId($campos->banner_id);
      }
      if(property_exists($campos, 'vinculo')){
        $homeBanner->setVinculo($campos->vinculo);
      }
      if(property_exists($campos, 'link')){
        $homeBanner->setLink($campos->link);
      }
      if(property_exists($campos, 'ordem')){
        $homeBanner->setOrdem($campos->ordem);
      }
      if(property_exists($campos, 'ativo')){
        $homeBanner->setAtivo($campos->ativo);
      }
      if(property_exists($campos, 'periodo_ini')){
        $homeBanner->setPeriodoIni($campos->periodo_ini);
      }
      if(property_exists($campos, 'periodo_end')){
        $homeBanner->setPeriodoEnd($campos->periodo_end);
      }
      if(property_exists($campos, 'target')){
        $homeBanner->setTarget($campos->target);
      }

      try {
        $homeBanner->setUpdatedAt(date('Y-m-d H:i:s'));        
        $homeBanner->store();        

        $arrMensagem = array('error' => 0, 'msg' => "Alterado com sucesso!");
        fJSON::output( $arrMensagem );        
        die();
      } catch (fValidationException $e) {        
        $arrMensagem = array('error' => -1, 'msg' => "Erro na inclusão");        
        fJSON::output( $arrMensagem );
        die();
      }

    }

    public function putDigitalItem($id){

      $request = $this->_slimApp->request()->getBody();
      $campos = json_decode($request);
      // var_dump($campos);
      $dataFormated = explode('/', $campos->periodoiniformat);
      $dataFormated = $dataFormated[2].'-'.$dataFormated[1].'-'.$dataFormated[0];
      // var_dump($dataFormated);
      // die();
      $homeDigitalItem = new FidHomeDigitalItem($id);
      
      if(property_exists($campos, 'digital_item_id')){
        $homeDigitalItem->setDigitalItemId($campos->digital_item_id);
      }
      if(property_exists($campos, 'periodo_ini')){
        $homeDigitalItem->setPeriodoIni($dataFormated);
      }
      if(property_exists($campos, 'ativo')){
        $homeDigitalItem->setAtivo($campos->ativo);
      }

      try {        
        $homeDigitalItem->store();        

        $arrMensagem = array('error' => 0, 'msg' => "Alterado com sucesso!");
        fJSON::output( $arrMensagem );        
        die();
      } catch (fValidationException $e) {        
        $arrMensagem = array('error' => -1, 'msg' => "Erro na inclusão");        
        fJSON::output( $arrMensagem );
        die();
      }

    }


    public function putInterview($id){
      
      $request = $this->_slimApp->request()->getBody();
      $campos = json_decode($request);
      // var_dump($campos);
      // die();            
      $homeBanner = new FidInterviews($id);

      if(property_exists($campos, 'data')){
        if($campos->data != ''){
          $datas = explode("/", $campos->data);
          $mes = $datas[0];
          $ano = $datas[1];  
        }        
      }

      if(property_exists($campos, 'imagem')){
        $homeBanner->setImagem($campos->imagem);
      }
      if(property_exists($campos, 'audio')){
        $homeBanner->setAudio($campos->audio);
      }

      if(property_exists($campos, 'mes')){
        if($campos->data != ''){
          if($mes != ''){
            $homeBanner->setMes($mes);  
          }else{
            $homeBanner->setMes($campos->mes);  
          }        
        }
      }

      if(property_exists($campos, 'ano')){
        if($campos->data != ''){
          if($ano != ''){
            $homeBanner->setAno($ano);  
          }else{
            $homeBanner->setAno($campos->ano);
          }         
        }
      }
      if(property_exists($campos, 'entrevistado')){
        $homeBanner->setEntrevistado($campos->entrevistado);
      }
      if(property_exists($campos, 'olho')){
        $homeBanner->setOlho($campos->olho);
      }
      if(property_exists($campos, 'descricao')){
        $homeBanner->setDescricao($campos->descricao);
      }
      if(property_exists($campos, 'ativo')){
        $homeBanner->setAtivo($campos->ativo);
      }      

      try {
        // $homeBanner->setUpdatedAt(date('Y-m-d H:i:s'));        
        $homeBanner->store();        

        $arrMensagem = array('error' => 0, 'msg' => "Alterado com sucesso!");
        fJSON::output( $arrMensagem );        
        die();
      } catch (fValidationException $e) {        
        $arrMensagem = array('error' => -1, 'msg' => "Erro na inclusão");        
        fJSON::output( $arrMensagem );
        die();
      }

    }

    public function putShortLink($id){

      $request = $this->_slimApp->request()->getBody();
      $campos = json_decode($request);
      // var_dump($campos);      
      // die();
      $homeDigitalItem = new FidHomeShortlink($id);
      
      if(property_exists($campos, 'short_link_code')){
        $homeDigitalItem->setShortLinkCode($campos->short_link_code);
      }
      if(property_exists($campos, 'title')){
        $homeDigitalItem->setTitle($campos->title);
      }
      if(property_exists($campos, 'thumbnail_url')){
        $homeDigitalItem->setThumbnailUrl($campos->thumbnail_url);
      }
      if(property_exists($campos, 'ativo')){
        $homeDigitalItem->setAtivo($campos->ativo);
      }

      try {        
        $homeDigitalItem->store();        

        $arrMensagem = array('error' => 0, 'msg' => "Alterado com sucesso!");
        fJSON::output( $arrMensagem );        
        die();
      } catch (fValidationException $e) {        
        $arrMensagem = array('error' => -1, 'msg' => "Erro na inclusão");        
        fJSON::output( $arrMensagem );
        die();
      }

    }

    public function putGroupShortLink($id){

      $request = $this->_slimApp->request()->getBody();
      $campos = json_decode($request);
      // var_dump($campos);      
      // die();
      $homeDigitalItem = new FidHomeShortlinkGroup($id);
      
      if(property_exists($campos, 'date')){
        $homeDigitalItem->setDate($campos->date);
      }
      if(property_exists($campos, 'name')){
        $homeDigitalItem->setName($campos->name);
      }      
      if(property_exists($campos, 'ativo')){
        $homeDigitalItem->setAtivo($campos->ativo);
      }

      try {        
        $homeDigitalItem->store();        

        $arrMensagem = array('error' => 0, 'msg' => "Alterado com sucesso!");
        fJSON::output( $arrMensagem );        
        die();
      } catch (fValidationException $e) {        
        $arrMensagem = array('error' => -1, 'msg' => "Erro na inclusão");        
        fJSON::output( $arrMensagem );
        die();
      }

    }

    public function putPerfil($id){

      $request = $this->_slimApp->request()->getBody();
      $campos = json_decode($request);

      $homePerfil = new FidHomePerfil($id);
      
      if(property_exists($campos, 'nome')){
        $homePerfil->setNome($campos->nome);
      }
      if(property_exists($campos, 'sexo')){
        $homePerfil->setSexo($campos->sexo);
      }
      if(property_exists($campos, 'tipo_usuario')){
        $homePerfil->setTipoUsuario($campos->tipo_usuario);
      }
      if(property_exists($campos, 'data_nascimento')){
        $homePerfil->setDataNascimento($campos->data_nascimento);
      }
      if(property_exists($campos, 'cep')){
        $homePerfil->setCep($campos->cep);
      }
      if(property_exists($campos, 'foto')){
        $homePerfil->setFoto($campos->foto);
      }
      if(property_exists($campos, 'redes_sociais')){
        $homePerfil->setRedesSociais($campos->redes_sociais);
      }
      if(property_exists($campos, 'instituicoes')){
        $homePerfil->setInstituicoes($campos->instituicoes);
      }

      try {
        // $homePerfil->setUpdatedAt(date('Y-m-d H:i:s'));        
        $homePerfil->store();        

        $arrMensagem = array('error' => 0, 'msg' => "Alterado com sucesso!");
        fJSON::output( $arrMensagem );        
        die();
      } catch (fValidationException $e) {        
        $arrMensagem = array('error' => -1, 'msg' => "Erro na inclusão");        
        fJSON::output( $arrMensagem );
        die();
      }

    }
}
