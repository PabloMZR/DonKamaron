<?php
session_start();
// Conexión a la base de datos
include("../mvc/Controlador/Controlador.php");

$Con = Conectar();
// Consulta para obtener las reseñas
$query = "SELECT * FROM resena ORDER BY Fecha DESC LIMIT 6";
$reviewsResult = Ejecutar($Con, $query);

// Comprobamos si el formulario fue enviado
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Recoger los datos del formulario
    $userId = $_SESSION["id"];
    $menuItemId = $_POST['menu_item_id'];
    $rating = $_POST['rating'];
    $comment = $_POST['comment'];

    // Insertar la reseña en la base de datos
    $insertQuery = "INSERT INTO reviews (user_id, menu_item_id, rating, comment) 
                    VALUES ($userId, $menuItemId, $rating, '$comment')";
    Ejecutar($Con, $insertQuery);

    echo "<script>alert('Reseña enviada con éxito.');</script>";
}
Desconectar($Con);
?>

<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reseña de Platillo</title>
    <link rel="stylesheet" href="stylesReview.css">
</head>

<body>

    <div class="header">
        <nav>
            <a href="#"> Bienvenido <?php echo $_SESSION["nombre"] ?></a>
            <a href="index.php">Seguir Comprando</a>
            <a href="cerrar_session.php">Salir</a>
        </nav>
    </div>
    <div class="form-container">
        <h1>Escribe tu reseña</h1>
        <form method="POST">
            <?php echo $_SESSION["nombre"] ?>
            <br><br>
            <label for="menu_item_id">Selecciona un Platillo:</label>
            <select id="menu_item_id" name="menu_item_id" required>
                <?php
                $Con = Conectar();
                // Obtener los platillos disponibles
                $menuItemsQuery = "SELECT id, name FROM menu_items";
                $menuItemsResult = Ejecutar($Con, $menuItemsQuery);
                while ($row = mysqli_fetch_assoc($menuItemsResult)) {
                    echo "<option value='{$row['id']}'>{$row['name']}</option>";
                }
                Desconectar($Con);
                ?>
            </select><br>

            <label for="rating">Calificación (1-5):</label>
            <input type="number" id="rating" name="rating" min="1" max="5" required><br>

            <label for="comment">Comentario:</label><br>
            <textarea id="comment" name="comment" rows="4" required></textarea><br>

            <button type="submit">Enviar Reseña</button>
        </form>
    </div>

    <div class="slider-container">
        <div class="slider">
            <?php while ($row = mysqli_fetch_assoc($reviewsResult)): ?>
                <div class="review-box">
                    <h3><?php echo $row['Nombre de Usuario']; ?> - <?php echo $row['Nombre De platillo']; ?></h3>
                    <p class="rating">Calificación: <?php echo $row['Calificacion']; ?>/5</p>
                    <p><?php echo $row['Comentario']; ?></p>
                    <p class="date"><?php echo $row['Fecha']; ?></p>
                </div>
            <?php endwhile; ?>
        </div>

        <!-- Botones de navegación -->
        <button class="prev">&#10094;</button>
        <button class="next">&#10095;</button>
    </div>
    <script src="review.js"></script>
</body>

</html>