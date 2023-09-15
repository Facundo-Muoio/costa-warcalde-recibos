window.addEventListener("DOMContentLoaded", e => {
	document.querySelector("body").addEventListener("click", e => {
		if (e.target.matches("#checkboxControl")) {
			console.log("click");
		}
	});
});
