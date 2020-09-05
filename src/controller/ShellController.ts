import { IInputUseCase, InputCommandMode } from '../usecase/IInputUseCase'
import { SubscribeInteractor } from '../domain/application/SubscribeInteractor'
import { ShellPresenter } from '../presenter/ShellPresenter'

export class ShellController {
  public async run() {
    const inputUseCase = new SubscribeInteractor(new ShellPresenter())
    await inputUseCase.handle({ mode: 'Register', videoId: 'gQdHNT8bQ4M'})
    await inputUseCase.handle({mode: 'Start'})
  }
}
