import { table } from "./main.js";

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
		includeNullValues: true,
		dateFormat: "mm/dd/yyyy",
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
	console.log(values);
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
	console.log(id, rowIndex);
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
	renderRow(table, id, objetoDatos);
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

function convertToDate(fecha) {
	let date = new Date(fecha);

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
	if (event.target.value <= 0) {
		event.target.classList.add("is-invalid");
		div.querySelector("label").classList.add("text-danger");
		span.textContent = `El campo ${event.target.name.toLowerCase()} es obligatorio`;
		span.style.display = "inline";
	} else {
		event.target.classList.remove("is-invalid");
		div.querySelector("label").classList.remove("text-danger");
		div.querySelector(".emptyError").style.display = "none";
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
	table.rows().every(function (rowIdx, tableLoop, rowLoop) {
		if (this.data().id === id) {
			idxDataTables = rowIdx;
		}
	});
	table.row(idxDataTables).remove().draw();
}

function print() {
	const datosSeleccionados = table.rows(".select-checkbox").data().toArray();
	console.log(datosSeleccionados);
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
};
