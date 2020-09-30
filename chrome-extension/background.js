chrome.runtime.onInstalled.addListener(function () {
	chrome.storage.sync.set(
		{
			totalCO2Emission: 200,
			sessionCO2Emission: 100,
			tabCO2Emission: 15,
		},
		function () {
			console.log("Extension initialized");
		}
	);

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

// Tell contentScript which tab is user on
chrome.extension.onMessage.addListener(function (
	message,
	sender,
	sendResponse
) {
	if (message.type == "getTabId") {
		sendResponse({ tabID: sender.tab.id });
	}
});
