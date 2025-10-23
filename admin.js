
const API_URL = "https://reserva-app-1.onrender.com";

async function cargarReservas() {
  const response = await fetch(`${API_URL}/reservas`);
  const reservas = await response.json();
  mostrarTabla(reservas);
}

function mostrarTabla(reservas) {
  const filtro = document.getElementById("filtroCurso").value;
  const tbody = document.querySelector("#tablaReservas tbody");
  tbody.innerHTML = "";

  reservas
    .filter(r => !filtro || r.curso === filtro)
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

document.getElementById("filtroCurso").addEventListener("change", cargarReservas);

cargarReservas();
