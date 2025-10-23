const API_URL = "https://reserva-app-1.onrender.com";
let reservasGlobal = [];

async function cargarReservas() {
  const response = await fetch(`${API_URL}/reservas`);
  reservasGlobal = await response.json();
  generarFiltros();
  mostrarTabla(reservasGlobal);
}

function generarFiltros() {
  const grados = [...new Set(reservasGlobal.map(r => r.grado))];
  const cursos = [...new Set(reservasGlobal.map(r => r.curso))];

  const filtroGrado = document.getElementById("filtroGrado");
  const filtroCurso = document.getElementById("filtroCurso");

  filtroGrado.innerHTML = '<option value="">Todos</option>';
  filtroCurso.innerHTML = '<option value="">Todos</option>';

  grados.forEach(g => {
    const opt = document.createElement("option");
    opt.value = g;
    opt.textContent = g;
    filtroGrado.appendChild(opt);
  });

  cursos.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c;
    opt.textContent = c;
    filtroCurso.appendChild(opt);
  });
}

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
        <td>
          <button onclick="editar(${r.id}, '${r.nombre}', '${r.ciclo}', '${r.grado}', '${r.curso}', '${r.hora}')">Editar</button>
          <button onclick="eliminar(${r.id})">Eliminar</button>
        </td>
      `;
      tbody.appendChild(fila);
    });
}

async function eliminar(id) {
  if (confirm("¿Seguro que deseas eliminar esta reserva?")) {
    await fetch(`${API_URL}/reservas/${id}`, { method: 'DELETE' });
    cargarReservas();
  }
}

function editar(id, nombre, ciclo, grado, curso, hora) {
  const nuevoNombre = prompt("Nuevo nombre:", nombre);
  const nuevaHora = prompt("Nueva hora:", hora);
  if (nuevoNombre && nuevaHora) {
    fetch(`${API_URL}/reservas/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: nuevoNombre, ciclo, grado, curso, hora: nuevaHora })
    }).then(() => cargarReservas());
  }
}

document.getElementById("filtroGrado").addEventListener("change", () => mostrarTabla(reservasGlobal));
document.getElementById("filtroCurso").addEventListener("change", () => mostrarTabla(reservasGlobal));

cargarReservas();
