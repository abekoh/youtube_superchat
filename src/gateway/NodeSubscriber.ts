import { EventEmitter } from 'events'
import {
  IYouTubeClient,
  LiveChatMessage,
  LiveChatMessageRequest,
} from '../domain/model/IYouTubeClient'
import * as Log4js from 'log4js'
import { ISubcriber } from '../domain/model/ISubcriber'

const logger = Log4js.getLogger()

export class NodeSubscriber extends EventEmitter implements ISubcriber {
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
      logger.error(`failed to get liveChatId: videoId=${videoId}`)
      return false
    }
    this.liveChatId = liveChatId
    logger.debug(`liveChatId=${this.liveChatId}`)
    return true
  }

  public async start(): Promise<boolean> {
    if (!this.liveChatId) {
      logger.error('liveChatId is not registered.')
      return false
    }
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
      logger.error('liveChatId is not registered.')
      return
    }
    const request: LiveChatMessageRequest = {
      liveChatId: this.liveChatId,
      pageToken: this.pageToken,
      maxResults: 2000,
    }
    const response = await this.youTubeClient.fetchComments(request)
    logger.debug(`response=${JSON.stringify(response)}`)
    this.pageToken = response.pageToken || undefined
    this.intervalMilliSec = response.pollingIntervalMillis || 10000
    this.setObserver()
    logger.debug(
      `pageToken=${this.pageToken}, intervalMilliSec=${this.intervalMilliSec}`
    )
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
