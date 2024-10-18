// Funciones de utilidad
function $(id) { return document.getElementById(id); }
function $$(selector) { return document.querySelectorAll(selector); }

// Cambiar entre secciones
$$('.sidebar nav a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        $$('.main-content section').forEach(section => section.style.display = 'none');
        $(this.getAttribute('href').slice(1)).style.display = 'block';
        $('header h2').textContent = this.textContent;
        $$('.sidebar nav a').forEach(a => a.classList.remove('active'));
        this.classList.add('active');
    });
});

// Fetch data from the server
async function fetchData(action) {
    const response = await fetch(`http://localhost/DonKamaron/vistas_admin/db_operations.php?action=${action}`);
    const data = await response.json();
    console.log('Datos obtenidos:', data); // Agrega esto para ver la respuesta del servidor
    return data;
}

// Render tables
async function renderOrdenesTable() {
    const ordenes = await fetchData('getOrders');
    const tbody = $('ordenesTable').querySelector('tbody');
    tbody.innerHTML = '';
    ordenes.forEach(orden => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${orden.id}</td>
            <td>${orden.user_id}</td>
            <td>${orden.status}</td>
            <td>$${parseFloat(orden.total).toFixed(2)}</td>
            <td>${orden.order_date}</td>
            <td>
                <select onchange="cambiarEstadoOrden(${orden.id}, this.value)">
                    <option value="pendiente" ${orden.status === 'pendiente' ? 'selected' : ''}>Pendiente</option>
                    <option value="preparando" ${orden.status === 'preparando' ? 'selected' : ''}>Preparando</option>
                    <option value="listo" ${orden.status === 'listo' ? 'selected' : ''}>Listo</option>
                    <option value="entregado" ${orden.status === 'entregado' ? 'selected' : ''}>Entregado</option>
                    <option value="cancelado" ${orden.status === 'cancelado' ? 'selected' : ''}>Cancelado</option>
                </select>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

async function renderUsuariosTable() {
    const usuarios = await fetchData('getUsers');
    const tbody = $('usuariosTable').querySelector('tbody');
    tbody.innerHTML = '';
    usuarios.forEach(usuario => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${usuario.id}</td>
            <td>${usuario.name}</td>
            <td>${usuario.email}</td>
            <td>${usuario.role}</td>
            <td>
                <button class="btn btn-outline" onclick="editarUsuario(${usuario.id})">Editar</button>
                <button class="btn" onclick="eliminarUsuario(${usuario.id})">Eliminar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

async function renderMenuTable() {
    const menuItems = await fetchData('getMenuItems');
    const tbody = $('menuTable').querySelector('tbody');
    tbody.innerHTML = '';
    menuItems.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>$${parseFloat(item.price).toFixed(2)}</td>
            <td>${item.category}</td>
            <td>
                <button class="btn btn-outline" onclick="editarMenuItem(${item.id})">Editar</button>
                <button class="btn" onclick="eliminarMenuItem(${item.id})">Eliminar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Funciones para manejar órdenes
function cambiarEstadoOrden(id, nuevoEstado) {
    console.log(`Cambiar estado de la orden ${id} a ${nuevoEstado}`);
    // Aquí podrías implementar la lógica para cambiar el estado en el servidor
}

// Funciones para manejar usuarios
function mostrarUserModal(usuario = null) {
    const modal = $('userModal');
    const form = $('userForm');
    
    if (usuario) {
        $('userId').value = usuario.id;
        $('userName').value = usuario.name;
        $('userEmail').value = usuario.email;
        $('userRole').value = usuario.role;
    } else {
        form.reset();
        $('userId').value = '';
    }
    
    modal.style.display = 'block'; // Muestra el modal
}


async function editarUsuario(id) {
    const usuarios = await fetchData('getUsers'); // Obtén la lista actualizada de usuarios
    const usuario = usuarios.find(u => u.id === String(id)); // Compara como strings
    console.log('Usuario a editar:', usuario); // Agrega esto para depuración
    if (usuario) {
        mostrarUserModal(usuario);
    } else {
        console.error(`Usuario con ID ${id} no encontrado`);
    }
}




async function eliminarUsuario(id) {
    if (confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
        try {
            const response = await fetch(`http://localhost/DonKamaron/vistas_admin/db_operations.php?action=deleteUser&id=${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor.');
            }

            const result = await response.json();
            if (result.success) {
                renderUsuariosTable(); // Renderizar de nuevo la tabla
            } else {
                alert('Error al eliminar el usuario: ' + result.error);
            }
        } catch (error) {
            console.error('Error al eliminar el usuario:', error);
            alert('Error al eliminar el usuario. Por favor, intenta nuevamente.');
        }
    }
}

// Funciones para manejar ítems del menú
function mostrarMenuItemModal(item = null) {
    const modal = $('menuItemModal');
    const form = $('menuItemForm');
    if (item) {
        $('menuItemId').value = item.id;
        $('menuItemName').value = item.name;
        $('menuItemPrice').value = item.price;
        $('menuItemCategory').value = item.category;
    } else {
        form.reset();
        $('menuItemId').value = '';
    }
    modal.style.display = 'block';
}

async function editarMenuItem(id) {
    const menuItems = await fetchData('getMenuItems'); // Obtén la lista actualizada de ítems
    const item = menuItems.find(i => i.id === id);
    if (item) {
        mostrarMenuItemModal(item);
    }
}

async function eliminarMenuItem(id) {
    if (confirm("¿Estás seguro de que deseas eliminar este ítem del menú?")) {
        try {
            const response = await fetch(`http://localhost/DonKamaron/vistas_admin/db_operations.php?action=deleteMenuItem&id=${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor.');
            }

            const result = await response.json();
            if (result.success) {
                renderMenuTable(); // Renderizar de nuevo la tabla
            } else {
                alert('Error al eliminar el ítem del menú: ' + result.error);
            }
        } catch (error) {
            console.error('Error al eliminar el ítem del menú:', error);
            alert('Error al eliminar el ítem del menú. Por favor, intenta nuevamente.');
        }
    }
}

// Event Listeners
$('addUserBtn').addEventListener('click', () => mostrarUserModal());
$('addMenuItemBtn').addEventListener('click', () => mostrarMenuItemModal());

$('userForm').addEventListener('submit', async function(e) {
    e.preventDefault(); // Previene el comportamiento predeterminado del formulario

    const id = $('userId').value;
    const usuario = {
        id: id ? parseInt(id) : Date.now(), // Usar Date.now() para nuevos usuarios
        name: $('userName').value,
        email: $('userEmail').value,
        role: $('userRole').value
    };

    try {
        const action = id ? 'editUser' : 'addUser';
        const response = await fetch(`http://localhost/DonKamaron/vistas_admin/db_operations.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ action, usuario })
        });
    
        const result = await response.json();
        console.log('Resultado de la respuesta:', result); // Agrega esto para depurar
        if (result.success) {
            renderUsuariosTable();
            $('userModal').style.display = 'none';
        } else {
            alert('Error al guardar el usuario: ' + result.error);
        }
    } catch (error) {
        console.error('Error al guardar el usuario:', error);
        alert('Error al guardar el usuario. Por favor, intenta nuevamente.');
    }    
});




$('menuItemForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const id = $('menuItemId').value;
    const item = {
        id: id ? parseInt(id) : Date.now(),
        name: $('menuItemName').value,
        price: parseFloat($('menuItemPrice').value),
        category: $('menuItemCategory').value
    };

    try {
        const response = await fetch('http://localhost/DonKamaron/vistas_admin/db_operations.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: id ? 'updateMenuItem' : 'addMenuItem', item }),
        });

        const result = await response.json();
        if (result.success) {
            renderMenuTable();
            $('menuItemModal').style.display = 'none';
        } else {
            alert('Error al guardar el ítem del menú: ' + result.error);
        }
    } catch (error) {
        console.error('Error al guardar el ítem del menú:', error);
        alert('Error al guardar el ítem del menú. Por favor, intenta nuevamente.');
    }
});

// Cerrar modales
$$('.close').forEach(closeBtn => {
    closeBtn.addEventListener('click', function() {
        this.closest('.modal').style.display = 'none';
    });
});


// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    renderOrdenesTable();
    renderUsuariosTable();
    renderMenuTable();
});

// Simulación de generación de reportes
$('reporteVentasBtn').addEventListener('click', () => alert('Generando reporte de ventas diarias...'));
$('reporteInventarioBtn').addEventListener('click', () => alert('Generando reporte de inventario...'));
$('reporteIngresosBtn').addEventListener('click', () => alert('Generando reporte de ingresos mensuales...'));
