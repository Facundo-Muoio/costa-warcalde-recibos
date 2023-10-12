// import { tablaMensuales } from "./main.js";

let uniqueIdCounter = 0;

function saveInLocalStorage(array, name) {
	localStorage.setItem(name, JSON.stringify(array));
}

function getFromLocalStorage(name) {
	return JSON.parse(localStorage.getItem(name));
}

function readExcel(input, schema) {
	return readXlsxFile(input.files[input.files.length - 1], {
		schema,
		dateFormat: "mm/dd/yyyy",
		includeNullValues: true,
		transformData(data) {
			return data.filter(
				row => row.filter(column => column !== null).length > 0
			);
		},
	}).then(({ rows, errors }) => {
		if (errors.length > 0) {
			console.error(errors);
			return false;
		}
		return rows;
	});
}

function generateUniqId(dni) {
	const timestamp = new Date().getTime();
	uniqueIdCounter++;
	return `${dni}_${timestamp}_${uniqueIdCounter}`;
}

function editRow(event) {
	let fila = event.target.closest("tr");
	let id = event.target.closest("tr").lastElementChild.textContent;
	const values = Object.values(
		getFromLocalStorage("mensuales").find(e => e.id === id)
	);
	// console.log(values);
	let rowIndex = fila.rowIndex;
	let $inputs = document.querySelectorAll("#modal_mensuales-edicion input");
	$inputs.forEach((e, i) => {
		if (e.name === "FECHA") {
			let fecha = values[i].split("/").reverse().join("-");
			e.value = fecha;
		} else {
			e.value = values[i];
		}
	});
	if (getFromLocalStorage("row")) {
		saveInLocalStorage({ id, rowIndex }, "row");
	}
	saveInLocalStorage({ id, rowIndex }, "row");
}

function updatedRow(event) {
	let objetoDatos = {};
	let { id, rowIndex } = getFromLocalStorage("row");
	// console.log(id, rowIndex);
	let $inputs =
		event.target.parentElement.previousElementSibling.querySelectorAll("input");
	$inputs.forEach(e => {
		if (e.name === "FECHA") {
			objetoDatos[e.name] = e.value.split("-").reverse().join("/");
		} else {
			objetoDatos[e.name] = e.value;
		}
		//aca debería formatear a moneda los valores
	});
	objetoDatos.id = id;
	const arrayMensuales = getFromLocalStorage("mensuales");
	let index = arrayMensuales.findIndex(e => e.id === id);
	arrayMensuales[index] = objetoDatos;
	saveInLocalStorage(arrayMensuales, "mensuales");
	renderRow(tablaMensuales, id, objetoDatos);
}

function renderRow(tabla, id, objetoDatos) {
	let index;
	tabla.rows().every(function (rowIdx, tableLoop, rowLoop) {
		if (this.data().id === id) {
			index = rowIdx;
		}
	});
	for (let propiedad in objetoDatos) {
		if (objetoDatos[propiedad] === null || objetoDatos[propiedad] === "") {
			objetoDatos[propiedad] = 0;
		}
	}
	tabla.row(index).data(objetoDatos).draw();
}

function convertToDate(date) {
	let dia = date.getUTCDate();
	let mes = date.getUTCMonth() + 1;
	let año = date.getUTCFullYear();

	if (dia < 10) {
		dia = "0" + dia;
	}

	if (mes < 10) {
		mes = "0" + mes;
	}

	let fechaFormateada = `${dia}/${mes}/${año}`;
	return fechaFormateada;
}

function formatingNumberToMoneda(dato) {
	let number = Number(dato) || 0;
	const formatoMoneda = number.toLocaleString("es-AR", {
		style: "currency",
		currency: "ARS",
	});

	return formatoMoneda;
}

function formatingMonedaToNumber(dato) {
	let number = dato.replace(/[^\d.,-]/g, "");
	number = parseFloat(limpio.replace(",", "."));

	return number;
}

