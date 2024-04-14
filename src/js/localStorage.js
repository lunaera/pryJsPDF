// para importar la clase Persona que está en otro script
// import { Persona } from "./Persona.js";


class Persona {
    constructor(id, nombre, apellidos, edad) {
        this.idPersona = id;
        this.nombre = nombre;
        this.apellidos = apellidos;
        this.edad = edad;
    }
}

// se crea un objeto de una funcion, envía como argumento el nombre de la clave para el localStorage
let objDataManager = new dataManager("Personas");

// se crea la función
function dataManager(keyLocalStorage) {

    // convertimos la cadena de datos del localStorage en un objeto JSON, como es una cadena de texto 
    //entonces se convierte a objeto
    let localStorageDB = JSON.parse(localStorage.getItem(keyLocalStorage)) || []; // operador or o de corto circuito



    // hacemos un cierre (clousure)
    return {

        //agregar nuevos datos
        agregar: (objPersona) => {
            localStorageDB.push(objPersona);
            // como se recibe un objeto se debe convertir a cadena JSON
            localStorage.setItem(keyLocalStorage, JSON.stringify(localStorageDB));
        },

        // recuperar datos
        getData: () => {
            return localStorageDB
        },

        // actualizar datos y funciona con el de eliminar
        set: (colection) => {
            localDB = colection;
            localStorage.setItem(keyLocalStorage, JSON.stringify(localDB));
        },
        delete: (index, totElement) => {
            const db = localStorageDB;
            db.splice(index, totElement);
            localStorage.setItem(keyLocalStorage, JSON.stringify(db));
        },
        deleteAll: () => {
            localStorage.clear(keyLocalStorage);
            localStorageDB = [];
        }
    }
}



// =================Paso 5: modificamos los eventos del formulario y después regresar al html==============

document.getElementById("frmDatosPersonales").addEventListener("submit", function (event) {

    event.preventDefault();

    // recuperando datos de los campos
    const idPersona = document.getElementById("idPersona").value;
    const nombre = document.getElementById("nombre").value;
    const apellidos = document.getElementById("apellidos").value;
    const edad = document.getElementById("edad").value;

    // creamos una instancia de la clase Persona y enviamos los datos
    const objPersona = new Persona(idPersona, nombre, apellidos, edad);
    objDataManager.agregar(objPersona);

    // creamos una funcion para las alertas y creamos el css
    mostrarAlerta("Los datos han sido guardados exitosamente!!", "alert alert-success");

    // limpar los campos del formulario
    document.querySelector("#frmDatosPersonales").reset();
});


// =================== Paso 7 mostramos los registros en una tabla ================

document.querySelector("#btnMostrar").addEventListener("click", function () {

    //console.log("Los datos almacenados son: " + objDataManager.getData());
    // recuperamos los datos de la session nos regresa un objeto tipo array

    // recuperamos los datos de la sesión
    const dbPersona = objDataManager.getData();

    //console.log("Los datos de la session son: " + db[0].nombre);
    console.log("tamaño: " + dbPersona.length);

    if (dbPersona.length !== 0) {
        // Mostramos el contenedor ocultado al inicio
        const divTabla = document.getElementById("valoresTabla");
        divTabla.style.display = "block";

        // limpiamos el cuerpo de la tabla por cualquier rastro de inforamción previa
        document.getElementById("cuerpoTabla").textContent = "";

        for (const persona of dbPersona) {
            // creamos una fila
            const fila = document.createElement("tr");

            // crear celdas
            const celdaNumero = document.createElement("td");
            const celdaNombre = document.createElement("td");
            const celdaApellidos = document.createElement("td");
            const celdaEdad = document.createElement("td");
            const celdaAcciones = document.createElement("td");

            // crear los botones y div sin cambios
            divBotones = crearBotones();

            // añadir datos del JSON de la sessión a las celdas
            celdaNumero.textContent = persona.idPersona;
            celdaNombre.textContent = persona.nombre;
            celdaApellidos.textContent = persona.apellidos;
            celdaEdad.textContent = persona.edad;

            // Añadimos los botones a las celdas
            celdaAcciones.appendChild(divBotones);

            // agregar las celdas a la fila
            fila.appendChild(celdaNumero);
            fila.appendChild(celdaNombre);
            fila.appendChild(celdaApellidos);
            fila.appendChild(celdaEdad);
            fila.appendChild(celdaAcciones); // aqui se ocupa la varible que retorna el método

            // agregar la fila a la tabla
            document.getElementById("cuerpoTabla").appendChild(fila);
        }
    }
    else {
        mostrarAlerta("No hay datos que mostrar", "alert alert-danger");
    }
});


//============================ Paso 8 Eventos de los botónes de imágenes

