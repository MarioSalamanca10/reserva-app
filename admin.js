const API_URL = "https://reserva-app-1.onrender.com";

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

//edicion del modal

let idEditar = null;

function editar(id, nombre, ciclo, grado, curso, hora) {
  idEditar = id;
  document.getElementById("editNombre").value = nombre;
  document.getElementById("editHora").value = hora;
  llenarSelects(ciclo, grado, curso);
  document.getElementById("modalEditar").style.display = "block";
}

function llenarSelects(ciclo, grado, curso) {
  const cicloSelect = document.getElementById("editCiclo");
  cicloSelect.innerHTML = "";
  Object.keys(lista_ciclos).forEach(c => {
    const opt = document.createElement("option");
    opt.value = c;
    opt.textContent = c;
    if (c === ciclo) opt.selected = true;
    cicloSelect.appendChild(opt);
  });

  const gradoSelect = document.getElementById("editGrado");
  gradoSelect.innerHTML = "";
  lista_ciclos[ciclo].forEach(g => {
    const opt = document.createElement("option");
    opt.value = g;
    opt.textContent = g;
    if (g === grado) opt.selected = true;
    gradoSelect.appendChild(opt);
  });

  const cursoSelect = document.getElementById("editCurso");
  cursoSelect.innerHTML = "";
  lista_cursos[grado].forEach(cu => {
    const opt = document.createElement("option");
    opt.value = cu;
    opt.textContent = cu;
    if (cu === curso) opt.selected = true;
    cursoSelect.appendChild(opt);
  });
}

async function guardarEdicion() {
  const nombre = document.getElementById("editNombre").value;
  const ciclo = document.getElementById("editCiclo").value;
  const grado = document.getElementById("editGrado").value;
  const curso = document.getElementById("editCurso").value;
  const hora = document.getElementById("editHora").value;

  await fetch(`${API_URL}/reservas/${idEditar}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, ciclo, grado, curso, hora })
  });
  cerrarModal();
  cargarReservas();
}

function cerrarModal() {
  document.getElementById("modalEditar").style.display = "none";
}

