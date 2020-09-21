import { LiveChatMessage } from './IYouTubeClient'

export interface ISubcriber {
  register(videoId: string): Promise<boolean>
  start(): Promise<boolean>
  stop(): void
  on(
    event: 'consumeBatch',
    listener: (messages: LiveChatMessage[]) => void
  ): this
  on(event: 'start', listener: () => void): this
  on(event: 'end', listener: () => void): this
  on(event: string | symbol, listener: (...args: any[]) => void): this
}