const API_URL = "https://reserva-app-1.onrender.com";

const profesoresPorMateria = {
  "Matematicas": [" "," Yessica Daniela Bermudez Vargas"," Carlos Augusto Castro Mendoza"," Andrea Fajardo Jaman"," Anna Lamonova "," Yazmin Guzmán Bejarano"," Juan David López Baquero"," Victor Alfonso Lopez Cordoba"," Andrea Catalina López Zuluaga"," Brahyam Ricardo Maldonado Ibagué"," Karen Maria Newball Benitez"],
  "Ciencias": [" ", " Jossy Esteban Clavijo Aguirre"," Juan Sebastian González Gómez"," Camilo Andres Martínez Quijano"," Oscar Felipe Moreno Gómez"," Santiago Velásquez Murcia"],
  "Lenguaje": [" ", "Ethel Ballesteros", "Julieth Alexandra Ayala Venegas", "Diego Alberto Caballero Franco", "Anjuly Raysa Gomez Gomez"," Jessica Catherine Lozano Cañón"," Madelein Quevedo Rodríguez"," Laura Paola Tamayo Munar"," Laura Camila Hernández Chacón"],
  "Sociales": [" ", "Alejandro Duran"],
  "Ingles": [" ", " Daniel Fabian Bernal Quintanilla"," Angie Katherine Pacheco Moreno"," Ana Belén Villamil Murcia"],
  "Educacion_Fisica": [" ", " Diego Eduardo Botia Garzon"," Luis Alejandro Castro Urrego"," Oscar David Cerinza Pinzon"," Juan David Montejo Rodríguez"," Daniel Elías  Rodríguez Cabarcas"," Diego Alejandro Romero Satizabal"," Luis Fernando Torres Rodríguez"," Juan Sebastian Vasquez Gómez"],
  "Psicologia": [" ", "Maritza Sanchez", " Joyce Cuéllar Reyes"," Yuly Constanza Murillo Fajardo"," Diana Melissa Niño Ramírez"," Claudia Margarita Rivera Espinosa"," Leonardo Rivera González"],
  "Tecnologia": [" ", " Jhon Fredt Posada Posada"],
  "Artes": [" ", " Daniel Oswaldo Cordon"," Edward Fernando Daza Rivera"," Laura Brigith Gil Duran"," Erika Marcela Herrera Castillo"," Angélica Sofia Lagos Tovar"," Cindi Alejandra Lopez Cepeda"," Monica Yazmin Vargas Juyar"," Karen Sofia Guevara Carreño"," Deyby Steven Salamanca Cartagena"," Diego Mauricio Salgado Parrado"," Luis Carlos Valero Moreno"],
  "Frances": [" ", " Laura Patricia Avila Montenegro"]
};

const HorasDisponibles = [
  "8:40 AM", "9:00 AM", "9:20 AM", "9:40 AM",
  "10:20 AM", "11:00 AM", "11:20 AM", "11:40 AM",
  "12:00 M", "12:20 PM", "12:40 PM", "2:00 PM", "2:20 PM",
  "2:40 PM", "3:00 PM", "3:20 PM", "3:40 PM"
];

document.getElementById("materia").addEventListener("change", () => {
  const materia = document.getElementById("materia").value;
  const selectProfesor = document.getElementById("profesor");
  selectProfesor.innerHTML = "";
  if (profesoresPorMateria[materia]) {
    profesoresPorMateria[materia].forEach(p => {
      const opt = document.createElement("option");
      opt.value = p;
      opt.textContent = p;
      selectProfesor.appendChild(opt);
    });
  }
  document.getElementById("hora").innerHTML = "<option value=''>Seleccione una hora</option>";
});

document.getElementById("profesor").addEventListener("change", async () => {
  const materia = document.getElementById("materia").value;
  const profesor = document.getElementById("profesor").value;
  const selectHoras = document.getElementById("hora");
  selectHoras.innerHTML = "<option value=''>Seleccione una hora</option>";

  if (materia && profesor) {
    try {
      const res = await fetch(`${API_URL}/horas-asignatura?materia=${materia}&profesor=${profesor}`);
      const horasReservadas = await res.json();
      HorasDisponibles.forEach(hora => {
        if (!horasReservadas.includes(hora)) {
          const opt = document.createElement("option");
          opt.value = hora;
          opt.textContent = hora;
          selectHoras.appendChild(opt);
        }
      });
    } catch (error) {
      console.error("Error al cargar horas:", error);
    }
  }
});

document.getElementById("formAsignatura").addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = {
    nombre: document.getElementById("nombre").value,
    materia: document.getElementById("materia").value,
    profesor: document.getElementById("profesor").value,
    modalidad: document.getElementById("modalidad").value,
    hora: document.getElementById("hora").value
  };

  const res = await fetch(`${API_URL}/reservar-asignatura`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  if (res.status === 409) {
    alert("La hora ya está reservada. Por favor, elige otra.");
    return;
  }

  if (res.ok) {
    localStorage.setItem("reservaAsignatura", JSON.stringify(data));
    window.location.href = "confirmacion.html";
  } else {
    alert("Error al reservar");
  }
});