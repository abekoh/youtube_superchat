export interface OutputData {
  sumOfAmount: string
  currency: string
  amountDisplayString: string
}

export interface IOutputUsecase {
  handle(data: OutputData): void
}
