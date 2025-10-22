const lista_ciclos = {
    pre : ["Pioneros", "First Garten", "Garten", "Transition"],
    pb : ["Primero", "Segundo", "Tercero"],
    pa : ["Cuarto", "Quinto"],
    em : ["Sexto", "Septimo"],
    ea : ["Octavo", "Noveno", "Decimo", "Once"]
}
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
}

const HorasDisponibles = ["8:20 AM", "8:40 AM", "9:00 AM", 
    "9:20 AM", "9:40 AM", "10:20 AM", "10:40 AM", "11:00 AM", 
    "11:20 AM", "11:40 AM", "12:00 M", "12:20 PM", "12:40 PM", 
    "2:00 PM", "2:20 PM", "2:40 PM", "3:00 PM", "3:20 PM"];




const selectCiclos = document.getElementById("ciclos");
const selectGrados = document.getElementById("grados");
const selectCursos = document.getElementById("cursos");
const selectHoras = document.getElementById("horas");
const selectForm = document.getElementById("reservas");



selectCiclos.addEventListener("change", function() {

    const cicloSeleccionado = selectCiclos.value;
    selectGrados.innerHTML = '<option value="">Selecciona un grado</option>'

    if(lista_ciclos[cicloSeleccionado]){
        lista_ciclos[cicloSeleccionado].forEach(grado => {
            const opcion = document.createElement("option");
            opcion.value = grado;
            opcion.textContent = grado;
            selectGrados.appendChild(opcion);
        });
    }
})

selectGrados.addEventListener("change", function(){

    const gradoSeleccionado = selectGrados.value;
    selectCursos.innerHTML = '<option value="">Selecciona un curso</option>';

    if(lista_cursos[gradoSeleccionado]){
        lista_cursos[gradoSeleccionado].forEach( curso => {
            const opcion = document.createElement("option");
            opcion.value = curso;
            opcion.textContent= curso;
            selectCursos.appendChild(opcion);
        })
    }
})

selectCursos.addEventListener("change", async() => {

    const ciclo = selectCiclos.value;
    const grado = selectGrados.value;
    const curso = selectCursos.value;


    selectHoras.innerHTML = '<option value="">Selecciona una hora</option>';

    if(ciclo && grado && curso ){
        const response  = await fetch(`http://localhost:3000/horas?ciclo=${ciclo}&grado=${grado}&curso=${curso}`);
        const horasReservadas = await response.json();

        
        HorasDisponibles.forEach(hora => {
            if (!horasReservadas.includes(hora)) {
                const opcion = document.createElement("option");
                opcion.value = hora;
                opcion.textContent = hora;
                selectHoras.appendChild(opcion);
            }
        });

    }


})


selectForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
        nombre: document.getElementById("nombre").value,
        ciclo: selectCiclos.value,
        grado: selectGrados.value,
        curso: selectCursos.value,
        hora: selectHoras.value
    };

    const response = await fetch('http://localhost:3000/reservar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    const result = await response.json();
    alert(result.mensaje);
});
