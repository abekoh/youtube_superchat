import { IInputUseCase } from '../usecase/IInputUseCase'
import { SubscribeInteractor } from '../domain/application/SubscribeInteractor'
import { ShellPresenter } from '../presenter/ShellPresenter'

export class ShellController {
  public run() {
    const inputUseCase = new SubscribeInteractor(new ShellPresenter())
  }
}
