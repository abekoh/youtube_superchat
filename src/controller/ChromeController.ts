import { SubscribeInteractor } from '../domain/application/SubscribeInteractor'
import { ConsolePresenter } from '../presenter/ConsolePresenter'
import { IInputUseCase } from '../usecase/IInputUseCase'
import { YouTubeJsClient } from '../gateway/YouTubeJsClient'
import { JsSubscriber } from '../gateway/JsSubscriber'
import { YouTubeClientUtils } from '../utils/YouTubeClientUtils'
import { MessagePresenter } from '../presenter/MessagePresenter'

export class ChromeController {
  private inputUseCase: IInputUseCase

  constructor(apiKey: string, tabId: number) {
    this.inputUseCase = new SubscribeInteractor(
      new MessagePresenter(tabId),
      new JsSubscriber(new YouTubeJsClient(apiKey))
    )
  }

  public async register(url: string) {
    await this.inputUseCase.handle({
      mode: 'Register',
      videoId: YouTubeClientUtils.youTubeUrlToVideoID(url),
    })
  }

  public async start() {
    await this.inputUseCase.handle({ mode: 'Start' })
  }

  public async stop() {
    await this.inputUseCase.handle({ mode: 'Stop' })
  }
}
