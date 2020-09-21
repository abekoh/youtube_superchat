document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('register').addEventListener('click', () => {
    chrome.storage.sync.get(['youTubeApiKey'], (items) => {
      console.log('send Register message')
      chrome.runtime.sendMessage({
        mode: 'Register',
        youTubeApiKey: items.youTubeApiKey,
        videoId: 'xH3oA08wi9o'
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

