import { SubscribeInteractor } from '../domain/application/SubscribeInteractor'
import { ShellPresenter } from '../presenter/ShellPresenter'
import { YouTubeNodeClient } from '../gateway/YouTubeNodeClient'
import { IInputUseCase } from '../usecase/IInputUseCase'

export class ChromeController {
  private inputUseCase: IInputUseCase

  constructor(apiKey: string) {
    this.inputUseCase = new SubscribeInteractor(
      new ShellPresenter(),
      new YouTubeNodeClient(apiKey)
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
