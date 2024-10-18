<?php
// Datos de conexión a la base de datos
$host = 'localhost';
$dbname = 'DonKamaron';
$username = 'root';
$password_db = '';

// Obtén los datos del formulario y sanitízalos
$name = filter_var($_POST['name'], FILTER_SANITIZE_STRING);
$email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
$password = $_POST['password'];

// Función para asignar el rol automáticamente según la terminación del correo
function obtenerRolPorCorreo($email) {
    if (strpos($email, '@DonKamaron.com' || '@donkamaron.com' || '@admin.com'||'@administrador.com') !== false) {
        return 'admin';

    } elseif (strpos($email, '@camarero.com') !== false) {
        return 'camarero';
    } elseif (strpos($email, '@cocinero.com') !== false) {
        return 'cocinero';
    } else {
        return 'cliente'; // Si no coincide, asigna el rol de 'cliente'
    }
}

// Asigna el rol según la terminación del correo
$role = obtenerRolPorCorreo($email);

// Si no se pudo determinar el rol, muestra un mensaje de error
if ($role === null) {
    die("Error: No se pudo asignar un rol basado en la terminación del correo.");
}

try {
    // Conexión a la base de datos usando PDO
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password_db);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Verifica si el correo es válido
    if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
        // Hashea la contraseña
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);

        // Prepara la consulta SQL para insertar el nuevo usuario
        $stmt = $pdo->prepare("INSERT INTO users (name, email, password, role) 
                               VALUES (:name, :email, :password, :role)");
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':password', $hashed_password);
        $stmt->bindParam(':role', $role);

        // Ejecuta la consulta
        if ($stmt->execute()) {
            echo "<h3>Usuario registrado exitosamente con el rol: " . $role . "</h3>";
            // Redirigir a la página de inicio de sesión
            // header('Location: login.php');
        } else {
            echo "<h3>Error al registrar el usuario</h3>";
        }
    } else {
        echo "<h3>Correo no válido</h3>";
    }

} catch (PDOException $e) {
    echo "Error en la conexión: " . $e->getMessage();
}
?>
