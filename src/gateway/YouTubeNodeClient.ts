import { youtube_v3, google } from 'googleapis'
import {
  IYouTubeClient,
  LiveChatMessage,
  LiveChatMessageResponse,
  LiveChatMessageRequest
} from '../domain/model/IYouTubeClient'
import * as Log4js from 'log4js'
import { YouTubeClientUtils } from './YouTubeClientUtils'

const logger = Log4js.getLogger()

// sample: https://github.com/ChapC/rerun/blob/c6a4f67126945878c068e9544798346372842985/src/YoutubeAPI.ts
export class YouTubeNodeClient implements IYouTubeClient {
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
              const message = YouTubeClientUtils.itemToLiveChatMessage(item)
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

}
