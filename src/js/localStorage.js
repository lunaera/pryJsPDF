// para importar la clase Persona que está en otro script
// import { Persona } from "./Persona.js";


class Persona {
    constructor(id, nombre, apellidos, edad, genero) {
        this.idPersona = id;
        this.nombre = nombre;
        this.apellidos = apellidos;
        this.edad = edad;
        this.genero = genero;
    }
}



// se crea la clase
class DataManager {

    constructor(keyLocalStorage) {
        this.keyLocalStorage = keyLocalStorage;
        // convertimos la cadena de datos del localStorage en un objeto JSON, como es una cadena de texto
        //entonces se convierte a objeto
        this.localStorageDB = JSON.parse(localStorage.getItem(this.keyLocalStorage)) || [];
    }

    getData() {
        return this.localStorageDB;
    }
    //agregar nuevos datos
    agregar(objPersona) {
        this.localStorageDB.push(objPersona);
        // como se recibe un objeto se debe convertir a cadena JSON
        localStorage.setItem(this.keyLocalStorage, JSON.stringify(this.localStorageDB));
    }

    // actualizar datos y funciona con el de eliminar
    set(colection) {
        this.localStorageDB = colection;
        localStorage.setItem(this.keyLocalStorage, JSON.stringify(this.localStorageDB));
    }
    delete(index, totElement) {
        const db = this.localStorageDB;
        db.splice(index, totElement);
        localStorage.setItem(this.keyLocalStorage, JSON.stringify(db));
    }
    deleteAll() {
        localStorage.clear(this.keyLocalStorage);
        this.localStorageDB = [];
    }
}


// se crea un objeto de una funcion, envía como argumento el nombre de la clave para el localStorage
const objDataManager = new DataManager("Personas");

// =================Paso 5: modificamos los eventos del formulario y después regresar al html==============