function totalSum(tabla, event) {
	let inputs = [...event.target.closest("form").querySelectorAll("input")];
	let arrInputs = inputs.slice(3, 11).map(e => {
		if (!e) {
			return Number((e.value = 0));
		}
		return Number(e.value);
	});
	let total = arrInputs.reduce((acc, cv, index) => {
		let number = cv;
		number ? number : 0;
		if (index >= 4 && index <= 6) {
			acc = acc - number;
		} else {
			acc = acc + number;
		}
		return acc;
	}, 0);
	event.target.closest("form").querySelector("input[name='TOTAL']").value =
		total;
}

function validateEmptyInputMensuales(event) {
	let div = event.target.closest("div");
	let span = div.querySelector(".emptyError");
	let button = document.querySelector(".btn_mensuales-guardar");
	if (event.target.value <= 0) {
		event.target.classList.add("is-invalid");
		div.querySelector("label").classList.add("text-danger");
		span.textContent = `El campo ${event.target.name.toLowerCase()} es obligatorio`;
		span.style.display = "inline";
		button.disabled = true;
	} else {
		event.target.classList.remove("is-invalid");
		div.querySelector("label").classList.remove("text-danger");
		div.querySelector(".emptyError").style.display = "none";
		button.disabled = false;
	}
}

function removeErrors() {
	let inputs = document.querySelectorAll("#form_mensuales input");
	if (document.querySelectorAll("#form_mensuales .emptyError")) {
		document.querySelectorAll("#form_mensuales .emptyError").forEach(e => {
			e.style.display = "none";
		});

		document.querySelectorAll("#form_mensuales label").forEach(e => {
			e.classList.remove("text-danger");
		});

		inputs.forEach(e => {
			e.classList.remove("is-invalid");
		});
	}
}

function deleteRow(event, nameTable) {
	let fila = event.target.closest("tr");
	let idxDataTables;
	let id = fila.querySelector("td:last-child").textContent;
	let array = getFromLocalStorage(nameTable);
	let elementIndex = array.findIndex(e => e.id === id);
	array.splice(elementIndex, 1);
	saveInLocalStorage(array, nameTable);
	tablaMensuales.rows().every(function (rowIdx, tableLoop, rowLoop) {
		if (this.data().id === id) {
			idxDataTables = rowIdx;
		}
	});
	tablaMensuales.row(idxDataTables).remove().draw();
}

function selectAllRows(event, tabla) {
	let checkboxes = [...tabla.rows().nodes().to$().find(".select-checkbox")];
	if (event.target.checked) {
		checkboxes.map(e => (e.checked = true));
		tabla.rows().select();
	} else {
		tabla.rows().deselect();
		checkboxes.map(e => (e.checked = false));
	}
}

function updatingStateCheckbox(tabla) {
	let checkboxAll = document.querySelector("#mesuales_checkbox-all");
	let checkboxes = [...tabla.rows().nodes().to$().find(".select-checkbox")];
	let count = 0;
	checkboxes.map(e => (e.checked ? count++ : ""));
	let totalRows = tabla.rows().count();
	if (count !== totalRows) {
		checkboxAll.checked = false;
	} else {
		checkboxAll.checked = true;
	}
}

function print() {
	const containerPdfs = document.querySelector(".containerPdfs");
	containerPdfs.innerHTML = "";
	containerPdfs.style.display = "block";

	generarPdfMensuales();

	const opciones = {
		margin: 2,
		filename: "recibos-mensuales.pdf",
		html2canvas: { scale: 1 },
		jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
	};

	html2pdf()
		.set(opciones)
		.from(containerPdfs)
		.save()
		.catch(err => console.log(err))
		.finally()
		.then(() => (containerPdfs.style.display = "none"));
}

