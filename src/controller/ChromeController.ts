import { SubscribeInteractor } from '../domain/application/SubscribeInteractor'
import { ShellPresenter } from '../presenter/ShellPresenter'
import { IInputUseCase } from '../usecase/IInputUseCase'
import { NodeSubscriber } from '../gateway/NodeSubscriber'
import { YouTubeNodeClient } from '../gateway/YouTubeNodeClient'
import { YouTubeJsClient } from '../gateway/YouTubeJsClient'
import { JsSubscriber } from '../gateway/JsSubscriber'

export class ChromeController {
  private inputUseCase: IInputUseCase

  constructor(apiKey: string) {
    this.inputUseCase = new SubscribeInteractor(
      new ShellPresenter(),
      new JsSubscriber(new YouTubeJsClient(apiKey))
    )
  }

  public async register(videoId: string) {
    await this.inputUseCase.handle({ mode: 'Register', videoId: videoId })
  }

  public async start() {
    await this.inputUseCase.handle({ mode: 'Start' })
  }

  public async stop() {
    await this.inputUseCase.handle({ mode: 'Stop' })
  }
}
