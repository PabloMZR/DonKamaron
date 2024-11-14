<?php
include("obtener_menu.php");

// Establecer conexión
$Con = Conectar();

// Llamar al método para obtener y agrupar el menú
$grouped_menu_items = obtenerMenuAgrupado($Con);

// Cerrar conexión
Desconectar($Con);
?>

<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="stylesMenu.css">
    <title>Don Kamaron - Menú</title>
</head>

<body>

    <div class="header">
        <nav>
            <a href="#">Login</a>
            <a href="Carrito.html">Carrito de compras</a> <!-- Enlace al carrito -->
        </nav>
    </div>

    <div class="menu">
        <h1>Don Kamaron</h1>
        <div class="menu-categories">
            <!-- Enlaces a las secciones de categorías -->
            <a href="#platillos">
                <div class="category">
                    <img src="https://via.placeholder.com/80" alt="Platillos">
                    <p>Platillos</p>
                </div>
            </a>

            <a href="#postres">
                <div class="category">
                    <img src="https://via.placeholder.com/80" alt="Postres">
                    <p>Postres</p>
                </div>
            </a>

            <a href="#bebidas">
                <div class="category">
                    <img src="https://via.placeholder.com/80" alt="Bebidas">
                    <p>Bebidas</p>
                </div>
            </a>
        </div>

        <!-- Sección de Platillos -->
        <div class="menu-section" id="platillos">
            <h2>Platillos</h2>
            <?php foreach ($grouped_menu_items['plato_principal'] as $item): ?>
                <div class="item">
                    <div>
                    <h4><?php  echo $item['id'];?></h4>
                        <h4><?php echo $item['name']; ?></h4>
                        <p><?php echo $item['description']; ?></p>
                        <span>$<?php echo number_format($item['price'], 2); ?></span>
                    </div>
                    <button onclick="agregarAlCarrito('<?php echo $item['name']; ?>', <?php echo $item['price']; ?>, <?php  echo $item['id'];?>)">Agregar al carrito</button>
                </div>
            <?php endforeach; ?>
        </div>

        <!-- Sección de Postres -->
        <div class="menu-section" id="postres">
            <h2>Postres</h2>
            <?php foreach ($grouped_menu_items['postre'] as $item): ?>
                <div class="item">
                    <div>
                    <h4><?php  echo $item['id'];?></h4>
                        <h4><?php echo $item['name']; ?></h4>
                        <p><?php echo $item['description']; ?></p>
                        <span>$<?php echo number_format($item['price'], 2); ?></span>
                    </div>
                    <button onclick="agregarAlCarrito('<?php echo $item['name']; ?>', <?php echo $item['price']; ?>, <?php  echo $item['id'];?>)">Agregar al carrito</button>
                </div>
            <?php endforeach; ?>
        </div>

        <!-- Sección de Bebidas -->
        <div class="menu-section" id="bebidas">
            <h2>Bebidas</h2>
            <?php foreach ($grouped_menu_items['bebida'] as $item): ?>
                <div class="item">
                    <div>
                    <h4><?php  echo $item['id'];?></h4>
                        <h4><?php echo $item['name']; ?></h4>
                        <p><?php echo $item['description']; ?></p>
                        <span>$<?php echo number_format($item['price'], 2); ?></span>
                    </div>
                    <button onclick="agregarAlCarrito('<?php echo $item['name']; ?>', <?php echo $item['price']; ?>, <?php  echo $item['id'];?>)">Agregar al carrito</button>
                </div>
            <?php endforeach; ?>
        </div>

        <!-- Enlace al carrito de compras -->
        <div class="cart-link">
            <a href="Carrito.html">Ir al Carrito de Compras</a>
        </div>
    </div>
    <script src="Carrito.js"></script>

</body>

</html>