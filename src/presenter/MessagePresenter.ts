import { IOutputUsecase, OutputData } from '../usecase/IOutputUseCase'

export class ConsolePresenter implements IOutputUsecase {
  public handle(data: OutputData) {
    console.log(data)
  }
}
