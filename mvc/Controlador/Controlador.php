<?php
// conexion.php

function Conectar() {
    $User = "root";
    $Server = "127.0.0.1";
    $Password = "";
    $BD = "donkamaron";

    $Con = mysqli_connect($Server, $User, $Password, $BD);
    // Verificar que exista conexión
    if (!$Con) {
        die("Error de conexión: " . mysqli_connect_error());
    }
    return $Con;
}

function Ejecutar($Con, $SQL) {
    $ResultSet = mysqli_query($Con, $SQL);
    // Verificar si la consulta fue exitosa
    if (!$ResultSet) {
        die("Error en la consulta: " . mysqli_error($Con));
    }
    return $ResultSet;
}

function Desconectar($Con) {
    mysqli_close($Con); // Cierra la conexión
}
?>
