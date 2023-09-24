import {
	deleteRow,
	editRow,
	print,
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
		if (e.target.matches("#btn_mensuales-imprimir")) {
			console.log(
				document.querySelector("#tablaMensuales td:nth-child(13) input")
			);
			// print();
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
		if (e.target.matches("#tablaMensuales #seleccionar-todas")) {
			document.querySelectorAll(".seleccionar-fila").forEach(el => {
				e.target.checked ? (el.checked = true) : (el.checked = false);
			});
			// $("#seleccionar-todas").on("change", function () {
			// 	$(".seleccionar-fila").prop("checked", this.checked);
			// });
		}
		if (e.target.matches("#tablaMensuales .seleccionar-fila")) {
			let selectedRows = table.rows({ selected: true }).count();
			let totalRows = table.rows().count();
			let selectedAllRows = document.querySelector(
				"#tablaMensuales #seleccionar-todas"
			);
			if (selectedRows !== totalRows) {
				selectedAllRows.checked = false;
			} else {
				selectedAllRows.checked = true;
			}
			console.log(selectedRows, totalRows);
		}
	});
});
