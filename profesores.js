

const API_URL = "https://reserva-app-1.onrender.com";

// Listas globales para grados y cursos
const lista_ciclos = {
  pre: ["Pioneros", "First Garten", "Garten", "Transition"],
  pb: ["Primero", "Segundo", "Tercero"],
  pa: ["Cuarto", "Quinto"],
  em: ["Sexto", "Septimo"],
  ea: ["Octavo", "Noveno", "Decimo", "Once"]
};

const lista_cursos = {
  "Pioneros": ["Pioneros"],
  "First Garten": ["A", "B"],
  "Garten": ["A", "B", "C", "D"],
  "Transition": ["A", "B", "C", "D"],
  "Primero": ["A", "B", "C", "D", "E", "F"],
  "Segundo": ["A", "B", "C", "D", "E", "F"],
  "Tercero": ["A", "B", "C", "D", "E", "F"],
  "Cuarto": ["A", "B", "C", "D", "E", "F", "G"],
  "Quinto": ["A", "B", "C", "D", "E", "F"],
  "Sexto": ["A", "B", "C", "D", "E"],
  "Septimo": ["A", "B", "C", "D"],
  "Octavo": ["A", "B", "C", "D"],
  "Noveno": ["A", "B", "C", "D"],
  "Decimo": ["A", "B", "C"],
  "Once": ["A", "B", "C"]
};

let reservasGlobal = [];

// ✅ Cargar todas las reservas desde el backend
async function cargarReservas() {
  const response = await fetch(`${API_URL}/reservas`);
  reservasGlobal = await response.json();
  generarFiltros();
  mostrarTabla(reservasGlobal);
}

// ✅ Generar filtros dinámicos
function generarFiltros() {
  const filtroGrado = document.getElementById("filtroGrado");
  const filtroCurso = document.getElementById("filtroCurso");

  filtroGrado.innerHTML = '<option value="">Todos</option>';
  Object.values(lista_ciclos).flat().forEach(g => {
    const opt = document.createElement("option");
    opt.value = g;
    opt.textContent = g;
    filtroGrado.appendChild(opt);
  });

  filtroCurso.innerHTML = '<option value="">Todos</option>'; // Inicialmente vacío
}

// ✅ Actualizar cursos cuando cambia el grado
document.getElementById("filtroGrado").addEventListener("change", () => {
  const gradoSeleccionado = document.getElementById("filtroGrado").value;
  const filtroCurso = document.getElementById("filtroCurso");
  filtroCurso.innerHTML = '<option value="">Todos</option>';

  if (gradoSeleccionado && lista_cursos[gradoSeleccionado]) {
    lista_cursos[gradoSeleccionado].forEach(c => {
      const opt = document.createElement("option");
      opt.value = c;
      opt.textContent = c;
      filtroCurso.appendChild(opt);
    });
  }

  mostrarTabla(reservasGlobal);
});

// ✅ Filtrar por curso
document.getElementById("filtroCurso").addEventListener("change", () => mostrarTabla(reservasGlobal));

// ✅ Mostrar tabla con filtros aplicados
function mostrarTabla(reservas) {
  const gradoFiltro = document.getElementById("filtroGrado").value;
  const cursoFiltro = document.getElementById("filtroCurso").value;

  const tbody = document.querySelector("#tablaReservas tbody");
  tbody.innerHTML = "";

  reservas
    .filter(r => (!gradoFiltro || r.grado === gradoFiltro) && (!cursoFiltro || r.curso === cursoFiltro))
    .forEach(r => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${r.nombre}</td>
        <td>${r.ciclo}</td>
        <td>${r.grado}</td>
        <td>${r.curso}</td>
        <td>${r.hora}</td>
      `;
      tbody.appendChild(fila);
    });
}

cargarReservas();