function crearBotones() {

    const divBotones = document.createElement("div");
    divBotones.className = "btn-group";
    const btnEditar = document.createElement("button");
    const btnEliminar = document.createElement("button");
    const btnAceptar = document.createElement("button");

    //Agregar class 
    btnEditar.className = "btn btn-primary";
    btnEliminar.className = "btn btn-danger";
    btnAceptar.className = "btn btn-success";


    // Añadir ruta al botón
    btnEditar.innerHTML = "<img src='src/assets/edit.png' alt='Editar'>";
    btnEliminar.innerHTML = "<img src='src/assets/delete.png' alt='Editar'>";
    //btnAceptar.innerHTML = `<img src='src/assets/cheked.png' alt='Editar'>`;

    //Otra forma de hacerlo sin usar inner es:
    const imgAceptar = document.createElement("img");
    // Establecer atributos de la imagen
    imgAceptar.src = "src/assets/cheked.png";
    imgAceptar.alt = "Aceptar";
    // Agregar la imagen al botón de editar
    btnAceptar.appendChild(imgAceptar);

    // Desabilitamos el botón de aceptar
    btnAceptar.disabled = true;


    // Añadir los botones al div
    divBotones.appendChild(btnEditar);
    divBotones.appendChild(btnEliminar);
    divBotones.appendChild(btnAceptar);


    let filaEditada = null;

    // =============== Paso 8 botón de editar sin cambios

    btnEditar.addEventListener("click", function () {
        // Desabilitamos y habilitamos botones
        btnAceptar.disabled = false;
        btnEliminar.disabled = true;
        btnEditar.disabled = true;

        // identifica la fila a editar su elemento padre
        const fila = this.closest("tr");
        if (fila) {
            filaEditada = fila;
            console.log(filaEditada);
            // Habilitar la edición solo en las celdas necesarias
            habilitarEdicion(filaEditada);
        }
        else {
            console.error("No se pudo encontrar la fila actual.");
        }

    });


    // ==================== paso 2, se cambia dbSesion por dbLocal ==============

    btnAceptar.addEventListener("click", function () {
        if (filaEditada) {
            // Recorrer las celdas de la fila editada

            filaEditada.querySelectorAll('td').forEach(function (celda, index) {
                if (index !== 0 && index !== filaEditada.cells.length - 1) { // filaEditada.cells acceder a las celdas
                    // Obtener el nuevo valor de la celda si se ha editado
                    const nuevoValor = celda.textContent;

                    // Actualizar el contenido de la celda con el nuevo valor
                    celda.textContent = nuevoValor;

                    // Deshabilitar la edición de la celda
                    celda.contentEditable = false;
                }
            });

            // recuperamos los valores de las celdas editadas
            const idPersona = filaEditada.cells[0].textContent;
            const Nombre = filaEditada.cells[1].textContent;
            const Apellidos = filaEditada.cells[2].textContent;
            const Edad = filaEditada.cells[3].textContent;


            console.log(`id ${idPersona} Nombre ${Nombre} Apellidos ${Apellidos} Edad: ${Edad}`);

            // obtenemos los valores previos de la sessión
            const dbLocal = objDataManager.getData();
            console.log(dbLocal);

            for (const persona of dbLocal) {
                if (idPersona === persona.idPersona) {
                    persona.nombre = Nombre;
                    persona.apellidos = Apellidos;
                    persona.edad = Edad;
                }
            }
            // invocamos al metodo set y le enviamos los nuevos datos actualizados
            objDataManager.set(dbLocal);

            // Reiniciar la variable de la fila editada
            filaEditada = null;

            btnAceptar.disabled = true;
            btnEliminar.disabled = false;
            btnEditar.disabled = false;
        }

    });


    // ================= Paso 12 Eliminar y regresar a HTML========

    btnEliminar.addEventListener("click", function () {

        // buscamos la fila mas cercana indicado por tr, recuperando cada uno de sus campos
        const filaEliminar = this.closest("tr");
        console.log(filaEliminar);

        if (filaEliminar) {

            //recuperamos los datos del localStorage
            const dbLocal = objDataManager.getData();
            console.log(dbLocal);

            // obtenemos el id de la persona a eliminar
            const idPersona = filaEliminar.cells[0].textContent;

            // creamos el metodo findIDPersona para obtener el índice de esa persona en el array
            const personaEliminar = findIDPersona(idPersona, dbLocal);

            // si encuentra la coincidencia devuelve el índice en caso contrario devueve un -1
            if (personaEliminar != -1) {
                objDataManager.delete(personaEliminar, 1);
                console.log(dbLocal);

                // Eliminar la fila de la tabla
                filaEliminar.remove();

                // verificar si ya no hay filas que oculte la tabla
                ocultarTablaAfterDelete();
                mostrarAlerta("Registro eliminado exitosamente!!", "alert alert-success");

                if (dbLocal.length === 0) {
                    // si ya no hay filas significa que no hay registros por lo tanto se debe eliminar la base de datos
                    objDataManager.deleteAll();
                }
            }
            else {
                mostrarAlerta("No se encontró el registro a eliminar", "alert alert-danger");
            }

        } else {
            console.error("No se pudo encontrar la fila actual.");
        }
    });

    return divBotones;
}



//============================== Sin cambios ====

