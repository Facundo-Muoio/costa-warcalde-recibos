import {
	deleteRow,
	editRow,
	totalSum,
	updatedRow,
	validateEmptyInputMensuales,
} from "./funciones.js";
import { table } from "./main.js";

window.addEventListener("DOMContentLoaded", e => {
	window.addEventListener("click", e => {
		if (
			e.target.matches("button[data-bs-target='#modal_mensuales-edicion']") ||
			e.target.matches(".fa-pen-to-square")
		) {
			editRow(e);
		}
		if (e.target.matches(".btn_mensuales-guardar")) {
			e.preventDefault();
			e.preventDefault();
			updatedRow(e);
		}
		if (
			e.target.matches("#tablaMensuales .delete") ||
			e.target.matches("#tablaMensuales .fa-trash")
		) {
			deleteRow(e, "mensuales");
		}
	});

	window.addEventListener("change", e => {
		if (e.target.matches(".form-control")) {
			totalSum("mensuales", e);
		}
		if (
			e.target.matches("#form_mensuales input[name='NOMBRE']") ||
			e.target.matches("#form_mensuales input[name='DNI']") ||
			e.target.matches("#form_mensuales input[name='FECHA']")
		) {
			validateEmptyInputMensuales(e);
		}
	});
});
