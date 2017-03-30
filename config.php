<?php

// passa a variavel do ORACLE_HOME    putenv("ORACLE_HOME=/usr/local/apache/oracle_home");
putenv("ORACLE_HOME=/opt/oracle/920/oracle_home");
// passa a variavel do Oracle_SID
//putenv("ORACLE_SID=fare");

$user="simah"; // seta o usuario
$senha="simah"; // seta a senha
$banco="(DESCRIPTION=
          (ADDRESS_LIST=
            (ADDRESS=(PROTOCOL=TCP)
              (HOST=sdl-dbo-03.dev.marabraz.com)(PORT=1521)
            )
          )
          (CONNECT_DATA=(SERVICE_NAME=dfares))
        )";  // configuracoes do banco (isso muda um pouco no oracle)

// neste caso usei o HOST como local "127.0.0.1"
// e o nome do banco em SERVICE_NAME como sendo melancia_legal
// somente para ficar mais f???????l de enxergar o que deve ser alterado.

if ($conexao = ocilogon($user,$senha,$banco)) {
	 echo "Conexão bem sucedida.<br><br><br>";
} else {
   echo "Erro na conexao com o Oracle.<br><br><br>";
}


?>
