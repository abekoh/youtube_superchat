import {
  IYouTubeClient,
  LiveChatMessage,
  LiveChatMessageRequest,
  LiveChatMessageResponse,
} from '../domain/model/IYouTubeClient'
// import fetch from 'node-fetch'
import { youtube_v3 } from 'googleapis'
import { YouTubeClientUtils } from '../utils/YouTubeClientUtils'

export class YouTubeJsClient implements IYouTubeClient {
  constructor(private youTubeApiKey: string) {}

  public getLiveChatIdFromVideoId(videoId: string): Promise<string | null> {
    return new Promise((resolve, reject) => {
      window
        .fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=liveStreamingDetails&id=${videoId}&key=${this.youTubeApiKey}`
        )
        .then((response) => {
          if (response.status !== 200) {
            reject(
              new Error(
                `failed to fetch liveChatId: videoId=${videoId}, response.status=${response.status}`
              )
            )
          }
          response
            .json()
            .then((responseData: youtube_v3.Schema$VideoListResponse) => {
              if (
                typeof responseData.items === 'undefined' ||
                responseData.items.length === 0
              ) {
                reject(new Error(`responseData has no item`))
                return
              }
              if (
                typeof responseData.items[0].liveStreamingDetails ===
                  'undefined' ||
                typeof responseData.items[0].liveStreamingDetails
                  .activeLiveChatId === 'undefined'
              ) {
                reject(new Error(`responseData is invalid`))
                return
              }
              resolve(
                responseData.items[0].liveStreamingDetails.activeLiveChatId
              )
            })
        })
    })
  }

  public fetchComments(
    request: LiveChatMessageRequest
  ): Promise<LiveChatMessageResponse> {
    let url = `https://www.googleapis.com/youtube/v3/liveChat/messages?liveChatId=${request.liveChatId}&part=id,snippet&hl=ja&maxResults=2000&key=${this.youTubeApiKey}`
    if (request.pageToken) {
      url += `&pageToken=${request.pageToken}`
    }
    if (request.maxResults) {
      url += `&maxResults=${request.maxResults}`
    }
    return new Promise((resolve, reject) => {
      window.fetch(url).then((response) => {
        if (response.status !== 200) {
          reject(
            new Error(
              `failed to fetch liveChatId: response.status=${response.status}`
            )
          )
        }
        response
          .json()
          .then(
            (responseData: youtube_v3.Schema$LiveChatMessageListResponse) => {
              const messageResponse: LiveChatMessageResponse = { messages: [] }
              messageResponse.pageToken =
                responseData.nextPageToken || undefined
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
            }
          )
      })
    })
  }
}
