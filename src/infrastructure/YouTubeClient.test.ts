import { YouTubeClient } from './YouTubeClient'

test('youtube', async () => {
  const client = new YouTubeClient()
  const actual = await client.getLiveChatIdFromVideoId('XxqwxFgJa0w')
  expect(actual).toBe('a')
})
