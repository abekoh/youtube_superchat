import { SubscribeInteractor } from '../domain/application/SubscribeInteractor'
import { ShellPresenter } from '../presenter/ShellPresenter'
import { YouTubeClient } from '../infrastructure/YouTubeClient'

export class ShellController {
  public async run(apiKey: string, videoId: string) {
    const inputUseCase = new SubscribeInteractor(new ShellPresenter(), new YouTubeClient(apiKey))
    await inputUseCase.handle({ mode: 'Register', videoId: videoId })
    await inputUseCase.handle({ mode: 'Start' })
  }
}
