import {
	alertPdfMensuales,
	deleteRow,
	disabledPrintButton,
	editRow,
	editRowJornalesProveedores,
	openModal,
	print,
	removeErrors,
	selectAllRows,
	totalSum,
	updatedRow,
	updatingStateCheckbox,
	validateEmptyInputMensuales,
	closeModal,
	checkInputExcel,
	checkInputExcelMensuales,
	updateRowJoranlesProveedores,
} from "./funciones.js";

import {
	arrayMensuales,
	mensualesSchema,
	$inputExcelMensuales,
	tablaMensuales,
} from "./main.js";

import {
	arrayJornales,
	jornalesSchema,
	$inputExcelJornales,
	tableJornales,
} from "./jornales.js";

import {
	$inputExcelProveedores,
	arrayProveedores,
	proveedoresSchema,
	tableProveedores,
} from "./proveedores.js";

let locationPathName = window.location.pathname;
let regEx = /([^/]+)\.html$/g;
let newStr = String(locationPathName.match(regEx)).split(".")[0];

window.addEventListener("DOMContentLoaded", e => {
	if (newStr === "index") {
		disabledPrintButton("#btn_mensuales-imprimir", tablaMensuales);
	}
	if (newStr === "Jornales") {
		disabledPrintButton("#btn_jornales-imprimir", tableJornales);
	}
	if (newStr === "Proveedores") {
		disabledPrintButton("#btn_proveedores-imprimir", tableProveedores);
	}

	window.addEventListener("click", e => {
		if (
			e.target.matches(".btn_mensuales-edit") ||
			e.target.matches(".btn_mensuales-edit")
		) {
			editRow(e);
		}

		if (e.target.matches(".btn_jornales-edit")) {
			openModal();
			editRowJornalesProveedores(e, "jornales");
		}

		if (e.target.matches(".btn_proveedores-edit")) {
			openModal();
			editRowJornalesProveedores(e, "proveedores");
		}

		if (
			e.target.matches(".btn_modal-cancelar") ||
			e.target.matches(".fa-xmark")
		) {
			closeModal();
		}

		if (e.target.matches(".btn_mensuales-guardar")) {
			e.preventDefault();
			updatedRow(e, tablaMensuales);
		}

		if (e.target.matches(".btn_jornales-guardar")) {
			updateRowJoranlesProveedores(e, tableJornales, "jornales");
			closeModal();
		}

		if (e.target.matches(".btn_proveedores-guardar")) {
			updateRowJoranlesProveedores(e, tableProveedores, "proveedores");
			closeModal();
		}

		if (
			e.target.matches("#tablaMensuales .delete") ||
			e.target.matches("#tablaMensuales .fa-trash")
		) {
			deleteRow(e, "mensuales", tablaMensuales);
		}

		if (e.target.matches(".btn_jornales-delete")) {
			deleteRow(e, "jornales", tableJornales);
		}

		if (e.target.matches(".btn_proveedores-delete")) {
			deleteRow(e, "proveedores", tableProveedores);
		}

		if (
			e.target.matches(".btn_mensaules-cancelar") ||
			e.target.matches(".btn_mensuales-x")
		) {
			removeErrors();
		}
		if (
			e.target.matches("#btn_mensuales-imprimir") ||
			e.target.matches("#btn_mensuales-imprimir .fa-print")
		) {
			print(tablaMensuales, "mensuales");
		}

		if (
			e.target.matches("#btn_jornales-imprimir") ||
			e.target.matches("#btn_jornales-imprimir .fa-print")
		) {
			print(tableJornales, "jornales");
		}

		if (
			e.target.matches("#btn_proveedores-imprimir") ||
			e.target.matches("#btn_proveedores-imprimir .fa-print")
		) {
			print(tableProveedores, "proveedores");
		}

		if (e.target.matches("#retryMensuales")) {
			alertPdfMensuales();
		}
	});

	window.addEventListener("change", e => {
		if (e.target.matches("#inputExcelMensuales")) {
			checkInputExcelMensuales(
				$inputExcelMensuales,
				mensualesSchema,
				arrayMensuales,
				tablaMensuales
			);
		}

		if (e.target.matches("#inputExcelJornales")) {
			checkInputExcel(
				$inputExcelJornales,
				jornalesSchema,
				arrayJornales,
				tableJornales
			);
		}

		if (e.target.matches("#inputExcelProveedores")) {
			checkInputExcel(
				$inputExcelProveedores,
				proveedoresSchema,
				arrayProveedores,
				tableProveedores
			);
		}

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
			disabledPrintButton("#btn_mensuales-imprimir", tablaMensuales);
		}

		if (e.target.matches("#jornales_checkbox-all")) {
			selectAllRows(e, tableJornales);
			disabledPrintButton("#btn_jornales-imprimir", tableJornales);
		}

		if (e.target.matches("#proveedores_checkbox-all")) {
			selectAllRows(e, tableProveedores);
			disabledPrintButton("#btn_proveedores-imprimir", tableProveedores);
		}

		if (e.target.matches("#tablaMensuales .select-checkbox")) {
			updatingStateCheckbox(tablaMensuales);
			disabledPrintButton("#btn_mensuales-imprimir", tablaMensuales);
		}

		if (e.target.matches("#tablaJornales .select-checkbox")) {
			updatingStateCheckbox(tableJornales);
			disabledPrintButton("#btn_jornales-imprimir", tableJornales);
		}

		if (e.target.matches("#tablaProveedores .select-checkbox")) {
			updatingStateCheckbox(tableProveedores);
			disabledPrintButton("#btn_proveedores-imprimir", tableProveedores);
		}
	});
});
