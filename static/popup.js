document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('register').addEventListener('click', () => {
    chrome.storage.sync.get(['youTubeApiKey'], (items) => {
      console.log('send Register message')
      chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
        chrome.windows.create(
          {
            url: chrome.runtime.getURL('monitor.html'),
            type: 'popup',
            focused: false,
            width: 280,
            height: 430,
          },
          (w) => {
            chrome.runtime.sendMessage({
              mode: 'Register',
              youTubeApiKey: items.youTubeApiKey,
              url: tabs[0].url,
              tabId: w.id,
            })
          }
        )
      })
    })
  })
  document.getElementById('start').addEventListener('click', () => {
    console.log('send Start message')
    chrome.runtime.sendMessage({ mode: 'Start' })
  })
  document.getElementById('stop').addEventListener('click', () => {
    console.log('send Stop message')
    chrome.runtime.sendMessage({ mode: 'Stop' })
  })

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log(`popup received: ${JSON.stringify(message)}`)
  })
})
