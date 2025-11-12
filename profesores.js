
const API_URL = "https://reserva-app-1.onrender.com";
let reservasGlobal = [];
let reservasAsignaturasGlobal = [];

function mostrarSeccion(id) {
  const secciones = document.querySelectorAll('.seccion-tabla');
  secciones.forEach(sec => sec.style.display = 'none');

  const seleccionada = document.getElementById(id);
  if (seleccionada) {
    seleccionada.style.display = 'block';

    if (id === 'tablaReservas') {
      cargarReservas();
    } else if (id === 'tablaAsignaturas') {
      cargarReservasAsignaturas();
    }
  }
}

// ==================== RESERVAS GENERALES ====================

async function cargarReservas() {
  const res = await fetch(`${API_URL}/reservas`);
  reservasGlobal = await res.json();
  llenarFiltrosGenerales();
  mostrarTablaGeneral(reservasGlobal);
}

function llenarFiltrosGenerales() {
  const grados = [...new Set(reservasGlobal.map(r => r.grado))].sort();
  const cursos = [...new Set(reservasGlobal.map(r => r.curso))].sort();

  const filtroGrado = document.getElementById("filtroGrado");
  const filtroCurso = document.getElementById("filtroCurso");

  filtroGrado.innerHTML = '<option value="">Grado</option>';
  grados.forEach(g => {
    const option = document.createElement("option");
    option.value = g;
    option.textContent = g;
    filtroGrado.appendChild(option);
  });

  filtroCurso.innerHTML = '<option value="">Curso</option>';
  cursos.forEach(c => {
    const option = document.createElement("option");
    option.value = c;
    option.textContent = c;
    filtroCurso.appendChild(option);
  });
}

function mostrarTablaGeneral(reservas) {
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

document.getElementById("filtroNombre")?.addEventListener("input", filtrarGenerales);
document.getElementById("filtroGrado")?.addEventListener("change", filtrarGenerales);
document.getElementById("filtroCurso")?.addEventListener("change", filtrarGenerales);

function filtrarGenerales() {
  const nombre = document.getElementById("filtroNombre").value.toLowerCase();
  const grado = document.getElementById("filtroGrado").value;
  const curso = document.getElementById("filtroCurso").value;

  const filtradas = reservasGlobal.filter(r => {
    return (
      (nombre === "" || r.nombre.toLowerCase().includes(nombre)) &&
      (grado === "" || r.grado === grado) &&
      (curso === "" || r.curso === curso)
    );
  });

  mostrarTablaGeneral(filtradas);
}

// ==================== RESERVAS POR ASIGNATURA ====================

async function cargarReservasAsignaturas() {
  const res = await fetch("/reservas-materias");
  reservasAsignaturasGlobal = await res.json();
  llenarFiltrosAsignaturas();
  mostrarTablaAsignaturas(reservasAsignaturasGlobal);
}

function llenarFiltrosAsignaturas() {
  const materias = [...new Set(reservasAsignaturasGlobal.map(r => r.materia))].sort();
  const filtroMateria = document.getElementById("filtroMateria");
  filtroMateria.innerHTML = '<option value="">Asignatura</option>';
  materias.forEach(m => {
    const option = document.createElement("option");
    option.value = m;
    option.textContent = m;
    filtroMateria.appendChild(option);
  });

  actualizarFiltroProfesor();
}

function actualizarFiltroProfesor() {
  const materiaSeleccionada = document.getElementById("filtroMateria").value;
  const profesores = reservasAsignaturasGlobal
    .filter(r => materiaSeleccionada === "" || r.materia === materiaSeleccionada)
    .map(r => r.profesor);

  const unicos = [...new Set(profesores)].sort();
  const filtroProfesor = document.getElementById("filtroProfesor");
  filtroProfesor.innerHTML = '<option value="">Profesor</option>';
  unicos.forEach(p => {
    const option = document.createElement("option");
    option.value = p;
    option.textContent = p;
    filtroProfesor.appendChild(option);
  });
}

function mostrarTablaAsignaturas(reservas) {
  const tbody = document.getElementById("tablaAsignaturas");
  if (!tbody) return;
  tbody.innerHTML = "";
  reservas.forEach(r => {
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

document.getElementById("filtroMateria")?.addEventListener("change", () => {
  actualizarFiltroProfesor();
  filtrarAsignaturas();
});

document.getElementById("filtroProfesor")?.addEventListener("change", filtrarAsignaturas);
document.getElementById("ordenHora")?.addEventListener("change", filtrarAsignaturas);

function filtrarAsignaturas() {
  const materia = document.getElementById("filtroMateria").value;
  const profesor = document.getElementById("filtroProfesor").value;
  const orden = document.getElementById("ordenHora").value;

  let filtradas = reservasAsignaturasGlobal.filter(r => {
    return (
      (materia === "" || r.materia === materia) &&
      (profesor === "" || r.profesor === profesor)
    );
  });

  filtradas.sort((a, b) => {
    const horaA = convertirHora(a.hora);
    const horaB = convertirHora(b.hora);
    return orden === "asc" ? horaA - horaB : horaB - horaA;
  });

  mostrarTablaAsignaturas(filtradas);
}

// Convierte hora en formato "8:20 AM" a número para ordenar
function convertirHora(horaStr) {
  const [hora, minuto] = horaStr.replace(" AM", "").replace(" PM", "").split(":").map(Number);
  let total = hora * 60 + minuto;
  if (horaStr.includes("PM") && hora < 12) total += 12 * 60;
  return total;
}