async function generarPdfMensuales() {
	const contenidoPdf = document.createDocumentFragment();

	const arrMensuales = tablaMensuales.rows({ selected: true }).data().toArray();

	arrMensuales.map(e => {
		const div = document.createElement("div");
		div.classList.add("container_mensuales-recibo");
		const {
			NOMBRE,
			DNI,
			FECHA,
			"HABERES MES": HABERES_MES,
			"HORAS EXTRAS": HORAS_EXTRAS,
			FERIADO,
			VACACIONES,
			ALMUERZO,
			ADELANTO,
			"VACACIONES TOMADAS": VACACIONES_TOMADAS,
			AGUINALDO,
			TOTAL,
		} = e;
		const innerHtmlRecibo = `
			<div class="cabezera">
				<div>
					<img src="imagenes/costa_logo.png" alt="" />
				</div>
				<h3>CORTEO S.R.L</h3>
			</div>
			<div class="filaDos">
				<span
					><em
						>EGUIA ZANÓN 9695 - VILLA WARCALDE - CÓRDOBA - 5021 <br />
						CUIT: 30714850748</em
					></span
				>
				<span>Fecha de pago:</span>
				<span>${FECHA}</span>
			</div>
			<div class="filaTres">
				<h4>Apellido y Nombre</h4>
				<h4>DNI</h4>
				<span>${NOMBRE}</span>
				<span>${DNI}</span>
			</div>
			<div class="filaCuatro">
				<span>Concepto</span>
				<span>Valor</span>
				${
					Number(HABERES_MES)
						? `<span>Haberes Mes</span><span>${formatingNumberToMoneda(
								HABERES_MES
						  )}</span>`
						: ""
				}
				${
					Number(HORAS_EXTRAS)
						? `<span>Horas Extras</span><span>${formatingNumberToMoneda(
								HORAS_EXTRAS
						  )}</span>`
						: ""
				}
				${
					Number(AGUINALDO)
						? `<span>Aguinaldo</span><span>${formatingNumberToMoneda(
								AGUINALDO
						  )}</span>`
						: ""
				}
				${
					Number(FERIADO)
						? `<span>Feriado</span><span>${formatingNumberToMoneda(
								FERIADO
						  )}</span>`
						: ""
				}
				${
					Number(VACACIONES)
						? `<span>Vacaciones</span><span>${formatingNumberToMoneda(
								VACACIONES
						  )}</span>`
						: ""
				}
				${
					Number(ALMUERZO)
						? `<span>Almuerzo</span><span>${formatingNumberToMoneda(
								ALMUERZO
						  )}</span>`
						: ""
				}
				${
					Number(ADELANTO)
						? `<span>Adelanto</span><span>${formatingNumberToMoneda(
								ADELANTO
						  )}</span>`
						: ""
				}
				${
					Number(VACACIONES_TOMADAS)
						? `<span>Vacaciones Tomadas</span><span>${formatingNumberToMoneda(
								VACACIONES_TOMADAS
						  )}</span>`
						: ""
				}
			</div>
			<div class="filaCinco">
				<h4>Total Pesos:</h4>
				<h4>${formatingNumberToMoneda(TOTAL)}</h4>
			</div>
			<div class="filaSeis">
				<span>____________________________________</span>
				<span><em>Firma y Aclaración Empleado</em></span>
			</div>
			<div class="filaSiete">
				<img src="imagenes/costa_logo.png" alt="" />
			</div>
	`;
		div.innerHTML += innerHtmlRecibo;
		contenidoPdf.appendChild(div);
		const copy = div.cloneNode(true);
		copy.classList.add("page-break");
		contenidoPdf.appendChild(copy);
	});

	document.querySelector(".containerPdfs").append(contenidoPdf);
}

function disabledPrintButton(id) {
	const arrMensuales = tablaMensuales.rows({ selected: true }).data().toArray();
	const button = document.querySelector(`${id}`);
	arrMensuales.length ? (button.disabled = false) : (button.disabled = true);
}

function alertPdfMensuales() {
	document.getElementById("alertMensuales").hidden = true;
}

function formatedCase(string) {
	let str = string.toLowerCase();
	return str.replace(/\b\w/g, char => char.toUpperCase());
}

export {
	saveInLocalStorage,
	getFromLocalStorage,
	readExcel,
	generateUniqId,
	editRow,
	updatedRow,
	convertToDate,
	formatingNumberToMoneda,
	formatingMonedaToNumber,
	validateEmptyInputMensuales,
	totalSum,
	deleteRow,
	print,
	selectAllRows,
	updatingStateCheckbox,
	removeErrors,
	disabledPrintButton,
	alertPdfMensuales,
	formatedCase,
};
