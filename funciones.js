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
	if (tabla === "mensuales") {
		let form = event.target.closest("form");
		let arr = [...form.querySelectorAll("input")];
		arr.splice(0, 3);
		arr.splice(arr.length - 1);
		arr.map(e => {
			if (
				e.name !== "VACACIONES TOMADAS" &&
				e.name !== "ADEALNTO" &&
				e.name !== "ALMUERZO"
			) {
				e.value;
			}
		});
	}
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
	totalSum,
};
