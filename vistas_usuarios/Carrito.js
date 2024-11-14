// Función para agregar elementos al carrito
function agregarAlCarrito(menu_item_id, nombre, precio) {
    if (!menu_item_id || !nombre || !precio) {
        console.error("Datos del producto incompletos: ", { menu_item_id, nombre, precio });
        alert("Datos del producto incompletos.");
        return;
    }
    // Recuperar carrito actual del localStorage
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    // Buscar si el producto ya está en el carrito
    let productoExistente = carrito.find(item => item.menu_item_id === menu_item_id);

    if (productoExistente) {
        // Si ya está, aumentar la cantidad
        productoExistente.cantidad += 1;
    } else {
        // Si no está, agregarlo como un nuevo producto
        carrito.push({ menu_item_id: menu_item_id, nombre: nombre, precio: precio, cantidad: 1 });
    }

    // Guardar el carrito actualizado en localStorage
    localStorage.setItem('carrito', JSON.stringify(carrito));

    alert(nombre + " ha sido añadido al carrito.");
}

// Función para cargar el carrito del localStorage
function cargarCarrito() {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    let cartItemsContainer = document.getElementById('cart-items');
    let totalPriceContainer = document.getElementById('total-price');
    cartItemsContainer.innerHTML = ''; // Limpiar contenido anterior

    if (carrito.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Tu carrito está vacío</p>';
        totalPriceContainer.innerHTML = '';
    } else {
        let total = 0;

        carrito.forEach(item => {
            let itemTotal = item.precio * item.cantidad;
            total += itemTotal;

            // Crear el HTML para cada producto en el carrito
            cartItemsContainer.innerHTML += `
                <div class="cart-item">
                    <div>
                        <h4>${item.nombre}</h4>
                        <p>Precio: $${item.precio.toFixed(2)} x ${item.cantidad} unidad(es)</p>
                    </div>
                    <div>
                        <p>Total: $${itemTotal.toFixed(2)}</p>
                        <button onclick="eliminarDelCarrito('${item.nombre}')">Eliminar</button>
                    </div>
                </div>
            `;
        });

        // Actualizar el total
        totalPriceContainer.innerHTML = `Total a pagar: $${total.toFixed(2)}`;

    }
}

// Función para eliminar un producto del carrito
function eliminarDelCarrito(nombre) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    // Filtrar el producto que se quiere eliminar
    carrito = carrito.filter(item => item.nombre !== nombre);

    // Actualizar el carrito en el localStorage
    localStorage.setItem('carrito', JSON.stringify(carrito));

    // Recargar la lista de productos del carrito
    cargarCarrito();
}
// Función para realizar el pago y enviar la orden al servidor
function pagar() {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    let user_id = 1; // Aquí deberías obtener el ID del usuario logueado

    if (carrito.length === 0) {
        alert("No tienes productos en el carrito.");
    } else {
        // Confirmar el pago
        if (confirm("¿Deseas realizar el pago?")) {
            // Calcular el total
            let total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);

            // Construir los arrays para enviar al servidor
            let menu_item_ids = [];
            let nombres = [];
            let precios = [];
            let cantidades = [];

            carrito.forEach(item => {
                menu_item_ids.push(item.menu_item_id);
                nombres.push(item.name);
                precios.push(item.precio);
                cantidades.push(item.cantidad);
            });

            // Imprimir los datos enviados al servidor para depuración
            console.log('Datos enviados al servidor:', {
                user_id: user_id,
                total: total,
                menu_item_ids: menu_item_ids,
                nombres: nombres,
                precios: precios,
                cantidades: cantidades
            });

            // Enviar los datos al servidor
            fetch('procesar_orden.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `user_id=${user_id}&total=${total}&menu_item_id[]=${menu_item_ids.join('&menu_item_id[]=')}&name[]=${nombres.join('&name[]=')}&precio[]=${precios.join('&precio[]=')}&cantidad[]=${cantidades.join('&cantidad[]=')}`
            })
            .then(response => response.text()) // Cambié a .text() para depuración
            .then(data => {
                console.log("Respuesta del servidor:", data); 
                alert("¡Pago realizado con éxito!");
                
                // Vaciar el carrito
                localStorage.removeItem('carrito');
                cargarCarrito(); // Recargar el carrito vacío
            })
            .catch(error => {
                console.error("Error al procesar el pago:", error);
            });
        }
    }
}


// Cargar el carrito al cargar la página
window.onload = cargarCarrito;
