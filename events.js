import {
	alertPdfMensuales,
	deleteRow,
	disabledPrintButton,
	editRow,
	print,
	removeErrors,
	selectAllRows,
	totalSum,
	updatedRow,
	updatingStateCheckbox,
	validateEmptyInputMensuales,
} from "./funciones.js";
import { tablaMensuales } from "./main.js";

window.addEventListener("DOMContentLoaded", e => {
	disabledPrintButton("#btn_mensuales-imprimir");
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
		if (
			e.target.matches(".btn_mensaules-cancelar") ||
			e.target.matches(".btn_mensuales-x")
		) {
			removeErrors();
		}
		if (
			e.target.matches("#btn_mensuales-imprimir") ||
			e.target.matches(".fa-print")
		) {
			print();
		}
		if (e.target.matches("#retryMensuales")) {
			alertPdfMensuales();
		}
	});

	window.addEventListener("change", e => {
		if (e.target.matches("#form_mensuales .form-control")) {
			totalSum("mensuales", e);
		}
		if (
			e.target.matches("#form_mensuales input[name='NOMBRE']") ||
			e.target.matches("#form_mensuales input[name='DNI']") ||
			e.target.matches("#form_mensuales input[name='FECHA']")
		) {
			validateEmptyInputMensuales(e);
		}
		if (e.target.matches("#mesuales_checkbox-all")) {
			selectAllRows(e, tablaMensuales);
			disabledPrintButton("#btn_mensuales-imprimir");
		}
		if (e.target.matches("#tablaMensuales .select-checkbox")) {
			updatingStateCheckbox(tablaMensuales);
			disabledPrintButton("#btn_mensuales-imprimir");
		}
	});
});
