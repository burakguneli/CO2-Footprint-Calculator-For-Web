var tabId;

// We can't directly get tab id in content script, so we
// should communicate with background script.
// Request tabID information from background script,
// when got it, start logging transfer size
setInterval(
	function () {
		chrome.extension.sendMessage(
			{
				type: "getTabId",
				transferSize: calculateTotalTransferSize()
			},
			function (res) {
				console.log(res);
			}
		);
	},
	3000
);

/////////////////////////
// Utils
/////////////////////////

var ONE_MB_TRANSFER_CARBON_EMISSION_IN_TERMS_OF_KILOGRAM = 0.003;
var ONE_MB_TRANSFER_CARBON_EMISSION_IN_TERMS_OF_GRAM = 3;

function calculateTotalTransferSize() {
	var fetchedResourcesArray = performance.getEntriesByType("resource");
	var totalTransferSize = 0;

	for (
		var resourceIndex = 0;
		resourceIndex < fetchedResourcesArray.length;
		resourceIndex++
	) {
		totalTransferSize += parseInt(
			fetchedResourcesArray[resourceIndex].transferSize
		);
	}

	// Converting octets to MB.
	var totalTransferSizeInTermsOfMB = totalTransferSize / 1000000;

	return totalTransferSizeInTermsOfMB;
}

function calculateCarbonEmmissionInTermsOfGram(transferSize) {
	return ONE_MB_TRANSFER_CARBON_EMISSION_IN_TERMS_OF_GRAM * transferSize;
}

function calculateCarbonEmmissionInTermsOfKilogram(transferSize) {
	return ONE_MB_TRANSFER_CARBON_EMISSION_IN_TERMS_OF_KILOGRAM * transferSize;
}
