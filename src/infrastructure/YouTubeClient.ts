import { youtube_v3, google } from 'googleapis'
import {
  IYouTubeClient,
  LiveChatMessage,
  LiveChatMessageReponse,
  LiveChatMessageRequest,
} from '../domain/model/IYouTubeClient'

// sample: https://github.com/ChapC/rerun/blob/c6a4f67126945878c068e9544798346372842985/src/YoutubeAPI.ts
export class YouTubeClient implements IYouTubeClient {
  private youtube: youtube_v3.Youtube
  constructor() {
    this.youtube = google.youtube({
      version: 'v3',
      auth: '',
    })
  }

  public getLiveChatIdFromVideoId(videoId: string): Promise<string | null> {
    return new Promise((resolve, reject) => {
      this.youtube.videos
        .list(
          {
            id: [videoId],
            part: ['liveStreamingDetails'],
          },
          {}
        )
        .then((response: any) => {
          if (response.status === 200) {
            const responseData: youtube_v3.Schema$VideoListResponse =
              response.data
            if (typeof responseData.items === 'undefined') {
              reject(new Error(`responseData is invalid`))
              return
            }
            if (responseData.items.length === 0) {
              reject(new Error(`no videos with ID ${videoId}`))
              return
            }
            if (
              typeof responseData.items[0].liveStreamingDetails === 'undefined'
            ) {
              reject(new Error(`responseData is invalid`))
              return
            }
            if (
              typeof responseData.items[0].liveStreamingDetails
                .activeLiveChatId === 'undefined'
            ) {
              reject(new Error(`activeLiveChatId is undefined`))
            }
            resolve(responseData.items[0].liveStreamingDetails.activeLiveChatId)
          } else {
            reject(new Error('failed to fetch id'))
          }
        })
    })
  }

  public fetchComments(
    request: LiveChatMessageRequest
  ): Promise<LiveChatMessageReponse> {
    return new Promise((resolve, reject) => {
      this.youtube.liveChatMessages
        .list({ liveChatId: request.liveChatId, part: ['id', 'snippet'], pageToken: request.pageToken || undefined }, {})
        .then((response: any) => {
          if (response.status === 200) {
            const responseData: youtube_v3.Schema$LiveChatMessageListResponse =
              response.data
            let nextPageToken: string | null = null
            if (typeof responseData.nextPageToken !== 'undefined') {
              nextPageToken = responseData.nextPageToken
            }
            if (typeof responseData.items === 'undefined') {
              reject(new Error(`responseData is invalid`))
              return
            }
            if (responseData.items.length === 0) {
              reject(new Error(`not found liveChatMessage items`))
              return
            }
            const messages: LiveChatMessage[] = []
            responseData.items.forEach((item) => {
              messages.push({
                message: item.snippet?.textMessageDetails?.messageText || '',
              })
            })
            resolve({ messages: messages, pageToken: nextPageToken })
          } else {
            reject(new Error('failed to fetch id'))
          }
        })
    })
  }
}
