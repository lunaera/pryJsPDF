
/*
var headers = ["ID", "Nombre", "Apellidos", "Edad", "sexo"];

// Convertir los datos en un formato adecuado para la tabla
var data = [];
personas.forEach(persona => {
    var row = [];
    row.push(persona.nombre);
    row.push(persona.edad);
    row.push(persona.correo);
    data.push(row);
});

// Configurar el tamaño y estilo de la fuente
doc.setFontSize(12);
doc.setFont("helvetica", "normal");

// Agregar la tabla al documento PDF
doc.autoTable({
    head: [headers],
    body: data,
    startY: 200, // Posición inicial de la tabla en el documento
    theme: "grid", // Estilo de la tabla (opcional)
    margin: { top: 20 } // Margen superior (opcional)
});

// Agregar la tabla al documento PDF
doc.autoTable({
    head: [headers],
    body: data,
    startY: 20, // Posición inicial de la tabla en el documento
    theme: "grid", // Estilo de la tabla (opcional)
    margin: { top: 20 }, // Margen superior (opcional)
    bodyStyles: { // Estilo del cuerpo de la tabla
        textColor: 0,
        fontSize: 8,
        fontStyle: "bold", // Establecer el tipo de letra en negrita para el cuerpo
        font: "helvetica" // Establecer la fuente para el cuerpo
    },
    headStyles: { // Estilo del encabezado de la tabla
        textColor: 0,
        fontSize: 10,
        fontStyle: "bold", // Establecer el tipo de letra en negrita para el encabezado
        font: "times" // Establecer la fuente para el encabezado
    }
});


var columnWidths = [15, 25, 35, 10, 5]; // Anchura de cada columna en orden

// Calcula el ancho total de la tabla sumando los anchos de las columnas
var totalWidth = columnWidths.reduce((acc, width) => acc + width, 0);

// Calcula la posición horizontal donde la tabla debe comenzar para centrarla en la página
var startX = doc.internal.pageSize.width - totalWidth - 20;

// Agrega la tabla al documento PDF
doc.autoTable({
    head: [["ID", "Nombre", "Apellidos", "Edad", "sexo"]],
    body: datosTabla,
    startY: 20, // Posición vertical inicial de la tabla en el documento
    theme: "grid", // Estilo de la tabla (opcional)
    margin: { top: 20 }, // Margen superior (opcional)
    columnStyles: { // Establece los anchos de las columnas
        0: { cellwith: columnWidths[0] },
        1: { cellwith: columnWidths[1] },
        2: { cellwith: columnWidths[2] },
        3: { cellwith: columnWidths[2] },
        4: { cellwith: columnWidths[2] }
    },
    bodyStyles: { // Estilo del cuerpo de la tabla
        textColor: 0,
        fontSize: 8,
        font: 'helvetica',
        fontStyle: "normal" // Establecer el tipo de letra para el cuerpo
    },
    headStyles: { // Estilo del encabezado de la tabla
        textColor: 0,
        fontSize: 10,
        font: 'times',
        fontStyle: "normal" // Establecer el tipo de letra para el encabezado
    },
    // Centrar la tabla en la página
    startX: startX // Posición horizontal donde comenzará la tabla
});





const options = {
    startY: 30, // Posición inicial vertical de la tabla desde el borde del documento PDF

    startX: 150,
    theme: 'grid', // Estilo de la tabla (ver mas abajo estan otros ejemplos)

    //headStyles: { fillColor: [41, 128, 185], textColor: [255, 195, 0], fontSize: 10 },
    headStyles: { fillColor: [41, 128, 185], textColor: 255, fontSize: 12, fontStyle: "bold", font: 'Helvetica', halign: 'center' }, // Estilos del encabezado
    //bodyStyles: { textColor: [255, 195, 0], fontSize: 8 }, // Estilos del cuerpo
    bodyStyles: { textColor: 0, fontSize: 8, font: 'Helvetica' }, // Estilos del cuerpo

    columnStyles: {
        0: { cellWidth: 15 },
        1: { cellWidth: 30 },
        2: { cellWidth: 50 },
        3: { cellWidth: 15 },
        4: { cellWidth: 20 }
    },

    // total de unidades: 215.9
    //columnas: 130
    //margen derecho: 10
    //215-130-10=75


    // align: 'right',
    //autoSize: true,

    // ni funciona
    columnStyles: {
        0: { halign: "center" },
        3: { halign: "center" }, // Para la columna de Edad
        4: { halign: "center" }  // Para la columna de Sexo
    }

};

*/

const categoria = {
    a: 4,
    b: 5,
    c: 6
}

let max = 0;

for (const key in categoria) {
    if (categoria[key] > max) {
        max = categoria[key];
    }
}

console.log(max);






// Define el objeto de configuración para la tabla
const tableConfig = {
    startY: 220, // Posición inicial vertical de la tabla desde el borde del documento PDF
    theme: 'grid', // Estilo de la tabla
    headStyles: { fillColor: [41, 128, 185], textColor: 255, fontSize: 12, fontStyle: "bold", font: 'Georgia', halign: 'center' }, // Estilos del encabezado
    bodyStyles: { textColor: "#FF00FF", fontSize: 11, fontStyle: "bold", font: 'Georgia' }, // Estilos del cuerpo
    margin: { left: 20 }, // Margen izquierdo
};

