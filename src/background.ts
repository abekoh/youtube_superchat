import { ChromeController } from './controller/ChromeController'
import { InputCommandMode } from './usecase/IInputUseCase'

interface ChromeRequest {
  mode: InputCommandMode
  youTubeApiKey?: string
  videoId?: string
}

let controller: ChromeController | undefined = undefined

chrome.runtime.onMessage.addListener(
  async (request: ChromeRequest, sender, sendResponse) => {
    console.log(`receive message: ${JSON.stringify(request)}`)
    if (!controller && request.youTubeApiKey) {
      controller = new ChromeController(request.youTubeApiKey)
    }
    if (!controller) {
      console.log('failed to set client')
      return
    }
    switch (request.mode) {
      case 'Register':
        if (request.videoId) {
          await controller.register(request.videoId)
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
    chrome.tabs.sendMessage(sender.tab?.id || 0, { result: `succeeded: ${request.mode}` })
  }
)
