document.addEventListener("DOMContentLoaded", function () {
  const chanceInput = document.getElementById("chance");
  const percentageSpan = document.getElementById("percentage");
  const chaosCheckbox = document.getElementById("chaosCheckbox");

  chrome.storage.local.get("chaosModeEnabled", function (data) {
    const chaosModeEnabled = data.chaosModeEnabled || false;
    chaosCheckbox.checked = chaosModeEnabled;
  });

  function updateUI(chaosMode) {
    if (chaosMode) {
      chanceInput.value = 20;
      chanceInput.disabled = true;
      percentageSpan.textContent = "20%";
    } else {
      chrome.storage.local.get("chance", function (data) {
        const chance = data.chance || 1;
        chanceInput.value = chance;
        chanceInput.disabled = false;
        percentageSpan.textContent = `${chance}%`;
      });
    }
  }

  chaosCheckbox.addEventListener("change", function () {
    const chaosMode = chaosCheckbox.checked;
    updateUI(chaosMode);
    chrome.storage.local.set({ chaosModeEnabled: chaosMode });
  });

  chrome.storage.local.get("chance", function (data) {
    const chance = data.chance || 1;
    chanceInput.value = chance;
    percentageSpan.textContent = `${chance}%`;
  });

  chrome.storage.local.get("chaosModeEnabled", function (data) {
    const chaosModeEnabled = data.chaosModeEnabled || false;
    updateUI(chaosModeEnabled);
  });

  chanceInput.addEventListener("input", function () {
    const chance = parseInt(chanceInput.value);
    percentageSpan.textContent = `${chance}%`;
  });

  const saveButton = document.getElementById("saveButton");
  saveButton.addEventListener("click", function () {
    const chance = parseInt(chanceInput.value);
    chrome.storage.local.set({ chance: chance }, function () {
      console.log("Chance saved:", chance);
    });
  });
});
