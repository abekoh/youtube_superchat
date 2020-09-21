import { EventEmitter } from 'events'
import {
  IYouTubeClient,
  LiveChatMessage,
  LiveChatMessageRequest,
} from '../domain/model/IYouTubeClient'
import { ISubcriber } from '../domain/model/ISubcriber'

export class JsSubscriber extends EventEmitter implements ISubcriber {
  private liveChatId?: string
  private pageToken?: string
  private intervalMilliSec: number = 10000
  private observer?: any

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
    console.log('succeeded to register')
    return true
  }

  public async start(): Promise<boolean> {
    if (!this.liveChatId) {
      return false
    }
    console.log('start subscriber')
    this.setObserver()
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
      maxResults: 2000,
    }
    const response = await this.youTubeClient.fetchComments(request)
    this.pageToken = response.pageToken || undefined
    this.intervalMilliSec = response.pollingIntervalMillis || 10000
    this.setObserver()
    this.emit('consumeBatch', response.messages)
  }

  private setObserver() {
    if (this.observer) {
      clearInterval(this.observer)
    }
    this.observer = setInterval(
      () => this.fetchChatMessages(),
      this.intervalMilliSec
    )
  }

  public on(
    event: 'consumeBatch',
    listener: (messages: LiveChatMessage[]) => void
  ): this
  public on(event: 'start', listener: () => void): this
  public on(event: 'end', listener: () => void): this
  public on(event: string | symbol, listener: (...args: any[]) => void): this {
    return super.on(event, listener)
  }
}
