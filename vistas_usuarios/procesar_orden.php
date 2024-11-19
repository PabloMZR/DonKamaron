<?php
// archivo: procesar_orden.php
// Conexión a la base de datos
session_start();
include("../mvc/Controlador/Controlador.php");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    header('Content-Type: application/json'); // Asegurar que la respuesta sea JSON

    $carrito = json_decode($_POST['carrito'], true); // Convertir el carrito JSON a un array
    $user_id = $_SESSION["id"];
    $total = floatval($_POST['total']); // Total de la orden

    if (!empty($carrito) && $user_id > 0 && $total > 0) {
        // Conectar a la base de datos
        $Con = Conectar();
        $status = 'pendiente'; // Estado inicial de la orden

        // Insertar la orden en la tabla orders
        $sqlOrder = "INSERT INTO orders (user_id, status, total) VALUES ('$user_id', '$status', '$total')";
        
        if (Ejecutar($Con, $sqlOrder)) {
            // Obtener el ID de la última orden insertada
            $order_id = mysqli_insert_id($Con);

            // Insertar cada elemento del carrito en la tabla order_items
            foreach ($carrito as $item) {
                $menu_item_id = intval($item['id']);
                $quantity = intval($item['cantidad']);
                $price = floatval($item['precio']);
            
                $sqlOrderItem = "INSERT INTO order_items (order_id, menu_item_id, quantity, price) 
                                 VALUES ('$order_id', '$menu_item_id', '$quantity', '$price')";
            
                if (!Ejecutar($Con, $sqlOrderItem)) {
                    echo json_encode([
                        'success' => false,
                        'message' => "Error al guardar el item: " . $item['nombre']
                    ]);
                    exit; // Detener el script en caso de error
                }
            }

            // Respuesta exitosa
            echo json_encode([
                'success' => true,
                'message' => "Orden y detalles guardados con éxito.",
                'order_id' => $order_id
            ]);
        } else {
            // Error al insertar la orden
            echo json_encode([
                'success' => false,
                'message' => "Error al guardar la orden."
            ]);
        }
    } else {
        // Datos inválidos
        echo json_encode([
            'success' => false,
            'message' => "Datos del carrito o del usuario inválidos."
        ]);
    }
} else {
    // Método no permitido

    echo json_encode([
        'success' => false,
        'message' => "Método no permitido."
    ]);    
    Desconectar($Con);
}

?>