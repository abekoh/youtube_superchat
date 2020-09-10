import { SubscribeInteractor } from '../domain/application/SubscribeInteractor'
import { ShellPresenter } from '../presenter/ShellPresenter'
import { YouTubeClient } from '../gateway/YouTubeClient'
import { IInputUseCase } from '../usecase/IInputUseCase'

export class ChromeController {
  private inputUseCase: IInputUseCase

  constructor(apiKey: string) {
    this.inputUseCase = new SubscribeInteractor(
      new ShellPresenter(),
      new YouTubeClient(apiKey)
    )
  }

  public async register(videoId: string) {
    await inputUseCase.handle({ mode: 'Register', videoId: videoId })
  }

  public async start() {
    await inputUseCase.handle({ mode: 'Start' })
  }

  public async stop() {
    await inputUseCase.handle({ mode: 'Stop' })
  }
}
