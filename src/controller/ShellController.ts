import { SubscribeInteractor } from '../domain/application/SubscribeInteractor'
import { ShellPresenter } from '../presenter/ShellPresenter'
import { YouTubeNodeClient } from '../gateway/YouTubeNodeClient'
import { YouTubeJsClient } from '../gateway/YouTubeJsClient'
import { JsSubscriber } from '../gateway/JsSubscriber'
import { NodeSubscriber } from '../gateway/NodeSubscriber'

export class ShellController {
  public async run(apiKey: string, videoId: string) {
    const inputUseCase = new SubscribeInteractor(
      new ShellPresenter(),
      new NodeSubscriber(new YouTubeNodeClient(apiKey)),
    )
    await inputUseCase.handle({ mode: 'Register', videoId: videoId })
    await inputUseCase.handle({ mode: 'Start' })
  }
}