// Define las columnas y sus anchos
const columns = ["ID", "nombre", "Apellidos", "Edad", "Género"];
const columnWidths = [34, 34, 34, 34, 34];

// Crea la tabla
doc.autoTable({
    head: [columns],
    body: datosTabla,
    columnStyles: { 0: { cellWidth: columnWidths[0] }, 1: { cellWidth: columnWidths[1] }, 2: { cellWidth: columnWidths[2] }, 3: { cellWidth: columnWidths[3] }, 4: { cellWidth: columnWidths[4] } },
    ...tableConfig
});

// Obtén el alto de la página del documento
const pageHeight = doc.internal.pageSize.height;

// Inicializa la posición vertical de la tabla
let posY = tableConfig.startY;



// Verifica si la fila excede el alto de la página
if (posY + doc.lastAutoTable.finalY >= pageHeight - 25) {
    // Agrega una nueva página
    doc.addPage();
    // Vuelve a dibujar el encabezado de la tabla en la nueva página
    doc.autoTable({
        head: [columns],
        startY: 40,
        columnStyles: { 0: { cellWidth: columnWidths[0] }, 1: { cellWidth: columnWidths[1] }, 2: { cellWidth: columnWidths[2] }, 3: { cellWidth: columnWidths[3] }, 4: { cellWidth: columnWidths[4] } },
        ...tableConfig
    });
    // Reinicializa la posición vertical de la tabla
    posY = 220;
}




// ok ok 

const options = {
    startY: 230, // Posición inicial vertical de la tabla desde el borde del documento PDF


    theme: 'grid', // Estilo de la tabla (ver mas abajo estan otros ejemplos)

    //headStyles: { fillColor: [41, 128, 185], textColor: [255, 195, 0], fontSize: 10 },
    headStyles: { fillColor: [41, 128, 185], textColor: 255, fontSize: 12, fontStyle: "bold", font: 'Helvetica', halign: 'center' }, // Estilos del encabezado
    //bodyStyles: { textColor: [255, 195, 0], fontSize: 8 }, // Estilos del cuerpo
    bodyStyles: { textColor: 0, fontSize: 8, font: 'Helvetica' }, // Estilos del cuerpo

    // total de unidades: 215.89
    //columnas: 130
    // headStyles: { rowHeight: 113 },
    autoSize: true,


    // =================anchos de columnas establecidos manualmente
    /* columnStyles: {
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
    body: datosTabla // cuerpo de la tabla cada array es una fila
    , ...options // aplica a la tabla la configuración del objeto options
});



// forma cardoso

/*

        let posY = 120;
        let pageHeight = doc.internal.pageSize.height;
        const columns = ["ID", "Nomnre", "Apellidos", "Edad", "Género"];
        const columnWidths = [34, 34, 34, 34, 34];
        const rowHeight = 15;
        doc.setFont("Helvetica");
        doc.setFontType("bolditalic");
        doc.setTextColor(0);
        doc.setFontSize(12);
        for (let j = 0; j < columns.length; j++) {
            console.log(20 + (j * columnWidths[j]));
            // inicia en margen izq 20 unidades + o*tamColumna, posicionY, ancho de columna, altura de coluna, 1=borde
            doc.cell(20 + (j * columnWidths[j]), posY, columnWidths[j], rowHeight, columns[j], 1);
        }

        // empieza a dibujar el cuerpo a partir de la posicion Y+ la altura de la fila
        posY += rowHeight;

        doc.setFont("Helvetica");
        doc.setFontType("bold");
        doc.setTextColor("#FF00FF");
        doc.setFontSize(11);

        // Función para dibujar el encabezado de la página
        for (let i = 0; i < personas.length; i++) {
            const persona = personas[i];
            doc.cell(20 + (0 * columnWidths[0]), posY, columnWidths[0], rowHeight, String(persona.idPersona));
            doc.cell(20 + (1 * columnWidths[1]), posY, columnWidths[1], rowHeight, persona.nombre);
            doc.cell(20 + (2 * columnWidths[2]), posY, columnWidths[2], rowHeight, "$ " + persona.apellidos);
            doc.cell(20 + (3 * columnWidths[3]), posY, columnWidths[3], rowHeight, persona.edad);
            doc.cell(20 + (4 * columnWidths[4]), posY, columnWidths[4], rowHeight, persona.genero);


            posY += rowHeight;

            if (posY + rowHeight >= pageHeight - 15) {
                doc.addPage();
                encabezado(doc, datosImagen);
                posY = 120;
                pageHeight = doc.internal.pageSize.height;

                // Volver a dibujar el encabezado de la tabla en la nueva página
                doc.setFont("Helvetica");
                doc.setFontType("bolditalic");
                doc.setTextColor(0);
                doc.setFontSize(12);
                for (let j = 0; j < columns.length; j++) {
                    doc.cell(20 + (j * columnWidths[j]), posY, columnWidths[j], rowHeight, columns[j], 1);
                }
                posY += rowHeight;

                doc.setFont("Helvetica");
                doc.setFontType("bold");
                doc.setTextColor("#FF00FF");
                doc.setFontSize(11);
            }
        }

*/