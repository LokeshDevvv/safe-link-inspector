
// Configuration for the API
const API_ENDPOINT = 'https://your-api-url.com';
const API_KEY = 'your-api-key'; // Replace with your actual API key

// Create context menu item
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'checkUrl',
    title: 'Check URL Safety',
    contexts: ['link']
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'checkUrl' && info.linkUrl) {
    checkUrlSafety(info.linkUrl);
  }
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'CHECK_URL' && message.url) {
    checkUrlSafety(message.url);
  }
});

// Function to check URL safety
async function checkUrlSafety(url: string) {
  try {
    const response = await fetch(`${API_ENDPOINT}/api/url/quick-check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': API_KEY
      },
      body: JSON.stringify({ url })
    });

    const result = await response.json();

    // Send result to popup or show notification
    chrome.runtime.sendMessage({
      type: 'URL_CHECK_RESULT',
      data: result
    });

  } catch (error) {
    console.error('Error checking URL:', error);
    chrome.runtime.sendMessage({
      type: 'URL_CHECK_ERROR',
      error: 'Failed to check URL safety'
    });
  }
}

export {}; // Add this to ensure the file is treated as a module
