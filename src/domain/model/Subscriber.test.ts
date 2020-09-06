import {
  IYouTubeClient,
  LiveChatMessageResponse,
  LiveChatMessageRequest,
} from './IYouTubeClient'
import { Subscriber } from './Subscriber'

class SampleYouTubeClient implements IYouTubeClient {
  async fetchComments(
    request: LiveChatMessageRequest
  ): Promise<LiveChatMessageResponse> {
    return { messages: [], pageToken: '' }
  }

  async getLiveChatIdFromVideoId(videoId: string): Promise<string | null> {
    return ''
  }
}

describe('register', () => {
  test('returns correct liveChatId', async () => {
    const youTubeClientSpy = jest
      .spyOn(SampleYouTubeClient.prototype, 'getLiveChatIdFromVideoId')
      .mockReturnValue(Promise.resolve('liveChatId'))
    const subscriber = new Subscriber(new SampleYouTubeClient())
    const actual = await subscriber.register('videoId')
    expect(youTubeClientSpy).toHaveBeenCalled()
    expect(actual).toBe(true)
  })

  test('returns invalid liveChatId', async () => {
    const youTubeClientSpy = jest
      .spyOn(SampleYouTubeClient.prototype, 'getLiveChatIdFromVideoId')
      .mockReturnValue(Promise.resolve(null))
    const subscriber = new Subscriber(new SampleYouTubeClient())
    const actual = await subscriber.register('videoId')
    expect(youTubeClientSpy).toHaveBeenCalled()
    expect(actual).toBe(false)
  })
})

describe('register', () => {})
