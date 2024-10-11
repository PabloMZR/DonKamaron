<?php
    include("Controlador.php");

    $Con = Conectar();
    $SQL ="SELECT * FROM Conductores;";
    $ResultSet = Ejecutar($Con, $SQL);

    Desconectar($Con);
?>