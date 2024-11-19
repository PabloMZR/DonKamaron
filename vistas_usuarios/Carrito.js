document.addEventListener("DOMContentLoaded", () => {
    const addToCartButtons = document.querySelectorAll(".add-to-cart");

    if (addToCartButtons.length === 0) {
        console.error("No se encontraron botones con la clase 'add-to-cart'.");
        return;
    }

    addToCartButtons.forEach(button => {
        button.addEventListener("click", () => {
            console.log("Botón clickeado");
            const name = button.getAttribute("data-name");
            const price = parseFloat(button.getAttribute("data-price"));
            const id = parseInt(button.getAttribute("data-id"));

            if (!name || isNaN(price) || isNaN(id)) {
                console.error("Datos inválidos en el botón:", { name, price, id });
                alert("Error al agregar el producto. Inténtalo de nuevo.");
                return;
            }

            agregarAlCarrito(name, price, id);
        });
    });
});

// Función para agregar un producto al carrito
function agregarAlCarrito(nombre, precio, id) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    // Verificar si el producto ya está en el carrito
    const productoExistente = carrito.find(item => item.id === id);

    if (productoExistente) {
        productoExistente.cantidad += 1;
    } else {
        carrito.push({ id, nombre, precio, cantidad: 1 });
    }

    // Actualizar el carrito en localStorage
    localStorage.setItem("carrito", JSON.stringify(carrito));
    alert(`${nombre} ha sido añadido al carrito.`);
}

// Función para cargar el carrito del localStorage y mostrarlo
function cargarCarrito() {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const cartItemsContainer = document.getElementById('cart-items');
    const totalPriceContainer = document.getElementById('total-price');

    cartItemsContainer.innerHTML = ''; // Limpiar contenido anterior

    if (carrito.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Tu carrito está vacío</p>';
        totalPriceContainer.innerHTML = '';
        return;
    }

    let total = 0;

    carrito.forEach(item => {
        let itemTotal = item.precio * item.cantidad;
        total += itemTotal;

        cartItemsContainer.innerHTML += `
            <div class="cart-item">
                <div>
                    <h4>${item.nombre}</h4>
                    <p>Precio: $${item.precio.toFixed(2)} x ${item.cantidad} unidad(es)</p>
                </div>
                <div>
                    <p>Total: $${itemTotal.toFixed(2)}</p>
                    <button onclick="eliminarDelCarrito(${item.id})">Eliminar</button>
                </div>
            </div>
        `;
    });

    // Actualizar el total
    totalPriceContainer.innerHTML = `Total a pagar: $${total.toFixed(2)}`;
}

// Función para eliminar un producto del carrito
function eliminarDelCarrito(id) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito = carrito.filter(item => item.id !== id); // Filtrar por ID
    localStorage.setItem('carrito', JSON.stringify(carrito));
    cargarCarrito(); // Actualizar la vista del carrito
}

// Función para realizar el pago y enviar la orden al servidor
function pagar() {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    if (carrito.length === 0) {
        alert("No tienes productos en el carrito.");
        return;
    }

    if (confirm("¿Deseas realizar el pago?")) {
        let total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);

        fetch('procesar_orden.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `carrito=${encodeURIComponent(JSON.stringify(carrito))}&total=${total}`
        })
            .then(response => response.json()) // Cambiado para soportar JSON
            .then(data => {
                if (data.success) {
                    alert("¡Pago realizado con éxito!");
                    localStorage.removeItem('carrito');
                    cargarCarrito();
                } else {
                    alert("Error al procesar el pago. Inténtalo de nuevo.");
                }
            })
            .catch(error => {
                console.error("Error al procesar el pago:", error);
                alert("Ocurrió un error durante el pago. Por favor, intenta nuevamente.");
            });
    }
}

// Cargar el carrito al cargar la página
window.onload = cargarCarrito;
