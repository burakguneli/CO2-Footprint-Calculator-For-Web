let page = document.getElementById("buttonDiv");
let allTimeCO2Amount = 0;

chrome.storage.local.get(null, function (data) {
	allTimeCO2Amount = Object.values(data).reduce(
		(accumulator, currentData) => {
			let newTotalEmission = accumulator;

			if (typeof currentData === "object" && currentData.tabCO2Emission) {
				newTotalEmission = accumulator + currentData.tabCO2Emission;
			}

			return newTotalEmission;
		},
		0
	);

	allTimeCO2.textContent = allTimeCO2Amount || "No data found!";
});
