chrome.runtime.onInstalled.addListener(function () {
	chrome.storage.sync.set({
		totalCO2Emission: 0,
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

function updateStorage(tabId, key, value) {
	chrome.storage.sync.set({
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
