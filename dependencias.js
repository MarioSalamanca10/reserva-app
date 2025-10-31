// URL del backend en Render
const API_URL = "https://reserva-app-1.onrender.com";

// Datos estáticos
const lista_ciclos = {
  Preescolar: ["Pioneros", "First Garten", "Garten", "Transition"],
  Primaria_Baja: ["Primero", "Segundo", "Tercero"],
  Primaria_Alta: ["Cuarto", "Quinto"],
  Escuela_Media: ["Sexto", "Septimo"],
  Escuela_Alta: ["Octavo", "Noveno", "Decimo", "Once"]
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

const HorasDisponibles = [
  "8:20 AM", "8:40 AM", "9:00 AM", "9:20 AM", "9:40 AM",
  "10:20 AM", "10:40 AM", "11:00 AM", "11:20 AM", "11:40 AM",
  "12:00 M", "12:20 PM", "12:40 PM", "2:00 PM", "2:20 PM",
  "2:40 PM", "3:00 PM", "3:20 PM"
];

// Referencias a elementos del DOM
const selectCiclos = document.getElementById("ciclos");
const selectGrados = document.getElementById("grados");
const selectCursos = document.getElementById("cursos");
const selectHoras = document.getElementById("horas");
const selectModalidad = document.getElementById("modalidad");
const selectForm = document.getElementById("reservas");

// Llenar grados según ciclo
selectCiclos.addEventListener("change", () => {
  const cicloSeleccionado = selectCiclos.value;
  selectGrados.innerHTML = '<option value="">Selecciona un grado</option>';
  if (lista_ciclos[cicloSeleccionado]) {
    lista_ciclos[cicloSeleccionado].forEach(grado => {
      const opcion = document.createElement("option");
      opcion.value = grado;
      opcion.textContent = grado;
      selectGrados.appendChild(opcion);
    });
  }
});

// Llenar cursos según grado
selectGrados.addEventListener("change", () => {
  const gradoSeleccionado = selectGrados.value;
  selectCursos.innerHTML = '<option value="">Selecciona un curso</option>';
  if (lista_cursos[gradoSeleccionado]) {
    lista_cursos[gradoSeleccionado].forEach(curso => {
      const opcion = document.createElement("option");
      opcion.value = curso;
      opcion.textContent = curso;
      selectCursos.appendChild(opcion);
    });
  }
});

// Llenar horas según ciclo, grado y curso
selectCursos.addEventListener("change", async () => {
  const ciclo = selectCiclos.value;
  const grado = selectGrados.value;
  const curso = selectCursos.value;
  selectHoras.innerHTML = '<option value="">Selecciona una hora</option>';
  if (ciclo && grado && curso) {
    try {
      const response = await fetch(`${API_URL}/horas?ciclo=${ciclo}&grado=${grado}&curso=${curso}`);
      const horasReservadas = await response.json();
      HorasDisponibles.forEach(hora => {
        if (!horasReservadas.includes(hora)) {
          const opcion = document.createElement("option");
          opcion.value = hora;
          opcion.textContent = hora;
          selectHoras.appendChild(opcion);
        }
      });
    } catch (error) {
      console.error("Error al cargar horas:", error);
    }
  }
});

// Enviar reserva al backend
selectForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = {
    nombre: document.getElementById("nombre").value,
    ciclo: selectCiclos.value,
    grado: selectGrados.value,
    curso: selectCursos.value,
    hora: selectHoras.value,
    modalidad: selectModalidad.value
  };

  try {
    const response = await fetch(`${API_URL}/reservar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (response.status === 409) {
      alert("La hora ya está reservada. Por favor, elige otra.");
      return;
    }

    localStorage.setItem('ultimaReserva', JSON.stringify(data));
    window.location.href = 'confirmacion.html';
  } catch (error) {
    console.error("Error al enviar reserva:", error);
  }
});
