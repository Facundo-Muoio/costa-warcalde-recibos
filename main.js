const d = document;
import {
	saveInLocalStorage,
	getFromLocalStorage,
	readExcel,
	generateUniqId,
	convertToDate,
	formatingNumberToMoneda,
} from "./funciones.js";

let arrayMensuales;

const mensualesSchema = {
	NOMBRE: {
		prop: "NOMBRE",
		type: String,
		required: true,
	},
	DNI: {
		prop: "DNI",
		type: Number,
		required: true,
	},
	FECHA: {
		prop: "FECHA",
		type: Date,
		required: true,
	},
	"HABERES MES": {
		prop: "HABERES MES",
		type: String,
	},
	"HORAS EXTRAS": {
		prop: "HORAS EXTRAS",
		type: String,
	},
	FERIADO: {
		prop: "FERIADO",
		type: String,
	},
	VACACIONES: {
		prop: "VACACIONES",
		type: String,
	},
	ALMUERZO: {
		prop: "ALMUERZO",
		type: String,
	},
	ADELANTO: {
		prop: "ADELANTO",
		type: String,
	},
	"VACACIONES TOMADAS": {
		prop: "VACACIONES TOMADAS",
		type: String,
	},
	AGUINALDO: {
		prop: "AGUINALDO",
		type: String,
	},
	TOTAL: {
		prop: "TOTAL",
		type: String,
		required: true,
	},
};

if (
	getFromLocalStorage("mensuales") != false &&
	getFromLocalStorage.length > 0
) {
	arrayMensuales = getFromLocalStorage("mensuales");
}

const $inputExcel = document.getElementById("inputExcel");

$inputExcel.addEventListener("change", async e => {
	arrayMensuales = await readExcel($inputExcel, mensualesSchema);
	arrayMensuales.map(e => {
		e.FECHA = convertToDate(e.FECHA);
		e.id = generateUniqId(e.DNI);
	});
	if (arrayMensuales === false) {
		document.getElementById("alertMensuales").hidden = false;
	} else {
		document.getElementById("alertMensuales").hidden = true;
		saveInLocalStorage(arrayMensuales, "mensuales");
	}
	if (table) {
		table.clear();
		table.rows.add(arrayMensuales);
		table.draw();
	}
});

const table = $("#tablaMensuales").DataTable({
	data: arrayMensuales, // aca también debería formatear a moneda los valores
	columns: [
		{ data: "NOMBRE" },
		{ data: "DNI" },
		{ data: "FECHA" },
		{ data: "HABERES MES" },
		{ data: "HORAS EXTRAS" },
		{ data: "FERIADO" },
		{ data: "VACACIONES" },
		{ data: "ALMUERZO" },
		{ data: "ADELANTO" },
		{ data: "VACACIONES TOMADAS" },
		{ data: "AGUINALDO" },
		{ data: "TOTAL" },
		{
			data: null,
			checkboxes: {
				selectRow: true,
			},
		},
		{
			data: null,
			defaultContent:
				"<button class='btn' data-bs-toggle='modal' data-bs-target='#modal_mensuales-edicion'><i class='fa-solid fa-pen-to-square fa-lg' style='color: #0b5ed7;'></i></button><button class='btn delete'><i class='fa-solid fa-trash fa-lg' style='color: #dc3545; '></i></button>",
			orderable: false,
			width: "250px",
		},
		{ data: "id" },
	],
	columnDefs: [
		{
			targets: [3, 4, 5, 6, 7, 8, 9, 10],
			defaultContent: 0,
			render: function (data, type, row) {
				return formatingNumberToMoneda(data);
			},
		},
		{
			targets: [11],
			render: function (data, type, row) {
				return formatingNumberToMoneda(data);
			},
		},
	],
	select: {
		style: "multi",
	},
	order: [[1, "asc"]],
});

export { table };
