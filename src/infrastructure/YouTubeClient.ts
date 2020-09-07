import { youtube_v3, google } from 'googleapis'
import {
  IYouTubeClient,
  LiveChatMessage,
  LiveChatMessageResponse,
  LiveChatMessageRequest
} from '../domain/model/IYouTubeClient'
import * as Log4js from 'log4js'

const logger = Log4js.getLogger()

// https://developers.google.com/youtube/v3/live/docs/liveChatMessages#snippet.type
// TODO: 終了イベント
export type RawLiveChatMessageType =
  | 'textMessageEvent'
  | 'superChatEvent'
  | 'superStickerEvent'

// sample: https://github.com/ChapC/rerun/blob/c6a4f67126945878c068e9544798346372842985/src/YoutubeAPI.ts
export class YouTubeClient implements IYouTubeClient {
  private youtube: youtube_v3.Youtube

  constructor(youTubeApiKey: string) {
    this.youtube = google.youtube({
      version: 'v3',
      auth: youTubeApiKey
    })
  }

  public getLiveChatIdFromVideoId(videoId: string): Promise<string | null> {
    logger.debug('start getLiveChatIdFromVideoId')
    return new Promise((resolve, reject) => {
      this.youtube.videos
        .list(
          {
            id: [videoId],
            part: ['liveStreamingDetails']
          },
          {}
        )
        .then((response: any) => {
          if (response.status !== 200) {
            reject(
              new Error(
                `failed to fetch liveChatId: response.status=${response.status}`
              )
            )
            return
          }
          const responseData: youtube_v3.Schema$VideoListResponse =
            response.data
          if (
            typeof responseData.items === 'undefined' ||
            responseData.items.length === 0
          ) {
            reject(new Error(`responseData has no item`))
            return
          }
          if (
            typeof responseData.items[0].liveStreamingDetails === 'undefined' ||
            typeof responseData.items[0].liveStreamingDetails
              .activeLiveChatId === 'undefined'
          ) {
            reject(new Error(`responseData is invalid`))
            return
          }
          resolve(responseData.items[0].liveStreamingDetails.activeLiveChatId)
        })
    })
  }

  public fetchComments(
    request: LiveChatMessageRequest
  ): Promise<LiveChatMessageResponse> {
    logger.debug('start fetchComments')
    return new Promise((resolve, reject) => {
      this.youtube.liveChatMessages
        .list(
          {
            liveChatId: request.liveChatId,
            part: ['id', 'snippet'],
            hl: 'ja',
            pageToken: request.pageToken || undefined,
            maxResults: request.maxResults || undefined
          },
          {}
        )
        .then((response: any) => {
          if (response.status !== 200) {
            reject(
              new Error(
                `failed to fetch liveChatId: response.status=${response.status}`
              )
            )
          }
          const responseData: youtube_v3.Schema$LiveChatMessageListResponse =
            response.data
          const messageResponse: LiveChatMessageResponse = { messages: [] }
          messageResponse.pageToken = responseData.nextPageToken || undefined
          messageResponse.pollingIntervalMillis =
            responseData.pollingIntervalMillis || undefined
          messageResponse.totalResults =
            responseData.pageInfo?.totalResults || undefined
          messageResponse.resultsPerPage =
            responseData.pageInfo?.resultsPerPage || undefined
          if (
            typeof responseData.items !== 'undefined' &&
            responseData.items.length !== 0
          ) {
            const messages: LiveChatMessage[] = []
            responseData.items.forEach((item) => {
              const message = this.itemToLiveChatMessage(item)
              if (message) {
                messages.push(message)
              }
            })
            messageResponse.messages = messages
          }
          resolve(messageResponse)
        })
    })
  }

  private itemToLiveChatMessage(
    item: youtube_v3.Schema$LiveChatMessage
  ): LiveChatMessage | null {
    switch (item.snippet?.type as RawLiveChatMessageType) {
      case 'textMessageEvent':
        return {
          type: 'Normal',
          message: item.snippet?.textMessageDetails?.messageText || '',
          publishedAt: new Date(item.snippet?.publishedAt || '')
        }
      case 'superChatEvent':
        return {
          type: 'SuperChat',
          message: item.snippet?.superChatDetails?.userComment || '',
          publishedAt: new Date(item.snippet?.publishedAt || ''),
          amountMicros:
            item.snippet?.superChatDetails?.amountMicros || undefined,
          amountDisplayString:
            item.snippet?.superChatDetails?.amountDisplayString || undefined,
          currency: item.snippet?.superChatDetails?.currency || undefined,
          tier: item.snippet?.superChatDetails?.tier || undefined
        }
      case 'superStickerEvent':
        return {
          type: 'SuperSticker',
          // とりあえず代替テキスト
          message:
            item.snippet?.superStickerDetails?.superStickerMetadata?.altText ||
            '',
          publishedAt: new Date(item.snippet?.publishedAt || ''),
          amountMicros:
            item.snippet?.superStickerDetails?.amountMicros || undefined,
          amountDisplayString:
            item.snippet?.superStickerDetails?.amountDisplayString || undefined,
          currency: item.snippet?.superStickerDetails?.currency || undefined,
          tier: item.snippet?.superStickerDetails?.tier || undefined
        }
      default:
        return null
    }
  }
}
