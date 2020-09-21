import { IOutputUsecase, OutputData } from '../usecase/IOutputUseCase'

export class ShellPresenter implements IOutputUsecase {
  public handle(data: OutputData) {
    console.log(data)
  }
}
