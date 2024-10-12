// Utility functions
function $(id) { return document.getElementById(id); }
function $$(selector) { return document.querySelectorAll(selector); }

// Fetch data from the server
async function fetchData(action) {
    const response = await fetch(`db_operations.php?action=${action}`);
    return await response.json();
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

// Event listeners and other functions remain the same
// ...

// Initialize tables
renderOrdenesTable();
renderUsuariosTable();
renderMenuTable();