const save = () => {
  const apiKey = document.getElementById('apikey').value
  chrome.storage.sync.set({ youTubeApiKey: apiKey })
  console.log('saved ApiKey')
}
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('save').addEventListener('click', save);
})