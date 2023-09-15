window.addEventListener("DOMContentLoaded", e => {
	document.querySelector("body").addEventListener("click", e => {
		if (e.target.matches("#checkboxControl")) {
			let checkboxes = document.querySelectorAll("table > tbody > tr > td:nth-child(13) > input")	
			if(e.target.checked){
				checkboxes.forEach(e => {
					e.checked = true
				})
			} else {
			checkboxes.forEach(e => {
				e.checked = false
			})	
			}
		}
	});
});
