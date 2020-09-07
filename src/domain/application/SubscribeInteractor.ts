import { IInputUseCase, InputCommand } from '../../usecase/IInputUseCase'
import { IOutputUsecase } from '../../usecase/IOutputUseCase'
import { Subscriber } from '../model/Subscriber'
import { IYouTubeClient } from '../model/IYouTubeClient'
import { Summarizer } from '../model/Summarizer'

export class SubscribeInteractor implements IInputUseCase {
  private subscriber: Subscriber
  private summarizer = new Summarizer()
  constructor(
    private outputUseCase: IOutputUsecase,
    private youTubeClient: IYouTubeClient
  ) {
    this.subscriber = new Subscriber(youTubeClient)
    this.subscriber.on('consumeBatch', async (liveChatMessages) => {
      const summarizedData = await this.summarizer.summarize(liveChatMessages)
      outputUseCase.handle(summarizedData)
    })
  }

  public async handle(command: InputCommand): Promise<void> {
    switch (command.mode) {
      case 'Register':
        if (!command.videoId) return
        await this.subscriber.register(command.videoId)
        break
      case 'Start':
        await this.subscriber.start()
        break
      case 'Stop':
        this.subscriber.stop()
        break
    }
  }
}
