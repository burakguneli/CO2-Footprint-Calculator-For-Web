let detailsButton = document.getElementById("detailsButton");
let testButton = document.getElementById("testButton");
let tabCO2Text = document.getElementById("tabCO2Text");
let sessionCO2Text = document.getElementById("sessionCO2Text");
let activeTab = document.getElementById("activeTab");

// Load data from storage and show on UI

setInterval(function () {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		var currTab = tabs[0];

		if (currTab) { 
			activeTab.textContent = currTab.title;

			chrome.storage.sync.get(null, function (data) {
				tabCO2Text.textContent = `${data[currTab.id].tabCO2Emission} Grams`;
			});
		}
	});
}, 2000);

chrome.storage.sync.get("tabCO2Emission", function (data) {
	tabCO2Text.textContent = `${data.tabCO2Emission} Grams`;
});

chrome.storage.sync.get("sessionCO2Emission", function (data) {
	sessionCO2Text.textContent = data.sessionCO2Emission;
});

// Navigate to options (or details) page
detailsButton.onclick = function (element) {
	chrome.runtime.openOptionsPage();
};
