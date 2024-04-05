const rickrollUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

chrome.storage.local.get("chaosModeEnabled", function (data) {
  const chaosModeEnabled = data.chaosModeEnabled || false;
  console.log(
    "Chaos Mode on startup:",
    chaosModeEnabled ? "Enabled" : "Disabled"
  );

  // Listen for webNavigation and tabs events
  chrome.webNavigation.onBeforeNavigate.addListener(function (details) {
    if (chaosModeEnabled) {
      const redirectChance = Math.random();
      if (redirectChance < 0.2) {
        chrome.tabs.query(
          { url: rickrollUrl },
          function (tabs) {
            if (tabs.length > 0) {
              // Open a new tab with Rickroll URL
              chrome.tabs.create({
                url: rickrollUrl,
                active: true,
              });
            } else {
              chrome.tabs.update(details.tabId, {
                url: rickrollUrl,
              });
            }
          }
        );
      }
    }
  });

  chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (!chaosModeEnabled && changeInfo.url) {
      chrome.storage.local.get("chance", function (data) {
        const chance = data.chance || 1;
        const redirectChance = Math.random() * 100;
        if (redirectChance < chance) {
          chrome.tabs.update(tabId, {
            url: rickrollUrl,
          });
        }
      });
    }
  });
});

// Listen for messages from the popup to toggle Chaos Mode
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.toggleChaosMode !== undefined) {
    const chaosModeEnabled = message.toggleChaosMode;
    console.log(
      "Chaos Mode toggled to:",
      chaosModeEnabled ? "Enabled" : "Disabled"
    );

    // Save the state of Chaos Mode to storage
    chrome.storage.local.set({ chaosModeEnabled: chaosModeEnabled });
  }
});
