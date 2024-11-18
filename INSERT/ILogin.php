// ILogin.php
<?php
include("../mvc/Controlador/Controlador.php"); // Asegúrate de incluir correctamente la ruta

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Obtener datos del formulario
    $email = $_POST['email'];
    $password = $_POST['password'];

    // Conectar a la base de datos
    $conn = Conectar();

    // Consulta para verificar usuario
    $sql = "SELECT * FROM users WHERE email = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        // Verificar la contraseña
        if (password_verify($password, $user['password'])) {
            // Las credenciales son correctas
            // Redirigir según el rol
            switch ($user['role']) {
                case 'admin':
                    header("Location: ../vistas_admin/panelAdmin.html");
                    break;
                case 'cliente':
                    header("Location: ../vistas_usuarios/menu.html");
                    break;
                case 'cocinero':
                case 'camarero':
                    header("Location: ../vistas_admin/pedidos.html");
                    break;
                default:
                    echo "<script>alert('Rol desconocido.'); window.history.back();</script>";
                    break;
            }
            exit(); // Asegúrate de salir después de la redirección
        } else {
            // La contraseña es incorrecta
            echo "<script>alert('Correo electrónico o contraseña incorrectos.'); window.history.back();</script>";
        }
    } else {
        // El correo electrónico no existe
        echo "<script>alert('Correo electrónico o contraseña incorrectos.'); window.history.back();</script>";
    }

    $stmt->close();
    $conn->close();
} else {
    header('Location: ./registro.php'); // Redirigir si no se envió el formulario
    exit();
}
?>
