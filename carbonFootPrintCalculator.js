var ONE_MB_TRANSFER_CARBON_EMISSION_IN_TERMS_OF_KILOGRAM = 0.003;
var ONE_MB_TRANSFER_CARBON_EMISSION_IN_TERMS_OF_GRAM = 3;

function calculateTotalTransferSize() {
  var fetchedResourcesArray = performance.getEntriesByType("resource");
  var totalTransferSize = 0;

  for (var resourceIndex = 0; resourceIndex < fetchedResourcesArray.length; resourceIndex++) {
    totalTransferSize += parseInt(fetchedResourcesArray[resourceIndex].transferSize);
  }

  // Converting octets to MB.
  var totalTransferSizeInTermsOfMB = totalTransferSize / 1000000;

  return (totalTransferSizeInTermsOfMB);
}

function logProducedCarbonAmount(size) {
  console.log(size + " MB transfer produced " + (ONE_MB_TRANSFER_CARBON_EMISSION_IN_TERMS_OF_KILOGRAM * size) + "KG of CO2");
  console.log(size + " MB transfer produced " + (ONE_MB_TRANSFER_CARBON_EMISSION_IN_TERMS_OF_GRAM * size) + "GR of CO2");
}

var transferSize = calculateTotalTransferSize();

logProducedCarbonAmount(transferSize);
