function getAndUseAllDataFromStorage(callback) {
	chrome.storage.local.get(null, callback);
}

chrome.runtime.onInstalled.addListener(function () {
	chrome.storage.local.set({
		sessionCO2Emission: 0
	});

	chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
		chrome.declarativeContent.onPageChanged.addRules([
			{
				conditions: [
					new chrome.declarativeContent.PageStateMatcher({
						// activate for all websites
						pageUrl: { hostContains: "." },
					}),
				],
				actions: [new chrome.declarativeContent.ShowPageAction()],
			},
		]);
	});
});

// Adds previous pages emission to all time emission count after navigating to another page
chrome.webNavigation.onBeforeNavigate.addListener(
	(navigationDetails) => {
		getAndUseAllDataFromStorage(data => {
			if (data.allTimeEmission) {
				currentAllTimeEmission = data.allTimeEmission;

				chrome.storage.local.set({
					allTimeEmission: data.allTimeEmission + parseFloat(data[navigationDetails.tabId].tabCO2Emission)
				});
			} else {
				chrome.storage.local.set({
					allTimeEmission: parseFloat(data[navigationDetails.tabId].tabCO2Emission)
				});
			}
		});
	}
);

// Adds tab emission to all time emission count after closing the tab
chrome.tabs.onRemoved.addListener(function(tabId) {
	getAndUseAllDataFromStorage(data => {
		if (data.allTimeEmission) {
			currentAllTimeEmission = data.allTimeEmission;

			chrome.storage.local.set({
				allTimeEmission: data.allTimeEmission + parseFloat(data[tabId].tabCO2Emission)
			});
		} else {
			chrome.storage.local.set({
				allTimeEmission: parseFloat(data[tabId].tabCO2Emission)
			});
		}
	});
})

function updateStorage(tabId, key, value) {
	chrome.storage.local.set({
		[tabId]: {
			[key]: value	
		}
	});
}

// Tell contentScript which tab is user on
chrome.extension.onMessage.addListener(function (
	message,
	sender,
	sendResponse
) {
	if (message.type == "getTabId") {
		updateStorage(sender.tab.id, "tabCO2Emission", message.transferSize);

		sendResponse({
			tabID: sender.tab.id,
			tabCO2Emission: message.transferSize
		});
	}
});
