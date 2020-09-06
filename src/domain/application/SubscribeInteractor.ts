import { IInputUseCase, InputCommand } from '../../usecase/IInputUseCase'
import { IOutputUsecase } from '../../usecase/IOutputUseCase'
import { Subscriber } from '../model/Subscriber'
import { YouTubeClient } from '../../infrastructure/YouTubeClient'

export class SubscribeInteractor implements IInputUseCase {
  private subscriber: Subscriber
  constructor(private outputUseCase: IOutputUsecase) {
    this.subscriber = new Subscriber(new YouTubeClient())
    this.subscriber.on('consume', (liveChatMessage) => {
      outputUseCase.handle({
        message: liveChatMessage.message,
      })
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