function habilitarEdicion(filaActual) {
    const celdas = filaActual.querySelectorAll("td");
    if (celdas.length > 0) {
        // Recorrer las celdas de la fila y habilitar la edición solo en las necesarias
        celdas.forEach(function (celda, index) {
            if (index !== 0 && index !== celdas.length - 1) {
                celda.contentEditable = true;
                celdas[1].focus();
            }
        });
    }
    else {
        console.error("No se encontraron celdas en la fila actual.");
    }

}


//============ Paso 11 Buscar ==========

document.querySelector("#frmBuscar").addEventListener("submit", function (event) {

    event.preventDefault();


    // recuperar el valor de la caja de texto
    const txtIdPersona = document.getElementById("txtIdPersona").value;

    const dbLocal = objDataManager.getData();

    // primera validación cuando no hay nada de datos en la sessión ----TAREA
    if (dbLocal.length !== 0) {

        // crear el método buscarID
        const datosPersona = buscarID(txtIdPersona, dbLocal);

        if (datosPersona !== undefined) {  // si no encuentra el dato regresa un undefined

            console.log("nombre de la persona a buscar: " + datosPersona.nombre);

            // Mostramos el contenedor ocultado al inicio
            const divTabla = document.getElementById("valoresTabla");
            divTabla.style.display = "block";

            // limpiamos el cuerpo de la tabla por cualquier rastro de inforamción previa
            document.getElementById("cuerpoTabla").textContent = "";

            // creamos una fila
            const fila = document.createElement("tr");

            // crear celdas
            const celdaNumero = document.createElement("td");
            const celdaNombre = document.createElement("td");
            const celdaApellidos = document.createElement("td");
            const celdaEdad = document.createElement("td");
            const celdaAcciones = document.createElement("td");

            // crear los botones y div sin cambios
            divBotones = crearBotones();

            // añadir datos del JSON del localStorage a las celdas
            celdaNumero.textContent = datosPersona.idPersona;
            celdaNombre.textContent = datosPersona.nombre;
            celdaApellidos.textContent = datosPersona.apellidos;
            celdaEdad.textContent = datosPersona.edad;

            // Añadimos los botones a las celdas
            celdaAcciones.appendChild(divBotones);

            // agregar las celdas a la fila
            fila.appendChild(celdaNumero);
            fila.appendChild(celdaNombre);
            fila.appendChild(celdaApellidos);
            fila.appendChild(celdaEdad);
            fila.appendChild(celdaAcciones); // aqui se ocupa la varible que retorna el método

            // agregar la fila a la tabla
            document.getElementById("cuerpoTabla").appendChild(fila);
        }
        else {
            mostrarAlerta("no se encontró la persona con el ID", "alert alert-danger");
            ocultarTabla();

        }

    }
    else {
        mostrarAlerta("No hay registros en la base de datos", "alert alert-danger");
    }


});



function mostrarAlerta(msg, alerta) {
    const divresponseInformation = document.getElementById("responseInformation");
    divresponseInformation.textContent = "";
    divresponseInformation.textContent = msg;
    divresponseInformation.className = alerta;
    divresponseInformation.style.display = "block"; // mostrar el contenedor
    divresponseInformation.classList.add("fade-in");

    setTimeout(() => {
        divresponseInformation.classList.add("fade-out");
        setTimeout(() => {
            divresponseInformation.style.display = "none";
            divresponseInformation.classList.remove("fade-in", "fade-out");
        }, 1000); // Tiempo de duración de la animación (1 segundo)
    }, 1000); // Tiempo de visualización del mensaje antes de desaparecer (2 segundos)

}


function buscarID(idPersona, dbLocal) {
    // find devuelve el valor del primer elemento encontrad
    // some devuelve true or false solamente cuando encuentra una coinsidencia

    return dbLocal.find(personas => personas.idPersona === idPersona);
}


function findIDPersona(idPersona, db) {
    // find buscar y devuelve los datos del prime elemento que coincida, en caso contrario devuelve un undefined
    // finIndex devuelve el índice de la primera coicidencia
    //return db.find(clavePersona => clavePersona.idPersona === idPersona);
    return db.findIndex(clavePersona => clavePersona.idPersona === idPersona);
}


function ocultarTablaAfterDelete() {
    const tabla = document.getElementById("cuerpoTabla");
    const numeroFilas = tabla.rows.length;
    if (numeroFilas === 0) {
        document.querySelector("#valoresTabla").style.display = "none";
    }
}

function ocultarTabla() {
    document.querySelector("#valoresTabla").style.display = "none";
}

// TAREA
// ======================== Paso 14 eliminar todos los datos de la session

document.getElementById("btnDeleteAll").addEventListener("click", () => {
    const db = objDataManager.getData();
    if (db.length !== 0) {
        if (confirm("Estas seguro de eliminar la Base de datos?")) {
            objDataManager.deleteAll();

            console.log(db);
            ocultarTabla();
        }
    }
    else {
        mostrarAlerta("La base de datos está vacía", "alert alert-danger");
    }

});