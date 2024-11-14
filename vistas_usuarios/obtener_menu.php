<?php
// Conexión a la base de datos
include("../mvc/Controlador/Controlador.php");

// Establecer conexión
$Con = Conectar();

// Verificar la conexión
if ($Con->connect_error) {
    die("Conexión fallida: " . $Con->connect_error);
}
function obtenerMenuAgrupado($Con) {   
    // Agrupar ítems por categoría
    $grouped_menu_items = [
        'plato_principal' => [],
        'postre' => [],
        'bebida' => []
    ];

    // Obtener los elementos del menú
    $sql = "SELECT * FROM menu_items ORDER BY category;";
    $result = $Con->query($sql);

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $grouped_menu_items[$row['category']][] = $row;
        }
    }

    return $grouped_menu_items;
}

// Cerrar conexión
Desconectar($Con);
?>
