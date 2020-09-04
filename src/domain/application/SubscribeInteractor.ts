import { IInputUseCase, InputCommand } from '../../usecase/IInputUseCase'
import { IOutputUsecase } from '../../usecase/IOutputUseCase'
import { Subscriber } from '../model/Subcriber'
import { Observer } from '../model/Observer'

export class SubscribeInteractor implements IInputUseCase {
  private subcriber: Subscriber

  constructor(private outputUseCase: IOutputUsecase) {
    this.subcriber = new Subscriber(
      new Observer((chatEvent) => {
        outputUseCase.handle({ message: chatEvent.message })
      })
    )
  }

  public handle(command: InputCommand) {
    switch (command) {
      case 'Start':
        this.subcriber.start()
        break
      case 'Stop':
        this.subcriber.stop()
        break
    }
  }
}
