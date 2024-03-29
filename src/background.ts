import { ChromeController } from './controller/ChromeController'
import { InputCommandMode } from './usecase/IInputUseCase'
import tabId = chrome.devtools.inspectedWindow.tabId

interface ChromeRequest {
  mode: InputCommandMode
  youTubeApiKey?: string
  url?: string
  tabId?: number
}

let controller: ChromeController | undefined = undefined

chrome.runtime.onMessage.addListener(
  async (request: ChromeRequest, sender, sendResponse) => {
    console.log(`receive message: ${JSON.stringify(request)}`)
    if (!controller && request.youTubeApiKey && request.tabId) {
      controller = new ChromeController(request.youTubeApiKey, request.tabId)
    }
    if (!controller) {
      console.log('failed to set client')
      return
    }
    switch (request.mode) {
      case 'Register':
        if (request.url) {
          await controller.register(request.url)
        }
        break
      case 'Start':
        await controller.start()
        break
      case 'Stop':
        await controller.stop()
        break
      default:
        console.log(`unsupported mode: ${request.mode}`)
    }
    console.log('send as tabs')
    chrome.tabs.sendMessage(sender.tab?.id || 0, {
      result: `succeeded: ${request.mode}`,
    })
  }
)
