export type InputCommandMode = 'Register' | 'Start' | 'Stop'
export interface InputCommand {
  mode: InputCommandMode
  videoId?: string
}

export interface IInputUseCase {
  handle(command: InputCommand): Promise<void>
}
