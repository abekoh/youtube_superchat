export interface OutputData {
  message: string
}

export interface IOutputUsecase {
  handle(data: OutputData): void
}
