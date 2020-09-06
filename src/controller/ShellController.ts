import { SubscribeInteractor } from '../domain/application/SubscribeInteractor'
import { ShellPresenter } from '../presenter/ShellPresenter'

export class ShellController {
  public async run() {
    const inputUseCase = new SubscribeInteractor(new ShellPresenter())
    await inputUseCase.handle({ mode: 'Register', videoId: 'SLv_28ePEA4' })
    await inputUseCase.handle({ mode: 'Start' })
  }
}
