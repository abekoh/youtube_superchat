import { IYouTubeClient, LiveChatMessageRequest, LiveChatMessageResponse } from '../domain/model/IYouTubeClient'
import * as Log4js from 'log4js'

const logger = Log4js.getLogger()

export class YouTubeNodeClient implements IYouTubeClient {
  constructor(private youTubeApiKey: string, private client: any) {
  }

)

  public getLiveChatIdFromVideoId(videoId: string): Promise<string | null> {
    this.client.init({
      'apiKey': this.youTubeApiKey
    }).then(() => {
      return this.client
    })
  }

  public fetchComments(
    request: LiveChatMessageRequest
  ): Promise<LiveChatMessageResponse> {
  }
}