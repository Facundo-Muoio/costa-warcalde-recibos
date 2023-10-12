import {
	convertToDate,
	getFromLocalStorage,
	readExcel,
	saveInLocalStorage,
	formatedCase,
	formatingNumberToMoneda,
} from "./funciones.js";

let arrayJornales;

const jornalesSchema = {
	NOMBRE: {
		prop: "NOMBRE",
		type: String,
	},
	DNI: {
		prop: "DNI",
		type: Number,
	},
	FECHA: {
		prop: "FECHA",
		type: Date,
	},
	"UNIDAD DE NEGOCIO": {
		prop: "UNIDAD DE NEGOCIO",
		type: String,
	},
	"HORAS TRABAJADAS": {
		prop: "HORAS TRABAJADAS",
		type: String,
	},
	SUELDO: {
		prop: "SUELDO",
		type: Number,
	},
};

if (
	getFromLocalStorage("jornales") != false &&
	getFromLocalStorage.length > 0
) {
	arrayJornales = getFromLocalStorage("jornales");
}

const $inputExcel = document.getElementById("inputExcel");

$inputExcel.addEventListener("change", async e => {
	arrayJornales = await readExcel($inputExcel, jornalesSchema);
	if (arrayJornales === false) {
		document.querySelector(".error-section").hidden = false;
	} else {
		document.querySelector(".error-section").hidden = true;
		arrayJornales.map(e => {
			e.NOMBRE = formatedCase(e.NOMBRE);
			e.FECHA = convertToDate(e.FECHA);
			e.SUELDO = formatingNumberToMoneda(e.SUELDO);
		});
		saveInLocalStorage(arrayJornales, "jornales");
	}

	if (tableJornales) {
		tableJornales.clear();
		tableJornales.rows.add(arrayJornales);
		tableJornales.draw();
	}
});

const tableJornales = new $("#tablaJornales").DataTable({
	data: arrayJornales,
	select: {
		style: "multi",
		selector: "td:nth-child(13) input",
	},
	order: [[1, "asc"]],
	columns: [
		{ data: "NOMBRE" },
		{ data: "DNI" },
		{ data: "FECHA" },
		{ data: "UNIDAD DE NEGOCIO" },
		{ data: "HORAS TRABAJADAS" },
		{ data: "SUELDO" },
		{
			data: null,
			defaultContent: "<input type='checkbox' class='select-checkbox'></input>",
		},
		{
			data: null,
			defaultContent: `
			<div>
					<button class="btn-edit">
						<i
							class="fa-solid fa-pen-to-square fa-xl"
							style="color: #0b5ed7;"
						></i>
					</button>
					<button class="btn-delete">
						<i class="fa-solid fa-trash fa-xl" style="color: #dc3545"></i>
					</button>
				</div>`,
		},
	],
	columnDefs: [{ target: [3, 4, 5, 6, 7], orderable: false }],
	language: {
		processing: "Procesando...",
		lengthMenu: "Mostrar _MENU_ registros",
		zeroRecords: "No se encontraron resultados",
		emptyTable: "Ningún dato disponible en esta tabla",
		infoEmpty: "Mostrando registros del 0 al 0 de un total de 0 registros",
		infoFiltered: "(filtrado de un total de _MAX_ registros)",
		search: "Buscar:",
		loadingRecords: "Cargando...",
		paginate: {
			first: "Primero",
			last: "Último",
			next: "Siguiente",
			previous: "Anterior",
		},
		aria: {
			sortAscending: ": Activar para ordenar la columna de manera ascendente",
			sortDescending: ": Activar para ordenar la columna de manera descendente",
		},

		info: "Mostrando _START_ a _END_ de _TOTAL_ registros",
	},
});
