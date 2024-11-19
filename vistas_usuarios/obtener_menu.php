<?php
// Conexión a la base de datos
include("../mvc/Controlador/Controlador.php");

// Establecer conexión
$Con = Conectar();

// Verificar la conexión
if ($Con->connect_error) {
    die("Conexión fallida: " . $Con->connect_error);
}
function obtenerMenuAgrupado($Con)
{
    $grouped_menu_items = [
        'plato_principal' => [],
        'postre' => [],
        'bebida' => []
    ];

    $stmt = $Con->prepare("SELECT * FROM menu_items ORDER BY category");
    $stmt->execute();
    $result = $stmt->get_result();

    while ($row = $result->fetch_assoc()) {
        if (isset($grouped_menu_items[$row['category']])) {
            $grouped_menu_items[$row['category']][] = $row;
        }
    }

    $stmt->close();
    return $grouped_menu_items;
}

// Cerrar conexión
Desconectar($Con);
