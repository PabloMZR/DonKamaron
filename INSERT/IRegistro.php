<?php
// IRegistro.php
include("../mvc/Controlador/Controlador.php"); // Asegúrate de incluir correctamente la ruta

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $name = $_POST['name'];
    $email = $_POST['email'];
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT);
    
    // Asignar rol basado en el correo electrónico
    $role = (strpos($email, '@donkamaron.com') !== false) ? 'camarero' : 'cliente';

    // Construir la consulta SQL
    $SQL = "INSERT INTO users (name, email, password, role) VALUES ('$name', '$email', '$password', '$role');";
    print($SQL);  // Esto es solo para depuración; puedes eliminarlo más tarde.

    // Enviar datos al Controlador
    $Con = Conectar();
    $ResultSet = Ejecutar($Con, $SQL);
    Desconectar($Con); // Llama a la función Desconectar()

    // Mensaje de éxito o error
    if ($ResultSet) {
        echo "<script>alert('Registro exitoso.'); window.location.href='index.php';</script>";
    } else {
        echo "<script>alert('Error en el registro.'); window.location.href='registro.php';</script>";
    }
} else {
    header('Location: ./registro.php'); // Redirigir si no se envió el formulario
    exit();
}
?>
