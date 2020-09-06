import { EventEmitter } from 'events'
import {
  IYouTubeClient,
  LiveChatMessage,
  LiveChatMessageRequest,
} from './IYouTubeClient'
import * as Log4js from 'log4js'

const logger = Log4js.getLogger()

export class Subscriber extends EventEmitter {
  private liveChatId?: string
  private pageToken?: string
  private intervalMilliSec: number = 10000
  private observer?: NodeJS.Timeout

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
      logger.error('liveChatId is not registered.')
      return
    }
    const request: LiveChatMessageRequest = {
      liveChatId: this.liveChatId,
      pageToken: this.pageToken,
    }
    const response = await this.youTubeClient.fetchComments(request)
    logger.debug(`response=${JSON.stringify(response)}`)
    this.pageToken = response.pageToken || undefined
    this.intervalMilliSec = response.pollingIntervalMillis || 10000
    logger.debug(`pageToken=${this.pageToken}, intervalMilliSec=${this.intervalMilliSec}`)
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
