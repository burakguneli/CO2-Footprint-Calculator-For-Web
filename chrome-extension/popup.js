let detailsButton = document.getElementById("detailsButton");
let tabCO2Text = document.getElementById("tabCO2Text");
let sessionCO2Text = document.getElementById("sessionCO2Text");

window.onload = function () {
	// This will be triggered when clicked on extension icon
	// TODO: Here we should calculate transfer size of active tab and show
	// here is the list of Chrome APIs we can use: https://developer.chrome.com/extensions/api_index
};

// Load data from storage and show on UI

chrome.storage.sync.get("tabCO2Emission", function (data) {
	tabCO2Text.textContent = data.tabCO2Emission;
});

chrome.storage.sync.get("sessionCO2Emission", function (data) {
	sessionCO2Text.textContent = data.sessionCO2Emission;
});

// Navigate to options (or details) page
detailsButton.onclick = function (element) {
	chrome.runtime.openOptionsPage();
};
