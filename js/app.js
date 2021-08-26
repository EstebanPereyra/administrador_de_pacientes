//variables y constantes
const inputPaciente = document.querySelector('#paciente');
const inputTelefono = document.querySelector('#telefono');
const inputFecha = document.querySelector('#fecha');
const inputHora = document.querySelector('#hora');
const inputSintomas = document.querySelector('#sintomas');

//UI -Interfaz de usuario-
const formulario = document.querySelector('#nueva-cita');
const contenedorCitas = document.querySelector('#citas');

let editando;


class Citas {
    constructor(){
        this.citas = [];
    }

    agregarCita(cita) {
        this.citas = [...this.citas, cita];
    }

    eliminarCita(id){
        this.citas = this.citas.filter(cita => cita.id !== id);
    }

    editarCitas(citaActualizada) {
        this.citas = this.citas.map (cita => cita.id === citaActualizada.id ? citaActualizada : cita);
    }

}

class UI {
    imprimirAlerta(mensaje, tipo) {
        //Crear div
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert', 'd-block', 'col-12');

        //Agregar clase en base al tipo de error

        if(tipo === 'error') {
            divMensaje.classList.add('alert-danger');
        } else {
            divMensaje.classList.add('alert-success');
        }

        //Mensaje error
        divMensaje.textContent = mensaje;

        //Agregar al DOM

        document.querySelector('#contenido').insertBefore(divMensaje, document.querySelector('.agregar-cita'));

        //Quita la aletar después de 5 segundos
        setTimeout ( () => {
            divMensaje.remove();
        }, 5000 );
    }

    imprimirCitas({citas}) {

        this.limpiarHTML();

        citas.forEach( cita =>{
            const {paciente, telefono, fecha, hora, sintomas, id} = cita;

            const divCita = document.createElement('div');
            divCita.classList.add('cita', 'p-3');
            divCita.dataset.id = id;

            //Scripting de los elementos de la cita
            const pacienteParrafo = document.createElement('h2');
            pacienteParrafo.classList.add('card-title', 'font-weight-bolder');
            pacienteParrafo.textContent = paciente;

            const telefonoParrafo = document.createElement('p');
            telefonoParrafo.innerHTML = `<span class='font-weight-bolder'>Teléfono: </span> ${telefono}`;

            const fechaParrafo = document.createElement('p');
            fechaParrafo.innerHTML = `<span class='font-weight-bolder'>Fecha: </span> ${fecha}`;

            const horaParrafo = document.createElement('p');
            horaParrafo.innerHTML = `<span class='font-weight-bolder'>Hora: </span> ${hora}`;

            const sintomasParrafo = document.createElement('p');
            sintomasParrafo.innerHTML = `<span class='font-weight-bolder'>Sintomas: </span> ${sintomas}`;

            //Boton para eliminar citas
            const btnEliminar = document.createElement('button');
            btnEliminar.classList.add('btn', 'btn-danger', 'mr-2');
            btnEliminar.innerHTML = 'Eliminar ';

            btnEliminar.onclick = () => eliminarCita(id);

            //Boton para editar citas
            const btnEditar = document.createElement('button');
            btnEditar.classList.add('btn', 'btn-info');
            btnEditar.innerHTML = 'Editar ';

            btnEditar.onclick = () => cargarEdicion(cita);


            //Agregar los párrafos al divCita
            divCita.appendChild(pacienteParrafo);
            divCita.appendChild(telefonoParrafo);
            divCita.appendChild(fechaParrafo);
            divCita.appendChild(horaParrafo);
            divCita.appendChild(sintomasParrafo);
            divCita.appendChild(btnEliminar);
            divCita.appendChild(btnEditar);

            //Agregar las citas al HTML
            contenedorCitas.appendChild(divCita);
        })
    }

    limpiarHTML() {
        while(contenedorCitas.firstChild){
            contenedorCitas.removeChild(contenedorCitas.firstChild);
        }
    }
}

const ui = new UI();
const administrarCitas = new Citas();


//Registro de eventos
eventListeners();

function eventListeners () {
    inputPaciente.addEventListener('input', datosCita);
    inputTelefono.addEventListener('input', datosCita);
    inputFecha.addEventListener('input', datosCita);
    inputHora.addEventListener('input', datosCita);
    inputSintomas.addEventListener('input', datosCita);

    formulario.addEventListener('submit', nuevaCita);
}


//Objeto con la información de la cita
const citaObj = {
    paciente: '',
    telefono: '',
    fecha: '',
    hora:'',
    sintomas:'',
}

//Funciones
//Agrega datos al objeto citaObj
function datosCita (e) {
    citaObj[e.target.name] = e.target.value;

}


//Agrega y valida una nueva cita a la clase Cita
function nuevaCita(e) {
    e.preventDefault();

    //Extraer la información del objeto de cita
    const {paciente, telefono, fecha, hora, sintomas} = citaObj;

    //Validar formulario
    if ( paciente === '' || telefono === '' || fecha === '' || hora === '' || sintomas === '' ) {
    ui.imprimirAlerta('Todos los campos son obligatorios', 'error');

    return;
    };

    if(editando) {
        //Mensaje
        ui.imprimirAlerta('Editado correctamente');

        //Pasar el objeto de la cita a edición
        administrarCitas.editarCitas({...citaObj});

        //Regresar el texto del boton a su estado original
        formulario.querySelector('button[type="submit"]').textContent = 'Crear cita';

        //Quitar el modo edición
        editando = false;

    } else {
        //Crear id único
        citaObj.id = Date.now();

        //Crear una nueva cita
        administrarCitas.agregarCita({...citaObj});

        //Mensaje
        ui.imprimirAlerta('Se agrego correctamente');
    }


    //Reiniciar objeto para la validación
    reiniciarObjeto();

    //Reiniciar formulario
    formulario.reset();

    //Mostrar el HTML de las citas
    ui.imprimirCitas(administrarCitas);
}

function reiniciarObjeto() {
    citaObj.paciente = '';
    citaObj.telefono = '';
    citaObj.fecha = '';
    citaObj.hora = '';
    citaObj.sintomas = '';
}

function eliminarCita(id) {
    //Eliminar citas
    administrarCitas.eliminarCita(id);

    //Muestra mensaje
    ui.imprimirAlerta('La cita se elimino correctamente');

    //Refrescar las citas
    ui.imprimirCitas(administrarCitas);

}
//Cargas los datos y el modo edicion
function cargarEdicion(cita) {
    const {paciente, telefono, fecha, hora, sintomas, id} = cita;

    //Llenar los inputs

    inputPaciente.value = paciente;
    inputTelefono.value = telefono;
    inputFecha.value = fecha;
    inputHora.value = hora;
    inputSintomas.value = sintomas;

    //Llenar objeto
    citaObj.paciente = paciente;
    citaObj.telefono = telefono;
    citaObj.fecha = hora;
    citaObj.hora = hora;
    citaObj.sintomas = sintomas;
    citaObj.id = id;

    //Cambiar el texto del boton
    formulario.querySelector('button[type="submit"]').textContent = 'Guardar cambios';

    editando = true;
}