const d = document;
import {
	saveInLocalStorage,
	getFromLocalStorage,
	readExcel,
	generateUniqId,
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
		type: Number,
	},
	"HORAS EXTRAS": {
		prop: "HORAS EXTRAS",
		type: Number,
	},
	FERIADO: {
		prop: "FERIADO",
		type: Number,
	},
	VACACIONES: {
		prop: "VACACIONES",
		type: Number,
	},
	ALMUERZO: {
		prop: "ALMUERZO",
		type: Number,
	},
	ADELANTO: {
		prop: "ADELANTO",
		type: Number,
	},
	"VACACIONES TOMADAS": {
		prop: "VACACIONES TOMADAS",
		type: Number,
	},
	AGUINALDO: {
		prop: "AGUINALDO",
		type: Number,
	},
	TOTAL: {
		prop: "TOTAL",
		type: Number,
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
	arrayMensuales.map(e => (e.id = generateUniqId(e.DNI)));
	if (arrayMensuales === false) {
		document.getElementById("alertMensuales").hidden = false;
	} else {
		document.getElementById("alertMensuales").hidden = true;
		saveInLocalStorage(arrayMensuales, "mensuales");
	}
});

const table = $("#tablaMensuales").DataTable({
	data: arrayMensuales,
	columns: [
		{ data: "NOMBRE" },
		{ data: "id", visible: false },
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
				"<button class='btn'><i class='fa-solid fa-pen-to-square fa-lg' style='color: #0b5ed7;'></i></button><button class='btn'><i class='fa-solid fa-trash fa-lg' style='color: #dc3545; '></i></button>",
			orderable: false,
			width: "250px",
		},
	],
	select: {
		style: "multi",
	},
	order: [[1, "asc"]],
});
