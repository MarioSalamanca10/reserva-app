
//redireccion de login
if (localStorage.getItem("adminAutenticado") !== "true") {
  window.location.href = "login.html";
}

//cerrar sesion al cerrar la pestaña
window.addEventListener("unload", () => {
  localStorage.removeItem("adminAutenticado");
});

//boton cerrar sesion
function cerrarSesion() {
  localStorage.removeItem("adminAutenticado");
  window.location.href = "login.html";
}



const API_URL = "https://reserva-app-1.onrender.com";
let reservasGlobal = [];
let idEditar = null;

async function cargarReservas() {
  const res = await fetch(`${API_URL}/reservas`);
  reservasGlobal = await res.json();
  mostrarTabla(reservasGlobal);
  llenarFiltros();
}

function mostrarTabla(reservas) {
  const tbody = document.querySelector("#tablaReservas tbody");
  tbody.innerHTML = "";
  reservas.forEach(r => {
    const fila = document.createElement("tr");
fila.innerHTML = `
  <td>${r.nombre}</td>
  <td>${r.ciclo}</td>
  <td>${r.grado}</td>
  <td>${r.curso}</td>
  <td>${r.hora}</td>
  <td>${r.modalidad}</td>
  <td>
    <button onclick="editar(${r.id}, '${r.nombre}', '${r.ciclo}', '${r.grado}', '${r.curso}', '${r.hora}', '${r.modalidad}')">Editar</button>
    <button onclick="eliminar(${r.id})">Eliminar</button>
  </td>
`;

    tbody.appendChild(fila);
  });
}

function llenarFiltros() {
  const grados = [...new Set(reservasGlobal.map(r => r.grado))];
  const cursos = [...new Set(reservasGlobal.map(r => r.curso))];

  const filtroGrado = document.getElementById("filtroGrado");
  const filtroCurso = document.getElementById("filtroCurso");

  filtroGrado.innerHTML = '<option value="">Todos</option>';
  grados.forEach(g => {
    const option = document.createElement("option");
    option.value = g;
    option.textContent = g;
    filtroGrado.appendChild(option);
  });

  filtroCurso.innerHTML = '<option value="">Todos</option>';
  cursos.forEach(c => {
    const option = document.createElement("option");
    option.value = c;
    option.textContent = c;
    filtroCurso.appendChild(option);
  });
}

function editar(id, nombre, ciclo, grado, curso, hora, modalidad) {
  idEditar = id;
  document.getElementById("editNombre").value = nombre;
  document.getElementById("editCiclo").value = ciclo;
  document.getElementById("editGrado").value = grado;
  document.getElementById("editCurso").value = curso;
  document.getElementById("editHora").value = hora;
  document.getElementById("editModalidad").value = modalidad;
  document.getElementById("modalEditar").style.display = "block";
}

function cerrarModal() {
  document.getElementById("modalEditar").style.display = "none";
}

async function guardarEdicion() {
  const nombre = document.getElementById("editNombre").value;
  const ciclo = document.getElementById("editCiclo").value;
  const grado = document.getElementById("editGrado").value;
  const curso = document.getElementById("editCurso").value;
  const hora = document.getElementById("editHora").value;
  const modalidad = document.getElementById("editModalidad").value;

  await fetch(`${API_URL}/reservas/${idEditar}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre, ciclo, grado, curso, hora, modalidad })
  });

  cerrarModal();
  cargarReservas();
}

function eliminar(id) {
  fetch(`${API_URL}/reservas/${id}`, { method: "DELETE" })
    .then(() => cargarReservas());
}

document.getElementById("filtroGrado").addEventListener("change", () => filtrar());
document.getElementById("filtroCurso").addEventListener("change", () => filtrar());

function filtrar() {
  const grado = document.getElementById("filtroGrado").value;
  const curso = document.getElementById("filtroCurso").value;
  const filtradas = reservasGlobal.filter(r => {
    return (grado === "" || r.grado === grado) && (curso === "" || r.curso === curso);
  });
  mostrarTabla(filtradas);
}

cargarReservas();

async function cargarReservasAsignaturas() {
  const res = await fetch("/reservas-materias");
  const datos = await res.json();
  const tabla = document.getElementById("tablaAsignaturas");
  if (!tabla) return;
  const tbody = tabla.querySelector("tbody");
  tbody.innerHTML = "";
  datos.forEach(r => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${r.nombre}</td>
      <td>${r.materia}</td>
      <td>${r.profesor}</td>
      <td>${r.modalidad}</td>
      <td>${r.hora}</td>
      <td>
        <button onclick="eliminarAsignatura(${r.id})">Eliminar</button>
      </td>
    `;
    tbody.appendChild(fila);
  });
}

async function eliminarAsignatura(id) {
  await fetch(`/reservas-materias/${id}`, { method: "DELETE" });
  cargarReservasAsignaturas();
}

document.addEventListener("DOMContentLoaded", cargarReservasAsignaturas);


function mostrarSeccion(id) {
  const secciones = document.querySelectorAll('.seccion-tabla');
  secciones.forEach(sec => sec.style.display = 'none');
  document.getElementById(id).style.display = 'block';
}
