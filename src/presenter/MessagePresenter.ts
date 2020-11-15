import { IOutputUsecase, OutputData } from '../usecase/IOutputUseCase'

export class MessagePresenter implements IOutputUsecase {
  constructor(private tabId: number) {}

  public handle(data: OutputData) {
    const message = {
      mode: 'Add',
      sumOfAmount: data.sumOfAmount,
      currency: data.currency,
      amountDisplayString: data.amountDisplayString,
    }
    console.log(`send message to monitor: ${message}`)
    chrome.tabs.sendMessage(this.tabId, message)
  }
}
