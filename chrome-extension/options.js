let page = document.getElementById("buttonDiv");

chrome.storage.sync.get("totalCO2Emission", function (data) {
	allTimeCO2.textContent = data.totalCO2Emission || "No data found!";
});
