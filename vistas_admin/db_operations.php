<?php
// Database Connection
include("../mvc/Controlador/Controlador.php");

// Establecer conexión
$Con = Conectar(); // Asegúrate de que la función Conectar() esté definida

// Function to get all orders
function getOrders() {
    global $Con;
    $sql = "SELECT * FROM orders";
    $result = $Con->query($sql);
    $orders = [];
    if ($result && $result->num_rows > 0) { // Asegúrate de que la consulta fue exitosa
        while($row = $result->fetch_assoc()) {
            $orders[] = $row;
        }
    }
    return json_encode($orders);
}

// Function to get all users
function getUsers() {
    global $Con;
    $sql = "SELECT id, name, email, role FROM users";
    $result = $Con->query($sql);
    $users = [];
    if ($result && $result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $users[] = $row;
        }
    }
    return json_encode($users);
}

// Function to get all menu items
function getMenuItems() {
    global $Con;
    $sql = "SELECT * FROM menu_items";
    $result = $Con->query($sql);
    $menuItems = [];
    if ($result && $result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $menuItems[] = $row;
        }
    }
    return json_encode($menuItems);
}
// Function to delete user
function deleteUser($id) {
    global $Con;
    $sql = "DELETE FROM users WHERE id = ?";
    $stmt = $Con->prepare($sql);
    if ($stmt === false) {
        return json_encode(["success" => false, "error" => $Con->error]);
    }

    $stmt->bind_param("i", $id);
    $result = $stmt->execute();
    $stmt->close();

    return json_encode(["success" => $result, "error" => $Con->error]);
}

function deleteMenuItem($id) {
    global $Con;
    $sql = "DELETE FROM menu_items WHERE id = ?";
    $stmt = $Con->prepare($sql);
    if ($stmt === false) {
        return json_encode(["success" => false, "error" => $Con->error]);
    }

    $stmt->bind_param("i", $id);
    $result = $stmt->execute();
    $stmt->close();

    return json_encode(["success" => $result, "error" => $Con->error]);
}
// Function to add a user
function addUser($usuario) {
    global $Con;
    $sql = "INSERT INTO users (name, email, role) VALUES (?, ?, ?)";
    $stmt = $Con->prepare($sql);
    if ($stmt === false) {
        return json_encode(["success" => false, "error" => $Con->error]);
    }

    $stmt->bind_param("sss", $usuario['name'], $usuario['email'], $usuario['role']);
    $result = $stmt->execute();
    $stmt->close();

    return json_encode(["success" => $result, "error" => $Con->error]);
}

// Function to edit a user
function editUser($usuario) {
    global $Con;
    $sql = "UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?";
    $stmt = $Con->prepare($sql);
    if ($stmt === false) {
        return json_encode(["success" => false, "error" => $Con->error]);
    }

    $stmt->bind_param("sssi", $usuario['name'], $usuario['email'], $usuario['role'], $usuario['id']);
    $result = $stmt->execute();
    $stmt->close();

    return json_encode(["success" => $result, "error" => $Con->error]);
}

// Agregar al manejo de solicitudes
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (isset($data['action'])) {
        switch ($data['action']) {
            case 'addUser':
                echo addUser($data['usuario']);
                break;
            case 'editUser':
                echo editUser($data['usuario']);
                break;
            default:
                echo json_encode(["success" => false, "error" => "Acción inválida"]);
        }
    } else {
        echo json_encode(["success" => false, "error" => "No se proporcionó ninguna acción"]);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
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
            case 'deleteUser':
                if (isset($_GET['id'])) {
                    echo deleteUser($_GET['id']);
                } else {
                    echo json_encode(["success" => false, "error" => "ID no proporcionado"]);
                }
                break;
            case 'deleteMenuItem':
                if (isset($_GET['id'])) {
                    echo deleteMenuItem($_GET['id']);
                } else {
                    echo json_encode(["success" => false, "error" => "ID no proporcionado"]);
                }
                break;
            default:
                echo json_encode(["error" => "Acción inválida"]);
        }
    }
} else {
    echo json_encode(["success" => false, "error" => "Método no permitido"]);
}

$Con->close();

?>