document.getElementById("frmDatosPersonales").addEventListener("submit", function (event) {

    event.preventDefault();

    // recuperando datos de los campos
    const idPersona = document.getElementById("idPersona").value;
    const nombre = document.getElementById("nombre").value;
    const apellidos = document.getElementById("apellidos").value;
    const edad = document.getElementById("edad").value;
    const genero = document.querySelector('input[name="genero"]:checked').value;

    // creamos una instancia de la clase Persona y enviamos los datos
    const objPersona = new Persona(idPersona, nombre, apellidos, edad, genero);
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
            const celdaGenero = document.createElement("td");
            const celdaAcciones = document.createElement("td");

            // crear los botones y div sin cambios
            divBotones = crearBotones();

            // añadir datos del JSON de la sessión a las celdas
            celdaNumero.textContent = persona.idPersona;
            celdaNombre.textContent = persona.nombre;
            celdaApellidos.textContent = persona.apellidos;
            celdaEdad.textContent = persona.edad;
            celdaGenero.textContent = persona.genero;

            // Añadimos los botones a las celdas
            celdaAcciones.appendChild(divBotones);

            // agregar las celdas a la fila
            fila.appendChild(celdaNumero);
            fila.appendChild(celdaNombre);
            fila.appendChild(celdaApellidos);
            fila.appendChild(celdaEdad);
            fila.appendChild(celdaGenero);
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
            const Genero = filaEditada.cells[4].textContent;


            console.log(`id ${idPersona} Nombre ${Nombre} Apellidos ${Apellidos} Edad: ${Edad} Sexo:${Genero}`);

            // obtenemos los valores previos de la sessión
            const dbLocal = objDataManager.getData();
            console.log(dbLocal);

            for (const persona of dbLocal) {
                if (idPersona === persona.idPersona) {
                    persona.nombre = Nombre;
                    persona.apellidos = Apellidos;
                    persona.edad = Edad;
                    persona.genero = Genero;
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
            const celdaGenero = document.createElement("td");
            const celdaAcciones = document.createElement("td");

            // crear los botones y div sin cambios
            divBotones = crearBotones();

            // añadir datos del JSON del localStorage a las celdas
            celdaNumero.textContent = datosPersona.idPersona;
            celdaNombre.textContent = datosPersona.nombre;
            celdaApellidos.textContent = datosPersona.apellidos;
            celdaEdad.textContent = datosPersona.edad;
            celdaGenero.textContent = datosPersona.genero;

            // Añadimos los botones a las celdas
            celdaAcciones.appendChild(divBotones);

            // agregar las celdas a la fila
            fila.appendChild(celdaNumero);
            fila.appendChild(celdaNombre);
            fila.appendChild(celdaApellidos);
            fila.appendChild(celdaEdad);
            fila.appendChild(celdaGenero);
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




document.getElementById("btnExportPDF").addEventListener("click", async () => {

    try {

        // 1 obtenemos la url de la caja de texto o localmente
        // COLOCAR EN LA CAJA DE TEXTO: src/assets/zapateria.WEBP       RUTA DE LA IMAGEN O DIRECTAMENTE EN LA VARIABLE
        const urlImage = document.getElementById("txtURLimg").value;
        //ruta imagen itvo
        //https://th.bing.com/th/id/R.6345aaa8e040b5764c3eb89f6c5dffbf?rik=73l1M5sM5T1Q7A&riu=http%3a%2f%2fsic.cultura.gob.mx%2fimages%2f63912&ehk=H47zdzlYKzXZX8NdAgT7MPLu5qzuwoUZQi8NzCQSUco%3d&risl=&pid=ImgRaw&r=0

        //const urlImage = "src/assets/zapateria.WEBP";

        // ================cargamos la imagen mediante una la función asincrona
        const datosImagen = await cargarImagen(urlImage);


        // =============================== Crea un nuevo documento PDF 117% en chrome para pdf
        // una hoja t/c tiene 21.59 mm de ancho y 27.94 de alto


        /*
        const doc = new jsPDF({   // version 1.5.3
            orientation: 'portrait', // postrait=> vertical 'landscape' = horizontal
            format: 'letter', // Formato de la página y respeta el amrgen inferior del pie de pagina
            unit: 'mm', // Unidades en milímetros
            /*margin: {
                top: 50, right: 50, bottom: 10, left: 10
            }*/
        //});


        //const doc = new jspdf.jsPDF('P'); // si lleva L se refiere que el formato de la hoja es horizontal P vertical

        const doc = new jspdf.jsPDF({  //ultima version 2.5.1 pero no acepta el setFontType asu vez es doc.setFont("Helvetica", "bold");
            orientation: 'portrait', // postrait=> vertical 'landscape' = horizontal
            format: 'letter', // Formato de la página y respeta el amrgen inferior del pie de pagina
            unit: 'mm', // Unidades en milímetros
            /*margin: {
                top: 50, right: 50, bottom: 10, left: 10
            }*/
        });

        //====================================creamos el encabezado
        encabezado(doc, datosImagen);

        // 5 AÑADIMOS LA IMAGEN AL DOCUMENTO
        //doc.addImage(datosImagen, 'JPG', 0, 0, 50, 50); // 0 0 significa coordenas x y y ------- 50 50 es el tamaño w y h

        // Añade una página vacía al documento
        //doc.addPage();


        const personas = objDataManager.getData();
        const datosTabla = personas.map(persona => [persona.idPersona, persona.nombre, persona.apellidos, persona.edad, persona.genero]);
        console.log(personas);


        // ============ se usa la libreria jspdf-autotable

        // una hoja t/c tiene 21.59 (215.9) cm de ancho y 27.94 (279.4) de alto 
        const options = {
            startY: 180, // Posición inicial vertical de la tabla desde el borde del documento PDF


            theme: 'grid', // Estilo de la tabla (ver mas abajo estan otros ejemplos)

            //headStyles: { fillColor: [41, 128, 185], textColor: [255, 195, 0], fontSize: 10 },
            headStyles: { fillColor: [41, 128, 185], textColor: 255, fontSize: 12, fontStyle: "bold", font: 'Helvetica', halign: 'center' }, // Estilos del encabezado
            //bodyStyles: { textColor: [255, 195, 0], fontSize: 8 }, // Estilos del cuerpo
            bodyStyles: { textColor: 0, fontSize: 8, font: 'Helvetica' }, // Estilos del cuerpo

            // total de unidades: 215.89
            //columnas: 130
            // headStyles: { rowHeight: 113 },


            autoSize: true,

            // divide las columnas si no cambe horizontalmente
            // split overflowing columns into pages
            /*
            horizontalPageBreak: true,
            horizontalPageBreakRepeat: 0, // repeat this column in split pages*/


            /*
            // =================anchos de columnas establecidos manualmente, se queda el autoZise
            columnStyles: {
                0: { cellWidth: 15, halign: "center" },
                1: { cellWidth: 30 },
                2: { cellWidth: 50 },
                3: { cellWidth: 15, halign: "center" },
                4: { cellWidth: 20, halign: "center" }
            },
            //margin: { left: 10, right: doc.internal.pageSize.getWidth() - 130 - 10 } // alinear a la izquierda
            //margin: { right: 10, left: doc.internal.pageSize.getWidth() - 130 - 10 } // alinear a la derecha
            margin: { left: (doc.internal.pageSize.getWidth() - 130) / 2, right: 42.945 } // alinear a al centro right tiene que medir exacto con lo que mide left
*/
        };


        console.log(doc.internal.pageSize.getWidth());

        // Agregar la tabla al documento PDF
        // en el head es un arrays de array por si se desea otra fila de encabezado
        //doc.autoTable({ head: [[fila1], [fila2]] etc
        doc.autoTable({
            head: [['ID', 'Nombre', 'Apellidos', 'Edad', 'Genero']],
            body: datosTabla,
            ...options,
            didParseCell: function (data) {
                if (data.section !== "head" && data.column.index === 3) { // Verifica si no es el encabezado y si es la columna de la Edad
                    const edad = parseFloat(data.cell.raw); // Convierte el valor de la celda a un número
                    if (!isNaN(edad)) { // Verifica si es un número válido
                        // Formatea el valor como moneda
                        const formattedValue = "$" + edad.toFixed(2); // Formato de moneda con dos decimales
                        data.cell.text = formattedValue; // Establece el texto de la celda con el nuevo formato
                    }
                }
            }
        });











        // ============ FUnciona sin linbreria autoTable
        /*
        let posY = 200;
        const rowHeight = 15; // Altura de la fila
        const columns = ["ID", "Nomnre", "Apellidos", "Edad", "Género"];
        const columnWidths = [34, 34, 34, 34, 34];
        const margin = 20; // Margen izquierdo
        // Función para dibujar el encabezado de la tabla
        function drawTableHeader() {
         
         
         
         
         
         
            doc.setFont("Helvetica");
            doc.setFontType("bolditalic");
            doc.setTextColor(0);
            doc.setFontSize(12);
            for (let j = 0; j < columns.length; j++) {
                doc.cell(margin + (j * columnWidths[j]), posY, columnWidths[j], rowHeight, columns[j], 1);
            }
            posY += rowHeight;
        }
         
        // Función para dibujar el contenido de cada persona
        function drawPersona(persona) {
            doc.setTextColor('FF00FF');
            console.log("tabla:" + columns.length);
            const clave = Object.keys(persona);
            console.log("clave" + clave);
            console.log("Persona" + clave.length);
         
            for (let i = 0; i < columns.length; i++) {
                doc.cell(margin + (i * columnWidths[i]), posY, columnWidths[i], rowHeight, persona[clave[i]]);
            }
            posY += rowHeight;
        }
         
        // Función para verificar si es necesario agregar una nueva página
        function checkNewPage() {
            let pageHeight = doc.internal.pageSize.height;
            if (posY + rowHeight >= pageHeight - 15) {
                doc.addPage();
                encabezado(doc, datosImagen);
                posY = 30;
                pageHeight = doc.internal.pageSize.height;
                drawTableHeader();
            }
        }
         
        // Dibujar encabezado de la tabla en la primera página
        drawTableHeader();
         
        // Iterar sobre las personas y dibujar su contenido
        for (let i = 0; i < personas.length; i++) {
            drawPersona(personas[i]);
            checkNewPage();
        }
         
        */





        // Obtener el total de mujeres y hombres

        const categoryCounts = {};

        for (const persona of personas) { // recorre la base de datos localstorage
            if (categoryCounts.hasOwnProperty(persona.genero)) { // verifica si ya tiene una propiedad con esa categoría
                categoryCounts[persona.genero]++; // si ya lo tiene, entonces solo incrementa la unidad
            } else {
                categoryCounts[persona.genero] = 1; // en caso contrario crea una nueva propiedad y le da el valor de 1
            }

        }

        console.log(categoryCounts);



        // ========================== Graficar
        doc.addPage();
        encabezado(doc, datosImagen);

        // Crear gráfica de barras 
        const chartPosX = 10; // margen izquierdo 
        const chartPosY = 200; // margen superior  hasta el inicio de la gráfica
        const chartWidth = 180; // ancho total de la gráfica de barra
        const maxBarHeight = 100; // altura máxima de la gráfica de barras
        const barSpacing = 5; // espaciado entre columnas

        grafica(doc, categoryCounts, chartPosX, chartPosY, chartWidth, maxBarHeight, barSpacing); // Valores de ejemplo para las coordenadas y dimensiones del gráfico







        // ========================== Estilo para número de páginas

        //doc.setFont("Helvetica"); // fuente vieja libreria
        doc.setFont("Helvetica", "bold"); // nueva libreria jspdf 2.5.1
        // doc.setFontType("bold"); // estilo con vieja libreria, va con setFont
        doc.setFontSize(10); // tamaño
        doc.setTextColor(0, 230, 255); // establece el color en RGB (0, 0, 255) azul

        // Obtener el número total de páginas
        const totalPages = doc.internal.getNumberOfPages();

        // Agregar números de página a cada página
        for (let i = 1; i <= totalPages; i++) {
            // Ir a la página específica
            doc.setPage(i);
            // Agregar el número de página en la parte inferior de la página
            //doc.text(`Página ${i} de ${totalPages}`, doc.internal.pageSize.getWidth() / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });

            // Agregar el número de página en la parte inferior derecha de la página
            doc.text(`Página ${i} de ${totalPages}`, doc.internal.pageSize.getWidth() - 10, doc.internal.pageSize.getHeight() - 10, { align: 'right' });
        }



        //  devuelve un objeto blob del documento PDF generado mediante una promesa 
        //Blob (Binary Large Object) es un tipo de objeto en JavaScript que representa datos binarios
        const pdfBlob = new Promise((resolve) => {
            // Guarda el documento como un blob osea en formato blob
            const blob = doc.output('blob');
            resolve(blob); // la promesa se cumplirá con el objeto blob creado
        });

        // Espera a que se resuelva la promesa
        const blob = await pdfBlob;

        // Aquí puedes hacer lo que necesites con el blob, como descargarlo
        saveAs(blob, "documento.pdf");
    }
    catch (error) {
        console.log("Error" + error);
    }
});




function cargarImagen(url) {

    // devolvemos una promesa
    return new Promise(function (resolve, reject) {

        // creamos un obj Imagen
        var img = new Image();
        img.crossOrigin = "anonymous"; // evitar que se bloquee al cargar la imágen


        /**
         * onload y onerror se colocan antes de asignar la url a la imagen para garantizar 
         * que las funciones onload y onerror estén configuradas correctamente 
         * antes de que comience el proceso de carga de la imagen.
         * Esto asegura que estas funciones estén listas para manejar el éxito o el fracaso 
         * de la carga de la imagen desde el momento en que se inicia el proceso de carga.
         */


        img.onload = function () { // se ejecutará cuando la imagen se cargue completamente en el navegador

            // se crea un nuevo lienzo para crear gráficos como imagenes 
            var canvas = document.createElement('canvas');
            // se obtiene un contexto para dibujar en el lienzo
            var ctx = canvas.getContext('2d');
            canvas.width = img.width; // se establece el ancho del lienzo que coincida con el ancho de la imagen
            canvas.height = img.height; // se establece el alto del lienzo que coincida con la altura de la imagen
            ctx.drawImage(img, 0, 0); // se dibuja la imagen en la posicion 0,0 osea a la izquierda

            //Se convierte el contenido del lienzo en una URL de datos en formato JPEG
            var dataURL = canvas.toDataURL('image/JPG');

            //Se resuelve la promesa con la URL de datos de la imagen generada. 
            //Esto significa que la promesa se completará exitosamente con la URL de datos de la imagen
            resolve(dataURL);
        };

        // en caso de que se genere un error al cargar la imagen se ejecuta oneerror
        img.onerror = function () {
            reject(new Error('Failed to load image'));
        };

        // Se asigna la URL de la imagen al objeto de imagen para iniciar el proceso de carga de la imagen
        /**
         * En este punto, el navegador comienza a cargar la imagen desde la URL especificada. 
         * La carga de la imagen es una operación asíncrona, por lo que el código continuará ejecutándose 
         * mientras la imagen se carga en segundo plano.
         */
        img.src = url;
    });
}


function encabezado(doc, datosImagen) {

    //doc.setFont("Helvetica");//vieja librería
    doc.setFont("Helvetica", "bold"); // fuente y estylo con nueva libreria 2.5.1 de jspdf
    // doc.setFontType("bold"); // estilo con libreria 1.5.
    doc.setFontSize(20); // tamaño
    doc.setTextColor(0, 0, 255); // establece el color en RGB (0, 0, 255) azul

    /**
     * reporte personal es el título del pdf
     * doc.internal.pageSize.getWidth() / 2 => obtiene el ancho de la página y lo divide entre 2 para poder centrar
     * 12 ==> es el espacio vertical en relación al margen superior, 12 unidades
     * { align: "center" } => centrado
     */
    doc.text("Reporte del Personal", doc.internal.pageSize.getWidth() / 2, 20, { align: "center" });


    // este bloque coloca un texto inclinado
    /*
    doc.setFontSize(12);
    doc.setFont("Georgia");
    doc.setFontType("bolditalic");
    doc.setTextColor(0, 134, 156);
    doc.text("#INFOTICS", 10, 10, 25, 20); //x=10, y=30, ancho=25, alto=20   25 grado =hace que el texto esté inclinado
*/

    // doc.addImage(datosImagen, 'JPG', 0, 0, 50, 50); // 0 0 significa coordenas x y y ------- 25 25 es el tamaño w y h
    doc.addImage(datosImagen, 'JPEG', 0, 0, 25, 25);
    //doc.setTextColor(255, 0, 0);
}



/**
 * plain: Este estilo elimina todos los bordes de la tabla, dejando solo el contenido de las celdas sin ningún tipo de borde visible.
striped: Este estilo alterna los colores de fondo de las filas de la tabla, creando un efecto de rayas. Una fila tendrá un fondo de color y la siguiente fila tendrá un fondo de color diferente.
grid: Este estilo es el que ya conocemos, que agrega bordes visibles alrededor de cada celda, creando un efecto de cuadrícula.
row: Este estilo solo agrega bordes alrededor de las filas de la tabla, dejando las columnas sin bordes.
row-and-column: Este estilo agrega bordes alrededor de las filas y columnas de la tabla, creando un efecto de rejilla pero sin bordes en el interior de las celdas.
 */

// Función para generar el gráfico de barras
function grafica(doc, categoryCounts, chartPosX, chartPosY, chartWidth, maxBarHeight, barSpacing) {
    const categoryColors = {
        Hombre: [0, 0, 255], // Azul
        Mujer: [255, 0, 0], // Rojo
        Mujerr: [0, 0, 205], // 
        Hombr: [0, 234, 0] // 
    };

    //calcular el total de ancho de cada barra de la gráfica.
    //Object.keys(categoryCounts).length: devuelve el número total de categorías en el objeto categoryCounts
    const barWidth = (chartWidth - (barSpacing * (Object.keys(categoryCounts).length - 1))) / Object.keys(categoryCounts).length;

    //console.log(Object.keys(categoryCounts).length - 1); //imprime 3 
    //console.log(Object.keys(categoryCounts).length - 1) // imprime 4
    console.log(barWidth); // imprime el ancho de cada barra





    // ==================== cuenta el valor máximo de la categoría para ver quién tendrá la barra mas alta
    let maxCount = 0;
    for (const category in categoryCounts) {
        if (categoryCounts[category] > maxCount) {
            maxCount = categoryCounts[category];

        }
    }


    /**
     * currentBarX: Esta variable lleva un seguimiento de la posición actual en el eje X donde se dibujará 
     * la próxima barra en el gráfico. Inicialmente se establece en chartPosX, 
     * que es la posición horizontal donde comienza el gráfico de barras.
     */
    let currentBarX = chartPosX;


    // =================== Graficando las barras ========

    for (const category in categoryCounts) {
        // altura de cada barra
        const barHeight = (categoryCounts[category] / maxCount) * maxBarHeight; //altura maxima:10

        // se le aplica un color a cada barra
        const color = categoryColors[category]; // se recupera el nombre del color
        doc.setFillColor(color[0], color[1], color[2]); // se le aplica el color RGB


        // rectángulo en la posición (currentBarX, chartPosY) con el ancho barWidth y la altura negativa barHeight
        doc.rect(currentBarX, chartPosY, barWidth, -barHeight, "F"); // la F indica que se debe colorear el rentángulo


        doc.setTextColor(0); // color de texto para el total de cada categoría
        doc.setFontSize(12); // tamaño de texto del total de cada categoría
        // 10 + (barWidth=41.25/2)-5=25.6                    200+5=205, valor de cada categoria
        // ejeX, ejeY, valor
        doc.text(currentBarX + (barWidth / 2) - 5, chartPosY + 5, String(categoryCounts[category]));


        //lo mismo para las etiquetas de categoría pero para el eje Y se le suman otros 5
        //doc.setFontType("bolditalic");
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(10);
        doc.text(currentBarX + (barWidth / 2) - 5, chartPosY + 10, category, { maxWidth: barWidth, align: "center" });


        // se actualiza la posición del eje X
        currentBarX += barWidth + barSpacing;
    }
}



/*
        const chartPosX = 10; // margen izquierdo 
        const chartPosY = 200; // margen superior  hasta el inicio de la gráfica
        const chartWidth = 180; // ancho total de la gráfica de barra
        const maxBarHeight = 100; // altura máxima de la gráfica de barras
        const barSpacing = 5; // espaciado entre columnas
*/