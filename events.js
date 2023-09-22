import { editRow, totalSum, updatedRow } from "./funciones.js";
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
	});

	window.addEventListener("change", e => {
		if (e.target.matches(".form-control")) {
			// totalSum("mensuales", e);
		}
	});
});
