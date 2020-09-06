import { EventEmitter } from 'events'
import {
  IYouTubeClient,
  LiveChatMessage,
  LiveChatMessageRequest,
} from './IYouTubeClient'

export class Subscriber extends EventEmitter {
  private liveChatId?: string
  private pageToken: string | null = null
  private intervalMilliSec: number = 1000
  private observer?: NodeJS.Timeout
  constructor(private youTubeClient: IYouTubeClient) {
    super()
  }

  public async register(videoId: string): Promise<boolean> {
    const liveChatId = await this.youTubeClient.getLiveChatIdFromVideoId(
      videoId
    )
    if (liveChatId === null) {
      return false
    }
    this.liveChatId = liveChatId
    return true
  }

  public async start(): Promise<boolean> {
    if (!this.liveChatId) {
      return false
    }
    this.observer = setInterval(
      () => this.fetchChatMessages(),
      this.intervalMilliSec
    )
    this.emit('start')
    return true
  }

  public stop() {
    if (this.observer) {
      clearInterval(this.observer)
      this.emit('end')
    }
  }

  private async fetchChatMessages() {
    if (!this.liveChatId) {
      return
    }
    const request: LiveChatMessageRequest = {
      liveChatId: this.liveChatId,
      pageToken: this.pageToken,
    }
    const response = await this.youTubeClient.fetchComments(request)
    this.pageToken = response.pageToken
    response.messages.forEach((v: LiveChatMessage) => {
      this.emit('consume', v)
    })
  }

  public on(
    event: 'consume',
    listener: (message: LiveChatMessage) => void
  ): this
  public on(event: 'start', listener: () => void): this
  public on(event: 'end', listener: () => void): this
  public on(event: string | symbol, listener: (...args: any[]) => void): this {
    return super.on(event, listener)
  }
}
