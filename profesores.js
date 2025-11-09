const API_URL = "https://reserva-app-1.onrender.com";
let reservasGlobal = [];

// Mostrar secciones según el botón del menú
function mostrarSeccion(id) {
  const secciones = document.querySelectorAll('.seccion-tabla');
  secciones.forEach(sec => sec.style.display = 'none');

  const seleccionada = document.getElementById(id);
  if (seleccionada) {
    seleccionada.style.display = 'block';

    // Cargar datos solo cuando se muestra la sección
    if (id === 'tablaReservas') {
      cargarReservas();
    } else if (id === 'tablaAsignaturas') {
      cargarReservasAsignaturas();
    }
  }
}

// Cargar reservas generales
async function cargarReservas() {
  const res = await fetch(`${API_URL}/reservas`);
  reservasGlobal = await res.json();
  llenarFiltros();
  mostrarTabla(reservasGlobal);
}

function llenarFiltros() {
  const grados = [...new Set(reservasGlobal.map(r => r.grado))];
  const cursos = [...new Set(reservasGlobal.map(r => r.curso))];

  const filtroGrado = document.getElementById("filtroGrado");
  const filtroCurso = document.getElementById("filtroCurso");

  if (!filtroGrado || !filtroCurso) return;

  filtroGrado.innerHTML = '<option value="">Todos los grados</option>';
  grados.forEach(g => {
    const option = document.createElement("option");
    option.value = g;
    option.textContent = g;
    filtroGrado.appendChild(option);
  });

  filtroCurso.innerHTML = '<option value="">Todos los cursos</option>';
  cursos.forEach(c => {
    const option = document.createElement("option");
    option.value = c;
    option.textContent = c;
    filtroCurso.appendChild(option);
  });
}

function mostrarTabla(reservas) {
  const tbody = document.getElementById("tablaReservas");
  if (!tbody) return;
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
    `;
    tbody.appendChild(fila);
  });
}

document.getElementById("filtroGrado")?.addEventListener("change", filtrar);
document.getElementById("filtroCurso")?.addEventListener("change", filtrar);

function filtrar() {
  const grado = document.getElementById("filtroGrado").value;
  const curso = document.getElementById("filtroCurso").value;
  const filtradas = reservasGlobal.filter(r => {
    return (grado === "" || r.grado === grado) && (curso === "" || r.curso === curso);
  });
  mostrarTabla(filtradas);
}

// Cargar reservas por asignatura
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
    `;
    tbody.appendChild(fila);
  });
}


