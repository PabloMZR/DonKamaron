<?php
// Database connection
include("../mvc/Controlador/Controlador.php"); // Asegúrate de incluir correctamente la ruta

// Function to get all orders
function getOrders() {
    global $conn;
    $sql = "SELECT * FROM orders";
    $result = $conn->query($sql);
    $orders = [];
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $orders[] = $row;
        }
    }
    return json_encode($orders);
}

// Function to get all users
function getUsers() {
    global $conn;
    $sql = "SELECT id, name, email, role FROM users";
    $result = $conn->query($sql);
    $users = [];
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $users[] = $row;
        }
    }
    return json_encode($users);
}

// Function to get all menu items
function getMenuItems() {
    global $conn;
    $sql = "SELECT * FROM menu_items";
    $result = $conn->query($sql);
    $menuItems = [];
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $menuItems[] = $row;
        }
    }
    return json_encode($menuItems);
}

// Handle requests
if (isset($_GET['action'])) {
    switch ($_GET['action']) {
        case 'getOrders':
            echo getOrders();
            break;
        case 'getUsers':
            echo getUsers();
            break;
        case 'getMenuItems':
            echo getMenuItems();
            break;
        default:
            echo json_encode(["error" => "Invalid action"]);
    }
}

$conn->close();
?>