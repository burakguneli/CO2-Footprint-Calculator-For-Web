let detailsButton = document.getElementById("detailsButton");
let testButton = document.getElementById("testButton");
let tabCO2Text = document.getElementById("tabCO2Text");
let sessionCO2Text = document.getElementById("sessionCO2Text");
let allTimeEmissionText = document.getElementById("allTimeEmission");
let activeTab = document.getElementById("activeTab");
let greenityInfoDiv = document.getElementById("host-green-info");

// Load data from storage and show on UI

// Fetch green host info using thegreenwebfoundation API, update UI accordingly
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
	var currTab = tabs[0];

	if (currTab) {
		const tabURL = new URL(currTab.url);
		const tabHostName = tabURL.hostname;

		fetch(`http://api.thegreenwebfoundation.org/greencheck/${tabHostName}`)
			.then((data) => data.json())
			.then((dataJSON) => {
				if (dataJSON.green) {
					const icon = document.createElement("h1");
					icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-check" width="44" height="44" viewBox="0 0 24 24" stroke-width="3" stroke="#8BC34A" fill="none" stroke-linecap="round" stroke-linejoin="round">
					<path stroke="none" d="M0 0h24v24H0z" fill="none"/>
					<path d="M5 12l5 5l10 -10" />
				  </svg>`;
					greenityInfoDiv.appendChild(icon);

					const text = document.createElement("h2");
					text.textContent = "GREEN Hosted!";
					text.style.color = "#8BC34A";

					greenityInfoDiv.appendChild(text);
				} else {
					const icon = document.createElement("h1");
					icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-alert-circle" width="44" height="44" viewBox="0 0 24 24" stroke-width="3" stroke="#F44336" fill="none" stroke-linecap="round" stroke-linejoin="round">
					<path stroke="none" d="M0 0h24v24H0z" fill="none"/>
					<circle cx="12" cy="12" r="9" />
					<line x1="12" y1="8" x2="12" y2="12" />
					<line x1="12" y1="16" x2="12.01" y2="16" />
					</svg>`;
					greenityInfoDiv.appendChild(icon);

					const text = document.createElement("h2");
					text.textContent = "NOT GREEN Hosted";
					text.style.color = "#E91E63";

					greenityInfoDiv.appendChild(text);
				}

				if (dataJSON.hostedby) {
					const hostProviderText = document.createElement("p");
					hostProviderText.textContent = `Hosted by: ${dataJSON.hostedby}`;
					greenityInfoDiv.appendChild(hostProviderText);
				}
			})
			.catch((err) => {
				if (Object.keys(err).length > 0) {
					document.getElementById("log").textContent = JSON.stringify(err);
				}
			});
	}
});

setInterval(
	function () {
		chrome.storage.local.get("allTimeEmission", function (data) {
			allTimeEmissionText.textContent = data.allTimeEmission >=0 ? `${data.allTimeEmission.toFixed(2)} Grams` : "Recording...";
		});

		chrome.tabs.query(
			{
				active: true,
				currentWindow: true
			},
			function (tabs) {
				var currTab = tabs[0];

				if (currTab) {
					chrome.storage.local.get(null, function (data) {
						if (data[currTab.id]) {
							tabCO2Text.textContent = data[currTab.id].tabCO2Emission && data[currTab.id].tabCO2Emission >= 0 ?
								`${data[currTab.id].tabCO2Emission.toFixed(2)} Grams` : "Loading...";
							sessionCO2Text.textContent = data.sessionCO2Emission >=0 ? `${data.sessionCO2Emission.toFixed(2)} Grams` : "Recording...";
						}
					});
				}
			}
		);

		chrome.tabs.query(
			{currentWindow: true},
			function (tabs) {
				chrome.storage.local.get(null, function (data) {
					const currentSessionTotalEmission = tabs.reduce(
						(accumulator, currentTab) => {
							let newTotalEmission = accumulator;

							if (data[currentTab.id] && data[currentTab.id].tabCO2Emission >= 0) {
								newTotalEmission = accumulator + data[currentTab.id].tabCO2Emission;
							}

							return newTotalEmission;
						},
						0
					);

					chrome.storage.local.set({
						sessionCO2Emission: currentSessionTotalEmission
					});
				});
			}
		);
	},
	500
);

// Navigate to options (or details) page
detailsButton.onclick = function (element) {
	chrome.runtime.openOptionsPage();
};
