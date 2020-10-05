let page = document.getElementById("buttonDiv");

chrome.storage.local.get("totalCO2Emission", function (data) {
	allTimeCO2.textContent = data.totalCO2Emission || "No data found!";
});
