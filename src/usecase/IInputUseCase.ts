export type InputCommand = 'Start' | 'Stop'

export interface IInputUseCase {
  handle(command: InputCommand)
}
