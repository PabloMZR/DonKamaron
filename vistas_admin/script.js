// Datos de ejemplo
let ordenes = [
  {
    id: 1,
    userId: 3,
    status: "pendiente",
    total: 25.5,
    date: "2023-05-15 14:30:00",
  },
  {
    id: 2,
    userId: 5,
    status: "preparando",
    total: 42.75,
    date: "2023-05-15 15:15:00",
  },
  {
    id: 3,
    userId: 2,
    status: "listo",
    total: 18.9,
    date: "2023-05-15 16:00:00",
  },
];

let usuarios = [
  { id: 1, name: "Admin User", email: "admin@restaurant.com", role: "admin" },
  { id: 2, name: "Juan Cliente", email: "juan@email.com", role: "cliente" },
  {
    id: 3,
    name: "María Camarera",
    email: "maria@restaurant.com",
    role: "camarero",
  },
];

let menuItems = [
  { id: 1, name: "Pasta Carbonara", price: 12.99, category: "plato_principal" },
  { id: 2, name: "Ensalada César", price: 8.5, category: "entrada" },
  { id: 3, name: "Tiramisú", price: 6.75, category: "postre" },
];

// Funciones de utilidad
function $(id) {
  return document.getElementById(id);
}
function $$(selector) {
  return document.querySelectorAll(selector);
}

// Cambiar entre secciones
$$(".sidebar nav a").forEach((link) => {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    $$(".main-content section").forEach(
      (section) => (section.style.display = "none")
    );
    $(this.getAttribute("href").slice(1)).style.display = "block";
    $("header h2").textContent = this.textContent;
    $$(".sidebar nav a").forEach((a) => a.classList.remove("active"));
    this.classList.add("active");
  });
});

// Funciones para renderizar tablas
function renderOrdenesTable() {
  const tbody = $("ordenesTable").querySelector("tbody");
  tbody.innerHTML = "";
  ordenes.forEach((orden) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
            <td>${orden.id}</td>
            <td>${orden.userId}</td>
            <td>${orden.status}</td>
            <td>$${orden.total.toFixed(2)}</td>
            <td>${orden.date}</td>
            <td>
                <select onchange="cambiarEstadoOrden(${orden.id}, this.value)">
                    <option value="pendiente" ${
                      orden.status === "pendiente" ? "selected" : ""
                    }>Pendiente</option>
                    <option value="preparando" ${
                      orden.status === "preparando" ? "selected" : ""
                    }>Preparando</option>
                    <option value="listo" ${
                      orden.status === "listo" ? "selected" : ""
                    }>Listo</option>
                    <option value="entregado" ${
                      orden.status === "entregado" ? "selected" : ""
                    }>Entregado</option>
                    <option value="cancelado" ${
                      orden.status === "cancelado" ? "selected" : ""
                    }>Cancelado</option>
                </select>
            </td>
        `;
    tbody.appendChild(tr);
  });
}

function renderUsuariosTable() {
  const tbody = $("usuariosTable").querySelector("tbody");
  tbody.innerHTML = "";
  usuarios.forEach((usuario) => {
    const tr = document.createElement("tr");
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

function renderMenuTable() {
  const tbody = $("menuTable").querySelector("tbody");
  tbody.innerHTML = "";
  menuItems.forEach((item) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>${item.category}</td>
            <td>
                <button class="btn btn-outline"   onclick="editarMenuItem(${
                  item.id
                })">Editar</button>
                <button class="btn" onclick="eliminarMenuItem(${
                  item.id
                })">Eliminar</button>
            </td>
        `;
    tbody.appendChild(tr);
  });
}

// Funciones para manejar órdenes
function cambiarEstadoOrden(id, nuevoEstado) {
  const orden = ordenes.find((o) => o.id === id);
  if (orden) {
    orden.status = nuevoEstado;
    renderOrdenesTable();
  }
}

// Funciones para manejar usuarios
function mostrarUserModal(usuario = null) {
  const modal = $("userModal");
  const form = $("userForm");
  if (usuario) {
    $("userId").value = usuario.id;
    $("userName").value = usuario.name;
    $("userEmail").value = usuario.email;
    $("userRole").value = usuario.role;
  } else {
    form.reset();
    $("userId").value = "";
  }
  modal.style.display = "block";
}

function editarUsuario(id) {
  const usuario = usuarios.find((u) => u.id === id);
  if (usuario) {
    mostrarUserModal(usuario);
  }
}

function eliminarUsuario(id) {
  usuarios = usuarios.filter((u) => u.id !== id);
  renderUsuariosTable();
}

// Funciones para manejar ítems del menú
function mostrarMenuItemModal(item = null) {
  const modal = $("menuItemModal");
  const form = $("menuItemForm");
  if (item) {
    $("menuItemId").value = item.id;
    $("menuItemName").value = item.name;
    $("menuItemPrice").value = item.price;
    $("menuItemCategory").value = item.category;
  } else {
    form.reset();
    $("menuItemId").value = "";
  }
  modal.style.display = "block";
}

function editarMenuItem(id) {
  const item = menuItems.find((i) => i.id === id);
  if (item) {
    mostrarMenuItemModal(item);
  }
}

function eliminarMenuItem(id) {
  menuItems = menuItems.filter((i) => i.id !== id);
  renderMenuTable();
}

// Event Listeners
$("addUserBtn").addEventListener("click", () => mostrarUserModal());
$("addMenuItemBtn").addEventListener("click", () => mostrarMenuItemModal());

$("userForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const id = $("userId").value;
  const usuario = {
    id: id ? parseInt(id) : Date.now(),
    name: $("userName").value,
    email: $("userEmail").value,
    role: $("userRole").value,
  };
  if (id) {
    const index = usuarios.findIndex((u) => u.id === parseInt(id));
    if (index !== -1) {
      usuarios[index] = usuario;
    }
  } else {
    usuarios.push(usuario);
  }
  renderUsuariosTable();
  $("userModal").style.display = "none";
});

$("menuItemForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const id = $("menuItemId").value;
  const item = {
    id: id ? parseInt(id) : Date.now(),
    name: $("menuItemName").value,
    price: parseFloat($("menuItemPrice").value),
    category: $("menuItemCategory").value,
  };
  if (id) {
    const index = menuItems.findIndex((i) => i.id === parseInt(id));
    if (index !== -1) {
      menuItems[index] = item;
    }
  } else {
    menuItems.push(item);
  }
  renderMenuTable();
  $("menuItemModal").style.display = "none";
});

// Cerrar modales
$$(".close").forEach((closeBtn) => {
  closeBtn.addEventListener("click", function () {
    this.closest(".modal").style.display = "none";
  });
});

// Inicialización
renderOrdenesTable();
renderUsuariosTable();
renderMenuTable();

// Simulación de generación de reportes
$("reporteVentasBtn").addEventListener("click", () =>
  alert("Generando reporte de ventas diarias...")
);
$("reporteInventarioBtn").addEventListener("click", () =>
  alert("Generando reporte de inventario...")
);
$("reporteIngresosBtn").addEventListener("click", () =>
  alert("Generando reporte de ingresos mensuales...")
);
