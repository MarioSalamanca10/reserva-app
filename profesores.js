
const API_URL = "https://reserva-app-1.onrender.com";
let reservasGlobal = [];

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

document.getElementById("filtroGrado").addEventListener("change", filtrar);
document.getElementById("filtroCurso").addEventListener("change", filtrar);

function filtrar() {
  const grado = document.getElementById("filtroGrado").value;
  const curso = document.getElementById("filtroCurso").value;
  const filtradas = reservasGlobal.filter(r => {
    return (grado === "" || r.grado === grado) && (curso === "" || r.curso === curso);
  });
  mostrarTabla(filtradas);
}

cargarReservas();
