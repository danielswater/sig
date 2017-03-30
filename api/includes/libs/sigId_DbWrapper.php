<?php

class sigId_DbWrapper
{
    private $db;
    private $categories;

    private $cache_initialized = false;

    function sigId_DbWrapper($database, $initcache = false)
    {
        $this->db = $database;
        if ($initcache) {
            $this->buildCache();
        }
    }

    private function buildCache()
    {
        //Cache book tables that are almost static, to simplify the later queries
        $this->categories = array();
        $result = $this->db->query('SELECT id, name AS "nome" FROM ct_categories');
        foreach ($result as $onevalue) {
            $this->categories[$onevalue['id']] = $onevalue;
        }        

        $this->cache_initialized = true;
    }

    public function ensureCache()
    {
        if (!$this->cache_initialized) {
            $this->buildCache();
        }
    }

    public function getDb()
    {
        return $this->db;
    }

    
    private function arrayToIn($array)
    {
        $str = "'" . implode("', '", $array) . "'";
        return $str;
    }
}
