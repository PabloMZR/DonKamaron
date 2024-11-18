<?php
// archivo: procesar_orden.php
include("../mvc/Controlador/Controlador.php");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // Depuración: Mostrar los datos recibidos
    echo("Datos recibidos: " . print_r($_POST, true));

    $carrito = json_decode($_POST['carrito'], true); // Convertir el carrito JSON a un array
    $user_id = intval($_POST['user_id']); // ID del usuario
    $total = floatval($_POST['total']); // Total de la orden

    // Verifica que los datos básicos estén presentes
    if (!empty($carrito) && $user_id > 0 && $total > 0) {
        // Conectar a la base de datos
        $Con = Conectar();
        $status = 'pendiente'; // Estado inicial de la orden

        // Insertar la orden en la tabla orders
        $sqlOrder = "INSERT INTO orders (user_id, status, total) VALUES ('$user_id', '$status', '$total');";
        echo $sqlOrder;
        if (Ejecutar($Con, $sqlOrder)) {
            // Obtener el ID de la última orden insertada
            $order_id = mysqli_insert_id($Con);

            // Insertar cada elemento del carrito en la tabla order_items
            foreach ($carrito as $item) {
                $menu_item_id = isset($item['menu_item_id']) ? $item['menu_item_id'] : null;
                $quantity = isset($item['cantidad']) ? $item['cantidad'] : null;
                $price = isset($item['precio']) ? $item['precio'] : null;

                if ($menu_item_id === null || $quantity === null || $price === null) {
                    error_log("Datos incompletos del producto en el carrito: " . json_encode($item));
                    continue;
                }

                $sqlOrderItem = "INSERT INTO order_items (order_id, menu_item_id, quantity, price) 
                     VALUES ('$order_id', '$menu_item_id', '$quantity', '$price')";
                    echo $sqlOrderItem;
                if (!Ejecutar($Con, $sqlOrderItem)) {
                    error_log("Error al guardar el item en order_items: " . mysqli_error($Con));
                }
            }

            echo "Orden y detalles guardados con éxito. ID de la orden: " . $order_id;

        } else {
            echo "Error al guardar la orden.";
        }

        // Desconectar de la base de datos
        Desconectar($Con);
    } else {
        echo "Datos incompletos.";
    }
}

?>
