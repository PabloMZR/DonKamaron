<?php
// Datos de conexión a la base de datos
$host = 'localhost';
$dbname = 'DonKamaron';
$username = 'root';
$password = '';

// Obtén el correo del formulario y sanitízalo
$email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);

try {
    // Conexión a la base de datos usando PDO
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Verifica si el correo es válido
    if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
        // Prepara la consulta SQL para obtener el rol del usuario
        $stmt = $pdo->prepare("SELECT role FROM users WHERE email = :email");
        $stmt->bindParam(':email', $email);
        $stmt->execute();
        
        // Verifica si se encontró el usuario
        if ($stmt->rowCount() > 0) {
            // Obtén el rol del usuario
            $usuario = $stmt->fetch(PDO::FETCH_ASSOC);
            $rol = $usuario['role'];
            
            // Redirige según el rol del usuario
            if ($rol === 'admin') {
                echo "<h3>Bienvenido, Administrador</h3>";
                // Redirigir a la página de administración
                // header('Location: admin_dashboard.php');
                // exit();
            } elseif ($rol === 'camarero') {
                echo "<h3>Bienvenido, Camarero</h3>";
                // Redirigir a la página de camarero
                // header('Location: camarero_dashboard.php');
                // exit();
            } elseif ($rol === 'cocinero') {
                echo "<h3>Bienvenido, Cocinero</h3>";
                // Redirigir a la página de cocinero
                // header('Location: cocinero_dashboard.php');
                // exit();
            } elseif ($rol === 'cliente') {
                echo "<h3>Bienvenido, Cliente</h3>";
                // Redirigir a la página de cliente
                // header('Location: cliente_dashboard.php');
                // exit();
            }
        } else {
            echo "<h3>Acceso Denegado: Usuario no encontrado</h3>";
            // Redirigir a una página de error
            // header('Location: acceso_denegado.php');
            // exit();
        }
    } else {
        echo "<h3>Correo inválido</h3>";
    }

} catch (PDOException $e) {
    echo "Error en la conexión: " . $e->getMessage();
}

?>
