import { inputChecks } from "./funciones.js";

window.addEventListener("DOMContentLoaded", e => {
	inputChecks(document.querySelector("#checkboxControl"));
	document.querySelector("body").addEventListener("click", e => {
		if (e.target.matches("#checkboxControl")) {
			inputChecks(e.target);
		}
	});
});
