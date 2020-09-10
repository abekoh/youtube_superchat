import * as Log4js from 'log4js'
import { ChromeController } from './controller/ChromeController'

const logger = Log4js.getLogger()
logger.level = 'info'

chrome.storage.sync.get(['youTubeApiKey'], (items) => {
  const controller = new ChromeController(items.youTubeApiKey)
  chrome.runtime.onMessage.addListener(
    async (request, sender, sendResponse) => {
      switch (request.mode) {
        case 'Register':
          await controller.register(request.videoId)
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
    }
  )
})
