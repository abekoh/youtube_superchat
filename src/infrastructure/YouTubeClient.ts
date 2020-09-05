import { youtube_v3, google } from 'googleapis'

// sample: https://github.com/ChapC/rerun/blob/c6a4f67126945878c068e9544798346372842985/src/YoutubeAPI.ts
export class YouTubeClient {
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
          if (response.status == 200) {
            const responseData: youtube_v3.Schema$VideoListResponse =
              response.data
            if (typeof responseData.items === 'undefined') {
              reject(`responseData is invalid`)
              return
            }
            if (responseData.items.length === 0) {
              reject(`no videos with ID ${videoId}`)
              return
            }
            if (
              typeof responseData.items[0].liveStreamingDetails === 'undefined'
            ) {
              reject(`responseData is invalid`)
              return
            }
            if (
              typeof responseData.items[0].liveStreamingDetails
                .activeLiveChatId === 'undefined'
            ) {
              reject(`activeLiveChatId is undefined`)
            }
            resolve(responseData.items[0].liveStreamingDetails.activeLiveChatId)
          } else {
            reject('failed to fetch id')
          }
        })
    })
  }
}
