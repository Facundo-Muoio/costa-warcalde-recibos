function saveInLocalStorage(array, name) {
	localStorage.setItem(name, JSON.stringify(array));
	console.log("Guardado en localstorage.");
}

function getFromLocalStorage(name) {
	console.log("lo obtuviste de local.");
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

function renderRow(rowIndex, updatedData) {
	let row = table.row(rowIndex);
	row.data(updatedData);
	table.draw();
}

export { saveInLocalStorage, getFromLocalStorage, readExcel };
